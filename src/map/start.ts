import { EVENT_UNIT_ACQUIRED_TARGET, FRAME_ALIGN_BOTTOM, PLAYER_COLOR_AQUA } from "../define";
import { c2i } from "../lib/helper"
import { DPlayerTest } from "./test/TestDPlayer";

export function mapInit() {
    DPlayerTest()
}



function demo(){
    let player = GetLocalPlayer()
    let uid = CreateUnit(player,c2i("hpea"),0,0,0);
    print(uid)
    print(FRAME_ALIGN_BOTTOM)
    print(EVENT_UNIT_ACQUIRED_TARGET())
}