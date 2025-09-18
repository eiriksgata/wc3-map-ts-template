// 基础的id转换
export function c2i(char: string) {
    return string.unpack(">I4", char)[0] as number
}

export function i2c(id: number) {
    return string.pack("I4", id)
}
