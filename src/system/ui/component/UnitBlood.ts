import { Frame, FRAME_ALIGN_BOTTOM, FRAME_ALIGN_CENTER, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM, FRAME_ALIGN_TOP, MapPlayer, Timer, Unit, UNIT_TYPE_DEAD } from "@eiriksgata/wc3ts/*";
import { CameraControl } from "src/utils/CameraControl";
import { worldToScreen } from "src/utils/helper";
import { Actor } from "../../actor";
import { createLogger } from "src/utils/logger";

const log = createLogger("UnitBlood");


export class UnitBlood {

  public static allUnitBlood: Map<number, UnitBlood> = new Map();

  // 标记是否已经注册过绘制事件
  private static isDrawEventRegistered: boolean = false;

  actor: Actor;
  frame: Frame;
  lifeFrame: Frame;
  manaFrame: Frame;
  shieldFrame: Frame;
  levelFrame: Frame;
  nameBoxFrame: Frame;
  nameFrame: Frame;

  /**
   * 私有构造函数，防止直接实例化
   */
  private constructor(actor: Actor) {
    this.actor = actor;
    //actor.setPreselectUIVisible(false);

    //血条UI基底框架
    this.frame = Frame.createType(`UnitBloodFrame_${actor.id}`, Frame.fromHandle(DzGetGameUI())!, 0, "BACKDROP", "")!;
    this.frame.setSize(130 / 2400, 28 / 1800);
    this.frame.setTexture("Texture\\ui\\hpbar\\01.tga", 0, false);
    this.frame.setVisible(true);

    //血条生命值框架
    this.lifeFrame = Frame.createType(`LifeFrame_${actor.id}`, this.frame, 0, "BACKDROP", "")!;
    this.lifeFrame.setSize(100 / 2400, 12 / 1800);
    this.lifeFrame.setTexture("Texture\\ui\\hpbar\\02.tga", 0, false);
    this.lifeFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.frame, FRAME_ALIGN_LEFT_TOP, 26 / 2400, -4 / 1800);

