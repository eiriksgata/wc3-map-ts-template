import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { Panel } from "./Panel";
import { Button, ButtonTemplates } from "./Button";
import { Text, TextColors } from "./Text";
import { UIComponent } from "src/system/ui/UIComponent";
import { UIBackgrounds } from "src/constants/ui/preset";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { FrameEventUtils } from "src/constants/frame/utils";
import { createLogger } from "src/utils/logger";

const log = createLogger("GachaPanel");

/**
 * 抽卡卡片配置
 */
export interface GachaCardConfig {
  /** 顶部图标路径（BPL/TGA 等） */
  icon: string;
  /** 标题文本（一般为天赋/卡牌名称） */
  title: string;
  /** 内容介绍（可多行，会自动换行显示） */
  description: string;
  /** 左键点击回调（可选） */
  onClick?: () => void;
}

interface GachaCardView {
  button: Button;
  iconFrame: Frame | null;
  titleText: Text;
  descText: Text;
  hoverFrame: Frame | null;
}

/**
 * 抽卡 UI 面板
 * - 居中显示在屏幕中间
 * - 支持动态添加多张“卡片”
 * - 卡片为一排横向排列，整体始终居中
 * - 鼠标移入卡片时边框高亮（通过背景 Alpha 提升实现）
 */
export class GachaPanel implements UIComponent {
  private panel: Panel;
  private cards: GachaCardView[] = [];

  private panelWidth: number;
  private panelHeight: number;

  // 卡片布局配置（像素）
  // 默认做成偏大一点的长条卡牌，适合天赋说明
  private cardWidth: number = 260;
  private cardHeight: number = 280;
  private cardSpacing: number = 24;
  private contentPaddingTop: number = 40;
  private contentPaddingBottom: number = 40;
  // 卡片内部内容 padding（左右 / 上 / 下），避免图标和文字贴边
  private cardPaddingX: number = 24;
  private cardPaddingTop: number = 20;
  private cardPaddingBottom: number = 20;

  private isCreated: boolean = false;

  constructor(
    title: string = "抽卡",
    width: number = 900,
    height: number = 380
  ) {
    this.panelWidth = width;
    this.panelHeight = height;

    const centerX = (1920 - width) / 2;
    const centerY = (1080 - height) / 2;

    this.panel = new Panel(centerX, centerY, width, height);
    this.panel.setTitle(title);
  }

  /**
   * 在屏幕中心创建一个抽卡面板（便捷方法）
   * @param title 标题文本
   * @param width 面板宽度（像素）
   * @param height 面板高度（像素）
   * @param parent 父 Frame（可选）
   */
  public static createCentered(
    title: string = "抽卡",
    width: number = 900,
    height: number = 380,
    parent?: Frame
  ): GachaPanel {
    const gacha = new GachaPanel(title, width, height);
    gacha.create(parent);
    return gacha;
  }

  /**
   * 创建面板（只会执行一次）
   */
  public create(parent?: Frame): void {
    if (this.isCreated) return;

    this.panel
      .setShowTitleBar(true)
      .setShowCloseButton(true)
      .setBackground(UIBackgrounds.SHUIMO_STYLE_PANEL_BACKGROUND)
      .setAlpha(230)
      .setOnClose(() => {
        this.hide();
      });

    this.panel.create(parent);

    this.isCreated = true;
  }

