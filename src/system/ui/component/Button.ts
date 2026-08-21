import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { UILayout } from "../UILayout";

import { FrameEventUtils } from "src/constants/frame/utils";
import { MouseEventManager, MouseButton } from "src/system/event/MouseEvent";
import { Text, TextAlign, VerticalAlign } from "./Text";
import { UIBackgrounds } from "src/constants/ui/preset";
import { createLogger } from "src/utils/logger";

const log = createLogger("Button");

/**
 * FDF 模板预设
 */
export const ButtonTemplates = {
  /** 普通按钮（弹起状态） */
  NORMAL_UP: "normal_button_up",
  /** 普通按钮（按下状态） */
  NORMAL_DOWN: "normal_button_down",
  /** 普通对话框 */
  NORMAL_DIALOG: "normal_dialog",
  /** 工具提示样式 */
  TOOLTIP: "tooltips",
  /** 工具提示样式2（较小边框） */
  TOOLTIP2: "tooltips2",
  /** 按钮样式1 */
  BUTTON1: "button1",
} as const;

/**
 * Button类 - 使用 Text 组件的按钮
 * 包含: 背景框架(Backdrop) + Text组件 + 按钮框架(Button)
 */
export class Button {
  private label: string;
  private pixelX: number;
  private pixelY: number;
  private pixelWidth: number;
  private pixelHeight: number;

  private backdropFrame: Frame | null = null;
  private textComponent: Text | null = null;  // 使用 Text 组件
  private buttonFrame: Frame | null = null;

  private onClick: (() => void) | null = null;
  private onHover: (() => void) | null = null;
  private onLeave: (() => void) | null = null;

  private isEnabled: boolean = true;
  private isVisible: boolean = true;

  private texture: string = UIBackgrounds.BLACK_TRANSPARENT;
  private textAlignment: number = TextAlign.CENTER;  // 使用 TextAlign
  private verticalAlignment: number = VerticalAlign.MIDDLE;  // 添加垂直对齐
  private textColor: string = "FFFFFF";
  private tooltip: string = "";
  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;

  // FDF 模板相关
  private useTemplate: boolean = false;
  private templateName: string = "";

  // 拖拽相关属性
  private isDraggable: boolean = false;
  private isDragging: boolean = false;
  private dragTimer: timer | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private dragMouseDownId: number = -1;  // 全局鼠标按下订阅ID
  private dragMouseUpId: number = -1;    // 全局鼠标松开订阅ID
  private isMouseOver: boolean = false;  // 鼠标是否在按钮上
  private onDragStart: (() => void) | null = null;
  private onDragEnd: ((x: number, y: number) => void) | null = null;
  private onDragging: ((x: number, y: number) => void) | null = null;

  constructor(
    label: string,
    x: number,
    y: number,
    width: number = 120,
    height: number = 40,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ) {
    this.label = label;
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = origin;
  }

