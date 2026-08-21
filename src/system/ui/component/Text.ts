import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";

import { DraggableMixin, IDraggableComponent } from "./UIComponentBase";
import { FrameEventUtils } from "src/constants/frame/utils";

/**
 * 文本对齐方式
 */
export const TextAlign = {
  /** 左对齐 */
  LEFT: 0,
  /** 居中对齐 */
  CENTER: 50,
  /** 右对齐 */
  RIGHT: 100,
} as const;

/**
 * 垂直对齐方式
 */
export const VerticalAlign = {
  /** 顶部对齐 */
  TOP: 0,
  /** 垂直居中 */
  MIDDLE: 50,
  /** 底部对齐 */
  BOTTOM: 100,
} as const;

/**
 * 常用背景纹理预设
 */
export const TextBackgrounds = {
  /** 无背景（透明） */
  NONE: "",
  /** 黑色半透明 */
  BLACK_TRANSPARENT: "UI\\Widgets\\EscMenu\\Human\\editbox-background.blp",
  /** 工具提示背景 */
  TOOLTIP: "UI\\Widgets\\ToolTips\\Human\\human-tooltip-background.blp",
  /** 对话框背景 */
  DIALOG: "UI\\Widgets\\Glues\\GlueScreen-DialogBackground.blp",
  /** 人族边框 */
  HUMAN_BORDER: "UI\\Widgets\\print\\Human\\CommandButton\\human-multipleselection-border.blp",
  /** 任务背景 */
  QUEST: "UI\\Widgets\\Quests\\QuestMainBackdrop.blp",
} as const;

/**
 * 预设颜色
 */
export const TextColors = {
  /** 白色 */
  WHITE: "FFFFFF",
  /** 黑色 */
  BLACK: "000000",
  /** 红色 */
  RED: "FF0000",
  /** 绿色 */
  GREEN: "00FF00",
  /** 蓝色 */
  BLUE: "0000FF",
  /** 黄色 */
  YELLOW: "FFFF00",
  /** 橙色 */
  ORANGE: "FFA500",
  /** 紫色 */
  PURPLE: "800080",
  /** 青色 */
  CYAN: "00FFFF",
  /** 粉色 */
  PINK: "FFC0CB",
  /** 金色 */
  GOLD: "FFD700",
  /** 银色 */
  SILVER: "C0C0C0",
  /** 灰色 */
  GRAY: "808080",
} as const;

/**
 * 尺寸预设
 */
export const TextSizes = {
  /** 小文本 */
  SMALL: { width: 100, height: 20 },
  /** 中等文本 */
  MEDIUM: { width: 200, height: 30 },
  /** 大文本 */
  LARGE: { width: 300, height: 40 },
  /** 标题 */
  TITLE: { width: 400, height: 50 },
  /** 自适应（需要手动设置） */
  AUTO: { width: 0, height: 0 },
} as const;

/**
 * 字体预设
 */
export const TextFonts = {
  /** 默认字体（不设置） */
  DEFAULT: "",
  /** 自定义字体示例 */
  CUSTOM: "UI\\hpbar\\ZiTi.ttf",
  /** 主字体 */
  MASTER: "Fonts\\FZXH1JW.TTF",
} as const;

/**
 * 位置预设类型
 */
export type PositionPreset = 
  | 'TOP_LEFT' 
  | 'TOP_RIGHT' 
  | 'BOTTOM_LEFT' 
  | 'BOTTOM_RIGHT'
  | 'TOP_CENTER' 
  | 'BOTTOM_CENTER' 
  | 'LEFT_CENTER' 
  | 'RIGHT_CENTER'
  | 'CENTER'
  | 'UI_TOP_LEFT' 
  | 'UI_TOP_RIGHT' 
  | 'UI_BOTTOM_LEFT' 
  | 'UI_BOTTOM_RIGHT';

/**
 * 字体大小预设（WC3坐标系）
 */
