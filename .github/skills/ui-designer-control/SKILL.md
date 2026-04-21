---
name: ui-designer-control
description: 通过 MCP 稳定控制 `ui-designer`（魔兽争霸 III Frame UI 可视化设计器），把自然语言需求转成可执行动作，完成画布编辑、校验、导出（Lua / TypeScript / 结构化 JSON / wc3-template 双向同步）、资源登记与落盘。当用户让 AI 为 WC3 地图设计/改 UI，或提到 `ui-designer`、`*.uiproj`、`*.ui.json`、`war3mapImported/`、`ui_apply_actions` 时使用。
---

# UI Designer Control Skill

> 让任意支持 MCP 的 Agent（Claude Code / Cursor / Copilot…）通过本地 HTTP MCP 稳定操控 `ui-designer` 桌面端：**打开项目 → 批量改画布 → 校验 → 导出代码 → 保存**，并能和 `wc3-map-ts-template` 地图仓形成 AI 闭环。

## 1. 何时使用

在遇到下列任一情况时加载并遵循本 Skill：

- 用户要求 AI **设计 / 修改 WC3 地图 UI**（按钮、面板、文本、模型）。
- 用户明确提到 `ui-designer`、`frame-ui-designer`、`*.uiproj`、`*.ui.json`、`war3mapImported/`。
- 需要通过 MCP 工具 `ui_open_project` / `ui_apply_actions` / `ui_export_code` / `ui_runtime_*` 等任何 `ui_` 前缀工具。
- 需要在 `wc3-map-ts-template` 中走 `yarn ui:pull / ui:check / ui:push` 闭环。

## 2. 运行时前提（硬性要求）

被自动化控制的 **ui-designer 进程必须是 Tauri 桌面端**。**不要**把仅浏览器的 `yarn dev` 当作 MCP 目标：Web 模式缺少或与桌面不一致的能力（原生文件/对话框、资源导入等）会导致工具"成功"但与真实场景不符。

- 启动命令：在 `ui-designer` 仓库根执行 **`yarn tauri:dev`**。默认自动拉起内嵌 **Rust MCP** HTTP 服务（`rmcp` Streamable HTTP），监听 `127.0.0.1:8765`。关闭自动启动可设 `UI_DESIGNER_AUTO_START_MCP=false`。
- MCP 连接 URL（`/` 与 `/mcp` 等价）：
  - Cursor / Copilot `mcp.json`：`{ "uiDesigner": { "type": "http", "url": "http://127.0.0.1:8765/" } }`
  - 健康检查：`GET http://127.0.0.1:8765/health` 应返回 `data.mcp: "rust-rmcp"`。
- 运行态桥（`ui_runtime_*`）走 Tauri 事件，**不再**使用 Node 子进程或文件队列。所以若 Tauri 窗口未打开，`ui_runtime_*` 会超时。

**准入校验**：首次调用前，先发起 `ui_get_snapshot`；若返回 `ok:false` 或连接失败，先让用户运行 `yarn tauri:dev` 再继续。

## 3. 工具清单（MCP Tools）

所有工具返回统一 envelope：

```json
{
  "ok": true,
  "data": {},
  "diagnostics": [],
  "nextHints": [],
  "protocol": { "mcpProtocolVersion": "1.0.0", "pluginSchemaVersion": "1.0.0" }
}
```

### 3.1 项目生命周期

| 工具                       | 参数                                                          | 说明                                                                                         |
| -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `ui_open_project`          | `projectPath: string` (绝对路径到 `*.uiproj`)                 | 打开并加载项目。返回 `data` 为项目快照（`widgets` / `resources` / `animations` / `settings`）。 |
| `ui_save_project`          | `projectPath?: string`                                        | 保存到磁盘；不传则保存到当前路径。                                                           |
| `ui_get_snapshot`          | —                                                             | 获取引擎侧当前快照，用于读取 `widget.id` / `parentId` 做后续动作。                           |
| `ui_import_from_sidecar`   | `path: string` (绝对路径到 `*.ui.json`)                       | 从 `wc3-template-export` 生成的 sidecar 反向导入；仅接受 `generator == "wc3-template-export"` 的 sidecar。 |

### 3.2 编辑 / 校验 / 导出

