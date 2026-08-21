import { Frame, FRAMEPOINT_TOPLEFT, FRAMEPOINT_BOTTOMRIGHT } from "@eiriksgata/wc3ts/*";

import { ScreenCoordinates } from "../ScreenCoordinates";
import { createLogger } from "src/utils/logger";

const log = createLogger("Tips");

/**
 * Tips 动画类型
 */
export enum TipsAnimation {
  /** 无动画 */
  NONE = "none",
  /** 淡入淡出 */
  FADE = "fade",
  /** 从右侧滑入 */
  SLIDE_RIGHT = "slideRight",
  /** 从左侧滑入 */
  SLIDE_LEFT = "slideLeft",
  /** 从上方滑入 */
  SLIDE_TOP = "slideTop",
  /** 从下方滑入 */
  SLIDE_BOTTOM = "slideBottom",
}

/**
 * Tips 显示位置
 */
export enum TipsPosition {
  /** 自动检测（根据屏幕边界） */
  AUTO = "auto",
  /** 右侧 */
  RIGHT = "right",
  /** 左侧 */
  LEFT = "left",
  /** 上方 */
  TOP = "top",
  /** 下方 */
  BOTTOM = "bottom",
}

/**
 * Tips 配置
 */
export interface TipsConfig {
  /**
   * 提示正文。建议为**纯文本**，由 `textColor` 统一着色。
   * 若已自行写入魔兽颜色码（含 `|` 的 `|cff…|r` 等），将**不再**外包一层颜色，避免嵌套导致渲染异常或崩溃。
   */
  text: string;
  /** 文本颜色（十六进制，不含#） */
  textColor?: string;
  /** 背景纹理路径 */
  background?: string;
  /** 图标路径（可选） */
  icon?: string;
  /** 宽度（像素） */
  width?: number;
  /** 最大高度（像素）；自适应开启时作为内容上限制 */
  maxHeight?: number;
  /**
   * 为 true（默认）时按正文宽度估算高度，整体不超过 maxHeight；
   * 为 false 时面板高度固定为 maxHeight（与旧行为一致）。
   */
  autoHeight?: boolean;
  /** 估算行高（像素），用于 autoHeight，默认 18 */
  lineHeightPx?: number;
  /** 估算每字符占位宽度（像素），用于自动换行，默认 9（中英混排近似） */
  charWidthPx?: number;
  /** 显示位置偏好 */
  position?: TipsPosition;
  /** 动画类型 */
  animation?: TipsAnimation;
  /** 延迟显示时间（秒） */
  delayShow?: number;
  /** 延迟隐藏时间（秒） */
  delayHide?: number;
  /** 距离目标的偏移距离（像素） */
  offset?: number;
}

/**
 * Tips 组件 - 单例模式
 * 用于显示鼠标悬停提示、技能说明、物品介绍等
 * 
 * @example
 * ```typescript
 * const tips = Tips.getInstance();
 * const info = button.getComponentInfo();
 * tips.showFromComponentInfo({
 *   text: "技能说明…",
 *   textColor: "FFD700",
 *   icon: "ReplaceableTextures\\CommandButtons\\BTNFireBolt.blp",
 *   position: TipsPosition.AUTO,
 *   animation: TipsAnimation.NONE,
 *   delayShow: 0,
 * }, info);
 * tips.hide();
 * ```
 */
export class Tips {
  private static instance: Tips | null = null;

  // Frame 组件
  private backdropFrame: Frame | null = null;
  private iconFrame: Frame | null = null;
  private textFrame: Frame | null = null;

  // 状态
  private isVisible: boolean = false;
  private isCreated: boolean = false;
  private currentConfig: TipsConfig | null = null;
  private componentWidth: number = 100;  // 目标组件宽度（像素）
  private componentHeight: number = 40;  // 目标组件高度（像素）

  /** 最近一次布局后的 Tips 像素尺寸（用于贴边与边界检测） */
  private lastTipsWidthPx: number = 300;
  private lastTipsHeightPx: number = 400;

  // 定时器
  private showTimer: timer | null = null;
  private hideTimer: timer | null = null;
  private animationTimer: timer | null = null;

