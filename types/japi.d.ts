/** @noSelfInFile **/ 
declare function DzAPI_Map_ChangeStoreItemCoolDown(...option:any[]):any;
declare function DzAPI_Map_ChangeStoreItemCount(...option:any[]):any;
declare function DzAPI_Map_GetActivityData(): string;
declare function DzAPI_Map_GetGameStartTime(): number;
declare function DzAPI_Map_GetGuildName(whichPlayer: player): string;
declare function DzAPI_Map_GetGuildRole(whichPlayer: player): number;
declare function DzAPI_Map_GetLadderLevel(whichPlayer: player): number;
declare function DzAPI_Map_GetLadderRank(whichPlayer: player): number;
declare function DzAPI_Map_GetMapConfig(key: string): string;
declare function DzAPI_Map_GetMapLevel(whichPlayer: player): number;
declare function DzAPI_Map_GetMapLevelRank(whichPlayer: player): number;
declare function DzAPI_Map_GetMatchType(): number;
declare function DzAPI_Map_GetPlatformVIP(whichPlayer: player): number;
declare function DzAPI_Map_GetPublicArchive(whichPlayer: player, key: string): string;
declare function DzAPI_Map_GetServerArchiveDrop(whichPlayer: player, key: string): string;
declare function DzAPI_Map_GetServerArchiveEquip(whichPlayer: player, key: string): number;
declare function DzAPI_Map_GetServerValue(whichPlayer: player, key: string): string;
declare function DzAPI_Map_GetServerValueErrorCode(whichPlayer: player): number;
declare function DzAPI_Map_GetUserID(...option:any[]):any;
declare function DzAPI_Map_HasMallItem(whichPlayer: player, key: string): boolean;
declare function DzAPI_Map_IsBlueVIP(whichPlayer: player): boolean;
declare function DzAPI_Map_IsRPGLadder(): boolean;
declare function DzAPI_Map_IsRPGLobby(): boolean;
declare function DzAPI_Map_IsRedVIP(whichPlayer: player): boolean;
declare function DzAPI_Map_Ladder_SetPlayerStat(whichPlayer: player, key: string, value: string): void;
declare function DzAPI_Map_Ladder_SetStat(whichPlayer: player, key: string, value: string): void;
declare function DzAPI_Map_MissionComplete(whichPlayer: player, key: string, value: string): void;
declare function DzAPI_Map_OrpgTrigger(whichPlayer: player, key: string): void;
declare function DzAPI_Map_SavePublicArchive(whichPlayer: player, key: string, value: string): boolean;
declare function DzAPI_Map_SaveServerValue(whichPlayer: player, key: string, value: string): boolean;
declare function DzAPI_Map_Stat_SetStat(whichPlayer: player, key: string, value: string): void;
declare function DzAPI_Map_Statistics(...option:any[]):any;
declare function DzAPI_Map_ToggleStore(...option:any[]):any;
declare function DzAPI_Map_UpdatePlayerHero(...option:any[]):any;
declare function DzAPI_Map_UseConsumablesItem(whichPlayer: player, key: string): void;
declare function DzChangeTerrain(...option:any[]):any;

/**
 * 点击
 * 点击${frame}
 * 
 */
declare function DzClickFrame(frame: number): void;
declare function DzConvertWorldPosition(...option:any[]):any;

/**
 * 新建Frame
 * 新建Frame名字:${frame}父节点:${parent}ID:${Id}
 * 名字为fdf文件中的名字，ID默认填0。重复创建同名Frame会导致游戏退出时显示崩溃消息，如需避免可以使用Tag创建
 */
declare function DzCreateFrame(frame: string, parent: number, id: number): number;

/**
 * 新建Frame[Tag]
 * 创建类型:${type}名字:${frame}父节点:${parent}模版:${template}ID:${Id}
 * 此处名字可以自定义，类型和模版填写fdf文件中的内容。通过此函数创建的Frame无法获取到子Frame。
 */
declare function DzCreateFrameByTagName(frameType: string, name: string, parent: number, template: string, id: number): number;
declare function DzCreateSimpleFrame(frame: string, parent: number, id: number): number;

