import { Frame } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";

import { MouseEventManager, MouseButton } from "src/system/event/MouseEvent";
import { UIComponent } from "../UIComponent";
import { createLogger } from "src/utils/logger";

const mixinLog = createLogger("DraggableMixin");
const log = createLogger("UIComponentBase");

/**
 * 拖拽配置
 */
export interface DragConfig {
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onDragging?: (x: number, y: number) => void;
}

/**
 * 可拖拽组件接口
 * 组件需要实现此接口才能使用 DraggableMixin
 */
export interface IDraggableComponent {
  /** 获取像素X坐标 */
  getPixelX(): number;
  /** 获取像素Y坐标 */
  getPixelY(): number;
  /** 设置位置 */
  setPosition(x: number, y: number): IDraggableComponent;
  /** 是否启用 */
  getEnabled(): boolean;
}

/**
 * 拖拽功能混入类
 * 可以被任何UI组件使用，无需继承
 * 
 * @example
 * ```typescript
 * class MyComponent implements IDraggableComponent {
 *   private draggable = new DraggableMixin(this);
 *   
 *   public setDraggable(enabled: boolean) {
 *     this.draggable.setEnabled(enabled);
 *   }
 *   
 *   public destroy() {
 *     this.draggable.cleanup();
 *   }
 * }
 * ```
 */
export class DraggableMixin {
  private component: IDraggableComponent;
  
  private isDraggableEnabled: boolean = false;
  private isDragging: boolean = false;
  private isMouseOver: boolean = false;
  
  private dragTimer: timer | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private dragMouseDownId: number = -1;
  private dragMouseUpId: number = -1;
  
  private onDragStartCallback: (() => void) | null = null;
  private onDragEndCallback: ((x: number, y: number) => void) | null = null;
  private onDraggingCallback: ((x: number, y: number) => void) | null = null;

  constructor(component: IDraggableComponent) {
    this.component = component;
  }

  // ==================== 公共方法 ====================

  /**
   * 启用/禁用拖拽
   */
  public setEnabled(enabled: boolean): void {
    if (this.isDraggableEnabled === enabled) return;
    
    this.isDraggableEnabled = enabled;
    
    if (enabled) {
      this.setupDragEventListeners();
    } else {
      this.cleanupDragEventListeners();
    }
  }

  /**
   * 获取是否启用拖拽
   */
  public getEnabled(): boolean {
    return this.isDraggableEnabled;
  }

  /**
   * 获取是否正在拖拽
   */
  public getIsDragging(): boolean {
    return this.isDragging;
  }

  /**
   * 设置鼠标悬停状态（组件在鼠标事件中调用）
   */
  public setMouseOver(isOver: boolean): void {
    this.isMouseOver = isOver;
  }

  /**
   * 获取鼠标是否悬停
   */
  public getIsMouseOver(): boolean {
    return this.isMouseOver;
  }

  /**
   * 设置拖拽开始回调
   */
  public setOnDragStart(callback: () => void): void {
    this.onDragStartCallback = callback;
  }

  /**
   * 设置拖拽结束回调
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): void {
    this.onDragEndCallback = callback;
  }

  /**
   * 设置拖拽过程回调
   */
  public setOnDragging(callback: (x: number, y: number) => void): void {
    this.onDraggingCallback = callback;
  }

  /**
   * 配置拖拽（便捷方法）
   */
  public configure(config: DragConfig): void {
    if (config.onDragStart) this.onDragStartCallback = config.onDragStart;
    if (config.onDragEnd) this.onDragEndCallback = config.onDragEnd;
    if (config.onDragging) this.onDraggingCallback = config.onDragging;
  }

  /**
   * 清理资源（组件销毁时调用）
   */
  public cleanup(): void {
    if (this.isDragging) {
      this.endDrag();
    }
    this.cleanupDragEventListeners();
    
    this.onDragStartCallback = null;
    this.onDragEndCallback = null;
    this.onDraggingCallback = null;
  }

  // ==================== 内部方法 ====================

  private getMousePixelX(): number {
    const windowWidth = DzGetWindowWidth();
    const mouseRelativeX = DzGetMouseXRelative();
    return (mouseRelativeX / windowWidth) * ScreenCoordinates.STANDARD_WIDTH;
  }

  private getMousePixelY(): number {
    const windowHeight = DzGetWindowHeight();
    const mouseRelativeY = DzGetMouseYRelative();
    return (mouseRelativeY / windowHeight) * ScreenCoordinates.STANDARD_HEIGHT;
  }

