import { createLogger } from "src/utils/logger";
import { RelicDefinition, RelicId } from "./types";

const log = createLogger("RelicRegistry");

/**
 * 遗物 id → 定义（启动时注册）
 */
export class RelicRegistry {
  private readonly map = new Map<RelicId, RelicDefinition>();

  public register(def: RelicDefinition): void {
    if (this.map.has(def.id)) {
      log.warn(`overwrite relic definition: ${def.id}`);
    }
    this.map.set(def.id, def);
  }

  public registerAll(defs: RelicDefinition[]): void {
    for (const d of defs) {
      this.register(d);
    }
  }

  public get(id: RelicId): RelicDefinition | undefined {
    return this.map.get(id);
  }

  public has(id: RelicId): boolean {
    return this.map.has(id);
  }
}
