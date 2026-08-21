/**
 * 单位移动/跳跃/冲刺/击飞相关 API 的本地测试入口。
 * 在 `main.ts` 中按需调用单个 `test*` 函数即可；多个测试若同帧启动会在约 1 秒后同时执行，宜错开或单独测。
 */
import { Players, Timer, Unit } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import {
  casterJumpToAndKnockEnemies,
  unitChargeToPoint,
  unitChargeToUnit,
  unitJumpTo,
  unitKnockUp,
} from "src/unit/skills";
import { createLogger } from "src/utils/logger";

const log = createLogger("UnitMovementSkillsTest");

/** 在指定点创建单位，供本文件各测试复用。 */
function safeCreate(owner: number, unitTypeId: number, x: number, y: number): Unit | undefined {
  const p = Players[owner];
  if (!p) return undefined;
  return Unit.create(p, unitTypeId, x, y);
}

/**
 * 测试「跳跃位移」`unitJumpTo`：水平插值 + 飞行高度抛物线（需风暴乌鸦解锁链，见 `flyheight.ts`）。
 * 延迟 1 秒后执行；1 号玩家圣骑士从 (0,0) 跳到 (500,500)，带 `jumpMaxHeight` / `duration`。
 */
export function testUnitJumpToSkill(): void {
  log.info("开始：创建单位…");
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  if (!caster) {
    log.error("失败：Players[0] 或 Unit.create 未成功");
    return;
  }

  Timer.create().start(1, false, () => {
    log.info("1s 后调用 unitJumpTo（以下为每 tick 高度）");
    unitJumpTo(caster.handle, 500, 500, {
      jumpMaxHeight: 200,
      duration: 1
    });
  });
}

/**
 * 测试「冲向固定点」`unitChargeToPoint`：纯地面位移，不改 `SetUnitFlyHeight`。
 * 延迟 1 秒后执行；1 号玩家单位从 (0,0) 沿直线冲向 (500,0)。
 */
export function testUnitChargeToPointSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  if (!caster) return;

  Timer.create().start(1, false, () => {
    unitChargeToPoint(caster.handle, 500, 0, {
      speed: 1000,
    });
  });
}

/**
 * 测试「追向目标单位」`unitChargeToUnit`：追踪移动至与目标相距 `stopDist`，纯地面、无高度变化。
 * 延迟 1 秒后执行；0 号玩家追击 1 号玩家英雄，停在约 90 距离处。
 */
export function testUnitChargeToUnitSkill(): void {
  const charger = safeCreate(0, FourCC("Hpal"), 0, 0);
  const target = safeCreate(1, FourCC("Hpal"), 450, 0);
  if (!charger || !target) return;

  Timer.create().start(1, false, () => {
    unitChargeToUnit(charger.handle, target.handle, {
      speed: 900,
      stopDist: 90,
    });
  });
}

/**
 * 测试「击飞」`unitKnockUp`：抛物线高度 + 可选水平推开，与跳跃共用飞行高度管线。
 * 延迟 1 秒后执行；以 `from` 决定推开方向，击飞 1 号玩家目标单位。
 */
export function testUnitKnockUpSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  const target = safeCreate(1, FourCC("Hpal"), 350, 0);
  if (!caster || !target) return;

  Timer.create().start(1, false, () => {
    // from=caster：击飞的水平推开方向尽量从 caster 指向相反侧
    unitKnockUp(target.handle, {
      from: caster.handle,
      maxHeight: 200,
      pushDist: 180,
      duration: 0.5,
    });
  });
}

/**
 * 测试「施法者起跳落地 + 范围击飞」`casterJumpToAndKnockEnemies`：
 * 先完成施法者带高度的跳跃，落地后以落点为圆心击飞敌方非建筑单位（内部再调 `unitKnockUp`）。
 * 延迟 1 秒后执行；含两名敌方英雄与一座建筑用于验证过滤。
 */
export function testCasterJumpAndKnockEnemiesSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  const enemy1 = safeCreate(1, FourCC("Hpal"), 380, 0);
  const enemy2 = safeCreate(1, FourCC("Hpal"), 320, 220);
  const enemyBuilding = safeCreate(1, FourCC("hbar"), 420, 180); // 作为“建筑过滤”用
  if (!caster || !enemy1 || !enemy2 || !enemyBuilding) return;

  Timer.create().start(1, false, () => {
    casterJumpToAndKnockEnemies(caster.handle, 300, 80, {
      jumpMaxHeight: 240,
      jumpDuration: 0.5,
      knockRadius: 360,
      knockMaxHeight: 220,
      knockPushDist: 200,
    });
  });
}