  /**
   * 使用尺寸预设创建按钮（自动调用create）
   * @param label 按钮文本
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param sizePreset 尺寸预设
   * @param origin 坐标原点
   * @param parent 父级Frame（可选）
   */
  public static createWithPreset(
    label: string,
    x: number,
    y: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Button {
    const size = UILayout.BUTTON_SIZES[sizePreset];
    const button = new Button(label, x, y, size.width, size.height, origin);
    button.create(parent);
    return button;
  }

  /**
   * 在预设位置创建按钮（自动调用create）
   * @param label 按钮文本
   * @param positionPreset 位置预设 ('CENTER', 'TOP_LEFT', etc.)
   * @param sizePreset 尺寸预设
   * @param centered 是否将按钮中心对齐到预设位置（默认true）
   * @param parent 父级Frame（可选）
   */
  public static createAtPresetPosition(
    label: string,
    positionPreset: string,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    centered: boolean = true,
    parent?: Frame
  ): Button {
    const position = ScreenCoordinates.getPresetPosition(positionPreset);
    const size = UILayout.BUTTON_SIZES[sizePreset];

    let x = position.x;
    let y = position.y;

    // 如果居中对齐，需要减去按钮尺寸的一半
    if (centered) {
      x = position.x - size.width / 2;
      y = position.y - size.height / 2;
    }

    const button = new Button(label, x, y, size.width, size.height);
    button.create(parent);
    return button;
  }

  /**
   * 在屏幕中心创建按钮（便捷方法，自动调用create）
   * @param label 按钮文本
   * @param sizePreset 尺寸预设
   * @param parent 父级Frame（可选）
   */
  public static createCentered(
    label: string,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    parent?: Frame
  ): Button {
    return Button.createAtPresetPosition(label, 'CENTER', sizePreset, true, parent);
  }

  /**
   * 使用 FDF 模板创建按钮（自动调用create）
   * @param label 按钮文本
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param width 宽度
   * @param height 高度
   * @param template 模板名称（FDF中定义的模板）
   * @param origin 坐标原点
   * @param parent 父级Frame（可选）
   */
  public static createWithTemplate(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    template: string,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Button {
    const button = new Button(label, x, y, width, height, origin);
    button.useTemplate = true;
    button.templateName = template;
    button.create(parent);
    return button;
  }

  /**
   * 使用预定义 FDF 模板创建按钮（自动调用create）
   * @param label 按钮文本
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param width 宽度
   * @param height 高度
   * @param templatePreset 模板预设
   * @param origin 坐标原点
   * @param parent 父级Frame（可选）
   */
  public static createWithTemplatePreset(
    label: string,
    x: number,
    y: number,
    width: number = 120,
    height: number = 40,
    templatePreset: keyof typeof ButtonTemplates = 'NORMAL_UP',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Button {
    return Button.createWithTemplate(
      label,
      x,
      y,
      width,
      height,
      ButtonTemplates[templatePreset],
      origin,
      parent
    );
  }

  /**
   * 在屏幕中心使用 FDF 模板创建按钮（便捷方法，自动调用create）
   * @param label 按钮文本
   * @param templatePreset 模板预设
   * @param sizePreset 尺寸预设
   * @param parent 父级Frame（可选）
   */
  public static createCenteredWithTemplate(
    label: string,
    templatePreset: keyof typeof ButtonTemplates = 'NORMAL_UP',
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    parent?: Frame
  ): Button {
    const size = UILayout.BUTTON_SIZES[sizePreset];
    const centerX = (ScreenCoordinates.STANDARD_WIDTH - size.width) / 2;
    const centerY = (ScreenCoordinates.STANDARD_HEIGHT - size.height) / 2;

    return Button.createWithTemplate(
      label,
      centerX,
      centerY,
      size.width,
      size.height,
      ButtonTemplates[templatePreset],
      ScreenCoordinates.ORIGIN_TOP_LEFT,
      parent
    );
  }

  public create(parent?: Frame): void {
    if (this.backdropFrame) {
      log.info("already created");
      return;
    }

    const parentFrame = parent || Frame.fromHandle(DzGetGameUI())!;

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    // 创建背景框架（根据是否使用模板选择不同的创建方式）
    if (this.useTemplate && this.templateName) {
      // 使用 FDF 模板创建
      // Frame.createType(name, owner, createContext, typeName, inherits)
      this.backdropFrame = Frame.createType(
        "ButtonBackdrop_" + os.time(),  // name - 唯一名称
        parentFrame,                         // owner - 父框架
        0,                                   // createContext
        "BACKDROP",                          // typeName - 框架类型
        this.templateName                    // inherits - FDF 模板名
      ) || null;
      log.info("Creating button with FDF template: " + this.templateName);
    } else {
      // 使用普通方式创建
      this.backdropFrame = Frame.createType(
        "ButtonBackdrop_" + os.time(),
        parentFrame,
        0,
        "BACKDROP",
        ""
      ) || null;
    }

    if (!this.backdropFrame) {
      log.error("Failed to create backdrop frame");
      return;
    }

    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    this.backdropFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);

    // 如果不使用模板，设置纹理
    if (!this.useTemplate) {
      this.backdropFrame.setTexture(this.texture, 0, true);
    }

    // 使用 Text 组件创建文本
    this.textComponent = new Text(
      this.label,
      this.pixelX,
      this.pixelY,
      this.pixelWidth,
      this.pixelHeight,
      this.origin
    );
    this.textComponent
      .setColor(this.textColor)
      .setAlignment(this.textAlignment, this.verticalAlignment);
    this.textComponent.create(this.backdropFrame);

    // 创建按钮框架用于事件检测
    this.buttonFrame = Frame.createType(
      "ButtonFrame_" + os.time(),
      this.backdropFrame,
      0,
      "BUTTON",
      ""
    ) || null;
    if (!this.buttonFrame) {
      log.error("Failed to create button frame");
      return;
    }
    
    this.buttonFrame.setAllPoints(this.backdropFrame);

    this.setVisible(this.isVisible);
    this.setEnabled(this.isEnabled);
    this.setupEventListeners();

    // 如果使用模板，强制设置可见性和透明度
    if (this.useTemplate && this.backdropFrame) {
      this.backdropFrame.setVisible(true);
      this.backdropFrame.setAlpha(255);
    }

    log.info("\"" + this.label + "\" created successfully with Text component");
  }

  public setOnClick(callback: () => void): Button {
    this.onClick = callback;
    if (this.buttonFrame) {
      this.setupEventListeners();
    }
    return this;
  }

  public setOnHover(callback: () => void): Button {
    this.onHover = callback;
    if (this.buttonFrame) {
      this.setupEventListeners();
    }
    return this;
  }

  public setOnLeave(callback: () => void): Button {
    this.onLeave = callback;
    if (this.buttonFrame) {
      this.setupEventListeners();
    }
    return this;
  }

  public setText(text: string): Button {
    this.label = text;
    if (this.textComponent) {
      this.textComponent.setText(text);
    }
    return this;
  }

  public getText(): string {
    return this.label;
  }

  public setTextColor(hexColor: string): Button {
    this.textColor = hexColor;
    if (this.textComponent) {
      this.textComponent.setColor(hexColor);
    }
    return this;
  }

  public setTextAlignment(alignment: number, verticalAlign?: number): Button {
    this.textAlignment = alignment;
    if (verticalAlign !== undefined) {
      this.verticalAlignment = verticalAlign;
    }
    if (this.textComponent) {
      this.textComponent.setAlignment(this.textAlignment, this.verticalAlignment);
    }
    return this;
  }

  public setPosition(x: number, y: number): Button {
    this.pixelX = x;
    this.pixelY = y;
    if (this.backdropFrame) {
      const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
      const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

      const rightX = wc3Pos.x + wc3Width;
      const bottomY = wc3Pos.y - wc3Height;

      this.backdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
    }
    // 同步更新 Text 组件位置
    if (this.textComponent) {
      this.textComponent.setPosition(x, y);
    }
    return this;
  }

  public setSize(width: number, height: number): Button {
    this.pixelWidth = width;
    this.pixelHeight = height;
    if (this.backdropFrame) {
      const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
      const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

      const rightX = wc3Pos.x + wc3Width;
      const bottomY = wc3Pos.y - wc3Height;

      this.backdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
    }
    // 同步更新 Text 组件尺寸
    if (this.textComponent) {
      this.textComponent.setSize(width, height);
    }
    return this;
  }

  public setTexture(texturePath: string): Button {
    this.texture = texturePath;
    if (this.backdropFrame) {
      if (this.useTemplate) {
        log.warn("Setting texture on a template-based button may override template styles");
      }
      this.backdropFrame.setTexture(texturePath, 0, true);
    }
    return this;
  }

  /**
   * 使用预设纹理
   * @param preset 纹理预设键名
   */
  public setTexturePreset(preset: keyof typeof UIBackgrounds): Button {
    return this.setTexture(UIBackgrounds[preset]);
  }

  /**
   * 设置背景透明度
   * @param alpha 透明度 (0-255)
   */
  public setBackdropAlpha(alpha: number): Button {
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    return this;
  }

  /**
   * 隐藏背景（使用空纹理）
   */
  public hideBackdrop(): Button {
    return this.setTexture("");
  }

  /**
   * 设置自定义背景图片路径
   * @param path 图片路径（相对于MPQ/地图）
   */
  public setBackground(path: string): Button {
    return this.setTexture(path);
  }

  public setTooltip(tooltip: string): Button {
    this.tooltip = tooltip;
    return this;
  }

  public setEnabled(enabled: boolean): Button {
    this.isEnabled = enabled;
    if (this.buttonFrame) {
      if (enabled) {
        this.backdropFrame?.setAlpha(255);
        this.textComponent?.setAlpha(255);
      } else {
        this.backdropFrame?.setAlpha(128);
        this.textComponent?.setAlpha(128);
      }
    }
    return this;
  }

  public setVisible(visible: boolean): Button {
    this.isVisible = visible;
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(visible);
    }
    if (this.textComponent) {
      this.textComponent.setVisible(visible);
    }
    if (this.buttonFrame) {
      this.buttonFrame.setVisible(visible);
    }
    return this;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public getVisible(): boolean {
    return this.isVisible;
  }

  public getBackdropFrame(): Frame | null {
    return this.backdropFrame;
  }

  public getTextComponent(): Text | null {
    return this.textComponent;
  }

  public getTextFrame(): Frame | null {
    return this.textComponent?.getTextFrame() || null;
  }

  public getButtonFrame(): Frame | null {
    return this.buttonFrame;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.pixelX, y: this.pixelY };
  }

  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  /**
   * 获取用于定位的主 Frame（优先返回 backdrop，其次 button）
   * 用于 Tips 等组件的相对定位
   */
  public getMainFrame(): Frame | null {
    return this.backdropFrame || this.buttonFrame;
  }

  /**
   * 获取组件信息，用于 Tips 显示
   * @returns 包含 frame、位置、尺寸的对象
   */
  public getComponentInfo(): { frame: Frame | null; x: number; y: number; width: number; height: number } {
    return {
      frame: this.getMainFrame(),
      x: this.pixelX,
      y: this.pixelY,
      width: this.pixelWidth,
      height: this.pixelHeight
    };
  }

  /**
   * 获取是否使用了 FDF 模板
   */
  public isUsingTemplate(): boolean {
    return this.useTemplate;
  }

  /**
   * 获取使用的模板名称
   */
  public getTemplateName(): string {
    return this.templateName;
  }

  public destroy(): void {
    // 如果正在拖拽，先结束拖拽
    if (this.isDragging) {
      this.endDrag();
    }

    if (this.buttonFrame) {
      this.buttonFrame.destroy();
      this.buttonFrame = null;
    }

    if (this.textComponent) {
      this.textComponent.destroy();
      this.textComponent = null;
    }

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }

    this.onClick = null;
    this.onHover = null;
    this.onLeave = null;
    this.onDragStart = null;
    this.onDragEnd = null;
    this.onDragging = null;
  }

