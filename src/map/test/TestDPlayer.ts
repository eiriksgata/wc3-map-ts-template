import { DPlayer } from "../../lib/DPlayer";

export function TestDplayerStatic() {
    DPlayer.init();

    print("TestDplayerStatic-----\n")
    print(DPlayer.getLoc())
    print(DPlayer.getPlayerNum())
    print(DPlayer.getAllPlayer().length)
    print("TestDplayerStatic-----\n")
}


export function TestName(){
    DPlayer.init();
    let p = DPlayer.getLoc()
    print(p.name)
    p.name = "Demo"
    print(p.name)
}

export function DPlayerTest(){
    // 初始化测试
    // TestDplayerStatic()
    TestName()
}