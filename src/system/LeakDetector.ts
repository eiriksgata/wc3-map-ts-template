/** @noSelfInFile */

import { createLogger } from "src/utils/logger";

const log = createLogger("LeakDetector");

// 句柄类型标识，不限制枚举，方便扩展
type LeakKind = string;

interface LeakRecord {
  kind: LeakKind;
  createdAt: number;
  stack?: string;
}

declare const os: { clock?: () => number } | undefined;
declare const debug:
  | {
      traceback?: (msg?: string, level?: number) => string;
    }
  | undefined;

// Lua 全局表，动态访问各种 CreateX / DestroyX / RemoveX 原生
declare const _G: Record<string, unknown>;

declare function tostring(value: unknown): string;

export class LeakDetector {
  private static installed = false;
  private static enabled = true;
  private static records = new Map<unknown, LeakRecord>();
  /** 上一次 dump 时各类型数量快照，用于计算 (+/-) 变化 */
  private static lastKindCounts: Record<string, number> | null = null;
  /** 是否打印每一个泄露对象的详细信息（默认不开启，只看汇总） */
  private static showDetails = false;

  /**
   * 安装钩子，只需在游戏初始化时调用一次
   */
  public static install(): void {
    if (this.installed) {
      return;
    }
    this.installed = true;

    this.hookTimer();
    this.hookTrigger();

    log.info("已安装句柄跟踪钩子");
  }

  public static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 配置是否在 dump 时打印每一个泄露对象的详细信息
   * 默认 false（只打印类型汇总），需要时可在调试代码里打开：LeakDetector.setShowDetails(true)
   */
  public static setShowDetails(show: boolean): void {
    this.showDetails = show;
  }

  /**
   * 打印当前疑似泄露的对象
   * @param minLifetimeSec 只显示存活时间大于等于该值的对象（秒）
   */
  public static dump(minLifetimeSec = 0): void {
    const now = this.now();
    let count = 0;
    const kindCounts: Record<string, number> = {};

    log.info("|cff00ff00========== LeakDetector Report ==========|r");

    for (const [obj, info] of this.records.entries()) {
      const life = now - info.createdAt;
      if (life < minLifetimeSec) {
        continue;
      }

      // 统计每种类型数量
      kindCounts[info.kind] = (kindCounts[info.kind] ?? 0) + 1;

      count++;

      // 是否输出详细的单个对象信息由配置控制
      if (this.showDetails) {
        log.info(
          string.format(
            "#%d [%s] 存活时间: %.2fs 对象: %s",
            count,
            info.kind,
            life,
            tostring(obj as never),
          ),
        );

        if (info.stack) {
          log.debug(info.stack);
        }
      }
    }

    // 汇总统计（类似：特效:330(-1)，玩家组:19，触发器:472 ...）
    if (Object.keys(kindCounts).length > 0) {
      const parts: string[] = [];
      for (const kind of Object.keys(kindCounts)) {
        const current = kindCounts[kind];
        const prev = this.lastKindCounts?.[kind] ?? 0;
        const diff = current - prev;
        const label = this.kindLabel(kind);

        let part = `${label}:${current}`;
        if (diff !== 0) {
          // %+d 会带符号，例如 +14 / -2
          part += string.format("(%+d)", diff);
        }
        parts.push(part);
      }

      // 固定顺序：按 label 排序，方便对比
      parts.sort();
      log.info(parts.join("，"));

      this.lastKindCounts = kindCounts;
    }

    if (count === 0) {
      log.info(
        string.format(
          "未发现疑似泄露对象（阈值 %.2fs）",
          minLifetimeSec,
        ),
      );
    } else {
      log.info(
        string.format(
          "共发现 %d 个疑似泄露对象（阈值 %.2fs）",
          count,
          minLifetimeSec,
        ),
      );
    }

    log.info("|cff00ff00=========================================|r");
  }

  /** 将内部 kind 映射为更易读的中文标签 */
  private static kindLabel(kind: string): string {
    switch (kind) {
      case "timer":
        return "计时器";
      case "trigger":
        return "触发器";
      case "triggerDialog":
        return "触发器对话框";
      case "timerDialog":
        return "计时器对话框";
      case "group":
        return "单位组";
      case "force":
        return "玩家组";
      case "location":
        return "点";
      case "region":
        return "范围";
      case "unit":
        return "单位";
      case "unitAtLoc":
        return "单位(点)";
      case "corpse":
        return "尸体";
      case "item":
        return "物品";
      case "destructable":
      case "destructableZ":
        return "可破坏物";
      case "fogRect":
        return "矩形区域雾效";
      case "fogRadius":
        return "范围雾效";
      case "texttag":
        return "文本";
      case "effect":
      case "effectTarget":
        return "特效";
      case "hashtable":
        return "哈希表";
      case "sound":
        return "声音";
      case "condition":
        return "触发器条件";
      case "filter":
        return "过滤器";
      default:
        return kind;
    }
  }

