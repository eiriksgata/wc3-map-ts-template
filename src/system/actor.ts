import { Unit, MapPlayer, UNIT_TYPE_DEAD } from "@eiriksgata/wc3ts/*";
import { UnitBlood } from "./ui/component/UnitBlood";
import { BuffManager } from "./buff/BuffManager";
import { BUFF_DURATION_PERMANENT } from "./buff/types";
import { eventBus } from "./event/EventBus";

// TSTL/Lua 全局：用于把缓存的 Unit 实例“升级”为 Actor（修复方法为 nil 的问题）
declare const setmetatable: (t: unknown, mt: unknown) => unknown;

export class Actor extends Unit {
  public static allActors: Record<number, Actor> = {};

  private _hpBarUIHeight: number = 100;
  private _size: number = 1.0;
  private _buffManager: BuffManager | null = null;
  private label = "";
  private bloodBarUI: UnitBlood | null = null;

  /**
   * @deprecated 请使用 Actor.create / Actor.fromUnit / Actor.fromHandle 静态方法。
   * 直接 new 时 Unit 构造函数内部会调用 CreateUnit，绕过了 Actor.create 的统一管理。
   */
  constructor(owner: MapPlayer, unitId: number, x: number, y: number, face?: number) {
    super(owner, unitId, x, y, face);
    Actor.allActors[this.id] = this;
  }

  /**
   * 当 Handle.getObject 从 WeakMap 中找到一个已有的父类 Unit 实例并返回时，
   * Actor 构造函数不会被执行，Actor 特有字段（_hpBarUIHeight、_size 等）
   * 将为 nil，对其做任何算术运算都会在 Lua 层崩溃。
   * 此方法负责在这种"类型升级"场景下补全默认值。
   *
   * TSTL 背景：Handle、Unit、Actor 共享同一个模块级 WeakMap（见 handle.ts），
   * 一个 handle 只缓存第一次创建它的类实例。子类调用 getObject 拿到的可能是
   * 父类对象，因此必须显式补全子类字段。
   */
  private static ensureActorFields(obj: Actor): void {
    const f = obj as unknown as Record<string, unknown>;
    if (f["_hpBarUIHeight"] === undefined) f["_hpBarUIHeight"] = 100;
    if (f["_size"] === undefined) f["_size"] = 1.0;
    if (f["_buffManager"] === undefined) f["_buffManager"] = null;
    if (f["label"] === undefined) f["label"] = "";
    if (f["bloodBarUI"] === undefined) f["bloodBarUI"] = null;
  }

  /**
   * 把 getObject(handle) 返回的“父类 Unit 实例”升级为 Actor 实例：
   * - 仅补字段不够：否则 Actor.prototype 上的方法（如 hasShield）在 Lua 层会是 nil
   * - 通过 setmetatable(obj, Actor.prototype) 让方法查找走到 Actor 原型链
   */
  private static ensureActorPrototype(obj: Actor): void {
    setmetatable(obj as unknown as object, Actor.prototype as unknown as object);
  }

  private static isHandleAlive(handle: unit): boolean {
    return !IsUnitType(handle, UNIT_TYPE_DEAD()) && GetWidgetLife(handle) > 0.405;
  }

  /**
   * 创建新的 Actor 单位。
   * 死亡时由 RelicSystem.bindDeathCleanup 调用 detach()，避免 handle ID 复用后指向尸体。
   */
  public static create(
    owner: MapPlayer,
    unitId: number,
    x: number,
    y: number,
    facing: number = 0
  ): Actor | undefined {
    if (!owner) return undefined;

    const handle = CreateUnit(owner.handle, unitId, x, y, facing);
    if (!handle) return undefined;

    const actor = Actor.getObject(handle) as Actor;
    if (!actor) return undefined;

    Actor.ensureActorPrototype(actor);
    Actor.ensureActorFields(actor);
    Object.assign(actor, { handle });
    Actor.allActors[actor.id] = actor;

    // 通知 DamageSystem：该 Actor 已成功加入管理器，后续受击事件需要注册。
    eventBus.emit("game:Actor:created", { actor });
    return actor;
  }

