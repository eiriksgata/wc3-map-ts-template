import { Application } from '../core';
import { EventService } from '../services/EventService';
import { UnitService } from '../services/UnitService';

/**
 * 地图初始化函数
 * 展示如何使用新的解耦架构
 */
export function mapInit(app: Application): void {
  print('>>> Initializing map components...');

  // 获取服务
  const eventService = app.getService<EventService>('EventService');
  const unitService = app.getService<UnitService>('UnitService');

  if (!eventService || !unitService) {
    print('>>> Error: Required services not found');
    return;
  }

  // 设置事件监听
  setupEventListeners(eventService);

  // 初始化地图单位
  initializeMapUnits(unitService);

  // 启动演示
  demoGameplay(app);

  print('>>> Map initialization complete');
}

/**
 * 设置事件监听器
 */
function setupEventListeners(eventService: EventService): void {
  print('>>> Setting up event listeners...');

  // 监听单位创建事件
  eventService.on('unit.created', (data) => {
    print(`Unit created for player ${GetPlayerId(data.player)}`);
  });

  // 监听单位死亡事件
  eventService.on('unit.died', (data) => {
    print(`Unit died: ${GetUnitName(data.unit)}`);
    if (data.killer) {
      print(`Killed by: ${GetUnitName(data.killer)}`);
    }
  });

  // 监听玩家离开事件
  eventService.on('player.left', (data) => {
    print(`Player ${GetPlayerId(data.player)} left the game`);
  });
}

/**
 * 初始化地图单位
 */
function initializeMapUnits(unitService: UnitService): void {
  print('>>> Creating initial units...');

  const localPlayer = GetLocalPlayer();
  
  // 创建一些演示单位
  const hero = unitService.createUnit(
    localPlayer,
    'hpea', // 农民
    0,
    0,
    270,
    'demo-hero'
  );

  if (hero) {
    print('>>> Demo hero created successfully');
    
    // 设置单位属性
    unitService.setUnitLife(hero, 500);
    unitService.setUnitMana(hero, 200);
    
    // 输出单位属性
    const life = unitService.getUnitLife(hero);
    const mana = unitService.getUnitMana(hero);
    print(`>>> Hero stats - Life: ${life}, Mana: ${mana}`);
  }
}

/**
 * 演示游戏玩法
 */
function demoGameplay(app: Application): void {
  print('>>> Starting gameplay demo...');

  const config = app.getConfigManager().getConfig();
  
  if (config.debug) {
    print('>>> Debug mode is enabled');
    
    // 在调试模式下添加额外的演示功能
    const unitService = app.getService<UnitService>('UnitService');
    if (unitService) {
      // 创建更多演示单位
      for (let i = 1; i <= 3; i++) {
        const unit = unitService.createUnit(
          GetLocalPlayer(),
          'hfoo', // 步兵
          i * 100,
          i * 100,
          0,
          `debug-unit-${i}`
        );
        
        if (unit) {
          print(`>>> Debug unit ${i} created at (${i * 100}, ${i * 100})`);
        }
      }
    }
  }

  // 显示所有注册的单位
  const unitService = app.getService<UnitService>('UnitService');
  if (unitService) {
    const registeredUnits = unitService.getAllRegisteredUnits();
    print(`>>> Total registered units: ${registeredUnits.size}`);
    
    for (const [key] of registeredUnits) {
      print(`>>> Registered unit: ${key}`);
    }
  }
}