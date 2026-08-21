import { UNIT_STATE_ATTACK_BONUS, UNIT_STATE_ATTACK_WHITE } from "@eiriksgata/wc3ts/*";
import { gameEvents, UnitSummonedEventData } from "./event";

export default class SummoningSystem {
  private static instance: SummoningSystem;
  private constructor() {
  }
  public static getInstance(): SummoningSystem {
    if (!SummoningSystem.instance) {
      SummoningSystem.instance = new SummoningSystem();
    }
    return SummoningSystem.instance;
  }


  public init() {
    gameEvents.onUnitSummoned((data: UnitSummonedEventData) => {
      const summoningUnit = data.SummoningUnit;
      const summonedUnit = data.SummonedUnit;
      if (summoningUnit == null || summonedUnit == null) return;
      //检测召唤师是否是英雄单位
      if (summoningUnit.isHero()) {
        //赋予英雄单位属性
        //设置召唤物血量
        summonedUnit.maxLife = summonedUnit.maxLife + summoningUnit.maxLife;
        summonedUnit.life = summonedUnit.maxLife;
        //设置召唤物攻击力
        summonedUnit.setBaseDamageJAPI(summonedUnit.getState(UNIT_STATE_ATTACK_WHITE()) + summoningUnit.getState(UNIT_STATE_ATTACK_WHITE()));
      }
    });
  }

  // 任意单位召唤召唤物时，赋予召唤物属性

}