/**
 * 销毁
 * 销毁${frame}
 * 销毁一个被重复创建过的Frame会导致游戏崩溃，重复创建同名Frame请使用Tag创建
 */
declare function DzDestroyFrame(frame: number): void;

/**
 * 设置可破坏物位置[BZAPI]
 * 设置${可破坏物}的坐标为(${x},${y})
 * 
 */
declare function DzDestructablePosition(d: destructable, x: number, y: number): void;

/**
 * 原生-使用宽屏模式
 * 设置宽屏模式:${bool}
 * 
 */
declare function DzEnableWideScreen(enable: boolean): void;

/**
 * 异步执行函数
 * 异步执行函数${funcName}
 * 
 */
declare function DzExecuteFunc(funcName: string): void;

/**
 * 限制鼠标移动
 * 限制鼠标在${frame}内:${enable}
 * 
 */
declare function DzFrameCageMouse(frame: number, enable: boolean): void;

/**
 * 清空所有锚点
 * 清空${frame}的全部锚点
 * 
 */
declare function DzFrameClearAllPoints(frame: number): void;

/**
 * 原生-修改游戏渲染黑边范围
 * 修改游戏渲染黑边:上方高度:${upperHeight}下方高度:${bottomHeight}
 * 
 */
declare function DzFrameEditBlackBorders(upperHeight: number, bottomHeight: number): void;

/**
 * 获取子Frame
 * 获取名字为${name}的子FrameID:${Id}
 * ID默认填0，同名时优先获取最后被创建的。非Simple类的Frame类型都用此函数来获取子Frame。
 */
declare function DzFrameFindByName(name: string, id: number): number;

/**
 * 获取Frame的透明度(0-255)
 * 获取${Frame}的透明度
 * 
 */
declare function DzFrameGetAlpha(frame: number): number;

/**
 * 原生-玩家聊天信息框
 * 玩家聊天信息框
 * 
 */
declare function DzFrameGetChatMessage(): number;

/**
 * 原生-技能按钮
 * 技能按钮:(${row},${calumn})
 * 参考物编中的技能按钮(x,y)坐标
 */
declare function DzFrameGetCommandBarButton(row: number, column: number): number;

/**
 * 控件是否启用
 * ${frame}是否启用
 * 
 */
declare function DzFrameGetEnable(frame: number): boolean;

/**
 * 获取Frame的高度[NEW]
 * 获取${frame}的高度
 * 
 */
declare function DzFrameGetHeight(frame: number): number;

/**
 * 原生-英雄按钮
 * 英雄按钮:${buttnoid}
 * 左侧的英雄头像，参数表示第N+1个英雄，索引从0开始
 */
declare function DzFrameGetHeroBarButton(buttonId: number): number;

/**
 * 原生-英雄血条
 * 英雄血条:${buttnoid}
 * 左侧的英雄头像下的血条，参数表示第N+1个英雄，索引从0开始
 */
declare function DzFrameGetHeroHPBar(buttonId: number): number;

/**
 * 原生-英雄蓝条
 * 英雄蓝条:${buttnoid}
 * 左侧的英雄头像下的蓝条，参数表示第N+1个英雄，索引从0开始
 */
declare function DzFrameGetHeroManaBar(buttonId: number): number;

/**
 * 原生-物品栏按钮
 * 物品栏按钮:${buttnoid}
 * 索引从0开始
 */
declare function DzFrameGetItemBarButton(buttonId: number): number;

/**
 * 原生-小地图
 * 小地图
 * 
 */
declare function DzFrameGetMinimap(): number;

/**
 * 原生-小地图按钮
 * 小地图按钮:${buttnoid}
 * 小地图右侧竖排按钮，索引从0开始
 */
declare function DzFrameGetMinimapButton(buttonId: number): number;

/**
 * 获取Frame的名称[NEW]
 * 获取${frame}的名称
 * 
 */
declare function DzFrameGetName(frame: number): string;

/**
 * 获取Frame的Parent[NEW]
 * 获取${frame}的Parent
 * 
 */
declare function DzFrameGetParent(frame: number): number;