  /**
   * 添加一张抽卡卡片
   * - 卡片使用 FDF 对话框模板作为背景
   * - 会自动按当前卡片数量重新居中排列
   */
  public addCard(config: GachaCardConfig): Button {
    if (!this.isCreated) {
      log.error("GachaPanel not created yet. Call create() first.");
      throw new Error("GachaPanel not created");
    }

    // 1. 创建卡片按钮（仅作为背景和点击区域，文本为空）
    const button = Button.createWithTemplate(
      "",
      0,
      0,
      this.cardWidth,
      this.cardHeight,
      ButtonTemplates.NORMAL_DIALOG,
      undefined,
      undefined
    );

    // 2. 在卡片内部创建“标题 + 描述”文本和顶部图标
    const backdrop = button.getBackdropFrame();

    // 初始先放到 (0,0)，稍后在 repositionCards 中统一布局
    const titleText = new Text(
      config.title,
      0,
      0,
      this.cardWidth - this.cardPaddingX * 2,
      26
    );
    titleText.create(backdrop || undefined);
    titleText
      .setColor(TextColors.GOLD)
      .setAlignPreset("CENTER", "MIDDLE")
      .setFontSizePixels(18);

    const descText = new Text(
      config.description,
      0,
      0,
      this.cardWidth - this.cardPaddingX * 2,
      this.cardHeight - (this.cardPaddingTop + this.cardPaddingBottom + 80)
    );
    descText.create(backdrop || undefined);
    descText
      .setColor(TextColors.WHITE)
      .setAlignPreset("LEFT", "TOP")
      .setFontSizePixels(12)
      .setPaddingTRBL(4, 4, 4, 4);

    let iconFrame: Frame | null = null;
    if (backdrop) {
      iconFrame = Frame.createType("GachaCardIcon", backdrop, 0, "BACKDROP", "") || null;
      if (iconFrame) {
        // 纹理先设置，具体位置在 repositionCards 中再计算
        iconFrame.setTexture(config.icon, 0, true);
      }
    }

    // 初始边框/背景透明度
    const normalAlpha = 200;
    const hoverAlpha = 255;

    button.setBackdropAlpha(normalAlpha);

    // 为了避免被内部 Text 的按钮层抢占事件，单独创建一层覆盖按钮来处理悬停和点击
    let hoverFrame: Frame | null = null;
    if (backdrop) {
      hoverFrame = Frame.createType("GachaCardHover", backdrop, 0, "BUTTON", "") || null;
      if (hoverFrame) {
        hoverFrame.setAllPoints(backdrop);
        FrameEventUtils.bindEvents(hoverFrame, {
          onMouseEnter: () => {
            button.setBackdropAlpha(hoverAlpha);
          },
          onMouseLeave: () => {
            button.setBackdropAlpha(normalAlpha);
          },
          onClick: () => {
            if (config.onClick) {
              config.onClick();
            }
          },
        });
      }
    }

    // 与面板可见性保持一致
    const visible = this.getVisible();
    button.setVisible(visible);
    titleText.setVisible(visible);
    descText.setVisible(visible);
    if (iconFrame) {
      iconFrame.setVisible(visible);
    }
    if (hoverFrame) {
      hoverFrame.setVisible(visible);
    }

    this.cards.push({
      button,
      iconFrame,
      titleText,
      descText,
      hoverFrame,
    });
    this.repositionCards();

    return button;
  }

  /**
   * 清空所有卡片
   */
  public clearCards(): void {
    this.cards.forEach(card => {
      card.button.destroy();
      card.titleText.destroy();
      card.descText.destroy();
      if (card.iconFrame) {
        card.iconFrame.destroy();
      }
       if (card.hoverFrame) {
         card.hoverFrame.destroy();
       }
    });
    this.cards = [];
  }

  /**
   * 获取所有卡片按钮
   */
  public getCards(): Button[] {
    return this.cards.map(c => c.button);
  }

  /**
   * 根据当前卡片数量，重新计算并设置每张卡片的位置
   */
  private repositionCards(): void {
    if (!this.isCreated || this.cards.length === 0) return;

    const contentPos = this.panel.getContentPosition();
    const contentSize = this.panel.getContentSize();

    const totalWidth =
      this.cards.length * this.cardWidth +
      (this.cards.length - 1) * this.cardSpacing;

    const startX = contentPos.x + (contentSize.width - totalWidth) / 2;
    const y = contentPos.y + this.contentPaddingTop;

    this.cards.forEach((cardView, index) => {
      const x = startX + index * (this.cardWidth + this.cardSpacing);
      cardView.button.setPosition(x, y);

      // 计算卡片内部布局：顶部图标 -> 标题 -> 描述
      const innerWidth = this.cardWidth - this.cardPaddingX * 2;
      const iconSize = Math.min(innerWidth, 64);
      const iconX = x + (this.cardWidth - iconSize) / 2;
      const iconY = y + this.cardPaddingTop;

      if (cardView.iconFrame) {
        const wc3Pos = ScreenCoordinates.pixelToWC3(iconX, iconY, ScreenCoordinates.ORIGIN_TOP_LEFT);
        const wc3Size = ScreenCoordinates.pixelSizeToWC3(iconSize, iconSize);
        const rightX = wc3Pos.x + wc3Size.width;
        const bottomY = wc3Pos.y - wc3Size.height;

        cardView.iconFrame
          .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
          .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
      }

      const titleX = x + this.cardPaddingX;
      const titleY = iconY + iconSize + 8;
      const titleWidth = innerWidth;
      const titleHeight = 26;

      cardView.titleText
        .setPosition(titleX, titleY)
        .setSize(titleWidth, titleHeight);

      const descX = x + this.cardPaddingX;
      const descY = titleY + titleHeight + 4;
      const descWidth = innerWidth;
      const descHeight = this.cardHeight - (descY - y) - this.cardPaddingBottom;

      cardView.descText
        .setPosition(descX, descY)
        .setSize(descWidth, descHeight);
    });
  }

