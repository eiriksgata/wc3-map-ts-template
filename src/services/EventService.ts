import { IService, EventListener, GameEvents } from '../types';

/**
 * 事件服务
 * 提供游戏事件的统一管理
 */
export class EventService implements IService {
  public readonly name = 'EventService';
  private listeners: Map<string, EventListener[]> = new Map();
  private initialized = false;

  /**
   * 初始化服务
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    print('>>> Initializing Event Service...');
    this.setupGameEvents();
    this.initialized = true;
    print('>>> Event Service initialized');
  }

  /**
   * 销毁服务
   */
  public destroy(): void {
    this.listeners.clear();
    this.initialized = false;
    print('>>> Event Service destroyed');
  }

  /**
   * 监听事件
   */
  public on<K extends keyof GameEvents>(
    eventType: K,
    listener: EventListener<GameEvents[K]>
  ): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  /**
   * 移除事件监听器
   */
  public off<K extends keyof GameEvents>(
    eventType: K,
    listener: EventListener<GameEvents[K]>
  ): void {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  public emit<K extends keyof GameEvents>(
    eventType: K,
    data: GameEvents[K]
  ): void {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          print(`Error in event listener for ${eventType}: ${error}`);
        }
      });
    }
  }

  /**
   * 设置游戏事件
   */
  private setupGameEvents(): void {
    print('>>> Setting up game event triggers...');
    
    // 这里可以添加具体的游戏事件触发器
    // 由于需要使用具体的魔兽争霸III API，这里留空给用户自定义
    // 用户可以在初始化后通过 emit 方法手动触发事件
    
    // 示例：如何使用定时器事件
    // const timer = CreateTimer();
    // TimerStart(timer, 1.0, true, () => {
    //   this.emit('timer.expired', { timer });
    // });
  }
}