/**
 * 原生-单位大头像
 * 单位大头像
 * 小地图右侧的大头像
 */
declare function DzFrameGetPortrait(): number;

/**
 * 获取Frame内的文字
 * 获取${buttnoid}的文字
 * （支持EditBox,TextFrame,TextArea,SimpleFontString）
 */
declare function DzFrameGetText(frame: number): string;

/**
 * 获取Frame的字数限制
 * 获取${frame}的字数限制
 * （支持EditBox）
 */
declare function DzFrameGetTextSizeLimit(frame: number): number;

/**
 * 原生-鼠标提示
 * 鼠标提示
 * 鼠标移动到物品或技能按钮上显示的提示窗，初始位于技能栏上方
 */
declare function DzFrameGetTooltip(): number;

/**
 * 原生-上方消息框
 * 上方消息框
 * 高维修费用等消息
 */
declare function DzFrameGetTopMessage(): number;

/**
 * 原生-系统消息框
 * 系统消息框
 * 包含显示消息给玩家及显示Debug消息等，
 */
declare function DzFrameGetUnitMessage(): number;

/**
 * 原生-界面按钮
 * 界面按钮:${buttnoid}
 * 左上的菜单等按钮，索引从0开始
 */
declare function DzFrameGetUpperButtonBarButton(buttonId: number): number;

/**
 * 获取当前值
 * 获取${frame}当前值
 * （支持Slider、SimpleStatusBar、StatusBar）
 */
declare function DzFrameGetValue(frame: number): number;

/**
 * 原生-隐藏界面元素
 * 隐藏所有界面UI
 * 不再在地图初始化时调用则会残留小地图和时钟模型
 */
declare function DzFrameHideInterface(): void;

/**
 * 设置绝对位置
 * 设置${frame}的${Point}锚点在(${x},${y})
 * 
 */
declare function DzFrameSetAbsolutePoint(frame: number, point: number, x: number, y: number): void;

/**
 * 移动所有锚点到Frame
 * 移动${frame}的所有锚点到${frame}上
 * 
 */
declare function DzFrameSetAllPoints(frame: number, relativeFrame: number): boolean;

/**
 * 设置透明度(0-255)
 * 设置${frame}的透明度为${alpha}
 * 
 */
declare function DzFrameSetAlpha(frame: number, alpha: number): void;

/**
 * 设置动画
 * 设置${frame}播放序号${alpha}的动画自动播放:${autocast}
 * 
 */
declare function DzFrameSetAnimate(frame: number, animId: number, autocast: boolean): void;

/**
 * 设置动画进度
 * 设置${frame}的动画进度为:${offset}
 * 自动播放为false是可用
 */
declare function DzFrameSetAnimateOffset(frame: number, offset: number): void;

/**
 * 启用/禁用
 * 设置${frame}启用:${bottomHeight}
 * 
 */
declare function DzFrameSetEnable(name: number, enable: boolean): void;

/**
 * 设置焦点
 * 设置${frame}获取焦点${enable}
 * 
 */
declare function DzFrameSetFocus(frame: number, enable: boolean): boolean;

/**
 * 设置字体[NEW]
 * 设置${frame}的字体为${font},大小${height},flag${flag}
 * 支持EditBox、SimpleFontString、SimpleMessageFrame以及非SimpleFrame类型的例如TEXT，flag作用未知
 */
declare function DzFrameSetFont(frame: number, fileName: string, height: number, flag: number): void;

/**
 * 设置最大/最小值
 * 设置${frame}的最小值为${Min}最大值为${Max}
 * （支持Slider、SimpleStatusBar、StatusBar）
 */
declare function DzFrameSetMinMaxValue(frame: number, minValue: number, maxValue: number): void;

/**
 * 设置模型
 * 设置${frame}的模型文件为${modelFile}ModelType:${modelType}Flag:${flag}
 * 
 */
declare function DzFrameSetModel(frame: number, modelFile: string, modelType: number, flag: number): void;

/**
 * 设置父窗口[NEW]
 * 设置${frame}的父窗口为${frame2}
 * 
 */
