import { ConfigManager } from '../config';
import { ydcommon, ydconsole, ydjapi, ydruntime } from '../types/ydlua';

/**
 * 运行时管理器
 * 负责初始化游戏运行时环境
 */
export class RuntimeManager {
  private static instance: RuntimeManager;
  private initialized = false;
  private configManager: ConfigManager;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  /**
   * 获取运行时管理器实例
   */
  public static getInstance(): RuntimeManager {
    if (!RuntimeManager.instance) {
      RuntimeManager.instance = new RuntimeManager();
    }
    return RuntimeManager.instance;
  }

  /**
   * 初始化运行时环境
   */
  public initialize(): void {
    if (this.initialized) {
      print('Runtime already initialized');
      return;
    }

    print('>>> Initializing runtime environment...');

    this.initializeConsole();
    this.initializeRuntime();
    this.registerGlobals();

    this.initialized = true;
    print('>>> Runtime environment initialized');
  }

  /**
   * 初始化控制台
   */
  private initializeConsole(): void {
    const isConsoleEnabled = this.configManager.isConsoleEnabled();
    ydconsole.enable = isConsoleEnabled;
    
    if (isConsoleEnabled) {
      // 设置全局 print 函数
      _G["print"] = (msg: string) => ydconsole.write(msg);
      print('>>> Console enabled');
    }
  }

  /**
   * 初始化运行时
   */
  private initializeRuntime(): void {
    const config = this.configManager.getConfig();
    const runtimeConfig = config.runtime;

    ydruntime.console = config.console;
    // 修复类型问题：sleep 应该是一个函数，但这里赋值的是布尔值
    (ydruntime as any).sleep = runtimeConfig.sleep;
    (ydruntime as any).debugger = runtimeConfig.debuggerPort;
    (ydruntime as any).catch_crash = runtimeConfig.catchCrash;

    // 设置错误处理器
    ydruntime.error_hanlde = function (msg: any) {
      print("========lua-err========");
      print(tostring(msg));
      print("=========================");
    };

    print(`>>> Runtime configured: debugger=${runtimeConfig.debuggerPort}, crash_catch=${runtimeConfig.catchCrash}`);
  }

  /**
   * 注册全局变量
   */
  private registerGlobals(): void {
    // 注册 jass.common 到全局
    Object.keys(ydcommon).forEach(key => {
      // @ts-ignore
      _G[key] = ydcommon[key];
    });

    // 注册 jass.japi 到全局
    Object.keys(ydjapi).forEach(key => {
      // @ts-ignore
      _G[key] = ydjapi[key];
    });

    print('>>> Global APIs registered');
  }

  /**
   * 获取初始化状态
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 重置运行时（用于测试）
   */
  public reset(): void {
    this.initialized = false;
    print('>>> Runtime reset');
  }
}