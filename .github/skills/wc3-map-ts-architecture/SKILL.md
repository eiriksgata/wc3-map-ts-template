---
name: wc3-map-ts-architecture
description: >-
  Repository map for wc3-map-ts-template: src/ layout, system subsystems (UI,
  event, buff, damage, relic, etc.), config/constants, examples and docs entry
  points. Use when navigating this codebase, locating where a feature lives,
  onboarding, or planning work in a subsystem. Complements the wc3-map-ts-template
  skill (TSTL bootstrap, w2l, maps/table ini).
---

# wc3-map-ts-template 架构与模块速查

## 与本仓库另一技能的关系

- **`wc3-map-ts-template`**：构建链、YDWE/KKWE、`bootstrap.lua`、`war3map.j`、w3x2lni、`maps/table/*.ini`。
- **本技能（wc3-map-ts-architecture）**：应用层 **TypeScript 源码结构**、各目录职责、常见功能「去哪找」。

二者同时适用时：改打包/物编/载入先看前者；改游戏逻辑与 UI 先看本技能。

## 项目定位（一句话）

基于 **TypeScript → TSTL → Lua** 的 **魔兽争霸 III 1.27a** 地图工程模板，使用 `@eiriksgata/wc3ts` 与 KKWE/YDWE JAPI；`src/main.ts` 的 `initialize()` 为运行时入口，`main()` 为延迟启动的游戏逻辑入口。

## 顶层目录

| 路径 | 职责 |
|------|------|
| `src/` | 全部 TS 业务与系统代码；TSTL 输出到 `dist/` |
| `maps/` | w3x2lni 工程（`map/`、`resource/`、`table/` 等） |
| `lua/` | `bootstrap.lua` 源，构建时复制到 `maps/map/` |
| `scripts/` | Node 构建：`build.ts`、`dev.ts`、`common.ts`（注入 Cheat、bootstrap 等） |
| `docs/` | 组件与系统说明（Tips、Panel、热重载、事件等） |
| `dev_lib/` | KKWE、w3x2lni 等本地工具 |

## `src/` 一级结构

| 目录 / 文件 | 职责 |
|-------------|------|
| `main.ts` | 导出 `initialize()`、`onHotReload()`；集中注册系统、加载 TOC、调用各子系统 `init` |
| `config/` | 地图与玩家等配置：`Map.ts`、`Players.ts`、`MapUnit.ts`，`index.ts` 聚合导出 |
| `constants/` | 按 frame / game / ui 分类的常量；见 `constants/README.md` |
| `types/` | 公共类型 |
| `utils/` | `helper.ts`、`queue.ts`、`CameraControl.ts` 等通用工具 |
| `ydlua/` | ydlua 封装入口（`main` 里 `ydlua.getInstance().initialize()`） |
| `examples/` | 可运行示例（按钮、Dialog、Tips、单位事件、JAPI 等），用于对照 API |
| `test/` | 地图内测试/演示入口（如遗物、技能测试） |

## `src/system/` 子系统（核心）

按「找功能」用途速查：

| 区域 | 路径 | 职责摘要 |
|------|------|----------|
| 事件 | `system/event/` | `GameEvent`、`MouseEvent`、`KeyboardEvent`、`EventBus` / `EventEmitter`；`index.ts` 里 `mouseEvents.initialize()` 等在 `main` 中调用 |
| UI 基类 | `system/ui/` | `UIComponent.ts`、`UILayout.ts`、`ScreenCoordinates.ts`；`DamageTexttag`、`GameUIConsole` |
| UI 组件 | `system/ui/component/` | `Button`、`Panel`、`Dialog`、`Tips`、`Text`、`MessageList`、`UnitBlood`、`GachaPanel`、`KKWEHeroBloodBar`、**`RelicBarUI`** 等；多继承 `UIComponentBase` |
| FDF | `system/ui/fdf/` | `FDFButton` 等与 Frame 资源相关的封装 |
| 伤害 | `system/damage.ts` | `DamageSystem` 单例，与技能/攻击结算相关 |
| Buff | `system/buff/` | `Buff`、`BuffManager`、`BuffSystem`、`ShieldBuff`；驱动力与持续时间 tick |
| 护盾 | `system/ShieldSystem.ts` | 与 Buff 配合，吸收伤害并写回 `event damage` |
| 召唤 | `system/SummoningSystem.ts` | 召唤物逻辑入口 |
| 遗物 | `system/relic/` | `RelicRegistry`、`RelicPool`、`RelicSystem`、`types`；`definitions/*.ts` 单遗物定义；`registerDefaultContent.ts` 注册内容；`index.ts` 导出注册函数 |
| Actor | `system/actor.ts` | 演员/单位表现相关辅助 |
| 模块与热重载 | `ModuleManager.ts`、`HotReload.ts` | 模块注册、依赖顺序初始化、`require` 热替换（`main` 中热重载相关调用多已注释，慎用） |
| 其它 | `console.ts`、`LeakDetector.ts` | 调试控制台、泄露检测（可选启用） |

## 文档入口（`docs/`）

需要细节时优先打开对应 md（与代码并列维护）：

- `docs/index.md`：总索引（若为空则按文件名搜）
- UI / 组件：`panel-usage.md`、`Button-Usage.md`、`Dialog-Usage.md`、`tips-*.md`、`fdf-reference.md`
- 热重载：`hot-reload-usage.md`、`hot-reload-design.md`、`hot-reload-troubleshooting.md`
- 事件：`event-system.md`
- 构建：`build-refactor.md`、`dev-mode.md`

## 协作时的推荐顺序

1. **确定领域**：UI → `system/ui`；输入 → `system/event`；数值与状态 → `buff` / `damage` / `ShieldSystem`；局外养成式能力 → `system/relic`。
2. **读 barrel**：目标目录下的 `index.ts`（若有）看对外导出。
3. **对照示例**：`examples/` 或 `test/` 中带 `Example` 的文件通常演示最小接入方式。
4. **常量与配置**：魔法数字优先查 `constants/`；地图/玩家级参数查 `config/`。

## 输出与沟通约定（给 Agent）

- 说明「某功能在哪里」时，给出 **目录 + 关键文件名**，必要时引用 `docs/` 中的专题文档。
- 修改子系统时 **对齐现有命名与单例/init 模式**（与 `main.ts` 中各 `getInstance().init()` 风格一致）。
- 不重复展开 **w2l / bootstrap / ini 物编** 细节，除非任务涉及；该部分以 `wc3-map-ts-template` 技能为准。
