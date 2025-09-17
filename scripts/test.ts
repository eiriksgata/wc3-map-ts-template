import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * 构建项目
 */
function main(): void {
  console.log(">>> Run Test map");
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
  const kkwePath = config.kkwe.path;
  if (!fs.existsSync(kkwePath)) {
    console.error(`kkwe not found in path: ${kkwePath}`);
    process.exit(1);
  }
  try {
    execSync(`"${kkwePath}/bin/YDWEConfig.exe" -launchwar3 -loadfile ./dist/map.w3x`);
    console.log(">>> w2l build obj completed");
  } catch (error) {
    console.error("Error during w2l build obj:", error);
    process.exit(1);
  }
}

// 执行构建
main();