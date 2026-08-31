import { execFile, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const WAR3_PROCESS_NAMES = ['war3', 'Warcraft III'];
const LAUNCH_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 列出当前正在运行的 war3 / Warcraft III 进程 PID。
 */
async function listWar3Pids(): Promise<Set<number>> {
  const nameFilter = WAR3_PROCESS_NAMES.map((n) => `'${n}'`).join(',');
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
(Get-Process -Name ${nameFilter} | Select-Object -ExpandProperty Id) -join ','
`.trim();

  try {
    const { stdout } = await execFileAsync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', script],
      { windowsHide: true },
    );
    const pids = stdout
      .trim()
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
    return new Set(pids);
  } catch {
    return new Set();
  }
}

async function isPidAlive(pid: number): Promise<boolean> {
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
if (Get-Process -Id ${pid}) { '1' } else { '0' }
`.trim();
  try {
    const { stdout } = await execFileAsync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', script],
      { windowsHide: true },
    );
    return stdout.trim() === '1';
  } catch {
    return false;
  }
}

/**
 * 等待出现相对于 baseline 的新 war3 进程。
 */
async function waitForNewWar3Pid(
  baseline: Set<number>,
  timeoutMs: number,
  hintedPid?: number,
): Promise<number> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (hintedPid && !baseline.has(hintedPid) && (await isPidAlive(hintedPid))) {
      return hintedPid;
    }
    const current = await listWar3Pids();
    for (const pid of current) {
      if (!baseline.has(pid)) {
        return pid;
      }
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(
    `Timed out after ${timeoutMs}ms waiting for war3.exe to start`,
  );
}

/**
 * 轮询直到指定 PID 退出（Wait-Process 对 war3 可能因权限失败）。
 */
async function waitForProcessExit(pid: number): Promise<void> {
  console.log(`>>> Waiting for war3 (pid=${pid}) to exit...`);
  while (await isPidAlive(pid)) {
    await sleep(POLL_INTERVAL_MS);
  }
}

function resolveKkwePath(configPath: string): string {
  const candidates = [
    configPath,
    configPath.replace(/kkwe$/i, 'KKWE'),
    configPath.replace(/KKWE$/i, 'kkwe'),
  ];
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }
  return path.resolve(configPath);
}

function launchWithYdweConfig(
  ydweConfigExe: string,
  mapW3xPath: string,
): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      ydweConfigExe,
      ['-launchwar3', '-loadfile', mapW3xPath],
      {
        cwd: process.cwd(),
        windowsHide: true,
        stdio: 'ignore',
      },
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      // 实测：YDWEConfig 成功时会把拉起的 war3 PID 作为退出码返回。
      resolve(code && code > 0 ? code : null);
    });
  });
}

async function main(): Promise<void> {
  console.log('>>> Run Test map...');

  const mapW3xPath = path.resolve('dist', 'map.w3x');
  if (!fs.existsSync(mapW3xPath)) {
    console.error(`>>> map not found: ${mapW3xPath}`);
    console.error('>>> Run yarn build / yarn build:map first.');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8')) as {
    kkwe?: { path?: string };
  };
  const kkwePath = resolveKkwePath(config.kkwe?.path ?? 'dev_lib/KKWE');
  const ydweConfigExe = path.join(kkwePath, 'bin', 'YDWEConfig.exe');
  if (!fs.existsSync(ydweConfigExe)) {
    console.error(`>>> YDWEConfig.exe not found: ${ydweConfigExe}`);
    process.exit(1);
  }

  const baseline = await listWar3Pids();
  if (baseline.size > 0) {
    console.log(
      `>>> Existing war3 process(es): ${[...baseline].join(', ')}`,
    );
  }

  console.log(`>>> Launching: ${ydweConfigExe}`);
  console.log(`>>> Map: ${mapW3xPath}`);
  const hintedPid = await launchWithYdweConfig(ydweConfigExe, mapW3xPath);
  if (hintedPid) {
    console.log(`>>> YDWEConfig reported pid hint: ${hintedPid}`);
  }

  console.log('>>> Waiting for war3 process to appear...');
  const pid = await waitForNewWar3Pid(baseline, LAUNCH_TIMEOUT_MS, hintedPid ?? undefined);
  console.log(`>>> war3 started (pid=${pid})`);

  await waitForProcessExit(pid);
  console.log('>>> war3 exited');
}

main().catch((error) => {
  console.error('>>> Error during map test:', error);
  process.exit(1);
});
