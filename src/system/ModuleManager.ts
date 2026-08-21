/**
 * 模块管理器
 * 负责管理各个模块的热更新和生命周期
 */

import { createLogger } from "src/utils/logger";

const log = createLogger("ModuleManager");

interface ModuleInfo {
  name: string;
  module: any;
  initializeFunction?: () => void;
  cleanupFunction?: () => void;
  hotReloadFunction?: () => void;
  dependencies?: string[];
  initialized: boolean;
}

export class ModuleManager {
  private static instance: ModuleManager;
  private modules: Map<string, ModuleInfo> = new Map();
  private initializationOrder: string[] = [];

  private constructor() {
    // 私有构造函数，确保单例
    log.info("Instance created");
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      log.info("Creating new instance");
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  /**
   * 注册模块
   * @param module 模块类（TSTL 会自动生成 ClassName.name 属性）
   * @param options 配置选项
   */
  public registerModule(
    module: any, 
    options: {
      initialize?: () => void;
      cleanup?: () => void;
      onHotReload?: () => void;
      dependencies?: string[];
    } = {}
  ): void {
    // 自动从类中获取名称
    const name = module.name as string;
    
    if (!name) {
      log.error("module has no name property");
      return;
    }

    const moduleInfo: ModuleInfo = {
      name,
      module,
      initializeFunction: options.initialize,
      cleanupFunction: options.cleanup,
      hotReloadFunction: options.onHotReload,
      dependencies: options.dependencies || [],
      initialized: false
    };

    this.modules.set(name, moduleInfo);
    log.info(`Module registered: ${name}`);
    log.info(`Total registered modules: ${this.modules.size}`);
  }

  /**
   * 初始化所有模块（按依赖顺序）
   */
  public initializeAllModules(): void {
    // 计算初始化顺序
    this.calculateInitializationOrder();
    
    // 按顺序初始化
    for (const moduleName of this.initializationOrder) {
      this.initializeModule(moduleName);
    }
  }

  /**
   * 初始化单个模块
   */
  private initializeModule(name: string): void {
    const moduleInfo = this.modules.get(name);
    if (!moduleInfo) {
      log.warn(`Module ${name} not found`);
      return;
    }

    if (moduleInfo.initialized) {
      return; // 已经初始化过了
    }

    // 先初始化依赖
    for (const depName of moduleInfo.dependencies || []) {
      this.initializeModule(depName);
    }

    // 初始化当前模块
    try {
      if (moduleInfo.initializeFunction) {
        moduleInfo.initializeFunction();
      }
      moduleInfo.initialized = true;
      log.info(`Module initialized: ${name}`);
    } catch (error) {
      log.error(`initializing module ${name}: ${error}`);
    }
  }

  /**
   * 热重载指定模块（使用指定路径）
   */
  public hotReloadModuleWithPath(name: string, requirePath: string): void {
    const moduleInfo = this.modules.get(name);
    if (!moduleInfo) {
      log.warn(`Module ${name} not registered for hot reload`);
      return;
    }

    try {
      // 1. 清理旧模块（如果有清理函数）
      if (moduleInfo.cleanupFunction) {
        moduleInfo.cleanupFunction();
        log.info(`Cleaned up module: ${name}`);
      }

      // 2. 重新加载模块（使用提供的路径）
      // 清除模块缓存
      (globalThis as any).package.loaded[requirePath] = undefined;
      
      // 重新加载
      const newModule = require(requirePath);
      moduleInfo.module = newModule;
      
      log.info(`Reloaded module: ${name} from ${requirePath}`);

      // 3. 调用热重载处理函数
      if (moduleInfo.hotReloadFunction) {
        moduleInfo.hotReloadFunction();
        log.info(`Hot reload handled for module: ${name}`);
      }

      // 4. 重新初始化（如果需要）
      if (moduleInfo.initializeFunction) {
        moduleInfo.initialized = false;
        this.initializeModule(name);
      }

    } catch (error) {
      log.error(`during hot reload of module ${name}: ${error}`);
    }
  }

  /**
   * 批量热重载多个模块（带路径）
   */
  public hotReloadModulesWithPath(modules: Array<{name: string, path: string}>): void {
    log.info(`Hot reloading ${modules.length} modules...`);
    
    let successCount = 0;
    let failCount = 0;

    for (const mod of modules) {
      try {
        this.hotReloadModuleWithPath(mod.name, mod.path);
        successCount++;
      } catch (error) {
        failCount++;
        log.error(`Failed to hot reload module ${mod.name}: ${error}`);
      }
    }

    log.info(`Hot reload completed: ${successCount} succeeded, ${failCount} failed`);
  }

  /**
   * 热重载指定模块（旧版兼容，自动推断路径）
   */
  public hotReloadModule(name: string): void {
    const modulePath = this.getModulePathFromName(name);
    if (modulePath) {
      this.hotReloadModuleWithPath(name, modulePath);
    } else {
      log.warn(`Cannot find path for module ${name}`);
    }
  }

  /**
   * 批量热重载多个模块（旧版兼容）
   */
  public hotReloadModules(moduleNames: string[]): void {
    log.info(`Hot reloading ${moduleNames.length} modules...`);
    
    let successCount = 0;
    let failCount = 0;

    for (const moduleName of moduleNames) {
      try {
        this.hotReloadModule(moduleName);
        successCount++;
      } catch (error) {
        failCount++;
        log.error(`Failed to hot reload module ${moduleName}: ${error}`);
      }
    }

    log.info(`Hot reload completed: ${successCount} succeeded, ${failCount} failed`);
  }

  /**
   * 将模块名转换为实际的 require 路径
   * 按照常见的目录结构尝试查找
   */
  private getModulePathFromName(name: string): string | null {
    // 尝试常见的路径模式
    const possiblePaths = [
      `src.examples.${name}`,
      `src.system.ui.component.${name}`,
      `src.system.ui.${name}`,
      `src.system.${name}`,
      `src.utils.${name}`,
      `src.config.${name}`,
      `src.${name}`,
    ];

    // 返回第一个可能的路径，实际的模块加载会验证是否正确
    return possiblePaths[0];
  }

  /**
   * 计算模块初始化顺序（拓扑排序）
   */
  private calculateInitializationOrder(): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (name: string): void => {
      if (visiting.has(name)) {
        throw new Error(`Circular dependency detected involving ${name}`);
      }
      if (visited.has(name)) {
        return;
      }

      visiting.add(name);
      
      const moduleInfo = this.modules.get(name);
      if (moduleInfo) {
        for (const depName of moduleInfo.dependencies || []) {
          visit(depName);
        }
      }
      
      visiting.delete(name);
      visited.add(name);
      order.push(name);
    };

    for (const moduleName of this.modules.keys()) {
      if (!visited.has(moduleName)) {
        visit(moduleName);
      }
    }

    this.initializationOrder = order;
  }

  /**
   * 获取已注册的模块列表
   */
  public getRegisteredModules(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * 检查模块是否已注册
   */
  public isModuleRegistered(name: string): boolean {
    return this.modules.has(name);
  }
}