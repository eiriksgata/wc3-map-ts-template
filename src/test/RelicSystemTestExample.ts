import { Players } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import { Actor } from "src/system/actor";
import { RelicSystem } from "src/system/relic";
import { RelicBarUI } from "src/system/ui/component/RelicBarUI";
import { createLogger } from "src/utils/logger";

const log = createLogger("RelicSystemTestExample");

/**
 * 遗物系统测试说明
 *
 * - **数据**：遗物挂在 **单位** 上（`RelicSystem.addRelic(actor, id)`），每个单位一套库存。
 * - **UI**：`RelicBarUI` 只展示「当前关注」的那一个单位的遗物。
 * - **与选中的关系**：默认不会自动跟选中；调用 `RelicBarUI.getInstance().bindFollowLocalSelection()` 后，
 *   本地玩家选中自己的单位时，栏会切到该单位；点空白取消选中时栏会清空。
 *
 * 在 `main()` 里延迟一帧调用 `relicSystemTestExample()` 即可（需已执行 `initialize()` 内的遗物与 UI 初始化）。
 */
export function relicSystemTestExample(): void {
  const owner = Players[0];
  const rs = RelicSystem.getInstance();
  const bar = RelicBarUI.getInstance();

  // 两名本地英雄：A 获得多个遗物，B 无遗物，便于对比
  const heroA = Actor.create(owner, FourCC("Hpal"), -200, 0);
  const heroB = Actor.create(owner, FourCC("Hamg"), 200, 0);
  if (!heroA || !heroB) {
    log.error("创建英雄失败");
    return;
  }

  const relicIds = [
    "burning_blood",
    "war_fang",
    "iron_plate",
    "arcane_grimoire_water",
  ];
  for (const id of relicIds) {
    const ok = rs.addRelic(heroA, id);
    if (ok) {
      log.info(`已为英雄 A 添加遗物: ${id}`);
    } else {
      log.warn(`添加遗物失败（未注册或已达上限）: ${id}`);
    }
  }

  // 选中谁，左上角遗物栏就显示谁的库存（仅本地玩家、且单位归属本地时才会显示）
  bar.bindFollowLocalSelection();

  log.info(
    "请点击选中两名英雄对比遗物栏；点地面取消选中会清空栏。"
  );
}
