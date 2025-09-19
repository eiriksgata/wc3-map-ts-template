import { ydcommon, ydconsole, ydjapi, ydruntime } from "./lib/ydlua"

export function initConsole(isDebug = true){
    // 控制台初始化
    ydconsole.enable = isDebug
}

export function env(isDebug = true) {
    initConsole(isDebug)
    // 打印函数
    _G["print"] = ydconsole.write

    // runtime初始化
    ydruntime.console = isDebug
    ydruntime.sleep = false
    ydruntime.debugger = 4279
    
    ydruntime.catch_crash = isDebug
    ydruntime.error_hanlde = function (msg) {
        print("========lua-err========")
        print(tostring(msg))
        print("=========================")
    }

    // 注册jass.common和jass.japi到全局
    Object.keys(ydcommon).forEach(v => {
        // @ts-ignore
        //_G[v] = ydcommon[v]
    })
    
    Object.keys(ydjapi).forEach(v => {
        // @ts-ignore
        _G[v] = ydjapi[v]
    })
}

