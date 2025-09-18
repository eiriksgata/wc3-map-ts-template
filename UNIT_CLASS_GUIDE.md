# Unit 类封装详细指南

## 🎯 概述

我们成功创建了一个强大的 `Unit` 类来封装魔兽争霸III的原生 `unit` 类型，提供了面向对象的API和更好的类型安全性！

## 🏗️ 架构设计

### 核心组件

1. **Unit 类** (`src/core/Unit.ts`)
   - 封装原生 `unit` 类型
   - 提供丰富的面向对象API
   - 支持自定义数据存储

2. **UnitFactory 类** (`src/core/UnitFactory.ts`)
   - 提供便捷的单位创建方法
   - 预设常用单位配置
   - 支持批量创建和编队

3. **EnhancedUnitService** (`src/services/EnhancedUnitService.ts`)
   - 管理 Unit 实例的生命周期
   - 提供高级查询和过滤功能
   - 统一的单位注册机制

## 🚀 基本使用

### 1. 创建单位

```typescript
// 方法1: 直接使用 Unit 构造函数
const hero = new Unit(player, 'hpea', 0, 0, 270);

// 方法2: 使用 UnitFactory（推荐）
const footman = UnitFactory.createPresetUnit('footman', player, 100, 100);

// 方法3: 通过 EnhancedUnitService
const unitService = app.getService<EnhancedUnitService>('EnhancedUnitService');
const archer = unitService.createUnit(player, 'earc', 200, 200, 270, 'my-archer');
```

### 2. 基本操作

```typescript
// 位置操作
const x = unit.getX();
const y = unit.getY();
unit.setPosition(100, 200);
unit.moveTo(300, 400);

// 属性操作
const life = unit.getLife();
const maxLife = unit.getMaxLife();
unit.setLife(500);

const lifePercent = unit.getLifePercent(); // 返回百分比

// 单位信息
const name = unit.getName();
const owner = unit.getOwner();
const level = unit.getLevel();
```

### 3. 战斗操作

```typescript
// 攻击
unit.attackUnit(targetUnit);
unit.attackMove(x, y);

// 移动和跟随
unit.moveTo(x, y);
unit.follow(targetUnit);
unit.stop();

// 技能操作
unit.learnSkill('AHhb'); // 学习圣光术
const skillLevel = unit.getSkillLevel('AHhb');
unit.setSkillLevel('AHhb', 3);
```

### 4. 自定义数据

```typescript
// 设置自定义数据
unit.setCustomData('role', 'hero');
unit.setCustomData('experience', 1500);
unit.setCustomData('inventory', ['sword', 'potion']);

// 获取自定义数据
const role = unit.getCustomData<string>('role');
const exp = unit.getCustomData<number>('experience');
const items = unit.getCustomData<string[]>('inventory');

// 检查和删除
if (unit.hasCustomData('role')) {
  unit.removeCustomData('role');
}
```

## 🏭 UnitFactory 高级使用

### 1. 预设单位

```typescript
// 创建人族单位
const peasant = UnitFactory.createPresetUnit('peasant', player, 0, 0);
const footman = UnitFactory.createPresetUnit('footman', player, 100, 0);
const priest = UnitFactory.createPresetUnit('priest', player, 200, 0);

// 创建其他种族单位
const peon = UnitFactory.createPresetUnit('peon', player, 0, 100);
const grunt = UnitFactory.createPresetUnit('grunt', player, 100, 100);
const shaman = UnitFactory.createPresetUnit('shaman', player, 200, 100);

// 查看可用预设
const presets = UnitFactory.getAvailablePresets();
print(`Available presets: ${presets.join(', ')}`);

// 按角色筛选
const workers = UnitFactory.getPresetsByRole('worker');
const casters = UnitFactory.getPresetsByRole('caster');
```

### 2. 编队创建

```typescript
// 方阵编队 (3x3)
const formation = UnitFactory.createFormation(
  'footman',    // 单位类型
  player,       // 玩家
  0, 0,         // 中心位置
  3, 3,         // 行列数
  120           // 间距
);

// 圆形编队
const circle = UnitFactory.createCircularFormation(
  'archer',     // 单位类型
  player,       // 玩家
  400, 0,       // 中心位置
  150,          // 半径
  8             // 单位数量
);
```

### 3. 特殊单位

```typescript
// 创建英雄
const hero = UnitFactory.createHero('Hpal', player, 0, 0);
if (hero) {
  hero.setCustomData('heroClass', 'paladin');
  hero.setCustomData('experience', 0);
}

// 创建巡逻单位
const patrolPoints = [
  { x: -200, y: 0 },
  { x: 0, y: 200 },
  { x: 200, y: 0 },
  { x: 0, y: -200 }
];
const patrol = UnitFactory.createPatrolUnit('knight', player, patrolPoints);

// 创建守卫
const guard = UnitFactory.createGuard(
  'grunt',              // 单位类型
  player,               // 玩家
  { x: 300, y: 300 },   // 守卫位置
  200                   // 警戒范围
);
```

## 🔧 EnhancedUnitService 功能

### 1. 单位管理

```typescript
const unitService = app.getService<EnhancedUnitService>('EnhancedUnitService');

// 创建并注册单位
const hero = unitService.createUnit(player, 'hpea', 0, 0, 270, 'main-hero');

// 从原生单位创建
const nativeUnit = CreateUnit(player, FourCC('hfoo'), 100, 100, 270);
const wrappedUnit = unitService.wrapNativeUnit(nativeUnit, 'hfoo', 'wrapped-footman');

// 获取注册的单位
const registeredHero = unitService.getUnit('main-hero');

// 批量创建
const configs = [
  { player, unitTypeId: 'hfoo', x: 0, y: 100, registryKey: 'guard-1' },
  { player, unitTypeId: 'hfoo', x: 100, y: 100, registryKey: 'guard-2' }
];
const units = unitService.createUnits(configs);
```