declare function DzFrameSetParent(frame: number, parent: number): void;

/**
 * 设置相对位置
 * 设置${frame}的${Point}锚点(跟随Frame-->${relativeFrame}的${relativePoint}锚点)偏移(${x},${y})
 * 
 */
declare function DzFrameSetPoint(frame: number, point: number, relativeFrame: number, relativePoint: number, x: number, y: number): void;

/**
 * 设置优先级[NEW]
 * 设置${frame}优先级:${int}
 * 
 */
declare function DzFrameSetPriority(frame: number, priority: number): void;

/**
 * 设置缩放
 * 设置${frame}的缩放${scale}
 * 
 */
declare function DzFrameSetScale(frame: number, scale: number): void;

/**
 * 注册UI事件回调(funcname)
 * 注册${frame}的${事件类型}事件运行:${funcname}是否同步:${sync}
 * 
 */
declare function DzFrameSetScript(frame: number, eventId: number, func: string, sync: boolean): void;

/**
 * 注册UI事件回调(funchandle)
 * 注册${frame}的${事件类型}事件运行:${codehandle}是否同步:${sync}
 * 运行触发器时需要打开同步
 */
declare function DzFrameSetScriptByCode(frame: number, eventId: number, funcHandle: () => void, sync: boolean): void;

/**
 * 设置大小
 * 设置${frame}（宽${w}高${h}）
 * 
 */
declare function DzFrameSetSize(frame: number, w: number, h: number): void;

/**
 * 设置步进值
 * 设置${frame}的步进值为${step}
 * （支持Slider）
 */
declare function DzFrameSetStepValue(frame: number, step: number): void;

/**
 * 设置文本
 * 设置${frame}的文本为${string}
 * (支持EditBox,TextFrame,TextArea,SimpleFontString、GlueEditBoxWar3、SlashChatBox、TimerTextFrame、TextButtonFrame、GlueTextButton)
 */
declare function DzFrameSetText(frame: number, text: string): void;

/**
 * 设置对齐方式[NEW]
 * 设置${frame}的对齐方式为${align}
 * 支持TextFrame、SimpleFontString、SimpleMessageFrame
 */
declare function DzFrameSetTextAlignment(frame: number, align: number): void;
declare function DzFrameSetTextColor(frame: number, color: number): void;

/**
 * 设置字数限制
 * 设置${frame}的字数限制为${size}
 * 
 */
declare function DzFrameSetTextSizeLimit(frame: number, size: number): void;

/**
 * 设置贴图
 * 设置${frame}的贴图为:${texture}是否平铺${flag}
 * （支持Backdrop、SimpleStatusBar）
 */
declare function DzFrameSetTexture(frame: number, texture: string, flag: number): void;

/**
 * 设置提示
 * 设置${frame}的提示Frame为${tooltip}
 * 设置tooltip
 */
declare function DzFrameSetTooltip(frame: number, tooltip: number): void;
declare function DzFrameSetUpdateCallback(func: string): void;
declare function DzFrameSetUpdateCallbackByCode(funcHandle: () => void): void;

/**
 * 设置当前值
 * 设置${frame}的当前值为${value}
 * （支持Slider、SimpleStatusBar、StatusBar）
 */
declare function DzFrameSetValue(frame: number, value: number): void;

/**
 * 设置颜色
 * 设置${frame}颜色${color}
 * 
 */
declare function DzFrameSetVertexColor(frame: number, color: number): void;

/**
 * 显示/隐藏
 * 设置${frame}显示:${bottomHeight}
 * 
 */
declare function DzFrameShow(frame: number, enable: boolean): void;
declare function DzGetClientHeight(...option:any[]):any;
declare function DzGetClientWidth(...option:any[]):any;

/**
 * 取RGBA色值
 * 红色:${Red}绿色:${Green}蓝色:${Blue}透明度:${Alpha}
 * 返回一个整数，用于设置Frame颜色
 */
declare function DzGetColor(r: number, g: number, b: number, a: number): number;
declare function DzGetConvertWorldPositionX(...option:any[]):any;
declare function DzGetConvertWorldPositionY(...option:any[]):any;

