import { Timer, bj_RADTODEG } from "@eiriksgata/wc3ts/*";
import { UNIT_TYPE_DEAD, UNIT_TYPE_STRUCTURE } from "src/constants/game/units";
import { easeInOutQuad, lerp, parabolaArc, unitVector2, clamp01 } from "./physics";
import { ensureStormCrowFlyHeight, reapplyStormCrowHeightUnlock, setFlyHeightInt } from "./flyheight";
import { createLogger } from "src/utils/logger";

/** 设为 true 可打印 unitJumpTo 每 tick 的 wantH / GetUnitFlyHeight（排错时用） */
const DEBUG_UNIT_JUMP_TO = false;
const log = createLogger("unitJumpTo");

function dbgUnitJumpTo(msg: string): void {
  if (DEBUG_UNIT_JUMP_TO) log.debug(msg);
}

function unitAlive(u: unit): boolean {
  return !IsUnitType(u, UNIT_TYPE_DEAD) && GetWidgetLife(u) > 0.405;
}

function lockUnit(u: unit): number {
  const savedSpeed = GetUnitMoveSpeed(u);
  PauseUnit(u, true);
  SetUnitPathing(u, false);
  SetUnitMoveSpeed(u, 0);
  return savedSpeed;
}

function unlockUnit(u: unit, savedSpeed: number): void {
  PauseUnit(u, false);
  SetUnitPathing(u, true);
  SetUnitMoveSpeed(u, savedSpeed);
}

/**
 * 带垂直位移时不要 PauseUnit；且不要把移速设为 0：
 * 物编/运行时移速为 0 时，常见现象是 GetUnitFlyHeight 有读数但模型不离地（Hive 等讨论过）。
 * 仅用关碰撞防止乱跑，移速保持原值，由寻路关闭限制位移。
 */
function lockUnitForVerticalMotion(u: unit): number {
  const savedSpeed = GetUnitMoveSpeed(u);
  SetUnitPathing(u, false);
  return savedSpeed;
}

function unlockUnitForVerticalMotion(u: unit, savedSpeed: number): void {
  SetUnitPathing(u, true);
  SetUnitMoveSpeed(u, savedSpeed);
}

/** unitJumpTo 每帧高度采样（SetUnitFlyHeight 之后读取引擎高度） */
export interface UnitJumpHeightTickInfo {
  tickIndex: number;
  /** 归一化时间 0~1 */
  t: number;
  /** 本帧目标高度（base + 抛物线 * maxHeight） */
  wantHeight: number;
  /** GetUnitFlyHeight 读数 */
  actualHeight: number;
}

/**
 * 水平位移 + SetUnitFlyHeight 抛物线。引擎里高度会按日志与 wantH 一致；
 * 若「看起来」像贴地平移，多为俯视角、阴影仍在地面或模型姿态不明显，可加大 jumpMaxHeight 或配合特效/镜头。
 */
