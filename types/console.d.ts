
/** @noSelf **/
interface Ijassconsole {
    enable: boolean,
    read: (f: (...msg: any[]) => void) => void
    write: (...msg: any[]) => void
}