/**
 * 原生-游戏UI
 * 游戏UI
 * 一般用作创建自定义UI的父节点
 */
declare function DzGetGameUI(): number;

/**
 * 获取客户端语言[NEW]
 * 获取客户端语言
 * 对不同语言客户端返回不同
 */
declare function DzGetLocale(): string;

/**
 * 鼠标所在的Frame控件指针
 * 鼠标所在的Frame控件指针
 * 不是所有类型的Frame都能响应鼠标，能响应的有BUTTON，TEXT等
 */
declare function DzGetMouseFocus(): number;

/**
 * 获取鼠标在游戏内的坐标X
 * 获取鼠标在游戏内的坐标X
 * 
 */
declare function DzGetMouseTerrainX(): number;

/**
 * 获取鼠标在游戏内的坐标Y
 * 获取鼠标在游戏内的坐标Y
 * 
 */
declare function DzGetMouseTerrainY(): number;

/**
 * 获取鼠标在游戏内的坐标Z
 * 获取鼠标在游戏内的坐标Z
 * 
 */
declare function DzGetMouseTerrainZ(): number;

/**
 * 获取鼠标在屏幕的坐标X
 * 获取鼠标在屏幕的坐标X
 * 
 */
declare function DzGetMouseX(): number;

/**
 * 获取鼠标游戏窗口坐标X
 * 获取鼠标游戏窗口坐标X
 * 
 */
declare function DzGetMouseXRelative(): number;

/**
 * 获取鼠标在屏幕的坐标Y
 * 获取鼠标在屏幕的坐标Y
 * 
 */
declare function DzGetMouseY(): number;

/**
 * 获取鼠标游戏窗口坐标Y
 * 获取鼠标游戏窗口坐标Y
 * 
 */
declare function DzGetMouseYRelative(): number;

/**
 * 事件响应-获取触发的按键
 * 获取触发的按键
 * 响应[硬件]-按键事件
 */
declare function DzGetTriggerKey(): number;

/**
 * 事件响应-获取触发硬件事件的玩家
 * 获取触发硬件事件的玩家
 * 响应[硬件]-按键事件滚轮事件窗口大小变化事件
 */
declare function DzGetTriggerKeyPlayer(): player;

/**
 * 事件响应-获取同步的数据
 * 获取同步的数据
 * 响应[同步]-同步消息事件
 */
declare function DzGetTriggerSyncData(): string;

/**
 * 事件响应-获取同步数据的玩家
 * 获取同步数据的玩家
 * 响应[同步]-同步消息事件
 */
declare function DzGetTriggerSyncPlayer(): player;

/**
 * 事件响应-触发的Frame
 * 触发的Frame
 * 
 */
declare function DzGetTriggerUIEventFrame(): number;

/**
 * 事件响应-获取触发ui的玩家
 * 获取触发ui的玩家
 * 
 */
declare function DzGetTriggerUIEventPlayer(): player;

/**
 * 获取升级所需经验[NEW]
 * 获取单位${unit}的${level}级升级所需经验
 * 
 */
declare function DzGetUnitNeededXP(whichUnit: unit, level: number): number;

/**
 * 获取鼠标指向的单位
 * 鼠标指向的单位
 * 
 */
declare function DzGetUnitUnderMouse(): unit;

/**
 * 事件响应-获取滚轮变化值
 * 获取滚轮变化值
 * 响应[硬件]-鼠标滚轮事件，正负区分上下
 */
declare function DzGetWheelDelta(): number;

/**
 * 获取魔兽窗口高度
 * 获取魔兽窗口高度
 * 
 */
declare function DzGetWindowHeight(): number;

/**
 * 获取war3窗口宽度
 * 获取魔兽窗口宽度
 * 
 */
declare function DzGetWindowWidth(): number;

/**
 * 获取魔兽窗口X坐标
 * 获取魔兽窗口X坐标
 * 
 */
declare function DzGetWindowX(): number;

/**
 * 获取魔兽窗口Y坐标
 * 获取魔兽窗口Y坐标
 * 
 */
declare function DzGetWindowY(): number;

