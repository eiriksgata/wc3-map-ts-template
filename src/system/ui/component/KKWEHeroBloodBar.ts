/**
 * 英雄血条/蓝条（YD 风格）
 * 参考 JASS 逻辑：DzFrameBindWidget 绑定单位 + 定时器更新血条/蓝条宽度
 * 使用方式：给英雄创建血条只需传入单位，例如 HeroBloodBarYD.create(unit)
 */

import {
  UNIT_TYPE_HERO,
  UNIT_TYPE_DEAD,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_MANA,
} from "src/constants/game/units";
import { Actor } from "src/system/actor";

// 尺寸风格对齐 UnitBlood.ts（同一套贴图的推荐比例）
/** 底框宽度（130 / 2400） */
const BASE_WIDTH = 130 / 2400;
/** 底框高度（28 / 1800） */
const BASE_HEIGHT = 28 / 1800;
/** 条形区域宽度（100 / 2400） */
const BAR_WIDTH = 100 / 2400;
/** 生命条高度（12 / 1800） */
const LIFE_HEIGHT = 12 / 1800;
/** 蓝条高度（8 / 1800） */
const MANA_HEIGHT = 8 / 1800;
/** 条形区域相对底框的 X 偏移（26 / 2400） */
const BAR_OFFSET_X = 26 / 2400;
/** 生命/护盾条相对底框的 Y 偏移（-4 / 1800） */
const LIFE_OFFSET_Y = -4 / 1800;
/** 蓝条相对底框的 Y 偏移（-18 / 1800） */
const MANA_OFFSET_Y = -18 / 1800;

/** 定时器间隔（与 JASS 0.03 一致） */
const TIMER_INTERVAL = 0.03;

/** 与 {@link UnitBlood} 相同血条/蓝条填充贴图（仅换皮，不改布局） */
const TEX_LIFE_SELF = "Texture\\ui\\hpbar\\02.tga";
const TEX_LIFE_ENEMY = "Texture\\ui\\hpbar\\05.tga";
const TEX_LIFE_ALLY = "Texture\\ui\\hpbar\\06.tga";
const TEX_MANA = "Texture\\ui\\hpbar\\03.tga";
const TEX_SHIELD = "Texture\\ui\\hpbar\\huduntiao.tga";
const TEX_BASE = "Texture\\ui\\hpbar\\01.tga";

/**
 * 获取英雄单位头像贴图路径（可改为从配置/物编读取）
 */
function getHeroArtPath(unitTypeId: number): string {
  return "ReplaceableTextures\\CommandButtons\\BTNHeroPaladin.blp";
}

export class KKWEHeroBloodBar {
  private unit: unit | null;
  private unitId: number;
  private backdrop: number;
  private lifeBar: number;
  private shieldBar: number;
  private manaBar: number;
  private heroIcon: number;
  private heroName: number;
  private timer: timer;
  private barWidth: number;
  private lifeHeight: number;
  private manaHeight: number;
  private baseWidth: number;
  private baseHeight: number;

  private heroIconTextFrame: number;

  /** 血条底层父 Frame 句柄 */
  private static lifeBaseFrame: number = 0;
  /** unitId -> 血条实例 */
  private static instanceMap: Record<number, KKWEHeroBloodBar> = {};