  // 动画状态
  private currentAlpha: number = 0;
  private targetAlpha: number = 255;
  private animationProgress: number = 0;

  // 最终位置（用于滑动动画）
  private finalPositionX: number = 0;
  private finalPositionY: number = 0;

  // 默认配置
  private static readonly DEFAULT_WIDTH = 300;
  private static readonly DEFAULT_MAX_HEIGHT = 400;
  private static readonly DEFAULT_BACKGROUND = "UI\\Widgets\\EscMenu\\Human\\editbox-background.blp";
  private static readonly DEFAULT_TEXT_COLOR = "FFFFFF";
  private static readonly DEFAULT_DELAY_SHOW = 0.3; // 秒
  private static readonly DEFAULT_DELAY_HIDE = 0.1; // 秒
  private static readonly DEFAULT_OFFSET = 10; // 像素
  private static readonly DEFAULT_LINE_HEIGHT_PX = 18;
  private static readonly DEFAULT_CHAR_WIDTH_PX = 9;
  private static readonly MIN_TIPS_HEIGHT_PX = 32;
  private static readonly ANIMATION_DURATION = 0.15; // 动画持续时间（秒）
  private static readonly ANIMATION_FPS = 30; // 动画帧率

  /**
   * 将正文设为可显示字符串：纯文本时外包一层 |cff{color}|r；已含 `|` 控制符时不再包裹，避免嵌套崩溃。
   */
  private static formatDisplayText(raw: string, hexColor: string): string {
    if (raw === undefined || raw === null) {
      return "";
    }
    const hex =
      hexColor && hexColor.length >= 6 ? hexColor : Tips.DEFAULT_TEXT_COLOR;
    if (raw.indexOf("|") >= 0) {
      return raw;
    }
    return `|cff${hex}${raw}|r`;
  }

  private static isHexDigit(ch: string): boolean {
    const c = ch.charAt(0);
    return (
      (c >= "0" && c <= "9") ||
      (c >= "a" && c <= "f") ||
      (c >= "A" && c <= "F")
    );
  }

  /** 去掉魔兽颜色码与 |n，便于按「可见字符」估算换行（与引擎换行近似） */
  private static stripWarcraftColorCodes(s: string): string {
    if (!s) return "";
    let r = "";
    let i = 0;
    while (i < s.length) {
      if (s.charAt(i) === "|" && i + 3 < s.length && s.substring(i, i + 4) === "|cff") {
        let j = i + 4;
        let hexDigits = 0;
        while (j < s.length && hexDigits < 8 && Tips.isHexDigit(s.charAt(j))) {
          hexDigits++;
          j++;
        }
        if (hexDigits === 6 || hexDigits === 8) {
          i = j;
          continue;
        }
      }
      if (s.charAt(i) === "|" && i + 1 < s.length && s.substring(i, i + 2) === "|r") {
        i += 2;
        continue;
      }
      if (s.charAt(i) === "|" && i + 1 < s.length && s.substring(i, i + 2) === "|n") {
        r += "\n";
        i += 2;
        continue;
      }
      r += s.charAt(i);
      i++;
    }
    return r;
  }

  /**
   * 在给定内容宽度下估算正文像素高度（多行、自动换行近似）。
   */
  private static estimateTextHeightPx(
    displayText: string,
    textWidthPx: number,
    lineHeightPx: number,
    charWidthPx: number
  ): number {
    if (textWidthPx <= 0) {
      return Tips.MIN_TIPS_HEIGHT_PX;
    }
    const plain = Tips.stripWarcraftColorCodes(displayText);
    const charsPerLine = Math.max(1, Math.floor(textWidthPx / charWidthPx));
    const parts = plain.split("\n");
    let lineCount = 0;
    for (const part of parts) {
      const len = part.length;
      if (len === 0) {
        lineCount += 1;
      } else {
        lineCount += Math.max(1, Math.ceil(len / charsPerLine));
      }
    }
    const h = lineCount * lineHeightPx;
    return Math.max(Tips.MIN_TIPS_HEIGHT_PX, h);
  }

  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  /**
   * 获取 Tips 单例
   */
  public static getInstance(): Tips {
    if (!Tips.instance) {
      Tips.instance = new Tips();
    }
    // 确保已创建
    if (!Tips.instance.isCreated) {
      Tips.instance.create();
    }
    return Tips.instance;
  }

