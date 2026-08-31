# 魔兽争霸 3 1.27a TypeScript 开发模板

> 使用 TypeScript 开发魔兽争霸 3 地图的现代化模板，支持热重载、模块化开发和自动化构建。

> **如果你想使用完整的框架体系，推荐使用main分支。如果你只是想简单的使用推荐使用simple分支**

## ✨ 特性

- 🔥 **热重载** - 修改代码后自动更新，无需重启游戏
- 📦 **模块化** - TypeScript 模块化开发，代码组织清晰
- 🛠 **自动构建** - 一键编译打包，自动注入 Cheat
- 🎮 **开箱即用** - 内置 KKWE + w3x2lni 环境
- 📚 **类型安全** - 完整的 WC3 API 类型定义

## 快速开始

### 环境要求

- Node.js 16+
- Yarn
- Warcraft III 1.27a

### 安装

```bash
git clone https://github.com/eiriksgata/wc3-map-ts-template.git
cd wc3-map-ts-template
yarn install
```

### 开发

```bash
# 开发模式（支持热重载）
yarn dev

# 运行地图测试（必须经 KKWE 启动，原版魔兽打不开本图）
yarn test:map
```

### 发布

```bash
# 日常单次开发构建
yarn build:dev

# 生产构建
yarn build
```

## 📋 命令说明

| 命令 | 说明 |
|------|------|
| `yarn dev` | 开发模式，支持热重载和文件监听 |
| `yarn build:dev` | 单次开发构建，适合调试和 AI 编译验证 |
| `yarn build` | 生产构建，打包成单文件并压缩 |
| `yarn build:prod` | 显式生产构建，效果与 `yarn build` 一致 |
| `yarn test` | 编译并自动运行地图 |
| `yarn watch` | 仅监听 TypeScript 文件变化 |
| `yarn build:map` | 仅打包地图（不编译） |
| `yarn test:map` | 仅运行地图（经 KKWE 启动，不编译） |

## ⚡ 开发模式 vs 生产模式

| 特性 | Dev (`yarn dev`) | Prod (`yarn build`) |
|------|------------------|---------------------|
| 输出 | 多个模块化 `.lua` 文件 | 单个 `main.lua` |
| 热重载 | ✅ 支持 | ❌ 不支持 |
| 代码压缩 | ❌ 否 | ✅ 是 |
| 适用场景 | 开发调试 | 发布地图 |

## 📁 目录结构

```
├── src/                # TypeScript 源代码
│   ├── main.ts         # 入口文件
│   ├── system/         # 系统模块（事件、伤害、护盾、Buff、遗物、血条、热重载等）
│   ├── config/         # 配置文件
│   └── examples/       # 示例代码
├── maps/               # w3x2lni LNI 工程（KKWE 直接打开/保存）
│   ├── map/            # 地形与地图数据
│   ├── table/          # LNI 物编 / 地图信息（KKWE 保存时自动更新）
│   └── resource/       # 资源文件
├── lua/                # Lua 启动脚本
├── dist/               # 构建输出目录
├── dev_lib/            # 开发工具（KKWE、w3x2lni）
├── scripts/            # 构建脚本
└── config.json         # 环境配置
```

## 🧩 内置系统模块

下列系统面向 **main 分支**完整框架；simple 分支不保证齐套。

### 战斗与数值

| 模块 | 说明 | 路径 |
|------|------|------|
| 事件系统 | `EventBus`、鼠标 / 键盘，以及单位受伤、死亡、召唤等游戏事件；护盾、伤害飘字都挂在这条链上。 | [`src/system/event/`](src/system/event/)、[`docs/event-system.md`](docs/event-system.md) |
| Actor | 单位运行时包装（血条、`BuffManager`、护盾查询），全局 `Actor.allActors`。 | [`src/system/actor.ts`](src/system/actor.ts) |
| 伤害系统 | 全图受伤触发，转成 `UNIT_DAMAGED` 事件；入口在 `initialize()`。 | [`src/system/damage.ts`](src/system/damage.ts) |
| 护盾系统 | 护盾是 Buff 的一种：高优先级订阅受伤事件，先扣护盾再写回剩余伤害。 | [`src/system/ShieldSystem.ts`](src/system/ShieldSystem.ts) |
| Buff 系统 | 每单位 `BuffManager`、0.1s 全局 tick、护盾 Buff 与展示注册表。 | [`src/system/buff/`](src/system/buff/) |
| 遗物系统 | 定义注册、抽取池、单位库存与增减事件。 | [`src/system/relic/`](src/system/relic/) |
| 召唤系统 | 英雄召唤物继承召唤者生命与攻击。 | [`src/system/SummoningSystem.ts`](src/system/SummoningSystem.ts) |
| 弹幕 / 符卡 | 对象池弹幕、碰撞与伤害，适合演示向技能卡。 | [`src/system/bullethell/`](src/system/bullethell/) |