  private constructor(u: unit) {
    this.unit = u;
    this.unitId = GetHandleId(u);
    this.barWidth = BAR_WIDTH;
    this.lifeHeight = LIFE_HEIGHT;
    this.manaHeight = MANA_HEIGHT;
    this.baseWidth = BASE_WIDTH;
    this.baseHeight = BASE_HEIGHT;

    const base = KKWEHeroBloodBar.getLifeBaseFrame();
    const idStr = String(this.unitId);
    const nameBackdrop = "血条" + idStr;
    const nameLife = "血条图片" + idStr;
    const nameShield = "护盾条图片" + idStr;
    const nameMana = "蓝条图片" + idStr;
    const nameIcon = "血条英雄图标" + idStr;
    const nameText = "血条英雄名字" + idStr;

    const nameIconText = "血条英雄图标文字" + idStr;

    const backdrop = DzCreateFrameByTagName("BACKDROP", nameBackdrop, base, "", 0);
    DzFrameBindWidget(backdrop, u, 0, 0, 0, 0, 0, false, true, false);
    // 血条 UI 基底框架（与 UnitBlood 同贴图路径）
    DzFrameSetTexture(backdrop, TEX_BASE, 0);
    DzFrameSetSize(backdrop, this.baseWidth, this.baseHeight);

    const lifeBar = DzCreateFrameByTagName("BACKDROP", nameLife, backdrop, "", 0);
    // 对齐 UnitBlood：条形区域在底框内有偏移
    DzFrameSetPoint(lifeBar, 0, backdrop, 0, BAR_OFFSET_X, LIFE_OFFSET_Y);
    const lp = GetLocalPlayer();
    const owner = GetOwningPlayer(u);
    if (owner === lp) {
      DzFrameSetTexture(lifeBar, TEX_LIFE_SELF, 0);
    } else if (IsPlayerAlly(owner, lp)) {
      DzFrameSetTexture(lifeBar, TEX_LIFE_ALLY, 0);
    } else {
      DzFrameSetTexture(lifeBar, TEX_LIFE_ENEMY, 0);
    }
    DzFrameSetSize(lifeBar, this.barWidth, this.lifeHeight);

    // 护盾条：覆盖在生命条上方，只显示护盾百分比宽度
    const shieldBar = DzCreateFrameByTagName("BACKDROP", nameShield, backdrop, "", 0);
    DzFrameSetPoint(shieldBar, 0, backdrop, 0, BAR_OFFSET_X, LIFE_OFFSET_Y);
    DzFrameSetTexture(shieldBar, TEX_SHIELD, 0);
    DzFrameSetSize(shieldBar, this.barWidth, this.lifeHeight);
    DzFrameShow(shieldBar, false);

    const manaBar = DzCreateFrameByTagName("BACKDROP", nameMana, backdrop, "", 0);
    // 对齐 UnitBlood：蓝条下移，为护盾条预留同一行覆盖
    DzFrameSetPoint(manaBar, 0, backdrop, 0, BAR_OFFSET_X, MANA_OFFSET_Y);
    DzFrameSetTexture(manaBar, TEX_MANA, 0);
    DzFrameSetSize(manaBar, this.barWidth, this.manaHeight);

    const heroIcon = DzCreateFrameByTagName("BACKDROP", nameIcon, backdrop, "", 0);
    //DzFrameSetPoint(heroIcon, 5, backdrop, 3, 0, 0);
    //DzFrameSetTexture(heroIcon, getHeroArtPath(GetUnitTypeId(u)), 0);
    //DzFrameSetTexture(heroIcon, "Textures\\Black32.blp", 0);
    //DzFrameSetSize(heroIcon, 0.01, 0.01);

    // 英雄等级（对齐 UnitBlood.ts：居中显示在底框内部偏移处）
    const heroIconText = DzCreateFrameByTagName("TEXT", nameIconText, backdrop, "", 0);
    DzFrameSetPoint(heroIconText, 4, backdrop, 0, 14 / 2400, -14 / 1800);
    DzFrameSetSize(heroIconText, 0.01, 0.01);
    DzFrameSetText(heroIconText, "1");
    DzFrameSetTextAlignment(heroIconText, 4);
    DzFrameSetIgnoreTrackEvents(heroIconText, true);
    DzFrameSetFont(heroIconText, "resource\\Texture\\ui\\hpbar\\ZiTi.TTf", 0.009, 0);

    const heroName = DzCreateFrameByTagName("TEXT", nameText, backdrop, "", 0);
    DzFrameSetPoint(heroName, 7, backdrop, 1, 0, 0.002);
    DzFrameSetSize(heroName, 0.0, 0.01);
    DzFrameSetText(heroName, GetUnitName(u));
    DzFrameSetTextAlignment(heroName, 4);
    DzFrameSetIgnoreTrackEvents(heroName, true);
    DzFrameSetFont(heroName, "resource\\Texture\\ui\\hpbar\\ZiTi.TTf", 0.009, 0);

    this.backdrop = backdrop;
    this.lifeBar = lifeBar;
    this.shieldBar = shieldBar;
    this.manaBar = manaBar;
    this.heroIcon = heroIcon;
    this.heroName = heroName;
    this.heroIconTextFrame = heroIconText;

    this.timer = CreateTimer();
    KKWEHeroBloodBar.instanceMap[this.unitId] = this;
    TimerStart(this.timer, TIMER_INTERVAL, true, () => this.onTimerTick());
  }

