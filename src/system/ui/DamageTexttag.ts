import { Frame, FRAME_ALIGN_BOTTOM, Timer } from "@eiriksgata/wc3ts/*";
import { worldToScreen } from "src/utils/helper";
import { ScreenCoordinates } from "./ScreenCoordinates";
import { createLogger } from "src/utils/logger";

const poolLog = createLogger("DamageTextPool");
const managerLog = createLogger("DamageTextManager");

/**
 * 漂浮方向
 */
export enum FloatDirection {
  UP = "UP",       // 向上
  DOWN = "DOWN",   // 向下
  LEFT = "LEFT",   // 向左
  RIGHT = "RIGHT", // 向右
  NONE = "NONE"    // 不移动
}

/**
 * 伤害文字配置
 */
export interface DamageTextConfig {
  /** 显示的数字 */
  damage: number;
  /** 世界坐标 X（地图平面 X） */
  worldX: number;
  /** 世界坐标 Y（地图平面 Y） */
  worldY: number;
  /** 高度偏移（垂直方向） */
  height?: number;
  /** 颜色 */
  color?: 'red' | 'yellow' | 'gray' | 'blue';
  /** 漂浮方向 */
  direction?: FloatDirection;
  /** 移动速度（像素/秒） */
  speed?: number;
  /** 持续时间（秒） */
  duration?: number;
  /** 数字缩放比例 */
  scale?: number;
  /** 淡出效果 */
  fadeOut?: boolean;
}

/**
 * 单个伤害文字实例
 */
class DamageText {
  private containerFrame: Frame | null = null;
  private digitFrames: Frame[] = [];
  private isActive: boolean = false;

  // 配置
  private damage: number = 0;
  private worldX: number = 0;
  private worldY: number = 0;
  private height: number = 0;
  private direction: FloatDirection = FloatDirection.UP;
  private speed: number = 100; // 像素/秒
  private duration: number = 1.5; // 秒
  private scale: number = 0.8;
  private fadeOut: boolean = true;

  // 运行时状态
  private elapsedTime: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private currentAlpha: number = 255;
  private color: 'red' | 'yellow' | 'gray' | 'blue' = 'gray';
  
  // 数字尺寸（像素）
  private static readonly DIGIT_WIDTH = 40;      // 单个数字纹理的实际宽度
  private static readonly DIGIT_HEIGHT = 64;     // 单个数字纹理的实际高度
  private static readonly DIGIT_SPACING = -12;   // 数字间距偏移（负数=更紧凑，正数=更稀疏）
  private static readonly STANDARD_WIDTH = 1920;
  private static readonly STANDARD_HEIGHT = 1080;

  constructor(maxDigits: number = 8) {
    // 创建容器 Frame
    this.containerFrame = Frame.createType(
      `DamageTextContainer_${GetRandomInt(0, 999999)}`,
      Frame.fromHandle(DzGetGameUI())!,
      0,
      "BACKDROP",
      ""
    )!;

    this.containerFrame.setTexture(`Texture\\ui\\dmg\\transparent.tga`, 0, true);

    // 设置容器尺寸（重要！没有尺寸的话子 frame 相对定位无效）
    // 尺寸设置为能容纳最大数字位数的宽度和高度
    const containerWidth = (DamageText.DIGIT_WIDTH * maxDigits) / DamageText.STANDARD_WIDTH;
    const containerHeight = DamageText.DIGIT_HEIGHT / DamageText.STANDARD_HEIGHT;
    // 转换为 WC3 屏幕坐标系（0.8 x 0.6）
    this.containerFrame.setSize(
      containerWidth * ScreenCoordinates.WC3_SCREEN_WIDTH,
      containerHeight * ScreenCoordinates.WC3_SCREEN_HEIGHT
    );
    
    // 预创建数字 Frame（最多 maxDigits 位）
    for (let i = 0; i < maxDigits; i++) {
      const digitFrame = Frame.createType(
        `DamageDigit_${GetRandomInt(0, 999999)}_${i}`,
        this.containerFrame,
        0,
        "BACKDROP",
        ""
      )!;
      digitFrame.setVisible(false);
      this.digitFrames.push(digitFrame);
    }

    this.containerFrame.setVisible(false);
  }

  /**
   * 初始化并显示伤害文字
   */
  public show(config: DamageTextConfig): void {
    this.damage = config.damage;
    this.worldX = config.worldX;
    this.worldY = config.worldY;
    this.height = config.height || 0;
    this.direction = config.direction || FloatDirection.UP;
    this.speed = config.speed || 100;
    this.duration = config.duration || 1.5;
    this.scale = config.scale || 0.8;
    this.fadeOut = config.fadeOut !== undefined ? config.fadeOut : true;
    this.color = config.color || 'gray';

    this.elapsedTime = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.currentAlpha = 255;
    this.isActive = true;

    // 设置数字
    this.setupDigits();

    // 显示
    this.containerFrame!.setVisible(true);
    this.updatePosition();
  }

