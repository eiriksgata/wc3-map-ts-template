

import { bj_MAX_PLAYER_SLOTS, MapPlayer, Players } from "@eiriksgata/wc3ts/src/globals/define";
import { ConfigManager } from "../config";
import { createLogger } from "../utils/logger";

const log = createLogger("ydlua");
const runtimeLog = createLogger("LuaRuntime");


// 将 JASS 模块声明为局部变量，避免产生 export 导出
const ydcommon = require("jass.common")
const ydai = require("jass.ai")
const ydglobals = require("jass.globals")
const ydjapi = require("jass.japi")
const ydhook = require("jass.hook")
const ydruntime: Ijassruntime = require("jass.runtime")
const ydslk = require("jass.slk")
const ydconsole: Ijassconsole = require("jass.console")
const yddebug: Ijassdebug = require("jass.debug")
const ydlog = require("jass.log")
const ydmessage = require("jass.message")
const ydbignum = require("jass.bignum")


export class ydlua {

  private configManager: ConfigManager;
  private static instance: ydlua;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  /**
 * 获取实例
 */
  public static getInstance(): ydlua {
    if (!ydlua.instance) {
      ydlua.instance = new ydlua();
    }
    return ydlua.instance;
  }

  /**
 * 初始化运行时
 */
  private initializeRuntime(): void {
    const config = this.configManager.getConfig();
    const runtimeConfig = config.runtime;

    ydruntime.console = config.console;
    ydruntime.sleep = runtimeConfig.sleep;
    ydruntime.debugger = runtimeConfig.debuggerPort;
    ydruntime.catch_crash = runtimeConfig.catchCrash;

    // 设置错误处理器（Lua 运行时异常，msg 内通常含堆栈）
    ydruntime.error_hanlde = function (msg: any) {
      runtimeLog.error("======== lua-err ========");
      runtimeLog.error(tostring(msg));
      runtimeLog.error("=========================");
    };

    log.info(`Runtime configured: debugger=${runtimeConfig.debuggerPort}, crash_catch=${runtimeConfig.catchCrash}`);
  }

  /**
   * 初始化 YD Lua 相关内容
   * 自动化注册 JASS 全局函数到 _G
   * 方便在 TypeScript 中调用
   */
  /**
   * 初始化运行时环境
   */
  public initialize(): void {
    this.initializeConsole();
    this.installErrorHandler();
    //this.initializeRuntime();
    this.registerGlobals();
  }

  /**
   * 即使不走完整 runtime 配置，也要挂上带模块前缀的 Lua 错误输出。
   */
  private installErrorHandler(): void {
    ydruntime.error_hanlde = function (msg: any) {
      runtimeLog.error("======== lua-err ========");
      runtimeLog.error(tostring(msg));
      runtimeLog.error("=========================");
    };
  }

  /**
 * 初始化控制台
 */
  private initializeConsole(): void {
    const isConsoleEnabled = this.configManager.isConsoleEnabled();
    ydconsole.enable = isConsoleEnabled;

    if (isConsoleEnabled) {
      // 设置全局 print 函数
      _G["print"] = (message: string) => ydconsole.write(message);
      log.info("print enabled");
    }
  }


  /**
   * 注册全局变量
   */
  private registerGlobals(): void {

    //这部分已交给 bootstrap 处理
    
    // // 注册 jass.common 到全局
    // Object.keys(ydcommon).forEach(key => {
    //   // @ts-ignore
    //   _G[key] = ydcommon[key];
    // });

    // // 注册 jass.japi 到全局
    // Object.keys(ydjapi).forEach(key => {
    //   // @ts-ignore
    //   _G[key] = ydjapi[key];
    // });

    log.info("Global APIs registered");
  }

};