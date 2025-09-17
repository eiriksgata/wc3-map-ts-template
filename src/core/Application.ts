import { ConfigManager } from '../config';
import { RuntimeManager } from './runtime';
import { ServiceManager } from '../services';
import { IService } from '../types';

/**
 * 应用程序主类
 * 负责整个应用的生命周期管理
 */
export class Application {
  private static instance: Application;
  private configManager: ConfigManager;
  private runtimeManager: RuntimeManager;
  private serviceManager: ServiceManager;
  private initialized = false;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
    this.runtimeManager = RuntimeManager.getInstance();
    this.serviceManager = ServiceManager.getInstance();
  }

  /**
   * 获取应用实例
   */
  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  /**
   * 初始化应用程序
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      print('Application already initialized');
      return;
    }

    print('>>> Starting application initialization...');

    try {
      // 1. 初始化运行时环境
      this.runtimeManager.initialize();

      // 2. 初始化所有服务
      this.serviceManager.initializeServices();

      this.initialized = true;
      print('>>> Application initialized successfully');
      
      // 打印应用信息
      this.printApplicationInfo();
      
    } catch (error) {
      print(`>>> Application initialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * 注册服务
   */
  public registerService(service: any): void {
    this.serviceManager.registerService(service);
  }

  /**
   * 获取服务
   */
  public getService<T extends IService>(serviceName: string): T | undefined {
    return this.serviceManager.getService<T>(serviceName);
  }

  /**
   * 获取配置管理器
   */
  public getConfigManager(): ConfigManager {
    return this.configManager;
  }

  /**
   * 获取运行时管理器
   */
  public getRuntimeManager(): RuntimeManager {
    return this.runtimeManager;
  }

  /**
   * 获取服务管理器
   */
  public getServiceManager(): ServiceManager {
    return this.serviceManager;
  }

  /**
   * 销毁应用程序
   */
  public destroy(): void {
    if (!this.initialized) {
      return;
    }

    print('>>> Shutting down application...');

    try {
      // 销毁所有服务
      this.serviceManager.destroyServices();
      
      // 重置运行时
      this.runtimeManager.reset();

      this.initialized = false;
      print('>>> Application shutdown complete');
      
    } catch (error) {
      print(`>>> Error during application shutdown: ${error}`);
    }
  }

  /**
   * 检查是否已初始化
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 打印应用信息
   */
  private printApplicationInfo(): void {
    const config = this.configManager.getConfig();
    const mapConfig = config.map;
    
    print('>>> ============================');
    print(`>>> ${mapConfig.name} v${mapConfig.version}`);
    print(`>>> ${mapConfig.description}`);
    print(`>>> Debug Mode: ${config.debug ? 'ON' : 'OFF'}`);
    print(`>>> Console: ${config.console ? 'ON' : 'OFF'}`);
    print(`>>> Services: ${this.serviceManager.getServiceCount()}`);
    print('>>> ============================');
  }
}