import { Unit, tsGlobals } from '../node_modules/wc3ts-1.27a/index';
const { Players } = tsGlobals;
import { c2i } from './utils/helper';
/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {
  DisplayTextToPlayer(Player(0), 0, 0, "Hello, Warcraft III with TypeScript and wc3ts!");
  //Unit.create(Players[0], c2i('hpea'), 0, 0, 0); // 创建一个农民，防止报错
 
}

// 启动应用程序
main();