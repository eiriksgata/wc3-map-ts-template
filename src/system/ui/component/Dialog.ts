import { Frame } from "@eiriksgata/wc3ts/*";
import { Panel } from "./Panel";
import { Button } from "./Button";
import { Text, TextColors } from "./Text";
import { UIComponent } from "src/system/ui/UIComponent";
import { UIBackgrounds } from "src/constants/ui/preset";
import { createLogger } from "src/utils/logger";

const log = createLogger("Dialog");

/**
 * 对话框按钮配置
 */
export interface DialogButtonConfig {
  /** 按钮文本 */
  text: string;
  /** 按钮点击回调 */
  onClick?: () => void;
  /** 鼠标悬停回调 */
  onHover?: () => void;
  /** 鼠标离开回调 */
  onLeave?: () => void;
  /** 按钮颜色（十六进制） */
  color?: string;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * Dialog 类 - 对话框组件
 * 继承自 Panel，提供标题和可动态添加按钮的对话框
 * 
 * @example
 * ```typescript
 * // 创建对话框
 * const dialog = new Dialog("选择难度", 400, 300);
 * dialog.create();
 * 
 * // 添加按钮
 * dialog.addButton({
 *   text: "简单",
 *   onClick: () => {
 *     print("选择了简单难度");
 *     dialog.hide();
 *   }
 * });
 * 
 * dialog.addButton({
 *   text: "困难",
 *   onClick: () => {
 *     print("选择了困难难度");
 *     dialog.hide();
 *   }
 * });
 * 
 * // 显示对话框
 * dialog.show();
 * ```
 */
export class Dialog implements UIComponent {
  private panel: Panel;
  private titleText: Text | null = null;
  private buttons: Button[] = [];

  private title: string;
  private dialogWidth: number;
  private dialogHeight: number;
  private buttonStartY: number = 70;
  private buttonSpacing: number = 65;
  private buttonHeight: number = 50;
  private buttonWidthRatio: number = 0.8; // 按钮宽度占对话框宽度的比例

  private isCreated: boolean = false;

  // 用户自定义的拖拽回调
  private userOnDragStart: (() => void) | null = null;
  private userOnDragEnd: ((x: number, y: number) => void) | null = null;
  private userOnDragging: ((x: number, y: number) => void) | null = null;

  constructor(
    title: string,
    width: number = 500,
    height: number = 300
  ) {
    this.title = title;
    this.dialogWidth = width;
    this.dialogHeight = height;

    // 创建居中的面板
    const centerX = (1920 - width) / 2;
    const centerY = (1080 - height) / 2;

    this.panel = new Panel(centerX, centerY, width, height);
  }

  // ==================== 静态工厂方法 ====================

  /**
   * 创建居中的对话框
   * @param title 标题
   * @param width 宽度
   * @param height 高度
   * @param parent 父框架
   */
  public static createCentered(
    title: string,
    width: number = 500,
    height: number = 300,
    parent?: Frame
  ): Dialog {
    const dialog = new Dialog(title, width, height);
    dialog.create(parent);
    return dialog;
  }

  /**
   * 创建确认对话框（是/否）
   * @param title 标题
   * @param message 消息内容
   * @param onYes 点击"是"的回调
   * @param onNo 点击"否"的回调
   * @param parent 父框架
   */
  public static createConfirm(
    title: string,
    message: string,
    onYes: () => void,
    onNo?: () => void,
    parent?: Frame
  ): Dialog {
    const dialog = new Dialog(title, 400, 250);
    dialog.create(parent);

    // 添加消息文本
    const contentPos = dialog.getContentPosition();
    const contentSize = dialog.getContentSize();

    const messageText = new Text(
      message,
      contentPos.x + 30,
      contentPos.y + 20,
      contentSize.width - 60,
      60
    );
    messageText.create(dialog.getContentFrame()!);
    messageText
      .setColor(TextColors.WHITE)
      .setAlignment(50, 50) // 居中
      .setFontSizePixels(14);

    // 添加按钮
    dialog.addButton({
      text: "是",
      onClick: () => {
        onYes();
        dialog.hide();
      },
      color: TextColors.GREEN
    });

    dialog.addButton({
      text: "否",
      onClick: () => {
        if (onNo) onNo();
        dialog.hide();
      },
      color: TextColors.RED
    });

    return dialog;
  }