/**
 * 判断按键是否按下
 * 判断${按键}是否按下
 * 
 */
declare function DzIsKeyDown(iKey: number): boolean;

/**
 * 鼠标是否在游戏内
 * 鼠标是否在游戏内
 * 
 */
declare function DzIsMouseOverUI(): boolean;

/**
 * 判断游戏窗口是否处于活动状态
 * 判断窗口是否处于活动状态
 * 
 */
declare function DzIsWindowActive(): boolean;

/**
 * 加载Toc文件列表
 * 加载-->${fileName.toc}
 * 载入自己的fdf列表文件
 */
declare function DzLoadToc(fileName: string): void;
declare function DzOriginalUIAutoResetPoint(enable: boolean): void;

/**
 * 原生-修改屏幕比例(FOV)
 * 修改屏幕比例(FOV):${val}
 * 
 */
declare function DzSetCustomFovFix(value: number): void;

/**
 * 设置内存数值
 * 设置内存数据${地址}=${数值}
 * 
 */
declare function DzSetMemory(address: number, value: number): void;

/**
 * 设置鼠标的坐标
 * 设置鼠标的坐标为(${x},${y})
 * 
 */
declare function DzSetMousePos(x: number, y: number): void;

/**
 * 替换单位类型[BZAPI]
 * 替换${单位}的单位类型为:${type}
 * 不会替换大头像中的模型
 */
declare function DzSetUnitID(whichUnit: unit, id: number): void;

/**
 * 替换单位模型[BZAPI]
 * 替换${单位}的模型:${path}
 * 不会替换大头像中的模型
 */
declare function DzSetUnitModel(whichUnit: unit, path: string): void;

/**
 * 设置单位位置-本地调用[BZAPI]
 * 设置${单位}的坐标为(${x},${y})
 * 
 */
declare function DzSetUnitPosition(whichUnit: unit, x: number, y: number): void;

/**
 * 替换单位贴图[BZAPI]
 * 替换${单位}的贴图:${path}TexId:${texId})
 * 只能替换模型中有ReplaceableIDx贴图的模型，ID为索引。不会替换大头像中的模型
 */
declare function DzSetUnitTexture(whichUnit: unit, path: string, texId: number): void;

/**
 * 原生-设置小地图背景贴图
 * 修改小地图背景贴图为${bottomHeight}
 * 
 */
declare function DzSetWar3MapMap(map: string): void;

/**
 * 获取子SimpleFontString
 * 获取名字为${name}的子SimpleFontStringID:${Id}
 * ID默认填0，同名时优先获取最后被创建的。SimpleFontString为fdf中的Frame类型。
 */
declare function DzSimpleFontStringFindByName(name: string, id: number): number;

/**
 * 获取子SimpleFrame
 * 获取名字为${name}的子SimpleFrameID:${Id}
 * ID默认填0，同名时优先获取最后被创建的。SimpleFrame为fdf中的Frame类型。
 */
declare function DzSimpleFrameFindByName(name: string, id: number): number;

/**
 * 获取子SimpleTexture
 * 获取名字为${name}的子SimpleTextureID:${Id}
 * ID默认填0，同名时优先获取最后被创建的。SimpleTexture为fdf中的Frame类型。
 */
declare function DzSimpleTextureFindByName(name: string, id: number): number;
declare function DzSyncBuffer(...option:any[]):any;

/**
 * 同步游戏数据
 * 同步标签：${prefix}发送数据：${data}
 * 
 */
declare function DzSyncData(prefix: string, data: string): void;
declare function DzSyncDataImmediately(...option:any[]):any;
declare function DzTriggerRegisterKeyEvent(trig: trigger, key: number, status: number, sync: boolean, func: string): void;
declare function DzTriggerRegisterKeyEventByCode(trig: trigger, key: number, status: number, sync: boolean, funcHandle: () => void): void;
declare function DzTriggerRegisterMouseEvent(trig: trigger, btn: number, status: number, sync: boolean, func: string): void;
declare function DzTriggerRegisterMouseEventByCode(trig: trigger, btn: number, status: number, sync: boolean, funcHandle: () => void): void;
declare function DzTriggerRegisterMouseMoveEvent(trig: trigger, sync: boolean, func: string): void;
declare function DzTriggerRegisterMouseMoveEventByCode(trig: trigger, sync: boolean, funcHandle: () => void): void;
declare function DzTriggerRegisterMouseWheelEvent(trig: trigger, sync: boolean, func: string): void;
declare function DzTriggerRegisterMouseWheelEventByCode(trig: trigger, sync: boolean, funcHandle: () => void): void;

