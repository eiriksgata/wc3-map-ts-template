import { Actor } from "../actor";
import { eventBus } from "../event/EventBus";
import { gameEvents } from "../event";
import { RelicPool } from "./RelicPool";
import { RelicRegistry } from "./RelicRegistry";
import { createLogger } from "src/utils/logger";
import {
  RelicDefinition,
  RelicId,
  RelicInventoryItem,
  RelicPoolEntry,
} from "./types";

const log = createLogger("RelicSystem");

const EVENT_ADDED = "relic:added";
const EVENT_REMOVED = "relic:removed";
const EVENT_INVENTORY_CHANGED = "relic:inventoryChanged";

interface InternalEntry {
  id: RelicId;
  stacks: number;
}

/**
 * 遗物运行时：注册表、命名池、单位库存
 */
export class RelicSystem {
  private static instance: RelicSystem | undefined;

  private readonly registry = new RelicRegistry();
  private readonly pools = new Map<string, RelicPool>();
  /** actorId (handle id) -> 有序遗物列表 */
  private readonly inventory = new Map<number, InternalEntry[]>();
  private deathCleanupBound = false;

  public static getInstance(): RelicSystem {
    if (!RelicSystem.instance) {
      RelicSystem.instance = new RelicSystem();
    }
    return RelicSystem.instance;
  }

  public registerDefinition(def: RelicDefinition): void {
    this.registry.register(def);
  }

  public registerDefinitions(defs: RelicDefinition[]): void {
    this.registry.registerAll(defs);
  }

  public registerPool(name: string, entries: RelicPoolEntry[]): void {
    this.pools.set(name, new RelicPool(entries));
  }

  public getPool(name: string): RelicPool | undefined {
    return this.pools.get(name);
  }

  /**
   * 仅从命名池随机抽取 id，不写入单位
   */
  public drawFromPool(poolName: string): RelicId | undefined {
    const pool = this.pools.get(poolName);
    if (!pool) {
      log.warn(`drawFromPool: pool not found: ${poolName}`);
      return undefined;
    }
    return pool.draw();
  }

  public getDefinition(id: RelicId): RelicDefinition | undefined {
    return this.registry.get(id);
  }

  /**
   * 为单位添加遗物；成功返回 true
   */
  public addRelic(
    target: Actor,
    id: RelicId,
    options?: { silent?: boolean }
  ): boolean {
    const def = this.registry.get(id);
    if (!def) {
      log.warn(`addRelic: unknown relic id: ${id}`);
      return false;
    }
    const uid = target.id;
    const maxStacks = def.maxStacks ?? 1;

    let list = this.inventory.get(uid);
    if (!list) {
      list = [];
      this.inventory.set(uid, list);
    }

    const existing = list.find((e) => e.id === id);
    if (existing) {
      if (existing.stacks >= maxStacks) {
        return false;
      }
      existing.stacks += 1;
      if (def.onStack) {
        def.onStack(target, existing.stacks);
      }
      if (!options?.silent) {
        this.emitAdded(target, id, existing.stacks);
        this.emitInventoryChanged(target);
      }
      return true;
    }

    list.push({ id, stacks: 1 });
    def.onAcquire(target);
    if (!options?.silent) {
      this.emitAdded(target, id, 1);
      this.emitInventoryChanged(target);
    }
    return true;
  }

  /**
   * 移除一层（或 all 时移除该 id 的全部层数）；条目清空时调用 onRemove
   */
  public removeRelic(
    target: Actor,
    id: RelicId,
    options?: { silent?: boolean; all?: boolean }
  ): boolean {
    const def = this.registry.get(id);
    if (!def) return false;

    const list = this.inventory.get(target.id);
    if (!list) return false;

    const idx = list.findIndex((e) => e.id === id);
    if (idx < 0) return false;

    const entry = list[idx];
    const removeAll = options?.all === true;
    const delta = removeAll ? entry.stacks : 1;

    entry.stacks -= delta;
    if (entry.stacks <= 0) {
      list.splice(idx, 1);
      if (def.onRemove) {
        def.onRemove(target, delta);
      }
    } else if (def.onStack) {
      def.onStack(target, entry.stacks);
    }

    if (!options?.silent) {
      this.emitRemoved(target, id, delta);
      this.emitInventoryChanged(target);
    }
    return true;
  }

  /** 清空单位所有遗物（死亡等） */
  public clearUnit(target: Actor, options?: { silent?: boolean }): void {
    const uid = target.id;
    const list = this.inventory.get(uid);
    if (!list || list.length === 0) return;

    const copy = [...list];
    this.inventory.delete(uid);

    for (const e of copy) {
      const def = this.registry.get(e.id);
      if (def?.onRemove) {
        def.onRemove(target, e.stacks);
      }
    }

    if (!options?.silent) {
      for (const e of copy) {
        this.emitRemoved(target, e.id, e.stacks);
      }
      this.emitInventoryChanged(target);
    }
  }

  public getRelics(target: Actor): ReadonlyArray<RelicInventoryItem> {
    const list = this.inventory.get(target.id);
    if (!list) return [];
    return list.map((e) => ({ id: e.id, stacks: e.stacks }));
  }

  public hasRelic(target: Actor, id: RelicId): boolean {
    const list = this.inventory.get(target.id);
    return list !== undefined && list.some((e) => e.id === id);
  }

  /**
   * 单位死亡时清遗物并 detach Actor，避免 handle id 复用。
   * 由 registerDefaultRelicsAndPools 调用一次，避免 Actor ↔ RelicSystem 循环 import。
   */
  public bindDeathCleanup(): void {
    if (this.deathCleanupBound) {
      return;
    }
    this.deathCleanupBound = true;
    gameEvents.onUnitDeath((data) => {
      const actor = data.Actor;
      if (actor === undefined) {
        return;
      }
      this.clearUnit(actor);
      actor.detach();
    });
  }

  private emitAdded(target: Actor, relicId: RelicId, stacks: number): void {
    eventBus.emit(EVENT_ADDED, { actor: target, relicId, stacks });
  }

  private emitRemoved(target: Actor, relicId: RelicId, stacks: number): void {
    eventBus.emit(EVENT_REMOVED, { actor: target, relicId, stacks });
  }

  private emitInventoryChanged(target: Actor): void {
    eventBus.emit(EVENT_INVENTORY_CHANGED, { actor: target });
  }
}

export const RELIC_EVENT_ADDED = EVENT_ADDED;
export const RELIC_EVENT_REMOVED = EVENT_REMOVED;
export const RELIC_EVENT_INVENTORY_CHANGED = EVENT_INVENTORY_CHANGED;
