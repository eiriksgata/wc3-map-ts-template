# Repository Guidelines

This repository is a Warcraft III 1.27a map development template using TypeScript-to-Lua.

## Project Identity

- Project: wc3-map-ts-template
- Primary goal: build Warcraft III maps with TypeScript, compile to Lua, then package to w3x.
- Core stack: TypeScript, typescript-to-lua, @eiriksgata/wc3ts, KKWE, w3x2lni.
- Package manager: Yarn (see packageManager in package.json).

## Project Structure

- src/: TypeScript source code for gameplay, systems, UI, and examples.
- src/main.ts: main runtime entry, exports initialize and onHotReload.
- src/ydlua/: JAPI bridge layer. Initialize before using extended JAPI APIs.
- scripts/: build and dev orchestration.
- scripts/build.ts: production build pipeline.
- scripts/dev.ts: development watch and hot-reload notification pipeline.
- scripts/common.ts: shared build helpers.
- lua/bootstrap.lua: Lua bootstrap entry, handles dev and prod loading differences.
- maps/: w3x2lni **LNI** map project sources (KKWE opens this directory directly).
- maps/map/: map data including generated Lua main.lua in production mode.
- maps/table/: LNI object-editor / map-info ini files; KKWE rewrites these on save.
- dist/: generated build outputs, including dist/map.w3x and dev-mode Lua outputs.
- dev_lib/: local tool binaries (KKWE, w3x2lni).
- config.json: paths for w3x2lni and KKWE.

## Build And Run Commands

Use only scripts that exist in package.json.

- yarn dev: development mode with initial build + tstl watch + hot-reload notification generation.
- yarn build: production build (compile, inject Lua call, bootstrap copy, minify, package map).
- yarn build:dev: one-off development build for agent validation and local debug packaging.
- yarn build:prod: explicit production alias for build.ts prod mode.
- yarn test: compile and then launch map through scripts/test.ts.
- yarn watch: raw tstl watch.
- yarn build:map: package maps to dist/map.w3x through w3x2lni.
- yarn test:map: launch Warcraft III with dist/map.w3x via KKWE.

If a command fails because tools are missing, verify config.json paths and local binaries under dev_lib.

## KKWE LNI And Terrain Editing

`maps/` is the live **LNI project**, not a packed MPQ. KKWE (with the bundled w3x2lni plugin) opens and saves this directory natively.

- Edit terrain / doodads / placed units / editor-side object data: open `maps/` in KKWE (the empty `maps/.w3x` mark identifies LNI). Save. KKWE writes `maps/map/*` and `maps/table/*.ini` in place.
- Do **not** open `dist/map.w3x` to edit the map. That file is a build artifact.
- Do **not** tell the user to unpack a `.w3x` with w2l after KKWE save. Unpack (`w2l lni …`) is **not** part of the daily loop and can overwrite `maps/`.
- `w2l` in this repo is **pack only**: `maps/` (LNI) → `dist/map.w3x`. Use `yarn build:map` / `yarn build:dev` / `yarn test:map` when the user needs to play-test.
- Unpack an external `.w3x` into `maps/` only when first importing a foreign packed map. Never as a follow-up to KKWE save.

When talking to the user, never invent steps like “save in KKWE, then unpack with w2l” or “extract dist/map.w3x back into maps”.

## Map Launch Requires KKWE

Packed `dist/map.w3x` is **not** a vanilla Warcraft III map. It depends on KKWE’s Lua runtime and JAPI. Launching it with the original `Warcraft III.exe`, by double-clicking the `.w3x`, or via the official Battle.net client **will not work**.

- Play-test only through KKWE: `yarn test:map` / `yarn test` (`scripts/test.ts` → `YDWEConfig.exe -launchwar3 -loadfile`, then wait until war3 exits). F5 launches that same script so the debug session ends when the game exits.
- Do **not** tell the user to open the packed map with stock 1.27a Warcraft III.
- If the map “does nothing”, scripts fail, or JAPI/Lua is missing, the first check is whether it was launched outside KKWE.

## TypeScript-To-Lua Constraints

- Keep luaTarget aligned with Warcraft III runtime expectations (Lua 5.3 in tsconfig).
- Keep noImplicitSelf enabled unless there is a proven compatibility reason.
- Keep noResolvePaths entries for jass modules consistent between tsconfig.json and tsconfig.prod.json.
- Dev mode emits modular Lua to dist/src; production mode bundles to maps/map/main.lua.
- For routine agent compile validation, prefer yarn build:dev; rerun yarn build only when validating the production bundle path.

## Runtime And Hot Reload Rules

- Development hot reload is driven by scripts/dev.ts and dist/hot-reload.json.
- Modules that need safe reload should expose initialize and cleanup lifecycle behavior.
- Avoid global side effects without cleanup in reloadable modules (timers, triggers, frames, listeners).
- Keep module registration names stable to avoid stale reload mappings.
- Production mode should not depend on dev-only hot-reload files.

## wc3ts And Gameplay Coding Rules

- Prefer Players[index] from wc3ts for player access.
- Remember Players[0] is Player 1 in Warcraft III UI.
- Use FourCC helper conversion for raw ids instead of magic integers.
- Prefer wc3ts wrapper classes (Unit, Effect, Frame, Timer, Trigger) over raw handle usage when practical.
- When using raw handles, validate and guard against undefined returns.

## Frame/UI Safety Rules

- Frame.createType parameter order must be correct.
- Frame instance name must be unique per runtime context.
- typeName must be a valid frame type string and must not be empty.
- Invalid frame type or empty typeName can crash with GetLayoutFrameTypeTagID errors.
- For complex UI, prefer existing component abstractions under src/system/ui before creating ad-hoc frames.