  // ================ 布局与样式配置 ================

  /**
   * 设置卡片尺寸
   */
  public setCardSize(width: number, height: number): this {
    this.cardWidth = width;
    this.cardHeight = height;
    this.repositionCards();
    return this;
  }

  /**
   * 设置卡片间距
   */
  public setCardSpacing(spacing: number): this {
    this.cardSpacing = spacing;
    this.repositionCards();
    return this;
  }

  /**
   * 设置内容区域上下内边距（影响卡片整体纵向位置）
   */
  public setContentPadding(top: number, bottom: number): this {
    this.contentPaddingTop = top;
    this.contentPaddingBottom = bottom;
    this.repositionCards();
    return this;
  }

  /**
   * 设置卡片内部 padding（类似 CSS：左右、上、下）
   */
  public setCardInnerPadding(horizontal: number, top: number, bottom: number): this {
    this.cardPaddingX = horizontal;
    this.cardPaddingTop = top;
    this.cardPaddingBottom = bottom;
    this.repositionCards();
    return this;
  }

  /**
   * 设置面板位置（左上角像素坐标）
   */
  public setPosition(x: number, y: number): this {
    this.panel.setPosition(x, y);
    this.repositionCards();
    return this;
  }

  /**
   * 获取面板位置
   */
  public getPosition(): { x: number; y: number } {
    return this.panel.getPosition();
  }

  /**
   * 设置面板尺寸
   */
  public setSize(width: number, height: number): this {
    this.panelWidth = width;
    this.panelHeight = height;
    this.panel.setSize(width, height);
    this.repositionCards();
    return this;
  }

  /**
   * 获取面板尺寸
   */
  public getSize(): { width: number; height: number } {
    return this.panel.getSize();
  }

  /**
   * 设置是否可拖拽
   * - 拖拽时卡片会跟随面板一起移动
   */
  public setDraggable(draggable: boolean): this {
    if (draggable) {
      this.panel
        .setOnDragging((_x, _y) => {
          this.repositionCards();
        })
        .setOnDragEnd((_x, _y) => {
          this.repositionCards();
        });
    }
    this.panel.setDraggable(draggable);
    return this;
  }

  public getDraggable(): boolean {
    return this.panel.getDraggable();
  }

  // ================ 可见性 ================

  public setVisible(visible: boolean): this {
    this.panel.setVisible(visible);
    this.cards.forEach(card => {
      card.button.setVisible(visible);
      card.titleText.setVisible(visible);
      card.descText.setVisible(visible);
      if (card.iconFrame) {
        card.iconFrame.setVisible(visible);
      }
      if (card.hoverFrame) {
        card.hoverFrame.setVisible(visible);
      }
    });
    return this;
  }

  public getVisible(): boolean {
    return this.panel.getVisible();
  }

  public show(): this {
    return this.setVisible(true);
  }

  public hide(): this {
    return this.setVisible(false);
  }

  public toggle(): this {
    const visible = this.getVisible();
    return this.setVisible(!visible);
  }

  // ================ 标题与样式代理 ================

  public setTitle(title: string): this {
    this.panel.setTitle(title);
    return this;
  }

  public getTitle(): string {
    return this.panel.getTitle();
  }

  public setBackground(texturePath: string): this {
    this.panel.setBackground(texturePath);
    return this;
  }

  public setBackgroundPreset(preset: keyof typeof UIBackgrounds): this {
    this.panel.setBackgroundPreset(preset);
    return this;
  }

  public setAlpha(alpha: number): this {
    this.panel.setAlpha(alpha);
    return this;
  }

  public setTitleColor(hexColor: string): this {
    this.panel.setTitleColor(hexColor);
    return this;
  }

  // ================ 内部组件访问 ================

  public getPanel(): Panel {
    return this.panel;
  }

  // ================ 销毁 ================

  public destroy(): void {
    this.clearCards();
    this.panel.destroy();
    this.isCreated = false;
  }
}