  /**
   * 创建 Tips UI
   */
  private create(): void {
    if (this.isCreated) return;

    const gameUI = Frame.fromHandle(DzGetGameUI());
    if (!gameUI) {
      log.error("Cannot get game UI frame");
      return;
    }

    const timestamp = math.floor(os.clock() * 1000);
    // Frame.createType 第三参为 createContext，必须传 0；层级请用 DzFrameSetPriority，禁止误传 1000 等
    this.backdropFrame = Frame.createType(`TipsBackdrop_${timestamp}`, gameUI, 0, "BACKDROP", "") || null;
    if (!this.backdropFrame) {
      log.error("Failed to create backdrop frame");
      return;
    }

    this.backdropFrame
      .setSize(0.2, 0.15)
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.4, 0.5)
      .setTexture(Tips.DEFAULT_BACKGROUND, 0, true)
      .setAlpha(0); // 初始透明

    DzFrameSetPriority(this.backdropFrame.handle, 1000);
    // 不拦截鼠标：否则 Tips 盖住触发控件时会误触 mouse leave → hide → 再 enter，振荡甚至崩溃
    this.backdropFrame.setIgnoreTrackEvents(true);

    // 创建图标框架（可选，初始隐藏）
    this.iconFrame = Frame.createType(`TipsIcon_${timestamp}`, this.backdropFrame, 0, "BACKDROP", "") || null;
    if (this.iconFrame) {
      this.iconFrame
        .setSize(0.03, 0.03)
        .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, 0.005, -0.005)
        .setAlpha(0);
      this.iconFrame.setIgnoreTrackEvents(true);
    }

    // 创建文本框架
    this.textFrame = Frame.createType(`TipsText_${timestamp}`, this.backdropFrame, 0, "TEXT", "") || null;
    if (!this.textFrame) {
      log.error("Failed to create text frame");
      return;
    }

    this.textFrame
      .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, 0.005, -0.005)
      .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.backdropFrame, FRAMEPOINT_BOTTOMRIGHT, -0.005, 0.005)
      .setText("")
      .setTextAlignment(0, 50) // 左对齐，垂直居中
      .setAlpha(0);
    this.textFrame.setIgnoreTrackEvents(true);

    this.isCreated = true;
    this.isVisible = false;
  }

  /**
   * 从组件信息显示 Tips（推荐使用 Button.getComponentInfo()）
   * @param config Tips 配置
   * @param componentInfo 组件信息对象 { frame, x, y, width, height }
   */
  public showFromComponentInfo(
    config: TipsConfig,
    componentInfo: { frame?: Frame | null; x: number; y: number; width: number; height: number }
  ): void {
    this.show(config, componentInfo.x, componentInfo.y, componentInfo.width, componentInfo.height);
  }

  /**
   * 显示 Tips
   * @param config Tips 配置
   * @param targetPixelX 目标像素 X 坐标
   * @param targetPixelY 目标像素 Y 坐标
   * @param componentWidth 目标组件宽度（像素）
   * @param componentHeight 目标组件高度（像素）
   */
  public show(
    config: TipsConfig,
    targetPixelX?: number,
    targetPixelY?: number,
    componentWidth: number = 100,
    componentHeight: number = 40
  ): void {
    if (!this.isCreated) {
      this.create();
      if (!this.isCreated) {
        return;
      }
    }

    // 取消之前的定时器和动画（立即停止任何进行中的动画）
    this.cancelTimers();

    // 保存配置和目标
    this.currentConfig = config;
    this.componentWidth = componentWidth;
    this.componentHeight = componentHeight;

    // 如果已经可见，直接更新内容，不重新播放动画（避免抖动）
    if (this.isVisible) {
      this.doShow(config, targetPixelX, targetPixelY);
      return;
    }

    // 设置延迟显示
    const delayShow = config.delayShow ?? Tips.DEFAULT_DELAY_SHOW;

    if (delayShow > 0) {
      const timer = CreateTimer();
      this.showTimer = timer;
      TimerStart(timer, delayShow, false, () => {
        this.doShow(config, targetPixelX, targetPixelY);
      });
    } else {
      this.doShow(config, targetPixelX, targetPixelY);
    }
  }

  /**
   * 执行显示逻辑
   */
  private doShow(
    config: TipsConfig,
    targetPixelX?: number,
    targetPixelY?: number
  ): void {
    if (!this.backdropFrame || !this.textFrame) return;

    // 更新内容
    this.updateContent(config);

    // 计算位置
    const position = this.calculatePosition(config, targetPixelX, targetPixelY);

    // 设置位置
    this.backdropFrame.setAbsPoint(FRAMEPOINT_TOPLEFT, position.x, position.y);

    // 如果已经可见，只更新内容和位置，不重新播放动画
    if (this.isVisible && this.currentAlpha >= 200) {
      // 确保完全可见
      this.setAlpha(255);
      return;
    }

    // 设置为可见（避免阻挡鼠标事件）
    this.setVisible(true);

    // 执行动画
    const animation = config.animation ?? TipsAnimation.FADE;
    this.playAnimation(animation, true);

    this.isVisible = true;
  }

  /**
   * 隐藏 Tips
   */
  public hide(): void {
    if (!this.isCreated) return;

    // 取消所有定时器（包括延迟显示）
    this.cancelTimers();

    // 如果当前不可见或已经在隐藏中，直接返回
    if (!this.isVisible) return;

    const delayHide = this.currentConfig?.delayHide ?? Tips.DEFAULT_DELAY_HIDE;

    if (delayHide > 0) {
      const timer = CreateTimer();
      this.hideTimer = timer;
      TimerStart(timer, delayHide, false, () => {
        this.doHide();
      });
    } else {
      this.doHide();
    }
  }

  /**
   * 执行隐藏逻辑
   */
  private doHide(): void {
    if (!this.isVisible) return;

    const animation = this.currentConfig?.animation ?? TipsAnimation.FADE;
    this.playAnimation(animation, false);

    this.isVisible = false;
    this.currentConfig = null;

    // 设置为不可见（避免阻挡鼠标事件）
    this.setVisible(false);
  }

  /**
   * 更新 Tips 内容
   */
  private updateContent(config: TipsConfig): void {
    if (!this.backdropFrame || !this.textFrame) return;

    const widthPx = config.width ?? Tips.DEFAULT_WIDTH;
    const maxHeightPx = config.maxHeight ?? Tips.DEFAULT_MAX_HEIGHT;
    const autoHeight = config.autoHeight !== false;
    const lineHeightPx =
      config.lineHeightPx ?? Tips.DEFAULT_LINE_HEIGHT_PX;
    const charWidthPx =
      config.charWidthPx ?? Tips.DEFAULT_CHAR_WIDTH_PX;

    const wc3Width =
      (widthPx / ScreenCoordinates.STANDARD_WIDTH) *
      ScreenCoordinates.WC3_SCREEN_WIDTH;

    const textColor = config.textColor ?? Tips.DEFAULT_TEXT_COLOR;
    const displayText = Tips.formatDisplayText(config.text, textColor);

    const iconSizePx = 32;
    const iconPaddingPx = 8;
    const leftPaddingPx = 8;
    const topPaddingPx = 8;
    const rightPaddingPx = 8;
    const bottomPaddingPx = 8;

    const wc3IconSize =
      (iconSizePx / ScreenCoordinates.STANDARD_WIDTH) *
      ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3IconPadding =
      (iconPaddingPx / ScreenCoordinates.STANDARD_WIDTH) *
      ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3LeftPadding =
      (leftPaddingPx / ScreenCoordinates.STANDARD_WIDTH) *
      ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3TopPadding =
      (topPaddingPx / ScreenCoordinates.STANDARD_HEIGHT) *
      ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const wc3RightPadding =
      (rightPaddingPx / ScreenCoordinates.STANDARD_WIDTH) *
      ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3BottomPadding =
      (bottomPaddingPx / ScreenCoordinates.STANDARD_HEIGHT) *
      ScreenCoordinates.WC3_SCREEN_HEIGHT;

    let textWidthPx: number;
    let backdropHeightPx: number;

    if (config.icon) {
      textWidthPx =
        widthPx -
        leftPaddingPx -
        iconSizePx -
        iconPaddingPx -
        rightPaddingPx;
      if (autoHeight) {
        const textBlockH = Tips.estimateTextHeightPx(
          displayText,
          textWidthPx,
          lineHeightPx,
          charWidthPx
        );
        const innerH = Math.max(iconSizePx, textBlockH);
        backdropHeightPx = topPaddingPx + innerH + bottomPaddingPx;
        backdropHeightPx = Math.min(backdropHeightPx, maxHeightPx);
        backdropHeightPx = Math.max(backdropHeightPx, Tips.MIN_TIPS_HEIGHT_PX);
      } else {
        backdropHeightPx = maxHeightPx;
      }

      if (this.iconFrame) {
        this.iconFrame.setVisible(true);
        this.iconFrame
          .setSize(wc3IconSize, wc3IconSize)
          .setTexture(config.icon, 0, true)
          .clearPoints()
          .setPoint(
            FRAMEPOINT_TOPLEFT,
            this.backdropFrame,
            FRAMEPOINT_TOPLEFT,
            wc3LeftPadding,
            -wc3TopPadding
          )
          .setAlpha(0);
      }

      const textLeftOffset = wc3LeftPadding + wc3IconSize + wc3IconPadding;
      const textHeightPx = Math.max(
        1,
        backdropHeightPx - topPaddingPx - bottomPaddingPx
      );
      const wc3TextHeight =
        (textHeightPx / ScreenCoordinates.STANDARD_HEIGHT) *
        ScreenCoordinates.WC3_SCREEN_HEIGHT;
      const textWidthWc3 =
        (textWidthPx / ScreenCoordinates.STANDARD_WIDTH) *
        ScreenCoordinates.WC3_SCREEN_WIDTH;

      this.textFrame.clearPoints();
      this.textFrame.setPoint(
        FRAMEPOINT_TOPLEFT,
        this.backdropFrame,
        FRAMEPOINT_TOPLEFT,
        textLeftOffset,
        -wc3TopPadding
      );
      this.textFrame.setSize(textWidthWc3, wc3TextHeight);
    } else {
      textWidthPx = widthPx - leftPaddingPx - rightPaddingPx;
      if (autoHeight) {
        const textBlockH = Tips.estimateTextHeightPx(
          displayText,
          textWidthPx,
          lineHeightPx,
          charWidthPx
        );
        backdropHeightPx = topPaddingPx + textBlockH + bottomPaddingPx;
        backdropHeightPx = Math.min(backdropHeightPx, maxHeightPx);
        backdropHeightPx = Math.max(backdropHeightPx, Tips.MIN_TIPS_HEIGHT_PX);
      } else {
        backdropHeightPx = maxHeightPx;
      }

      if (this.iconFrame) {
        this.iconFrame.setVisible(false);
      }

      const textHeightPx = Math.max(
        1,
        backdropHeightPx - topPaddingPx - bottomPaddingPx
      );
      const wc3TextHeight =
        (textHeightPx / ScreenCoordinates.STANDARD_HEIGHT) *
        ScreenCoordinates.WC3_SCREEN_HEIGHT;
      const textWidthWc3 =
        (textWidthPx / ScreenCoordinates.STANDARD_WIDTH) *
        ScreenCoordinates.WC3_SCREEN_WIDTH;

      this.textFrame.clearPoints();
      this.textFrame.setPoint(
        FRAMEPOINT_TOPLEFT,
        this.backdropFrame,
        FRAMEPOINT_TOPLEFT,
        wc3LeftPadding,
        -wc3TopPadding
      );
      this.textFrame.setSize(textWidthWc3, wc3TextHeight);
    }

    const wc3BackdropHeight =
      (backdropHeightPx / ScreenCoordinates.STANDARD_HEIGHT) *
      ScreenCoordinates.WC3_SCREEN_HEIGHT;

    this.backdropFrame
      .setSize(wc3Width, wc3BackdropHeight)
      .setTexture(config.background ?? Tips.DEFAULT_BACKGROUND, 0, true);

    this.textFrame
      .setText(displayText)
      .setTextAlignment(0, 0);

    this.lastTipsWidthPx = widthPx;
    this.lastTipsHeightPx = backdropHeightPx;
  }

  /**
   * 计算 Tips 显示位置
   */
  private calculatePosition(
    config: TipsConfig,
    targetPixelX?: number,
    targetPixelY?: number
  ): { x: number; y: number } {
    // 获取目标位置（像素）
    let pixelX: number;
    let pixelY: number;

    if (targetPixelX !== undefined && targetPixelY !== undefined) {
      pixelX = targetPixelX;
      pixelY = targetPixelY;
    } else {
      // 默认位置：屏幕中心
      pixelX = ScreenCoordinates.STANDARD_WIDTH / 2;
      pixelY = ScreenCoordinates.STANDARD_HEIGHT / 2;
    }

    // Tips 尺寸（与 updateContent 中 lastTips* 一致，已含自适应高度）
    const tipsWidth = this.lastTipsWidthPx;
    const tipsHeight = this.lastTipsHeightPx;
    const offset = config.offset ?? Tips.DEFAULT_OFFSET;

    // 确定显示位置
    let position = config.position ?? TipsPosition.AUTO;

    if (position === TipsPosition.AUTO) {
      // 自动检测最佳位置
      position = this.detectBestPosition(pixelX, pixelY, tipsWidth, tipsHeight, offset);
    }

    // 根据位置计算坐标（考虑目标组件的尺寸）
    let finalPixelX: number;
    let finalPixelY: number;

    switch (position) {
      case TipsPosition.RIGHT:
        // 显示在组件右侧
        finalPixelX = pixelX + this.componentWidth + offset;
        finalPixelY = pixelY;
        break;
      case TipsPosition.LEFT:
        // 显示在组件左侧
        finalPixelX = pixelX - tipsWidth - offset;
        finalPixelY = pixelY;
        break;
      case TipsPosition.TOP:
        // 显示在组件上方
        finalPixelX = pixelX;
        finalPixelY = pixelY - tipsHeight - offset;
        break;
      case TipsPosition.BOTTOM:
        // 显示在组件下方
        finalPixelX = pixelX;
        finalPixelY = pixelY + this.componentHeight + offset;
        break;
      default:
        finalPixelX = pixelX + this.componentWidth + offset;
        finalPixelY = pixelY;
    }

    // 边界检查，确保不超出屏幕
    finalPixelX = Math.max(10, Math.min(finalPixelX, ScreenCoordinates.STANDARD_WIDTH - tipsWidth - 10));
    finalPixelY = Math.max(10, Math.min(finalPixelY, ScreenCoordinates.STANDARD_HEIGHT - tipsHeight - 10));

    // 转换为 WC3 坐标
    const wc3X = (finalPixelX / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Y = ScreenCoordinates.WC3_SCREEN_HEIGHT - (finalPixelY / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    // 保存最终位置（用于滑动动画）
    this.finalPositionX = wc3X;
    this.finalPositionY = wc3Y;

    return { x: wc3X, y: wc3Y };
  }

  /**
   * 检测最佳显示位置（根据目标组件在屏幕中的位置智能选择）
   * @param pixelX 组件左上角 X 坐标（像素）
   * @param pixelY 组件左上角 Y 坐标（像素）
   * @param tipsWidth Tips 宽度（像素）
   * @param tipsHeight Tips 高度（像素）
   * @param offset 偏移量（像素）
   */
  private detectBestPosition(
    pixelX: number,
    pixelY: number,
    tipsWidth: number,
    tipsHeight: number,
    offset: number
  ): TipsPosition {
    const screenWidth = ScreenCoordinates.STANDARD_WIDTH;
    const screenHeight = ScreenCoordinates.STANDARD_HEIGHT;

    // 组件中心点坐标
    const componentCenterX = pixelX + this.componentWidth / 2;
    const componentCenterY = pixelY + this.componentHeight / 2;

    // 计算各个方向的可用空间（从组件边缘开始计算）
    const spaceRight = screenWidth - (pixelX + this.componentWidth) - offset;
    const spaceLeft = pixelX - offset;
    const spaceTop = pixelY - offset;
    const spaceBottom = screenHeight - (pixelY + this.componentHeight) - offset;

    // 判断组件在屏幕中的位置（分为 9 个区域）
    const isLeft = componentCenterX < screenWidth / 3;
    const isRight = componentCenterX > (screenWidth * 2) / 3;
    const isTop = componentCenterY < screenHeight / 3;
    const isBottom = componentCenterY > (screenHeight * 2) / 3;

    // 根据位置选择最佳方向
    // 优先级：远离边缘的方向

    // 右上角 -> 优先左侧或下方
    if (isRight && isTop) {
      if (spaceLeft >= tipsWidth) {
        return TipsPosition.LEFT;
      } else if (spaceBottom >= tipsHeight) {
        return TipsPosition.BOTTOM;
      }
    }

    // 右下角 -> 优先左侧或上方
    if (isRight && isBottom) {
      if (spaceLeft >= tipsWidth) {
        return TipsPosition.LEFT;
      } else if (spaceTop >= tipsHeight) {
        return TipsPosition.TOP;
      }
    }

    // 左上角 -> 优先右侧或下方
    if (isLeft && isTop) {
      if (spaceRight >= tipsWidth) {
        return TipsPosition.RIGHT;
      } else if (spaceBottom >= tipsHeight) {
        return TipsPosition.BOTTOM;
      }
    }

    // 左下角 -> 优先右侧或上方
    if (isLeft && isBottom) {
      if (spaceRight >= tipsWidth) {
        return TipsPosition.RIGHT;
      } else if (spaceTop >= tipsHeight) {
        return TipsPosition.TOP;
      }
    }

    // 右侧（不在角落）-> 优先左侧
    if (isRight && spaceLeft >= tipsWidth) {
      return TipsPosition.LEFT;
    }

    // 左侧（不在角落）-> 优先右侧
    if (isLeft && spaceRight >= tipsWidth) {
      return TipsPosition.RIGHT;
    }

    // 顶部（不在角落）-> 优先下方
    if (isTop && spaceBottom >= tipsHeight) {
      return TipsPosition.BOTTOM;
    }

    // 底部（不在角落）-> 优先上方
    if (isBottom && spaceTop >= tipsHeight) {
      return TipsPosition.TOP;
    }

    // 中心区域：默认优先右侧，其次左侧，然后下方，最后上方
    if (spaceRight >= tipsWidth) {
      return TipsPosition.RIGHT;
    } else if (spaceLeft >= tipsWidth) {
      return TipsPosition.LEFT;
    } else if (spaceBottom >= tipsHeight) {
      return TipsPosition.BOTTOM;
    } else if (spaceTop >= tipsHeight) {
      return TipsPosition.TOP;
    }

    // 如果都不够，选择空间最大的方向
    const maxSpace = Math.max(spaceRight, spaceLeft, spaceTop, spaceBottom);
    if (maxSpace === spaceRight) return TipsPosition.RIGHT;
    if (maxSpace === spaceLeft) return TipsPosition.LEFT;
    if (maxSpace === spaceBottom) return TipsPosition.BOTTOM;
    return TipsPosition.TOP;
  }

  /**
   * 播放动画
   */
  private playAnimation(animation: TipsAnimation, isShowing: boolean): void {
    // 取消之前的动画
    if (this.animationTimer) {
      DestroyTimer(this.animationTimer as any);
      this.animationTimer = null;
    }

    this.animationProgress = 0;
    this.currentAlpha = isShowing ? 0 : 255;
    this.targetAlpha = isShowing ? 255 : 0;

    if (animation === TipsAnimation.NONE) {
      // 无动画，直接设置
      this.setAlpha(this.targetAlpha);
      // 如果是隐藏，设置为不可见（避免阻挡鼠标事件）
      if (!isShowing) {
        this.setVisible(false);
      }
      return;
    }

    // 计算滑动动画的起始偏移量（转换为 WC3 坐标）
    const slideDistance = 20; // 像素
    const slideOffsetWC3 = ScreenCoordinates.pixelToWC3(slideDistance, 0).x;
    let startOffsetX = 0;
    let startOffsetY = 0;

    // 根据动画类型设置初始偏移
    if (isShowing) {
      switch (animation) {
        case TipsAnimation.SLIDE_RIGHT:
          startOffsetX = -slideOffsetWC3; // 从左侧滑入
          break;
        case TipsAnimation.SLIDE_LEFT:
          startOffsetX = slideOffsetWC3; // 从右侧滑入
          break;
        case TipsAnimation.SLIDE_TOP:
          startOffsetY = -slideOffsetWC3; // 从下方滑入
          break;
        case TipsAnimation.SLIDE_BOTTOM:
          startOffsetY = slideOffsetWC3; // 从上方滑入
          break;
      }
    }

    // 保存目标位置
    const targetX = this.finalPositionX;
    const targetY = this.finalPositionY;

    // 启动动画定时器
    const interval = 1.0 / Tips.ANIMATION_FPS;
    const totalSteps = Tips.ANIMATION_DURATION * Tips.ANIMATION_FPS;

    const timer = CreateTimer();
    this.animationTimer = timer;
    TimerStart(timer, interval, true, () => {
      this.animationProgress += 1 / totalSteps;

      if (this.animationProgress >= 1.0) {
        // 动画完成
        this.animationProgress = 1.0;
        this.setAlpha(this.targetAlpha);

        // 确保位置回到目标位置
        if (this.backdropFrame && animation !== TipsAnimation.FADE) {
          this.backdropFrame.clearPoints();
          this.backdropFrame.setAbsPoint(FRAMEPOINT_TOPLEFT, targetX, targetY);
        }

        // 如果是隐藏动画，设置为不可见（避免阻挡鼠标事件）
        if (!isShowing) {
          this.setVisible(false);
        }

        if (this.animationTimer) {
          DestroyTimer(this.animationTimer as any);
          this.animationTimer = null;
        }
        return;
      }

      // 计算缓动进度（easeOutCubic）
      const eased = 1 - Math.pow(1 - this.animationProgress, 3);

      // 更新透明度
      const alpha = this.currentAlpha + (this.targetAlpha - this.currentAlpha) * eased;
      this.setAlpha(Math.floor(alpha));

      // 更新滑动位置
      if (animation !== TipsAnimation.FADE && this.backdropFrame) {
        const currentOffsetX = startOffsetX * (1 - eased);
        const currentOffsetY = startOffsetY * (1 - eased);

        this.backdropFrame.clearPoints();
        this.backdropFrame.setAbsPoint(
          FRAMEPOINT_TOPLEFT,
          targetX + currentOffsetX,
          targetY + currentOffsetY
        );
      }
    });
  }

  /**
   * 设置透明度
   */
  private setAlpha(alpha: number): void {
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    if (this.textFrame) {
      this.textFrame.setAlpha(alpha);
    }
    // 只在有图标配置时才设置图标透明度
    if (this.iconFrame && this.currentConfig?.icon) {
      this.iconFrame.setAlpha(alpha);
    }
  }

  /**
   * 设置可见性（避免透明 Frame 阻挡鼠标事件）
   */
  private setVisible(visible: boolean): void {
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(visible);
    }
    if (this.textFrame) {
      this.textFrame.setVisible(visible);
    }
    // iconFrame 的可见性由 updateContent 控制，这里只在隐藏时统一设置
    if (!visible && this.iconFrame) {
      this.iconFrame.setVisible(false);
    }
  }

  /**
   * 取消所有定时器
   */
  private cancelTimers(): void {
    if (this.showTimer) {
      DestroyTimer(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      DestroyTimer(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.animationTimer) {
      DestroyTimer(this.animationTimer);
      this.animationTimer = null;
    }
  }

  /**
   * 销毁 Tips（通常不需要调用，单例会一直存在）
   */
  public destroy(): void {
    this.cancelTimers();

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }
    if (this.iconFrame) {
      this.iconFrame.destroy();
      this.iconFrame = null;
    }
    if (this.textFrame) {
      this.textFrame.destroy();
      this.textFrame = null;
    }

    this.isCreated = false;
    this.isVisible = false;
    Tips.instance = null;
  }

  /**
   * 检查是否可见
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }
}
