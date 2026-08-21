/**
 * 游戏事件管理器
 * 基于 EventEmitter 实现的游戏事件订阅系统
 * 用于封装 Warcraft III 原生游戏事件（单位死亡、伤害、技能等）
 *
 * 订阅优先级：on/onUnitDamaged 等支持 options.priority，数值越大越先执行；
 * 事件派发时按优先级从高到低依次调用，高优先级逻辑（如护盾）应先订阅并设置较高 priority。
 */


import {
  bj_MAX_PLAYER_SLOTS,
  EVENT_PLAYER_UNIT_ATTACKED,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_DESELECTED,
  EVENT_PLAYER_UNIT_SELECTED,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  EVENT_PLAYER_UNIT_SUMMON,
} from "@eiriksgata/wc3ts/src/globals/define";
import { EventEmitter, EventHandler, SubscribeOptions } from "./EventEmitter";
import { Actor } from "../actor";
import { createLogger } from "src/utils/logger";

const log = createLogger("GameEventManager");

// 注意：1.27a 中玩家-单位事件与单位事件是区分开的，这里只用玩家单位事件常量（EVENT_PLAYER_UNIT_XXX）
// 注册单位事件时使用 TriggerRegisterPlayerUnitEvent + EVENT_PLAYER_UNIT_XXX；
// 技能效果事件则使用单位事件 EVENT_UNIT_SPELL_EFFECT 与 TriggerRegisterAnyUnitEvent。

/**
 * 游戏事件类型
 */
export const enum GameEventType {
  // 单位事件
  UNIT_DEATH = "game:Actor:death",
  UNIT_DAMAGED = "game:Actor:damaged",
  UNIT_ATTACKED = "game:Actor:attacked",
  UNIT_SUMMONED = "game:Actor:summoned",
  UNIT_SELECTED = "game:Actor:selected",
  UNIT_DESELECTED = "game:Actor:deselected",
  UNIT_SPELL_CAST = "game:Actor:spellCast",
  UNIT_SPELL_EFFECT = "game:Actor:spellEffect",
  UNIT_SPELL_FINISH = "game:Actor:spellFinish",
  
  // 玩家事件
  PLAYER_CHAT = "game:player:chat",
  PLAYER_LEAVE = "game:player:leave",
  PLAYER_DEFEAT = "game:player:defeat",
  PLAYER_VICTORY = "game:player:victory",
  
  // 游戏事件
  GAME_TIMER = "game:timer",
  GAME_SAVE = "game:save",
  GAME_LOAD = "game:load",
}

/**
 * 单位事件数据基类
 */
export interface UnitEventData {
  /** 触发事件的单位 */
  Actor: Actor | undefined;
  /** 单位类型 ID */
  unitTypeId: number;
  /** 所属玩家 */
  owner: player;
}

/**
 * 单位死亡事件数据
 */
export interface UnitDeathEventData extends UnitEventData {
  /** 击杀者 */
  killer?: Actor;
}

/**
 * 单位伤害事件数据（类，便于持有源伤害/当前伤害并对外提供设置方法）
 */
export class UnitDamageEventData implements UnitEventData {
  /** 触发事件的单位 */
  Actor: Actor | undefined;
  /** 单位类型 ID */
  unitTypeId: number;
  /** 所属玩家 */
  owner: player;
  /** 伤害来源 */
  source: Actor | undefined;
  /** 源伤害值（事件创建时的原始伤害，只读、不随 setEventDamage 改变） */
  readonly originalDamage: number;
  /** 当前伤害值（可被 setEventDamage 修改，用于后续逻辑与最终结算） */
  damage: number;
  /** 攻击类型 */
  attackType?: number;
  /** 伤害类型 */
  damageType?: number;

  constructor(
    Actor: Actor | undefined,
    unitTypeId: number,
    owner: player,
    source: Actor | undefined,
    damageAmount: number,
    attackType?: number,
    damageType?: number
  ) {
    this.Actor = Actor;
    this.unitTypeId = unitTypeId;
    this.owner = owner;
    this.source = source;
    this.originalDamage = damageAmount;
    this.damage = damageAmount;
    this.attackType = attackType;
    this.damageType = damageType;
  }