  private setupEventListeners(): void {
    if (!this.buttonFrame) return;

    FrameEventUtils.bindEvents(this.buttonFrame, {
      onClick: () => {
        // 如果正在拖拽，不触发点击
        // 如果启用拖拽，点击由 setupDragEventListeners 处理
        if (!this.isDragging && !this.isDraggable && this.isEnabled && this.onClick) {
          this.onClick();
        }
      },
      onMouseEnter: () => {
        this.isMouseOver = true;
        if (this.isEnabled && this.onHover) {
          this.onHover();
        }
      },
      onMouseLeave: () => {
        this.isMouseOver = false;
        // 如果正在拖拽且鼠标离开了按钮区域，继续拖拽（不结束）
        if (this.isEnabled && this.onLeave && !this.isDragging) {
          this.onLeave();
        }
      }
    });
  }

  public click(): void {
    if (this.isEnabled && this.onClick) {
      this.onClick();
      log.info("\"" + this.label + "\" clicked");
    }
  }

  public addHoverEffect(hoverAlpha: number = 200, normalAlpha: number = 255): Button {
    this.setOnHover(() => {
      if (this.backdropFrame && this.isEnabled) {
        this.backdropFrame.setAlpha(hoverAlpha);
      }
    });

    this.setOnLeave(() => {
      if (this.backdropFrame && this.isEnabled) {
        this.backdropFrame.setAlpha(normalAlpha);
      }
    });

    return this;
  }

