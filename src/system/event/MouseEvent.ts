/**
 * 鼠标事件管理器
 * 基于 EventEmitter 实现的鼠标事件订阅系统
 * 
 * 设计原则：
 * 1. 只创建一次原生 JAPI 事件，由 Lua 引擎负责分发
 * 2. 支持订阅/取消订阅模式
 * 3. 支持优先级和一次性订阅
 */

import { EventEmitter, EventHandler, SubscribeOptions } from "./EventEmitter";
import { createLogger } from "src/utils/logger";

const log = createLogger("MouseEventManager");

/**
 * 鼠标按键类型
 * btn: 1=左键, 2=右键
 */
export const enum MouseButton {
  LEFT = 1,
  RIGHT = 2,
}

/**
 * 鼠标事件类型
 */
export const enum MouseEventType {
  /** 鼠标按下 */
  DOWN = "mouse:down",
  /** 鼠标抬起 */
  UP = "mouse:up",
  /** 鼠标移动 */
  MOVE = "mouse:move",
  /** 鼠标滚轮 */
  WHEEL = "mouse:wheel",
}

/**
 * 鼠标事件数据
 */
export interface MouseEventData {
  /** 鼠标按键（对于滚轮事件可能为 0） */
  button: MouseButton | number;
  /** 屏幕 X 坐标 */
  screenX: number;
  /** 屏幕 Y 坐标 */
  screenY: number;
  /** 地形 X 坐标 */
  terrainX: number;
  /** 地形 Y 坐标 */
  terrainY: number;
  /** 滚轮增量（仅滚轮事件有效） */
  wheelDelta?: number;
  /** 是否在 UI 上 */
  isOverUI: boolean;
  /** 事件类型 */
  type: MouseEventType;
}

/**
 * 鼠标事件处理器
 */
export type MouseEventHandler = EventHandler<MouseEventData>;

/**
 * 鼠标事件管理器
 * 负责管理所有鼠标相关事件的订阅和分发
 */
export class MouseEventManager extends EventEmitter {
  private static instance: MouseEventManager | undefined;
  
  /** 是否已初始化原生事件 */
  private initialized: boolean = false;
  
  /** 原生触发器（保持引用防止被回收） */
  private nativeTriggers: trigger[] = [];
  
  private constructor() {
    super("MouseEventManager");
  }
  
  /**
   * 获取鼠标事件管理器实例
   */
  public static getInstance(): MouseEventManager {
    if (!MouseEventManager.instance) {
      MouseEventManager.instance = new MouseEventManager();
    }
    return MouseEventManager.instance;
  }
  
  /**
   * 初始化原生事件
   * 只需调用一次，后续所有订阅都通过 Lua 分发
   */
  public initialize(): void {
    if (this.initialized) return;
    
    // 注册鼠标按钮事件（左键、右键）
    // btn: 1=左键, 2=右键
    // status: 1=按下, 2=松开
    this.registerMouseButtonEvent(MouseButton.LEFT, true);   // 左键按下
    this.registerMouseButtonEvent(MouseButton.LEFT, false);  // 左键松开
    this.registerMouseButtonEvent(MouseButton.RIGHT, true);  // 右键按下
    this.registerMouseButtonEvent(MouseButton.RIGHT, false); // 右键松开
    
    // 注册鼠标移动事件
    this.registerMouseMoveEvent();
    
    // 注册鼠标滚轮事件
    this.registerMouseWheelEvent();
    
    this.initialized = true;
    log.info("初始化完成");
  }
  
  /**
   * 注册鼠标按钮事件
   * @param button 鼠标按键 (1=左键, 2=右键)
   * @param isDown 是否按下事件 (true=按下, false=松开)
   */
  private registerMouseButtonEvent(button: MouseButton, isDown: boolean): void {
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    const eventType = isDown ? MouseEventType.DOWN : MouseEventType.UP;
    // DzTriggerRegisterMouseEventByCode(trig, btn, status, sync, callback)
    // btn: 1=左键, 2=右键
    // status: 1=按下, 0=松开
    DzTriggerRegisterMouseEventByCode(
      trig,
      button,          // btn: 1=左键, 2=右键
      isDown ? 1 : 0,  // status: 1=按下, 0=松开
      false,
      () => {
        const data = this.createMouseEventData(button, eventType);
        this.emit(eventType, data);
        
        // 同时发射带按键的具体事件
        this.emit(`${eventType}:${button}`, data);
      }
    );
  }
  