    // 护盾值框架：与血条同位置同大小，覆盖在血条上方，只显示护盾百分比宽度，更直观
    this.shieldFrame = Frame.createType(`ShieldFrame_${actor.id}`, this.frame, 0, "BACKDROP", "")!;
    this.shieldFrame.setSize(100 / 2400, 12 / 1800);
    this.shieldFrame.setTexture("Texture\\ui\\hpbar\\huduntiao.tga", 0, false);
    this.shieldFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.frame, FRAME_ALIGN_LEFT_TOP, 26 / 2400, -4 / 1800);
    this.shieldFrame.setVisible(false);

    //血条魔法值框架
    this.manaFrame = Frame.createType(`ManaFrame_${actor.id}`, this.frame, 0, "BACKDROP", "")!;
    this.manaFrame.setSize(100 / 2400, 8 / 1800);
    this.manaFrame.setTexture("Texture\\ui\\hpbar\\03.tga", 0, false);
    // 向下微调，为护盾条留出空间
    this.manaFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.frame, FRAME_ALIGN_LEFT_TOP, 26 / 2400, -18 / 1800);

    //血条等级框架
    this.levelFrame = Frame.createType(`LevelFrame_${actor.id}`, this.frame, 0, "TEXT", "")!;
    this.levelFrame.setTextAlignment(50, 0);
    this.levelFrame.setText(`${actor.level}`);
    this.levelFrame.setFont("resource\\Texture\\ui\\hpbar\\ZiTi.TTf", 1, 0);

    this.levelFrame.setPoint(FRAME_ALIGN_CENTER, this.frame, FRAME_ALIGN_LEFT_TOP, 14 / 2400, -14 / 1800);

    //血条名称框架
    this.nameBoxFrame = Frame.createType(`NameBoxFrame_${actor.id}`, this.frame, 0, "BACKDROP", "")!;
    this.nameBoxFrame.setTexture("Texture\\ui\\hpbar\\07.tga", 0, false);
    this.nameBoxFrame.alpha = 75;

    //血条名称文本框架
    this.nameFrame = Frame.createType(`NameFrame_${actor.id}`, this.nameBoxFrame, 0, "TEXT", "")!;
    this.nameFrame.setText(actor.getLabel());
    this.nameFrame.setTextAlignment(18, 0);
    this.nameFrame.setFont("resource\\Texture\\ui\\hpbar\\ZiTi.TTf", 1, 0);

    this.nameFrame.alpha = 255;
    this.nameFrame.setPoint(FRAME_ALIGN_BOTTOM, this.frame, FRAME_ALIGN_TOP, 0.003, 10 / 1800);

    this.nameBoxFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.nameFrame, FRAME_ALIGN_LEFT_TOP, -0.003, 0.004);
    this.nameBoxFrame.setPoint(FRAME_ALIGN_RIGHT_BOTTOM, this.nameFrame, FRAME_ALIGN_RIGHT_BOTTOM, 0.004, -0.004);

    if (actor.owner == MapPlayer.fromLocal()) {
      this.lifeFrame.setTexture("Texture\\ui\\hpbar\\02.tga", 0, false);
    } else {
      if (actor.isAlly(MapPlayer.fromLocal())) {
        this.lifeFrame.setTexture("Texture\\ui\\hpbar\\06.tga", 0, false);
      } else {
        this.lifeFrame.setTexture("Texture\\ui\\hpbar\\05.tga", 0, false);
      }
    }

    UnitBlood.allUnitBlood.set(actor.id, this);
  }

  /**
   * 创建或获取 UnitBlood 实例
   * 如果已存在则返回现有实例，否则创建新实例
   */
  public static create(actor: Actor): UnitBlood {
    // 如果已经存在，直接返回现有实例
    const existing = UnitBlood.allUnitBlood.get(actor.id);
    if (existing !== undefined) {
      return existing;
    }

    // 不存在则创建新实例
    return new UnitBlood(actor);
  }

  /**
   * 获取指定单位的血条UI
   */
  public static get(unit: Unit): UnitBlood | undefined {
    return UnitBlood.allUnitBlood.get(unit.id);
  }

  /**
   * 移除指定单位的血条UI
   */
  public static remove(unit: Unit): void {
    const unitBlood = UnitBlood.allUnitBlood.get(unit.id);
    if (unitBlood !== undefined) {
      unitBlood.destroy();
      UnitBlood.allUnitBlood.delete(unit.id);
    }
  }

  /**
   * 销毁血条UI
   */
  public destroy(): void {
    this.frame.destroy();
    //this.actor.setPreselectUIVisible(true);
    UnitBlood.allUnitBlood.delete(this.actor.id);
    // print(`UnitBlood for unit ${this.unit.id} destroyed.`);
    // 其他清理工作...
  }


  /**
   * 注册本地绘制事件
   * 此方法只能调用一次，重复调用会被忽略
   */
  public static registerLocalDrawEvent(): boolean {
    // 如果已经注册过，直接返回 false 表示未执行
    if (UnitBlood.isDrawEventRegistered) {
      log.warn("绘制事件已经注册过，重复调用被忽略");
      return false;
    }

    // 标记为已注册
    UnitBlood.isDrawEventRegistered = true;

    // 执行注册逻辑
    DzFrameSetUpdateCallbackByCode(() => {
      CameraControl.update();
      // 这里可以添加其他需要每帧更新的血条逻辑
      UnitBlood.updateAllUnitBloods();

    });

    //使用计时器更新
    // Timer.create().start(0.03, true, () => {
    //   CameraControl.update();
    //   UnitBlood.updateAllUnitBloods();
    // });

    log.info("绘制事件注册成功");
    return true;
  }

  /**
   * 检查绘制事件是否已注册
   */
  public static isRegistered(): boolean {
    return UnitBlood.isDrawEventRegistered;
  }

  /**
   * 更新所有血条UI（每帧调用）
   */
  private static updateAllUnitBloods(): void {
    for (const unitBlood of UnitBlood.allUnitBlood.values()) {
      unitBlood.updateUI();
    }


  }

  /**
   * 更新单个血条UI
   */
  private updateUI(): void {
    // 检查单位是否还存在
    if (!this.actor || this.actor.handle == undefined || this.actor.id === 0) {
      this.destroy();
      return;
    }
    if (this.actor.life <= 0) {
      //隐藏血条
      this.frame.setVisible(false);
      return;
    }

    // 更新血条位置、生命值等
    // 这里可以添加具体的更新逻辑
    this.updateLifeBar();
    this.updateManaBar();
    this.updateShieldBar();

    //this.updatePositionByNative();
    this.updatePosition();

    this.levelFrame.setText(`${this.actor.level}`);
    //更新缩放比例
    //设置血条缩放比例
    const scale = 1 - (CameraControl.getViewLevel() - 8) * 0.1;
    this.setScale(scale);


  }

  /**
   * 更新生命值条
   */
  private updateLifeBar(): void {
    const maxLife = this.actor.maxLife;
    const lifePercent = maxLife > 0 ? this.actor.life / maxLife : 0;
    this.lifeFrame.setSize((100 / 2400) * lifePercent, 12 / 1800);
  }

  private updateManaBar(): void {
    const maxMana = this.actor.maxMana;
    const manaPercent = maxMana > 0 ? this.actor.mana / maxMana : 0;
    this.manaFrame.setSize((100 / 2400) * manaPercent, 8 / 1800);
  }

  /**
   * 更新护盾值条
   */
  private updateShieldBar(): void {
    const shieldPercent = this.actor.shieldPercent;

    if (shieldPercent <= 0) {
      if (DzFrameIsVisible(this.shieldFrame.handle)) {
        this.shieldFrame.setVisible(false);
      }
      return;
    }

    if (!DzFrameIsVisible(this.shieldFrame.handle)) {
      this.shieldFrame.setVisible(true);
    }

    const clamped = Math.max(0, Math.min(shieldPercent, 1));
    this.shieldFrame.setSize((100 / 2400) * clamped, 12 / 1800);
  }

  /**
   * 更新血条位置（世界坐标转屏幕坐标）
   */
  private updatePosition(): void {
    // 获取单位的世界坐标
    const unitX = this.actor.x;
    const unitY = this.actor.y;

    const unitHeightOffset = this.actor.hpBarUIHeight * this.actor.size; // 单位高度偏移

    // 转换为屏幕坐标（传入计算好的偏移量）
    const screenPos = worldToScreen(unitX - 30, unitY + unitHeightOffset, 0);

    //判断是否在控制台的位置
    if (screenPos.screenY >= 1000 / 1800 ||
      screenPos.screenY <= 300 / 1800 ||
      this.actor.life < 0.05 ||
      this.actor.isUnitType(UNIT_TYPE_DEAD()) ||
      screenPos.screenX >= 1850 / 2400 ||
      screenPos.screenX <= 70 / 2400
    ) {
      this.frame.setVisible(false);
      return;
    }

    if (this.actor == undefined || this.actor.id == 0) {
      this.destroy();
      return;
    }
    if (DzFrameIsVisible(this.frame.handle) == false) {
      this.frame.setVisible(true);
    }

    this.frame.setAbsPoint(FRAME_ALIGN_BOTTOM, screenPos.screenX, screenPos.screenY);

  }

  /**
   * 设置所有Frame的大小
   * @param scale 缩放因子
   */
  public setScale(scale: number): void {
    // this.frame.setSize((130 / 2400) * scale, (28 / 1800) * scale);
    // this.lifeFrame.setSize((100 / 2400) * scale, (12 / 1800) * scale);
    // this.manaFrame.setSize((100 / 2400) * scale, (8 / 1800) * scale);
    this.frame.setScale(scale);
    this.lifeFrame.setScale(scale);
    this.manaFrame.setScale(scale);
    this.shieldFrame.setScale(scale);
    this.nameBoxFrame.setScale(scale);
    this.levelFrame.setFont("resource\\Texture\\ui\\hpbar\\ZiTi.TTf", 0.01 * scale, 0);
    this.nameFrame.setFont("resource\\Texture\\ui\\hpbar\\ZiTi.TTf", 0.01 * scale, 0);

  }

}