---
name: wc3-map-ts-template
description: >-
  Warcraft III 1.27a map development with TypeScript (typescript-to-lua), YDWE Lua
  runtime, w3x2lni LNI project under maps/, and object data as maps/table/*.ini. Use
  when working in this repo, editing TSTL/Lua bootstrap, war3map.j injection, w2l
  packaging, KKWE terrain/object editing, or WC3 object editor data in INI form.
---

# wc3-map-ts-template 项目认知

## 技术栈与目标版本

- **游戏**：魔兽争霸 III **1.27a**。
- **语言**：TypeScript → **typescript-to-lua (TSTL)** → **Lua 5.3**。
- **运行时**：**YDWE / KKWE** 提供的 Lua 环境与 JAPI（通过 `jass.*` 模块 `require`）。
- **API 封装**：`@eiriksgata/wc3ts`（类型与 WC3 API 绑定）。
- **地图工程**：**w3x2lni LNI 目录**（`maps/`）。KKWE 原生打开/保存 LNI，保存时直接写回 `maps/map/` 与 `maps/table/*.ini`。本仓库日常只用 `w2l.exe` **打包**（`maps/` → `dist/map.w3x`），**不要**在 KKWE 保存后再解包 `.w3x`。

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
| `yarn test:map` | 用 KKWE 启动 WC3 加载 `./dist/map.w3x`（**不要**用原版魔兽打开打包图） |

**w2l 路径**：`config.json` 中 `w2l.path`（默认 `dev_lib/w3x2lni`）。实际打包命令与 `scripts/common.ts` 中一致：`w2l.exe obj ./maps ./dist/map.w3x`。

## 目录约定

- **`src/`**：TypeScript 源码；TSTL 输出到 **`dist/`**（开发多文件，生产见 `tsconfig.prod.json` 的 bundle）。
- **`maps/`**：w3x2lni **LNI 工程根**（含 `map/`、`resource/`、`table/`，以及作为 LNI 标记的空文件 `.w3x`）。KKWE 直接打开这个目录。
- **`maps/map/`**：`war3map.j`、`bootstrap.lua`、地形/触发相关文件等。KKWE 保存地形时写这里。
- **`maps/table/*.ini`**：物编等数据以 **w3x2lni 的 INI 文本** 维护（如 `unit.ini`、`imp.ini`、`w3i.ini`）。KKWE 保存物编/地图信息时会自动更新这些 ini。手改或 KKWE 改完后，只有进游戏测图才需要 **`yarn build` / `yarn build:map`** 把 LNI **打包**进 `dist/map.w3x`。
- **`dist/map.w3x`**：构建产物（打包后的 MPQ）。**不要**用它当地形/物编编辑源，也**不要**再解包回 `maps/`。测图必须经 KKWE 启动；原版 `Warcraft III.exe` / 双击 `.w3x` **没有** KKWE 的 Lua/JAPI，地图脚本不会工作。
- **`lua/`**：仓库中的 bootstrap 源，构建时同步到 `maps/map/bootstrap.lua`。

## KKWE 地形 / 物编编辑（禁止解包）

1. 用 KKWE 打开 **`maps/`**（LNI 工程），不要打开 `dist/map.w3x`。
2. 编辑后保存：KKWE 会把地形写到 `maps/map/`，把物编/地图信息写到 `maps/table/*.ini`。源码已更新。
3. **禁止**让用户「保存后再用 w2l 解包 `.w3x`」或「把 `dist/map.w3x` 解回 `maps/`」。解包不是日常流程。
4. 要进游戏测图时再打包：`yarn build:map` / `yarn build:dev`，然后用 **`yarn test:map`（KKWE）** 启动。禁止让用户用原版魔兽打开 `dist/map.w3x`。
5. 只有第一次把**外部**独立 `.w3x` 导入成本仓库 LNI 工程时，才考虑 `w2l lni`。

## 测图必须经 KKWE（原版魔兽无效）

打包好的 `dist/map.w3x` 依赖 KKWE 的 Lua 运行时与 JAPI。用原版 1.27a `Warcraft III.exe`、双击 `.w3x`、或官方客户端加载，脚本/JAPI **不会工作**。对用户说话时禁止出现「直接用魔兽打开 map.w3x」这类步骤。

## 协助开发时的注意点

- 改 **载入方式** 时同时检查：`war3map.j`、`lua/bootstrap.lua`、`scripts/common.ts`。
- 改 **物编** 时优先看 **`maps/table`** 下对应 `*.ini` 节与字段，并确认 w3x2lni 版本与 1.27 数据兼容。KKWE 里改完保存即可，不必解包。
- 新增 **Lua 侧依赖路径** 时，开发模式依赖 `bootstrap.lua` 里对 `package.path` / `PROJECT_PATH` 的处理。

## 与 README 的关系

更完整的命令表、依赖说明见仓库根目录 **`README.md`**；本 skill 侧重 **TSTL + YDWE Lua + w2l + table/ini** 的固定约定，便于在本项目中快速对齐上下文。