### 表现与 HUD

| 模块 | 说明 | 路径 |
|------|------|------|
| 单位血条 | 世界坐标跟随的血 / 蓝 / 护盾条（`UnitBlood`）；另有 KKWE 风格英雄条 `KKWEHeroBloodBar`。 | [`UnitBlood.ts`](src/system/ui/component/UnitBlood.ts)、[`KKWEHeroBloodBar.ts`](src/system/ui/component/KKWEHeroBloodBar.ts) |
| Buff 栏 / 遗物栏 | 本地玩家 HUD，图标 + Tips。 | [`BuffBarUI.ts`](src/system/ui/component/BuffBarUI.ts)、[`RelicBarUI.ts`](src/system/ui/component/RelicBarUI.ts) |
| 伤害飘字 | 世界坐标伤害数字，对象池。 | [`src/system/ui/DamageTexttag.ts`](src/system/ui/DamageTexttag.ts) |

### UI 组件与开发

| 模块 | 说明 | 路径 |
|------|------|------|
| UI 组件 | `Button`、`FDFButton`、`Panel`、`Dialog`、`Tips`、`Text`、`MessageList` 等，继承 `UIComponentBase`。 | [`docs/Button-Usage.md`](docs/Button-Usage.md)、[`docs/Dialog-Usage.md`](docs/Dialog-Usage.md)、[`docs/panel-usage.md`](docs/panel-usage.md)、[`docs/tips-usage.md`](docs/tips-usage.md) |
| 热重载 / 模块管理 | 开发态模块热替换与生命周期；生产构建会关闭热重载。 | [`docs/hot-reload-usage.md`](docs/hot-reload-usage.md) |

运行时入口是 [`src/main.ts`](src/main.ts) 的 `initialize()`：已依次注册默认遗物与抽取池、创建 Buff / 遗物栏、注册单位血条绘制，以及伤害 / Buff / 护盾 / 召唤的 `init`。对照示例在 `src/examples/`、`src/test/`（如护盾 `HeroUnitSkillTestExample`、Buff 栏 / 遗物 / 弹幕测试）。

## 🔧 配置说明

### config.json

```json
{
  "w2l": { "path": "dev_lib/w3x2lni" },
  "kkwe": { "path": "dev_lib/KKWE" }
}
```

### 地形编辑

`maps/` 是 **LNI 工程**（根目录的 `.w3x` 只是 LNI 标记，不是打包后的 MPQ）。KKWE 原生打开并保存 LNI，保存后会直接写回 `maps/map/` 与 `maps/table/*.ini`。

1. 用 KKWE 打开 `maps/` 目录（或该目录下的 LNI 标记 `.w3x`），**不要**打开 `dist/map.w3x` 来改地形
2. 编辑地形 / 装饰物 / 单位摆放后保存即可，**不需要**再用 w2l 解包 `.w3x`
3. 若要进游戏验证，再运行 `yarn build:dev` 或 `yarn dev` 把 LNI **打包**成 `dist/map.w3x`；发布前再运行 `yarn build`

### 运行地图（必须经 KKWE）

打包后的 `dist/map.w3x` **不能**用原版魔兽争霸 III（`Warcraft III.exe`、双击 `.w3x`、战网客户端）打开。本图依赖 KKWE 提供的 Lua 运行时与 JAPI，原版客户端里脚本不会生效。

正确启动方式：

```bash
yarn test:map
```

在 Cursor / VS Code 里按 **F5** 会启动 `scripts/test.ts`：经 KKWE 拉起地图，并等到 `war3` 退出后结束调试会话。测图无脚本 / JAPI 报错时，先确认是否误用了原版魔兽启动。

## 📦 主要依赖

| 依赖 | 说明 |
|------|------|
| [@eiriksgata/wc3ts](https://github.com/eiriksgata/wc3ts) | WC3 TypeScript API 封装 |
| typescript-to-lua | TypeScript 到 Lua 编译器 |
| luamin | Lua 代码压缩 |

## 🎯 路线图

- [x] 热重载系统
- [x] UI 组件系统（Button、FDFButton）
- [x] 血条 UI
- [x] 伤害系统
- [ ] 属性面板 UI
- [ ] Excel 物编转换
- [ ] 技能系统模板

## 🤖 AI 辅助开发

项目包含 GitHub Copilot 指令文件，提供项目特定的代码提示：

```
.github/copilot-instructions.md
```

## 📄 License

MIT

## 🤝 Contributing

欢迎提交 PR 和 Issue！
