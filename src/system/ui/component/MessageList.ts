import { Frame, MapPlayer } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";

import { Panel } from "./Panel";
import { Text } from "./Text";
import { createLogger } from "src/utils/logger";

const log = createLogger("MessageList");

/**
 * 消息项配置
 */
export interface MessageItemConfig {
  /** 消息文本 */
  text: string;
  /** 消逝时间（秒） */
  duration: number;
  /** 文本颜色（十六进制，不含#） */
  color?: string;
  /** 消息高度（像素） */
  height?: number;
}

/**
 * 消息项类 - 封装单条消息
 */
class MessageItem {
  public textComponent: Text;
  public duration: number;
  public elapsedTime: number = 0;
  public targetY: number;
  public currentY: number;
  public fadeTimer: timer | null = null;
  public isRemoving: boolean = false;
  public fadeStartTime: number = 0;
  public fadeAnimationDuration: number = 0.3;
  public currentAlpha: number = 255;
  public targetPlayer: MapPlayer | undefined; // 目标玩家（可选）

  constructor(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    duration: number,
    color: string = "FFFFFF",
    origin: string,
    parent: Frame,
    targetPlayer?: MapPlayer
  ) {
    this.duration = duration;
    this.targetY = y;
    this.currentY = y;
    this.currentAlpha = 255;
    this.targetPlayer = targetPlayer;

    // 创建Text组件（使用与MessageList相同的origin）
    // 所有客户端都创建，但通过可见性控制显示
    this.textComponent = new Text(text, x, y, width, height, origin);
    this.textComponent.setColor(color);
    this.textComponent.create(parent);

    // 根据目标玩家设置可见性（在UI层面做区分，避免不同步）
    this.updateVisibility();
  }

  /**
   * 更新可见性（根据目标玩家和本地玩家）
   * 所有客户端都执行，但只有符合条件的客户端才显示
   */
  private updateVisibility(): void {
    if (this.targetPlayer) {
      // 如果指定了目标玩家，只有当该玩家是本地玩家时才显示
      const localPlayer = MapPlayer.fromLocal();
      if (this.targetPlayer === localPlayer) {
        this.textComponent.setVisible(true);
      } else {
        this.textComponent.setVisible(false);
      }
    } else {
      // 如果没有指定目标玩家，所有玩家都能看到
      this.textComponent.setVisible(true);
    }
  }

  /**
   * 更新消逝时间和淡出
   */
  public update(deltaTime: number): void {
    if (this.isRemoving) return;

    this.elapsedTime += deltaTime;

    // 检查是否到达消逝时间
    if (this.elapsedTime >= this.duration) {
      this.startFadeOut();
      return;
    }

    // 在消逝时间到达前30%开始淡出
    const fadeStartRatio = 0.7;
    if (this.elapsedTime >= this.duration * fadeStartRatio) {
      if (this.fadeStartTime === 0) {
        this.fadeStartTime = this.elapsedTime;
      }
      this.updateFadeOut();
    }
  }

  /**
   * 更新淡出动画
   */
  private updateFadeOut(): void {
    if (this.isRemoving) return;

    const fadeProgress = (this.elapsedTime - this.fadeStartTime) / (this.duration * 0.3);
    if (fadeProgress >= 1.0) {
      this.isRemoving = true;
      this.currentAlpha = 0;
      this.textComponent.setAlpha(0);
    } else {
      const alpha = Math.floor(255 * (1 - fadeProgress));
      this.currentAlpha = alpha;
      this.textComponent.setAlpha(alpha);
    }
  }

  /**
   * 开始淡出动画
   */
  public startFadeOut(): void {
    if (this.isRemoving) return;

    this.isRemoving = true;
    const startAlpha = this.currentAlpha;
    const targetAlpha = 0;
    const interval = 0.01; // 10ms
    const totalSteps = Math.ceil(this.fadeAnimationDuration / interval);
    let step = 0;

    if (this.fadeTimer) {
      PauseTimer(this.fadeTimer);
      DestroyTimer(this.fadeTimer);
    }

    this.fadeTimer = CreateTimer();
    TimerStart(this.fadeTimer, interval, true, () => {
      step++;
      const progress = step / totalSteps;

      if (progress >= 1.0) {
        this.currentAlpha = 0;
        this.textComponent.setAlpha(0);
        if (this.fadeTimer) {
          PauseTimer(this.fadeTimer);
          DestroyTimer(this.fadeTimer);
          this.fadeTimer = null;
        }
        return;
      }

      // 缓动函数：easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const alpha = Math.floor(startAlpha + (targetAlpha - startAlpha) * eased);
      this.currentAlpha = alpha;
      this.textComponent.setAlpha(alpha);
    });
  }

