// 类型定义
interface Ijassruntime {
  sleep(timeout: number): void;
  [key: string]: any;
}

interface Ijassconsole {
  write(message: string): void;
  [key: string]: any;
}

interface Ijassdebug {
  [key: string]: any;
}

// 导入ydlua - 使用 any 类型来避免编译错误
export const ydcommon = require("jass.common") as any;
export const ydai = require("jass.ai") as any;
export const ydglobals = require("jass.globals") as any;
export const ydjapi = require("jass.japi") as any;
export const ydhook = require("jass.hook") as any;
export const ydruntime: Ijassruntime = require("jass.runtime");
export const ydslk = require("jass.slk") as any;
export const ydconsole: Ijassconsole = require("jass.console");
export const yddebug: Ijassdebug = require("jass.debug");
export const ydlog = require("jass.log") as any;
export const ydmessage = require("jass.message") as any;
export const ydbignum = require("jass.bignum") as any;


