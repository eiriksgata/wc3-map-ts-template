/**
 * 应用程序配置接口
 */
export interface AppConfig {
  /** 是否启用调试模式 */
  debug: boolean;
  /** 是否启用控制台 */
  console: boolean;
  /** 运行时配置 */
  runtime: RuntimeConfig;
  /** 地图配置 */
  map: MapConfig;
}

/**
 * 运行时配置
 */
export interface RuntimeConfig {
  /** 调试器端口 */
  debuggerPort: number;
  /** 是否启用睡眠模式 */
  sleep: boolean;
  /** 是否捕获崩溃 */
  catchCrash: boolean;
}

/**
 * 地图配置
 */
export interface MapConfig {
  /** 地图名称 */
  name: string;
  /** 地图版本 */
  version: string;
  /** 地图描述 */
  description: string;
}

/**
 * 服务接口
 */
export interface IService {
  /** 服务名称 */
  readonly name: string;
  /** 初始化服务 */
  initialize(): void;
  /** 销毁服务 */
  destroy(): void;
}

/**
 * 模块接口
 */
export interface IModule {
  /** 模块名称 */
  readonly name: string;
  /** 模块是否已启用 */
  readonly enabled: boolean;
  /** 启用模块 */
  enable(): void;
  /** 禁用模块 */
  disable(): void;
}

/**
 * 事件监听器
 */
export type EventListener<T = any> = (data: T) => void;

/**
 * 事件类型
 */
export interface GameEvents {
  'unit.created': { unit: unit; player: player };
  'unit.died': { unit: unit; killer?: unit };
  'player.left': { player: player };
  'timer.expired': { timer: timer };
}