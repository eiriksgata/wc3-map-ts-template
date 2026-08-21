import { Frame, FRAME_ALIGN_CENTER } from "@eiriksgata/wc3ts/*";
import { FrameEventUtils } from "../../../constants/frame";
import { createLogger } from "src/utils/logger";

const log = createLogger("FDFButtonBuilder");

/**
 * 按钮模板类型枚举
 */
export enum ButtonTemplateType {
  /** 标准按钮模板 */
  STANDARD = "StandardButtonTemplate",
  /** 图标按钮模板 */
  ICON = "IconButtonTemplate",
  /** 大型按钮模板 */
  LARGE = "LargeButtonTemplate",
  /** 小型按钮模板 */
  SMALL = "SmallButtonTemplate",
  /** 脚本按钮模板（轻量级） */
  SCRIPT = "ScriptButtonTemplate"
}

/**
 * 按钮配置接口
 */
export interface ButtonConfig {
  /** 按钮文本 */
  text?: string;
  /** 按钮位置X */
  x?: number;
  /** 按钮位置Y */
  y?: number;
  /** 按钮宽度 */
  width?: number;
  /** 按钮高度 */
  height?: number;
  /** 父框架 */
  parent?: Frame;
  /** 对齐方式 */
  anchor?: any;
  /** 图标路径（仅图标按钮） */
  icon?: string;
  /** 热键文本 */
  hotkey?: string;
  /** 提示文本 */
  tooltip?: string;
  /** 是否可见 */
  visible?: boolean;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * 按钮事件配置接口
 */
export interface ButtonEvents {
  /** 点击事件 */
  onClick?: () => void;
  /** 鼠标进入事件 */
  onMouseEnter?: () => void;
  /** 鼠标离开事件 */
  onMouseLeave?: () => void;
}

/**
 * FDF按钮创建工具类
 * 用于创建和管理基于FDF模板的按钮
 */
export class FDFButtonBuilder {
  private buttonFrame: Frame | null = null;
  private textFrame: Frame | null = null;
  private iconFrame: Frame | null = null;
  private hotkeyFrame: Frame | null = null;

  /**
   * 创建标准按钮
   * @param name 按钮名称（唯一标识）
   * @param config 按钮配置
   * @param events 按钮事件
   */
  static createButton(
    name: string,
    config: ButtonConfig,
    events?: ButtonEvents
  ): FDFButtonBuilder {
    return new FDFButtonBuilder().build(
      name,
      ButtonTemplateType.STANDARD,
      config,
      events
    );
  }

  /**
   * 创建图标按钮
   * @param name 按钮名称（唯一标识）
   * @param config 按钮配置（需要icon参数）
   * @param events 按钮事件
   */
  static createIconButton(
    name: string,
    config: ButtonConfig,
    events?: ButtonEvents
  ): FDFButtonBuilder {
    return new FDFButtonBuilder().build(
      name,
      ButtonTemplateType.ICON,
      config,
      events
    );
  }

  /**
   * 创建大型按钮
   * @param name 按钮名称
   * @param config 按钮配置
   * @param events 按钮事件
   */
  static createLargeButton(
    name: string,
    config: ButtonConfig,
    events?: ButtonEvents
  ): FDFButtonBuilder {
    return new FDFButtonBuilder().build(
      name,
      ButtonTemplateType.LARGE,
      config,
      events
    );
  }

  /**
   * 创建小型按钮
   * @param name 按钮名称（唯一标识）
   * @param config 按钮配置
   * @param events 按钮事件
   */
  static createSmallButton(
    name: string,
    config: ButtonConfig,
    events?: ButtonEvents
  ): FDFButtonBuilder {
    return new FDFButtonBuilder().build(
      name,
      ButtonTemplateType.SMALL,
      config,
      events
    );
  }

  /**
   * 构建按钮
   */
  private build(
    name: string,
    template: ButtonTemplateType,
    config: ButtonConfig,
    events?: ButtonEvents
  ): this {
    // 获取父框架
    const parent = config.parent || Frame.fromHandle(DzGetGameUI())!;

    // 创建按钮框架（根据模板类型选择）
    let buttonFrame: Frame | undefined;

    if (template === ButtonTemplateType.SCRIPT) {
      // 脚本按钮使用BACKDROP类型
      buttonFrame = Frame.createType(
        name,
        parent,
        0,
        "BACKDROP",
        template,
      );
    } else if (template === ButtonTemplateType.ICON) {
      // 图标按钮使用BUTTON类型
      buttonFrame = Frame.createType(
        name,
        parent,
        0,
        "BUTTON",
        template,
      );
    } else {
      // 其他按钮使用GLUETEXTBUTTON类型
      buttonFrame = Frame.createType(
        name,
        parent,
        0,
        "GLUETEXTBUTTON",
        template,
      );
    }

    this.buttonFrame = buttonFrame || null;

    if (!this.buttonFrame) {
      log.error(`Failed to create button: ${name}`);
      return this;
    }

    // 设置位置
    if (config.x !== undefined && config.y !== undefined) {
      const anchor = config.anchor || FRAME_ALIGN_CENTER;
      this.buttonFrame.setAbsPoint(anchor, config.x, config.y);
    }

    // 设置尺寸
    if (config.width !== undefined && config.height !== undefined) {
      this.buttonFrame.setSize(config.width, config.height);
    }

    // 设置文本
    if (config.text) {
      this.setText(config.text);
    }

    // 设置图标（仅图标按钮）
    if (config.icon && template === ButtonTemplateType.ICON) {
      this.setIcon(config.icon);
    }

    // 设置热键文本
    if (config.hotkey) {
      this.setHotkey(config.hotkey);
    }

    // 设置提示文本
    if (config.tooltip) {
      this.setTooltip(config.tooltip);
    }

    // 设置可见性
    if (config.visible !== undefined) {
      this.setVisible(config.visible);
    }

    // 设置启用状态
    if (config.enabled !== undefined) {
      this.setEnabled(config.enabled);
    }

    // 绑定事件
    if (events) {
      this.bindEvents(events);
    }

    return this;
  }

