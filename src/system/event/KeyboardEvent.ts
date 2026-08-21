/**
 * 键盘事件管理器
 * 基于 EventEmitter 实现的键盘事件订阅系统
 */

import { EventEmitter, EventHandler, SubscribeOptions } from "./EventEmitter";
import { createLogger } from "src/utils/logger";

const log = createLogger("KeyboardEventManager");

/**
 * 键盘事件类型
 */
export const enum KeyEventType {
  /** 按键按下 */
  DOWN = "key:down",
  /** 按键抬起 */
  UP = "key:up",
}

/**
 * 键盘事件数据
 */
export interface KeyEventData {
  /** 按键代码 */
  keyCode: number;
  /** 事件类型 */
  type: KeyEventType;
  /** 元数据（由 JAPI 返回） */
  metaKey?: number;
}

/**
 * 键盘事件处理器
 */
export type KeyEventHandler = EventHandler<KeyEventData>;

/**
 * 常用按键代码（OSKEYTYPE）
 */
export const KeyCode = {
  // 功能键
  ESCAPE: 0x1B,
  BACKSPACE: 0x08,
  TAB: 0x09,
  ENTER: 0x0D,
  SHIFT: 0x10,
  CTRL: 0x11,
  ALT: 0x12,
  PAUSE: 0x13,
  CAPSLOCK: 0x14,
  SPACE: 0x20,
  
  // 方向键
  LEFT: 0x25,
  UP: 0x26,
  RIGHT: 0x27,
  DOWN: 0x28,
  
  // 数字键 (主键盘)
  KEY_0: 0x30,
  KEY_1: 0x31,
  KEY_2: 0x32,
  KEY_3: 0x33,
  KEY_4: 0x34,
  KEY_5: 0x35,
  KEY_6: 0x36,
  KEY_7: 0x37,
  KEY_8: 0x38,
  KEY_9: 0x39,
  
  // 字母键
  A: 0x41, B: 0x42, C: 0x43, D: 0x44, E: 0x45,
  F: 0x46, G: 0x47, H: 0x48, I: 0x49, J: 0x4A,
  K: 0x4B, L: 0x4C, M: 0x4D, N: 0x4E, O: 0x4F,
  P: 0x50, Q: 0x51, R: 0x52, S: 0x53, T: 0x54,
  U: 0x55, V: 0x56, W: 0x57, X: 0x58, Y: 0x59,
  Z: 0x5A,
  
  // 功能键 F1-F12
  F1: 0x70, F2: 0x71, F3: 0x72, F4: 0x73,
  F5: 0x74, F6: 0x75, F7: 0x76, F8: 0x77,
  F9: 0x78, F10: 0x79, F11: 0x7A, F12: 0x7B,
  
  // 小键盘
  NUMPAD0: 0x60, NUMPAD1: 0x61, NUMPAD2: 0x62,
  NUMPAD3: 0x63, NUMPAD4: 0x64, NUMPAD5: 0x65,
  NUMPAD6: 0x66, NUMPAD7: 0x67, NUMPAD8: 0x68,
  NUMPAD9: 0x69,
  MULTIPLY: 0x6A,
  ADD: 0x6B,
  SUBTRACT: 0x6D,
  DECIMAL: 0x6E,
  DIVIDE: 0x6F,
} as const;

/**
 * 键盘事件管理器
 */
export class KeyboardEventManager extends EventEmitter {
  private static instance: KeyboardEventManager | undefined;
  
  /** 是否已初始化 */
  private initialized: boolean = false;
  
  /** 原生触发器 */
  private nativeTriggers: trigger[] = [];
  
  /** 已注册的按键 */
  private registeredKeys: Set<string> = new Set();
  
  private constructor() {
    super("KeyboardEventManager");
  }
  
  /**
   * 获取键盘事件管理器实例
   */
  public static getInstance(): KeyboardEventManager {
    if (!KeyboardEventManager.instance) {
      KeyboardEventManager.instance = new KeyboardEventManager();
    }
    return KeyboardEventManager.instance;
  }
  
