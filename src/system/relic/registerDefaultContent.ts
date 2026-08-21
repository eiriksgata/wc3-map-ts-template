import { burningBloodDefinition } from "./definitions/burningBlood";
import { warFangDefinition } from "./definitions/warFang";
import { ironPlateDefinition } from "./definitions/ironPlate";
import { arcaneGrimoireDefinition } from "./definitions/arcaneGrimoireWater";
import { RelicSystem } from "./RelicSystem";

/**
 * 注册示例遗物与命名池 `common`（可在 main 中调用一次）
 */
export function registerDefaultRelicsAndPools(): void {
  const rs = RelicSystem.getInstance();
  rs.registerDefinitions([
    burningBloodDefinition,
    warFangDefinition,
    ironPlateDefinition,
    arcaneGrimoireDefinition,
  ]);
  rs.registerPool("common", [
    { id: "burning_blood", weight: 1 },
    { id: "war_fang", weight: 1 },
    { id: "iron_plate", weight: 1 },
    { id: "arcane_grimoire_water", weight: 1 },
  ]);
  rs.bindDeathCleanup();
}