export const FontSizes = {
  /** 微小 (8px) */
  TINY: 0.008,
  /** 小 (10px) */
  SMALL: 0.010,
  /** 中等 (12px) */
  MEDIUM: 0.012,
  /** 大 (14px) */
  LARGE: 0.014,
  /** 超大 (16px) */
  XLARGE: 0.016,
  /** 标题 (20px) */
  TITLE: 0.020,
  /** 巨大 (24px) */
  HUGE: 0.024,
} as const;

/**
 * Text类 - 文本显示组件
 * 包含: 背景框架(Backdrop，可选) + 文本框架(Text)
 * 支持拖拽功能
 */
export class Text implements IDraggableComponent {
  private content: string;
  private pixelX: number;
  private pixelY: number;
  private pixelWidth: number;
  private pixelHeight: number;
  
  private backdropFrame: Frame | null = null;
  private textFrame: Frame | null = null;
  private buttonFrame: Frame | null = null;  // 用于事件检测
  
  private isVisible: boolean = true;
  private isEnabled: boolean = true;
  
  // 拖拽功能
  private draggable: DraggableMixin;
  
  private background: string = TextBackgrounds.NONE;
  private showBackground: boolean = false;
  
  private textColor: string = TextColors.WHITE;
  private horizontalAlign: number = TextAlign.LEFT;
  private verticalAlign: number = VerticalAlign.TOP;
  
  // 字体相关
  private fontPath: string = "";  // 空字符串表示使用默认字体
  private fontSize: number = FontSizes.MEDIUM;  // WC3坐标系字体大小
  private fontFlags: number = 0;  // 字体标志
  
  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;
  
  // 内边距（像素）
  private paddingTop: number = 0;
  private paddingRight: number = 0;
  private paddingBottom: number = 0;
  private paddingLeft: number = 0;
  
  // 自适应相关
  private autoWidth: boolean = false;
  private autoHeight: boolean = false;
  private minWidth: number = 50;
  private minHeight: number = 20;
  private maxWidth: number = 800;
  private maxHeight: number = 600;
  
  // 字符宽度估算（像素）
  private static readonly CHAR_WIDTH = 10;
  private static readonly LINE_HEIGHT = 18;

  constructor(
    content: string,
    x: number,
    y: number,
    width: number = 200,
    height: number = 30,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ) {
    this.content = content;
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = origin;
    
    // 初始化拖拽功能
    this.draggable = new DraggableMixin(this);
  }

  // ==================== 静态工厂方法 ====================