  /**
   * 设置数字显示
   */
  private setupDigits(): void {
    const damageStr = Math.floor(Math.abs(this.damage)).toString();
    const digitCount = damageStr.length;

    // 计算缩放后的尺寸（先转为比例，再转为 WC3 坐标）
    const scaledWidth = ((DamageText.DIGIT_WIDTH * this.scale) / DamageText.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const scaledHeight = ((DamageText.DIGIT_HEIGHT * this.scale) / DamageText.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    // 计算间距偏移（应用缩放）
    const scaledSpacing = ((DamageText.DIGIT_SPACING * this.scale) / DamageText.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;

    // 每个数字的步进宽度 = 纹理宽度 + 间距偏移
    const stepWidth = scaledWidth + scaledSpacing;
    // 总宽度
    const totalWidth = stepWidth * digitCount;

    // 设置每个数字
    for (let i = 0; i < this.digitFrames.length; i++) {
      if (i < digitCount) {
        const digit = parseInt(damageStr[i]);
        const digitFrame = this.digitFrames[i];

        // 设置纹理
        digitFrame.setTexture(`Texture\\ui\\dmg\\${this.color}\\${digit}.tga`, 0, true);
        digitFrame.setSize(scaledWidth, scaledHeight);

        // 设置位置（从左到右排列，相对于容器）
        const xOffset = (i * stepWidth) - (totalWidth / 2);
        digitFrame.clearPoints();
        // 使用 setPoint 相对于父容器定位，而不是 setAbsPoint 绝对定位
        digitFrame.setPoint(FRAME_ALIGN_BOTTOM, this.containerFrame!, FRAME_ALIGN_BOTTOM, xOffset, 0);
        digitFrame.setAlpha(255);
        digitFrame.setVisible(true);
      } else {
        // 隐藏多余的数字 Frame
        this.digitFrames[i].setVisible(false);
      }
    }
  }

  /**
   * 更新（每帧调用）
   */
  public update(deltaTime: number): void {
    if (!this.isActive) return;

    this.elapsedTime += deltaTime;

    // 检查是否超时
    if (this.elapsedTime >= this.duration) {
      this.hide();
      return;
    }

    // 更新移动偏移
    this.updateOffset(deltaTime);

    // 更新透明度（淡出效果）
    if (this.fadeOut) {
      const progress = this.elapsedTime / this.duration;
      // 最后 30% 的时间开始淡出
      if (progress > 0.7) {
        const fadeProgress = (progress - 0.7) / 0.3;
        this.currentAlpha = 255 * (1 - fadeProgress);

        // 更新所有数字的透明度
        for (const digitFrame of this.digitFrames) {
          if (digitFrame.visible) {
            digitFrame.setAlpha(Math.floor(this.currentAlpha));
          }
        }
      }
    }

    // 更新位置
    this.updatePosition();
  }

  /**
   * 更新移动偏移
   */
  private updateOffset(deltaTime: number): void {
    const moveDistance = this.speed * deltaTime;

    switch (this.direction) {
      case FloatDirection.UP:
        this.offsetY += moveDistance;
        break;
      case FloatDirection.DOWN:
        this.offsetY -= moveDistance;
        break;
      case FloatDirection.LEFT:
        this.offsetX -= moveDistance;
        break;
      case FloatDirection.RIGHT:
        this.offsetX += moveDistance;
        break;
      case FloatDirection.NONE:
        // 不移动
        break;
    }
  }

  /**
   * 更新屏幕位置
   */
  private updatePosition(): void {
    // 世界坐标转屏幕坐标
    // worldToScreen(地图X, 地图Y, 高度) - 正确的参数顺序
    const screenPos = worldToScreen(this.worldX, this.worldY, this.height);

    // 调试输出
    // print(`[DamageText] 世界坐标: X=${this.worldX}, Y=${this.worldY}, H=${this.height}`);
    // print(`[DamageText] 屏幕坐标: screenX=${screenPos.screenX}, screenY=${screenPos.screenY}, z=${screenPos.z}`);

    // 应用偏移（像素转 WC3 屏幕坐标）
    // WC3 屏幕坐标范围是 0.8 x 0.6，而不是 1.0 x 1.0
    const offsetXScreen = (this.offsetX / DamageText.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const offsetYScreen = (this.offsetY / DamageText.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    const finalX = screenPos.screenX + offsetXScreen;
    const finalY = screenPos.screenY + offsetYScreen;

    // print(`[DamageText] 最终坐标: finalX=${finalX}, finalY=${finalY}`);

    // 检测是否在屏幕外
    if (this.isOffScreen(finalX, finalY)) {
      this.containerFrame!.setVisible(false);
      return;
    }

    if (!this.containerFrame!.visible) {
      this.containerFrame!.setVisible(true);
    }

    // 设置位置
    this.containerFrame!.clearPoints();
    this.containerFrame!.setAbsPoint(FRAME_ALIGN_BOTTOM, finalX, finalY);
  }

  /**
   * 检测是否在屏幕外
   */
  private isOffScreen(screenX: number, screenY: number): boolean {
    // 参考 UnitBlood 的检测逻辑
    // 屏幕坐标范围：X [0.04, 0.96], Y [0.16, 0.84]
    return (
      screenY >= 1000 / 1800 ||  // 下边界
      screenY <= 300 / 1800 ||   // 上边界
      screenX >= 1850 / 2400 ||  // 右边界
      screenX <= 70 / 2400       // 左边界
    );
  }

  /**
   * 隐藏并标记为可重用
   */
  public hide(): void {
    this.isActive = false;
    this.containerFrame!.setVisible(false);

    // 隐藏所有数字
    for (const digitFrame of this.digitFrames) {
      digitFrame.setVisible(false);
    }
  }

  /**
   * 检查是否激活
   */
  public active(): boolean {
    return this.isActive;
  }

  /**
   * 销毁（清理资源）
   */
  public destroy(): void {
    if (this.containerFrame) {
      this.containerFrame.destroy();
      this.containerFrame = null;
    }
    this.digitFrames = [];
  }
}

/**
 * 伤害文字对象池
 */
export class DamageTextPool {
  private pool: DamageText[] = [];
  private poolSize: number;
  private updateTimer: Timer | null = null;
  private lastUpdateTime: number = 0;

  constructor(poolSize: number = 30) {
    this.poolSize = poolSize;
    this.initializePool();
    this.startUpdateTimer();
  }

  /**
   * 初始化对象池
   */
  private initializePool(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push(new DamageText(8)); // 最多 8 位数字
    }
    poolLog.info(`初始化了 ${this.poolSize} 个伤害文字对象`);
  }

  /**
   * 启动更新计时器
   */
  private startUpdateTimer(): void {
    this.updateTimer = Timer.create();
    this.updateTimer.start(0.02, true, () => { // 50 FPS
      const deltaTime = 0.02; // 固定 50 FPS
      this.updateAll(deltaTime);
    });
  }

  /**
   * 更新所有激活的伤害文字
   */
  private updateAll(deltaTime: number): void {
    for (const damageText of this.pool) {
      if (damageText.active()) {
        damageText.update(deltaTime);
      }
    }
  }

  /**
   * 从池中获取一个可用的伤害文字对象
   */
  private acquire(): DamageText | null {
    for (const damageText of this.pool) {
      if (!damageText.active()) {
        return damageText;
      }
    }
    return null; // 池已满
  }

  /**
   * 显示伤害文字
   */
  public show(config: DamageTextConfig): boolean {
    const damageText = this.acquire();
    if (!damageText) {
      // print("DamageTextPool: 对象池已满，无法显示新的伤害文字");
      return false;
    }

    damageText.show(config);
    return true;
  }

  /**
   * 清理所有伤害文字
   */
  public clear(): void {
    for (const damageText of this.pool) {
      if (damageText.active()) {
        damageText.hide();
      }
    }
  }

  /**
   * 销毁对象池
   */
  public destroy(): void {
    if (this.updateTimer) {
      this.updateTimer.destroy();
      this.updateTimer = null;
    }

    for (const damageText of this.pool) {
      damageText.destroy();
    }

    this.pool = [];
  }
}

/**
 * 全局伤害文字管理器（单例）
 */
export class DamageTextManager {
  private static instance: DamageTextManager | null = null;
  private pool: DamageTextPool;

  private constructor(poolSize: number = 30) {
    this.pool = new DamageTextPool(poolSize);
  }

  /**
   * 获取单例实例
   */
  public static getInstance(poolSize: number = 30): DamageTextManager {
    if (!DamageTextManager.instance) {
      DamageTextManager.instance = new DamageTextManager(poolSize);
      managerLog.info("单例已创建");
    }
    return DamageTextManager.instance;
  }

  /**
   * 显示伤害文字（便捷方法）
   */
  public static show(config: DamageTextConfig): boolean {
    return DamageTextManager.getInstance().pool.show(config);
  }

  /**
   * 快速显示伤害（使用默认配置）
   */
  public static showDamage(
    damage: number,
    worldX: number,
    worldY: number,
    height: number = 100
  ): boolean {
    return DamageTextManager.show({
      damage,
      worldX,
      worldY,
      height,
      direction: FloatDirection.UP,
      speed: 80,
      duration: 1.5,
      scale: 0.8,
      fadeOut: true
    });
  }

  /**
   * 清理所有伤害文字
   */
  public clear(): void {
    this.pool.clear();
  }

  /**
   * 销毁管理器
   */
  public destroy(): void {
    this.pool.destroy();
    DamageTextManager.instance = null;
  }
}
