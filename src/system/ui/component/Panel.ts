import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";

import { MouseEventManager, MouseButton } from "src/system/event/MouseEvent";
import { UIBackgrounds } from "src/constants/ui/preset";
import { createLogger } from "src/utils/logger";

const log = createLogger("Panel");

/**
 * 面板尺寸预设
 */
export const PanelSizes = {
  /** 小面板 */
  SMALL: { width: 200, height: 150 },
  /** 中等面板 */
  MEDIUM: { width: 400, height: 300 },
  /** 大面板 */
  LARGE: { width: 600, height: 450 },
  /** 宽面板 */
  WIDE: { width: 800, height: 200 },
  /** 高面板 */
  TALL: { width: 300, height: 500 },
  /** 全屏 */
  FULLSCREEN: { width: 1920, height: 1080 },
} as const;

/**
 * Panel类 - 面板容器组件
 * 可作为其他UI组件的父容器，支持拖拽、缩放、标题栏等功能
 */
export class Panel {
  private pixelX: number;
  private pixelY: number;
  private pixelWidth: number;
  private pixelHeight: number;

  // 框架
  private backdropFrame: Frame | null = null;
  private titleBarFrame: Frame | null = null;
  private titleTextFrame: Frame | null = null;
  private contentFrame: Frame | null = null;
  private closeButtonFrame: Frame | null = null;
  private closeBackdropFrame: Frame | null = null;
  private titleBarHitFrame: Frame | null = null;

  // 状态
  private isVisible: boolean = true;
  private isEnabled: boolean = true;

  // 外观
  private background: string = UIBackgrounds.BLACK_TRANSPARENT;
  private titleBarHeight: number = 30;
  private closeButtonSize: number = 26; // 关闭按钮大小（像素），默认为 titleBarHeight - 4
  private showTitleBar: boolean = false;
  private title: string = "";
  private titleColor: string = "FFFFFF";
  private showCloseButton: boolean = false;

  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;
  private alpha: number = 255;

  // 拖拽相关
  private isDraggable: boolean = false;
  private isDragging: boolean = false;
  private dragTimer: timer | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private dragMouseDownId: number = -1;
  private dragMouseUpId: number = -1;
  private isMouseOverTitleBar: boolean = false;

  // 回调
  private onClose: (() => void) | null = null;
  private onDragStart: (() => void) | null = null;
  private onDragEnd: ((x: number, y: number) => void) | null = null;
  private onDragging: ((x: number, y: number) => void) | null = null;

  constructor(
    x: number,
    y: number,
    width: number = 400,
    height: number = 300,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ) {
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = origin;
  }

  // ==================== 静态工厂方法 ====================

