#!/usr/bin/env node
/**
 * wc3-map-ts-template ← ui-designer 代码生成桥接
 *
 * 这个脚本不包含任何生成逻辑，只负责：
 *   1. 找到 ui-designer 仓库（通过 UI_DESIGNER_PATH 环境变量，或 ../ui-designer 猜测）
 *   2. 调用其 integrations/wc3-map-ts-template/codegen.mjs
 *
 * 子命令：
 *   pull   从 ui-designer 桌面端 MCP（http://127.0.0.1:8765 默认）拉取结构化数据并生成
 *          `src/ui/generated/*.ts` + `*.ui.json`
 *   check  只做 diff 不写盘；若漂移则退出码 1（适合 CI / pre-commit）
 *   push   把本仓 `src/ui/generated/*.ui.json` 逐个推回设计器（调 MCP
 *          `ui_import_from_sidecar`）
 *
 * 额外参数将原样透传给底层 codegen.mjs（例如 --class-name、--resources-prefix）。
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const DEFAULT_OUT_DIR = path.join(REPO_ROOT, 'src', 'ui', 'generated');
const DEFAULT_MCP = process.env.UI_DESIGNER_MCP_HTTP_URL || 'http://127.0.0.1:8765';
// 资源落点：默认放到模板仓的 resource/。widget.image 里 war3 相对路径会叠加到这里，
// 例如 "war3mapImported/icon.blp" -> resource/war3mapImported/icon.blp
const DEFAULT_RES_DIR = path.join(REPO_ROOT, 'resource');

function resolveUiDesignerRepo() {
    const envPath = process.env.UI_DESIGNER_PATH;
    const candidates = [];
    if (envPath && envPath.trim()) candidates.push(path.resolve(envPath));
    candidates.push(path.resolve(REPO_ROOT, '..', 'ui-designer'));
    candidates.push(path.resolve(REPO_ROOT, '..', '..', 'ui-designer'));
    for (const c of candidates) {
        const codegen = path.join(c, 'integrations', 'wc3-map-ts-template', 'codegen.mjs');
        if (fsSync.existsSync(codegen)) return { repo: c, codegen };
    }
    throw new Error(
        [
            '找不到 ui-designer 仓库。请设置环境变量 UI_DESIGNER_PATH 指向仓库根目录，',
            '或把 ui-designer 克隆到当前仓库的同级目录（../ui-designer）。',
            `已尝试路径：\n  ${candidates.join('\n  ')}`,
        ].join('\n'),
    );
}

function runNode(scriptPath, args) {
    return new Promise((resolve) => {
        const child = spawn(process.execPath, [scriptPath, ...args], {
            stdio: 'inherit',
            env: process.env,
        });
        child.on('exit', (code) => resolve(code ?? 0));
    });
}

async function listSidecarFiles(dir) {
    let entries;
    try {
        entries = await fs.readdir(dir);
    } catch (e) {
        if (e && e.code === 'ENOENT') return [];
        throw e;
    }
    return entries
        .filter((n) => n.endsWith('.ui.json'))
        .map((n) => path.join(dir, n));
}

async function pushSidecarsToDesigner({ mcp, outDir }) {
    const sidecars = await listSidecarFiles(outDir);
    if (sidecars.length === 0) {
        console.error(`[ui:push] 没找到任何 *.ui.json 于 ${outDir}`);
        return 1;
    }
    const mod = await import('@modelcontextprotocol/sdk/client/index.js').catch(
        () => null,
    );
    const transportMod = await import(
        '@modelcontextprotocol/sdk/client/streamableHttp.js'
    ).catch(() => null);
    if (!mod || !transportMod) {
        console.error(
            '[ui:push] 需要安装 @modelcontextprotocol/sdk；可在 ui-designer 仓中安装后通过 npx 调用。',
        );
        return 1;
    }
    const { Client } = mod;
    const { StreamableHTTPClientTransport } = transportMod;
    const base = new URL(mcp.endsWith('/') ? mcp : `${mcp}/`);
    const transport = new StreamableHTTPClientTransport(base);
    const client = new Client({ name: 'wc3-template-ui-push', version: '1.0.0' });
    await client.connect(transport);
    let pushed = 0;
    for (const sidecarPath of sidecars) {
        try {
            const raw = await client.callTool({
                name: 'ui_import_from_sidecar',
                arguments: { path: sidecarPath },
            });
            console.log(`[ui:push] ${sidecarPath}`);
            const text = (raw?.content || [])
                .map((c) => (c?.type === 'text' ? c.text : ''))
                .join('')
                .trim();
            if (text) console.log(text);
            pushed++;
        } catch (e) {
            console.error(`[ui:push] 失败：${sidecarPath}`);
            console.error(e?.stack || e?.message || e);
        }
    }
    await client.close();
    return pushed === sidecars.length ? 0 : 1;
}

async function main() {
    const argv = process.argv.slice(2);
    const sub = argv.shift();
    if (!sub || sub === '-h' || sub === '--help') {
        console.log(
            [
                'Usage:',
                '  yarn ui:pull  [extra codegen flags]   Pull current UI Designer state into src/ui/generated/',
                '                                        (also copies referenced image resources into resource/)',
                '  yarn ui:check [extra codegen flags]   Verify src/ui/generated/ and resource/ match designer state',
                '  yarn ui:push  [--mcp <url>]           Push local *.ui.json sidecars back into UI Designer',
                '',
                'Extra flags (pass through to codegen.mjs):',
                '  --copy-resources <dir>     Override resource copy target (default: <repo>/resource)',
                '  --no-copy-resources        Skip resource copying entirely (layout-only pull)',
                '  --no-overwrite-resources   Keep existing files on collision',
                '  --resources-prefix <p>     Required war3 prefix (default war3mapImported/)',
                '  --class-name <Name>       Override generated module/class name',
                '',
                'Env:',
                '  UI_DESIGNER_PATH          Path to ui-designer repo (default: ../ui-designer)',
                '  UI_DESIGNER_MCP_HTTP_URL  UI Designer MCP base URL (default: http://127.0.0.1:8765)',
            ].join('\n'),
        );
        return 0;
    }

    if (sub === 'push') {
        let mcp = DEFAULT_MCP;
        let outDir = DEFAULT_OUT_DIR;
        for (let i = 0; i < argv.length; i++) {
            if (argv[i] === '--mcp') mcp = argv[++i];
            else if (argv[i] === '--out-dir') outDir = argv[++i];
        }
        return pushSidecarsToDesigner({ mcp, outDir });
    }

    const { codegen } = resolveUiDesignerRepo();
    const passthrough = [...argv];
    if (!passthrough.includes('--out-dir')) {
        passthrough.push('--out-dir', DEFAULT_OUT_DIR);
    }
    if (!passthrough.includes('--mcp') && !passthrough.some((a) => !a.startsWith('--'))) {
        passthrough.push('--mcp', DEFAULT_MCP);
    }
    // 默认把资源拷贝到本仓 resource/；显式 --no-copy-resources 或 --copy-resources <dir> 都可覆盖
    const hasCopyFlag = passthrough.some(
        (a) => a === '--copy-resources' || a === '--no-copy-resources',
    );
    if (!hasCopyFlag) {
        passthrough.push('--copy-resources', DEFAULT_RES_DIR);
    }
    if (sub === 'check' && !passthrough.includes('--check')) {
        passthrough.push('--check');
    }
    if (sub !== 'pull' && sub !== 'check') {
        console.error(`[ui-codegen] 未知子命令: ${sub}（支持 pull / check / push）`);
        return 1;
    }
    return runNode(codegen, passthrough);
}

main()
    .then((code) => process.exit(code || 0))
    .catch((err) => {
        console.error(err?.stack || err?.message || err);
        process.exit(1);
    });