| 工具                        | 关键参数                                                                              | 说明                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `ui_apply_actions`          | `actions: Action[]`, `dryRun?: bool`, `sessionId?: string`, `allowDangerous?: bool`   | 批量应用动作（见第 4 节 DSL）。危险动作（`deleteWidget` 影响 >10 个、`clearProject`）默认阻断，需 `allowDangerous=true`。 |
| `ui_validate`               | —                                                                                     | 校验当前项目：同级重名、资源缺失、越界等。                                                                           |
| `ui_export_structured_json` | —                                                                                     | 返回结构化 JSON（内容在 `data.content`），无副作用，适合 AI 回读复盘。                                               |
| `ui_export_code`            | `outputPath: string`, `pluginId?: string`                                             | 按插件落盘代码。`pluginId` 取值见 §5。                                                                               |

### 3.3 资源流水线（AI 自助登记 / 拷贝图片）

| 工具                          | 关键参数                                                                              | 说明                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui_list_resources`           | `includeUnused?: bool`                                                                | 列出 widget 引用的图片资源：`value` / `localPath` / `exists` / `usedByWidgetIds`。用于判断哪些资源还没登记或源文件缺失。                                   |
| `ui_normalize_resource_paths` | `prefix?: string`（默认 `war3mapImported/`）                                          | 把 widget 字段里裸绝对路径（如 `C:\Users\Me\icon.blp`）登记为 `ImageResource`，并改写为 `war3mapImported/<basename>`。通常在 `ui_apply_actions` 之后、`ui_copy_resources` 之前调用。 |
| `ui_copy_resources`           | `targetDir: string`, `values?: string[]`, `overwrite?: bool`                          | 把资源从各自 `localPath` 拷贝到 `targetDir/<war3 相对路径>`（典型：落到模板仓 `resource/`）。                                                             |

### 3.4 审计与观测

| 工具                            | 关键参数                                                              | 说明                                                     |
| ------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| `ui_get_audit_trail`            | `limit?`, `sessionId?`, `actionId?`, `type?`                          | 读取动作审计日志，支持过滤。                             |
| `ui_get_transaction_audit_trail`| `limit?`, `transactionId?`                                            | 读取事务级审计（start / commit / rollback）。            |

### 3.5 运行态桥接（需要 Tauri 窗口已打开）

| 工具                      | 关键参数                                                                              | 说明                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `ui_runtime_call`         | `method: string`, `params?: object`, `timeoutMs?: number`                             | 调用前端运行态方法（见 §6）。                                                                       |
| `ui_runtime_transaction`  | `actions: Action[]`, `validateAfterApply?: bool`, `timeoutMs?: number`, `transactionId?: string` | 事务：**快照 → 应用 → 校验 → 失败自动回滚**。强烈推荐用于任何多步 AI 编辑。                     |

## 4. Action DSL（`ui_apply_actions` / `ui_runtime_transaction` / `batchApply` 通用）

```jsonc
{
  "actions": [
    {
      "type": "createWidget",
      "actionId": "create-btn-start",           // 可选；缺省时自动生成
      "idempotencyKey": "btn-start-v1",          // 可选；幂等防重放
      "payload": {
        "widgetType": "button",                  // 见下表 §4.1
        "overrides": {                           // 可选，直接覆盖默认字段
          "name": "btnStart",
          "x": 300, "y": 220, "w": 160, "h": 48,
          "text": "开始"
        }
      }
    },
    { "type": "updateWidgetProps", "targetId": 1, "payload": { "text": "开始游戏" } },
    { "type": "setParent",         "targetId": 2, "payload": { "parentId": 1 } },
    { "type": "deleteWidget",      "targetId": 3 },
    { "type": "clearProject" }                    // 危险：需 allowDangerous=true
  ]
}
```

### 4.1 支持的 `widgetType`

| widgetType | 默认中文标签 | 典型字段                                                        |
| ---------- | ------------ | --------------------------------------------------------------- |
| `panel`    | 面板         | `x,y,w,h`, `image`, `visible`, `enable`, `parentId`             |
| `button`   | 按钮         | 同上 + `text`, `textAlign`                                      |
| `text`     | 文本         | 同上 + `text`, `textAlign`, `fontSize` 等                       |
| `model`    | 模型         | 同上 + 模型引用字段                                             |

创建时，若不传 `overrides`，引擎默认：`x=960, y=540, w=100, h=100, enable=true, visible=true, locked=false, text="", image=""`，`name` 形如 `<widgetType>_<id>`。

### 4.2 危险动作守则

- `clearProject`：清空项目，必须 `allowDangerous: true`。
- `deleteWidget` 若级联影响 **>10** 个节点：默认阻断，需 `allowDangerous: true`；否则先做 `dryRun` 评估。
- 任何大规模改动前，**先 `dryRun: true` 做影响评估**，再决定是否落盘。

## 5. 内建导出插件 ID

| `pluginId`               | 输出                                                                              | 用途                                        |
| ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------- |
| `lua-export`             | Lua                                                                               | 原生 Frame UI Lua 代码                      |
| `typescript-export`      | TypeScript                                                                        | 通用 TS 绑定                                |
| `json-structured-export` | JSON                                                                              | 纯结构化 JSON（`ui_export_structured_json` 即走这个）|
| `wc3-template-export`    | TypeScript + `*.ui.json` sidecar                                                  | **与 `wc3-map-ts-template` 地图仓双向同步** |

## 6. 运行态方法（`ui_runtime_call(method=…)`）

需要 Tauri 窗口已打开。常用：

| method                    | params                               | 说明                                                           |
| ------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `getProjectSnapshot`      | —                                    | 读取前端当前快照（含未保存的编辑）。                           |
| `replaceProjectSnapshot`  | `{ snapshot }`                       | 用快照替换前端状态（sidecar 导入后会被 Rust 侧自动触发）。     |
| `batchApply`              | `{ actions, sessionId? }`            | 在前端进程里执行一批 Action，会进入撤销栈、刷新画布。          |
| `validate`                | —                                    | 前端侧校验（同级重名等）。                                     |
| `listExportPlugins`       | —                                    | 列出当前已注册插件 `{id, name, outputFormat, type}[]`。        |
| `exportWithPlugin`        | `{ pluginId }`                       | 按插件导出（走前端的完整导出管线，会触发对话框/文件写入）。    |
| `exportStructuredJson`    | —                                    | 等价于 `exportWithPlugin('json-structured-export')`。          |
| `undo` / `redo`           | —                                    | 前端撤销/重做。                                                |
| `proposeActions`          | `{ actions, sessionId, reason, title }` | **AI 大批量改动的评审网关**：弹出 Accept/Reject 覆盖层让用户确认。 |

**选择原则**：

- 纯引擎级 / 无 UI 场景（CI、批处理）→ 用 `ui_apply_actions` + `ui_export_code`。
- 有 UI 场景、需用户看到画布实时变化 → 用 `ui_runtime_transaction` 或 `ui_runtime_call(batchApply)`。
- AI 发起的**大批量/高风险**改动 → 用 `ui_runtime_call(method="proposeActions")` 走评审网关。

## 7. 推荐工作流

### 7.1 标准流程（离线编辑 + 落盘）

```
ui_open_project(projectPath)
→ ui_apply_actions(actions, dryRun=true)        // 预演
→ ui_apply_actions(actions, sessionId=...)       // 真正执行
→ ui_list_resources()                            // 若引入了图片
→ ui_normalize_resource_paths()                  // 把裸绝对路径登记为 war3mapImported/...
→ ui_validate()                                  // 必须，diagnostics 非空先修
→ ui_export_structured_json()                    // 可选：AI 回读复盘
→ ui_export_code(outputPath, pluginId)           // 落盘
→ ui_save_project()
```

### 7.2 事务模式（推荐用于多步 AI 编辑）

```
ui_runtime_transaction({ actions, transactionId: "tx-feat-shop-v1" })
  // 内部自动执行：快照 → 应用 → 校验 → 失败回滚