  /**
   * 清空当前所有记录（例如在读图/重新开始时）
   */
  public static reset(): void {
    this.records.clear();
  }

  // ======================== 内部实现 ========================

  /**
   * 针对一对 CreateX / DestroyX 或 RemoveX 做通用 Hook
   */
  private static hookHandlePair(
    createName: string,
    destroyName: string,
    kind: LeakKind,
  ): void {
    const createFn = _G[createName] as ((...args: unknown[]) => unknown) | undefined;
    const destroyFn = _G[destroyName] as
      | ((handle: unknown, ...rest: unknown[]) => void)
      | undefined;

    if (typeof createFn !== "function" || typeof destroyFn !== "function") {
      // 对于当前环境不存在的原生，静默跳过
      return;
    }

    const self = this;

    // Hook 创建
    _G[createName] = ((...args: unknown[]): unknown => {
      const handle = createFn(...args);
      if (handle != null) {
        self.registerHandle(handle, kind);
      }
      return handle;
    }) as unknown;

    // Hook 销毁
    _G[destroyName] = ((handle: unknown, ...rest: unknown[]): void => {
      self.unregisterHandle(handle);
      return destroyFn(handle, ...rest);
    }) as unknown;
  }

  /**
   * 安装核心的一批句柄 Hook
   * 常见泄露源：timer / trigger / group / force / point(location) / unit / destructable / item / region / fogModifier / effect / texttag / timerDialog / triggerDialog
   */
  private static hookTimer(): void {
    this.hookHandlePair("CreateTimer", "DestroyTimer", "timer");
  }

  private static hookTrigger(): void {
    // 触发器 / 计时器对话框 / 触发器对话框
    this.hookHandlePair("CreateTrigger", "DestroyTrigger", "trigger");
    this.hookHandlePair("CreateTriggerDialog", "DestroyTriggerDialog", "triggerDialog");
    this.hookHandlePair("CreateTimerDialog", "DestroyTimerDialog", "timerDialog");

    // 单位组 / 力量组
    this.hookHandlePair("CreateGroup", "DestroyGroup", "group");
    this.hookHandlePair("CreateForce", "DestroyForce", "force");

    // 点（Location）/ 区域
    this.hookHandlePair("Location", "RemoveLocation", "location");
    this.hookHandlePair("CreateRegion", "RemoveRegion", "region");

    // 单位（多种创建方式，对应统一的 RemoveUnit）
    this.hookHandlePair("CreateUnit", "RemoveUnit", "unit");
    this.hookHandlePair("CreateUnitAtLoc", "RemoveUnit", "unitAtLoc");
    this.hookHandlePair("CreateCorpse", "RemoveUnit", "corpse");

    // 物品 / 可破坏物
    this.hookHandlePair("CreateItem", "RemoveItem", "item");
    this.hookHandlePair("CreateDestructable", "RemoveDestructable", "destructable");
    this.hookHandlePair("CreateDestructableZ", "RemoveDestructable", "destructableZ");

    // 雾效
    this.hookHandlePair("CreateFogModifierRect", "DestroyFogModifier", "fogRect");
    this.hookHandlePair("CreateFogModifierRadius", "DestroyFogModifier", "fogRadius");

    // 文本 / 特效
    this.hookHandlePair("CreateTextTag", "DestroyTextTag", "texttag");
    this.hookHandlePair("AddSpecialEffect", "DestroyEffect", "effect");
    this.hookHandlePair("AddSpecialEffectTarget", "DestroyEffect", "effectTarget");

    // 哈希表
    this.hookHandlePair("InitHashtable", "DestroyHashtable", "hashtable");

    // 声音
    this.hookHandlePair("CreateSound", "DestroySound", "sound");

    // 触发器条件 / 过滤器（布尔表达式）
    this.hookHandlePair("Condition", "DestroyCondition", "condition");
    this.hookHandlePair("Filter", "DestroyFilter", "filter");
  }

  private static registerHandle(
    handle: unknown,
    kind: LeakKind,
  ): void {
    if (!this.enabled) {
      return;
    }

    const createdAt = this.now();
    const stack = this.captureStack();

    this.records.set(handle, { kind, createdAt, stack });
  }

  private static unregisterHandle(handle: unknown): void {
    if (!this.enabled) {
      return;
    }
    this.records.delete(handle);
  }

  private static now(): number {
    try {
      if (os && typeof os.clock === "function") {
        return os.clock();
      }
    } catch {
      // ignore
    }
    return 0;
  }

  private static captureStack(): string | undefined {
    try {
      if (debug && typeof debug.traceback === "function") {
        // 第二个参数 3：跳过 LeakDetector 自身的几层调用
        return debug.traceback("", 3);
      }
    } catch {
      // ignore
    }
    return undefined;
  }
}

