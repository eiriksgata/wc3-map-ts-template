import { Application } from './core';
import { EventService } from './services/EventService';
import { UnitService } from './services/UnitService';
import { mapInit } from './map/start';

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {
  //DisplayTextToPlayer(Player(0), 0, 0, ">>> Application initialized");

  try {
    // 获取应用实例
    const app = Application.getInstance();

    // 注册核心服务
    app.registerService(new EventService());
    app.registerService(new UnitService());

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