export function unitJumpTo(
  target: unit,
  x: number,
  y: number,
  opts?: {
    jumpMaxHeight?: number;
    duration?: number;
    tickInterval?: number;
    flyRate?: number;
    /** 每 tick 回调，便于测试或 UI 显示高度变化 */
    onHeightTick?: (info: UnitJumpHeightTickInfo) => void;
  }
): void {
  if (!unitAlive(target)) return;

  const duration = opts?.duration ?? 0.35;
  const tickInterval = opts?.tickInterval ?? 0.03;
  const maxHeight = opts?.jumpMaxHeight ?? 250;
  /** 由 Timer 逐帧驱动时用 0 瞬时到位；若需引擎平滑爬升可传正数 rate */
  const flyRate = opts?.flyRate ?? 0;
  const onHeightTick = opts?.onHeightTick;

  const savedSpeed = lockUnitForVerticalMotion(target);
  const startX = GetUnitX(target);
  const startY = GetUnitY(target);

  const dir = unitVector2(x - startX, y - startY);
  if (dir.dist > 1e-3) {
    SetUnitFacing(target, Math.atan2(dir.ny, dir.nx) * bj_RADTODEG);
  }

  ensureStormCrowFlyHeight(target, (baseFlyHeight, dispose) => {
    dbgUnitJumpTo(
      `init: baseFlyHeight=${baseFlyHeight} maxHeight=${maxHeight} duration=${duration} tick=${tickInterval} flyRate=${flyRate} ` +
        `start=(${startX},${startY}) end=(${x},${y}) dist=${dir.dist}`
    );

    let ended = false;

    const endSkill = (timer: Timer) => {
      if (ended) return;
      ended = true;
      timer.destroy();
      if (unitAlive(target)) {
        unlockUnitForVerticalMotion(target, savedSpeed);
        SetUnitPosition(target, x, y);
        dbgUnitJumpTo(`end: SetUnitPosition done, GetUnitFlyHeight(after unlock)=${GetUnitFlyHeight(target)}`);
      }
      dispose();
    };

    let elapsed = 0;
    let tickIndex = 0;
    const timer = Timer.create();
    timer.start(tickInterval, true, () => {
      if (!unitAlive(target)) {
        endSkill(timer);
        return;
      }

      elapsed += tickInterval;
      const t = clamp01(elapsed / duration);
      const e = easeInOutQuad(t);
      const arc = parabolaArc(t);
      const wantH = baseFlyHeight + arc * maxHeight;
      const wantHInt = Math.round(wantH);

      SetUnitPosition(target, lerp(startX, x, e), lerp(startY, y, e));
      reapplyStormCrowHeightUnlock(target);
      setFlyHeightInt(target, wantHInt, flyRate);
      tickIndex++;
      const actualH = GetUnitFlyHeight(target);
      if (onHeightTick) {
        onHeightTick({ tickIndex, t, wantHeight: wantHInt, actualHeight: actualH });
      }
      dbgUnitJumpTo(
        `#${tickIndex} t=${t} easeXY=${e} arc=${arc} wantH=${wantHInt} GetUnitFlyHeight=${actualH} savedSpeed=${savedSpeed}`
      );

      if (t >= 1) {
        endSkill(timer);
      }
    });
  });
}

export function unitChargeToPoint(
  target: unit,
  x: number,
  y: number,
  opts?: {
    speed?: number;
    duration?: number;
    tickInterval?: number;
    stopEps?: number;
  }
): void {
  if (!unitAlive(target)) return;

  const tickInterval = opts?.tickInterval ?? 0.03;
  const stopEps = opts?.stopEps ?? 20;

  const startX = GetUnitX(target);
  const startY = GetUnitY(target);
  const dir = unitVector2(x - startX, y - startY);

  if (dir.dist <= stopEps) {
    SetUnitPosition(target, x, y);
    return;
  }

  const savedSpeed = lockUnit(target);

  const speed = opts?.speed ?? 900;
  const duration = opts?.duration ?? dir.dist / speed;
  const timer = Timer.create();

  let elapsed = 0;
  let ended = false;
  const endSkill = () => {
    if (ended) return;
    ended = true;
    timer.destroy();
    if (unitAlive(target)) {
      unlockUnit(target, savedSpeed);
      SetUnitPosition(target, x, y);
    }
  };

  if (dir.dist > 1e-3) {
    SetUnitFacing(target, Math.atan2(dir.ny, dir.nx) * bj_RADTODEG);
  }

  timer.start(tickInterval, true, () => {
    if (!unitAlive(target)) {
      endSkill();
      return;
    }

    elapsed += tickInterval;
    const t = clamp01(elapsed / duration);
    const traveled = dir.dist * t;
    const cx = startX + dir.nx * traveled;
    const cy = startY + dir.ny * traveled;
    SetUnitPosition(target, cx, cy);

    if (t >= 1 || traveled >= dir.dist - stopEps) {
      endSkill();
    }
  });
}

