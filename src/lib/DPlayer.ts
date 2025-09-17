import { MAP_CONTROL_USER, PLAYER_SLOT_STATE_PLAYING } from "../define";
export class DPlayer {

  // 玩家id与DPlayer的对应
  static _playerHandle: { id: number, handle: DPlayer }[] = []
  // 真正的玩家数量
  static _playerCount = 0;
  // 本地玩家
  static _localPlayer: DPlayer;

  // 游戏内的handle
  private _handle;
  private _name = "";
  /**
   * 初始化 玩家列表
   */
  static init() {
    for (let index = 1; index < 16; index++) {
      let tempPlayer = new DPlayer(Player(index - 1))
      DPlayer._playerHandle.push({
        id: index,
        handle: tempPlayer
      })
      if (tempPlayer.isPlayer()) {
        DPlayer._playerCount = DPlayer._playerCount + 1;
      }
      DPlayer._localPlayer = new DPlayer(GetLocalPlayer())
    }
  }

  static getAllPlayer() {
    return DPlayer._playerHandle
  }
  static getPlayer(id: number) {
    let tempPlayer = DPlayer._playerHandle.find(e => e.id == id);
    return tempPlayer ? tempPlayer.handle : null
  }
  static getPlayerNum() {
    return DPlayer._playerCount
  }
  static getLoc() {
    return DPlayer._localPlayer
  }

  private constructor(p: player) {
    this._handle = p;
  }

  /**
   * 判断是否真正的玩家
   * @returns 
   */
  isPlayer() {
    let tempHandle = this._handle;
    return GetPlayerController(tempHandle) == MAP_CONTROL_USER()
      && GetPlayerSlotState(tempHandle) == PLAYER_SLOT_STATE_PLAYING()
  }

  get name() {
    if (!this._name) {
      this._name = GetPlayerName(this._handle)
    }
    return this._name
  }

  set name(name: string) {
    if (name !== null && name != this._name) {
      SetPlayerName(this._handle, name)
      this._name = name
    }
  }
}