  /**
   * 从现有 Unit 实例升级为 Actor。
   * 若该 handle 已被 Unit.fromEvent 等方法注册为 Unit 实例，
   * ensureActorFields 会补全 Actor 特有字段默认值。
   */
  public static fromUnit(unit: Unit): Actor | undefined {
    if (!unit) return undefined;
    const existing = Actor.allActors[unit.id];
    if (existing !== undefined) return existing;
    return Actor.fromHandle(unit.handle);
  }

  /**
   * 从 WC3 unit handle 获取或创建 Actor。
   * 若该 handle 已被父类方法注册为普通 Unit，则补全 Actor 字段后升级返回。
   */
  public static fromHandle(handle: unit): Actor | undefined {
    if (!handle) return undefined;

    const hid = GetHandleId(handle);
    const existing = Actor.allActors[hid];
    if (existing !== undefined) return existing;

    const actor = Actor.getObject(handle) as Actor;
    if (!actor) return undefined;

    Actor.ensureActorPrototype(actor);
    Actor.ensureActorFields(actor);
    Object.assign(actor, { handle });
    Actor.allActors[actor.id] = actor;

    if (Actor.isHandleAlive(handle)) {
      eventBus.emit("game:Actor:created", { actor });
    }
    return actor;
  }

  /**
   * 获取指定ID的Actor
   * @param unitId 单位ID
   * @returns Actor实例或undefined
   */
  public static getById(unitId: number): Actor | undefined {
    return Actor.allActors[unitId];
  }

  /**
   * 从运行时表摘除 Actor（死亡流程用）：清 Buff、血条、allActors。
   * 不 RemoveUnit，单位已在引擎死亡流程中。
   */
  public detach(): void {
    if (this._buffManager !== null) {
      this._buffManager.clearAll();
      this._buffManager = null;
    }
    UnitBlood.remove(this);
    this.bloodBarUI = null;
    delete Actor.allActors[this.id];
  }

  /**
   * 主动移除单位：先 detach 再 RemoveUnit。
   */
  public destroy(): void {
    this.detach();
    super.destroy();
  }

  public set hpBarUIHeight(value: number) {
    this._hpBarUIHeight = value;
  }

  public get hpBarUIHeight(): number {
    return this._hpBarUIHeight;
  }

  public set size(value: number) {
    this._size = value;
  }

  public get size(): number {
    return this._size;
  }

  /** Buff 管理器（护盾等均通过 buff 挂载） */
  public get buffManager(): BuffManager {
    if (this._buffManager === null) {
      this._buffManager = new BuffManager(this);
    }
    return this._buffManager;
  }

  public hasBuffManager(): boolean {
    return this._buffManager !== null;
  }

  /** 当前护盾总量（所有护盾 buff 的 current 之和） */
  public get shield(): number {
    return this.buffManager.getTotalShieldCurrent();
  }

  /** 护盾上限总量（所有护盾 buff 的 max 之和） */
  public get maxShield(): number {
    return this.buffManager.getTotalShieldMax();
  }

  /**
   * 护盾百分比 0~1
   */
  public get shieldPercent(): number {
    const max = this.buffManager.getTotalShieldMax();
    if (max <= 0) return 0;
    return this.buffManager.getTotalShieldCurrent() / max;
  }

  /**
   * 是否有护盾（当前护盾值 > 0）
   */
  public hasShield(): boolean {
    return this.buffManager.getTotalShieldCurrent() > 0;
  }

  /**
   * 增减护盾：正数添加一个护盾 buff，负数扣减护盾值（不扣血）
   * @param delta 变化量；正数时可选 duration，默认永久直到被打破
   */
  public addShield(
    delta: number,
    duration: number = BUFF_DURATION_PERMANENT,
    displayKey?: string
  ): void {
    if (delta > 0) {
      this.buffManager.addShieldBuff(delta, duration, displayKey);
    } else if (delta < 0) {
      this.buffManager.reduceShield(-delta);
    }
  }

  public setLabel(value: string) {
    this.label = value;
    if (this.bloodBarUI) {
      this.bloodBarUI.nameFrame.setText(value);
    }
  }

  public getLabel(): string {
    return this.label;
  }

  /**
   * 为当前Actor创建血条UI
   */
  public createBloodBar(): void {
    this.bloodBarUI = UnitBlood.create(this);
  }

}