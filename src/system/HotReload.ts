import { Timer } from "@eiriksgata/wc3ts/*";
import { ModuleManager } from "./ModuleManager";
import { createLogger } from "src/utils/logger";

const log = createLogger("HotReload");

// 程序运行目录路径（仅在 dev 模式下由 bootstrap.lua 注入）
declare const PROJECT_PATH: string | undefined;

/**
 * 检查是否为开发模式
 */
function isDevMode(): boolean {
  return typeof PROJECT_PATH !== 'undefined' && PROJECT_PATH !== null;
}

/**
 * 热更新管理器
 * 负责检测外部热更新通知并重新加载指定模块
 * 注意：仅在开发模式下有效，生产环境会自动禁用
 */
export class HotReload {
  private static instance: HotReload;
  private timer: Timer | null = null;
  private checkInterval: number = 1; // 检查间隔（秒）
  private lastProcessedTimestamp: number = 0;
  private gameStartTimestamp: number = 0; // 游戏启动时间戳（秒，10位）
  private enabled: boolean = true;

  private constructor() {
    // 私有构造函数，确保单例
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): HotReload {
    if (!HotReload.instance) {
      HotReload.instance = new HotReload();
    }
    return HotReload.instance;
  }

  /**
   * 启动热更新监听
   */
  public start(): void {
    // 检查是否为开发模式
    if (!isDevMode()) {
      log.info("Production mode detected, hot reload disabled");
      this.enabled = false;
      return;
    }

    if (!this.enabled) {
      log.info("Hot reload is disabled");
      return;
    }

    if (this.timer) {
      log.info("Hot reload is already running");
      return;
    }

    // 记录游戏启动时间戳（os.time() 返回 10 位秒级时间戳）
    // 在某些 Warcraft III Lua 运行环境中，os 或 os.time 可能不可用，这里做防御性处理避免闪退
    try {
      // @ts-ignore - os 由运行时提供
      this.gameStartTimestamp = os.time();
    } catch (error) {
      this.gameStartTimestamp = 0;
      log.warn(`os.time() not available, fallback to 0, error: ${error}`);
    }
    log.info("Starting hot reload system...");
    log.info(`Game start timestamp: ${this.gameStartTimestamp} (seconds, 10 digits)`);
    log.info(`Check interval: ${this.checkInterval} seconds`);
    log.info(`PROJECT_PATH: ${PROJECT_PATH}`);

    this.timer = Timer.create();
    this.timer.start(this.checkInterval, true, () => {
      this.checkForUpdates();
    });

    log.info("Hot reload system started successfully");
  }