→ ui_get_transaction_audit_trail({ transactionId: "tx-feat-shop-v1" })
  // 建立 transactionId → sessionId → actionIds 的三层追踪链
```

### 7.3 `wc3-map-ts-template` 闭环（两仓并列克隆）

```
# 设计器侧
yarn tauri:dev                           # ui-designer 仓
  → AI 通过 MCP 调用 proposeActions / apply / validate
  → 用户在设计器里 Accept

# 模板仓侧
yarn ui:pull                             # wc3-map-ts-template 仓
  → 生成 src/ui/generated/*.ts + *.ui.json sidecar（byte-identical with plugin）
  → --copy-resources <repo>/resource 会自动把 ImageResource 落到模板仓 resource/
yarn build:dev                           # 校验生成的 TS 能对 wc3ts 编译过
yarn ui:check                            # CI 门禁；漂移则 exit 1
yarn ui:push                             # 反向：把模板里手改的布局塞回 designer
  → 底层调用 ui_import_from_sidecar
```

**不可违反**：

- 生成 TS 的 `// <ui-designer:generated:BEGIN>` / `// <ui-designer:generated:END>` 标记**神圣不可删**；人写的事件回调、状态接线**必须在标记外**。
- Sidecar 的 `generator` 字段必须等于 `"wc3-template-export"`，否则 `ui_import_from_sidecar` 会拒收。
- 所有导到模板仓的图片字段必须以 `war3mapImported/` 开头；资源文件统一从 `ImageResource.localPath` 复制到模板仓 `resource/`。

## 8. Guardrails（硬性约束）

- **必须**在 `ui_export_code` 之前调 `ui_validate`；`diagnostics` 非空时优先修。
- **批量动作**带 `idempotencyKey` 或 `actionId`，防重放；每轮调用带 `sessionId`。
- **危险动作**（`clearProject` / 级联 `deleteWidget` >10）默认阻断，除非用户显式同意并携 `allowDangerous: true`。
- **AI 大批量改动**优先走 `proposeActions`，由用户 Accept；直连 `ui_apply_actions(dryRun:false)` 仅适用于"小、低风险、或用户明确豁免评审"的编辑。
- **不要**在桌面端未启动时调用 `ui_runtime_*`；没开桌面时仅使用 `ui_apply_actions` / `ui_export_*` 等引擎侧工具。
- **不要**向用户暗示"打开浏览器 Dev Server 就等同完整功能"；完整流程校验一律以 Tauri 桌面端为准。

## 9. 错误恢复 Playbook

| 现象                                            | 应对                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `ok=false` + `diagnostics` 非空                 | 按 diagnostics 字面信息下最小修复 Action，再重试（**不要**忽略后续步骤）。                |
| `missing image resources`                       | 先 `ui_list_resources` 看 `exists=false` 的项；补齐源文件或移除对应 widget `image` 字段。 |
| `duplicate child name`                          | 在同 `parentId` 下给重名控件改 `name`。                                                   |
| `dangerous action blocked`                      | 先 `ui_apply_actions(dryRun:true)` 评估影响；确需执行则征得用户同意后加 `allowDangerous:true`。 |
| `ui_runtime_*` 超时                             | 确认 `yarn tauri:dev` 在跑且窗口未卡死；否则退化为 `ui_apply_actions` 纯引擎路径。        |
| `ui_import_from_sidecar` 报 generator 不匹配    | 确认 sidecar 是 `wc3-template-export` 输出；手写 JSON 不受支持。                          |
| 资源落不到模板仓                                | 组合调用 `ui_normalize_resource_paths()` → `ui_copy_resources({ targetDir: "<repo>/resource" })`。 |

## 10. 可复用代码片段（供 AI 参考填充）

### 10.1 "新增一个开始按钮并导出 Lua"

```jsonc
// Step 1
ui_open_project({ projectPath: "D:/wc3/my.uiproj" })

// Step 2 — 事务模式
ui_runtime_transaction({
  transactionId: "tx-add-start-btn",
  actions: [
    {
      type: "createWidget",
      idempotencyKey: "btn-start-v1",
      payload: {
        widgetType: "button",
        overrides: { name: "btnStart", x: 860, y: 900, w: 200, h: 56, text: "开始游戏" }
      }
    }
  ]
})

// Step 3
ui_validate()

// Step 4
ui_export_code({ outputPath: "D:/wc3/out/ui.lua", pluginId: "lua-export" })
ui_save_project()
```

### 10.2 "AI 从本地图标拖进来 → 落到模板仓 resource/"

```jsonc
ui_apply_actions({
  sessionId: "session-shop-icon",
  actions: [{
    type: "updateWidgetProps",
    targetId: 7,
    payload: { image: "C:/Users/Me/pics/icon_gold.blp" }  // 裸绝对路径
  }]
})
ui_normalize_resource_paths({ prefix: "war3mapImported/" })  // 登记 + 改写为 war3mapImported/icon_gold.blp
ui_copy_resources({ targetDir: "D:/wc3/wc3-map-ts-template/resource", overwrite: true })
ui_validate()
ui_export_code({ outputPath: "D:/wc3/wc3-map-ts-template/src/ui/generated/ui.ts", pluginId: "wc3-template-export" })
```

## 11. 可观测性 & 追踪链

- 每次工具调用都传 `sessionId`；重要动作传 `actionId` 或 `idempotencyKey`。
- 事务返回里包含 `transactionId` + 生成的 `sessionId` + `actionIds`，建议按 `transactionId → sessionId → actionIds` 在日志里做三层关联。
- 事后回读：`ui_get_audit_trail` / `ui_get_transaction_audit_trail`。

## 12. 协议版本

- `mcpProtocolVersion`: `1.0.0`
- `pluginSchemaVersion`: `1.0.0`
- MCP server 实现：Rust `rmcp` Streamable HTTP，源码在 `src-tauri/src/mcp_http.rs`。
- 默认端点：`http://127.0.0.1:8765/`（与 `/mcp` 等价），健康检查 `GET /health`。