  /**
   * 设置目标Y坐标
   */
  public setTargetY(y: number): void {
    this.targetY = y;
  }

  /**
   * 更新位置（用于动画）
   */
  public updatePosition(progress: number): void {
    // 缓动函数：easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const newY = this.currentY + (this.targetY - this.currentY) * eased;
    this.textComponent.setPosition(this.textComponent.getPixelX(), newY);
  }

  /**
   * 完成位置动画
   */
  public finishPositionAnimation(): void {
    this.currentY = this.targetY;
    this.textComponent.setPosition(this.textComponent.getPixelX(), this.targetY);
  }

  /**
   * 销毁消息项
   */
  public destroy(): void {
    if (this.fadeTimer) {
      PauseTimer(this.fadeTimer);
      DestroyTimer(this.fadeTimer);
      this.fadeTimer = null;
    }

    if (this.textComponent !== null) {
      this.textComponent.destroy();
    }
  }
}

/**
 * 消息列表配置
 */
export interface MessageListConfig {
  x: number;
  y: number;
  width: number;
  maxHeight?: number;
  messageHeight?: number;
  messageSpacing?: number;
  maxMessages?: number;
  defaultDuration?: number;
  slideAnimationDuration?: number;
  fadeAnimationDuration?: number;
  backgroundColor?: string;
  origin?: string;
}

/**
 * 消息列表组件
 * 用于显示类似游戏聊天/日志控制台的消息列表
 * 
 * 坐标说明：
 * - 默认使用 TOP_LEFT 坐标系（左上角为原点）
 * - x, y 参数表示 Panel 的左上角位置（像素坐标）
 * - 消息从底部向上排列，新消息添加在底部
 * 
 * @example
 * ```typescript
 * // 在屏幕左下角创建消息列表（从底部300像素，高度300）
 * const messageList = new MessageList(100, 780, 400, 300); // y = 1080 - 300 = 780
 * messageList.create();
 * messageList.addMessage("玩家加入了游戏", 5, "00FF00");
 * 
 * // 或者使用 BOTTOM_LEFT 坐标系
 * const messageList2 = new MessageList(100, 300, 400, 300, { origin: ScreenCoordinates.ORIGIN_BOTTOM_LEFT });
 * messageList2.create();
 * ```
 */
export class MessageList {
  private static instance: MessageList | null = null;

  private panel: Panel;
  private messages: MessageItem[] = [];
  private messageHeight: number;
  private messageSpacing: number;
  private maxMessages: number;
  private defaultDuration: number;
  private slideAnimationDuration: number;
  private fadeAnimationDuration: number;
  private pixelX: number;
  private pixelY: number;
  private pixelWidth: number;
  private pixelHeight: number;
  private origin: string;

  // 动画相关
  private animationTimer: timer | null = null;
  private isAnimating: boolean = false;
  private animationProgress: number = 0;

  // 更新定时器（用于消逝时间管理）
  private updateTimer: timer | null = null;