  /**
   * 停止热更新监听
   */
  public stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
      log.info("Hot reload system stopped");
    }
  }

  /**
   * 启用/禁用热更新
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
    log.info(`Hot reload ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 检查热更新通知
   */
  private checkForUpdates(): void {
    try {
      // 尝试读取热更新通知文件
      const notificationContent = this.readHotReloadFile();
      if (!notificationContent) {
        return;
      }

      const notification = this.parseNotification(notificationContent);
      if (!notification) {
        log.error("Failed to parse notification");
        return;
      }

      // 将通知时间戳转换为秒级（如果文件中的是毫秒级，则除以1000）
      // os.time() 返回 10 位秒级时间戳，文件中的可能是 13 位毫秒级
      let notificationTimestampSeconds = notification.timestamp;
      if (notificationTimestampSeconds > 10000000000) {
        // 如果大于 10 位，说明是毫秒级，转换为秒级
        notificationTimestampSeconds = Math.floor(notificationTimestampSeconds / 1000);
      }

      // 检查时间戳是否在游戏启动之前
      if (notificationTimestampSeconds < this.gameStartTimestamp) {
        //log.info(`Notification timestamp (${notificationTimestampSeconds}) is before game start (${this.gameStartTimestamp}), ignoring`);
        return;
      }

      // 检查是否是新的通知（仅检查时间戳，忽略文件中的 processed 字段）
      if (notificationTimestampSeconds <= this.lastProcessedTimestamp) {
        return;
      }

      log.info(`New notification detected!`);
      log.info(`Notification timestamp: ${notificationTimestampSeconds} (original: ${notification.timestamp})`);
      log.info(`Game start timestamp: ${this.gameStartTimestamp}`);
      log.info(`Last processed: ${this.lastProcessedTimestamp}`);
      log.info(`Action: ${notification.action}`);
      log.info(`Modules: ${notification.modules.map(m => m.name).join(", ")}`);

      // 处理热更新
      this.processHotReload(notification);

      // 标记为已处理（仅在内存中，使用秒级时间戳）
      this.markAsProcessed(notificationTimestampSeconds);

    } catch (error) {
      log.error(`Error in checkForUpdates: ${error}`);
    }
  }

  /**
   * 读取热更新通知文件
   */
  private readHotReloadFile(): string | null {
    try {
      const filePath = `${PROJECT_PATH}/hot-reload.json`;
      
      // 使用原生 Lua 代码读取文件
      const file = io.open(filePath, "r");
      if (!file) {
        return null;
      }

      // 使用 *l 逐行读取整个文件
      let content = "";
      let line: string | null;
      while (true) {
        line = file[0]?.read("l") || null;
        if (!line) {
          break;
        }
        content += line + "\n";
      }
      file[0]?.close();
      return content;
    } catch (error) {
      log.error(`Error reading hot reload file: ${error}`);
      return null;
    }
  }

  /**
   * 解析通知内容
   */
  private parseNotification(content: string): HotReloadNotification | null {
    try {
      // 简单的手动 JSON 解析
      return this.parseJsonManually(content);
    } catch (error) {
      return null;
    }
  }

  /**
   * 手动解析简单的 JSON
   */
  private parseJsonManually(jsonStr: string): HotReloadNotification | null {
    try {
      // 简单的字符串解析
      const str = this.removeWhitespace(jsonStr);

      // 提取时间戳
      const timestamp = this.extractNumber(str, '"timestamp":');

      // 提取 action
      const action = this.extractString(str, '"action":"');

      // 提取 modules 数组
      const modules = this.extractModules(str);

      // 提取 processed
      const processed = this.extractBoolean(str, '"processed":');

      return {
        timestamp: timestamp || 0,
        action: action || "",
        modules: modules || [],
        processed: processed || false
      };
    } catch (error) {
      return null;
    }
  }

  private removeWhitespace(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      if (char !== ' ' && char !== '\n' && char !== '\r' && char !== '\t') {
        result += char;
      }
    }
    return result;
  }

  private extractNumber(str: string, key: string): number | null {
    const startIndex = str.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;
    let valueEnd = valueStart;

    while (valueEnd < str.length) {
      const char = str.charAt(valueEnd);
      if (char >= '0' && char <= '9') {
        valueEnd++;
      } else {
        break;
      }
    }

    const numberStr = str.substring(valueStart, valueEnd);
    return numberStr !== "" ? parseInt(numberStr) : null;
  }

  private extractString(str: string, key: string): string | null {
    const startIndex = str.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;
    const valueEnd = str.indexOf('"', valueStart);

    if (valueEnd === -1) return null;

    return str.substring(valueStart, valueEnd);
  }

  private extractModules(str: string): ModuleInfo[] {
    const modules: ModuleInfo[] = [];
    const startKey = '"modules":[';
    const startIndex = str.indexOf(startKey);

    if (startIndex === -1) return modules;

    const arrayStart = startIndex + startKey.length;
    // 找到数组结束位置（需要处理嵌套的对象）
    let depth = 1;
    let arrayEnd = arrayStart;
    for (let i = arrayStart; i < str.length && depth > 0; i++) {
      const char = str.charAt(i);
      if (char === '[' || char === '{') depth++;
      else if (char === ']' || char === '}') depth--;
      if (depth === 0) arrayEnd = i;
    }

    if (arrayEnd === arrayStart) return modules;

    const arrayContent = str.substring(arrayStart, arrayEnd);

    // 解析数组中的对象 {"name":"...","path":"..."}
    let i = 0;
    while (i < arrayContent.length) {
      // 找到对象开始
      const objStart = arrayContent.indexOf('{', i);
      if (objStart === -1) break;
      
      // 找到对象结束
      const objEnd = arrayContent.indexOf('}', objStart);
      if (objEnd === -1) break;
      
      const objContent = arrayContent.substring(objStart, objEnd + 1);
      
      // 提取 name 和 path
      const name = this.extractStringFromObject(objContent, '"name":"');
      const path = this.extractStringFromObject(objContent, '"path":"');
      
      if (name && path) {
        modules.push({ name, path });
      }
      
      i = objEnd + 1;
    }

    return modules;
  }

  /**
   * 从对象字符串中提取字段值
   */
  private extractStringFromObject(objStr: string, key: string): string | null {
    const startIndex = objStr.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;
    const valueEnd = objStr.indexOf('"', valueStart);

    if (valueEnd === -1) return null;

    return objStr.substring(valueStart, valueEnd);
  }

  private extractBoolean(str: string, key: string): boolean | null {
    const startIndex = str.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;

    if (str.substring(valueStart, valueStart + 4) === 'true') {
      return true;
    } else if (str.substring(valueStart, valueStart + 5) === 'false') {
      return false;
    }

    return null;
  }

  /**
   * 处理热更新
   * notification.modules 包含 {name, path} 对象
   */
  private processHotReload(notification: HotReloadNotification): void {
    log.info(`Processing hot reload for ${notification.modules.length} modules...`);

    const moduleManager = ModuleManager.getInstance();
    const registeredModules = moduleManager.getRegisteredModules();
    log.info(`All registered modules: ${registeredModules.join(", ")}`);

    // 匹配已注册的模块，并传递路径信息
    const matchedModules: ModuleInfo[] = [];

    for (const moduleInfo of notification.modules) {
      log.info(`Checking module: ${moduleInfo.name} (${moduleInfo.path})`);

      if (moduleManager.isModuleRegistered(moduleInfo.name)) {
        log.info(`✓ Matched: ${moduleInfo.name}`);
        matchedModules.push(moduleInfo);
      } else {
        log.warn(`✗ Not registered: ${moduleInfo.name}`);
      }
    }

    const matchedNames = matchedModules.map(m => m.name).join(", ");
    log.info(`Matched registered modules: ${matchedNames}`);

    if (matchedModules.length === 0) {
      log.warn("No registered modules to hot reload");
      return;
    }

    // 使用 ModuleManager 进行热重载，传递完整的模块信息
    log.info(`Calling ModuleManager.hotReloadModules...`);
    moduleManager.hotReloadModulesWithPath(matchedModules);
  }

  /**
   * 重新加载单个模块
   */
  private reloadModule(moduleName: string): void {
    // 清除模块缓存（使用 any 绕过类型检查）
    (globalThis as any).package.loaded[moduleName] = undefined;

    // 重新加载模块
    const newModule = require(moduleName);

    // 如果模块有初始化函数，调用它
    if (newModule && typeof newModule.initialize === 'function') {
      newModule.initialize();
    }

    // 如果模块有热重载处理函数，调用它
    if (newModule && typeof newModule.onHotReload === 'function') {
      newModule.onHotReload();
    }
  }

  /**
   * 标记通知为已处理（仅在内存中标记）
   * @param timestampSeconds 时间戳（秒级，10位）
   */
  private markAsProcessed(timestampSeconds: number): void {
    // 由于 Lua 引擎不支持文件写入模式，我们只在内存中标记已处理的时间戳
    // 通过更新 lastProcessedTimestamp 来避免重复处理相同的通知
    this.lastProcessedTimestamp = timestampSeconds;
    log.info(`Marked notification with timestamp ${timestampSeconds} as processed in memory`);
  }
}

/**
 * 模块信息接口
 */
interface ModuleInfo {
  name: string;  // 注册的模块名，如 "ReloadTemplate"
  path: string;  // require 路径，如 "src.examples.ReloadTemplateExample"
}

/**
 * 热更新通知接口
 */
interface HotReloadNotification {
  timestamp: number;
  action: string;
  modules: ModuleInfo[];  // 改为 ModuleInfo 数组
  processed: boolean;
}