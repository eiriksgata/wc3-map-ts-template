/**
 * 带模块前缀的运行时日志。
 *
 * 魔兽控制台只有一条 `print` 通道；生产包又打成单文件 Lua，
 * `debug.getinfo` 只能看到 `main.lua`，无法还原源模块。
 * 因此调用处必须写明模块名，控制台才能按 `[Module]` 检索。
 *
 * 格式：
 *   [Main] FDF TOC loaded
 *   [Button][WARN] setting texture on a template-based button
 *   [Button][ERROR] Failed to create backdrop frame
 */

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

function write(module: string, level: LogLevel, message: string): void {
  if (level === "INFO") {
    print(`[${module}] ${message}`);
    return;
  }
  print(`[${module}][${level}] ${message}`);
}

/** 一次性日志（无 logger 实例时） */
export function log(module: string, message: string): void {
  write(module, "INFO", message);
}

export function logWarn(module: string, message: string): void {
  write(module, "WARN", message);
}

export function logError(module: string, message: string): void {
  write(module, "ERROR", message);
}

export function createLogger(module: string): Logger {
  return {
    info: (message: string) => write(module, "INFO", message),
    warn: (message: string) => write(module, "WARN", message),
    error: (message: string) => write(module, "ERROR", message),
    debug: (message: string) => write(module, "DEBUG", message),
  };
}
