
import * as fs from 'fs';
import { execSync } from 'child_process';
const luamin = require('luamin');

interface TsConfig {
  tstl: {
    luaBundle: string;
  };
}

interface Luamin {
  minify(code: string): string;
}

const argv: string[] = process.argv.slice(2);
const isDev: boolean = argv[0] === "dev";

//检查目录是否存在，如果不存在则创建
function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}


//打包w3x文件
export function buildW3x(): void {
  //读取config.json
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
  const w2lPath = config.w2l.path;
  if (!fs.existsSync(w2lPath)) {
    console.error(`w3x2lni not found in path: ${w2lPath}`);
    process.exit(1);
  }
  ensureDirectoryExists("dist");
  try {
    execSync(`"${w2lPath}/w2l.exe" obj ./maps/map ./dist/map.w3x`);
    console.log(">>> w2l build obj completed");
  } catch (error) {
    console.error("Error during w2l build obj:", error);
    process.exit(1);
  }

}


/**
 * 压缩 Lua 代码
 */
function minifyLua(): void {
  try {
    // 读取 tsconfig.json 的配置
    const tsconfigContent: string = fs.readFileSync("tsconfig.json", "utf-8");

    if (!tsconfigContent) {
      console.error("Failed to read tsconfig.json");
      return;
    }

    const tsconfig: TsConfig = JSON.parse(tsconfigContent);
    const luaFile: string = tsconfig.tstl.luaBundle;

    if (!fs.existsSync(luaFile)) {
      console.error(`Lua file not found: ${luaFile}`);
      return;
    }

    const rawContent: string = fs.readFileSync(luaFile, "utf-8");
    const minifiedContent: string = (luamin as Luamin).minify(rawContent);

    fs.writeFileSync(luaFile, minifiedContent);
    console.log(">>> Lua minification completed");
  } catch (error) {
    console.error("Error during Lua minification:", error);
    process.exit(1);
  }
}

/**
 * 将 TypeScript 编译为 Lua
 */
function compileTypeScriptToLua(): void {
  try {
    execSync('tstl', { stdio: 'inherit' });
    console.log(">>> TypeScript to Lua compilation completed");
  } catch (error) {
    console.error("Error during TypeScript compilation:", error);
    process.exit(1);
  }
}

/**
 * 构建项目
 */
function main(): void {
  console.log(`>>> Starting build process (${isDev ? 'development' : 'production'} mode)`);

  compileTypeScriptToLua();

  // 注释掉这部分代码，这样即使在生产模式下也不会压缩 Lua 代码
  // if (!isDev) {
  //   minifyLua();
  // }

  buildW3x();

  console.log(">>> Build process completed");
}

// 执行构建
main();