  /**
   * 创建选择对话框
   * @param title 标题
   * @param options 选项列表
   * @param onSelect 选择回调，参数为选项索引
   * @param parent 父框架
   */
  public static createChoice(
    title: string,
    options: string[],
    onSelect: (index: number) => void,
    parent?: Frame
  ): Dialog {
    const height = Math.min(300 + options.length * 50, 700);
    const dialog = new Dialog(title, 450, height);
    dialog.create(parent);

    options.forEach((option, index) => {
      dialog.addButton({
        text: option,
        onClick: () => {
          onSelect(index);
          dialog.hide();
        }
      });
    });

    return dialog;
  }

  // ==================== 核心方法 ====================

  public create(parent?: Frame): void {
    if (this.isCreated) {
      return;
    }

    // 在创建前配置面板（标题栏需要在 create() 时就知道要显示）
    this.panel
      .setTitle(this.title)
      .setTitleColor(TextColors.BLACK)
      .setShowTitleBar(true)
      .setShowCloseButton(true)
      .setBackground(UIBackgrounds.SHUIMO_STYLE_PANEL_BACKGROUND)
      .setAlpha(240)
      .setOnClose(() => {
        this.hide();
      });

    // 创建面板（此时会根据配置创建标题栏）
    this.panel.create(parent);

    this.isCreated = true;


  }

  // ==================== 按钮管理 ====================

  /**
   * 添加按钮
   * @param config 按钮配置
   */
  public addButton(config: DialogButtonConfig): Button {
    if (!this.isCreated) {
      log.error("Dialog not created yet. Call create() first.");
      throw new Error("Dialog not created");
    }

    const buttonIndex = this.buttons.length;

    // 获取内容区域的绝对位置
    const contentPos = this.panel.getContentPosition();

    // 计算按钮位置（使用绝对屏幕坐标）
    const buttonWidth = this.dialogWidth * this.buttonWidthRatio;
    const buttonX = contentPos.x + (this.dialogWidth - buttonWidth) / 2;
    const buttonY = contentPos.y + this.buttonStartY + buttonIndex * this.buttonSpacing;

    log.info("Creating button at absolute position: x=" + buttonX + ", y=" + buttonY + ", width=" + buttonWidth);

    // 使用 FDF 模板创建按钮（使用绝对坐标）
    const button = Button.createWithTemplatePreset(
      config.text,
      buttonX,
      buttonY,
      buttonWidth,
      this.buttonHeight,
      'NORMAL_UP'  // 使用 normal_button_up 模板
    );

    // 配置按钮
    button.centerText();

    if (config.color) {
      button.setTextColor(config.color);
    }

    if (config.onClick) {
      button.setOnClick(config.onClick);
    }

    if (config.onHover) {
      button.setOnHover(config.onHover);
    }

    if (config.onLeave) {
      button.setOnLeave(config.onLeave);
    }

    if (config.enabled !== undefined) {
      button.setEnabled(config.enabled);
    }

    // 添加悬停效果
    button.addHoverEffect(200, 255);

    // 同步按钮的可见性状态（如果对话框当前隐藏，按钮也应该隐藏）
    button.setVisible(this.getVisible());

    this.buttons.push(button);

    // 如果按钮太多，自动调整对话框高度
    const requiredHeight = this.buttonStartY + (buttonIndex + 1) * this.buttonSpacing + 50;
    if (requiredHeight > this.dialogHeight) {
      const newHeight = requiredHeight + 20;
      this.setSize(this.dialogWidth, newHeight);
    }

    return button;
  }

  /**
   * 获取指定索引的按钮
   * @param index 按钮索引
   */
  public getButton(index: number): Button | null {
    return this.buttons[index] || null;
  }

  /**
   * 获取所有按钮
   */
  public getButtons(): Button[] {
    return this.buttons;
  }

  /**
   * 移除指定索引的按钮
   * @param index 按钮索引
   */
  public removeButton(index: number): void {
    const button = this.buttons[index];
    if (button !== undefined) {
      button.destroy();
      this.buttons.splice(index, 1);

      // 重新排列剩余按钮
      this.repositionButtons();
    }
  }

  /**
   * 清除所有按钮
   */
  public clearButtons(): void {
    this.buttons.forEach(button => button.destroy());
    this.buttons = [];
  }

