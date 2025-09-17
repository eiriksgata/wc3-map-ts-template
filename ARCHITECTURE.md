# WC3 TypeScript Map Template - 解耦架构

这是一个经过优化和重构的魔兽争霸III地图TypeScript模板，采用了现代化的解耦架构设计。

## 🏗️ 架构概览

### 核心设计原则
- **单一职责原则**：每个模块只负责一个功能
- **依赖注入**：通过服务管理器注入依赖
- **配置驱动**：统一的配置管理
- **模块化设计**：可插拔的功能模块
- **事件驱动**：松耦合的组件通信

### 目录结构

```
src/
├── index.ts              # 应用程序主入口
├── runtime.ts            # 旧版运行时（保留兼容）
├── core/                 # 核心层
│   ├── index.ts         # 核心模块入口
│   ├── Application.ts   # 应用程序主类
│   └── runtime.ts       # 运行时管理器
├── config/              # 配置层
│   └── index.ts         # 配置管理器
├── services/            # 服务层
│   ├── index.ts         # 服务管理器
│   ├── EventService.ts  # 事件服务
│   └── UnitService.ts   # 单位管理服务
├── modules/             # 模块层
│   ├── index.ts         # 模块入口
│   └── AutoSaveModule.ts # 自动保存模块
├── types/               # 类型定义
│   └── index.ts         # 通用类型和接口
├── lib/                 # 工具库（保持原有）
│   ├── const.ts
│   ├── define.ts
│   ├── helper.ts
│   └── ydlua.ts
└── map/                 # 地图逻辑
    └── start.ts         # 地图初始化
```

## 🚀 快速开始

### 1. 应用程序入口 (index.ts)

```typescript
import { Application } from './core';
import { EventService } from './services/EventService';
import { UnitService } from './services/UnitService';
import { mapInit } from './map/start';

async function main(): Promise<void> {
  const app = Application.getInstance();
  
  // 注册服务
  app.registerService(new EventService());
  app.registerService(new UnitService());
  
  // 初始化应用
  await app.initialize();
  
  // 启动地图逻辑
  mapInit(app);
}

main();
```

### 2. 创建自定义服务

```typescript
import { IService } from '../types';

export class MyCustomService implements IService {
  public readonly name = 'MyCustomService';
  
  public initialize(): void {
    print('>>> My custom service initialized');
  }
  
  public destroy(): void {
    print('>>> My custom service destroyed');
  }
  
  // 你的业务逻辑
  public doSomething(): void {
    print('Doing something...');
  }
}
```

### 3. 使用服务

```typescript
export function mapInit(app: Application): void {
  // 获取服务
  const unitService = app.getService<UnitService>('UnitService');
  const eventService = app.getService<EventService>('EventService');
  
  // 使用服务
  if (unitService) {
    const hero = unitService.createUnit(GetLocalPlayer(), 'hpea', 0, 0);
  }
  
  if (eventService) {
    eventService.on('unit.created', () => {
      print('A unit was created!');
    });
  }
}
```

## 📋 主要特性

### 🔧 配置管理
- 统一的配置接口
- 运行时配置更新
- 环境特定配置

### 🎯 事件系统
- 类型安全的事件处理
- 松耦合的组件通信
- 自动事件清理

### 🏭 服务管理
- 自动依赖注入
- 服务生命周期管理
- 懒加载和单例模式

### 🧩 模块系统
- 可插拔的功能模块
- 运行时启用/禁用
- 模块间隔离

## 🛠️ 开发指南

### 创建新服务

1. 实现 `IService` 接口
2. 在 `main()` 函数中注册服务
3. 通过 `app.getService()` 使用服务

### 创建新模块

1. 实现 `IModule` 接口
2. 在需要的地方启用/禁用模块
3. 模块可以依赖服务进行工作

### 配置管理

```typescript
const config = app.getConfigManager();

// 更新配置
config.updateConfig({
  debug: false,
  runtime: {
    debuggerPort: 5000
  }
});

// 读取配置
const isDebug = config.isDebugMode();
```

### 事件处理

```typescript
const eventService = app.getService<EventService>('EventService');

// 监听事件
eventService.on('unit.died', (data) => {
  print(`Unit ${GetUnitName(data.unit)} died!`);
});

// 触发事件
eventService.emit('unit.created', { unit: someUnit, player: somePlayer });
```

## 🎮 示例用法

查看 `src/map/start.ts` 中的完整示例，展示了：
- 如何获取和使用服务
- 如何设置事件监听器
- 如何创建和管理单位
- 如何使用模块系统

## 🔄 迁移指南

从旧版本迁移：

1. **运行时初始化**：
   - ~~`env()`~~ → `app.initialize()`
   
2. **单位创建**：
   - ~~`CreateUnit(player, c2i("hpea"), x, y, facing)`~~
   - → `unitService.createUnit(player, "hpea", x, y, facing)`

3. **事件处理**：
   - ~~手动创建触发器~~
   - → `eventService.on('event.type', handler)`

## 🏆 优势

- **更好的代码组织**：清晰的分层架构
- **更强的类型安全**：完整的TypeScript类型支持
- **更易的测试**：模块化设计便于单元测试
- **更好的维护性**：松耦合的组件设计
- **更强的扩展性**：可插拔的服务和模块系统

## 📦 构建和运行

```bash
# 开发模式
yarn dev

# 生产构建
yarn build

# 运行测试
yarn test
```

这个新架构保持了与原有代码的兼容性，同时提供了更好的开发体验和代码质量。