  private startDrag(): void {
    if (!this.isDraggableEnabled || this.isDragging) return;
    
    this.isDragging = true;
    
    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();
    
    this.dragOffsetX = currentMouseX - this.component.getPixelX();
    this.dragOffsetY = currentMouseY - this.component.getPixelY();
    
    mixinLog.info("Drag started");
    
    if (this.onDragStartCallback) {
      this.onDragStartCallback();
    }
    
    this.dragTimer = CreateTimer();
    TimerStart(this.dragTimer, 0.01, true, () => {
      this.updateDragPosition();
    });
    
    const mouseEvents = MouseEventManager.getInstance();
    this.dragMouseUpId = mouseEvents.onMouseUp(() => {
      this.endDrag();
    }, MouseButton.LEFT, { once: true });
  }

  private updateDragPosition(): void {
    if (!this.isDragging) return;
    
    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();
    
    const newX = currentMouseX - this.dragOffsetX;
    const newY = currentMouseY - this.dragOffsetY;
    
    this.component.setPosition(newX, newY);
    
    if (this.onDraggingCallback) {
      this.onDraggingCallback(newX, newY);
    }
  }

  private endDrag(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    if (this.dragTimer) {
      PauseTimer(this.dragTimer);
      DestroyTimer(this.dragTimer);
      this.dragTimer = null;
    }
    
    if (this.dragMouseUpId >= 0) {
      const mouseEvents = MouseEventManager.getInstance();
      mouseEvents.off(this.dragMouseUpId);
      this.dragMouseUpId = -1;
    }
    
    mixinLog.info("Drag ended");
    
    if (this.onDragEndCallback) {
      this.onDragEndCallback(this.component.getPixelX(), this.component.getPixelY());
    }
  }

  private setupDragEventListeners(): void {
    if (this.dragMouseDownId >= 0) return;
    
    const mouseEvents = MouseEventManager.getInstance();
    
    this.dragMouseDownId = mouseEvents.onMouseDown(() => {
      if (this.isMouseOver && this.isDraggableEnabled && !this.isDragging && this.component.getEnabled()) {
        this.startDrag();
      }
    }, MouseButton.LEFT);
  }

  private cleanupDragEventListeners(): void {
    const mouseEvents = MouseEventManager.getInstance();
    
    if (this.dragMouseDownId >= 0) {
      mouseEvents.off(this.dragMouseDownId);
      this.dragMouseDownId = -1;
    }
    
    if (this.dragMouseUpId >= 0) {
      mouseEvents.off(this.dragMouseUpId);
      this.dragMouseUpId = -1;
    }
    
    if (this.isDragging) {
      this.endDrag();
    }
  }
}

/**
 * UI组件基类
 * 提供通用的位置、大小、可见性、拖拽等功能
 * 所有UI组件都应该继承此基类
 * 
 * @example
 * ```typescript
 * class MyComponent extends UIComponentBase {
 *   create(parent?: Frame): void { ... }
 *   destroy(): void { ... }
 *   protected getInteractiveFrame(): Frame | null { ... }
 *   protected updateFramePositions(): void { ... }
 * }
 * 
 * const comp = new MyComponent(100, 100, 200, 50);
 * comp.create();
 * comp.setDraggable(true);  // 自动获得拖拽功能
 * ```
 */
export abstract class UIComponentBase implements UIComponent, IDraggableComponent {
  // ==================== 基础属性 ====================
  
  /** 像素X坐标 */
  protected pixelX: number;
  
  /** 像素Y坐标 */
  protected pixelY: number;
  
  /** 像素宽度 */
  protected pixelWidth: number;
  
  /** 像素高度 */
  protected pixelHeight: number;
  
  /** 坐标原点 */
  protected origin: string;
  
  /** 是否可见 */
  protected isVisible: boolean = true;
  
  /** 是否启用 */
  protected isEnabled: boolean = true;
  
  /** 组件标签（用于热重载管理） */
  protected componentTag?: string;

  // ==================== 拖拽相关属性 ====================
  
  /** 是否可拖拽 */
  protected isDraggable: boolean = false;
  
  /** 是否正在拖拽 */
  protected isDragging: boolean = false;
  
  /** 拖拽定时器 */
  private dragTimer: timer | null = null;
  
  /** 拖拽偏移X */
  private dragOffsetX: number = 0;
  
  /** 拖拽偏移Y */
  private dragOffsetY: number = 0;
  
  /** 全局鼠标按下订阅ID */
  private dragMouseDownId: number = -1;
  
  /** 全局鼠标松开订阅ID */
  private dragMouseUpId: number = -1;
  
  /** 鼠标是否在组件上 */
  protected isMouseOver: boolean = false;
  
  /** 拖拽开始回调 */
  private onDragStartCallback: (() => void) | null = null;
  
  /** 拖拽结束回调 */
  private onDragEndCallback: ((x: number, y: number) => void) | null = null;
  
  /** 拖拽过程回调 */
  private onDraggingCallback: ((x: number, y: number) => void) | null = null;

