import { Players, Timer } from "@eiriksgata/wc3ts/*";
import { Actor } from "src/system/actor";
import { EffectEx } from "src/system/EffectEx";
import { FourCC } from "src/utils/helper";
import { createLogger } from "src/utils/logger";

const log = createLogger("EffectExTest");

/**
 * EffectEx 测试：
 * 1) 创建牛头酋长（Otch）
 * 2) 创建冲击波（Shockwave）特效
 * 3) 让特效沿圆轨迹移动，并实时改变面向（切线方向）
 */
export function shockwaveEffectCircleTest(): void {
  const owner = Players[0];
  const hero = Actor.create(owner, FourCC("Otch"), 0, 0);
  if (!hero) {
    log.error("创建牛头酋长失败");
    return;
  }

  // 冲击波导弹模型（牛头酋长技能常用视觉）
  const model = "Abilities\\Spells\\Orc\\Shockwave\\ShockwaveMissile.mdl";
  const centerX = hero.x;
  const centerY = hero.y;
  const radius = 420;
  const z = 90;
  const duration = 12.0;
  const interval = 0.03;
  const angularSpeed = 1.6; // 弧度/秒

  let theta = 0;
  let elapsed = 0;

  const startX = centerX + radius;
  const startY = centerY;
  const fx = EffectEx.create(model, startX, startY, z);
  if (!fx) {
    log.error("创建冲击波特效失败");
    return;
  }

  const t = Timer.create();
  t.start(interval, true, () => {
    elapsed += interval;
    theta += angularSpeed * interval;

    const x = centerX + math.cos(theta) * radius;
    const y = centerY + math.sin(theta) * radius;
    fx.setXY(x, y).setZ(z);

    // 面向圆轨迹切线方向：theta + 90°（PI/2）
    const facingRad = theta + math.pi / 2;
    fx.faceByRadians(facingRad);

    if (elapsed >= duration) {
      t.destroy();
      fx.destroy();
      log.info("冲击波圆轨迹测试结束");
    }
  });

  log.info("已启动：冲击波特效沿圆轨迹移动并更新面向");
}

