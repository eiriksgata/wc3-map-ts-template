import { UNIT_TYPE_HERO } from "src/constants/game/units";
import { FourCC } from "src/utils/helper";
import { Actor } from "src/system/actor";
import { RelicDefinition } from "../types";

/** Common.j 原生英雄力量接口（在部分环境下比 Blizzard.j 包装更稳） */
declare function GetHeroStr(whichHero: unit, includeBonuses: boolean): number;
declare function SetHeroStr(
  whichHero: unit,
  newStr: number,
  permanent: boolean
): void;

/** 物品类「攻击伤害加成」技能（默认数据一般为每级 +1 伤害，具体以物编为准） */
const AB_ITEM_DAMAGE_BONUS = FourCC("AIat");

function isHero(u: unit): boolean {
  return IsUnitType(u, UNIT_TYPE_HERO);
}

function addHeroStrength(u: unit, delta: number): void {
  const current = GetHeroStr(u, false);
  SetHeroStr(u, current + delta, true);
}

function removeHeroStrength(u: unit, delta: number): void {
  const current = GetHeroStr(u, false);
  SetHeroStr(u, math.max(1, current - delta), true);
}

/** +攻击力遗物：对英雄使用 +5 力量（近战主属性英雄每点力量 +1 近战攻击）；非英雄则叠物品加攻技能 */
export const WAR_FANG_ATTACK_BONUS = 5;
export const warFangDefinition: RelicDefinition = {
  id: "war_fang",
  name: "战鬼之牙",
  description:
    "永久增加 5 点力量（英雄）。近战英雄每点力量额外增加 1 点近战攻击力。",
  icon: "ReplaceableTextures\\CommandButtons\\BTNClawsOfAttack.blp",
  rarity: "rare",
  maxStacks: 1,
  onAcquire(actor: Actor): void {
    const u = actor.handle;
    if (isHero(u)) {
      addHeroStrength(u, WAR_FANG_ATTACK_BONUS);
      return;
    }
    actor.addAbility(AB_ITEM_DAMAGE_BONUS);
    actor.setAbilityLevel(AB_ITEM_DAMAGE_BONUS, WAR_FANG_ATTACK_BONUS);
  },
  onRemove(actor: Actor, stacks: number): void {
    const u = actor.handle;
    const n = WAR_FANG_ATTACK_BONUS * stacks;
    if (isHero(u)) {
      removeHeroStrength(u, n);
      return;
    }
    actor.removeAbility(AB_ITEM_DAMAGE_BONUS);
  },
};