export function unitChargeToUnit(
  target: unit,
  toUnit: unit,
  opts?: {
    speed?: number;
    duration?: number;
    tickInterval?: number;
    stopDist?: number;
    stopEps?: number;
  }
): void {
  if (!unitAlive(target) || !unitAlive(toUnit)) return;

  const tickInterval = opts?.tickInterval ?? 0.03;
  const stopDist = opts?.stopDist ?? 90;
  const stopEps = opts?.stopEps ?? 0.01;

  let savedSpeed = lockUnit(target);

  const speedDefault = opts?.speed ?? 900;

  // 若传了 duration，则用“初始距离 / duration”换算成 speed（目标可能移动，这里是近似）
  const duration =
    opts?.duration ??
    (() => {
      const dx0 = GetUnitX(toUnit) - GetUnitX(target);
      const dy0 = GetUnitY(toUnit) - GetUnitY(target);
      const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
      return dist0 / speedDefault;
    })();
  const dxInit = GetUnitX(toUnit) - GetUnitX(target);
  const dyInit = GetUnitY(toUnit) - GetUnitY(target);
  const distInit = Math.sqrt(dxInit * dxInit + dyInit * dyInit);
  const speed = opts?.speed ?? distInit / Math.max(0.0001, duration);

  let elapsed = 0;
  let ended = false;
  const timer = Timer.create();

  const endSkill = () => {
    if (ended) return;
    ended = true;
    timer.destroy();
    if (unitAlive(target)) {
      unlockUnit(target, savedSpeed);
    }

    // 结束时把单位放到“距离 toUnit 的 stopDist”处（尽量不穿模）
    if (!unitAlive(target) || !unitAlive(toUnit)) return;
    const dx = GetUnitX(toUnit) - GetUnitX(target);
    const dy = GetUnitY(toUnit) - GetUnitY(target);
    const dir = unitVector2(dx, dy);
    if (dir.dist > stopEps) {
      SetUnitPosition(target, GetUnitX(toUnit) - dir.nx * stopDist, GetUnitY(toUnit) - dir.ny * stopDist);
    }
  };

  timer.start(tickInterval, true, () => {
    if (!unitAlive(target) || !unitAlive(toUnit)) {
      endSkill();
      return;
    }

    elapsed += tickInterval;

    const cx = GetUnitX(target);
    const cy = GetUnitY(target);
    const tx = GetUnitX(toUnit);
    const ty = GetUnitY(toUnit);

    const dx = tx - cx;
    const dy = ty - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= stopDist) {
      endSkill();
      return;
    }
    if (dist <= stopEps) {
      endSkill();
      return;
    }

    const dir = unitVector2(dx, dy);
    SetUnitFacing(target, Math.atan2(dir.ny, dir.nx) * bj_RADTODEG);

    const step = speed * tickInterval;
    const moveDist = Math.min(step, dist - stopDist);
    if (moveDist <= stopEps) {
      endSkill();
      return;
    }

    SetUnitPosition(target, cx + dir.nx * moveDist, cy + dir.ny * moveDist);

    // 如果按 duration 已走完，也结束（避免无限追踪）
    if (elapsed >= duration) {
      endSkill();
    }
  });
}

export function unitKnockUp(
  target: unit,
  opts?: {
    maxHeight?: number;
    duration?: number;
    tickInterval?: number;
    flyRate?: number;
    pushDist?: number;
    from?: unit;
    pushDirX?: number;
    pushDirY?: number;
  }
): void {
  if (!unitAlive(target)) return;

  const maxHeight = opts?.maxHeight ?? 180;
  const duration = opts?.duration ?? 0.45;
  const tickInterval = opts?.tickInterval ?? 0.03;
  const flyRate = opts?.flyRate ?? 0;
  const pushDist = opts?.pushDist ?? 0;

  const savedSpeed = lockUnitForVerticalMotion(target);
  const startX = GetUnitX(target);
  const startY = GetUnitY(target);

  let dir = { nx: 0, ny: 0, dist: 0 };
  if (opts?.from && unitAlive(opts.from)) {
    dir = unitVector2(startX - GetUnitX(opts.from), startY - GetUnitY(opts.from));
  } else if (opts?.pushDirX !== undefined && opts?.pushDirY !== undefined) {
    dir = unitVector2(opts.pushDirX, opts.pushDirY);
  }

  if (dir.dist > 1e-3) {
    SetUnitFacing(target, Math.atan2(dir.ny, dir.nx) * bj_RADTODEG);
  }

  ensureStormCrowFlyHeight(target, (baseFlyHeight, dispose) => {
    let ended = false;

    const endSkill = (timer: Timer) => {
      if (ended) return;
      ended = true;
      timer.destroy();
      if (unitAlive(target)) {
        unlockUnitForVerticalMotion(target, savedSpeed);
      }
      dispose();
    };

    let elapsed = 0;
    const timer = Timer.create();
    timer.start(tickInterval, true, () => {
      if (!unitAlive(target)) {
        endSkill(timer);
        return;
      }

      elapsed += tickInterval;
      const t = clamp01(elapsed / duration);
      const e = easeInOutQuad(t);

      const cx = lerp(startX, startX + dir.nx * pushDist, e);
      const cy = lerp(startY, startY + dir.ny * pushDist, e);
      SetUnitPosition(target, cx, cy);
      reapplyStormCrowHeightUnlock(target);
      setFlyHeightInt(target, baseFlyHeight + parabolaArc(t) * maxHeight, flyRate);

      if (t >= 1) {
        // 结束时把单位放到最终位置，避免浮点误差
        SetUnitPosition(target, startX + dir.nx * pushDist, startY + dir.ny * pushDist);
        endSkill(timer);
      }
    });
  });
}