/**
 * 数据同步
 * 标签为${prefix}的数据被同步|来自平台:${server}
 * 来自平台的参数填false
 */
declare function DzTriggerRegisterSyncData(trig: trigger, prefix: string, server: boolean): void;
declare function DzTriggerRegisterWindowResizeEvent(trig: trigger, sync: boolean, func: string): void;
declare function DzTriggerRegisterWindowResizeEventByCode(trig: trigger, sync: boolean, funcHandle: () => void): void;
declare function DzUnitDisableAttack(...option:any[]):any;
declare function DzUnitDisableInventory(...option:any[]):any;
declare function DzUnitSilence(...option:any[]):any;
declare function EXBlendButtonIcon(...option:any[]):any;
declare function EXDclareButtonIcon(...option:any[]):any;
declare function EXDisplayChat(p: player, chat_recipient: number, message: string): void;

/**
 * 重置变换[JAPI][New!]
 * 重置${特效}
 * 清空所有的旋转和缩放，重置为初始状态。
 */
declare function EXEffectMatReset(e: effect): void;

/**
 * 绕X轴旋转[JAPI][New!]
 * ${特效}绕X轴旋转${度}度
 * 多次调用，效果会叠加，不想叠加需要先重置为初始状态。
 */
declare function EXEffectMatRotateX(e: effect, angle: number): void;

/**
 * 绕Y轴旋转[JAPI][New!]
 * ${特效}绕Y轴旋转${度}度
 * 多次调用，效果会叠加，不想叠加需要先重置为初始状态。
 */
declare function EXEffectMatRotateY(e: effect, angle: number): void;

/**
 * 绕Z轴旋转[JAPI][New!]
 * ${特效}绕Z轴旋转${度}度
 * 多次调用，效果会叠加，不想叠加需要先重置为初始状态。
 */
declare function EXEffectMatRotateZ(e: effect, angle: number): void;

/**
 * 缩放[JAPI][New!]
 * 设置${特效}的X轴缩放[${缩放}]，Y轴缩放[${缩放}]，Z轴缩放[${缩放}]。
 * 多次调用，效果会叠加，不想叠加需要先重置为初始状态。设置为2,2,2时相当于大小变为2倍。设置为负数时，就是镜像翻转。
 */
declare function EXEffectMatScale(e: effect, x: number, y: number, z: number): void;
declare function EXExecuteScript(script: string): string;
declare function EXGetAbilityDataInteger(abil: ability, level: number, data_type: number): number;
declare function EXGetAbilityDataReal(abil: ability, level: number, data_type: number): number;
declare function EXGetAbilityDataString(abil: ability, level: number, data_type: number): string;
declare function EXGetAbilityId(abil: ability): number;
declare function EXGetAbilityState(abil: ability, state_type: number): number;
declare function EXGetAbilityString(...option:any[]):any;
declare function EXGetBuffDataString(buffcode: number, data_type: number): string;

/**
 * 大小[JAPI][New!]
 * ${特效}的大小
 * 
 */
declare function EXGetEffectSize(e: effect): number;

/**
 * X轴坐标[JAPI][New!]
 * ${特效}的X轴坐标
 * 
 */
declare function EXGetEffectX(e: effect): number;

/**
 * Y轴坐标[JAPI][New!]
 * ${特效}的Y轴坐标
 * 
 */
declare function EXGetEffectY(e: effect): number;

/**
 * 高度[JAPI][New!]
 * ${特效}的高度
 * 
 */
