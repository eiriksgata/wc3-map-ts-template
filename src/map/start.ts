import { Application } from '../core';
import { EventService } from '../services/EventService';
import { Unit, MapPlayer } from '../../node_modules/wc3ts-1.27a/index';
import { c2i } from 'src/utils/helper';

/**
 * 地图初始化函数
 * 展示如何使用新的解耦架构
 */
export function mapInit(app: Application): void {
  print('>>> Initializing map components...');

  // 获取服务
  const eventService = app.getService<EventService>('EventService');

  if (!eventService) {
    print('>>> Error: Required services not found');
    return;
  }

  // 设置事件监听
  setupEventListeners(eventService);

  // 初始化地图单位
  initializeMapUnits();

  

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
function initializeMapUnits(): void {
  print('>>> Creating initial units...');

  const localPlayer = GetLocalPlayer();

  // 创建一些演示单位
  const hero = Unit.create(
    MapPlayer.fromIndex(0)!,
    c2i('hpea'), // 农民
    0,
    0,
    270
  );


}