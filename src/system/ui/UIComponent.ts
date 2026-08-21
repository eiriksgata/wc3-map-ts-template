/**
 * UI组件基类
 * 提供热重载自动管理功能
 * 
 * 所有UI组件继承此基类后，可以自动注册到热重载管理器
 * 在热重载时自动销毁所有已注册的组件
 */

import { createLogger } from "src/utils/logger";

const log = createLogger("UIComponentManager");

/**
 * UI组件管理器
 * 单例模式，管理所有需要热重载时清理的UI组件
 */
export class UIComponentManager {
  private static instance: UIComponentManager | null = null;
  
  /** 所有已注册的组件 */
  private components: Set<UIComponent> = new Set();
  
  /** 按标签分组的组件 */
  private taggedComponents: Map<string, Set<UIComponent>> = new Map();
  
  private constructor() {}
  
  /**
   * 获取管理器实例
   */
  public static getInstance(): UIComponentManager {
    if (!UIComponentManager.instance) {
      UIComponentManager.instance = new UIComponentManager();
    }
    return UIComponentManager.instance;
  }
  
  /**
   * 注册组件
   */
  public register(component: UIComponent, tag?: string): void {
    this.components.add(component);
    
    if (tag) {
      if (!this.taggedComponents.has(tag)) {
        this.taggedComponents.set(tag, new Set());
      }
      this.taggedComponents.get(tag)!.add(component);
    }
  }
  
  /**
   * 取消注册组件
   */
  public unregister(component: UIComponent): void {
    this.components.delete(component);
    
    // 从所有标签组中移除
    for (const tagSet of this.taggedComponents.values()) {
      tagSet.delete(component);
    }
  }
  
  /**
   * 销毁所有组件（热重载时调用）
   */
  public destroyAll(): void {
    const count = this.components.size;
    
    for (const component of this.components) {
      try {
        component.destroy();
      } catch (e) {
        log.error(`Error destroying component: ${e}`);
      }
    }
    
    this.components.clear();
    this.taggedComponents.clear();
    
    log.info(`Destroyed ${count} components`);
  }
  
  /**
   * 按标签销毁组件
   */
  public destroyByTag(tag: string): void {
    const tagSet = this.taggedComponents.get(tag);
    if (!tagSet) return;
    
    const count = tagSet.size;
    
    for (const component of tagSet) {
      try {
        component.destroy();
        this.components.delete(component);
      } catch (e) {
        log.error(`Error destroying component: ${e}`);
      }
    }
    
    this.taggedComponents.delete(tag);
    
    log.info(`Destroyed ${count} components with tag "${tag}"`);
  }
  
  /**
   * 获取已注册组件数量
   */
  public getComponentCount(): number {
    return this.components.size;
  }
  
  /**
   * 获取指定标签的组件数量
   */
  public getComponentCountByTag(tag: string): number {
    return this.taggedComponents.get(tag)?.size ?? 0;
  }
  
  /**
   * 获取所有已注册的组件
   */
  public getAllComponents(): UIComponent[] {
    return Array.from(this.components);
  }
  
  /**
   * 获取指定标签的所有组件
   */
  public getComponentsByTag(tag: string): UIComponent[] {
    return Array.from(this.taggedComponents.get(tag) ?? []);
  }
}

/**
 * UI组件基类接口
 */
export interface UIComponent {
  /** 销毁组件 */
  destroy(): void;
  
  /** 获取组件标签（可选） */
  getTag?(): string | undefined;
}

/**
 * 自动注册装饰器选项
 */
export interface AutoRegisterOptions {
  /** 组件标签，用于分组管理 */
  tag?: string;
  /** 是否自动注册（默认true） */
  autoRegister?: boolean;
}

/**
 * 创建一个可以自动注册到热重载管理的组件包装器
 * 
 * @example
 * ```typescript
 * // 创建按钮并自动注册
 * const button = UIComponents.create(() => {
 *   const btn = Button.createCentered("Test");
 *   btn.setOnClick(() => print("clicked"));
 *   return btn;
 * }, "myModule");
 * 
 * // 热重载时自动销毁所有 "myModule" 标签的组件
 * UIComponents.destroyByTag("myModule");
 * ```
 */
export const UIComponents = {
  /**
   * 创建并自动注册组件
   * @param factory 组件工厂函数
   * @param tag 可选标签
   */
  create<T extends UIComponent>(factory: () => T, tag?: string): T {
    const component = factory();
    UIComponentManager.getInstance().register(component, tag);
    return component;
  },
  
  /**
   * 注册已有组件
   * @param component 组件实例
   * @param tag 可选标签
   */
  register<T extends UIComponent>(component: T, tag?: string): T {
    UIComponentManager.getInstance().register(component, tag);
    return component;
  },
  
  /**
   * 取消注册组件
   */
  unregister(component: UIComponent): void {
    UIComponentManager.getInstance().unregister(component);
  },
  
  /**
   * 销毁所有已注册组件
   */
  destroyAll(): void {
    UIComponentManager.getInstance().destroyAll();
  },
  
  /**
   * 按标签销毁组件
   */
  destroyByTag(tag: string): void {
    UIComponentManager.getInstance().destroyByTag(tag);
  },
  
  /**
   * 获取管理器实例
   */
  getManager(): UIComponentManager {
    return UIComponentManager.getInstance();
  }
};

/**
 * 热重载辅助类
 * 简化模块的热重载管理
 */
export class HotReloadHelper {
  private tag: string;
  
  constructor(tag: string) {
    this.tag = tag;
  }
  
  /**
   * 创建并注册组件
   */
  public create<T extends UIComponent>(factory: () => T): T {
    return UIComponents.create(factory, this.tag);
  }
  
  /**
   * 注册已有组件
   */
  public register<T extends UIComponent>(component: T): T {
    return UIComponents.register(component, this.tag);
  }
  
  /**
   * 清理此模块的所有组件
   */
  public cleanup(): void {
    UIComponents.destroyByTag(this.tag);
  }
  
  /**
   * 获取此模块的组件数量
   */
  public getComponentCount(): number {
    return UIComponentManager.getInstance().getComponentCountByTag(this.tag);
  }
}
