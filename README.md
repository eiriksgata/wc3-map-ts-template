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
│   ├── system/         # 系统模块（UI、热重载等）
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

在 Cursor / VS Code 里按 **F5** 也会执行同一条命令（见 `.vscode/launch.json`）。内部走 `YDWEConfig.exe -launchwar3 -loadfile`。测图无脚本 / JAPI 报错时，先确认是否误用了原版魔兽启动。

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
- [ ] 属性面板 UI
- [ ] 伤害系统
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
