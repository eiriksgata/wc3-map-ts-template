import { Timer, Players } from "@eiriksgata/wc3ts/*";
import { Actor } from "src/system/actor";
import { gameEvents, SpellEventData, UnitDeathEventData } from "src/system/event";
import { FourCC } from "src/utils/helper";
import { createLogger } from "src/utils/logger";

const log = createLogger("UnitEventExample");

export function rgeisterUnitSpellEffectEvent(): void {
  gameEvents.onSpellEffect((data: SpellEventData) => {
    log.info("单位释放了技能: " + data.abilityId);
  });
  gameEvents.onUnitDeath((data: UnitDeathEventData) => {
    const time = Timer.create().start(1, false, () => {
      data.Actor?.revive(0, 0, true);
      data.Actor!.mana = 3000;
      time.destroy();
    });
  });

  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 10; i++) {
      const unit = Actor.create(Players[j], FourCC("Hpal"), 0, 0);
      if (unit == null) continue;
      log.info("创建单位: " + unit.id);

      // 只用 Actor 自定义血条；原生预选条要关掉，否则会叠出第二条。
      unit.setPreselectUIVisible(false);
      unit.createBloodBar();
      unit.setLabel("测试单位");

      unit.addAbility(FourCC("AUfn"));
      unit.addAbility(FourCC("AHwe"));

      unit.maxMana = 3000;
      unit.mana = 3000;
      unit.addShield(1000);
    }
  }
}