  public configure(config: {
    text?: string;
    textColor?: string;
    texture?: string;
    onClick?: () => void;
    onHover?: () => void;
    onLeave?: () => void;
    enabled?: boolean;
    visible?: boolean;
    fontSize?: number;
    fontPath?: string;
    padding?: number;
  }): Button {
    if (config.text !== undefined) this.setText(config.text);
    if (config.textColor !== undefined) this.setTextColor(config.textColor);
    if (config.texture !== undefined) this.setTexture(config.texture);
    if (config.onClick !== undefined) this.setOnClick(config.onClick);
    if (config.onHover !== undefined) this.setOnHover(config.onHover);
    if (config.onLeave !== undefined) this.setOnLeave(config.onLeave);
    if (config.enabled !== undefined) this.setEnabled(config.enabled);
    if (config.visible !== undefined) this.setVisible(config.visible);
    if (config.fontSize !== undefined) this.setFontSize(config.fontSize);
    if (config.fontPath !== undefined && this.textComponent) {
      this.textComponent.setFont(config.fontPath);
    }
    if (config.padding !== undefined && this.textComponent) {
      this.textComponent.setPadding(config.padding);
    }

    return this;
  }

  // ==================== Text 组件功能扩展 ====================

  /**
   * 设置文本字体大小
   * @param size WC3 坐标系字体大小（如 0.012）
   */
  public setFontSize(size: number): Button {
    if (this.textComponent) {
      this.textComponent.setFontSize(size);
    }
    return this;
  }