  /**
   * 初始化（可选择性注册常用按键）
   * @param registerCommonKeys 是否自动注册常用按键
   */
  public initialize(registerCommonKeys: boolean = false): void {
    if (this.initialized) return;
    
    if (registerCommonKeys) {
      // 注册常用按键
      this.registerKey(KeyCode.ESCAPE);
      this.registerKey(KeyCode.SPACE);
      this.registerKey(KeyCode.ENTER);
      
      // 注册字母键 A-Z
      for (let i = KeyCode.A; i <= KeyCode.Z; i++) {
        this.registerKey(i);
      }
      
      // 注册数字键 0-9
      for (let i = KeyCode.KEY_0; i <= KeyCode.KEY_9; i++) {
        this.registerKey(i);
      }
      
      // 注册功能键 F1-F12
      for (let i = KeyCode.F1; i <= KeyCode.F12; i++) {
        this.registerKey(i);
      }
    }
    
    this.initialized = true;
    log.info("初始化完成");
  }
  
  /**
   * 注册按键事件
   * 由于 WC3 的键盘事件需要逐个注册，这里提供动态注册接口
   * @param keyCode 按键代码
   * @param isDown 是否按下事件（true = 按下，false = 抬起，不传则两者都注册）
   */
  public registerKey(keyCode: number, isDown?: boolean): void {
    if (isDown === undefined) {
      // 同时注册按下和抬起
      this.registerKey(keyCode, true);
      this.registerKey(keyCode, false);
      return;
    }
    
    const key = `${keyCode}:${isDown ? 1 : 0}`;
    if (this.registeredKeys.has(key)) return;
    
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    const eventType = isDown ? KeyEventType.DOWN : KeyEventType.UP;
    
    // 使用 KKWE JAPI 注册键盘事件
    DzTriggerRegisterKeyEventByCode(
      trig,
      keyCode,
      isDown ? 1 : 0, // 1 = 按下, 0 = 抬起
      false,
      () => {
        const data: KeyEventData = {
          keyCode,
          type: eventType,
          metaKey: DzGetTriggerKey(),
        };
        
        // 发射通用事件
        this.emit(eventType, data);
        
        // 发射按键特定事件
        this.emit(`${eventType}:${keyCode}`, data);
      }
    );
    
    this.registeredKeys.add(key);
  }
  
  // =====================
  // 便捷订阅方法
  // =====================
  
  /**
   * 订阅按键按下事件
   * @param handler 事件处理器
   * @param keyCode 指定按键（可选，不传则接收所有已注册的按键）
   * @param options 订阅选项
   */
  public onKeyDown(
    handler: KeyEventHandler,
    keyCode?: number,
    options?: SubscribeOptions
  ): number {
    // 如果指定了按键且未注册，自动注册
    if (keyCode !== undefined) {
      this.registerKey(keyCode, true);
      return this.on(`${KeyEventType.DOWN}:${keyCode}`, handler, options);
    }
    return this.on(KeyEventType.DOWN, handler, options);
  }
  
  /**
   * 订阅按键抬起事件
   * @param handler 事件处理器
   * @param keyCode 指定按键（可选）
   * @param options 订阅选项
   */
  public onKeyUp(
    handler: KeyEventHandler,
    keyCode?: number,
    options?: SubscribeOptions
  ): number {
    if (keyCode !== undefined) {
      this.registerKey(keyCode, false);
      return this.on(`${KeyEventType.UP}:${keyCode}`, handler, options);
    }
    return this.on(KeyEventType.UP, handler, options);
  }
  
  /**
   * 订阅按键事件（按下和抬起）
   * @param handler 事件处理器
   * @param keyCode 按键代码
   * @param options 订阅选项
   * @returns 返回两个订阅 ID
   */
  public onKey(
    handler: KeyEventHandler,
    keyCode: number,
    options?: SubscribeOptions
  ): [number, number] {
    this.registerKey(keyCode);
    const downId = this.on(`${KeyEventType.DOWN}:${keyCode}`, handler, options);
    const upId = this.on(`${KeyEventType.UP}:${keyCode}`, handler, options);
    return [downId, upId];
  }
  
  /**
   * 销毁管理器
   */
  public override destroy(): void {
    super.destroy();
    
    for (const trig of this.nativeTriggers) {
      DestroyTrigger(trig);
    }
    this.nativeTriggers = [];
    this.registeredKeys.clear();
    this.initialized = false;
  }
}

/**
 * 快捷访问键盘事件管理器
 */
export const keyboardEvents = KeyboardEventManager.getInstance();