  /**
   * 设置按钮文本
   */
  setText(text: string): this {
    if (!this.buttonFrame) return this;

    // 直接设置按钮文本
    this.buttonFrame.setText(text);

    return this;
  }

  /**
   * 设置按钮图标
   */
  setIcon(iconPath: string): this {
    if (this.buttonFrame === null) return this;

    // 查找图标子框架
    const iconHandle = DzFrameFindByName("IconButtonIcon", 0);

    if (iconHandle !== undefined && iconHandle !== null) {
      DzFrameSetTexture(iconHandle, iconPath, 0);
    }

    return this;
  }

  /**
   * 设置热键文本
   */
  setHotkey(hotkey: string): this {
    if (this.buttonFrame === null) return this;

    const hotkeyHandle = DzFrameFindByName("ButtonHotkey", 0);

    if (hotkeyHandle !== undefined && hotkeyHandle !== null) {
      DzFrameSetText(hotkeyHandle, hotkey);
    }

    return this;
  }

  /**
   * 设置提示文本
   */
  setTooltip(tooltip: string): this {
    if (!this.buttonFrame) return this;

    // 使用简单的提示文本设置
    DzFrameSetTooltip(this.buttonFrame.handle, DzCreateFrameByTagName("TEXT", "", this.buttonFrame.handle, "", 0));

    return this;
  }

  /**
   * 设置可见性
   */
  setVisible(visible: boolean): this {
    if (!this.buttonFrame) return this;

    this.buttonFrame.setVisible(visible);

    return this;
  }

  /**
   * 设置启用状态
   */
  setEnabled(enabled: boolean): this {
    if (!this.buttonFrame) return this;

    this.buttonFrame.setEnabled(enabled);

    return this;
  }

  /**
   * 设置按钮位置
   */
  setPosition(x: number, y: number, anchor?: any): this {
    if (!this.buttonFrame) return this;

    const alignType = anchor || FRAME_ALIGN_CENTER;
    this.buttonFrame.setAbsPoint(alignType, x, y);

    return this;
  }

  /**
   * 设置按钮尺寸
   */
  setSize(width: number, height: number): this {
    if (!this.buttonFrame) return this;

    this.buttonFrame.setSize(width, height);

    return this;
  }

  /**
   * 绑定事件
   */
  bindEvents(events: ButtonEvents): this {
    if (!this.buttonFrame) return this;

    FrameEventUtils.bindEvents(this.buttonFrame, {
      onClick: events.onClick,
      onMouseEnter: events.onMouseEnter,
      onMouseLeave: events.onMouseLeave
    });

    return this;
  }

  /**
   * 获取按钮框架
   */
  getFrame(): Frame | null {
    return this.buttonFrame;
  }

  /**
   * 销毁按钮
   */
  destroy(): void {
    if (this.buttonFrame) {
      this.buttonFrame.destroy();
      this.buttonFrame = null;
    }
    this.textFrame = null;
    this.iconFrame = null;
    this.hotkeyFrame = null;
  }
}

/**
 * 按钮组管理器
 * 用于批量管理多个按钮
 */
export class ButtonGroup {
  private buttons: Map<string, FDFButtonBuilder> = new Map();

  /**
   * 添加按钮到组
   */
  addButton(id: string, button: FDFButtonBuilder): this {
    this.buttons.set(id, button);
    return this;
  }

  /**
   * 获取按钮
   */
  getButton(id: string): FDFButtonBuilder | undefined {
    return this.buttons.get(id);
  }

  /**
   * 移除按钮
   */
  removeButton(id: string): boolean {
    const button = this.buttons.get(id);
    if (button) {
      button.destroy();
      this.buttons.delete(id);
      return true;
    }
    return false;
  }

  /**
   * 显示所有按钮
   */
  showAll(): this {
    this.buttons.forEach(button => button.setVisible(true));
    return this;
  }

  /**
   * 隐藏所有按钮
   */
  hideAll(): this {
    this.buttons.forEach(button => button.setVisible(false));
    return this;
  }

  /**
   * 启用所有按钮
   */
  enableAll(): this {
    this.buttons.forEach(button => button.setEnabled(true));
    return this;
  }

  /**
   * 禁用所有按钮
   */
  disableAll(): this {
    this.buttons.forEach(button => button.setEnabled(false));
    return this;
  }

  /**
   * 销毁所有按钮
   */
  destroyAll(): void {
    this.buttons.forEach(button => button.destroy());
    this.buttons.clear();
  }

  /**
   * 获取按钮数量
   */
  size(): number {
    return this.buttons.size;
  }
}