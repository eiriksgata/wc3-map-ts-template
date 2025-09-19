/// <reference types="lua-types/5.3" />

// 基础的id转换
export function c2i(char: string): number {
    // 使用 Lua 的 string.unpack 函数
    const result = (string as any).unpack(">I4", char);
    return result[0] as number;
}

export function i2c(id: number): string {
    // 使用 Lua 的 string.pack 函数
    return (string as any).pack("I4", id);
}