  /**
   * 使用尺寸预设创建文本（自动调用create）
   */
  public static createWithPreset(
    content: string,
    x: number,
    y: number,
    sizePreset: keyof typeof TextSizes = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Text {
    const size = TextSizes[sizePreset];
    const text = new Text(content, x, y, size.width, size.height, origin);
    if (sizePreset === 'AUTO') {
      text.setAutoSize(true, true);
    }
    text.create(parent);
    return text;
  }

  /**
   * 在预设位置创建文本（自动调用create）
   * @param content 文本内容
   * @param positionPreset 位置预设，可选值：
   *   - 角落: 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'
   *   - 边缘中心: 'TOP_CENTER', 'BOTTOM_CENTER', 'LEFT_CENTER', 'RIGHT_CENTER'
   *   - 屏幕中心: 'CENTER'
   *   - UI安全区域: 'UI_TOP_LEFT', 'UI_TOP_RIGHT', 'UI_BOTTOM_LEFT', 'UI_BOTTOM_RIGHT'
   * @param sizePreset 尺寸预设
   * @param centered 是否居中于预设位置
   * @param parent 父框架
   */
  public static createAtPresetPosition(
    content: string,
    positionPreset: PositionPreset,
    sizePreset: keyof typeof TextSizes = 'MEDIUM',
    centered: boolean = true,
    parent?: Frame
  ): Text {
    const position = ScreenCoordinates.getPresetPosition(positionPreset);
    const size = TextSizes[sizePreset];
    
    let x = position.x;
    let y = position.y;
    
    if (centered && sizePreset !== 'AUTO') {
      x = position.x - size.width / 2;
      y = position.y - size.height / 2;
    }
    
    const text = new Text(content, x, y, size.width, size.height);
    if (sizePreset === 'AUTO') {
      text.setAutoSize(true, true);
    }
    text.create(parent);
    return text;
  }

  /**
   * 在屏幕中心创建文本（便捷方法）
   */
  public static createCentered(
    content: string,
    sizePreset: keyof typeof TextSizes = 'MEDIUM',
    parent?: Frame
  ): Text {
    return Text.createAtPresetPosition(content, 'CENTER', sizePreset, true, parent);
  }

  /**
   * 创建带背景的文本
   */
  public static createWithBackground(
    content: string,
    x: number,
    y: number,
    width: number = 200,
    height: number = 30,
    background: string = TextBackgrounds.BLACK_TRANSPARENT,
    parent?: Frame
  ): Text {
    const text = new Text(content, x, y, width, height);
    text.setBackground(background);
    text.create(parent);
    return text;
  }

  // ==================== 核心方法 ====================

  public create(parent?: Frame): void {
    if (this.textFrame) {
      // Text already created
      return;
    }

    const parentFrame = parent || Frame.fromHandle(DzGetGameUI())!;
    const isGameUI = !parent || parent.handle === DzGetGameUI();

    // 如果启用自适应，先计算尺寸
    if (this.autoWidth || this.autoHeight) {
      this.calculateAutoSize();
    }

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    // 计算 padding 的 WC3 坐标值（用于背景和文本）
    const paddingTopWC3 = (this.paddingTop / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const paddingRightWC3 = (this.paddingRight / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const paddingBottomWC3 = (this.paddingBottom / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const paddingLeftWC3 = (this.paddingLeft / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;

    // 如果需要背景，先创建背景框架（背景覆盖整个区域，不受 padding 影响）
    if (this.showBackground && this.background !== "") {
      this.backdropFrame = Frame.createType("BACKDROP", parentFrame, 0, 'BACKDROP', "")!;
      if (this.backdropFrame !== null) {
        // 总是使用绝对坐标（setAbsPoint在WC3中始终是绝对坐标，即使有parent）
        this.backdropFrame
          .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
          .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
          .setTexture(this.background, 0, true);
      }
    }

    // 创建文本框架（应用 padding 内边距）
    const textParent = this.backdropFrame || parentFrame;
    this.textFrame = Frame.createType("TEXT", textParent, 0, "TEXT", "")!;
    
    if (!this.textFrame) {
      // Error: Failed to create text frame
      return;
    }

    // 总是使用绝对坐标（setAbsPoint在WC3中始终是绝对坐标，即使有parent）
    // 因此传入的pixelX和pixelY必须是绝对屏幕坐标
    this.textFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x + paddingLeftWC3, wc3Pos.y - paddingTopWC3)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX - paddingRightWC3, bottomY + paddingBottomWC3)
      .setText(this.getFormattedText())
      .setTextAlignment(this.horizontalAlign, this.verticalAlign);

    // 应用字体设置
    if (this.fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }

    // 创建透明按钮层用于鼠标事件检测（仅在需要拖拽时）
    this.buttonFrame = Frame.createType("BUTTON", textParent, 0, "BUTTON", "")!;
    if (this.buttonFrame !== null) {
      // 总是使用绝对坐标
      this.buttonFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
      
      // 设置鼠标事件
      this.setupMouseEvents();
    }

    this.setVisible(this.isVisible);
  }

  /**
   * 设置鼠标事件监听
   */
  private setupMouseEvents(): void {
    if (!this.buttonFrame) return;

    FrameEventUtils.bindEvents(this.buttonFrame, {
      onMouseEnter: () => {
        this.draggable.setMouseOver(true);
      },
      onMouseLeave: () => {
        this.draggable.setMouseOver(false);
      }
    });
  }

  // ==================== 文本内容 ====================

  /**
   * 设置文本内容
   */
  public setText(content: string): Text {
    this.content = content;
    if (this.textFrame) {
      // 如果启用自适应，重新计算尺寸
      if (this.autoWidth || this.autoHeight) {
        this.calculateAutoSize();
        this.updateFramePositions();
      }
      this.textFrame.setText(this.getFormattedText());
    }
    return this;
  }

  /**
   * 获取文本内容
   */
  public getText(): string {
    return this.content;
  }

  /**
   * 追加文本
   */
  public appendText(text: string): Text {
    return this.setText(this.content + text);
  }

  /**
   * 清空文本
   */
  public clearText(): Text {
    return this.setText("");
  }

  // ==================== 颜色设置 ====================

  /**
   * 设置文本颜色（十六进制）
   * @param hexColor 十六进制颜色，如 "FF0000"
   */
  public setColor(hexColor: string): Text {
    this.textColor = hexColor;
    if (this.textFrame) {
      this.textFrame.setText(this.getFormattedText());
    }
    return this;
  }

  /**
   * 使用预设颜色
   */
  public setColorPreset(preset: keyof typeof TextColors): Text {
    return this.setColor(TextColors[preset]);
  }

  /**
   * 设置RGB颜色
   */
  public setColorRGB(r: number, g: number, b: number): Text {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return this.setColor(toHex(r) + toHex(g) + toHex(b));
  }

  /**
   * 获取当前颜色
   */
  public getColor(): string {
    return this.textColor;
  }

  // ==================== 字体设置 ====================

  /**
   * 设置字体
   * @param fontPath 字体文件路径（如 "Fonts\\FZXH1JW.TTF" 或 "UI\\hpbar\\ZiTi.ttf"）
   * @param fontSize 字体大小（WC3坐标系，如 0.012）
   * @param flags 字体标志（默认0）
   */
  public setFont(fontPath: string, fontSize?: number, flags?: number): Text {
    this.fontPath = fontPath;
    if (fontSize !== undefined) {
      this.fontSize = fontSize;
    }
    if (flags !== undefined) {
      this.fontFlags = flags;
    }
    
    if (this.textFrame && fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }
    return this;
  }

  /**
   * 使用预设字体
   * @param preset 字体预设
   * @param size 字体大小预设（可选）
   */
  public setFontPreset(preset: keyof typeof TextFonts, size?: keyof typeof FontSizes): Text {
    this.fontPath = TextFonts[preset];
    if (size !== undefined) {
      this.fontSize = FontSizes[size];
    }
    
    if (this.textFrame && this.fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }
    return this;
  }

  /**
   * 设置字体大小
   * @param size WC3坐标系字体大小（如 0.012）
   */
  public setFontSize(size: number): Text {
    this.fontSize = size;
    if (this.textFrame && this.fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }
    return this;
  }

  /**
   * 使用预设字体大小
   * @param preset 字体大小预设
   */
  public setFontSizePreset(preset: keyof typeof FontSizes): Text {
    return this.setFontSize(FontSizes[preset]);
  }

  /**
   * 设置字体大小（像素值，自动转换为WC3坐标系）
   * @param pixelSize 像素大小（如 12, 14, 16）
   */
  public setFontSizePixels(pixelSize: number): Text {
    // 将像素大小转换为WC3坐标系大小
    // 基于标准 1080 高度，WC3 高度 0.6
    const wc3Size = (pixelSize / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    return this.setFontSize(wc3Size);
  }

  /**
   * 获取当前字体路径
   */
  public getFontPath(): string {
    return this.fontPath;
  }

  /**
   * 获取当前字体大小
   */
  public getFontSize(): number {
    return this.fontSize;
  }

  // ==================== 对齐设置 ====================

  /**
   * 设置水平对齐方式
   * @param align 0=左对齐, 50=居中, 100=右对齐
   */
  public setHorizontalAlign(align: number): Text {
    this.horizontalAlign = align;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(this.horizontalAlign, this.verticalAlign);
    }
    return this;
  }

  /**
   * 设置垂直对齐方式
   * @param align 0=顶部, 50=居中, 100=底部
   */
  public setVerticalAlign(align: number): Text {
    this.verticalAlign = align;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(this.horizontalAlign, this.verticalAlign);
    }
    return this;
  }

  /**
   * 同时设置水平和垂直对齐
   */
  public setAlignment(horizontal: number, vertical: number): Text {
    this.horizontalAlign = horizontal;
    this.verticalAlign = vertical;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(this.horizontalAlign, this.verticalAlign);
    }
    return this;
  }

  /**
   * 使用预设对齐方式
   */
  public setAlignPreset(
    horizontal: keyof typeof TextAlign, 
    vertical: keyof typeof VerticalAlign = 'TOP'
  ): Text {
    return this.setAlignment(TextAlign[horizontal], VerticalAlign[vertical]);
  }

  /**
   * 居中对齐（水平+垂直）
   */
  public center(): Text {
    return this.setAlignment(TextAlign.CENTER, VerticalAlign.MIDDLE);
  }

  /**
   * 左对齐
   */
  public alignLeft(): Text {
    return this.setHorizontalAlign(TextAlign.LEFT);
  }

  /**
   * 右对齐
   */
  public alignRight(): Text {
    return this.setHorizontalAlign(TextAlign.RIGHT);
  }

  // ==================== 背景设置 ====================

  /**
   * 设置背景纹理
   */
  public setBackground(texturePath: string): Text {
    this.background = texturePath;
    this.showBackground = texturePath !== "";
    
    if (this.textFrame && this.showBackground && !this.backdropFrame) {
      // 需要重新创建以添加背景
      this.recreate();
    } else if (this.backdropFrame) {
      if (texturePath === "") {
        this.backdropFrame.setVisible(false);
      } else {
        this.backdropFrame.setTexture(texturePath, 0, true);
        this.backdropFrame.setVisible(true);
      }
    }
    return this;
  }

  /**
   * 使用预设背景
   */
  public setBackgroundPreset(preset: keyof typeof TextBackgrounds): Text {
    return this.setBackground(TextBackgrounds[preset]);
  }

  /**
   * 显示/隐藏背景
   */
  public setShowBackground(show: boolean): Text {
    this.showBackground = show;
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(show);
    }
    return this;
  }