  // ==================== 构造函数 ====================

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ) {
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = origin;
  }

  // ==================== 抽象方法（子类必须实现） ====================

  /**
   * 创建组件的UI框架
   * @param parent 父级Frame
   */
  public abstract create(parent?: Frame): void;

  /**
   * 销毁组件
   */
  public abstract destroy(): void;

  /**
   * 获取用于检测鼠标悬停的框架
   * 子类需要返回可以检测鼠标事件的Frame
   */
  protected abstract getInteractiveFrame(): Frame | null;

  /**
   * 更新组件的框架位置（子类实现具体逻辑）
   */
  protected abstract updateFramePositions(): void;

  // ==================== 位置和大小 ====================

  /**
   * 设置位置
   * @param x 像素X坐标
   * @param y 像素Y坐标
   */
  public setPosition(x: number, y: number): this {
    this.pixelX = x;
    this.pixelY = y;
    this.updateFramePositions();
    return this;
  }

  /**
   * 获取位置
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.pixelX, y: this.pixelY };
  }

  /**
   * 获取像素X坐标（实现 IDraggableComponent 接口）
   */
  public getPixelX(): number {
    return this.pixelX;
  }

  /**
   * 获取像素Y坐标（实现 IDraggableComponent 接口）
   */
  public getPixelY(): number {
    return this.pixelY;
  }

  /**
   * 设置大小
   * @param width 像素宽度
   * @param height 像素高度
   */
  public setSize(width: number, height: number): this {
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.updateFramePositions();
    return this;
  }

  /**
   * 获取大小
   */
  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  /**
   * 获取边界矩形
   */
  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.pixelX,
      y: this.pixelY,
      width: this.pixelWidth,
      height: this.pixelHeight
    };
  }

  // ==================== 可见性和启用状态 ====================

  /**
   * 设置可见性（子类可重写以处理多个Frame）
   */
  public setVisible(visible: boolean): this {
    this.isVisible = visible;
    return this;
  }

  /**
   * 获取可见性
   */
  public getVisible(): boolean {
    return this.isVisible;
  }

  /**
   * 显示组件
   */
  public show(): this {
    return this.setVisible(true);
  }

  /**
   * 隐藏组件
   */
  public hide(): this {
    return this.setVisible(false);
  }

  /**
   * 切换可见性
   */
  public toggle(): this {
    return this.setVisible(!this.isVisible);
  }

  /**
   * 设置启用状态
   */
  public setEnabled(enabled: boolean): this {
    this.isEnabled = enabled;
    return this;
  }

  /**
   * 获取启用状态
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // ==================== 坐标转换工具 ====================

  /**
   * 将像素坐标转换为WC3坐标
   */
  protected pixelToWC3(): { x: number; y: number } {
    return ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
  }

  /**
   * 获取WC3坐标系的宽度
   */
  protected getWC3Width(): number {
    return (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
  }

  /**
   * 获取WC3坐标系的高度
   */
  protected getWC3Height(): number {
    return (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
  }

  /**
   * 获取鼠标在标准像素坐标系中的X坐标
   */
  protected getMousePixelX(): number {
    const windowWidth = DzGetWindowWidth();
    const mouseRelativeX = DzGetMouseXRelative();
    return (mouseRelativeX / windowWidth) * ScreenCoordinates.STANDARD_WIDTH;
  }

  /**
   * 获取鼠标在标准像素坐标系中的Y坐标
   */
  protected getMousePixelY(): number {
    const windowHeight = DzGetWindowHeight();
    const mouseRelativeY = DzGetMouseYRelative();
    return (mouseRelativeY / windowHeight) * ScreenCoordinates.STANDARD_HEIGHT;
  }

  // ==================== 拖拽功能 ====================

  /**
   * 启用/禁用拖拽功能
   * @param draggable 是否可拖拽
   */
  public setDraggable(draggable: boolean): this {
    if (this.isDraggable === draggable) return this;
    
    this.isDraggable = draggable;
    
    if (draggable) {
      this.setupDragEventListeners();
    } else {
      this.cleanupDragEventListeners();
    }
    
    return this;
  }

  /**
   * 获取是否启用了拖拽
   */
  public getDraggable(): boolean {
    return this.isDraggable;
  }

  /**
   * 获取是否正在拖拽
   */
  public getIsDragging(): boolean {
    return this.isDragging;
  }

  /**
   * 设置拖拽开始回调
   */
  public setOnDragStart(callback: () => void): this {
    this.onDragStartCallback = callback;
    return this;
  }

  /**
   * 设置拖拽结束回调
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): this {
    this.onDragEndCallback = callback;
    return this;
  }

  /**
   * 设置拖拽过程中回调
   */
  public setOnDragging(callback: (x: number, y: number) => void): this {
    this.onDraggingCallback = callback;
    return this;
  }

  /**
   * 启用拖拽并配置（便捷方法）
   */
  public enableDrag(config?: {
    onDragStart?: () => void;
    onDragEnd?: (x: number, y: number) => void;
    onDragging?: (x: number, y: number) => void;
  }): this {
    this.setDraggable(true);
    
    if (config) {
      if (config.onDragStart) this.setOnDragStart(config.onDragStart);
      if (config.onDragEnd) this.setOnDragEnd(config.onDragEnd);
      if (config.onDragging) this.setOnDragging(config.onDragging);
    }
    
    return this;
  }

  /**
   * 禁用拖拽
   */
  public disableDrag(): this {
    this.setDraggable(false);
    if (this.isDragging) {
      this.endDrag();
    }
    return this;
  }

  /**
   * 开始拖拽
   */
  protected startDrag(): void {
    if (!this.isDraggable || this.isDragging) return;
    
    this.isDragging = true;
    
    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();
    
    this.dragOffsetX = currentMouseX - this.pixelX;
    this.dragOffsetY = currentMouseY - this.pixelY;
    
    log.info("Drag started at mouse(" + currentMouseX + ", " + currentMouseY + ")");
    
    if (this.onDragStartCallback) {
      this.onDragStartCallback();
    }
    
    this.dragTimer = CreateTimer();
    TimerStart(this.dragTimer, 0.01, true, () => {
      this.updateDragPosition();
    });
    
    const mouseEvents = MouseEventManager.getInstance();
    this.dragMouseUpId = mouseEvents.onMouseUp(() => {
      this.endDrag();
    }, MouseButton.LEFT, { once: true });
  }

  /**
   * 更新拖拽过程中的位置
   */
  private updateDragPosition(): void {
    if (!this.isDragging) return;
    
    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();
    
    const newX = currentMouseX - this.dragOffsetX;
    const newY = currentMouseY - this.dragOffsetY;
    
    this.setPosition(newX, newY);
    
    if (this.onDraggingCallback) {
      this.onDraggingCallback(newX, newY);
    }
  }

  /**
   * 结束拖拽
   */
  protected endDrag(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    if (this.dragTimer) {
      PauseTimer(this.dragTimer);
      DestroyTimer(this.dragTimer);
      this.dragTimer = null;
    }
    
    if (this.dragMouseUpId >= 0) {
      const mouseEvents = MouseEventManager.getInstance();
      mouseEvents.off(this.dragMouseUpId);
      this.dragMouseUpId = -1;
    }
    
    log.info("Drag ended at position(" + this.pixelX + ", " + this.pixelY + ")");
    
    if (this.onDragEndCallback) {
      this.onDragEndCallback(this.pixelX, this.pixelY);
    }
  }

  /**
   * 设置拖拽事件监听器
   */
  private setupDragEventListeners(): void {
    if (this.dragMouseDownId >= 0) return;
    
    const mouseEvents = MouseEventManager.getInstance();
    
    this.dragMouseDownId = mouseEvents.onMouseDown(() => {
      if (this.isMouseOver && this.isDraggable && !this.isDragging && this.isEnabled) {
        this.startDrag();
      }
    }, MouseButton.LEFT);
  }

  /**
   * 清理拖拽事件监听器
   */
  protected cleanupDragEventListeners(): void {
    const mouseEvents = MouseEventManager.getInstance();
    
    if (this.dragMouseDownId >= 0) {
      mouseEvents.off(this.dragMouseDownId);
      this.dragMouseDownId = -1;
    }
    
    if (this.dragMouseUpId >= 0) {
      mouseEvents.off(this.dragMouseUpId);
      this.dragMouseUpId = -1;
    }
    
    if (this.isDragging) {
      this.endDrag();
    }
  }

  /**
   * 设置鼠标悬停状态（子类在鼠标事件中调用）
   */
  protected setMouseOver(isOver: boolean): void {
    this.isMouseOver = isOver;
  }

  /**
   * 获取鼠标是否悬停在组件上
   */
  public getIsMouseOver(): boolean {
    return this.isMouseOver;
  }

  // ==================== 标签管理 ====================

  /**
   * 设置组件标签
   */
  public setTag(tag: string): this {
    this.componentTag = tag;
    return this;
  }

  /**
   * 获取组件标签
   */
  public getTag(): string | undefined {
    return this.componentTag;
  }

  // ==================== 基础销毁逻辑 ====================

  /**
   * 清理拖拽相关资源
   * 子类在 destroy() 中应该调用此方法
   */
  protected cleanupDrag(): void {
    if (this.isDragging) {
      this.endDrag();
    }
    this.cleanupDragEventListeners();
    
    this.onDragStartCallback = null;
    this.onDragEndCallback = null;
    this.onDraggingCallback = null;
  }
}