  /**
   * 设置文本字体大小（像素值）
   * @param pixelSize 像素大小（如 12, 14, 16）
   */
  public setFontSizePixels(pixelSize: number): Button {
    if (this.textComponent) {
      this.textComponent.setFontSizePixels(pixelSize);
    }
    return this;
  }

  /**
   * 设置文本字体
   * @param fontPath 字体文件路径
   */
  public setFont(fontPath: string): Button {
    if (this.textComponent) {
      this.textComponent.setFont(fontPath);
    }
    return this;
  }

  /**
   * 设置文本内边距
   * @param padding 内边距（像素）
   */
  public setTextPadding(padding: number): Button {
    if (this.textComponent) {
      this.textComponent.setPadding(padding);
    }
    return this;
  }

  /**
   * 设置文本内边距（四个方向）
   */
  public setTextPaddingTRBL(top: number, right: number, bottom: number, left: number): Button {
    if (this.textComponent) {
      this.textComponent.setPaddingTRBL(top, right, bottom, left);
    }
    return this;
  }

  /**
   * 居中文本（水平+垂直）
   */
  public centerText(): Button {
    this.textAlignment = TextAlign.CENTER;
    this.verticalAlignment = VerticalAlign.MIDDLE;
    if (this.textComponent) {
      this.textComponent.center();
    }
    return this;
  }

  /**
   * 文本左对齐
   */
  public alignTextLeft(): Button {
    this.textAlignment = TextAlign.LEFT;
    if (this.textComponent) {
      this.textComponent.alignLeft();
    }
    return this;
  }

  /**
   * 文本右对齐
   */
  public alignTextRight(): Button {
    this.textAlignment = TextAlign.RIGHT;
    if (this.textComponent) {
      this.textComponent.alignRight();
    }
    return this;
  }

  // ==================== 拖拽功能 ====================