  /**
   * 使用尺寸预设创建面板
   */
  public static createWithPreset(
    x: number,
    y: number,
    sizePreset: keyof typeof PanelSizes = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Panel {
    const size = PanelSizes[sizePreset];
    const panel = new Panel(x, y, size.width, size.height, origin);
    panel.create(parent);
    return panel;
  }

  /**
   * 在屏幕中心创建面板
   */
  public static createCentered(
    sizePreset: keyof typeof PanelSizes = 'MEDIUM',
    parent?: Frame
  ): Panel {
    const size = PanelSizes[sizePreset];
    const centerX = (ScreenCoordinates.STANDARD_WIDTH - size.width) / 2;
    const centerY = (ScreenCoordinates.STANDARD_HEIGHT - size.height) / 2;

    const panel = new Panel(centerX, centerY, size.width, size.height);
    panel.create(parent);
    return panel;
  }

  /**
   * 创建带标题栏的面板
   */
  public static createWithTitle(
    title: string,
    x: number,
    y: number,
    width: number = 400,
    height: number = 300,
    parent?: Frame
  ): Panel {
    const panel = new Panel(x, y, width, height);
    panel.setTitle(title);
    panel.setShowTitleBar(true);
    panel.create(parent);
    return panel;
  }

  /**
   * 创建可拖拽的面板
   */
  public static createDraggable(
    title: string,
    x: number,
    y: number,
    width: number = 400,
    height: number = 300,
    parent?: Frame
  ): Panel {
    const panel = new Panel(x, y, width, height);
    panel.setTitle(title);
    panel.setShowTitleBar(true);
    panel.setDraggable(true);
    panel.setShowCloseButton(true);
    panel.create(parent);
    return panel;
  }

  // ==================== 核心方法 ====================

  public create(parent?: Frame): void {
    if (this.backdropFrame) {
      log.info("already created");
      return;
    }

    const parentFrame = parent || Frame.fromHandle(DzGetGameUI())!;

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    // 创建主背景框架
    this.backdropFrame = Frame.createType("PanelBackdrop", parentFrame, 0, "BACKDROP", "")!;
    if (!this.backdropFrame) {
      log.error("Failed to create panel backdrop frame");
      return;
    }

    this.backdropFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
      .setTexture(this.background, 0, true)
      .setAlpha(this.alpha);

    // 如果有标题栏，创建标题栏
    if (this.showTitleBar) {
      this.createTitleBar(wc3Pos.x, wc3Pos.y, wc3Width);
    }

    // 创建内容区域（用于子组件）
    this.createContentArea(wc3Pos.x, wc3Pos.y, wc3Width, wc3Height);

    this.setVisible(this.isVisible);

    log.info("created at (" + this.pixelX + ", " + this.pixelY + ") with size " + this.pixelWidth + "x" + this.pixelHeight);
  }

  /**
   * 创建标题栏
   */
  private createTitleBar(wc3X: number, wc3Y: number, wc3Width: number): void {
    const titleBarWC3Height = (this.titleBarHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const closeButtonWC3Size = (this.closeButtonSize / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;

    // 标题栏背景
    this.titleBarFrame = Frame.createType("PanelTitleBar", this.backdropFrame!, 0, "BACKDROP", "")!;
    if (this.titleBarFrame !== null) {
      this.titleBarFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3X, wc3Y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, wc3X + wc3Width, wc3Y - titleBarWC3Height)
        .setTexture(UIBackgrounds.BLACK_TRANSPARENT, 0, true)
        .setAlpha(200);

      // 注册标题栏的鼠标事件（用于拖拽检测）
      this.setupTitleBarEvents();
    }

    // 标题文本
    this.titleTextFrame = Frame.createType("PanelTitleText", this.titleBarFrame!, 0, "TEXT", "")!;
    if (this.titleTextFrame !== null) {
      const textRightX = this.showCloseButton ? wc3X + wc3Width - closeButtonWC3Size - 0.005 : wc3X + wc3Width;
      this.titleTextFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3X + 0.005, wc3Y - 0.002)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, textRightX, wc3Y - titleBarWC3Height + 0.002)
        .setText("|cff" + this.titleColor + this.title + "|r")
        .setTextAlignment(0, 50); // 左对齐，垂直居中
    }

    // 关闭按钮
    if (this.showCloseButton) {
      this.createCloseButton(wc3X + wc3Width - closeButtonWC3Size - 0.002, wc3Y - 0.002, closeButtonWC3Size);
    }
  }

  /**
   * 创建关闭按钮
   */
  private createCloseButton(wc3X: number, wc3Y: number, wc3Size: number): void {
    // 关闭按钮背景
    this.closeBackdropFrame = Frame.createType("PanelCloseBackdrop", this.titleBarFrame!, 0, "BACKDROP", "")!;
    if (this.closeBackdropFrame !== null) {
      this.closeBackdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3X, wc3Y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, wc3X + wc3Size, wc3Y - wc3Size)
        .setTexture(UIBackgrounds.SHUIMO_STYLE_CLOSE_BUTTON_BACKGROUND, 0, true);
    }

