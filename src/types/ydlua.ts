// Mock 实现，避免编译错误
export const ydcommon = {} as any;
export const ydai = {} as any;
export const ydglobals = {} as any;
export const ydjapi = {} as any;
export const ydhook = {} as any;
export const ydruntime = {
  sleep: (timeout: number) => {},
  console: false,
  debugger: 0,
  catch_crash: false,
  error_hanlde: (msg: any) => {}
} as any;
export const ydslk = {} as any;
export const ydconsole = {
  write: (message: string) => {},
  enable: false
} as any;
export const yddebug = {} as any;
export const ydlog = {} as any;
export const ydmessage = {} as any;
export const ydbignum = {} as any;