  /**
   * 注册鼠标移动事件
   */
  private registerMouseMoveEvent(): void {
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    DzTriggerRegisterMouseMoveEventByCode(
      trig,
      false,
      () => {
        const data = this.createMouseEventData(0, MouseEventType.MOVE);
        this.emit(MouseEventType.MOVE, data);
      }
    );
  }
  
  /**
   * 注册鼠标滚轮事件
   */
  private registerMouseWheelEvent(): void {
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    DzTriggerRegisterMouseWheelEventByCode(
      trig,
      false,
      () => {
        const data = this.createMouseEventData(0, MouseEventType.WHEEL);
        data.wheelDelta = DzGetWheelDelta();
        this.emit(MouseEventType.WHEEL, data);
      }
    );
  }
  
  /**
   * 创建鼠标事件数据
   */
  private createMouseEventData(button: MouseButton | number, type: MouseEventType): MouseEventData {
    return {
      button,
      screenX: DzGetMouseX(),
      screenY: DzGetMouseY(),
      terrainX: DzGetMouseTerrainX(),
      terrainY: DzGetMouseTerrainY(),
      isOverUI: DzIsMouseOverUI(),
      type,
    };
  }
  
  // =====================
  // 便捷订阅方法
  // =====================
  
  /**
   * 订阅鼠标按下事件
   * @param handler 事件处理器
   * @param button 指定按键（可选，不传则接收所有按键）
   * @param options 订阅选项
   */
  public onMouseDown(
    handler: MouseEventHandler,
    button?: MouseButton,
    options?: SubscribeOptions
  ): number {
    const eventName = button 
      ? `${MouseEventType.DOWN}:${button}` 
      : MouseEventType.DOWN;
    return this.on(eventName, handler, options);
  }
  
  /**
   * 订阅鼠标抬起事件
   * @param handler 事件处理器
   * @param button 指定按键（可选）
   * @param options 订阅选项
   */
  public onMouseUp(
    handler: MouseEventHandler,
    button?: MouseButton,
    options?: SubscribeOptions
  ): number {
    const eventName = button 
      ? `${MouseEventType.UP}:${button}` 
      : MouseEventType.UP;
    return this.on(eventName, handler, options);
  }
  
  /**
   * 订阅鼠标移动事件
   * @param handler 事件处理器
   * @param options 订阅选项
   */
  public onMouseMove(
    handler: MouseEventHandler,
    options?: SubscribeOptions
  ): number {
    return this.on(MouseEventType.MOVE, handler, options);
  }
  
  /**
   * 订阅鼠标滚轮事件
   * @param handler 事件处理器
   * @param options 订阅选项
   */
  public onMouseWheel(
    handler: MouseEventHandler,
    options?: SubscribeOptions
  ): number {
    return this.on(MouseEventType.WHEEL, handler, options);
  }
  
  /**
   * 获取当前鼠标位置
   */
  public getMousePosition(): { screenX: number; screenY: number; terrainX: number; terrainY: number } {
    return {
      screenX: DzGetMouseX(),
      screenY: DzGetMouseY(),
      terrainX: DzGetMouseTerrainX(),
      terrainY: DzGetMouseTerrainY(),
    };
  }
  
  /**
   * 检查鼠标是否在 UI 上
   */
  public isMouseOverUI(): boolean {
    return DzIsMouseOverUI();
  }
  
  /**
   * 销毁管理器
   */
  public override destroy(): void {
    super.destroy();
    
    // 清理原生触发器
    for (const trig of this.nativeTriggers) {
      DestroyTrigger(trig);
    }
    this.nativeTriggers = [];
    this.initialized = false;
  }
}

/**
 * 快捷访问鼠标事件管理器
 */
export const mouseEvents = MouseEventManager.getInstance();
