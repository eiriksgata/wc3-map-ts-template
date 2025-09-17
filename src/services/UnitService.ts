import { IService } from '../types';
import { c2i } from '../lib/helper';
import { UNIT_STATE_LIFE, UNIT_STATE_MANA } from '../lib/define';

/**
 * 单位管理服务
 * 提供单位创建和管理的便捷方法
 */
export class UnitService implements IService {
  public readonly name = 'UnitService';
  private initialized = false;
  private unitRegistry: Map<string, unit> = new Map();

  /**
   * 初始化服务
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    print('>>> Initializing Unit Service...');
    this.initialized = true;
    print('>>> Unit Service initialized');
  }

  /**
   * 销毁服务
   */
  public destroy(): void {
    this.unitRegistry.clear();
    this.initialized = false;
    print('>>> Unit Service destroyed');
  }

  /**
   * 创建单位
   * @param player 玩家
   * @param unitTypeId 单位类型ID（字符串形式，如 'hpea'）
   * @param x X坐标
   * @param y Y坐标
   * @param facing 面向角度
   * @param registryKey 可选的注册键，用于后续查找
   */
  public createUnit(
    player: player, 
    unitTypeId: string, 
    x: number, 
    y: number, 
    facing: number = 270,
    registryKey?: string
  ): unit | null {
    try {
      const unitId = c2i(unitTypeId);
      const createdUnit = CreateUnit(player, unitId, x, y, facing);
      
      if (createdUnit && registryKey) {
        this.unitRegistry.set(registryKey, createdUnit);
      }
      
      return createdUnit;
    } catch (error) {
      print(`Error creating unit ${unitTypeId}: ${error}`);
      return null;
    }
  }

  /**
   * 获取注册的单位
   */
  public getUnit(registryKey: string): unit | undefined {
    return this.unitRegistry.get(registryKey);
  }

  /**
   * 移除单位
   */
  public removeUnit(unit: unit): void {
    try {
      RemoveUnit(unit);
      
      // 从注册表中移除
      for (const [key, registeredUnit] of this.unitRegistry.entries()) {
        if (registeredUnit === unit) {
          this.unitRegistry.delete(key);
          break;
        }
      }
    } catch (error) {
      print(`Error removing unit: ${error}`);
    }
  }

  /**
   * 设置单位生命值
   */
  public setUnitLife(unit: unit, life: number): void {
    try {
      SetUnitState(unit, UNIT_STATE_LIFE(), life);
    } catch (error) {
      print(`Error setting unit life: ${error}`);
    }
  }

  /**
   * 设置单位魔法值
   */
  public setUnitMana(unit: unit, mana: number): void {
    try {
      SetUnitState(unit, UNIT_STATE_MANA(), mana);
    } catch (error) {
      print(`Error setting unit mana: ${error}`);
    }
  }

  /**
   * 获取单位生命值
   */
  public getUnitLife(unit: unit): number {
    try {
      return GetUnitState(unit, UNIT_STATE_LIFE());
    } catch (error) {
      print(`Error getting unit life: ${error}`);
      return 0;
    }
  }

  /**
   * 获取单位魔法值
   */
  public getUnitMana(unit: unit): number {
    try {
      return GetUnitState(unit, UNIT_STATE_MANA());
    } catch (error) {
      print(`Error getting unit mana: ${error}`);
      return 0;
    }
  }

  /**
   * 获取所有注册的单位
   */
  public getAllRegisteredUnits(): Map<string, unit> {
    return new Map(this.unitRegistry);
  }

  /**
   * 清除所有注册的单位
   */
  public clearRegistry(): void {
    this.unitRegistry.clear();
    print('>>> Unit registry cleared');
  }
}