  /**
   * 设置此次伤害的结算值（1.27a 下内部调用 EXSetEventDamage）。
   * 会同时更新 data.damage，后续订阅者与飘字等将看到该值。
   */
  public setEventDamage(amount: number): void {
    EXSetEventDamage(amount);
    this.damage = amount;
  }
}

/**
 * 单位召唤事件数据
 */
export interface UnitSummonedEventData extends UnitEventData {
  /** 召唤者单位 */
  SummoningUnit?: Actor;
  /** 被召唤的单位 */
  SummonedUnit?: Actor;
}

/**
 * 技能事件数据
 */
export interface SpellEventData extends UnitEventData {
  /** 技能 ID */
  abilityId: number;
  /** 目标单位（可选） */
  targetUnit?: Actor;
  /** 目标点 X */
  targetX?: number;
  /** 目标点 Y */
  targetY?: number;
}

/**
 * 技能目标类型
 */
export const enum SpellTargetType {
  NONE = 0,  // 无目标（如瞬发、自身、部分通用技能）
  POINT = 1, // 点目标
  UNIT = 2,  // 单位目标
}

/**
 * 玩家聊天事件数据
 */
export interface PlayerChatEventData {
  /** 玩家 */
  player: player;
  /** 玩家索引 */
  playerId: number;
  /** 聊天内容 */
  message: string;
}

/**
 * 游戏事件处理器
 */
export type GameEventHandler<T = any> = EventHandler<T>;

/**
 * 辅助函数：为所有玩家注册单位事件
 * 模拟 TriggerRegisterAnyUnitEventBJ
 */
function registerAnyUnitEvent(trig: trigger, event: playerunitevent): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(trig, Player(i), event, null);
  }
}

/**
 * 游戏事件管理器
 */
export class GameEventManager extends EventEmitter {
  private static instance: GameEventManager | undefined;
  
  /** 原生触发器 */
  private nativeTriggers: trigger[] = [];
  
  /** 已注册的事件类型 */
  private registeredEvents: Set<GameEventType> = new Set();
  
  private constructor() {
    super("GameEventManager");
  }
  
  /**
   * 获取游戏事件管理器实例
   */
  public static getInstance(): GameEventManager {
    if (!GameEventManager.instance) {
      GameEventManager.instance = new GameEventManager();
    }
    return GameEventManager.instance;
  }
  
  /**
   * 初始化常用游戏事件
   */
  public initialize(): void {
    // 可选择性注册常用事件
    log.info("初始化完成");
  }
  
