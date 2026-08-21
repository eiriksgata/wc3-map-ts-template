import { Players, Timer } from "@eiriksgata/wc3ts/*";
import { Actor } from "src/system/actor";
import { SpellCardBulletSystem, SpellCardId } from "src/system/bullethell";
import { FourCC } from "src/utils/helper";
import { createLogger } from "src/utils/logger";

const log = createLogger("BulletHellTest");

function getDefaultSpellCardOptions(cardId: SpellCardId): {
  duration: number;
  emissionInterval: number;
  baseSpeed: number;
  bulletLife: number;
  bulletRadius: number;
  bulletDamage: number;
} {
  if (cardId === SpellCardId.DUAL_SPIRAL) {
    return {
      duration: 7,
      emissionInterval: 0.05,
      baseSpeed: 640,
      bulletLife: 3.5,
      bulletRadius: 85,
      bulletDamage: 10,
    };
  }

  if (cardId === SpellCardId.FAN_PULSE) {
    return {
      duration: 7,
      emissionInterval: 0.09,
      baseSpeed: 700,
      bulletLife: 2.8,
      bulletRadius: 95,
      bulletDamage: 14,
    };
  }

  if (cardId === SpellCardId.ROSE_BLOOM) {
    return {
      duration: 7,
      emissionInterval: 0.09,
      baseSpeed: 610,
      bulletLife: 3.4,
      bulletRadius: 88,
      bulletDamage: 11,
    };
  }

  if (cardId === SpellCardId.ECHO_FAN) {
    return {
      duration: 7,
      emissionInterval: 0.08,
      baseSpeed: 680,
      bulletLife: 3,
      bulletRadius: 92,
      bulletDamage: 13,
    };
  }

  if (cardId === SpellCardId.LATTICE_SPIN) {
    return {
      duration: 7,
      emissionInterval: 0.06,
      baseSpeed: 650,
      bulletLife: 3.1,
      bulletRadius: 82,
      bulletDamage: 12,
    };
  }

  return {
    duration: 7,
    emissionInterval: 0.08,
    baseSpeed: 600,
    bulletLife: 3.3,
    bulletRadius: 90,
    bulletDamage: 12,
  };
}

/**
 * 弹幕压测入口：
 * 1. 创建巫妖单位
 * 2. 依次释放 6 张符卡（每张 7 秒）
 * 3. 每 2 秒打印一次统计，便于观察 200~300 并发下的稳定性
 */
export function runSpellCardBulletHellTest(): void {
  const caster = Actor.create(Players[0], FourCC("Ulic"), 0, 0, 0);

  //创建两个敌人单位
  Actor.create(Players[1], FourCC("Ulic"), 700, 0, 270);
  Actor.create(Players[1], FourCC("Ulic"), -700, 700, 90);

  if (!caster) {
    log.error("创建巫妖失败");
    return;
  }

  const system = SpellCardBulletSystem.getInstance();
  system.initialize({
    maxBullets: 320,
    collisionChecksPerTick: 84,
    collisionTickStride: 2,
  });

  const cards: SpellCardId[] = [
    SpellCardId.RING_BURST,
    SpellCardId.DUAL_SPIRAL,
    SpellCardId.FAN_PULSE,
    SpellCardId.ROSE_BLOOM,
    SpellCardId.ECHO_FAN,
    SpellCardId.LATTICE_SPIN,
  ];

  const startDelay = 7.2;
  for (let i = 0; i < cards.length; i++) {
    const cardId = cards[i];
    const options = getDefaultSpellCardOptions(cardId);

    if (i === 0) {
      system.startCardFromCaster(caster.handle, cardId, options);
      continue;
    }

    Timer.create().start(startDelay * i, false, () => {
      system.startCardFromCaster(caster.handle, cardId, options);
    });
  }

  const statTimer = Timer.create();
  statTimer.start(2, true, () => {
    const s = system.getStats();
    log.info(
      `active=${s.activeBullets}, emitters=${s.activeEmitters}, spawned=${s.totalSpawned}, dropped=${s.totalDropped}, recycled=${s.totalRecycled}, hit=${s.totalHit}`
    );

    if (s.activeEmitters <= 0 && s.activeBullets <= 0) {
      statTimer.destroy();
      log.info("全部符卡结束");
    }
  });
}

/**
 * 直接对任意单位释放符卡（你需求里的主入口）。
 */
export function castSpellCardFromUnit(caster: unit, cardId: SpellCardId): number | undefined {
  const system = SpellCardBulletSystem.getInstance();
  system.initialize();

  return system.startCardFromCaster(caster, cardId, getDefaultSpellCardOptions(cardId));
}