## JAPI Integration Rules

- Extended JAPI usage requires ydlua initialization at startup.
- Keep bootstrap behavior intact for dev versus prod loading paths.
- Do not assume JAPI features work outside the intended KKWE runtime environment.
- If adding new JAPI usage, verify both compile-time types and runtime availability.

## Build Pipeline Expectations

Production flow should remain conceptually:

1. Compile TypeScript to Lua.
2. Inject Lua execution call into war3map.j.
3. Copy and configure bootstrap.lua for production.
4. Minify bundled Lua when enabled.
5. Package maps into dist/map.w3x.

Any change to this flow must be validated with yarn build and a real map launch test.

For routine AI-agent verification, default to yarn build:dev first, then use yarn build when changes may affect bundled production output.

## Common Failure Checks

- test:map fails: ensure dist/map.w3x exists and KKWE path is valid.
- Packed map does nothing in vanilla WC3: expected. Launch via KKWE, not the original Warcraft III.exe.
- build:map fails: ensure w3x2lni path is valid and maps structure is intact.
- After KKWE terrain save: source is already in `maps/`; do not unpack. Re-pack only if play-testing `dist/map.w3x`.
- hot reload does not trigger: verify dist/hot-reload.json generation and module registration consistency.
- frame-related runtime errors: verify createType arguments and unique names.
- jass/japi missing symbols: verify noResolvePaths config and ydlua initialization.

## Documentation And References

- Primary project overview: README.md
- AI/project coding conventions: .github/copilot-instructions.md
- Hot reload docs: docs/hot-reload-usage.md and docs/hot-reload-troubleshooting.md
- UI component docs: docs/Button-Usage.md, docs/Dialog-Usage.md, docs/panel-usage.md

## Minimal Collaboration And Safety Rules

- Do not run destructive git commands (for example hard reset) unless explicitly requested.
- Do not revert unrelated user changes.
- Keep edits scoped to the requested task.
- Do not edit generated third-party tool binaries under dev_lib unless explicitly requested.
- Prefer small, reviewable commits with task-focused messages.

## File Reference Convention In Chat

- Use repository-root relative paths when referencing files.
- Include line numbers when discussing specific code locations.

## UI Designer Collaboration (AI Loop)

This repo pairs with the sibling [`ui-designer`](../ui-designer/) repository for AI-driven UI design. The canonical workflow is:

**AI designs → user Accepts in the designer → `yarn ui:pull` regenerates TS → user edits custom logic outside BEGIN/END → `yarn build:dev` verifies → optionally `yarn ui:push` syncs back.**

Agents operating in this repo must respect the following:

1. **Generated directory is controlled**: all codegen output lives in `src/ui/generated/`. Anything in that directory is produced by `yarn ui:pull` (or the designer's "Export → File" menu using the `wc3-map-ts-template` plugin). Hand-editing files here, **especially between `// <ui-designer:generated:BEGIN>` and `// <ui-designer:generated:END>` markers**, will be overwritten on the next pull. Custom game-logic hooks (event listeners, visibility toggles, state wiring) must be written **outside** those markers.
2. **Sidecar is the reverse-import contract**: each generated `*.ts` has a sibling `*.ui.json` (the `wc3-template-export` sidecar). `yarn ui:push` uses this sidecar — not the TS — to reconstruct the designer state. Never delete the sidecar.
3. **Standard command order** (both repos cloned as siblings, `../ui-designer` resolvable, or `UI_DESIGNER_PATH` env var set):
   1. `yarn tauri:dev` in `../ui-designer` — starts the designer with its MCP HTTP listener (default `http://127.0.0.1:8765`; override via `UI_DESIGNER_MCP_HTTP_URL`).
   2. `yarn ui:pull` — regenerate `src/ui/generated/*.ts` + `*.ui.json` from the current designer state.
   3. `yarn build:dev` — verify the generated TS compiles with the real `src/system/ui/` component API.
   4. `yarn ui:check` — idempotence / drift gate suitable for CI and pre-commit hooks.
   5. `yarn ui:push` — only when you've **intentionally** hand-edited a `*.ui.json` sidecar locally and want to replay that state into the designer UI. Do NOT use this to bypass the proposal gateway.
4. **Resource path contract & auto-copy**: all UI image paths originate from the designer and must be rooted at `war3mapImported/`. The codegen fails strict-mode if any widget image string does not match this prefix — this keeps Lua import names stable across two-way sync. By default `yarn ui:pull` also copies every referenced `ImageResource.localPath` into this repo's `resource/` directory (via `--copy-resources <repo>/resource`), so the generated TS and its asset payload land together. Opt out with `yarn ui:pull --no-copy-resources` when you only need layout changes. If the pull reports `未登记资源` or `source missing`, ask the AI to rerun `ui_normalize_resource_paths` inside the designer first — that tool takes any raw absolute paths the AI parked in `widget.image` and rewrites them into `war3mapImported/<basename>` while registering the source file as an `ImageResource`.
5. **HotReload integration**: generated modules export `initialize()` / `cleanup()` so they plug into [`src/system/HotReload.ts`](src/system/HotReload.ts) automatically. Keep the `UIComponentManager.getInstance().destroyAll?.()` call inside `cleanup()` intact; it prevents stale frames when the generated module reloads.
6. **Never run `ui:push` without user awareness**: it performs `replaceProjectSnapshot` on the running designer and can discard unsaved designer-side edits. Prefer the designer's "工具 → 从模板 sidecar 导入…" menu for one-off imports.