  /**
   * 注册单位死亡事件
   */
  public registerUnitDeathEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_DEATH)) return;
    
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    // 玩家单位事件：任意玩家的单位死亡
    registerAnyUnitEvent(trig, EVENT_PLAYER_UNIT_DEATH());
    TriggerAddAction(trig, () => {
      const dyingUnit = GetTriggerUnit();
      const killingUnit = GetKillingUnit();
      
      const data: UnitDeathEventData = {
        Actor: Actor.fromHandle(dyingUnit),
        unitTypeId: GetUnitTypeId(dyingUnit),
        owner: GetOwningPlayer(dyingUnit),
        killer: Actor.fromHandle(killingUnit),
      };
      
      this.emit(GameEventType.UNIT_DEATH, data);
    });
    
    this.registeredEvents.add(GameEventType.UNIT_DEATH);
  }
  
  /**
   * 注册单位召唤事件
   */
  public registerUnitSummonedEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_SUMMONED)) return;

    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);

    // 玩家单位事件：任意玩家的单位被召唤
    registerAnyUnitEvent(trig, EVENT_PLAYER_UNIT_SUMMON());
    TriggerAddAction(trig, () => {
      const summonedUnit = GetTriggerUnit();
      const summoningUnit = GetSummoningUnit();

      const data: UnitSummonedEventData = {
        Actor: Actor.fromHandle(summonedUnit),
        unitTypeId: GetUnitTypeId(summonedUnit),
        owner: GetOwningPlayer(summonedUnit),
        SummoningUnit: Actor.fromHandle(summoningUnit),
        SummonedUnit: Actor.fromHandle(summonedUnit),
      };

      this.emit(GameEventType.UNIT_SUMMONED, data);
    });

    this.registeredEvents.add(GameEventType.UNIT_SUMMONED);
  }
  
  /**
   * 注册技能释放事件
   */
  public registerSpellEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_SPELL_EFFECT)) return;
    
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    // 单位事件：任意单位发动技能效果（1.27a 下只存在单位事件版本）
    registerAnyUnitEvent(trig, EVENT_PLAYER_UNIT_SPELL_EFFECT());

    TriggerAddAction(trig, () => {
      const caster = GetTriggerUnit();
      const targetUnit = GetSpellTargetUnit();
      
      const data: SpellEventData = {
        Actor: Actor.fromHandle(caster),
        unitTypeId: GetUnitTypeId(caster),
        owner: GetOwningPlayer(caster),
        abilityId: GetSpellAbilityId(),
        targetUnit: Actor.fromHandle(targetUnit),
        targetX: GetSpellTargetX(),
        targetY: GetSpellTargetY(),
      };
      
      this.emit(GameEventType.UNIT_SPELL_EFFECT, data);
      
      // 同时发射技能特定事件
      this.emit(`${GameEventType.UNIT_SPELL_EFFECT}:${data.abilityId}`, data);
    });
    
    this.registeredEvents.add(GameEventType.UNIT_SPELL_EFFECT);
  }

  /**
   * 注册单位被攻击事件
   */
  public registerUnitAttackedEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_ATTACKED)) return;

    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    registerAnyUnitEvent(trig, EVENT_PLAYER_UNIT_ATTACKED());
    TriggerAddAction(trig, () => {
      const attacked = GetTriggerUnit();
      const attacker = GetAttacker();
      const data = new UnitDamageEventData(
        Actor.fromHandle(attacked),
        GetUnitTypeId(attacked),
        GetOwningPlayer(attacked),
        Actor.fromHandle(attacker),
        0
      );
      this.emit(GameEventType.UNIT_ATTACKED, data);
    });
    this.registeredEvents.add(GameEventType.UNIT_ATTACKED);
  }

  /**
   * 注册单位选中 / 取消选中（所有玩家各一次）
   */
  public registerUnitSelectionEvents(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_SELECTED)) return;

    const trigSel = CreateTrigger();
    const trigDes = CreateTrigger();
    this.nativeTriggers.push(trigSel);
    this.nativeTriggers.push(trigDes);
    registerAnyUnitEvent(trigSel, EVENT_PLAYER_UNIT_SELECTED());
    registerAnyUnitEvent(trigDes, EVENT_PLAYER_UNIT_DESELECTED());

    TriggerAddAction(trigSel, () => {
      const selected = GetTriggerUnit();
      const data: UnitEventData = {
        Actor: Actor.fromHandle(selected),
        unitTypeId: GetUnitTypeId(selected),
        owner: GetOwningPlayer(selected),
      };
      this.emit(GameEventType.UNIT_SELECTED, data);
    });
    TriggerAddAction(trigDes, () => {
      const deselected = GetTriggerUnit();
      const data: UnitEventData = {
        Actor: Actor.fromHandle(deselected),
        unitTypeId: GetUnitTypeId(deselected),
        owner: GetOwningPlayer(deselected),
      };
      this.emit(GameEventType.UNIT_DESELECTED, data);
    });

    this.registeredEvents.add(GameEventType.UNIT_SELECTED);
    this.registeredEvents.add(GameEventType.UNIT_DESELECTED);
  }
  
  /**
   * 注册玩家聊天事件
   * @param prefix 聊天前缀（可选，用于命令过滤）
   * @param exactMatch 是否精确匹配
   */
  public registerPlayerChatEvent(prefix: string = "", exactMatch: boolean = false): void {
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    // 为所有玩家注册聊天事件
    for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
      TriggerRegisterPlayerChatEvent(trig, Player(i), prefix, exactMatch);
    }
    
    TriggerAddAction(trig, () => {
      const chatPlayer = GetTriggerPlayer();
      
      const data: PlayerChatEventData = {
        player: chatPlayer,
        playerId: GetPlayerId(chatPlayer),
        message: GetEventPlayerChatString(),
      };
      
      this.emit(GameEventType.PLAYER_CHAT, data);
    });
    
    this.registeredEvents.add(GameEventType.PLAYER_CHAT);
  }
  
  // =====================
  // 便捷订阅方法
  // =====================
  
  /**
   * 订阅单位死亡事件
   */
  public onUnitDeath(
    handler: GameEventHandler<UnitDeathEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitDeathEvent();
    return this.on(GameEventType.UNIT_DEATH, handler, options);
  }
  
  /**
   * 订阅单位被攻击事件
   */
  public onUnitAttacked(
    handler: GameEventHandler<UnitDamageEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitAttackedEvent();
    return this.on(GameEventType.UNIT_ATTACKED, handler, options);
  }

  /**
   * 订阅单位选中。本地玩家判断请在回调内用 GetTriggerPlayer() === GetLocalPlayer()。
   */
  public onUnitSelected(
    handler: GameEventHandler<UnitEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitSelectionEvents();
    return this.on(GameEventType.UNIT_SELECTED, handler, options);
  }

  /**
   * 订阅单位取消选中
   */
  public onUnitDeselected(
    handler: GameEventHandler<UnitEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitSelectionEvents();
    return this.on(GameEventType.UNIT_DESELECTED, handler, options);
  }

  /**
   * 订阅单位受伤害事件。
   * 支持 options.priority，优先级高的先执行；数据为 UnitDamageEventData，含 originalDamage（源伤害）、damage（当前伤害），
   * 可通过 data.setEventDamage(amount) 修改此次结算伤害（内部调用 EXSetEventDamage）。
   */
  public onUnitDamaged(
    handler: GameEventHandler<UnitDamageEventData>,
    options?: SubscribeOptions
  ): number {
    return this.on(GameEventType.UNIT_DAMAGED, handler, options);
  }

  /**
   * 订阅单位召唤事件
   */
  public onUnitSummoned(
    handler: GameEventHandler<UnitSummonedEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitSummonedEvent();
    return this.on(GameEventType.UNIT_SUMMONED, handler, options);
  }
  
  /**
   * 订阅技能释放事件
   * @param handler 处理器
   * @param abilityId 指定技能 ID（可选）
   * @param options 订阅选项
   */
  public onSpellEffect(
    handler: GameEventHandler<SpellEventData>,
    abilityId?: number,
    options?: SubscribeOptions
  ): number {
    this.registerSpellEvent();
    const eventName = abilityId 
      ? `${GameEventType.UNIT_SPELL_EFFECT}:${abilityId}` 
      : GameEventType.UNIT_SPELL_EFFECT;
    return this.on(eventName, handler, options);
  }
  
  /**
   * 订阅玩家聊天事件
   */
  public onPlayerChat(
    handler: GameEventHandler<PlayerChatEventData>,
    options?: SubscribeOptions
  ): number {
    if (!this.registeredEvents.has(GameEventType.PLAYER_CHAT)) {
      this.registerPlayerChatEvent();
    }
    return this.on(GameEventType.PLAYER_CHAT, handler, options);
  }
  
  /**
   * 销毁管理器
   */
  public override destroy(): void {
    super.destroy();
    
    for (const trig of this.nativeTriggers) {
      DestroyTrigger(trig);
    }
    this.nativeTriggers = [];
    this.registeredEvents.clear();
  }
}

/**
 * 快捷访问游戏事件管理器
 */
export const gameEvents = GameEventManager.getInstance();
