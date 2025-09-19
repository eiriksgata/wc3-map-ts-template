import { Unit, tsGlobals, RuntimeManager } from '../node_modules/wc3ts-1.27a/index';
const { Players } = tsGlobals;
import { c2i } from './utils/helper';

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */


async function main(): Promise<void> {
  try {
    RuntimeManager.getInstance().initialize();
    DisplayTextToPlayer(Player(0), 0, 0, "Hello, Warcraft III with TypeScript and wc3ts!");
    Unit.create(Players[0], c2i('hpea'), 0, 0, 0);
    print(">>> Application started");
  } catch (e) {
    console.error("Error during application startup:", e);
  }



}

// 启动应用程序
main();