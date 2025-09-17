
/** @noSelfInFile **/
interface Ijassruntime {
    console: boolean
    version: string
    error_hanlde: (msg: string) => void
    handle_level: 0 | 1 | 2
    sleep: boolean
    catch_crash: boolean
    debugger: number
}