export function casterJumpToAndKnockEnemies(
  caster: unit,
  x: number,
  y: number,
  opts?: {
    jumpMaxHeight?: number;
    jumpDuration?: number;
    tickInterval?: number;
    flyRate?: number;
    knockRadius?: number;
    knockMaxHeight?: number;
    knockDuration?: number;
    knockPushDist?: number;
    knockFlyRate?: number;
  }
): void {
  if (!unitAlive(caster)) return;

  const tickInterval = opts?.tickInterval ?? 0.03;
  const jumpDuration = opts?.jumpDuration ?? 0.35;
  const jumpMaxHeight = opts?.jumpMaxHeight ?? 220;
  const flyRate = opts?.flyRate ?? 0;

  const knockRadius = opts?.knockRadius ?? 350;
  const knockMaxHeight = opts?.knockMaxHeight ?? 220;
  const knockDuration = opts?.knockDuration ?? 0.55;
  const knockPushDist = opts?.knockPushDist ?? 180;
  const knockFlyRate = opts?.knockFlyRate ?? 0;

  const savedSpeed = lockUnitForVerticalMotion(caster);
  const startX = GetUnitX(caster);
  const startY = GetUnitY(caster);
  const dir = unitVector2(x - startX, y - startY);
  if (dir.dist > 1e-3) {
    SetUnitFacing(caster, Math.atan2(dir.ny, dir.nx) * bj_RADTODEG);
  }

  ensureStormCrowFlyHeight(caster, (baseFlyHeight, disposeCaster) => {
    let ended = false;
    const endCasterJump = (timer: Timer) => {
      if (ended) return;
      ended = true;
      timer.destroy();
      if (unitAlive(caster)) {
        unlockUnitForVerticalMotion(caster, savedSpeed);
        SetUnitPosition(caster, x, y);
      }
      disposeCaster();

      // 若施法者中途死亡：不继续落地后扫敌人逻辑
      if (!unitAlive(caster)) return;

      // 落地后：击飞落点周围敌人
      const owner = GetOwningPlayer(caster);
      const g = CreateGroup();
      GroupEnumUnitsInRange(g, x, y, knockRadius, null);
      let u = FirstOfGroup(g);

      while (u != null) {
        // 为避免 while 中在 GroupRemoveUnit 后 FirstOfGroup() 取错，我们用“先移除再取”的写法
        const huX = GetUnitX(u);
        const huY = GetUnitY(u);

        const alive = unitAlive(u);
        const isStructure = IsUnitType(u, UNIT_TYPE_STRUCTURE);
        if (alive && !isStructure && IsUnitEnemy(u, owner)) {
          const v = unitVector2(huX - x, huY - y);
          unitKnockUp(u, {
            maxHeight: knockMaxHeight,
            duration: knockDuration,
            tickInterval,
            flyRate: knockFlyRate,
            pushDist: knockPushDist,
            pushDirX: v.nx,
            pushDirY: v.ny,
          });
        }

        GroupRemoveUnit(g, u);
        u = FirstOfGroup(g);
      }
      DestroyGroup(g);
    };

    let elapsed = 0;
    const timer = Timer.create();
    timer.start(tickInterval, true, () => {
      if (!unitAlive(caster)) {
        endCasterJump(timer);
        return;
      }

      elapsed += tickInterval;
      const t = clamp01(elapsed / jumpDuration);
      const e = easeInOutQuad(t);

      SetUnitPosition(caster, lerp(startX, x, e), lerp(startY, y, e));
      reapplyStormCrowHeightUnlock(caster);
      setFlyHeightInt(caster, baseFlyHeight + parabolaArc(t) * jumpMaxHeight, flyRate);

      if (t >= 1) {
        endCasterJump(timer);
      }
    });
  });
}