  /**
   * 设置背景透明度
   * @param alpha 透明度 (0-255)
   */
  public setBackdropAlpha(alpha: number): Text {
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    return this;
  }

  // ==================== 内边距设置 (Padding) ====================

  /**
   * 设置所有方向的内边距（类似 CSS padding: 10px）
   * @param padding 内边距（像素）
   */
  public setPadding(padding: number): Text {
    this.paddingTop = padding;
    this.paddingRight = padding;
    this.paddingBottom = padding;
    this.paddingLeft = padding;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置垂直和水平方向的内边距（类似 CSS padding: 10px 20px）
   * @param vertical 上下内边距（像素）
   * @param horizontal 左右内边距（像素）
   */
  public setPaddingVH(vertical: number, horizontal: number): Text {
    this.paddingTop = vertical;
    this.paddingBottom = vertical;
    this.paddingLeft = horizontal;
    this.paddingRight = horizontal;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置四个方向的内边距（类似 CSS padding: 10px 20px 15px 25px）
   * @param top 上内边距（像素）
   * @param right 右内边距（像素）
   * @param bottom 下内边距（像素）
   * @param left 左内边距（像素）
   */
  public setPaddingTRBL(top: number, right: number, bottom: number, left: number): Text {
    this.paddingTop = top;
    this.paddingRight = right;
    this.paddingBottom = bottom;
    this.paddingLeft = left;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置上内边距
   */
  public setPaddingTop(padding: number): Text {
    this.paddingTop = padding;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置右内边距
   */
  public setPaddingRight(padding: number): Text {
    this.paddingRight = padding;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置下内边距
   */
  public setPaddingBottom(padding: number): Text {
    this.paddingBottom = padding;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置左内边距
   */
  public setPaddingLeft(padding: number): Text {
    this.paddingLeft = padding;
    this.updateFramePositions();
    return this;
  }

  /**
   * 获取内边距
   */
  public getPadding(): { top: number; right: number; bottom: number; left: number } {
    return {
      top: this.paddingTop,
      right: this.paddingRight,
      bottom: this.paddingBottom,
      left: this.paddingLeft
    };
  }

  // ==================== 自适应尺寸 ====================

  /**
   * 启用/禁用自适应尺寸
   * @param autoWidth 自适应宽度
   * @param autoHeight 自适应高度
   */
  public setAutoSize(autoWidth: boolean, autoHeight: boolean = false): Text {
    this.autoWidth = autoWidth;
    this.autoHeight = autoHeight;
    
    if ((autoWidth || autoHeight) && this.textFrame) {
      this.calculateAutoSize();
      this.updateFramePositions();
    }
    return this;
  }

  /**
   * 设置自适应尺寸的限制
   */
  public setAutoSizeLimits(
    minWidth: number, maxWidth: number,
    minHeight: number, maxHeight: number
  ): Text {
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    return this;
  }

  /**
   * 计算自适应尺寸
   */
  private calculateAutoSize(): void {
    // 移除颜色代码来计算实际文本长度
    const plainText = this.removeColorCodes(this.content);
    const lines = plainText.split('\n');
    
    if (this.autoWidth) {
      // 找出最长的行
      let maxLineLength = 0;
      for (const line of lines) {
        if (line.length > maxLineLength) {
          maxLineLength = line.length;
        }
      }
      const calculatedWidth = maxLineLength * Text.CHAR_WIDTH + this.paddingLeft + this.paddingRight;
      this.pixelWidth = Math.max(this.minWidth, Math.min(this.maxWidth, calculatedWidth));
    }
    
    if (this.autoHeight) {
      const calculatedHeight = lines.length * Text.LINE_HEIGHT + this.paddingTop + this.paddingBottom;
      this.pixelHeight = Math.max(this.minHeight, Math.min(this.maxHeight, calculatedHeight));
    }
  }

  // ==================== 位置和尺寸 ====================

  /**
   * 设置位置
   */
  public setPosition(x: number, y: number): Text {
    this.pixelX = x;
    this.pixelY = y;
    this.updateFramePositions();
    return this;
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
   * 获取启用状态（实现 IDraggableComponent 接口）
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * 设置启用状态
   */
  public setEnabled(enabled: boolean): Text {
    this.isEnabled = enabled;
    return this;
  }

  /**
   * 设置尺寸
   */
  public setSize(width: number, height: number): Text {
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.autoWidth = false;
    this.autoHeight = false;
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
    if (!this.textFrame) return;

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    
    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    // 计算 padding 的 WC3 坐标值
    const paddingTopWC3 = (this.paddingTop / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const paddingRightWC3 = (this.paddingRight / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const paddingBottomWC3 = (this.paddingBottom / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const paddingLeftWC3 = (this.paddingLeft / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;

    // 更新背景（背景覆盖整个区域）
    if (this.backdropFrame) {
      this.backdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
    }

    // 更新按钮层（用于鼠标事件）
    if (this.buttonFrame) {
      this.buttonFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
    }

    // 更新文本（应用 padding）
    this.textFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x + paddingLeftWC3, wc3Pos.y - paddingTopWC3)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX - paddingRightWC3, bottomY + paddingBottomWC3);
  }

  // ==================== 可见性 ====================

  /**
   * 设置可见性
   */
  public setVisible(visible: boolean): Text {
    this.isVisible = visible;
    if (this.textFrame) {
      this.textFrame.setVisible(visible);
    }
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(visible && this.showBackground);
    }
    if (this.buttonFrame) {
      this.buttonFrame.setVisible(visible);
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
  public show(): Text {
    return this.setVisible(true);
  }

  /**
   * 隐藏
   */
  public hide(): Text {
    return this.setVisible(false);
  }

  /**
   * 切换可见性
   */
  public toggle(): Text {
    return this.setVisible(!this.isVisible);
  }

  // ==================== 透明度 ====================

  /**
   * 设置文本透明度
   * @param alpha 透明度 (0-255)
   */
  public setAlpha(alpha: number): Text {
    if (this.textFrame) {
      this.textFrame.setAlpha(alpha);
    }
    return this;
  }

  // ==================== 获取框架 ====================

  /**
   * 获取文本框架
   */
  public getTextFrame(): Frame | null {
    return this.textFrame;
  }

  /**
   * 获取背景框架
   */
  public getBackdropFrame(): Frame | null {
    return this.backdropFrame;
  }

  // ==================== 辅助方法 ====================

  /**
   * 获取带颜色格式的文本
   */
  private getFormattedText(): string {
    return "|cff" + this.textColor + this.content + "|r";
  }

  /**
   * 移除WC3颜色代码
   * 由于 TSTL 不支持正则表达式，使用手动字符串处理
   * @param text 包含颜色代码的文本
   * @returns 移除颜色代码后的纯文本
   */
  private removeColorCodes(text: string): string {
    let result = "";
    let i = 0;
    
    while (i < text.length) {
      // 检查是否是颜色代码开始 |c
      if (i + 1 < text.length && text[i] === '|' && text[i + 1] === 'c') {
        // 跳过 |c 和后面的 8 个十六进制字符 (共10个字符)
        i += 10;
      }
      // 检查是否是颜色结束符 |r
      else if (i + 1 < text.length && text[i] === '|' && text[i + 1] === 'r') {
        // 跳过 |r (2个字符)
        i += 2;
      }
      else {
        result += text[i];
        i++;
      }
    }
    
    return result;
  }

  /**
   * 重新创建组件
   */
  private recreate(): void {
    const parent = this.textFrame ? undefined : undefined; // 保持原有父级
    this.destroy();
    this.create(parent);
  }

  /**
   * 配置多个属性
   */
  public configure(config: {
    text?: string;
    color?: string;
    horizontalAlign?: number;
    verticalAlign?: number;
    background?: string;
    visible?: boolean;
    alpha?: number;
    fontPath?: string;
    fontSize?: number;
    draggable?: boolean;
  }): Text {
    if (config.text !== undefined) this.setText(config.text);
    if (config.color !== undefined) this.setColor(config.color);
    if (config.horizontalAlign !== undefined) this.setHorizontalAlign(config.horizontalAlign);
    if (config.verticalAlign !== undefined) this.setVerticalAlign(config.verticalAlign);
    if (config.background !== undefined) this.setBackground(config.background);
    if (config.visible !== undefined) this.setVisible(config.visible);
    if (config.alpha !== undefined) this.setAlpha(config.alpha);
    if (config.fontPath !== undefined) this.setFont(config.fontPath, config.fontSize);
    else if (config.fontSize !== undefined) this.setFontSize(config.fontSize);
    if (config.draggable !== undefined) this.setDraggable(config.draggable);
    
    return this;
  }

  // ==================== 拖拽功能 ====================

  /**
   * 启用/禁用拖拽功能
   * @param draggable 是否可拖拽
   */
  public setDraggable(draggable: boolean): Text {
    this.draggable.setEnabled(draggable);
    return this;
  }

  /**
   * 获取是否启用了拖拽
   */
  public getDraggable(): boolean {
    return this.draggable.getEnabled();
  }

  /**
   * 获取是否正在拖拽
   */
  public getIsDragging(): boolean {
    return this.draggable.getIsDragging();
  }

  /**
   * 设置拖拽开始回调
   */
  public setOnDragStart(callback: () => void): Text {
    this.draggable.setOnDragStart(callback);
    return this;
  }

  /**
   * 设置拖拽结束回调
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): Text {
    this.draggable.setOnDragEnd(callback);
    return this;
  }

  /**
   * 设置拖拽过程回调
   */
  public setOnDragging(callback: (x: number, y: number) => void): Text {
    this.draggable.setOnDragging(callback);
    return this;
  }

  /**
   * 启用拖拽并配置（便捷方法）
   */
  public enableDrag(config?: {
    onDragStart?: () => void;
    onDragEnd?: (x: number, y: number) => void;
    onDragging?: (x: number, y: number) => void;
  }): Text {
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
  public disableDrag(): Text {
    this.setDraggable(false);
    return this;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    // 清理拖拽资源
    this.draggable.cleanup();

    if (this.buttonFrame) {
      this.buttonFrame.destroy();
      this.buttonFrame = null;
    }

    if (this.textFrame) {
      this.textFrame.destroy();
      this.textFrame = null;
    }

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }
  }
}