    // 关闭按钮点击区域
    this.closeButtonFrame = Frame.createType("PanelCloseButton", this.closeBackdropFrame, 0, "BUTTON", "")!;
    if (this.closeButtonFrame !== null) {
      this.closeButtonFrame.setAllPoints(this.closeBackdropFrame);

      // 注册点击事件 (handle, eventType, handler, sync)
      DzFrameSetScriptByCode(this.closeButtonFrame.handle, 1, () => {
        this.close();
      }, false);
    }
  }

  /**
   * 创建内容区域
   */
  private createContentArea(wc3X: number, wc3Y: number, wc3Width: number, wc3Height: number): void {
    const titleBarWC3Height = this.showTitleBar
      ? (this.titleBarHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT
      : 0;

    // 内容区域框架（透明，仅作为子组件容器）
    this.contentFrame = Frame.createType("PanelContent", this.backdropFrame!, 0, "FRAME", "")!;
    if (this.contentFrame !== null) {
      this.contentFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3X, wc3Y - titleBarWC3Height)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, wc3X + wc3Width, wc3Y - wc3Height);
    }
  }

  /**
   * 设置标题栏事件（用于拖拽）
   */
  private setupTitleBarEvents(): void {
    if (!this.titleBarFrame) return;

    // 使用 BUTTON 类型来接收事件
    this.titleBarHitFrame = Frame.createType("PanelTitleBarHit", this.titleBarFrame, 0, "BUTTON", "")!;
    if (this.titleBarHitFrame !== null) {
      this.titleBarHitFrame.setAllPoints(this.titleBarFrame);

      // 注册鼠标进入/离开事件 (handle, eventType, handler, sync)
      DzFrameSetScriptByCode(this.titleBarHitFrame.handle, 3, () => {
        this.isMouseOverTitleBar = true;
      }, false);
      DzFrameSetScriptByCode(this.titleBarHitFrame.handle, 4, () => {
        this.isMouseOverTitleBar = false;
      }, false);
    }
  }

  // ==================== 标题设置 ====================

  /**
   * 设置标题
   */
  public setTitle(title: string): Panel {
    this.title = title;
    if (this.titleTextFrame) {
      this.titleTextFrame.setText("|cff" + this.titleColor + title + "|r");
    }
    return this;
  }

  /**
   * 获取标题
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * 设置标题颜色
   */
  public setTitleColor(hexColor: string): Panel {
    this.titleColor = hexColor;
    if (this.titleTextFrame) {
      this.titleTextFrame.setText("|cff" + this.titleColor + this.title + "|r");
    }
    return this;
  }

  /**
   * 设置是否显示标题栏
   */
  public setShowTitleBar(show: boolean): Panel {
    this.showTitleBar = show;
    return this;
  }

  /**
   * 设置标题栏高度
   */
  public setTitleBarHeight(height: number): Panel {
    this.titleBarHeight = height;
    return this;
  }

  // ==================== 关闭按钮 ====================

  /**
   * 设置是否显示关闭按钮
   */
  public setShowCloseButton(show: boolean): Panel {
    this.showCloseButton = show;
    return this;
  }

  /**
   * 设置关闭按钮大小（像素）
   * @param size 关闭按钮的像素大小，建议范围：16-40，默认 26
   * @note 调用此方法前需要先调用 create()，因为需要重新创建标题栏
   */
  public setCloseButtonSize(size: number): Panel {
    this.closeButtonSize = size;
    // 如果已经创建了标题栏，需要重新创建以应用新大小
    if (this.titleBarFrame && this.showTitleBar) {
      log.info(`更新关闭按钮大小为 ${size}px，需要重新创建标题栏`);
      // 注意：动态更新需要重新创建，建议在 create() 之前调用此方法
    }
    return this;
  }

  /**
   * 设置关闭回调
   */
  public setOnClose(callback: () => void): Panel {
    this.onClose = callback;
    return this;
  }

  /**
   * 关闭面板
   */
  public close(): void {
    if (this.onClose) {
      this.onClose();
    }
    this.setVisible(false);
  }

  // ==================== 背景设置 ====================

  /**
   * 设置背景纹理
   */
  public setBackground(texturePath: string): Panel {
    this.background = texturePath;
    if (this.backdropFrame) {
      this.backdropFrame.setTexture(texturePath, 0, true);
    }
    return this;
  }

  /**
   * 使用预设背景
   */
  public setBackgroundPreset(preset: keyof typeof UIBackgrounds): Panel {
    return this.setBackground(UIBackgrounds[preset]);
  }

  /**
   * 设置透明度
   */
  public setAlpha(alpha: number): Panel {
    this.alpha = alpha;
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    return this;
  }

  // ==================== 位置和尺寸 ====================

  /**
   * 设置位置
   */
  public setPosition(x: number, y: number): Panel {
    this.pixelX = x;
    this.pixelY = y;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置尺寸
   */
  public setSize(width: number, height: number): Panel {
    this.pixelWidth = width;
    this.pixelHeight = height;
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
   * 获取尺寸
   */
  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  /**
   * 更新框架位置
   */
  private updateFramePositions(): void {
    if (!this.backdropFrame) return;

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    // 更新主背景框架
    this.backdropFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);

    // 更新标题栏位置
    if (this.titleBarFrame) {
      const titleBarWC3Height = (this.titleBarHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
      this.titleBarFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, wc3Pos.x + wc3Width, wc3Pos.y - titleBarWC3Height);
    }

    // 更新标题文本位置
    if (this.titleTextFrame) {
      const titleBarWC3Height = (this.titleBarHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
      const closeButtonSize = this.titleBarHeight - 4;
      const closeButtonWC3Size = (closeButtonSize / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const textRightX = this.showCloseButton ? wc3Pos.x + wc3Width - closeButtonWC3Size - 0.005 : wc3Pos.x + wc3Width;

      this.titleTextFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x + 0.005, wc3Pos.y - 0.002)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, textRightX, wc3Pos.y - titleBarWC3Height + 0.002);
    }

    // 更新内容区域位置
    if (this.contentFrame) {
      const titleBarWC3Height = this.showTitleBar
        ? (this.titleBarHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT
        : 0;

      this.contentFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y - titleBarWC3Height)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, wc3Pos.x + wc3Width, wc3Pos.y - wc3Height);
    }

    // 更新关闭按钮位置
    if (this.closeBackdropFrame) {
      const closeButtonSize = this.titleBarHeight - 4;
      const closeButtonWC3Size = (closeButtonSize / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const closeButtonX = wc3Pos.x + wc3Width - closeButtonWC3Size - 0.002;
      const closeButtonY = wc3Pos.y - 0.002;

      this.closeBackdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, closeButtonX, closeButtonY)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, closeButtonX + closeButtonWC3Size, closeButtonY - closeButtonWC3Size);
    }
  }

  // ==================== 可见性和启用状态 ====================

  /**
   * 设置可见性
   */
  public setVisible(visible: boolean): Panel {
    this.isVisible = visible;
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(visible);
    }
    return this;
  }

  /**
   * 获取可见性
   */
  public getVisible(): boolean {
    return this.isVisible;
  }

  /**
   * 显示
   */
  public show(): Panel {
    return this.setVisible(true);
  }

  /**
   * 隐藏
   */
  public hide(): Panel {
    return this.setVisible(false);
  }

  /**
   * 切换可见性
   */
  public toggle(): Panel {
    return this.setVisible(!this.isVisible);
  }

  /**
   * 设置启用状态
   */
  public setEnabled(enabled: boolean): Panel {
    this.isEnabled = enabled;
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(enabled ? this.alpha : Math.floor(this.alpha * 0.5));
    }
    return this;
  }

  /**
   * 获取启用状态
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // ==================== 拖拽功能 ====================

  /**
   * 启用/禁用拖拽功能
   */
  public setDraggable(draggable: boolean): Panel {
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
   * 获取是否可拖拽
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
  public setOnDragStart(callback: () => void): Panel {
    this.onDragStart = callback;
    return this;
  }

  /**
   * 设置拖拽结束回调
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): Panel {
    this.onDragEnd = callback;
    return this;
  }

  /**
   * 设置拖拽过程中回调
   */
  public setOnDragging(callback: (x: number, y: number) => void): Panel {
    this.onDragging = callback;
    return this;
  }

  /**
   * 获取鼠标像素X坐标
   */
  private getMousePixelX(): number {
    const windowWidth = DzGetWindowWidth();
    const mouseRelativeX = DzGetMouseXRelative();
    return (mouseRelativeX / windowWidth) * ScreenCoordinates.STANDARD_WIDTH;
  }

  /**
   * 获取鼠标像素Y坐标
   */
  private getMousePixelY(): number {
    const windowHeight = DzGetWindowHeight();
    const mouseRelativeY = DzGetMouseYRelative();
    return (mouseRelativeY / windowHeight) * ScreenCoordinates.STANDARD_HEIGHT;
  }

  /**
   * 开始拖拽
   */
  private startDrag(): void {
    if (!this.isDraggable || this.isDragging) return;

    this.isDragging = true;

    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();

    this.dragOffsetX = currentMouseX - this.pixelX;
    this.dragOffsetY = currentMouseY - this.pixelY;

    if (this.onDragStart) {
      this.onDragStart();
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
   * 更新拖拽位置
   */
  private updateDragPosition(): void {
    if (!this.isDragging) return;

    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();

    const newX = currentMouseX - this.dragOffsetX;
    const newY = currentMouseY - this.dragOffsetY;

    this.setPosition(newX, newY);

    if (this.onDragging) {
      this.onDragging(newX, newY);
    }
  }

  /**
   * 结束拖拽
   */
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

    if (this.onDragEnd) {
      this.onDragEnd(this.pixelX, this.pixelY);
    }
  }

  /**
   * 设置拖拽事件监听器
   */
  private setupDragEventListeners(): void {
    if (this.dragMouseDownId >= 0) return;

    const mouseEvents = MouseEventManager.getInstance();

    this.dragMouseDownId = mouseEvents.onMouseDown(() => {
      // 只有在标题栏上按下才开始拖拽
      if (this.isMouseOverTitleBar && this.isDraggable && !this.isDragging && this.isEnabled) {
        this.startDrag();
      }
    }, MouseButton.LEFT);
  }

  /**
   * 清理拖拽事件监听器
   */
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

  // ==================== 获取框架 ====================

  /**
   * 获取背景框架
   */
  public getBackdropFrame(): Frame | null {
    return this.backdropFrame;
  }

  /**
   * 获取内容区域框架（用于添加子组件）
   */
  public getContentFrame(): Frame | null {
    return this.contentFrame;
  }

  /**
   * 获取标题栏框架
   */
  public getTitleBarFrame(): Frame | null {
    return this.titleBarFrame;
  }

  // ==================== 内容区域信息 ====================

  /**
   * 获取内容区域的像素位置（左上角）
   */
  public getContentPosition(): { x: number; y: number } {
    const offsetY = this.showTitleBar ? this.titleBarHeight : 0;
    return {
      x: this.pixelX,
      y: this.pixelY + offsetY
    };
  }

  /**
   * 获取内容区域的像素尺寸
   */
  public getContentSize(): { width: number; height: number } {
    const heightOffset = this.showTitleBar ? this.titleBarHeight : 0;
    return {
      width: this.pixelWidth,
      height: this.pixelHeight - heightOffset
    };
  }

  // ==================== 配置和销毁 ====================

  /**
   * 配置多个属性
   */
  public configure(config: {
    title?: string;
    titleColor?: string;
    showTitleBar?: boolean;
    showCloseButton?: boolean;
    closeButtonSize?: number;
    background?: string;
    alpha?: number;
    draggable?: boolean;
    visible?: boolean;
    enabled?: boolean;
    onClose?: () => void;
  }): Panel {
    if (config.title !== undefined) this.setTitle(config.title);
    if (config.titleColor !== undefined) this.setTitleColor(config.titleColor);
    if (config.showTitleBar !== undefined) this.setShowTitleBar(config.showTitleBar);
    if (config.showCloseButton !== undefined) this.setShowCloseButton(config.showCloseButton);
    if (config.closeButtonSize !== undefined) this.setCloseButtonSize(config.closeButtonSize);
    if (config.background !== undefined) this.setBackground(config.background);
    if (config.alpha !== undefined) this.setAlpha(config.alpha);
    if (config.draggable !== undefined) this.setDraggable(config.draggable);
    if (config.visible !== undefined) this.setVisible(config.visible);
    if (config.enabled !== undefined) this.setEnabled(config.enabled);
    if (config.onClose !== undefined) this.setOnClose(config.onClose);

    return this;
  }

  /**
   * 销毁面板
   */
  public destroy(): void {
    // 清理拖拽
    if (this.isDragging) {
      this.endDrag();
    }
    this.cleanupDragEventListeners();

    // 销毁框架（注意顺序：先销毁子框架，再销毁父框架）
    if (this.closeButtonFrame) {
      this.closeButtonFrame.destroy();
      this.closeButtonFrame = null;
    }

    if (this.closeBackdropFrame) {
      this.closeBackdropFrame.destroy();
      this.closeBackdropFrame = null;
    }

    if (this.titleTextFrame) {
      this.titleTextFrame.destroy();
      this.titleTextFrame = null;
    }

    if (this.titleBarHitFrame) {
      this.titleBarHitFrame.destroy();
      this.titleBarHitFrame = null;
    }

    if (this.titleBarFrame) {
      this.titleBarFrame.destroy();
      this.titleBarFrame = null;
    }

    if (this.contentFrame) {
      this.contentFrame.destroy();
      this.contentFrame = null;
    }

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }

    // 清理回调
    this.onClose = null;
    this.onDragStart = null;
    this.onDragEnd = null;
    this.onDragging = null;
  }
}
