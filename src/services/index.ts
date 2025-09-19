import { IService } from '../types';

/**
 * 服务管理器
 * 负责管理所有应用服务的生命周期
 */
export class ServiceManager {
  private static instance: ServiceManager;
  private services: Map<string, IService> = new Map();
  private initialized = false;

  private constructor() {}

  /**
   * 获取服务管理器实例
   */
  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * 注册服务
   */
  public registerService(service: IService): void {
    if (this.services.has(service.name)) {
      print(`Service ${service.name} is already registered`);
      return;
    }

    this.services.set(service.name, service);
    print(`>>> Service ${service.name} registered`);

    // 如果服务管理器已经初始化，立即初始化新服务
    if (this.initialized) {
      service.initialize();
    }
  }

  /**
   * 获取服务
   */
  public getService<T extends IService>(serviceName: string): T | undefined {
    return this.services.get(serviceName) as T;
  }

  /**
   * 移除服务
   */
  public unregisterService(serviceName: string): void {
    const service = this.services.get(serviceName);
    if (service) {
      service.destroy();
      this.services.delete(serviceName);
      print(`>>> Service ${serviceName} unregistered`);
    }
  }

  /**
   * 初始化所有服务
   */
  public initializeServices(): void {
    if (this.initialized) {
      print('Services already initialized');
      return;
    }

    print('>>> Initializing all services...');
    
    for (const [name, service] of this.services.entries()) {
      try {
        service.initialize();
        print(`>>> Service ${name} initialized successfully`);
      } catch (error) {
        print(`>>> Error initializing service ${name}: ${error}`);
      }
    }

    this.initialized = true;
    print('>>> All services initialized');
  }

  /**
   * 销毁所有服务
   */
  public destroyServices(): void {
    print('>>> Destroying all services...');
    
    for (const [name, service] of this.services.entries()) {
      try {
        service.destroy();
        print(`>>> Service ${name} destroyed`);
      } catch (error) {
        print(`>>> Error destroying service ${name}: ${error}`);
      }
    }

    this.services.clear();
    this.initialized = false;
    print('>>> All services destroyed');
  }

  /**
   * 获取所有已注册的服务名称
   */
  public getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * 检查服务是否已注册
   */
  public hasService(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * 获取服务数量
   */
  public getServiceCount(): number {
    return this.services.size;
  }

  /**
   * 检查是否已初始化
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}