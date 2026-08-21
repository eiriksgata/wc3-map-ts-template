/**
 * 事件发射器基类
 * 提供通用的事件订阅/发布机制，支持任意类型的事件扩展
 */

import { createLogger } from "src/utils/logger";

const log = createLogger("EventEmitter");

/**
 * 事件处理器类型
 */
export type EventHandler<T = any> = (data: T) => void;

/**
 * 订阅选项
 */
export interface SubscribeOptions {
  /** 优先级（数值越大越先执行） */
  priority?: number;
  /** 是否只触发一次 */
  once?: boolean;
  /** 订阅者标识（用于批量取消） */
  tag?: string;
}

/**
 * 订阅信息
 */
interface Subscription<T = any> {
  id: number;
  eventName: string;
  handler: EventHandler<T>;
  priority: number;
  once: boolean;
  tag?: string;
}

/**
 * 事件发射器
 * 通用的事件订阅/发布基类，可用于任何需要事件机制的场景
 */
export class EventEmitter {
  /** 订阅列表 */
  protected subscriptions: Map<string, Subscription[]> = new Map();
  
  /** 订阅 ID 计数器 */
  protected nextId: number = 1;
  
  /** 发射器名称（用于调试） */
  protected name: string;
  
  constructor(name: string = "EventEmitter") {
    this.name = name;
  }
  
  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理器
   * @param options 订阅选项
   * @returns 订阅 ID
   */
  public on<T = any>(
    eventName: string,
    handler: EventHandler<T>,
    options?: SubscribeOptions
  ): number {
    const id = this.nextId++;
    
    const subscription: Subscription<T> = {
      id,
      eventName,
      handler,
      priority: options?.priority ?? 0,
      once: options?.once ?? false,
      tag: options?.tag,
    };
    
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, []);
    }

    const subs = this.subscriptions.get(eventName)!;
    let insertAt = subs.length;
    for (let i = 0; i < subs.length; i++) {
      if (subs[i].priority < subscription.priority) {
        insertAt = i;
        break;
      }
    }
    subs.splice(insertAt, 0, subscription);
    
    return id;
  }
  
  /**
   * 订阅一次性事件
   * @param eventName 事件名称
   * @param handler 事件处理器
   * @param priority 优先级
   * @returns 订阅 ID
   */
  public once<T = any>(
    eventName: string,
    handler: EventHandler<T>,
    priority?: number
  ): number {
    return this.on(eventName, handler, { once: true, priority });
  }
  
  /**
   * 取消订阅（通过 ID）
   * @param subscriptionId 订阅 ID
   * @returns 是否成功取消
   */
  public off(subscriptionId: number): boolean {
    for (const [_eventName, subs] of this.subscriptions) {
      const index = subs.findIndex(sub => sub.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        return true;
      }
    }
    return false;
  }
  
  /**
   * 取消指定事件的所有订阅
   * @param eventName 事件名称
   */
  public offAll(eventName: string): void {
    this.subscriptions.delete(eventName);
  }
  
  /**
   * 取消指定标签的所有订阅
   * @param tag 标签
   */
  public offByTag(tag: string): number {
    let count = 0;
    for (const [_eventName, subs] of this.subscriptions) {
      const filtered = subs.filter(sub => {
        if (sub.tag === tag) {
          count++;
          return false;
        }
        return true;
      });
      this.subscriptions.set(_eventName, filtered);
    }
    return count;
  }
  
  /**
   * 发射事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  public emit<T = any>(eventName: string, data?: T): void {
    const subs = this.subscriptions.get(eventName);
    if (!subs || subs.length === 0) return;

    const toRemove: number[] = [];

    for (const sub of subs) {
      try {
        sub.handler(data);
      } catch (e) {
        log.error(`${this.name} handler "${eventName}": ${tostring(e)}`);
      }

      if (sub.once) {
        toRemove.push(sub.id);
      }
    }

    for (const id of toRemove) {
      this.off(id);
    }
  }
  
  /**
   * 检查是否有订阅者
   * @param eventName 事件名称
   */
  public hasSubscribers(eventName: string): boolean {
    const subs = this.subscriptions.get(eventName);
    return subs !== undefined && subs.length > 0;
  }
  
  /**
   * 获取订阅者数量
   * @param eventName 事件名称（可选，不传则返回总数）
   */
  public getSubscriberCount(eventName?: string): number {
    if (eventName) {
      return this.subscriptions.get(eventName)?.length ?? 0;
    }
    
    let total = 0;
    for (const subs of this.subscriptions.values()) {
      total += subs.length;
    }
    return total;
  }
  
  /**
   * 获取所有已注册的事件名称
   */
  public getEventNames(): string[] {
    return Array.from(this.subscriptions.keys());
  }
  
  /**
   * 清除所有订阅
   */
  public clear(): void {
    this.subscriptions.clear();
  }
  
  /**
   * 销毁发射器
   */
  public destroy(): void {
    this.clear();
  }
}
