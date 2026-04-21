---
name: wc3-map-ts-template
description: >-
  Warcraft III 1.27a map development with TypeScript (typescript-to-lua), YDWE Lua
  runtime, w3x2lni (w2l) obj workflow, and object data as maps/table/*.ini. Use when
  working in this repo, editing TSTL/Lua bootstrap, war3map.j injection, w2l packaging,
  or WC3 object editor data in INI form.
---

# wc3-map-ts-template 项目认知

## 技术栈与目标版本

- **游戏**：魔兽争霸 III **1.27a**。
- **语言**：TypeScript → **typescript-to-lua (TSTL)** → **Lua 5.3**。
- **运行时**：**YDWE / KKWE** 提供的 Lua 环境与 JAPI（通过 `jass.*` 模块 `require`）。
- **API 封装**：`@eiriksgata/wc3ts`（类型与 WC3 API 绑定）。
- **地图工程**：**w3x2lni（W3x2Lni）**：用目录化工程表示地图，**打包/解包** 使用 `w2l.exe`。

## 核心载入链路

1. **JASS 入口**：`maps/map/war3map.j` 的 `main` 末尾应包含  
   `call Cheat("exec-lua:bootstrap")`  
   构建脚本 `scripts/common.ts` 的 `injectLuaExecutionCall()` 会在未注入时自动写入（或把旧的 `exec-lua:main` 升级为 `bootstrap`）。

2. **引导脚本**：`lua/bootstrap.lua` 在构建时复制到 **`maps/map/bootstrap.lua`**，随地图进 MPQ。

3. **`bootstrap.lua` 行为**：
   - 将 `jass.common`、`jass.japi` 注册进 `_G`。
   - **开发模式**：若存在全局 `PROJECT_PATH`（`handleBootstrapLua(true)` 注入），则 `require("src.main")`，并从 `dist/` 通过 `package.path` 加载多文件 Lua。
   - **生产模式**：无 `PROJECT_PATH` 时 `require("main")`，对应 **tsconfig.prod.json** 单文件打包输出。

4. **TS 入口**：`src/main.ts` 导出供 Lua 调用的初始化逻辑（如 `initialize`），与 `bootstrap.lua` 中 `main.initialize` 一致。

## 构建与命令（package.json）

| 命令 | 作用 |
|------|------|
| `yarn dev` | 开发：TSTL 编译、`injectLuaExecutionCall`、`handleBootstrapLua(true)`、`buildW3x`，并启动 `tstl --watch` 等开发流 |
| `yarn build:dev` | 单次开发构建：开发模式编译、`injectLuaExecutionCall`、`handleBootstrapLua(true)`、`buildW3x`；优先用于日常 agent 编译验证 |
| `yarn build` / `build:prod` | 生产：TSTL 单文件、`injectLuaExecutionCall`、`handleBootstrapLua(false)`、可选 luamin、`buildW3x` |
| `yarn build:map` | 仅 `w2l.exe obj ./maps ./dist/map.w3x`（不跑 TS 编译） |
| `yarn test:map` | 用 KKWE 启动 WC3 加载 `./dist/map.w3x` |

**w2l 路径**：`config.json` 中 `w2l.path`（默认 `dev_lib/w3x2lni`）。实际打包命令与 `scripts/common.ts` 中一致：`w2l.exe obj ./maps ./dist/map.w3x`。

## 目录约定

- **`src/`**：TypeScript 源码；TSTL 输出到 **`dist/`**（开发多文件，生产见 `tsconfig.prod.json` 的 bundle）。
- **`maps/`**：w3x2lni **obj 工程根**（含 `map/`、`resource/`、`table/` 等）。
- **`maps/map/`**：`war3map.j`、`bootstrap.lua`、地形/触发相关文件等。
- **`maps/table/*.ini`**：物编等数据以 **w3x2lni 的 INI 文本** 维护（如 `unit.ini`、`imp.ini`、`w3i.ini`），替代传统 World Editor 里直接改二进制物编的工作流；编辑后需 **`yarn build` / `yarn build:map`** 重新打包进 `map.w3x`。
- **`lua/`**：仓库中的 bootstrap 源，构建时同步到 `maps/map/bootstrap.lua`。

## 协助开发时的注意点

- 改 **载入方式** 时同时检查：`war3map.j`、`lua/bootstrap.lua`、`scripts/common.ts`。
- 改 **物编** 时优先看 **`maps/table`** 下对应 `*.ini` 节与字段，并确认 w3x2lni 版本与 1.27 数据兼容。
- 新增 **Lua 侧依赖路径** 时，开发模式依赖 `bootstrap.lua` 里对 `package.path` / `PROJECT_PATH` 的处理。

## 与 README 的关系

更完整的命令表、依赖说明见仓库根目录 **`README.md`**；本 skill 侧重 **TSTL + YDWE Lua + w2l + table/ini** 的固定约定，便于在本项目中快速对齐上下文。
