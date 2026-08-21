import { Frame, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { ConfigManager } from "./config";
import { PlayersConfig } from "./config/Players";
import { MapGeneral } from "./config/Map";
import { mouseEvents } from "./system/event";
import DamageSystem from "./system/damage";
import { BuffSystem } from "./system/buff";
import ShieldSystem from "./system/ShieldSystem";
import SummoningSystem from "./system/SummoningSystem";
import { UnitBlood } from "./system/ui/component/UnitBlood";
import { registerDefaultRelicsAndPools } from "./system/relic";
import { BuffBarUI } from "./system/ui/component/BuffBarUI";
import { RelicBarUI } from "./system/ui/component/RelicBarUI";
import { relicSystemTestExample } from "./test/RelicSystemTestExample";
import { buffBarTestExample } from "./test/BuffBarTestExample";
import { runSpellCardBulletHellTest } from "./test/BulletHellTestExample";
import { testAddShield } from "./test/HeroUnitSkillTestExample";
import { createLogger } from "./utils/logger";

const log = createLogger("Main");

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
function main(): void {
  PanCameraToTimed(200, 0, 0);
  if (!ConfigManager.getInstance().isDebugMode()) {
    return;
  }
  Timer.create().start(0.01, false, () => {
    testAddShield();
    relicSystemTestExample();
    buffBarTestExample();
    runSpellCardBulletHellTest();
  });
}

/**
 * 初始化函数 - 供模块化加载使用
 */
export function initialize(): void {
  ydlua.getInstance().initialize();

  try {
    Frame.loadTOC("resource\\fdf\\path.toc");
    log.info("FDF TOC loaded successfully");
  } catch (e) {
    log.error(`loading FDF TOC: ${e}`);
  }

  registerDefaultRelicsAndPools();
  RelicBarUI.getInstance().create();
  BuffBarUI.getInstance().create();

  PlayersConfig.CameraControl();
  UnitBlood.registerLocalDrawEvent();

  MapGeneral.sceneVisionInit();

  DzEnableWideScreen(true);

  mouseEvents.initialize();
  DzToggleFPS(true);

  DzFrameUnlockMouseRectLimit(true);

  SummoningSystem.getInstance().init();
  DamageSystem.getInstance().initialize();
  BuffSystem.getInstance().init();
  ShieldSystem.getInstance().init();

  main();
}

/**
 * 热重载处理函数
 * 当模块被热重载时调用
 */
export function onHotReload(): void {
  log.info("module hot reloaded");
}
