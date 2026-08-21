import { gameEvents, SpellEventData } from "src/system/event";
import { GachaPanel } from "src/system/ui/component/GachaPanel";
import { createLogger } from "src/utils/logger";

const log = createLogger("GachaExample");

export function gachaTest():void{
  
  const gacha = GachaPanel.createCentered("抽卡天赋", 1100, 500)
    .setCardSize(300, 350)
    .setDraggable(true);  // 可选：面板可拖拽

  gacha.addCard({
    icon: "ReplaceableTextures\\CommandButtons\\BTNHeroPaladin.blp",
    title: "圣光信仰",
    description: "提高你的治疗效果 20%，\n并在释放技能时有几率恢复生命。",
    onClick: () => {
      log.info("选择了天赋：圣光信仰");
    },
  });

  gacha.addCard({
    icon: "ReplaceableTextures\\CommandButtons\\BTNStormBolt.blp",
    title: "雷霆一击",
    description: "获得一个可以对敌方单位造成伤害并眩晕的主动技能。",
    onClick: () => {
      log.info("选择了天赋：雷霆一击");
    },
  });

  gacha.addCard({
    icon: "ReplaceableTextures\\CommandButtons\\BTNStormBolt.blp",
    title: "雷霆一击",
    description: "获得一个可以对敌方单位造成伤害并眩晕的主动技能。",
    onClick: () => {
      log.info("选择了天赋：雷霆一击");
    },
  });

  // 显示抽卡 UI
  gacha.show();
  gameEvents.onSpellEffect((data: SpellEventData) => {
    //print(`${data.Actor?.name} 释放了 ${data.abilityId} 效果`);
    DisplayTextToPlayer(Player(0), 0, 0, `${data.Actor?.name} 释放了 ${data.abilityId} 效果`);
  })

}