declare function EXGetEffectZ(e: effect): number;
declare function EXGetEventDamageData(edd_type: number): number;
declare function EXGetItemDataString(itemcode: number, data_type: number): string;
declare function EXGetUnitAbility(u: unit, abilcode: number): ability;
declare function EXGetUnitAbilityByIndex(u: unit, index: number): ability;
declare function EXGetUnitArrayString(...option:any[]):any;
declare function EXGetUnitInteger(...option:any[]):any;
declare function EXGetUnitReal(...option:any[]):any;
declare function EXGetUnitString(...option:any[]):any;
declare function EXPauseUnit(u: unit, flag: boolean): void;
declare function EXSetAbilityAEmeDataA(abil: ability, unitid: number): boolean;
declare function EXSetAbilityDataInteger(abil: ability, level: number, data_type: number, value: number): boolean;
declare function EXSetAbilityDataReal(abil: ability, level: number, data_type: number, value: number): boolean;
declare function EXSetAbilityDataString(abil: ability, level: number, data_type: number, value: string): boolean;
declare function EXSetAbilityState(abil: ability, state_type: number, value: number): boolean;
declare function EXSetAbilityString(...option:any[]):any;
declare function EXSetBuffDataString(buffcode: number, data_type: number, value: string): boolean;

/**
 * 设置大小[JAPI][New!]
 * 设置${特效}的大小为${大小}
 * 
 */
declare function EXSetEffectSize(e: effect, size: number): void;

/**
 * 设置动画速度[JAPI][New!]
 * 设置${特效}的动画速度为${动画速度}
 * 
 */
declare function EXSetEffectSpeed(e: effect, speed: number): void;

/**
 * 移动到坐标[JAPI][New!]
 * 移动${特效}到（${X},${Y}）
 * 
 */
declare function EXSetEffectXY(e: effect, x: number, y: number): void;

/**
 * 设置高度[JAPI][New!]
 * 设置${特效}的高度为${高度}
 * 
 */
declare function EXSetEffectZ(e: effect, z: number): void;
declare function EXSetEventDamage(amount: number): boolean;
declare function EXSetItemDataString(itemcode: number, data_type: number, value: string): boolean;
declare function EXSetUnitArrayString(...option:any[]):any;

/**
 * 设置单位的碰撞类型[JAPI][New!]
 * ${启用/禁用}${单位}对${碰撞}的碰撞
 * 
 */
declare function EXSetUnitCollisionType(enable: boolean, u: unit, t: number): void;

/**
 * 设置单位面向角度[JAPI][New!]
 * 设置${单位}的面向角度为${Angle}度
 * 立即转身
 */
declare function EXSetUnitFacing(u: unit, angle: number): void;
declare function EXSetUnitInteger(...option:any[]):any;

/**
 * 设置单位的移动类型[JAPI][New!]
 * 设置${单位}的移动类型为${Value}
 * 
 */
declare function EXSetUnitMoveType(u: unit, t: number): void;
declare function EXSetUnitReal(...option:any[]):any;
declare function EXSetUnitString(...option:any[]):any;

/**
 * 伤害值
 * 单位所受伤害
 * 响应'受到伤害'单位事件,指代单位所受伤害.
 */
declare function GetEventDamage(): number;

/**
 * 属性[R]
 * ${单位}的${Property}
 * 
 */
declare function GetUnitState(whichUnit: unit, whichUnitState: unitstate): number;
declare function RequestExtraBooleanData(dataType: number, whichPlayer: player, param1: string, param2: string, param3: boolean, param4: number, param5: number, param6: number): boolean;
declare function RequestExtraIntegerData(dataType: number, whichPlayer: player, param1: string, param2: string, param3: boolean, param4: number, param5: number, param6: number): number;
declare function RequestExtraRealData(dataType: number, whichPlayer: player, param1: string, param2: string, param3: boolean, param4: number, param5: number, param6: number): number;
declare function RequestExtraStringData(dataType: number, whichPlayer: player, param1: string, param2: string, param3: boolean, param4: number, param5: number, param6: number): string;

/**
 * 设置单位属性[R]
 * 设置${单位}的${属性}为${Value}
 * 
 */
declare function SetUnitState(whichUnit: unit, whichUnitState: unitstate, newVal: number): void;