  /** 定时器回调：更新血条/蓝条宽度，单位无效时自动销毁 */
  private onTimerTick(): void {
    const u = this.unit;
    if (u == null || IsUnitType(u, UNIT_TYPE_DEAD) || this.backdrop === 0) {
      this.destroy();
      return;
    }
    const maxLife = GetUnitState(u, UNIT_STATE_MAX_LIFE);
    const lifePercent = maxLife <= 0 ? 0 : (GetUnitState(u, UNIT_STATE_LIFE) / maxLife) * 100;
    const maxMana = GetUnitState(u, UNIT_STATE_MAX_MANA);
    const manaPercent = maxMana <= 0 ? 0 : (GetUnitState(u, UNIT_STATE_MANA) / maxMana) * 100;
    const heroLevel = GetUnitLevel(u);

    DzFrameSetText(this.heroIconTextFrame, heroLevel + "");

    DzFrameSetSize(this.lifeBar, (this.barWidth * lifePercent) / 100, this.lifeHeight);
    DzFrameSetSize(this.manaBar, (this.barWidth * manaPercent) / 100, this.manaHeight);

    // 护盾显示：依赖 Actor 的 shieldPercent（0~1），无护盾时隐藏
    const actor = Actor.fromHandle(u);
    const shieldPercent = actor?.shieldPercent ?? 0;
    if (shieldPercent <= 0) {
      if (DzFrameIsVisible(this.shieldBar)) {
        DzFrameShow(this.shieldBar, false);
      }
    } else {
      if (!DzFrameIsVisible(this.shieldBar)) {
        DzFrameShow(this.shieldBar, true);
      }
      const clamped = Math.max(0, Math.min(shieldPercent, 1));
      DzFrameSetSize(this.shieldBar, this.barWidth * clamped, this.lifeHeight);
    }
  }

  /**
   * 销毁血条并释放定时器
   */
  public destroy(): void {
    if (this.backdrop !== 0) {
      DzFrameUnBind(this.backdrop);
      DzDestroyFrame(this.backdrop);
    }
    if (this.lifeBar !== 0) DzDestroyFrame(this.lifeBar);
    if (this.shieldBar !== 0) DzDestroyFrame(this.shieldBar);
    if (this.manaBar !== 0) DzDestroyFrame(this.manaBar);
    if (this.heroIcon !== 0) DzDestroyFrame(this.heroIcon);
    if (this.heroIconTextFrame !== 0) DzDestroyFrame(this.heroIconTextFrame);
    if (this.heroName !== 0) DzDestroyFrame(this.heroName);
    if (this.timer != null) DestroyTimer(this.timer);

    this.unit = null;
    this.backdrop = 0;
    this.lifeBar = 0;
    this.shieldBar = 0;
    this.manaBar = 0;
    this.heroIcon = 0;
    this.heroIconTextFrame = 0;
    this.heroName = 0;
    delete KKWEHeroBloodBar.instanceMap[this.unitId];
  }

  /** 获取绑定的单位 */
  public getUnit(): unit | null {
    return this.unit;
  }

  /** 获取单位 handle id */
  public getUnitId(): number {
    return this.unitId;
  }

  // ---------- 静态方法 ----------

  private static getLifeBaseFrame(): number {
    if (KKWEHeroBloodBar.lifeBaseFrame !== 0) {
      return KKWEHeroBloodBar.lifeBaseFrame;
    }
    const lower = DzFrameGetLowerLevelFrame();
    KKWEHeroBloodBar.lifeBaseFrame = DzCreateFrameByTagName("FRAME", "血条底层", lower, "", 0);
    return KKWEHeroBloodBar.lifeBaseFrame;
  }

  /**
   * 给单位创建英雄血条，传入单位即可。
   * 仅对英雄单位有效；若该单位已有血条则返回已有实例。
   * @param u 单位（通常为英雄）
   * @returns 血条实例，非英雄或创建失败时返回 null
   */
  public static create(u: unit): KKWEHeroBloodBar | null {
    if (u == null) return null;
    if (IsUnitType(u, UNIT_TYPE_HERO) !== true) return null;

    //隐藏单位的血条
    DzSetUnitPreselectUIVisible(u, false);
    const unitId = GetHandleId(u);
    const existing = KKWEHeroBloodBar.instanceMap[unitId];
    if (existing != null) return existing;

    return new KKWEHeroBloodBar(u);
  }

  /**
   * 根据单位获取已创建的血条实例
   */
  public static get(u: unit): KKWEHeroBloodBar | null {
    if (u == null) return null;
    return KKWEHeroBloodBar.instanceMap[GetHandleId(u)] ?? null;
  }

  /**
   * 移除指定单位的血条（若存在）
   */
  public static removeByUnit(u: unit): void {
    const bar = KKWEHeroBloodBar.get(u);
    if (bar != null) bar.destroy();
  }

  /**
   * 设置血条底层父框架（若在 main 中已创建可传入句柄）
   */
  public static setLifeBaseFrame(frameHandle: number): void {
    KKWEHeroBloodBar.lifeBaseFrame = frameHandle;
  }


}
