import { FourCC } from "src/utils/helper";
import { UNIT_TYPE_DEAD } from "src/constants/game/units";
import { createLogger } from "src/utils/logger";

const STORM_CROW_ABILITY = FourCC("Arav");

/** 设为 true 可打印解锁前后 GetUnitFlyHeight（排错时用） */
const DEBUG_FLY_HEIGHT = false;
const log = createLogger("flyheight");

function dbgFlyHeight(msg: string): void {
  if (DEBUG_FLY_HEIGHT) log.debug(msg);
}

function isUnitAlive(u: unit): boolean {
  // 复用你项目里常用的“单位不死 + 生命值足够”判定
  return !IsUnitType(u, UNIT_TYPE_DEAD) && GetWidgetLife(u) > 0.405;
}

/**
 * 以“风暴乌鸦形态（Arav）”解锁地面单位的 SetUnitFlyHeight（常见写法见 Hive 等教程）：
 * - 先 UnitAddAbility(Arav) 再立刻 UnitRemoveAbility(Arav)，用于“解锁”高度修改
 * - 不要长期保留 Arav：仅添加不移除时，部分单位/环境下高度仍不生效
 * - 正常流程：执行 fn，由调用方在每帧 SetUnitFlyHeight；结束时必须调用 dispose() 把高度恢复为 baseFlyHeight
 *
 * 关于「不设置高度」的唯一分支：
 * - 下面 if (!isUnitAlive(u)) 仅表示「当前单位已死或生命过低」，不是「解锁失败」。
 * - 解锁成功与否这里没有单独判断；只要还活着，就会进入 fn 去设置高度。
 * - 已死单位不调用 fn：不对尸体做跳跃/击飞高度动画；仍会 dispose() 一次，尽量把高度写回基准（尸体上是否可见由引擎决定）。
 */
export function ensureStormCrowFlyHeight(
  u: unit,
  fn: (baseFlyHeight: number, dispose: () => void) => void
): void {
  const baseBefore = GetUnitFlyHeight(u);
  dbgFlyHeight(`before unlock: GetUnitFlyHeight=${baseBefore}`);

  UnitAddAbility(u, STORM_CROW_ABILITY);
  UnitRemoveAbility(u, STORM_CROW_ABILITY);

  const afterUnlock = GetUnitFlyHeight(u);
  dbgFlyHeight(`after Arav add+remove: GetUnitFlyHeight=${afterUnlock}`);

  /** 抛物线起算的基准高度：用解锁前的值，与 afterUnlock 无关（解锁可能短暂改变读数） */
  const baseFlyHeight = baseBefore;

  const dispose = () => {
    // 尽量恢复为进入本函数时记录的高度；死单位也会调用，效果因引擎而异。
    SetUnitFlyHeight(u, Math.round(baseFlyHeight), 0);
  };

  if (!isUnitAlive(u)) {
    dispose();
    return;
  }

  fn(baseFlyHeight, dispose);
}

/**
 * 在「本帧已经 SetUnitPosition」之后调用：部分环境下位移会抵消乌鸦解锁状态，
 * 再执行一次加/删 Arav，下一帧 SetUnitFlyHeight 才作用到模型。
 */
export function reapplyStormCrowHeightUnlock(u: unit): void {
  UnitAddAbility(u, STORM_CROW_ABILITY);
  UnitRemoveAbility(u, STORM_CROW_ABILITY);
}

/**
 * 小封装：设置飞行高度（相当于 SetUnitFlyHeight）
 */
export function setFlyHeight(u: unit, height: number, rate: number): void {
  SetUnitFlyHeight(u, height, rate);
}

/**
 * 高度先四舍五入为整数再 SetUnitFlyHeight。
 * 引擎本身支持 real，小数并非失败原因；取整仅为减少浮点尾数、与物编里常见整数习惯一致。
 */
export function setFlyHeightInt(u: unit, height: number, rate: number): void {
  SetUnitFlyHeight(u, Math.round(height), rate);
}

