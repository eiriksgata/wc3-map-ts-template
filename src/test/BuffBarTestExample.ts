import { Players } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import { Actor } from "src/system/actor";
import { BuffBarUI } from "src/system/ui/component/BuffBarUI";
import { createLogger } from "src/utils/logger";

const log = createLogger("BuffBarTestExample");

/**
 * Buff 栏测试：本地英雄加护盾 Buff，选中单位后屏幕中央显示 Buff 图标与剩余时间。
 * 在 `main()` 里延迟调用 `buffBarTestExample()`（需已执行 `initialize()` 内的 TOC 与 BuffBarUI.create）。
 */
export function buffBarTestExample(): void {
  const owner = Players[0];
  const bar = BuffBarUI.getInstance();

  const hero = Actor.create(owner, FourCC("Hpal"), 0, 0);
  if (!hero) {
    log.error("创建英雄失败");
    return;
  }

  hero.addShield(500, 30);

  bar.bindFollowLocalSelection();

  log.info(
    "请选中该英雄查看屏幕中央的 Buff 栏；30s 后护盾 Buff 将按持续时间移除。"
  );
}
