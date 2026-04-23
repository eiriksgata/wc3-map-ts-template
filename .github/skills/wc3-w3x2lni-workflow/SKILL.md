---
name: wc3-w3x2lni-workflow
description: >-
  w3x2lni (w2l) 工作流：如何用 maps/ 作为 obj 工程根来打包 map.w3x，maps/table/*.ini
  如何承载物编（物体编辑器数据），maps/resource/ 如何承载进 MPQ 的资源文件，以及
  resource/object-data/*（TS 侧）作为物编唯一数据源与 maps/table 的分工。参考
  dev_lib/w3x2lni-src 源码。新增技能/单位/物品/Buff/模型/贴图时用本技能决定数据与资源落点。
---

# w3x2lni (w2l) 工作流与数据放置约定

本技能 **与** `wc3-map-ts-template`（构建链总览）及 `wc3-map-ts-architecture`（`src/` 代码结构）并列：
**何时看本技能** = 改/加 **物编**、**资源（mdl/blp/tga/fdf/toc）**、**imp.ini 引用**、**w2l 打包问题**，或要向 AI 解释「应该把数据/资源放在哪里」。

## 一句话心智模型

- `maps/` 是 **w2l 的 obj 工程根**（对应 w3x2lni 的 "Obj" 储存形式 = 解包后的 w3x 目录）。
- `w2l.exe obj ./maps ./dist/map.w3x` 把整个 `maps/` 打包为标准 `map.w3x`（MPQ）。
- `maps/table/*.ini` 是 **w3x2lni 特有的 Lni 文本物编**，打包时会被 w2l 当作补丁与 `_parent` 所继承的 Slk 默认数据合并，再以 `war3map.w3u/w3a/w3t/w3b/w3d/w3h/w3q` + `war3mapMisc.txt`/`war3mapSkin.txt` 等形式写入 `map.w3x`。
- `maps/resource/**/*` 是要随地图进入 MPQ 的 **美术/UI 资源**（模型、贴图、FDF、TOC 等）；**必须** 在 `maps/table/imp.ini` 里登记 MPQ 内路径才会进包并被 WAR3 寻址。
- ⚠ **路径映射有陷阱**：w2l 按扩展名分类，`blp/tga/mdx/mdl/dds/tif` 打包时会被 **剥掉 `resource\` 前缀**（引擎路径不带 resource），而 `fdf/toc/ttf/slk` 等 **保留 `resource\` 前缀**。详见下文「关键规则」章节。
- `resource/object-data/*.ts` 是 **TS 侧物编数据源**（`UnitTable` / `AbilityTable` / `ItemTable` / `BuffTable` / `MiscTable` / `TxtTable` …）。约定：构建期 `scripts/prepack` 把它们序列化为 `maps/table/*.ini`，**然后** 再跑 w2l。运行时禁止修改。

## 顶层目录总览（以本仓库为准）

| 路径 | 角色 | 写入时机 | 进不进 MPQ |
|------|------|----------|------------|
| `maps/` | **w2l obj 工程根** | 手写 + 构建时注入（bootstrap.lua / war3map.j） | 整体被打进 `map.w3x` |
| `maps/map/` | 地形/触发/`war3map.j`/`bootstrap.lua` | 由 WE 或构建脚本写 | ✅（MPQ 根） |
| `maps/table/*.ini` | 物编（Lni 文本，w3x2lni 专用） | `resource/object-data/*.ts` → prepack 生成；也可手写 | 转换为 w3u/w3a/... 后进 MPQ |
| `maps/resource/**` | 随地图进 MPQ 的资源（.mdl/.mdx/.blp/.tga/.fdf/.toc …） | 人工放置 | ✅（需登记到 `imp.ini`） |
| `maps/trigger/` | 触发相关工程文件 | WE / w2l | 视 w2l 规则 |
| `maps/w3x2lni/` | 地图内插件目录（可选） | 手写 | w2l 会应用其中 `plugin/*` |
| `maps/.w3x` | **Lni 模式标记文件**（存在即告诉 w2l 这是 lni 工程） | 由 w2l 首次生成 | ❌ |
| `resource/object-data/*` | **TS 侧物编数据源**（类型安全） | 手写 TS | ❌ 仅参与预打包 |
| `resource/model/**` | 本地素材仓库（可镜像给 `maps/resource/`） | 手写 | ❌（需拷贝进 `maps/resource/`） |
| `dev_lib/w3x2lni/` | **w2l 运行时**（`w2l.exe`、`template/`、`data/`） | 依赖 | — |
| `dev_lib/w3x2lni-src/` | w2l 源码（Lua），用来理解规则 | 依赖 | — |

## w3x2lni 核心概念（源码出处）

读 `dev_lib/w3x2lni-src/docs/zh-cn/insider.md` 对照。

- **四种格式**：`Map`（原始）→ **`Full`**（保留全量的内部中间态）→ `Obj` / `Lni` / `Slk`。
  - `Lni` = 版本管理友好的纯文本，`maps/table/*.ini` 就是这种格式的物编表。
  - `Obj` = WE 能识别的 `war3map.w3u/w3a/...` 二进制补丁集合。
  - `Slk` = 发布态，做了大量优化（移除未引用、slk 化、混淆等），**有损**。
- **`_parent`**：每个 Lni/Obj 自定义条目的基准 rawcode，必填。转换时从 `Slk` 默认数据复制 `_parent` 的全量属性，再用当前条目的键覆盖。示例：
  ```ini
  [u00K]
  _parent = "uske"      ; 继承原版 skeleton warrior
  Name = "屍爆"          ; 只写差异字段
  file = "test1.mdl"
  ```
- **合并优先级**（Core Frontend）：`Lni > Obj > Slk`。所以本仓库只维护 Lni（`maps/table/*.ini`）即可，无需同时维护 WE 的 `war3map.w3u`。
- **Metadata**：w2l 用 War3 的 metadata 做真源（以「能在游戏里正确运行」为目标）；因此 `maps/table/*.ini` 中的字段名**以 `dev_lib/w3x2lni/template/Custom/*.ini` 为准**（不是 WE 的汉字列名）。

## `w2l.exe obj` 做了什么（对照源码）

命令形式（本仓库构建脚本 `scripts/common.ts` 里的 `buildW3x`）：

```
dev_lib/w3x2lni/w2l.exe obj ./maps ./dist/map.w3x
```

对应源码入口：`dev_lib/w3x2lni-src/script/backend/convert.lua` + `script/backend/cli/obj.lua`：

1. 读输入工程 `./maps`（识别 `.w3x` 标记 → `input_mode = 'lni'`）。
2. `config.ini [global] data = zhCN-1.24.4` 指定使用的默认物编数据集合（存在于 `dev_lib/w3x2lni/data/zhCN-1.24.4/`）。
3. `frontend`：读取 `maps/table/*.ini` + 可能的 slk/obj 差异 → 合并为 `Full`。
4. `backend`：按目标模式（此处 `obj` / Slk / Lni）写回 `war3map.w3u` 等二进制物编以及 Jass / 文件系统。
5. `builder.save` 把所有文件以 MPQ 打包到 `./dist/map.w3x`。

> 要改打包行为：优先考虑写 **地图内插件**（`maps/w3x2lni/plugin/*.lua` + `plugin/.config`，见源码 `script/backend/plugin.lua` 与 `docs/zh-cn/plugin.md`）。

## 各类数据/资源「应该加到哪里」速查表

| 新增内容 | 数据源（写这里） | w2l 中间产物 / 目标 ini | 资源文件放哪 | 是否需要 `imp.ini` 登记 |
|----------|------------------|--------------------------|--------------|-------------------------|
| 自定义 **单位**（rawcode，如 `E001`） | `resource/object-data/unit/UnitTable.ts`（`_parent` 必填） | `maps/table/unit.ini` → `war3map.w3u` | 模型/图标 → `maps/resource/Model/`、`maps/resource/Texture/replaceabletextures/commandbuttons/` | 是（自定义模型/图标路径） |
| 自定义 **技能** | `resource/object-data/ability/AbilityTable.ts`（`_parent` = 原版技能 rawcode，如 `AHbz`） | `maps/table/ability.ini` → `war3map.w3a` | 图标/特效模型 → `maps/resource/...` | 是（自定义资源） |
| 自定义 **物品** | `resource/object-data/item/ItemTable.ts` | `maps/table/item.ini` → `war3map.w3t` | 同上 | 是（自定义资源） |
| 自定义 **Buff / Effect** | `resource/object-data/buff/BuffTable.ts` | `maps/table/buff.ini` → `war3map.w3h` | 特效模型 → `maps/resource/...` | 是（自定义） |
| 自定义 **装饰物 / 可破坏物 / 升级 / 商店可卖物** | `resource/object-data/{doodad,destructable,upgrade}/*.ts` | `maps/table/{doodad,destructable,upgrade}.ini` → `w3d/w3b/w3q` | 模型 → `maps/resource/Model/` | 是 |
| **游戏常量 / UI 常量**（MiscData） | `resource/object-data/misc/MiscTable.ts`（字段见 `FontHeights`/`HERO`/`InfoPanel`/`Misc`） | `maps/table/misc.ini` → `war3mapMisc.txt` | — | — |
| **UI 字符串覆写**（Skin/Txt） | `resource/object-data/txt/TxtTable.ts` | `maps/table/txt.ini` → `war3mapSkin.txt` | — | — |
| **自定义 FDF（Frame 资源）** | — | 直接放 `maps/resource/fdf/*.fdf` + 更新 `maps/resource/fdf/path.toc` | `maps/resource/fdf/` | **是**，登记为 `"resource\\fdf\\your.fdf"`（**保留** `resource\` 前缀，见下文映射规则） |
| **自定义 TTF 字体** | — | — | `maps/resource/<anywhere>/Font.ttf` | **是**，保留 `resource\` 前缀 |
| **自定义模型** | — | — | `maps/resource/<MyDir>/your.mdx`（或根） | **是**，登记为 `"<MyDir>\\your.mdx"`（**剥离** `resource\` 前缀） |
| **自定义贴图** | — | — | `maps/resource/Texture/**/*.blp` 或 `.tga` | **是**，登记为 `"Texture\\...\\x.blp"`（剥离 `resource\`） |
| **地形贴图覆写** | — | — | `maps/resource/Terrain/TerrainArt/...` | **是**，登记为 `"Terrain\\TerrainArt\\...\\x.blp"`（剥离） |
| **自定义 SLK / TXT 覆写** | — | — | `maps/resource/map/.../x.slk` | 是，登记为 `"resource\\map\\...\\x.slk"`（**不**剥离） |
| **载入画面 / 预览图** | `MiscTable` 里 `[载入图]`/`[预览]` 或 `w3i` | `maps/table/w3i.ini`、`maps/resource/war3mapMap.blp` | — | 预览图不需要（固定名） |

> 当前仓库只维护了 `imp.ini` / `unit.ini` / `w3i.ini` 三个 table。新增物编文件时，直接在 `maps/table/` 下新建对应 `ability.ini` / `item.ini` / `buff.ini` 等即可，w2l 会自动发现。

## `resource/object-data/` 与 `maps/table/` 的分工

- **单一数据源原则**：物编以 `resource/object-data/*Table.ts` 为准，运行时 TS/Lua 中 **只读** 引用 rawcode；禁止在 gameplay 中改 table 内容（与地图 MPQ 内物编一致，改表不会同步进已加载物编）。
- **生成关系**：`resource/object-data/shared.ts` 明确写了「物编表仅在 **构建期** 由 `scripts/prepack.ts` 写入 `maps/table/*.ini`」。若仓库还没有 `prepack.ts`，新增/扩展时应：
  1. 在 `scripts/` 里加 `objectIni.ts` 负责序列化（`string | number` 加引号 / 原样输出；数组如 `buttonpos = {1, 2}`、`Art = { ... }` 需特殊支持）。
  2. 在 `scripts/prepack.ts` 里按 `UnitTable`/`AbilityTable`/... 遍历并写出到 `maps/table/*.ini`。
  3. 在 `yarn build:dev` / `yarn build` 里把 `prepack` 放在 `buildW3x` 之前。
- **字段命名**：严格对齐 `dev_lib/w3x2lni/template/Custom/*.ini`（例如 `unit.ini` 用 `Name` / `file` / `inEditor` / `dropItems`，不是 WE 的汉字列名）。`*FieldOrder` / `*FieldComments` 常量用于 prepack 控制输出顺序与注释。

## `maps/table/*.ini` 书写规范（来自本仓库现存 `unit.ini`）

- 段名为方括号 rawcode：`[u00K]`；`_parent` 必填。
- 布尔写 `0` / `1`；字符串加双引号；多值键（如 `buttonpos`）用 Lua 表字面量 `{ 1, 2 }`。
- 行内注释用 `--`（Lua 风格），w2l 能识别。
- **字段名**以 `dev_lib/w3x2lni/template/Custom/<type>.ini` 为准：改键前用 Read 工具在对应模板里搜字段。
- `_parent` 必须是 **存在于 Slk 默认数据** 的 rawcode，否则合并失败（日志里会以 error 报）。
- Misc / w3i / imp 等「非 rawcode」ini 的段名是中文/英文固定段（如 `[地图]` `[地形]` `[FontHeights]`），**不要加 `_parent`**。

## **关键规则：物理路径 ↔ MPQ 路径映射（lni 模式）**

> 这条是使用 `maps/resource/` 最容易踩坑的点。**请务必读完。**

w2l 在 lni 模式下并不按「统一前缀剥离」对所有文件一视同仁，而是按 **文件扩展名** 识别类型，然后只在「物理首段目录 == 识别出来的 type」时才剥离首段目录。源码入口：`dev_lib/w3x2lni-src/script/core/proxy.lua` 第 101–147 行。

### 扩展名 → type 对照表（源码 `proxy.lua:128-138`）

| 扩展名 | 识别为 type | 在 lni 工程里的约定目录 |
|--------|-------------|--------------------------|
| `.mdx` `.mdl` `.blp` `.tga` `.dds` `.tif` | **`resource`** | `maps/resource/...` |
| `.mp3` `.wav` | **`sound`** | `maps/sound/...` |
| 其它所有扩展名（`.fdf` `.toc` `.ttf` `.slk` `.txt` `.j` `.lua` `.doo` …） | **`map`** | 可随意，通常在 `maps/map/` 或 `maps/resource/<any>/` |

### 剥离规则

仅当物理路径 **首段目录名** ∈ `{ resource, sound, map, scripts, w3x2lni }` 且 **首段目录名等于上表算出的 type**，才把首段目录从 MPQ 路径里剥掉。

换句话说：
- **纹理/模型（blp/tga/mdx/mdl/dds/tif）放在 `maps/resource/…` 下**：首段 `resource` == type `resource` → **剥掉 `resource\`**。  
  物理 `maps/resource/Texture/ui/hp.tga` → MPQ `Texture\ui\hp.tga`
- **fdf/toc/ttf/slk/txt 等非纹理非模型文件**：type 是 `map`，首段 `resource` ≠ `map` → **不剥离**。  
  物理 `maps/resource/fdf/EricButtom.fdf` → MPQ `resource\fdf\EricButtom.fdf`
- **`maps/map/` 下的文件**（包括 `war3map.j`）：首段 `map` == type `map` → 剥掉 → `war3map.j` 作为 MPQ 根。
- **音频 mp3/wav**：请放 `maps/sound/Music/bgm.mp3` → 剥掉 → `Music\bgm.mp3`。若错放到 `maps/resource/` 下不会剥离，引擎路径会带 `resource\` 前缀。

### 对应本仓库 `maps/table/imp.ini` 的实证

| imp.ini 条目（= 引擎路径） | 物理文件 | 是否剥离 |
|----------------------------|----------|----------|
| `Terrain\\TerrainArt\\ashenvale\\ashen_dirt.blp` | `maps/resource/Terrain/TerrainArt/ashenvale/ashen_dirt.blp` | ✅（blp → resource → 剥 `resource\`） |
| `Texture\\ui\\dmg\\blue\\0.tga` | `maps/resource/Texture/ui/dmg/blue/0.tga` | ✅（tga） |
| `test1.mdl` | `maps/resource/test1.mdl`（根） | ✅（mdl） |
| `war3mapMap.blp` | `maps/resource/war3mapMap.blp` | ✅ |
| `resource\\fdf\\EricButtom.fdf` | `maps/resource/fdf/EricButtom.fdf` | ❌（fdf 属 map 类，保留 `resource\`） |
| `resource\\fdf\\path.toc` | `maps/resource/fdf/path.toc` | ❌ |
| `resource\\Texture\\ui\\hpbar\\ZiTi.TTf` | `maps/resource/Texture/ui/hpbar/ZiTi.TTf` | ❌（**ttf 不属 resource 类**，保留 `resource\`） |
| `resource\\map\\Splats\\LightningData.slk` | `maps/resource/map/Splats/LightningData.slk` | ❌（slk 属 map 类） |

### 对代码/ini 引用的直接影响

- **在 `unit.ini` / `ability.ini` 里写 `file = "..."`、或 Lua 里 `SetUnitModel(u, "…")` / `BlzFrameSetTexture(f, "…")`**：统一写 **MPQ 路径**（剥离后的）。比如自定义模型放 `maps/resource/CustomModel/boss.mdx` → 代码里写 `"CustomModel\\boss.mdx"`，**不要** 写 `"resource\\CustomModel\\boss.mdx"`。
- **`Panel.setBackground("…")` / `BlzFrameSetTexture` 等 TS/Lua UI 代码**：同样写 MPQ 路径（剥离后的）。  
  物理 `maps/resource/ui/Console/back.tga` → 代码里写 `"ui\\Console\\back.tga"`，**不要** 写 `"resource\\ui\\Console\\back.tga"` 也**不要** 写 `"war3mapImported\\ui\\Console\\back.tga"`（`war3mapImported/` 是 UI 设计器的内部资源注册前缀，与游戏运行时路径无关）。
- **在 FDF 文件里 `File "resource\\Texture\\ui\\panel_title_background.tga"`**：这里同样写 MPQ 路径。panel 背景是 tga，会被剥离，所以实际写 `"Texture\\ui\\panel_title_background.tga"`（对应本仓库的 imp.ini 条目）。  
  但 FDF 里如果引用 **字体 ttf** 就必须带 `resource\` 前缀（ttf 不剥离），这正是 `imp.ini` 中 `resource\\Texture\\ui\\hpbar\\ZiTi.TTf` 的原因。
- **TOC 文件**（如 `maps/resource/fdf/path.toc`）里列出的 FDF 需要写 **MPQ 路径**：每行一个 `resource\fdf\FrameTemplate.fdf`（反斜杠、保留 `resource\` 前缀）。

### 记忆口诀

> **「纹理模型剥 `resource\`，其它通通保留 `resource\`；音频请放 `maps/sound/`。」**

## `maps/table/imp.ini` 登记规则

`imp.ini` 的作用：列出要被标记为「自定义导入文件」的清单（最终合成 MPQ 里的 `war3map.imp`）。w2l 打包时会把 **首段目录 ∈ `{resource, sound, map, scripts, w3x2lni}`** 的物理文件按上一章规则映射进 MPQ，然后以 **剥离后的 MPQ 路径** 汇入导入表。

规则：

- **登记的 name 永远是 MPQ 路径（剥离后的），不是物理路径。** 如物理 `maps/resource/Texture/ui/hp.tga` 登记为 `"Texture\\ui\\hp.tga"`；物理 `maps/resource/fdf/x.fdf` 登记为 `"resource\\fdf\\x.fdf"`。
- 路径分隔符用 **双反斜杠** `\\`；大小写保持与文件系统一致（MPQ 内部不区分大小写，但避免重复登记）。
- **w2l 在 `backend/map-builder/save.lua:4-50` 会按 `output_ar` 内最终文件名重建 `war3map.imp`**；但若 imp.ini 里写了 `impignore` 集合内的名字（见 `info.lua:128-149`），w2l 会把它们**跳过**（`war3map.j` / `war3mapMap.blp` 等官方文件不要重复登记）。
- **不在 `imp.ini` 中出现的自定义资源**：某些引擎实现依然能读（因为文件已经打进 MPQ），但 WE 的导入列表不显示；强烈建议登记以保证各版本/工具链兼容。
- **新增资源后必须手动或由脚本 append 到 `imp.ini`**，w2l 不会自动扫描 `maps/resource/` 去补全它。

## 打包流程对照（本仓库 yarn 命令）

| 命令 | 顺序 |
|------|------|
| `yarn build:dev` | TSTL → `injectLuaExecutionCall` → `handleBootstrapLua(true)` → `buildW3x`（= `w2l obj ./maps ./dist/map.w3x`） |
| `yarn build` / `build:prod` | TSTL 单文件 → 注入 Cheat → `handleBootstrapLua(false)` → 可选 luamin → `buildW3x` |
| `yarn build:map` | 只跑 `w2l obj`（跳过 TS 编译） |
| `yarn test:map` | KKWE 加载 `./dist/map.w3x` |

> 加物编后一定要 **重新打包**（`yarn build:map` 最快），仅重编 TS 不会同步到 MPQ 内的物编二进制。

## 典型任务流（给 AI 的行动清单）

### 新增一个技能

1. 先查 `dev_lib/w3x2lni/template/Custom/ability.ini` 找最接近的原版技能 rawcode（作为 `_parent`）和字段名。
2. 在 `resource/object-data/ability/AbilityTable.ts` 新增条目：
   ```ts
   A001: {
     _parent: "AHbz",
     Name: "我的暴风雪",
     // 每级字段按 w3x2lni 数组语法（构建期序列化成 { ... }）
   }
   ```
3. 若有自定义图标/特效：把文件放入 `maps/resource/Texture/...` / `maps/resource/Model/...`，并在 `maps/table/imp.ini` 的 `import = { ... }` 里加上对应 MPQ 路径。
4. 在 `src/` 里用 rawcode `A001` 接入逻辑（遵循 `system/buff`、`examples/` 等既有模式）。
5. `yarn build:dev` → `yarn test:map` 验证。

### 新增一个单位

1. `dev_lib/w3x2lni/template/Custom/unit.ini` 找 `_parent`（如骷髅战士 `uske`、圣骑士 `Hpal`）。
2. 在 `resource/object-data/unit/UnitTable.ts` 加条目（参考仓库里 `E001`）。
3. 自定义模型/图标同上，文件进 `maps/resource/...` + `imp.ini`。
4. 打包、测试。

### 加一个 FDF（自定义 UI 模板）

1. `.fdf` 放 `maps/resource/fdf/xxx.fdf`。
2. 更新 `maps/resource/fdf/path.toc`：每行写一个 **MPQ 路径**，即 `resource\fdf\xxx.fdf`（fdf 不剥离前缀）。
3. `maps/table/imp.ini` 追加 `"resource\\fdf\\xxx.fdf"`（和 `"resource\\fdf\\path.toc"`，如未登记）。
4. TS / Lua 里加载：`BlzLoadTOCFile("resource\\fdf\\path.toc")`（或项目里既有的 FDF 注册流程，参考 `src/system/ui/fdf/`）。
5. FDF 内部引用 **tga/blp 纹理**时写剥离后的路径（如 `File "Texture\\ui\\panel_title_background.tga"`）；引用 **ttf 字体** 时写保留前缀的路径（如 `FrameFont "resource\\Texture\\ui\\hpbar\\ZiTi.TTf"`）。

### 加一个自定义模型（.mdx/.mdl）

1. 文件放 `maps/resource/<MyDir>/boss.mdx`（`<MyDir>` 可自取，比如 `Model`、`Units`、`Custom`，甚至 `maps/resource/boss.mdx` 也行）。
2. `imp.ini` 追加 `"<MyDir>\\boss.mdx"`（**不写** `resource\`）。
3. 配套贴图 `.blp`：物理位置与模型内部 `Texture` 块引用的路径一致（通常与模型放同一目录），同样按 **剥离后的路径** 登记。
4. 代码/物编里 `file = "<MyDir>\\boss.mdx"` / `SetUnitModel(u, "<MyDir>\\boss.mdx")`。

## 诊断与常见坑

- **游戏里看到绿盒 / 缺模型** → 99% 是 `maps/table/imp.ini` 没登记该资源，或路径分隔符/大小写不一致。
- **某单位/技能字段不生效** → 字段名没对齐 `template/Custom/<type>.ini`；或 `_parent` 写错导致合并落到错误默认值。
- **只改 TS 没打包** → `map.w3x` 里的物编来自 `maps/table/*.ini`，必须跑 `yarn build:map` 以上的命令。
- **打包报 `UNSUPPORTED_LNI_MARK`** → `maps/.w3x` 标记文件缺失 / 不是 lni 工程；最简修复：在 `maps/` 根目录保留一个空 `.w3x`（源码见 `script/share/check_lni_mark`）。
- **想批量修改物编** → 写 w2l 地图内插件：`maps/w3x2lni/plugin/*.lua` + `plugin/.config`，事件见 `dev_lib/w3x2lni-src/docs/zh-cn/plugin.md`（`on_full` / `on_mark` / `on_convert` / `on_pack`）。

## 与另外两个 skill 的分工

- `wc3-map-ts-template`：TSTL 构建链 / `bootstrap.lua` / `war3map.j` 注入 / YDWE 运行时。
- `wc3-map-ts-architecture`：`src/` 下 TS 模块、子系统、UI 组件「去哪找」。
- **本技能**：**物编数据** 与 **MPQ 资源** 的落点、w2l 打包模型、w3x2lni Lni 格式规则。

一句话：**数据改 `resource/object-data/*.ts`，资源放 `maps/resource/` 并登记到 `maps/table/imp.ini`，构建器在 `w2l obj ./maps ./dist/map.w3x` 时把一切合并进 `map.w3x`。**
