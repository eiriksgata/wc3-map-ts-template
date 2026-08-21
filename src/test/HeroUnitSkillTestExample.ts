import { Unit, Players, Timer } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import { castBlizzardSkill, castRushBarrageSkill } from "src/examples/HeroUnitSkill";
import { Actor } from "src/system/actor";
import { UnitBlood } from "src/system/ui/component/UnitBlood";
import { createLogger } from "src/utils/logger";

const log = createLogger("HeroUnitSkillTest");

export function castBlizzardSkillTest(): void {

  const caster = Unit.create(Players[0], FourCC("Hpal"), 0, 0);
  const target = Unit.create(Players[1], FourCC("Hpal"), 400, 0);
  if (!caster || !target) {
    return;
  }

  Timer.create().start(1, false, () => {
    // 以敌方单位当前坐标为技能中心（非固定 0,0）
    castBlizzardSkill(caster.handle, target.x, target.y, {
      damage: 120,
      radius: 400,
      duration: 3,
      interval: 0.3,
      stormCount: 8,
    });
  });
}

export function castRushBarrageSkillTest() {
  const caster = Unit.create(Players[0], FourCC("Hpal"), 0, 0);
  const target = Unit.create(Players[1], FourCC("Hpal"), 400, 0);
  if (!caster || !target) {
    return;
  }

  // 暴风雪约 3s 结束后测试冲刺猛攻（可删去暴风雪 Timer 单独测本技能）
  Timer.create().start(1, false, () => {
    castRushBarrageSkill(caster.handle, target.handle, {
      hitCount: 10,
      hitInterval: 0.14,
      damagePerHit: 45,
      knockbackDist: 40,
      selfLungeDist: 26,
      standDist: 88,
    });
  });
}


//测试增加护盾
export function testAddShield():void{
  const caster = Actor.create(Players[0], FourCC("Hpal"), 0, 0);
  const target = Actor.create(Players[1], FourCC("Hpal"), 400, 0);
  if (!caster || !target) {
    return;
  }

  // 护盾 UI 依赖本地绘制回调刷新；测试里先开启并创建血条。
  // UnitBlood.registerLocalDrawEvent();
  // caster.createBloodBar();
  // target.createBloodBar();

  caster.addShield(3000);
  target!.addShield(300);

  // 用于快速确认 buff 是否真的加上了（shield 从 0 变大说明逻辑生效）。
  log.info(`casterShield=${caster.shield}, targetShield=${target.shield}`);
}