import { Unit, tsGlobals } from '../node_modules/wc3ts-1.27a/index';
import { Application } from './core';
import { mapInit } from './map/start';
import { EventService } from './services/EventService';
const { Players } = tsGlobals;
import { c2i } from './utils/helper';

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */

async function main(): Promise<void> {
  try {
    // 获取应用实例
    const app = Application.getInstance();

    // 注册核心服务
    app.registerService(new EventService());
    
    // 初始化应用程序
    await app.initialize();

    DisplayTextToPlayer(Player(0), 0, 0, ">>> Application initialized");

    // 启动地图逻辑
    print('>>> Starting map logic...');
    mapInit(app);
    print('>>> Map logic initialized');

  } catch (error) {
    print(`>>> Failed to start application: ${error}`);
  }


}

// 启动应用程序
main();