  // 是否已创建
  private isCreated: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    config?: Partial<MessageListConfig>
  ) {
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = config?.origin || ScreenCoordinates.ORIGIN_TOP_LEFT;

    this.messageHeight = config?.messageHeight || 30;
    this.messageSpacing = config?.messageSpacing || 5;
    this.maxMessages = config?.maxMessages || 10;
    this.defaultDuration = config?.defaultDuration || 5;
    this.slideAnimationDuration = config?.slideAnimationDuration || 0.2;
    this.fadeAnimationDuration = config?.fadeAnimationDuration || 0.3;

    // 创建Panel容器
    this.panel = new Panel(x, y, width, height, this.origin);
    if (config?.backgroundColor) {
      this.panel.setBackground(config.backgroundColor);
    }
  }

  // ==================== 静态工厂方法 ====================

  /**
   * 获取MessageList单例
   * 如果不存在则创建新实例
   */
  public static getInstance(
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    config?: Partial<MessageListConfig>
  ): MessageList {
    if (!MessageList.instance) {
      // 使用默认值或传入的参数
      const defaultX = x ?? 300;
      const defaultY = y ?? 200;
      const defaultWidth = width ?? 400;
      const defaultHeight = height ?? 300;
      MessageList.instance = new MessageList(defaultX, defaultY, defaultWidth, defaultHeight, config);
    }
    return MessageList.instance;
  }

  /**
   * 创建并获取单例（便捷方法）
   * 如果单例不存在则创建，如果未调用create则自动调用
   */
  public static createInstance(
    x: number,
    y: number,
    width: number,
    height: number,
    config?: Partial<MessageListConfig>,
    parent?: Frame
  ): MessageList {
    const instance = MessageList.getInstance(x, y, width, height, config);
    if (!instance.isCreated) {
      instance.create(parent);
    }
    return instance;
  }

  /**
   * 创建组件
   */
  public create(parent?: Frame): void {
    if (this.isCreated) {
      log.info("already created");
      return;
    }

    this.panel.create(parent);
    
    // 启动更新定时器（每0.1秒更新一次）
    this.updateTimer = CreateTimer();
    TimerStart(this.updateTimer, 0.1, true, () => {
      // 每次更新0.1秒
      this.update(0.1);
    });

    this.isCreated = true;
  }

  /**
   * 添加消息
   * 
   * 注意：所有客户端都会执行相同的代码（创建消息、添加到列表等），
   * 但在UI显示层面会根据目标玩家做区分，避免不同步掉线。
   * 
   * @param text 消息文本
   * @param duration 显示时长（秒，可选）
   * @param color 文本颜色（十六进制，不含#，可选）
   * @param player 目标玩家（可选，如果指定则只有该玩家能看到，其他玩家看不到）
   */
  public addMessage(text: string, duration?: number, color?: string, player?: MapPlayer): void {
    // 所有客户端都执行相同的代码，避免不同步
    const messageDuration = duration !== undefined ? duration : this.defaultDuration;
    const messageColor = color || "FFFFFF";

    // 如果超过最大消息数，移除最旧的消息
    if (this.messages.length >= this.maxMessages) {
      const oldestMessage = this.messages[0];
      this.removeMessage(oldestMessage);
    }

    // 获取内容区域
    const contentFrame = this.panel.getContentFrame();
    if (!contentFrame) {
      // Content frame not available - skip adding message
      return;
    }

    // 计算新消息的位置（从底部开始）
    // Text组件使用setAbsPoint（绝对坐标），所以需要使用绝对屏幕坐标
    // 这些坐标会被Text组件转换为WC3坐标，然后通过setAbsPoint设置
    const contentPos = this.panel.getContentPosition();
    const contentSize = this.panel.getContentSize();
    const contentPosX = contentPos.x;
    const contentPosY = contentPos.y;
    const contentSizeWidth = contentSize.width;
    const contentSizeHeight = contentSize.height;
    
    // 计算第一条消息（最底部）的Y坐标
    // 在TOP_LEFT坐标系中，Y向下增加，所以底部 = 顶部 + 高度
    const baseY = contentPosY + contentSizeHeight - this.messageHeight;
    
    // 使用绝对像素坐标（Text组件会转换为WC3绝对坐标）
    const newMessageX = contentPosX;
    const newMessageY = baseY;
    const messageWidth = contentSizeWidth;

    // 创建新消息项（传入origin和目标玩家以确保坐标系统一致）
    // 所有客户端都创建，但MessageItem内部会根据目标玩家设置可见性
    const newMessage = new MessageItem(
      text,
      newMessageX,
      newMessageY,
      messageWidth,
      this.messageHeight,
      messageDuration,
      messageColor,
      this.origin,
      contentFrame,
      player // 传递目标玩家参数
    );

    // 添加到列表
    this.messages.push(newMessage);

    // 更新所有消息的目标位置
    this.updateAllMessageTargetPositions();

    // 触发位置动画
    this.startPositionAnimation();
  }

  /**
   * 更新所有消息的目标位置
   * 参考Dialog的repositionButtons方法，使用绝对屏幕坐标
   * 只计算可见消息的位置，不可见消息不占用空间
   */
  private updateAllMessageTargetPositions(): void {
    const contentPos = this.panel.getContentPosition();
    const contentSize = this.panel.getContentSize();
    
    // 计算第一条消息（最底部）的Y坐标
    // 在TOP_LEFT坐标系中，Y向下增加，所以底部 = 顶部 + 高度
    const baseY = contentPos.y + contentSize.height - this.messageHeight;
    
    // 消息的X坐标始终对齐内容区域的左边缘
    const messageX = contentPos.x;

    // 只计算可见消息的位置
    const visibleMessages = this.messages.filter(msg => msg.textComponent.getVisible());
    let visibleIndex = 0;

    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];
      const isVisible = message.textComponent.getVisible();
      
      if (isVisible) {
        // 只对可见消息计算位置
        // 从底部向上排列：第一条可见消息在baseY，第二条在baseY - (height + spacing)，以此类推
        const targetY = baseY - (visibleMessages.length - 1 - visibleIndex) * (this.messageHeight + this.messageSpacing);
        message.setTargetY(targetY);
        
        // 更新X坐标和宽度（确保消息在正确的位置和宽度）
        // 使用绝对坐标，与Dialog的按钮定位方式一致
        message.textComponent.setPosition(messageX, message.textComponent.getPixelY());
        message.textComponent.setSize(contentSize.width, this.messageHeight);
        
        visibleIndex++;
      } else {
        // 不可见消息不占用位置，但保持其当前Y坐标（避免动画问题）
        // 可以将其移到屏幕外或保持原位置
        // 这里选择保持原位置，但不会参与位置计算
      }
    }
  }

  /**
   * 开始位置动画
   */
  private startPositionAnimation(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.animationProgress = 0;
    const interval = 0.01; // 10ms
    const totalSteps = Math.ceil(this.slideAnimationDuration / interval);

    if (this.animationTimer) {
      PauseTimer(this.animationTimer);
      DestroyTimer(this.animationTimer);
    }

    this.animationTimer = CreateTimer();
    TimerStart(this.animationTimer, interval, true, () => {
      this.animationProgress += 1 / totalSteps;

      if (this.animationProgress >= 1.0) {
        this.animationProgress = 1.0;
        this.finishPositionAnimation();
        this.isAnimating = false;
        if (this.animationTimer) {
          PauseTimer(this.animationTimer);
          DestroyTimer(this.animationTimer);
          this.animationTimer = null;
        }
        return;
      }

      // 更新所有消息的位置（只有可见消息会更新）
      for (const message of this.messages) {
        message.updatePosition(this.animationProgress);
      }
    });
  }

  /**
   * 完成位置动画
   * 只有可见消息才完成位置动画
   */
  private finishPositionAnimation(): void {
    for (const message of this.messages) {
      // 只有可见消息才完成位置动画
      if (message.textComponent.getVisible()) {
        message.finishPositionAnimation();
      }
    }
  }

  /**
   * 移除消息
   */
  public removeMessage(message: MessageItem): void {
    const index = this.messages.indexOf(message);
    if (index === -1) return;

    // 销毁消息
    message.destroy();

    // 从列表中移除
    this.messages.splice(index, 1);

    // 更新剩余消息的位置
    this.updateAllMessageTargetPositions();
    this.startPositionAnimation();
  }

  /**
   * 更新所有消息（用于消逝时间管理）
   */
  public update(deltaTime: number): void {
    // 更新每条消息的消逝时间
    const messagesToRemove: MessageItem[] = [];

    for (const message of this.messages) {
      message.update(deltaTime);

      // 如果消息已经淡出完成，标记为待移除
      if (message.isRemoving && message.fadeTimer === null) {
        messagesToRemove.push(message);
      }
    }

    // 移除已完成淡出的消息
    for (const message of messagesToRemove) {
      this.removeMessage(message);
    }
  }

  /**
   * 清空所有消息
   */
  public clear(): void {
    for (const message of this.messages) {
      message.destroy();
    }
    this.messages = [];
  }

  /**
   * 设置位置
   */
  public setPosition(x: number, y: number): MessageList {
    this.pixelX = x;
    this.pixelY = y;
    this.panel.setPosition(x, y);
    this.updateAllMessageTargetPositions();
    this.startPositionAnimation();
    return this;
  }

  /**
   * 获取位置
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.pixelX, y: this.pixelY };
  }

  /**
   * 设置大小
   */
  public setSize(width: number, height: number): MessageList {
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.panel.setSize(width, height);
    this.updateAllMessageTargetPositions();
    this.startPositionAnimation();
    return this;
  }

  /**
   * 获取大小
   */
  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  /**
   * 设置可见性
   */
  public setVisible(visible: boolean): MessageList {
    this.panel.setVisible(visible);
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
  public show(): MessageList {
    return this.setVisible(true);
  }

  /**
   * 隐藏
   */
  public hide(): MessageList {
    return this.setVisible(false);
  }

  /**
   * 获取消息数量
   */
  public getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    // 清理更新定时器
    if (this.updateTimer) {
      PauseTimer(this.updateTimer);
      DestroyTimer(this.updateTimer);
      this.updateTimer = null;
    }

    // 清理动画定时器
    if (this.animationTimer) {
      PauseTimer(this.animationTimer);
      DestroyTimer(this.animationTimer);
      this.animationTimer = null;
    }

    // 清理所有消息（这会销毁每个消息的定时器和Text组件）
    this.clear();

    // 销毁Panel
    if (this.panel !== null) {
      this.panel.destroy();
    }

    this.isCreated = false;
  }

  /**
   * 重置单例（用于重新创建）
   */
  public static resetInstance(): void {
    if (MessageList.instance) {
      MessageList.instance.destroy();
      MessageList.instance = null;
    }
  }
}