### 2. 高级查询

```typescript
// 获取所有有效单位
const validUnits = unitService.getValidUnits();

// 在范围内查找
const nearbyUnits = unitService.findUnitsInRange(0, 0, 500);

// 查找最近的单位
const nearest = unitService.findNearestUnit(100, 100);

// 按条件筛选
const heroes = unitService.filterUnits((unit: Unit) => 
  unit.getCustomData<string>('role') === 'hero'
);

const lowHealthUnits = unitService.filterUnits((unit: Unit) => 
  unit.getLifePercent() < 50
);
```

### 3. 统计和维护

```typescript
// 获取统计信息
const stats = unitService.getStats();
print(`Total: ${stats.total}, Valid: ${stats.valid}, Invalid: ${stats.invalid}`);

// 遍历所有单位
unitService.forEachUnit((unit, key) => {
  print(`${key}: ${unit.getName()} at (${unit.getX()}, ${unit.getY()})`);
});

// 清理无效单位（自动清理）
const validCount = unitService.getValidUnits().length;
```

## 🎮 实战示例

### 完整的地图初始化

```typescript
export function initializeMapWithUnits(app: Application): void {
  const unitService = app.getService<EnhancedUnitService>('EnhancedUnitService');
  const player = GetLocalPlayer();

  // 1. 创建主基地
  const townHall = unitService.createUnit(player, 'htow', 0, 0, 270, 'main-base');
  townHall?.setCustomData('buildingType', 'main');

  // 2. 创建起始单位
  const startingUnits = UnitFactory.createFormation('peasant', player, -200, 0, 2, 3, 80);
  startingUnits.forEach((unit, index) => {
    unitService.registerUnit(`worker-${index}`, unit);
    unit.setCustomData('jobType', 'idle');
  });

  // 3. 创建防御单位
  const defenders = UnitFactory.createCircularFormation('footman', player, 0, 0, 300, 6);
  defenders.forEach((unit, index) => {
    unitService.registerUnit(`defender-${index}`, unit);
    unit.setCustomData('role', 'defender');
  });

  // 4. 创建英雄
  const hero = UnitFactory.createHero('Hpal', player, 50, 50);
  if (hero) {
    unitService.registerUnit('player-hero', hero);
    hero.setLife(2000);
    hero.setMana(1000);
    hero.setCustomData('heroLevel', 1);
    hero.setCustomData('experience', 0);
  }

  print(`>>> Map initialized with ${unitService.getStats().total} units`);
}
```

### 动态单位行为

```typescript
// 设置定时器来更新单位行为
const behaviorTimer = CreateTimer();
TimerStart(behaviorTimer, 1.0, true, () => {
  const unitService = app.getService<EnhancedUnitService>('EnhancedUnitService');
  
  // 更新巡逻单位
  const patrolUnits = unitService.filterUnits(unit => 
    unit.hasCustomData('patrol')
  );
  
  patrolUnits.forEach(unit => {
    updatePatrolBehavior(unit);
  });
  
  // 更新守卫单位
  const guards = unitService.filterUnits(unit => 
    unit.hasCustomData('guard')
  );
  
  guards.forEach(unit => {
    updateGuardBehavior(unit);
  });
});
```

## 🔍 调试和监控

### 单位状态监控

```typescript
function printUnitStatus(unit: Unit): void {
  print(`=== Unit Status: ${unit.getName()} ===`);
  print(`Position: (${unit.getX()}, ${unit.getY()})`);
  print(`Life: ${unit.getLife()}/${unit.getMaxLife()} (${unit.getLifePercent().toFixed(1)}%)`);
  print(`Mana: ${unit.getMana()}/${unit.getMaxMana()} (${unit.getManaPercent().toFixed(1)}%)`);
  print(`Level: ${unit.getLevel()}`);
  print(`Valid: ${unit.isValid()}`);
  
  // 显示自定义数据
  const customKeys = ['role', 'experience', 'kills', 'formation'];
  customKeys.forEach(key => {
    if (unit.hasCustomData(key)) {
      const value = unit.getCustomData(key);
      print(`${key}: ${value}`);
    }
  });
  print(`================================`);
}
```

### 性能监控

```typescript
function monitorUnitPerformance(unitService: EnhancedUnitService): void {
  const stats = unitService.getStats();
  
  if (stats.invalid > 0) {
    print(`Warning: ${stats.invalid} invalid units detected`);
  }
  
  if (stats.total > 100) {
    print(`Note: High unit count (${stats.total}), consider optimization`);
  }
  
  print(`Unit Performance: ${stats.valid}/${stats.total} units active`);
}
```

## 🎯 最佳实践

1. **使用注册键**：为重要单位设置易记的注册键
2. **及时清理**：定期清理无效单位以释放内存
3. **合理使用自定义数据**：存储游戏逻辑需要的状态信息
4. **批量操作**：使用 UnitFactory 的批量创建功能提高性能
5. **类型安全**：充分利用 TypeScript 的类型检查
6. **模块化设计**：将单位逻辑分散到不同的服务和模块中

## 🔧 扩展建议

你可以基于这个架构进一步扩展：

- 添加单位状态机系统
- 实现单位AI行为树
- 创建单位装备系统
- 添加单位技能树
- 实现单位升级系统
- 创建单位编队指挥系统

这个 Unit 类封装为你的魔兽争霸III地图开发提供了强大而灵活的基础！🎉