  /**
   * 重新排列按钮位置
   */
  private repositionButtons(): void {
    const contentPos = this.panel.getContentPosition();
    const buttonWidth = this.dialogWidth * this.buttonWidthRatio;
    const buttonX = contentPos.x + (this.dialogWidth - buttonWidth) / 2;

    this.buttons.forEach((button, index) => {
      const buttonY = contentPos.y + this.buttonStartY + index * this.buttonSpacing;
      button.setPosition(buttonX, buttonY);
    });
  }

  // ==================== 布局配置 ====================

  /**
   * 设置按钮起始Y坐标（相对于内容区域）
   * @param y Y坐标
   */
  public setButtonStartY(y: number): Dialog {
    this.buttonStartY = y;
    this.repositionButtons();
    return this;
  }

  /**
   * 设置按钮间距
   * @param spacing 间距（像素）
   */
  public setButtonSpacing(spacing: number): Dialog {
    this.buttonSpacing = spacing;
    this.repositionButtons();
    return this;
  }

  /**
   * 设置按钮高度
   * @param height 高度（像素）
   */
  public setButtonHeight(height: number): Dialog {
    this.buttonHeight = height;
    // 注意：已创建的按钮不会自动更新高度
    return this;
  }

  /**
   * 设置按钮宽度比例
   * @param ratio 宽度比例 (0-1)
   */
  public setButtonWidthRatio(ratio: number): Dialog {
    this.buttonWidthRatio = Math.max(0.1, Math.min(1.0, ratio));
    this.repositionButtons();
    return this;
  }

  // ==================== 面板代理方法 ====================

  /**
   * 设置标题
   */
  public setTitle(title: string): Dialog {
    this.title = title;
    this.panel.setTitle(title);
    return this;
  }

  /**
   * 获取标题
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * 设置位置
   */
  public setPosition(x: number, y: number): Dialog {
    this.panel.setPosition(x, y);
    this.repositionButtons();
    return this;
  }

  /**
   * 设置尺寸
   */
  public setSize(width: number, height: number): Dialog {
    this.dialogWidth = width;
    this.dialogHeight = height;
    this.panel.setSize(width, height);
    this.repositionButtons();
    return this;
  }

  /**
   * 获取位置
   */
  public getPosition(): { x: number; y: number } {
    return this.panel.getPosition();
  }

  /**
   * 获取尺寸
   */
  public getSize(): { width: number; height: number } {
    return this.panel.getSize();
  }

  /**
   * 居中显示
   */
  public center(): Dialog {
    const centerX = (1920 - this.dialogWidth) / 2;
    const centerY = (1080 - this.dialogHeight) / 2;
    this.panel.setPosition(centerX, centerY);
    return this;
  }

  // ==================== 可见性 ====================

  /**
   * 设置可见性
   */
  public setVisible(visible: boolean): Dialog {
    this.panel.setVisible(visible);
    // 同步所有按钮的可见性
    this.buttons.forEach(button => button.setVisible(visible));
    return this;
  }

  /**
   * 获取可见性
   */
  public getVisible(): boolean {
    return this.panel.getVisible();
  }

  /**
   * 显示
   */
  public show(): Dialog {
    return this.setVisible(true);
  }

  /**
   * 隐藏
   */
  public hide(): Dialog {
    return this.setVisible(false);
  }

  /**
   * 切换可见性
   */
  public toggle(): Dialog {
    this.panel.toggle();
    return this;
  }

  // ==================== 样式设置 ====================

  /**
   * 设置背景
   */
  public setBackground(texture: string): Dialog {
    this.panel.setBackground(texture);
    return this;
  }

  /**
   * 设置透明度
   */
  public setAlpha(alpha: number): Dialog {
    this.panel.setAlpha(alpha);
    return this;
  }

  /**
   * 设置标题颜色
   */
  public setTitleColor(hexColor: string): Dialog {
    this.panel.setTitleColor(hexColor);
    return this;
  }

  /**
   * 设置是否显示标题栏
   */
  public setShowTitleBar(show: boolean): Dialog {
    this.panel.setShowTitleBar(show);
    return this;
  }

  /**
   * 设置是否显示关闭按钮
   */
  public setShowCloseButton(show: boolean): Dialog {
    this.panel.setShowCloseButton(show);
    return this;
  }