  /**
   * 启用/禁用拖拽功能
   * @param draggable 是否可拖拽
   */
  public setDraggable(draggable: boolean): Button {
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
   * @param callback 拖拽开始时调用
   */
  public setOnDragStart(callback: () => void): Button {
    this.onDragStart = callback;
    return this;
  }

  /**
   * 设置拖拽结束回调
   * @param callback 拖拽结束时调用，参数为最终的像素坐标
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): Button {
    this.onDragEnd = callback;
    return this;
  }

  /**
   * 设置拖拽过程中回调
   * @param callback 拖拽过程中调用，参数为当前像素坐标
   */
  public setOnDragging(callback: (x: number, y: number) => void): Button {
    this.onDragging = callback;
    return this;
  }

  /**
   * 获取鼠标在标准像素坐标系中的X坐标
   * 将游戏窗口内的鼠标坐标转换为标准 1920x1080 像素坐标
   */
  private getMousePixelX(): number {
    const windowWidth = DzGetWindowWidth();
    const mouseRelativeX = DzGetMouseXRelative();
    // 按比例转换为标准 1920 宽度的像素坐标
    return (mouseRelativeX / windowWidth) * ScreenCoordinates.STANDARD_WIDTH;
  }

  /**
   * 获取鼠标在标准像素坐标系中的Y坐标
   * 将游戏窗口内的鼠标坐标转换为标准 1920x1080 像素坐标
   */
  private getMousePixelY(): number {
    const windowHeight = DzGetWindowHeight();
    const mouseRelativeY = DzGetMouseYRelative();
    // 按比例转换为标准 1080 高度的像素坐标
    return (mouseRelativeY / windowHeight) * ScreenCoordinates.STANDARD_HEIGHT;
  }

  /**
   * 开始拖拽
   */
  private startDrag(): void {
    if (!this.isDraggable || this.isDragging) return;

    this.isDragging = true;

    // 获取游戏窗口内的鼠标坐标，并转换为标准 1920x1080 像素坐标
    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();

    // 计算鼠标相对于按钮左上角的偏移量（像素坐标）
    this.dragOffsetX = currentMouseX - this.pixelX;
    this.dragOffsetY = currentMouseY - this.pixelY;

    log.info("Drag started at mouse(" + currentMouseX + ", " + currentMouseY + "), offset(" + this.dragOffsetX + ", " + this.dragOffsetY + ")");

    // 触发拖拽开始回调
    if (this.onDragStart) {
      this.onDragStart();
    }

    // 创建定时器持续更新位置
    this.dragTimer = CreateTimer();
    TimerStart(this.dragTimer, 0.01, true, () => {
      this.updateDragPosition();
    });

    // 订阅全局鼠标左键松开事件（一次性）
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

    // 获取游戏窗口内的鼠标坐标，并转换为标准 1920x1080 像素坐标
    const currentMouseX = this.getMousePixelX();
    const currentMouseY = this.getMousePixelY();

    // 计算新的按钮位置
    const newX = currentMouseX - this.dragOffsetX;
    const newY = currentMouseY - this.dragOffsetY;

    // 更新按钮位置
    this.setPosition(newX, newY);

    // 触发拖拽过程回调
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

    // 停止定时器
    if (this.dragTimer) {
      PauseTimer(this.dragTimer);
      DestroyTimer(this.dragTimer);
      this.dragTimer = null;
    }

    // 取消订阅鼠标松开事件（如果还没有被触发的话）
    if (this.dragMouseUpId >= 0) {
      const mouseEvents = MouseEventManager.getInstance();
      mouseEvents.off(this.dragMouseUpId);
      this.dragMouseUpId = -1;
    }

    log.info("Drag ended at position(" + this.pixelX + ", " + this.pixelY + ")");

    // 触发拖拽结束回调
    if (this.onDragEnd) {
      this.onDragEnd(this.pixelX, this.pixelY);
    }
  }

  /**
   * 设置拖拽事件监听器
   * 订阅全局鼠标按下事件，当鼠标在按钮上按下时开始拖拽
   */
  private setupDragEventListeners(): void {
    if (this.dragMouseDownId >= 0) return; // 已经订阅了

    const mouseEvents = MouseEventManager.getInstance();

    // 订阅全局鼠标左键按下事件
    this.dragMouseDownId = mouseEvents.onMouseDown(() => {
      // 检查鼠标是否在按钮上（通过 isMouseOver 状态）
      if (this.isMouseOver && this.isDraggable && !this.isDragging && this.isEnabled) {
        this.startDrag();
      }
    }, MouseButton.LEFT);
  }

  /**
   * 清理拖拽事件监听器
   */
  private cleanupDragEventListeners(): void {
    const mouseEvents = MouseEventManager.getInstance();

    // 取消鼠标按下订阅
    if (this.dragMouseDownId >= 0) {
      mouseEvents.off(this.dragMouseDownId);
      this.dragMouseDownId = -1;
    }

    // 取消鼠标松开订阅（如果正在拖拽）
    if (this.dragMouseUpId >= 0) {
      mouseEvents.off(this.dragMouseUpId);
      this.dragMouseUpId = -1;
    }

    // 如果正在拖拽，结束拖拽
    if (this.isDragging) {
      this.endDrag();
    }
  }

  /**
   * 启用拖拽并配置（便捷方法）
   * @param config 拖拽配置
   */
  public enableDrag(config?: {
    onDragStart?: () => void;
    onDragEnd?: (x: number, y: number) => void;
    onDragging?: (x: number, y: number) => void;
  }): Button {
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
  public disableDrag(): Button {
    this.setDraggable(false);
    if (this.isDragging) {
      this.endDrag();
    }
    return this;
  }
}