  // ==================== 拖拽功能 ====================

  /**
   * 启用/禁用拖拽功能
   */
  public setDraggable(draggable: boolean): Dialog {
    if (draggable) {
      // 设置内部拖拽回调，确保按钮跟随面板移动
      this.panel.setOnDragStart(() => {
        if (this.userOnDragStart) {
          this.userOnDragStart();
        }
      });

      this.panel.setOnDragging((x, y) => {
        // 重新定位所有按钮
        this.repositionButtons();
        // 调用用户设置的回调
        if (this.userOnDragging) {
          this.userOnDragging(x, y);
        }
      });

      this.panel.setOnDragEnd((x, y) => {
        // 拖拽结束后确保按钮位置正确
        this.repositionButtons();
        // 调用用户设置的回调
        if (this.userOnDragEnd) {
          this.userOnDragEnd(x, y);
        }
      });
    }
    this.panel.setDraggable(draggable);
    return this;
  }

  /**
   * 获取是否可拖拽
   */
  public getDraggable(): boolean {
    return this.panel.getDraggable();
  }

  /**
   * 获取是否正在拖拽
   */
  public getIsDragging(): boolean {
    return this.panel.getIsDragging();
  }

  /**
   * 设置拖拽开始回调
   */
  public setOnDragStart(callback: () => void): Dialog {
    this.userOnDragStart = callback;
    return this;
  }

  /**
   * 设置拖拽结束回调
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): Dialog {
    this.userOnDragEnd = callback;
    return this;
  }

  /**
   * 设置拖拽过程中回调
   */
  public setOnDragging(callback: (x: number, y: number) => void): Dialog {
    this.userOnDragging = callback;
    return this;
  }

  // ==================== 获取内部组件 ====================

  /**
   * 获取内部面板
   */
  public getPanel(): Panel {
    return this.panel;
  }

  /**
   * 获取内容区域框架
   */
  public getContentFrame(): Frame | null {
    return this.panel.getContentFrame();
  }

  /**
   * 获取内容区域位置
   */
  public getContentPosition(): { x: number; y: number } {
    return this.panel.getContentPosition();
  }

  /**
   * 获取内容区域尺寸
   */
  public getContentSize(): { width: number; height: number } {
    return this.panel.getContentSize();
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
    background?: string;
    alpha?: number;
    visible?: boolean;
    draggable?: boolean;
    buttonStartY?: number;
    buttonSpacing?: number;
    buttonHeight?: number;
    buttonWidthRatio?: number;
  }): Dialog {
    if (config.title !== undefined) this.setTitle(config.title);
    if (config.titleColor !== undefined) this.setTitleColor(config.titleColor);
    if (config.showTitleBar !== undefined) this.setShowTitleBar(config.showTitleBar);
    if (config.showCloseButton !== undefined) this.setShowCloseButton(config.showCloseButton);
    if (config.background !== undefined) this.setBackground(config.background);
    if (config.alpha !== undefined) this.setAlpha(config.alpha);
    if (config.visible !== undefined) this.setVisible(config.visible);
    if (config.draggable !== undefined) this.setDraggable(config.draggable);
    if (config.buttonStartY !== undefined) this.setButtonStartY(config.buttonStartY);
    if (config.buttonSpacing !== undefined) this.setButtonSpacing(config.buttonSpacing);
    if (config.buttonHeight !== undefined) this.setButtonHeight(config.buttonHeight);
    if (config.buttonWidthRatio !== undefined) this.setButtonWidthRatio(config.buttonWidthRatio);

    return this;
  }

  /**
   * 销毁对话框
   */
  public destroy(): void {
    log.info(`开始销毁对话框: ${this.titleText}`);

    // 销毁所有按钮
    log.info(`销毁 ${this.buttons.length} 个按钮`);
    this.clearButtons();

    // 销毁标题文本
    if (this.titleText) {
      log.info("销毁标题文本");
      this.titleText.destroy();
      this.titleText = null;
    }


    // 清理用户拖拽回调
    log.info("清理拖拽回调");
    this.userOnDragStart = null;
    this.userOnDragEnd = null;
    this.userOnDragging = null;

    // 销毁面板（会自动销毁所有内部 Frame）
    log.info("销毁面板");
    this.panel.destroy();

    this.isCreated = false;
    log.info("对话框销毁完成");
  }
}
