/** @noSelfInFile **/ 
declare function AbilityId(abilityIdString: string): number;
declare function AbilityId2String(abilityId: number): string;

/**
 * 反余弦(弧度)[R]
 * Acos(${数值})
 * 采用弧度制计算.返回弧度取值0—π.
 */
declare function Acos(x: number): number;

/**
 * 增加经验值[R]
 * 增加${Hero}${Quantity}点经验值,${Show/Hide}升级动画
 * 经验值不能倒退.
 */
declare function AddHeroXP(whichHero: unit, xpToAdd: number, showEyeCandy: boolean): void;
declare function AddIndicator(whichWidget: widget, red: number, green: number, blue: number, alpha: number): void;

/**
 * 添加物品(所有市场)
 * 添加${物品类型}到所有市场并设置库存量:${Count}最大库存量:${Max}
 * 影响所有拥有'出售物品'技能的单位.
 */
declare function AddItemToAllStock(itemId: number, currentStock: number, stockMax: number): void;
declare function AddItemToStock(whichUnit: unit, itemId: number, currentStock: number, stockMax: number): void;

/**
 * 新建闪电效果[R]
 * 新建闪电效果:${闪电效果}(${Boolean}检查可见性)起始点:(${X},${Y})终结点:(${X},${Y})
 * 会创建闪电效果.允许检查可见性则在起始点和终结点都不可见时将不创建闪电效果.
 */
declare function AddLightning(codeName: string, checkVisibility: boolean, x1: number, y1: number, x2: number, y2: number): lightning;

/**
 * 新建闪电效果(指定Z轴)[R]
 * 新建闪电效果:${闪电效果}(${Boolean}检查可见性)起始点:(${X},${Y},${Z})终结点:(${X},${Y},${Z})
 * 会创建闪电效果.允许检查可见性则在起始点和终结点都不可见时将不创建闪电效果.
 */
declare function AddLightningEx(codeName: string, checkVisibility: boolean, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): lightning;

/**
 * 增加科技等级
 * 增加${玩家}的${科技}科技${整数}级
 * 科技等级不能倒退。
 */
declare function AddPlayerTechResearched(whichPlayer: player, techid: number, levels: number): void;
declare function AddResourceAmount(whichUnit: unit, amount: number): void;

/**
 * 新建特效(创建到坐标)[R]
 * 新建特效${ModelFile}在(${X},${Y})处
 * 会创建特效.
 */
declare function AddSpecialEffect(modelName: string, x: number, y: number): effect;

/**
 * 新建特效(创建到点)[R]
 * 新建特效${ModelFile}在${指定点}处
 * 会创建特效.
 */
declare function AddSpecialEffectLoc(modelName: string, where: location): effect;

/**
 * 新建特效(创建到单位)[R]
 * 新建特效${ModelFile}并绑定到${单位}的${AttachmentPoint}附加点上
 * 会创建特效.
 */
declare function AddSpecialEffectTarget(modelName: string, targetWidget: widget, attachPointName: string): effect;
declare function AddSpellEffect(abilityString: string, t: effecttype, x: number, y: number): effect;

/**
 * 新建特效(指定技能，创建到坐标)[R]
 * ${技能}的${EffectType},创建到坐标(${X},${Y})
 * 会创建特效.
 */
declare function AddSpellEffectById(abilityId: number, t: effecttype, x: number, y: number): effect;

/**
 * 新建特效(指定技能，创建到点)[R]
 * ${技能}的${EffectType},创建到${指定点}
 * 会创建特效.
 */
declare function AddSpellEffectByIdLoc(abilityId: number, t: effecttype, where: location): effect;
declare function AddSpellEffectLoc(abilityString: string, t: effecttype, where: location): effect;
declare function AddSpellEffectTarget(modelName: string, t: effecttype, targetWidget: widget, attachPoint: string): effect;

/**
 * 新建特效(指定技能，创建到单位)[R]
 * ${技能}的${EffectType},绑定到${单位}的${String}附加点
 * 会创建特效.
 */
declare function AddSpellEffectTargetById(abilityId: number, t: effecttype, targetWidget: widget, attachPoint: string): effect;

/**
 * 添加/删除单位动画附加名[R]
 * 给${单位}附加动作${Tag},状态为${Add/Remove}
 * 比如恶魔猎手添加'alternate'会显示为恶魔形态;农民添加'gold'则为背负黄金形态.
 */
declare function AddUnitAnimationProperties(whichUnit: unit, animProperties: string, add: boolean): void;

/**
 * 添加单位(所有市场)
 * 添加${单位类型}到所有市场并设置库存量:${Count}最大库存量:${Max}
 * 影响所有拥有'出售单位'技能的单位.
 */
declare function AddUnitToAllStock(unitId: number, currentStock: number, stockMax: number): void;
declare function AddUnitToStock(whichUnit: unit, unitId: number, currentStock: number, stockMax: number): void;

/**
 * 新建天气效果[R]
 * 新建的在${矩形区域}的天气效果:${WeatherId}
 * 会创建天气效果.
 */
declare function AddWeatherEffect(where: rect, effectID: number): weathereffect;
declare function AdjustCameraField(whichField: camerafield, offset: number, duration: number): void;
declare function And(operandA: boolexpr | (() => boolean) | null, operandB: boolexpr | (() => boolean) | null): boolexpr;

/**
 * 反正弦(弧度)[R]
 * Asin(${数值})
 * 采用弧度制计算.返回弧度取值-π/2—π/2.
 */
declare function Asin(y: number): number;

/**
 * 反正切(弧度)[R]
 * Atan(${数值})
 * 采用弧度制计算.返回弧度取值-π/2—π/2.
 */
declare function Atan(x: number): number;

/**
 * 反正切(Y:X)(弧度)[R]
 * Atan(${Y}:${X})
 * 采用弧度制计算.返回弧度取值-π/2—π/2.
 */
declare function Atan2(y: number, x: number): number;
declare function AttachSoundToUnit(soundHandle: sound, whichUnit: unit): void;
declare function CachePlayerHeroData(whichPlayer: player): void;
declare function CameraSetSmoothingFactor(factor: number): void;
declare function CameraSetSourceNoise(mag: number, velocity: number): void;

/**
 * 摇晃镜头源(所有玩家)[R]
 * 摇晃玩家的镜头源,摇晃幅度:${Magnitude}速率:${Velocity}摇晃方式:${方式}
 * 使用'镜头-重置镜头'或设置摇晃幅度和速率为0来停止摇晃.
 */
declare function CameraSetSourceNoiseEx(mag: number, velocity: number, vertOnly: boolean): void;
declare function CameraSetTargetNoise(mag: number, velocity: number): void;

/**
 * 摇晃镜头目标(所有玩家)[R]
 * 摇晃玩家的镜头源,摇晃幅度:${Magnitude}速率:${Velocity}摇晃方式:${方式}
 * 使用'镜头-重置镜头'或设置摇晃幅度和速率为0来停止摇晃.
 */
declare function CameraSetTargetNoiseEx(mag: number, velocity: number, vertOnly: boolean): void;
declare function CameraSetupApply(whichSetup: camerasetup, doPan: boolean, panTimed: boolean): void;

/**
 * 应用镜头(所有玩家)(限时)[R]
 * 将${镜头}应用方式设置为${ApplyMethod},持续${Time}秒
 * 
 */
declare function CameraSetupApplyForceDuration(whichSetup: camerasetup, doPan: boolean, forceDuration: number): void;
declare function CameraSetupApplyForceDurationWithZ(whichSetup: camerasetup, zDestOffset: number, forceDuration: number): void;
declare function CameraSetupApplyWithZ(whichSetup: camerasetup, zDestOffset: number): void;

/**
 * 镜头目标点
 * ${镜头}的目标点
 * 会创建点.
 */
declare function CameraSetupGetDestPositionLoc(whichSetup: camerasetup): location;
declare function CameraSetupGetDestPositionX(whichSetup: camerasetup): number;
declare function CameraSetupGetDestPositionY(whichSetup: camerasetup): number;

/**
 * 镜头属性(指定镜头)[R]
 * ${镜头}的${CameraField}
 * 
 */
declare function CameraSetupGetField(whichSetup: camerasetup, whichField: camerafield): number;
declare function CameraSetupSetDestPosition(whichSetup: camerasetup, x: number, y: number, duration: number): void;
declare function CameraSetupSetField(whichSetup: camerasetup, whichField: camerafield, value: number, duration: number): void;

/**
 * 切换关卡[R]
 * 切换到关卡:${Filename}(${Show/Skip}计分屏)
 * 
 */
declare function ChangeLevel(newLevel: string, doScoreScreen: boolean): void;

/**
 * 输入作弊码[R]
 * 输入作弊码:${String}
 * 作弊码只在单机有效.
 */
declare function Cheat(cheatStr: string): void;
declare function ChooseRandomCreep(level: number): number;
declare function ChooseRandomItem(level: number): number;
declare function ChooseRandomItemEx(whichType: itemtype, level: number): number;
declare function ChooseRandomNPBuilding(): number;
declare function ClearMapMusic(): void;

/**
 * 清空选择(所有玩家)
 * 清空所有玩家的选择
 * 使玩家取消选择所有已选单位.
 */
declare function ClearSelection(): void;
declare function ClearStackedSound(...option:any[]):any;
declare function ClearStackedSoundRect(...option:any[]):any;

/**
 * 清空文本信息(所有玩家)[R]
 * 清空玩家屏幕上的文本信息
 * 
 */
declare function ClearTextMessages(): void;

/**
 * 发送AI命令
 * 对${Player}发送AI命令:(${命令},${数据})
 * 发送的AI命令将被AI脚本所使用.
 */
declare function CommandAI(num: player, command: number, data: number): void;
declare function Condition(func: () => boolean): conditionfunc;
declare function ConvertAIDifficulty(i: number): aidifficulty;
declare function ConvertAllianceType(i: number): alliancetype;
declare function ConvertAttackType(i: number): attacktype;
declare function ConvertBlendMode(i: number): blendmode;
declare function ConvertCameraField(i: number): camerafield;
declare function ConvertDamageType(i: number): damagetype;
declare function ConvertDialogEvent(i: number): dialogevent;
declare function ConvertEffectType(i: number): effecttype;
declare function ConvertFGameState(i: number): fgamestate;
declare function ConvertFogState(i: number): fogstate;
declare function ConvertGameDifficulty(i: number): gamedifficulty;
declare function ConvertGameEvent(i: number): gameevent;
declare function ConvertGameSpeed(i: number): gamespeed;
declare function ConvertGameType(i: number): gametype;
declare function ConvertIGameState(i: number): igamestate;
declare function ConvertItemType(i: number): itemtype;
declare function ConvertLimitOp(i: number): limitop;
declare function ConvertMapControl(i: number): mapcontrol;
declare function ConvertMapDensity(i: number): mapdensity;
declare function ConvertMapFlag(i: number): mapflag;
declare function ConvertMapSetting(i: number): mapsetting;
declare function ConvertMapVisibility(i: number): mapvisibility;
declare function ConvertPathingType(i: number): pathingtype;
declare function ConvertPlacement(i: number): placement;
declare function ConvertPlayerColor(i: number): playercolor;
declare function ConvertPlayerEvent(i: number): playerevent;
declare function ConvertPlayerGameResult(i: number): playergameresult;
declare function ConvertPlayerScore(i: number): playerscore;
declare function ConvertPlayerSlotState(i: number): playerslotstate;
declare function ConvertPlayerState(i: number): playerstate;
declare function ConvertPlayerUnitEvent(i: number): playerunitevent;
declare function ConvertRace(i: number): race;
declare function ConvertRacePref(i: number): racepreference;
declare function ConvertRarityControl(i: number): raritycontrol;
declare function ConvertSoundType(i: number): soundtype;
declare function ConvertStartLocPrio(i: number): startlocprio;
declare function ConvertTexMapFlags(i: number): texmapflags;
declare function ConvertUnitEvent(i: number): unitevent;
declare function ConvertUnitState(i: number): unitstate;
declare function ConvertUnitType(i: number): unittype;
declare function ConvertVersion(i: number): version;
declare function ConvertVolumeGroup(i: number): volumegroup;
declare function ConvertWeaponType(i: number): weapontype;
declare function ConvertWidgetEvent(i: number): widgetevent;
declare function CopySaveGame(sourceSaveName: string, destSaveName: string): boolean;

/**
 * 余弦(弧度)[R]
 * Cos(${Angle})
 * 采用弧度制计算.
 */
declare function Cos(radians: number): number;

/**
 * 新建不死族金矿[R]
 * 新建${玩家}的不死族金矿在(${X},${Y}),面向角度:${Face}度
 * 
 */
declare function CreateBlightedGoldmine(id: player, x: number, y: number, face: number): unit;
declare function CreateCameraSetup(): camerasetup;

/**
 * 新建尸体[R]
 * 新建${玩家}的${单位}的尸体在(${X},${Y}),面向角度:${Face}度
 * 
 */
declare function CreateCorpse(whichPlayer: player, unitid: number, x: number, y: number, face: number): unit;
declare function CreateDeadDestructable(objectid: number, x: number, y: number, face: number, scale: number, variation: number): destructable;

/**
 * 新建可破坏物(死亡的)[R]
 * 新建死亡的${可破坏物类型}在(${X},${Y},${Z\),面向角度:\}${Direction}尺寸缩放:${Scale}样式:${Variation}
 * 坐标为(X,Y,Z)格式.面向角度采用角度制,0度为正东方向,90度为正北方向.
 */
declare function CreateDeadDestructableZ(objectid: number, x: number, y: number, z: number, face: number, scale: number, variation: number): destructable;
declare function CreateDefeatCondition(): defeatcondition;
declare function CreateDestructable(objectid: number, x: number, y: number, face: number, scale: number, variation: number): destructable;

/**
 * 新建可破坏物[R]
 * 新建的${可破坏物类型}在(${X},${Y},${Z}),面向角度:${Direction}尺寸缩放:${Scale}样式:${Variation}
 * 坐标为(X,Y,Z)格式.面向角度采用角度制,0度为正东方向,90度为正北方向.
 */
declare function CreateDestructableZ(objectid: number, x: number, y: number, z: number, face: number, scale: number, variation: number): destructable;

/**
 * 新建可见度修正器(圆范围)[R]
 * 新建的${玩家}可见度修正器.可见度:${FogStateVisible}圆心坐标:(${X},${Y})半径:${数值}(对盟友${共享}视野,${覆盖}单位视野)
 * 会创建可见度修正器.
 */
declare function CreateFogModifierRadius(forWhichPlayer: player, whichState: fogstate, centerx: number, centerY: number, radius: number, useSharedVision: boolean, afterUnits: boolean): fogmodifier;
declare function CreateFogModifierRadiusLoc(forWhichPlayer: player, whichState: fogstate, center: location, radius: number, useSharedVision: boolean, afterUnits: boolean): fogmodifier;

/**
 * 新建可见度修正器(矩形区域)[R]
 * 新建的${玩家}可见度修正器.可见度:${FogStateVisible}影响区域:${矩形区域}(对盟友${共享}视野,${覆盖}单位视野)
 * 会创建可见度修正器.
 */
declare function CreateFogModifierRect(forWhichPlayer: player, whichState: fogstate, where: rect, useSharedVision: boolean, afterUnits: boolean): fogmodifier;

/**
 * 新建玩家组[R]
 * 新建空玩家组
 * 会创建玩家组.
 */
declare function CreateForce(): force;

/**
 * 新建的单位组[R]
 * 新建的空单位组
 * 会创建单位组.
 */
declare function CreateGroup(): group;

/**
 * 创建
 * 使用图像:${Image}大小:${Size}创建点:${指定点}Z轴偏移:${Z}图像类型:${Type}
 * 使用'图像-设置永久渲染状态'才能显示图像.创建点作为图像的左下角位置.该功能存在Bug,会在图像上和右面多出256象素.所以需要支持Alpha通道的图像且上和右面最后一行像素为透明才能完美显示.
 */
declare function CreateImage(file: string, sizeX: number, sizeY: number, sizeZ: number, posX: number, posY: number, posZ: number, originX: number, originY: number, originZ: number, imageType: number): image;

/**
 * 创建
 * 新建${物品}在(${X},${Y})
 * 
 */
declare function CreateItem(itemid: number, x: number, y: number): item;

/**
 * 新建物品池[R]
 * 新建的空物品池
 * 会创建物品池.
 */
declare function CreateItemPool(): itempool;

/**
 * 新建排行榜[R]
 * 新建的空排行榜
 * 会创建排行榜.
 */
declare function CreateLeaderboard(): leaderboard;
declare function CreateMIDISound(soundLabel: string, fadeInRate: number, fadeOutRate: number): sound;

/**
 * 创建
 * 创建一个列数为${Columns}行数为${Rows}标题为${文字}的多面板
 * 多面板不能在地图初始化时显示.
 */
declare function CreateMultiboard(): multiboard;

/**
 * 新建任务[R]
 * 新建任务
 * 新建一个任务.注：这条毫无用处，别用——everguo
 */
declare function CreateQuest(): quest;

/**
 * 新建区域[R]
 * 新建区域
 * 会创建一个新的不规则区域,如果不往该区域添加点或地区,则该区域无效果.
 */
declare function CreateRegion(): region;
declare function CreateSound(fileName: string, looping: boolean, is3D: boolean, stopwhenoutofrange: boolean, fadeInRate: number, fadeOutRate: number, eaxSetting: string): sound;
declare function CreateSoundFilenameWithLabel(fileName: string, looping: boolean, is3D: boolean, stopwhenoutofrange: boolean, fadeInRate: number, fadeOutRate: number, SLKEntryName: string): sound;
declare function CreateSoundFromLabel(soundLabel: string, looping: boolean, is3D: boolean, stopwhenoutofrange: boolean, fadeInRate: number, fadeOutRate: number): sound;

/**
 * 新建漂浮文字[R]
 * 新建的空漂浮文字
 * 会创建漂浮文字.
 */
declare function CreateTextTag(): texttag;

/**
 * 新建计时器[R]
 * 新建的计时器
 * 会创建计时器.
 */
declare function CreateTimer(): timer;

/**
 * 新建计时器窗口[R]
 * 为${计时器}新建计时窗口
 * 为一个计时器创建一个新建计时器窗口.
 */
declare function CreateTimerDialog(t: timer): timerdialog;

/**
 * 新建可追踪物[R]
 * 新建的可追踪物,使用模型:${模型名字}所在位置:(${X轴},${Y轴})面向角度:${数值}度
 * 可用来响应鼠标的移动和点击.会创建可追踪物.
 */
declare function CreateTrackable(trackableModelPath: string, x: number, y: number, facing: number): trackable;

/**
 * 新建触发[R]
 * 新建触发
 * 会创建一个新的触发器,如果对该功能不熟悉请慎用.
 */
declare function CreateTrigger(): trigger;

/**
 * 创建地面纹理变化
 * 创建一个地面纹理变化在${指定点},使用图像:${Type}颜色值:(${Red}%,${Green}%,${Blue}%)透明度${Transparency}%(${Enable/Disable}暂停状态,${Enble/Disable}跳过出生动画)
 * 颜色格式为(红,绿,蓝).透明度100%是不可见的.使用'地面纹理变化-设置永久渲染状态'来显示创建的纹理变化.暂停状态表示动画播放完毕后是否继续保留该纹理变化.
 */
declare function CreateUbersplat(x: number, y: number, name: string, red: number, green: number, blue: number, alpha: number, forcePaused: boolean, noBirthTime: boolean): ubersplat;

/**
 * 创建单位(指定坐标)[C]
 * 为玩家${玩家}创建一个${单位}在(X坐标:${输入坐标}Y坐标:${输入坐标}),面向角度:${facing}
 * 不能被'最后创建的单位'捕获之
 */
declare function CreateUnit(id: player, unitid: number, x: number, y: number, face: number): unit;

/**
 * 创建单位(指定点)[C]
 * 为玩家${玩家}创建一个${单位}在${指定点}面向角度:${Face}度
 * 不能被'最后创建的单位'捕获之
 */
declare function CreateUnitAtLoc(id: player, unitid: number, whichLocation: location, face: number): unit;
declare function CreateUnitAtLocByName(id: player, unitname: string, whichLocation: location, face: number): unit;
declare function CreateUnitByName(whichPlayer: player, unitname: string, x: number, y: number, face: number): unit;

/**
 * 新建单位池[R]
 * 新建的空单位池
 * 会创建单位池。
 */
declare function CreateUnitPool(): unitpool;
declare function CripplePlayer(whichPlayer: player, toWhichPlayers: force, flag: boolean): void;

/**
 * 降低技能等级[R]
 * 使${单位}的${技能}等级降低1级
 * 改变死亡单位的光环技能会导致魔兽崩溃.
 */
declare function DecUnitAbilityLevel(whichUnit: unit, abilcode: number): number;
declare function DefeatConditionSetDescription(whichCondition: defeatcondition, description: string): void;
declare function DefineStartLocation(whichStartLoc: number, x: number, y: number): void;
declare function DefineStartLocationLoc(whichStartLoc: number, whichLocation: location): void;

/**
 * 转换角度为弧度
 * 转换角度${Degrees}为弧度
 * 
 */
declare function Deg2Rad(degrees: number): number;
declare function DestroyBoolExpr(e: boolexpr | (() => boolean) | null): void;
declare function DestroyCondition(c: conditionfunc): void;
declare function DestroyDefeatCondition(whichCondition: defeatcondition): void;
declare function DestroyEffect(whichEffect: effect): void;
declare function DestroyFilter(f: filterfunc): void;

/**
 * 删除可见度修正器
 * 删除${VisibilityModifier}
 * 
 */
declare function DestroyFogModifier(whichFogModifier: fogmodifier): void;

/**
 * 删除玩家组[R]
 * 删除${玩家组}
 * 注意:不要删除系统预置的玩家组.
 */
declare function DestroyForce(whichForce: force): void;

/**
 * 删除单位组[R]
 * 删除${单位组}
 * 
 */
declare function DestroyGroup(whichGroup: group): void;

/**
 * 删除
 * 删除${图像}
 * 
 */
declare function DestroyImage(whichImage: image): void;

/**
 * 删除物品池[R]
 * 删除${物品池}
 * 
 */
declare function DestroyItemPool(whichItemPool: itempool): void;
declare function DestroyLeaderboard(lb: leaderboard): void;
declare function DestroyLightning(whichBolt: lightning): boolean;
declare function DestroyMultiboard(lb: multiboard): void;
declare function DestroyQuest(whichQuest: quest): void;
declare function DestroyTextTag(t: texttag): void;

/**
 * 删除计时器[R]
 * 删除${计时器}
 * 一般来说,计时器并不需要删除.只为某些有特别需求的用户提供.
 */
declare function DestroyTimer(whichTimer: timer): void;
declare function DestroyTimerDialog(whichDialog: timerdialog): void;

/**
 * 删除触发器[R]
 * 删除${触发器}
 * 对不再使用的触发器可以使用该动作来删除.
 */
declare function DestroyTrigger(whichTrigger: trigger): void;

/**
 * 删除地面纹理变化
 * 删除${Ubersplat}
 * 
 */
declare function DestroyUbersplat(whichSplat: ubersplat): void;

/**
 * 删除单位池[R]
 * 删除${单位池}
 * 
 */
declare function DestroyUnitPool(whichPool: unitpool): void;

/**
 * 复活
 * 复活${Destructible},设置生命值为${Value}并${Show/Hide}生长动画
 * 
 */
declare function DestructableRestoreLife(d: destructable, life: number, birth: boolean): void;

/**
 * 添加对话框按钮[R]
 * 给${对话框}添加按钮,使用标题:${文字}快捷键:${HotKey}
 * 会创建对话框按钮.
 */
declare function DialogAddButton(whichDialog: dialog, buttonText: string, hotkey: number): button;

/**
 * 添加退出游戏按钮[R]
 * 为${对话框}添加退出游戏按钮(${跳过}计分屏)按钮标题为:${文字}快捷键为:${HotKey}
 * 该函数创建的按钮并不被纪录到'最后创建的对话框按钮'.当该按钮被点击时会退出游戏
 */
declare function DialogAddQuitButton(whichDialog: dialog, doScoreScreen: boolean, buttonText: string, hotkey: number): button;
declare function DialogClear(whichDialog: dialog): void;

/**
 * 新建对话框[R]
 * 新建对话框
 * 创建新的对话框.
 */
declare function DialogCreate(): dialog;

/**
 * 删除[R]
 * 删除${对话框}
 * 将对话框清除出内存.一般来说对话框并不需要删除.
 */
declare function DialogDestroy(whichDialog: dialog): void;

/**
 * 显示/隐藏[R]
 * 对${Player}设置${对话框}的状态为${Show/Hide}
 * 对话框不能应用于地图初始化事件.
 */
declare function DialogDisplay(whichPlayer: player, whichDialog: dialog, flag: boolean): void;
declare function DialogSetAsync(...option:any[]):any;
declare function DialogSetMessage(whichDialog: dialog, messageText: string): void;

/**
 * 禁用重新开始任务按钮
 * 设置重新开始任务按钮可以点击为${}
 * 当单人游戏时，可以设置重新开始任务按钮能否允许点击。
 */
declare function DisableRestartMission(flag: boolean): void;

/**
 * 关闭触发
 * 关闭${Trigger}
 * 
 */
declare function DisableTrigger(whichTrigger: trigger): void;
declare function DisplayCineFilter(flag: boolean): void;
declare function DisplayLoadDialog(): void;

/**
 * 对玩家显示文本消息(自动限时)[R]
 * 对${玩家}在屏幕位移(${X},${Y})处显示文本:${文字}
 * 显示时间取决于文字长度.位移的取值在0-1之间.可使用'本地玩家'实现对所有玩家发送消息.
 */
declare function DisplayTextToPlayer(toPlayer: player, x: number, y: number, message: string): void;
declare function DisplayTimedTextFromPlayer(toPlayer: player, x: number, y: number, duration: number, message: string): void;

/**
 * 对玩家显示文本消息(指定时间)[R]
 * 对${玩家}在屏幕位移(${X},${Y})处显示${时间}秒的文本信息:${文字}
 * 位移的取值在0-1之间.可使用'本地玩家[R]'实现对所有玩家发送消息.
 */
declare function DisplayTimedTextToPlayer(toPlayer: player, x: number, y: number, duration: number, message: string): void;

/**
 * 关闭游戏录像功能[R]
 * 关闭游戏录像功能
 * 游戏结束时不保存游戏录像.
 */
declare function DoNotSaveReplay(): void;

/**
 * 允许/禁用框选
 * ${Enable/Disable}框选功能(${Enable/Disable}显示选择框)
 * 
 */
declare function EnableDragSelect(state: boolean, ui: boolean): void;

/**
 * 允许/禁用小地图按钮
 * ${Enable/Disable}联盟颜色显示按钮,${Enable/Disable}中立生物显示按钮
 * 
 */
declare function EnableMinimapFilterButtons(enableAlly: boolean, enableCreep: boolean): void;

/**
 * 允许/禁止闭塞(所有玩家)[R]
 * ${Enable/Disable}闭塞
 * 
 */
declare function EnableOcclusion(flag: boolean): void;

/**
 * 允许/禁用预选
 * ${Enable/Disable}预选功能(${Enable/Disable}显示预选圈,生命槽,物体信息)
 * 
 */
declare function EnablePreSelect(state: boolean, ui: boolean): void;

/**
 * 允许/禁用选择
 * ${Enable/Disable}选择和取消选择功能(${Enable/Disable}显示选择圈)
 * 禁用选择后仍可以通过触发来选择物体.只有允许选择功能时才会显示选择圈.
 */
declare function EnableSelect(state: boolean, ui: boolean): void;

/**
 * 开启触发
 * 开启${Trigger}
 * 
 */
declare function EnableTrigger(whichTrigger: trigger): void;

/**
 * 启用/禁用玩家控制权(所有玩家)[R]
 * ${启用/禁用}玩家控制权
 * 
 */
declare function EnableUserControl(b: boolean): void;
declare function EnableUserUI(b: boolean): void;

/**
 * 启用/禁用天气效果
 * 设置${WeatherEffect}的状态为:${On/Off}
 * 可以使用'环境-创建天气效果'动作来创建天气效果.
 */
declare function EnableWeatherEffect(whichEffect: weathereffect, enable: boolean): void;

/**
 * 允许/禁止边界染色(所有玩家)[R]
 * ${Enable/Disable}边界染色,应用于所有玩家
 * 禁用边界染色时边界为普通地形,不显示为黑色,但仍是不可通行的.
 */
declare function EnableWorldFogBoundary(b: boolean): void;
declare function EndCinematicScene(): void;
declare function EndGame(doScoreScreen: boolean): void;
declare function EndThematicMusic(): void;
declare function EnumDestructablesInRect(r: rect, filter: boolexpr | (() => boolean) | null, actionFunc: () => void): void;
declare function EnumItemsInRect(r: rect, filter: boolexpr | (() => boolean) | null, actionFunc: () => void): void;

/**
 * 运行函数[R]
 * 运行:${函数名}
 * 使用该功能运行的函数与触发独立,只能运行自定义无参数函数.
 */
declare function ExecuteFunc(funcName: string): void;
declare function Filter(func: () => boolean): filterfunc;

/**
 * 结束地面纹理变化
 * 结束${Ubersplat}
 * 在动画播放完毕时自动清除该地面纹理变化.
 */
declare function FinishUbersplat(whichSplat: ubersplat): void;
declare function FirstOfGroup(whichGroup: group): unit;
declare function FlashQuestDialogButton(): void;

/**
 * <1.24>清空哈希表主索引
 * <1.24>清空${Value}位于${Hashtable}之内
 * 清空哈希表主索引下的所有数据
 */
declare function FlushChildHashtable(table: hashtable, parentKey: number): void;
declare function FlushGameCache(cache: gamecache): void;
declare function FlushParentHashtable(table: hashtable): void;
declare function FlushStoredBoolean(cache: gamecache, missionKey: string, key: string): void;
declare function FlushStoredInteger(cache: gamecache, missionKey: string, key: string): void;

/**
 * 删除类别
 * 删除缓存${GameCache}中${Category}类别
 * 清空该类别下的所有缓存数据.
 */
declare function FlushStoredMission(cache: gamecache, missionKey: string): void;
declare function FlushStoredReal(cache: gamecache, missionKey: string, key: string): void;
declare function FlushStoredString(cache: gamecache, missionKey: string, key: string): void;
declare function FlushStoredUnit(cache: gamecache, missionKey: string, key: string): void;

/**
 * 启用/禁用战争迷雾[R]
 * ${启用/禁用}战争迷雾
 * 
 */
declare function FogEnable(enable: boolean): void;

/**
 * 启用/禁用黑色阴影[R]
 * ${启用/禁用}黑色阴影
 * 
 */
declare function FogMaskEnable(enable: boolean): void;

/**
 * 启用可见度修正器
 * 启用${VisibilityModifier}
 * 
 */
declare function FogModifierStart(whichFogModifier: fogmodifier): void;

/**
 * 禁用可见度修正器
 * 禁用${VisibilityModifier}
 * 
 */
declare function FogModifierStop(whichFogModifier: fogmodifier): void;

/**
 * 选取玩家组内玩家做动作
 * 选取${玩家组}内所有玩家${做动作}
 * 玩家组动作中可使用'选取玩家'来获取对应的玩家.等待不能在组动作中运行.
 */
declare function ForForce(whichForce: force, callback: () => void): void;
declare function ForGroup(whichGroup: group, callback: () => void): void;

/**
 * 添加玩家[R]
 * ${玩家组}添加${玩家}
 * 并不影响玩家本身.
 */
declare function ForceAddPlayer(whichForce: force, whichPlayer: player): void;
declare function ForceCampaignSelectScreen(): void;
declare function ForceCinematicSubtitles(flag: boolean): void;

/**
 * 清空玩家组
 * 清空${玩家组}内所有玩家
 * 并不影响玩家本身.
 */
declare function ForceClear(whichForce: force): void;
declare function ForceEnumAllies(whichForce: force, whichPlayer: player, filter: boolexpr | (() => boolean) | null): void;
declare function ForceEnumEnemies(whichForce: force, whichPlayer: player, filter: boolexpr | (() => boolean) | null): void;
declare function ForceEnumPlayers(whichForce: force, filter: boolexpr | (() => boolean) | null): void;
declare function ForceEnumPlayersCounted(whichForce: force, filter: boolexpr | (() => boolean) | null, countLimit: number): void;
declare function ForcePlayerStartLocation(whichPlayer: player, startLocIndex: number): void;
declare function ForceQuestDialogUpdate(): void;

/**
 * 移除玩家[R]
 * 从${玩家组}中移除${玩家}
 * 并不影响玩家本身.
 */
declare function ForceRemovePlayer(whichForce: force, whichPlayer: player): void;
declare function ForceUICancel(): void;
declare function ForceUIKey(key: string): void;

/**
 * 玩家的AI难度
 * ${Player}的对战AI难度
 * 对非AI玩家返回普通难度.
 */
declare function GetAIDifficulty(num: player): aidifficulty;
declare function GetAbilityEffect(abilityString: string, t: effecttype, index: number): string;
declare function GetAbilityEffectById(abilityId: number, t: effecttype, index: number): string;
declare function GetAbilitySound(abilityString: string, t: soundtype): string;
declare function GetAbilitySoundById(abilityId: number, t: soundtype): string;

/**
 * 联盟颜色显示设置
 * 联盟颜色显示设置
 * 0为不开启.1为小地图显示.2为小地图和游戏都显示.
 */
declare function GetAllyColorFilterState(): number;

/**
 * 攻击单位
 * 攻击单位
 * 响应'被攻击'单位事件.
 */
declare function GetAttacker(): unit;

/**
 * 购买者
 * 购买者
 * 响应'出售单位','出售物品'或'抵押物品'单位事件.
 */
declare function GetBuyingUnit(): unit;
declare function GetCameraBoundMaxX(): number;
declare function GetCameraBoundMaxY(): number;
declare function GetCameraBoundMinX(): number;
declare function GetCameraBoundMinY(): number;

/**
 * 当前镜头源位置
 * 当前镜头源位置
 * 会创建点.注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraEyePositionLoc(): location;

/**
 * 当前镜头源X坐标
 * 当前镜头源X坐标
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraEyePositionX(): number;

/**
 * 当前镜头源Y坐标
 * 当前镜头源Y坐标
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraEyePositionY(): number;

/**
 * 当前镜头源Z坐标
 * 当前镜头源Z坐标
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraEyePositionZ(): number;

/**
 * 镜头属性(当前镜头)
 * 当前镜头的${CameraField}
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraField(whichField: camerafield): number;
declare function GetCameraMargin(whichMargin: number): number;

/**
 * 当前镜头目标点
 * 当前镜头目标点
 * 会创建点.注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraTargetPositionLoc(): location;

/**
 * 当前镜头目标X坐标
 * 当前镜头目标X坐标
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraTargetPositionX(): number;

/**
 * 当前镜头目标Y坐标
 * 当前镜头目标Y坐标
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraTargetPositionY(): number;

/**
 * 当前镜头目标Z坐标
 * 当前镜头目标Z坐标
 * 注意:该函数对各玩家返回值不同,请确定你知道自己在做什么,否则很容易引起掉线.
 */
declare function GetCameraTargetPositionZ(): number;

/**
 * 被取消的建筑
 * 被取消的建筑
 * 响应'取消建造建筑'单位事件.
 */
declare function GetCancelledStructure(): unit;

/**
 * 被改变所有者的单位
 * 被改变所有者的单位
 * 响应'改变所有者'单位事件.
 */
declare function GetChangingUnit(): unit;

/**
 * 原所有者
 * 原所有者
 * 响应'改变所有者'单位事件,指代单位原来的所有者.
 */
declare function GetChangingUnitPrevOwner(): player;
declare function GetClickedButton(): button;
declare function GetClickedDialog(): dialog;

/**
 * 完成的建筑
 * 完成的建筑
 * 响应'完成建造建筑'单位事件.
 */
declare function GetConstructedStructure(): unit;

/**
 * 正在建造的建筑
 * 正在建造的建筑
 * 响应'开始建造建筑'单位事件.
 */
declare function GetConstructingStructure(): unit;
declare function GetCreatureDensity(): mapdensity;

/**
 * 小地图中立生物显示开启
 * 小地图中立生物显示开启
 * 
 */
declare function GetCreepCampFilterState(): boolean;
declare function GetCustomCampaignButtonVisible(whichButton: number): boolean;

/**
 * 腐化的单位
 * 腐化的单位
 * 响应'开始腐化'单位事件.
 */
declare function GetDecayingUnit(): unit;
declare function GetDefaultDifficulty(): gamedifficulty;

/**
 * 生命值
 * ${可破坏物}的当前生命值
 * 
 */
declare function GetDestructableLife(d: destructable): number;

/**
 * 最大生命值
 * ${可破坏物}的最大生命值
 * 
 */
declare function GetDestructableMaxLife(d: destructable): number;

/**
 * 物件名字
 * ${物件}的名字
 * 
 */
declare function GetDestructableName(d: destructable): string;

/**
 * 闭塞高度
 * ${可破坏物}的闭塞高度
 * 
 */
declare function GetDestructableOccluderHeight(d: destructable): number;

/**
 * 指定可破坏物的类型
 * ${可破坏物}的类型
 * 
 */
declare function GetDestructableTypeId(d: destructable): number;

/**
 * 可破坏物所在X轴坐标[R]
 * ${可破坏物}所在X轴坐标
 * 
 */
declare function GetDestructableX(d: destructable): number;
declare function GetDestructableY(d: destructable): number;
declare function GetDetectedUnit(): unit;

/**
 * 死亡单位
 * 死亡单位
 * 响应'死亡'单位事件.
 */
declare function GetDyingUnit(): unit;

/**
 * 进入的单位
 * 进入的单位
 * 响应'单位进入区域'单位事件.
 */
declare function GetEnteringUnit(): unit;

/**
 * 选取的可破坏物
 * 选取的可破坏物
 * 使用'选取可破坏物做动作'时,指代相应的可破坏物.
 */
declare function GetEnumDestructable(): destructable;

/**
 * 选取物品
 * 选取物品
 * 使用'选取物品做动作'时,指代相应的物品.
 */
declare function GetEnumItem(): item;

/**
 * 选取玩家
 * 选取玩家
 * 使用'选取玩家做动作'时,指代相应的玩家.
 */
declare function GetEnumPlayer(): player;

/**
 * 选取单位
 * 选取单位
 * 使用'选取单位做动作'时,指代相应的单位.
 */
declare function GetEnumUnit(): unit;

/**
 * 伤害值
 * 单位所受伤害
 * 响应'受到伤害'单位事件,指代单位所受伤害.
 */
declare function GetEventDamage(): number;

/**
 * 伤害来源
 * 伤害来源
 * 响应'受到伤害'单位事件.
 */
declare function GetEventDamageSource(): unit;
declare function GetEventDetectingPlayer(): player;
declare function GetEventGameState(): gamestate;

/**
 * 输入的聊天信息
 * 输入的聊天信息
 * 
 */
declare function GetEventPlayerChatString(): string;

/**
 * 匹配的聊天信息
 * 匹配的聊天信息
 * 
 */
declare function GetEventPlayerChatStringMatched(): string;
declare function GetEventPlayerState(): playerstate;

/**
 * 事件目标单位
 * 事件目标单位
 * 响应'注意到/获取攻击目标'单位事件,指代目标单位.
 */
declare function GetEventTargetUnit(): unit;
declare function GetEventUnitState(): unitstate;

/**
 * 到期的计时器
 * 到期的计时器
 * 响应'时间-计时器到期'事件.
 */
declare function GetExpiredTimer(): timer;

/**
 * 匹配的可破坏物
 * 匹配的可破坏物
 * 在'选取可破坏物满足条件'之类功能的条件中,指代被判断的可破坏物.
 */
declare function GetFilterDestructable(): destructable;

/**
 * 匹配物品
 * 匹配物品
 * 在'选取物品满足条件'之类功能的条件中,指代被判断单位.
 */
declare function GetFilterItem(): item;

/**
 * 匹配玩家
 * 匹配玩家
 * 在'选取玩家满足条件'之类功能的条件中,指代被判断玩家.
 */
declare function GetFilterPlayer(): player;

/**
 * 匹配单位
 * 匹配单位
 * 在'选取单位满足条件'之类功能的条件中,指代被判断单位.
 */
declare function GetFilterUnit(): unit;
declare function GetFloatGameState(whichFloatGameState: fgamestate): number;

/**
 * 单位提供人口数量(指定单位类型)
 * ${单位类型}提供的人口数量
 * 
 */
declare function GetFoodMade(unitId: number): number;

/**
 * 单位使用人口数量(指定单位类型)
 * ${单位类型}使用的人口数量
 * 
 */
declare function GetFoodUsed(unitId: number): number;

/**
 * 当前游戏难度
 * 当前游戏难度
 * 
 */
declare function GetGameDifficulty(): gamedifficulty;
declare function GetGamePlacement(): placement;

/**
 * 当前游戏速度
 * 当前游戏速度
 * 
 */
declare function GetGameSpeed(): gamespeed;
declare function GetGameTypeSelected(): gametype;

/**
 * <1.24>获取对象的h2i值
 * 转换${Handle}为整数
 * 创建一个对应该handle的临时密钥,可以在哈希表中作为索引号使用.当该handle被彻底销毁时,密钥会被回收.
 */
declare function GetHandleId(h: handle): number;

/**
 * 英雄敏捷[R]
 * ${英雄}的敏捷值(${Include/Exclude}加成)
 * 
 */
declare function GetHeroAgi(whichHero: unit, includeBonuses: boolean): number;

/**
 * 英雄智力[R]
 * ${英雄}的智力值(${Include/Exclude}加成)
 * 
 */
declare function GetHeroInt(whichHero: unit, includeBonuses: boolean): number;

/**
 * 英雄等级
 * ${英雄}的英雄等级
 * 
 */
declare function GetHeroLevel(whichHero: unit): number;

/**
 * 英雄称谓
 * ${Hero}的称谓
 * 如圣骑士会返回'无惧的布赞恩'而不是'圣骑士'.
 */
declare function GetHeroProperName(whichHero: unit): string;

/**
 * 未分配技能点数
 * ${英雄}的未分配技能点数
 * 
 */
declare function GetHeroSkillPoints(whichHero: unit): number;

/**
 * 英雄力量[R]
 * ${英雄}的力量值(${Include/Exclude}加成)
 * 
 */
declare function GetHeroStr(whichHero: unit, includeBonuses: boolean): number;

/**
 * 英雄经验值
 * ${英雄}的经验值
 * 
 */
declare function GetHeroXP(whichHero: unit): number;
declare function GetIntegerGameState(whichIntegerGameState: igamestate): number;
declare function GetIssuedOrderId(): number;

/**
 * 使用次数
 * ${物品}的使用次数
 * 无限使用物品将返回0.
 */
declare function GetItemCharges(whichItem: item): number;

/**
 * 物品等级
 * ${物品}的物品等级
 * 
 */
declare function GetItemLevel(whichItem: item): number;

/**
 * 物品名字
 * ${物品}的名字
 * 
 */
declare function GetItemName(whichItem: item): string;

/**
 * 物品所属玩家
 * ${物品}的所属玩家
 * 与持有者无关,默认为中立被动玩家.
 */
declare function GetItemPlayer(whichItem: item): player;

/**
 * 指定物品的分类
 * ${物品}的分类
 * 
 */
declare function GetItemType(whichItem: item): itemtype;

/**
 * 指定物品的类型
 * ${物品}的类型
 * 
 */
declare function GetItemTypeId(i: item): number;

/**
 * 物品自定义值
 * ${物品}的自定义值
 * 可以使用'物品-设置自定义值'来设置该值.
 */
declare function GetItemUserData(whichItem: item): number;

/**
 * 物品的X轴坐标[R]
 * ${物品}的X轴坐标
 * 
 */
declare function GetItemX(i: item): number;

/**
 * 物品的Y轴坐标[R]
 * ${物品}的Y轴坐标
 * 
 */
declare function GetItemY(i: item): number;
declare function GetKillingUnit(): unit;

/**
 * 学习技能[R]
 * 学习技能
 * 响应'学习技能'单位事件,指代被学习的技能.
 */
declare function GetLearnedSkill(): number;

/**
 * 学习技能等级
 * 学习技能等级
 * 响应'学习技能'单位事件,指代被学习技能的等级.注意,该值为学习后的等级.
 */
declare function GetLearnedSkillLevel(): number;

/**
 * 学习技能的英雄
 * 学习技能的英雄
 * 响应'学习技能'单位事件.
 */
declare function GetLearningUnit(): unit;

/**
 * 离开的单位
 * 离开的单位
 * 响应'单位离开区域'单位事件.
 */
declare function GetLeavingUnit(): unit;

/**
 * 升级的英雄
 * 升级的英雄
 * 响应'提升等级'单位事件.
 */
declare function GetLevelingUnit(): unit;
declare function GetLightningColorA(whichBolt: lightning): number;
declare function GetLightningColorB(whichBolt: lightning): number;
declare function GetLightningColorG(whichBolt: lightning): number;
declare function GetLightningColorR(whichBolt: lightning): number;
declare function GetLoadedUnit(): unit;

/**
 * 本地玩家[R]
 * 本地玩家
 * 指代玩家自己,所以对每个玩家返回值都不一样.如果不清楚该函数的话千万别用,因为很可能因为不同步而导致掉线.
 */
declare function GetLocalPlayer(): player;

/**
 * 本地热键
 * 本地热键:${文字}
 * 获取ui\\miscui.txt中定义的热键.
 */
declare function GetLocalizedHotkey(source: string): number;

/**
 * 本地字符串[R]
 * 本地字符串:${文字}
 * 获取ui\\framedef\\globalstrings.fdf中定义的字符串.
 */
declare function GetLocalizedString(source: string): string;

/**
 * 点的X轴坐标
 * ${点}的X轴坐标
 * 
 */
declare function GetLocationX(whichLocation: location): number;

/**
 * 点的Y轴坐标
 * ${点}的Y轴坐标
 * 
 */
declare function GetLocationY(whichLocation: location): number;

/**
 * 点的Z轴高度[R]
 * ${点}的Z轴高度
 * 
 */
declare function GetLocationZ(whichLocation: location): number;

/**
 * 被操作物品
 * 被操作物品
 * 响应'使用/得到/丢弃物品'单位事件.
 */
declare function GetManipulatedItem(): item;

/**
 * 操作物品的单位
 * 操作物品的单位
 * 响应'使用/获得/丢失物品'单位事件.
 */
declare function GetManipulatingUnit(): unit;

/**
 * 物体名称[C]
 * ${物体ID}的名称
 * 如'A01Z',物体编辑器中物体的名字
 */
declare function GetObjectName(objectId: number): string;

/**
 * 命令发布点
 * 命令发布点
 * 响应'发布指定点目标命令'单位事件.会创建点.
 */
declare function GetOrderPointLoc(): location;

/**
 * 命令发布点X坐标[R]
 * 命令发布点X坐标
 * 用坐标代替点可以省去创建、删除点的麻烦.
 */
declare function GetOrderPointX(): number;

/**
 * 命令发布点Y坐标[R]
 * 命令发布点Y坐标
 * 用坐标代替点可以省去创建、删除点的麻烦.
 */
declare function GetOrderPointY(): number;
declare function GetOrderTarget(): widget;

/**
 * 命令发布目标(可破坏物)
 * 命令发布目标
 * 响应'发布指定物体目标命令'单位事件并以可破坏物为目标时.
 */
declare function GetOrderTargetDestructable(): destructable;

/**
 * 命令发布目标
 * 命令发布目标
 * 响应'发布指定物体目标命令'单位事件并以物品为目标时.
 */
declare function GetOrderTargetItem(): item;

/**
 * 命令发布目标
 * 命令发布目标
 * 响应'发布指定物体目标命令'单位事件并以单位为目标时.
 */
declare function GetOrderTargetUnit(): unit;

/**
 * 发布命令的单位
 * 发布命令的单位
 * 响应'发布命令'单位事件.
 */
declare function GetOrderedUnit(): unit;

/**
 * 单位所有者
 * ${单位}的所有者
 * 
 */
declare function GetOwningPlayer(whichUnit: unit): player;

/**
 * 联盟状态设置
 * ${Player}对${Player}开启${AllianceType}
 * 
 */
declare function GetPlayerAlliance(sourcePlayer: player, otherPlayer: player, whichAllianceSetting: alliancetype): boolean;

/**
 * 玩家颜色
 * ${Player}的颜色
 * 
 */
declare function GetPlayerColor(whichPlayer: player): playercolor;

/**
 * 玩家控制者
 * ${Player}的控制者
 * 
 */
declare function GetPlayerController(whichPlayer: player): mapcontrol;
declare function GetPlayerHandicap(whichPlayer: player): number;
declare function GetPlayerHandicapXP(whichPlayer: player): number;

/**
 * 玩家ID-1[R]
 * ${Player}的玩家ID-1
 * 玩家ID取值1-16.
 */
declare function GetPlayerId(whichPlayer: player): number;

/**
 * 玩家名字
 * ${Player}的名字
 * 
 */
declare function GetPlayerName(whichPlayer: player): string;

/**
 * 玩家的种族
 * ${Player}的种族
 * 
 */
declare function GetPlayerRace(whichPlayer: player): race;

/**
 * 玩家得分
 * ${Player}${Score}
 * 
 */
declare function GetPlayerScore(whichPlayer: player, whichPlayerScore: playerscore): number;
declare function GetPlayerSelectable(whichPlayer: player): boolean;

/**
 * 玩家游戏状态
 * ${Player}的游戏状态
 * 
 */
declare function GetPlayerSlotState(whichPlayer: player): playerslotstate;
declare function GetPlayerStartLocation(whichPlayer: player): number;
declare function GetPlayerStartLocationX(whichPlayer: player): number;
declare function GetPlayerStartLocationY(whichPlayer: player): number;

/**
 * 玩家属性
 * ${Player}${Property}
 * 
 */
declare function GetPlayerState(whichPlayer: player, whichPlayerState: playerstate): number;

/**
 * 建筑数量
 * ${Player}拥有的建筑数量(${Include/Exclude}未完成的)
 * 
 */
declare function GetPlayerStructureCount(whichPlayer: player, includeIncomplete: boolean): number;

/**
 * 玩家税率
 * ${Resource}所得税,${Player}交纳给${Player}
 * 所得税取值范围0-100.
 */
declare function GetPlayerTaxRate(sourcePlayer: player, otherPlayer: player, whichResource: playerstate): number;

/**
 * 玩家队伍
 * ${Player}所属队伍编号
 * 
 */
declare function GetPlayerTeam(whichPlayer: player): number;
declare function GetPlayerTechCount(whichPlayer: player, techid: number, specificonly: boolean): number;
declare function GetPlayerTechMaxAllowed(whichPlayer: player, techid: number): number;
declare function GetPlayerTechResearched(whichPlayer: player, techid: number, specificonly: boolean): boolean;
declare function GetPlayerTypedUnitCount(whichPlayer: player, unitName: string, includeIncomplete: boolean, includeUpgrades: boolean): number;

/**
 * 非建筑单位数量
 * ${Player}拥有的非建筑单位数量(${Include/Exclude}未完成的)
 * 
 */
declare function GetPlayerUnitCount(whichPlayer: player, includeIncomplete: boolean): number;

/**
 * 玩家数量
 * 玩家数量
 * 地图编辑器中开启的玩家数量(1-12).
 */
declare function GetPlayers(): number;

/**
 * 随机整数
 * 随机整数,最小值:${Minimum}最大值:${Maximum}
 * 
 */
declare function GetRandomInt(lowBound: number, highBound: number): number;

/**
 * 随机实数
 * 随机实数,最小值:${Minimum}最大值:${Maximum}
 * 
 */
declare function GetRandomReal(lowBound: number, highBound: number): number;

/**
 * 中心X坐标
 * ${矩形区域}的中心X坐标
 * 
 */
declare function GetRectCenterX(whichRect: rect): number;

/**
 * 中心Y坐标
 * ${矩形区域}的中心Y坐标
 * 
 */
declare function GetRectCenterY(whichRect: rect): number;

/**
 * 右上角X坐标
 * ${矩形区域}的右上角X坐标
 * 
 */
declare function GetRectMaxX(whichRect: rect): number;

/**
 * 右上角Y坐标
 * ${矩形区域}的右上角Y坐标
 * 
 */
declare function GetRectMaxY(whichRect: rect): number;

/**
 * 左下角X坐标
 * ${矩形区域}的左下角X坐标
 * 
 */
declare function GetRectMinX(whichRect: rect): number;

/**
 * 左下角Y坐标
 * ${矩形区域}的左下角Y坐标
 * 
 */
declare function GetRectMinY(whichRect: rect): number;
declare function GetRescuer(): unit;

/**
 * 被研究科技
 * 被研究科技
 * 响应'开始/取消/完成科技研究'单位事件.
 */
declare function GetResearched(): number;

/**
 * 研究科技的单位
 * 研究科技的单位
 * 响应'开始/取消/完成科技研究'单位事件.
 */
declare function GetResearchingUnit(): unit;

/**
 * 储金量
 * ${金矿}的储金量
 * 只对金矿有效.
 */
declare function GetResourceAmount(whichUnit: unit): number;
declare function GetResourceDensity(): mapdensity;

/**
 * 可复活英雄
 * 可复活英雄
 * 响应'变为可复活的'单位事件.
 */
declare function GetRevivableUnit(): unit;

/**
 * 复活英雄
 * 复活英雄
 * 响应'开始/取消/完成复活'单位事件.
 */
declare function GetRevivingUnit(): unit;

/**
 * 存档文件名
 * 存档文件名
 * 响应'游戏-保存进度'事件.
 */
declare function GetSaveBasicFilename(): string;

/**
 * 贩卖者
 * 贩卖者
 * 响应'出售单位','出售物品'或'抵押物品'单位事件.
 */
declare function GetSellingUnit(): unit;

/**
 * 被售出物品
 * 被售出物品
 * 响应'出售物品'或'抵押物品'单位事件.
 */
declare function GetSoldItem(): item;

/**
 * 被贩卖单位
 * 被贩卖单位
 * 响应'出售单位'单位事件.
 */
declare function GetSoldUnit(): unit;
declare function GetSoundDuration(soundHandle: sound): number;
declare function GetSoundFileDuration(musicFileName: string): number;
declare function GetSoundIsLoading(soundHandle: sound): boolean;
declare function GetSoundIsPlaying(soundHandle: sound): boolean;
declare function GetSpellAbility(): ability;

/**
 * 施放技能
 * 施放技能
 * 响应施放技能单位事件,指代被施放的技能.
 */
declare function GetSpellAbilityId(): number;

/**
 * 施法单位
 * 施法单位
 * 响应'施放技能'单位事件.
 */
declare function GetSpellAbilityUnit(): unit;

/**
 * 技能施放目标(可破坏物)
 * 技能施放目标
 * 响应'施放技能'单位事件并以可破坏物为目标时.注意:技能施放结束将无法捕获施放目标.
 */
declare function GetSpellTargetDestructable(): destructable;

/**
 * 技能施放目标
 * 技能施放目标
 * 响应施放技能单位事件并以物品为目标时.注意:技能施放结束将无法捕获施放目标.
 */
declare function GetSpellTargetItem(): item;

/**
 * 技能施放点
 * 技能施放点
 * 响应'技能施放'单位事件.注意技能施放结束将无法捕获该点.会创建点.
 */
declare function GetSpellTargetLoc(): location;

/**
 * 技能施放目标
 * 技能施放目标
 * 响应'施放技能'单位事件并以单位为目标时.注意:技能施放结束将无法捕获施放目标.
 */
declare function GetSpellTargetUnit(): unit;

/**
 * 技能施放点X坐标
 * 获取技能目标点的X坐标
 * 这是1.24的函数，但已加入函数库，在1.20也可以使用。
 */
declare function GetSpellTargetX(): number;

/**
 * 技能施放点Y坐标
 * 获取技能目标点的Y坐标
 * 这是1.24的函数，但已加入函数库，在1.20也可以使用。
 */
declare function GetSpellTargetY(): number;
declare function GetStartLocPrio(whichStartLoc: number, prioSlotIndex: number): startlocprio;
declare function GetStartLocPrioSlot(whichStartLoc: number, prioSlotIndex: number): number;
declare function GetStartLocationLoc(whichStartLocation: number): location;
declare function GetStartLocationX(whichStartLocation: number): number;
declare function GetStartLocationY(whichStartLocation: number): number;

/**
 * 读取布尔值[R]
 * 从${GameCache}中读取布尔值,类别:${Category},名称:${文字}
 * 如果该值不存在则返回false.
 */
declare function GetStoredBoolean(cache: gamecache, missionKey: string, key: string): boolean;

/**
 * 缓存读取整数[C]
 * 从${GameCache}中读取整数值,类别:${Category},名称:${文字}
 * 如果该值不存在则返回0.
 */
declare function GetStoredInteger(cache: gamecache, missionKey: string, key: string): number;

/**
 * 缓存读取实数[C]
 * 从${GameCache}中读取实数,类别:${Category}名称:${文字}
 * 如果该值不存在则返回0.
 */
declare function GetStoredReal(cache: gamecache, missionKey: string, key: string): number;

/**
 * 读取字符串[C]
 * 从${GameCache}中读取字符串,类别:${Category}名称:${文字}
 * 如果该值不存在,则返回空字符串.注意,空字符串不等于null
 */
declare function GetStoredString(cache: gamecache, missionKey: string, key: string): string;

/**
 * 召唤单位
 * 召唤单位
 * 响应'召唤单位'单位事件,指代被召唤单位.
 */
declare function GetSummonedUnit(): unit;

/**
 * 召唤者
 * 召唤者
 * 响应'召唤单位'单位事件.
 */
declare function GetSummoningUnit(): unit;

/**
 * 队伍数量
 * 队伍数量
 * 
 */
declare function GetTeams(): number;

/**
 * 地形悬崖高度(指定坐标)[R]
 * 坐标(${X},${Y})处的地形悬崖高度
 * 悬崖高度:深水区为0,浅水区为1,平原为2,之后每层+1.
 */
declare function GetTerrainCliffLevel(x: number, y: number): number;

/**
 * 指定点地形
 * ${指定点}处的地形
 * 
 */
declare function GetTerrainType(x: number, y: number): number;

/**
 * 地形样式(指定点)
 * ${指定点}处的地形样式
 * 
 */
declare function GetTerrainVariance(x: number, y: number): number;
declare function GetTimeOfDayScale(): number;
declare function GetTournamentFinishNowPlayer(): player;

/**
 * 比赛结束规则
 * 比赛结束规则
 * 1表示游戏开始时间已经超过限定时,无法以平局结束.其他值表示游戏还在初期阶段,此时退出游戏将以平局结束..
 */
declare function GetTournamentFinishNowRule(): number;

/**
 * 比赛剩余时间
 * 比赛剩余时间
 * 响应'比赛事件'游戏将要结束.单位为秒.
 */
declare function GetTournamentFinishSoonTimeRemaining(): number;

/**
 * 对战比赛得分
 * ${Player}的当前对战比赛得分
 * 对战游戏时如果游戏时间过长,系统将以该值来决定胜负.
 */
declare function GetTournamentScore(whichPlayer: player): number;

/**
 * 训练单位
 * 训练单位
 * 响应'完成训练单位'单位事件,指代被训练单位.
 */
declare function GetTrainedUnit(): unit;

/**
 * 训练单位类型
 * 训练单位类型
 * 响应'开始/取消/完成训练单位'单位事件,指代所训练的单位类型.
 */
declare function GetTrainedUnitType(): number;
declare function GetTransportUnit(): unit;
declare function GetTriggerDestructable(): destructable;

/**
 * 触发条件判断次数
 * ${Trigger}的触发条件判断次数
 * 
 */
declare function GetTriggerEvalCount(whichTrigger: trigger): number;
declare function GetTriggerEventId(): eventid;

/**
 * 触发动作运行次数
 * ${Trigger}的触发动作运行次数
 * 
 */
declare function GetTriggerExecCount(whichTrigger: trigger): number;

/**
 * 触发玩家
 * 触发玩家
 * 
 */
declare function GetTriggerPlayer(): player;

/**
 * 触发单位
 * 触发单位
 * 
 */
declare function GetTriggerUnit(): unit;
declare function GetTriggerWidget(): widget;

/**
 * 触发区域[R]
 * 触发区域
 * 响应单位进入/离开不规则区域事件.
 */
declare function GetTriggeringRegion(): region;

/**
 * 事件响应-触发可追踪物[R]
 * 事件响应-触发可追踪物
 * 
 */
declare function GetTriggeringTrackable(): trackable;

/**
 * 当前触发
 * 当前触发
 * 当前所运行的触发器.
 */
declare function GetTriggeringTrigger(): trigger;

/**
 * 单位技能等级[R]
 * ${单位}的${技能}技能等级
 * 如果单位没有该技能,则返回0.
 */
declare function GetUnitAbilityLevel(whichUnit: unit, abilcode: number): number;

/**
 * 当前主动攻击范围
 * ${单位}的当前主动攻击范围
 * 
 */
declare function GetUnitAcquireRange(whichUnit: unit): number;

/**
 * 当前命令ID
 * ${单位}的当前命令ID.
 * 
 */
declare function GetUnitCurrentOrder(whichUnit: unit): number;

/**
 * 默认主动攻击范围
 * ${单位}的默认主动攻击范围
 * 
 */
declare function GetUnitDefaultAcquireRange(whichUnit: unit): number;

/**
 * 默认飞行高度
 * ${单位}的默认飞行高度
 * 飞行单位可以直接改变飞行高度.其他单位通过添加/删除替换为飞行单位的变身技能(如乌鸦形态)之后,也能改变飞行高度.
 */
declare function GetUnitDefaultFlyHeight(whichUnit: unit): number;

/**
 * 默认移动速度
 * ${单位}的默认移动速度
 * 
 */
declare function GetUnitDefaultMoveSpeed(whichUnit: unit): number;
declare function GetUnitDefaultPropWindow(whichUnit: unit): number;

/**
 * 默认转身速度
 * ${单位}的默认转身速度
 * 转身速度表示单位改变面向方向时的速度.数值越小表示转身越慢.
 */
declare function GetUnitDefaultTurnSpeed(whichUnit: unit): number;

/**
 * 面向角度
 * ${单位}的面向角度
 * 采用角度制.0度为正东方向,90度为正北方向.
 */
declare function GetUnitFacing(whichUnit: unit): number;

/**
 * 当前飞行高度
 * ${单位}的当前飞行高度
 * 飞行单位可以直接改变飞行高度.其他单位通过添加/删除替换为飞行单位的变身技能(如乌鸦形态)之后,也能改变飞行高度.
 */
declare function GetUnitFlyHeight(whichUnit: unit): number;

/**
 * 单位提供人口数量
 * ${单位}提供的人口数量
 * 
 */
declare function GetUnitFoodMade(whichUnit: unit): number;

/**
 * 单位使用人口数量
 * ${单位}使用的人口数量
 * 
 */
declare function GetUnitFoodUsed(whichUnit: unit): number;

/**
 * 单位等级
 * ${单位}的等级
 * 对于英雄则会返回其英雄等级.
 */
declare function GetUnitLevel(whichUnit: unit): number;

/**
 * 单位位置
 * ${单位}的位置
 * 会创建点.
 */
declare function GetUnitLoc(whichUnit: unit): location;

/**
 * 当前移动速度
 * ${单位}的当前移动速度
 * 
 */
declare function GetUnitMoveSpeed(whichUnit: unit): number;

/**
 * 单位名字
 * ${单位}的名字
 * 
 */
declare function GetUnitName(whichUnit: unit): string;

/**
 * 单位附加值
 * ${单位}的附加值
 * 单位附加值不可改变.可以做一些特殊用途.比如TD地图中的建筑贩卖价格.
 */
declare function GetUnitPointValue(whichUnit: unit): number;

/**
 * 单位附加值(指定单位类型)
 * ${单位类型}的附加值
 * 单位附加值不可改变.可以做一些特殊用途.比如TD地图中的建筑贩卖价格.
 */
declare function GetUnitPointValueByType(unitType: number): number;

/**
 * 当前转向角度(弧度制)[R]
 * ${单位}的当前转向角度(弧度制)
 * 单位转身时的转向角度.数值越大转向幅度越大.
 */
declare function GetUnitPropWindow(whichUnit: unit): number;

/**
 * 单位种族
 * ${单位}所属种族
 * 物体编辑器中设置的单位所属种族.
 */
declare function GetUnitRace(whichUnit: unit): race;

/**
 * 单位集结点目标
 * ${单位}的集结点目标
 * 如果指定单位没有设置集结点到可破坏物上,则返回null.
 */
declare function GetUnitRallyDestructable(whichUnit: unit): destructable;

/**
 * 单位集结点
 * ${单位}的集结点位置
 * 如果单位没有设置集结点,则返回null.设置自己为集结点可取消集结点设置.会创建点.
 */
declare function GetUnitRallyPoint(whichUnit: unit): location;

/**
 * 单位集结点目标
 * ${单位}的集结点目标
 * 如果指定单位没有设置集结点到单位目标,则返回null.
 */
declare function GetUnitRallyUnit(whichUnit: unit): unit;

/**
 * 属性[R]
 * ${单位}的${Property}
 * 
 */
declare function GetUnitState(whichUnit: unit, whichUnitState: unitstate): number;

/**
 * 当前转身速度
 * ${单位}的当前转身速度
 * 转身速度表示单位改变面向方向时的速度.数值越小表示转身越慢.
 */
declare function GetUnitTurnSpeed(whichUnit: unit): number;

/**
 * 指定单位的类型
 * ${单位}的类型
 * 
 */
declare function GetUnitTypeId(whichUnit: unit): number;

/**
 * 单位自定义值
 * ${单位}的自定义值
 * 可使用'单位-设置自定义值'来设置该值.
 */
declare function GetUnitUserData(whichUnit: unit): number;

/**
 * 单位所在X轴坐标[R]
 * ${单位}所在X轴坐标
 * 
 */
declare function GetUnitX(whichUnit: unit): number;

/**
 * 单位所在Y轴坐标[R]
 * ${单位}所在Y轴坐标
 * 
 */
declare function GetUnitY(whichUnit: unit): number;
declare function GetWidgetLife(whichWidget: widget): number;
declare function GetWidgetX(whichWidget: widget): number;
declare function GetWidgetY(whichWidget: widget): number;
declare function GetWinningPlayer(): player;
declare function GetWorldBounds(): rect;

/**
 * 添加单位[R]
 * 为${单位组}添加${单位}
 * 并不影响单位本身.
 */
declare function GroupAddUnit(whichGroup: group, whichUnit: unit): boolean;

/**
 * 清空单位组
 * 清空${单位组}内所有单位
 * 并不影响单位本身.
 */
declare function GroupClear(whichGroup: group): void;

/**
 * 选取单位添加到单位组(坐标)
 * 为${单位组}添加以(${坐标X},${坐标Y})为圆心，${半径}为半径的圆范围内，满足${条件}的单位
 * 
 */
declare function GroupEnumUnitsInRange(whichGroup: group, x: number, y: number, radius: number, filter: boolexpr | (() => boolean) | null): void;

/**
 * 选取单位添加到单位组(坐标)(不建议使用)
 * 为${单位组}添加以(${坐标X},${坐标Y})为圆心，${半径}为半径的圆范围内，满足${条件}的单位。无效项(${N})
 * 最后一项是无效项，建议用上一个UI
 */
declare function GroupEnumUnitsInRangeCounted(whichGroup: group, x: number, y: number, radius: number, filter: boolexpr | (() => boolean) | null, countLimit: number): void;

/**
 * 选取单位添加到单位组(点)
 * 为${单位组}添加以${点}为圆心，${半径}为半径的圆范围内，满足${条件}的单位
 * 
 */
declare function GroupEnumUnitsInRangeOfLoc(whichGroup: group, whichLocation: location, radius: number, filter: boolexpr | (() => boolean) | null): void;

/**
 * 选取单位添加到单位组(点)(不建议使用)
 * 为${单位组}添加以${点}为圆心，${半径}为半径的圆范围内，满足${条件}的单位。无效项(${N})
 * 最后一项是无效项，建议用上一个UI
 */
declare function GroupEnumUnitsInRangeOfLocCounted(whichGroup: group, whichLocation: location, radius: number, filter: boolexpr | (() => boolean) | null, countLimit: number): void;
declare function GroupEnumUnitsInRect(whichGroup: group, r: rect, filter: boolexpr | (() => boolean) | null): void;
declare function GroupEnumUnitsInRectCounted(whichGroup: group, r: rect, filter: boolexpr | (() => boolean) | null, countLimit: number): void;
declare function GroupEnumUnitsOfPlayer(whichGroup: group, whichPlayer: player, filter: boolexpr | (() => boolean) | null): void;
declare function GroupEnumUnitsOfType(whichGroup: group, unitname: string, filter: boolexpr | (() => boolean) | null): void;
declare function GroupEnumUnitsOfTypeCounted(whichGroup: group, unitname: string, filter: boolexpr | (() => boolean) | null, countLimit: number): void;
declare function GroupEnumUnitsSelected(whichGroup: group, whichPlayer: player, filter: boolexpr | (() => boolean) | null): void;

/**
 * 发布命令(无目标)
 * 对${单位组}发布${Order}
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupImmediateOrder(whichGroup: group, order: string): boolean;

/**
 * 发布命令(无目标)(ID)
 * 对${单位组}发布${Order}
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupImmediateOrderById(whichGroup: group, order: number): boolean;

/**
 * 发布命令(指定坐标)[R]
 * 对${单位组}发布${Order}命令,目标点:(${X},${Y})
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupPointOrder(whichGroup: group, order: string, x: number, y: number): boolean;

/**
 * 发布命令(指定坐标)(ID)
 * 对${单位组}发布${Order}命令,目标点:(${X},${Y})
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupPointOrderById(whichGroup: group, order: number, x: number, y: number): boolean;

/**
 * 发布命令(指定点)(ID)
 * 对${单位组}发布${Order}命令,目标:${指定点}
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupPointOrderByIdLoc(whichGroup: group, order: number, whichLocation: location): boolean;

/**
 * 发布命令(指定点)
 * 对${单位组}发布${Order}命令,目标:${指定点}
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupPointOrderLoc(whichGroup: group, order: string, whichLocation: location): boolean;

/**
 * 移除单位[R]
 * 为${单位组}删除${单位}
 * 并不影响单位本身.
 */
declare function GroupRemoveUnit(whichGroup: group, whichUnit: unit): boolean;

/**
 * 发布命令(指定单位)
 * 对${单位组}发布${Order}命令,目标:${单位}
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupTargetOrder(whichGroup: group, order: string, targetWidget: widget): boolean;

/**
 * 发布命令(指定单位)(ID)
 * 对${单位组}发布${Order}命令,目标:${单位}
 * 最多只能对单位组中12个单位发布命令.
 */
declare function GroupTargetOrderById(whichGroup: group, order: number, targetWidget: widget): boolean;
declare function HaveSavedBoolean(table: hashtable, parentKey: number, childKey: number): boolean;
declare function HaveSavedHandle(table: hashtable, parentKey: number, childKey: number): boolean;
declare function HaveSavedInteger(table: hashtable, parentKey: number, childKey: number): boolean;
declare function HaveSavedReal(table: hashtable, parentKey: number, childKey: number): boolean;
declare function HaveSavedString(table: hashtable, parentKey: number, childKey: number): boolean;
declare function HaveStoredBoolean(cache: gamecache, missionKey: string, key: string): boolean;
declare function HaveStoredInteger(cache: gamecache, missionKey: string, key: string): boolean;
declare function HaveStoredReal(cache: gamecache, missionKey: string, key: string): boolean;
declare function HaveStoredString(cache: gamecache, missionKey: string, key: string): boolean;
declare function HaveStoredUnit(cache: gamecache, missionKey: string, key: string): boolean;

/**
 * 转换整数为实数
 * 转换${Integer}为实数
 * 
 */
declare function I2R(i: number): number;

/**
 * 转换整数为字符串
 * 转换${Integer}为字符串
 * 
 */
declare function I2S(i: number): string;

/**
 * 提升技能等级[R]
 * 使${单位}的${技能}等级提升1级
 * 改变死亡单位的光环技能会导致魔兽崩溃.
 */
declare function IncUnitAbilityLevel(whichUnit: unit, abilcode: number): number;

/**
 * 新建游戏缓存[R]
 * 新建游戏缓存:${缓存名}
 * 创建一个新的游戏缓存,一个地图最多只有有256个游戏缓存.
 */
declare function InitGameCache(campaignFile: string): gamecache;

/**
 * <1.24>新建哈希表
 * 创建一个新的哈希表
 * 您可以使用哈希表来储存临时数据
 */
declare function InitHashtable(): hashtable;
declare function IsCineFilterDisplayed(): boolean;
declare function IsDestructableInvulnerable(d: destructable): boolean;

/**
 * 战争迷雾开启
 * 战争迷雾开启
 * 
 */
declare function IsFogEnabled(): boolean;

/**
 * 黑色阴影开启
 * 黑色阴影开启
 * 
 */
declare function IsFogMaskEnabled(): boolean;

/**
 * 坐标在迷雾中
 * 坐标(${x},${y})在${玩家}的迷雾范围内
 * 黑色阴影内的坐标不被计算在内。
 */
declare function IsFoggedToPlayer(x: number, y: number, whichPlayer: player): boolean;
declare function IsGameTypeSupported(whichGameType: gametype): boolean;
declare function IsHeroUnitId(unitId: number): boolean;
declare function IsItemIdPawnable(itemId: number): boolean;
declare function IsItemIdPowerup(itemId: number): boolean;
declare function IsItemIdSellable(itemId: number): boolean;

/**
 * 物品无敌
 * ${物品}是无敌的
 * 
 */
declare function IsItemInvulnerable(whichItem: item): boolean;

/**
 * 物品被持有
 * ${物品}是被持有的
 * 在物品栏中的物品都是被持有的.就算单位正处于死亡状态.
 */
declare function IsItemOwned(whichItem: item): boolean;

/**
 * 物品可被抵押[R]
 * ${物品}可被抵押
 * 
 */
declare function IsItemPawnable(whichItem: item): boolean;

/**
 * 物品是拾取时自动使用的[R]
 * ${物品}是拾取时自动使用类物品
 * 
 */
declare function IsItemPowerup(whichItem: item): boolean;

/**
 * 物品可被市场随机出售[R]
 * ${物品}可被市场随机出售
 * 
 */
declare function IsItemSellable(whichItem: item): boolean;

/**
 * 物品可见[R]
 * ${物品}是可见的
 * 物品不被隐藏且不被单位持有时即为可见的.
 */
declare function IsItemVisible(whichItem: item): boolean;
declare function IsLeaderboardDisplayed(lb: leaderboard): boolean;

/**
 * 点在迷雾中
 * ${指定点}在${Player}的迷雾范围内
 * 黑色阴影内的点不被计算在内.
 */
declare function IsLocationFoggedToPlayer(whichLocation: location, whichPlayer: player): boolean;

/**
 * 包含点
 * ${不规则区域}内包含点:${点}
 * TC_REGION
 */
declare function IsLocationInRegion(whichRegion: region, whichLocation: location): boolean;

/**
 * 点在黑色阴影中
 * ${指定点}在${Player}的黑色阴影内
 * 
 */
declare function IsLocationMaskedToPlayer(whichLocation: location, whichPlayer: player): boolean;

/**
 * 点可见
 * ${指定点}对${Player}可见
 * 
 */
declare function IsLocationVisibleToPlayer(whichLocation: location, whichPlayer: player): boolean;

/**
 * 地图参数设置
 * ${MapFlag}已设置
 * 
 */
declare function IsMapFlagSet(whichMapFlag: mapflag): boolean;

/**
 * 坐标在黑色阴影中
 * 坐标(${x},${y})在${玩家}的黑色阴影内
 * 
 */
declare function IsMaskedToPlayer(x: number, y: number, whichPlayer: player): boolean;

/**
 * 多面板显示
 * ${Multiboard}是显示的
 * 
 */
declare function IsMultiboardDisplayed(lb: multiboard): boolean;

/**
 * 多面板最小化
 * ${Multiboard}是最小化的
 * 
 */
declare function IsMultiboardMinimized(lb: multiboard): boolean;

/**
 * 无法失败[R]
 * 玩家开启作弊模式:无法失败
 * 单机作弊码开启的模式.
 */
declare function IsNoDefeatCheat(): boolean;

/**
 * 无法胜利[R]
 * 玩家开启作弊模式:无法胜利
 * 单机作弊码开启的模式.
 */
declare function IsNoVictoryCheat(): boolean;

/**
 * 是玩家的盟友
 * ${Player}是${Player}的盟友
 * 包括中立状态.单向判断玩家A对玩家B联盟不侵犯,即表示玩家A是玩家B的盟友.
 */
declare function IsPlayerAlly(whichPlayer: player, otherPlayer: player): boolean;

/**
 * 是玩家的敌人
 * ${Player}是${Player}的敌人
 * 不包括中立状态.单向判断玩家A对玩家B敌对侵犯,即表示玩家A是玩家B的盟友.
 */
declare function IsPlayerEnemy(whichPlayer: player, otherPlayer: player): boolean;

/**
 * 在玩家组
 * ${Player}在${玩家组}中
 * 
 */
declare function IsPlayerInForce(whichPlayer: player, whichForce: force): boolean;

/**
 * 玩家是裁判或观察者[R]
 * ${Player}是裁判或观察者
 * 
 */
declare function IsPlayerObserver(whichPlayer: player): boolean;

/**
 * 玩家的种族选择
 * ${Player}选择了${RacePreference}
 * 
 */
declare function IsPlayerRacePrefSet(whichPlayer: player, pref: racepreference): boolean;

/**
 * 点被荒芜地表覆盖
 * ${指定点}被荒芜地表覆盖
 * 
 */
declare function IsPointBlighted(x: number, y: number): boolean;

/**
 * 包含坐标
 * ${不规则区域}内包含坐标(${X},${Y})
 * TC_REGION
 */
declare function IsPointInRegion(whichRegion: region, x: number, y: number): boolean;

/**
 * 任务完成
 * ${Quest}已完成
 * 
 */
declare function IsQuestCompleted(whichQuest: quest): boolean;

/**
 * 任务被发现
 * ${Quest}已被发现
 * 
 */
declare function IsQuestDiscovered(whichQuest: quest): boolean;

/**
 * 任务激活
 * ${Quest}已激活
 * 
 */
declare function IsQuestEnabled(whichQuest: quest): boolean;

/**
 * 任务失败
 * ${Quest}失败
 * 
 */
declare function IsQuestFailed(whichQuest: quest): boolean;

/**
 * 任务项目完成
 * ${QuestRequirement}已完成
 * 
 */
declare function IsQuestItemCompleted(whichQuestItem: questitem): boolean;

/**
 * 是主要任务
 * ${Quest}是主要任务
 * 
 */
declare function IsQuestRequired(whichQuest: quest): boolean;

/**
 * 经验不可获得
 * ${Hero}不可获得经验
 * 可使用'英雄-允许/禁止经验获取'来设置该项.
 */
declare function IsSuspendedXP(whichHero: unit): boolean;

/**
 * 地形通行状态关闭(指定点)
 * ${指定点}处的${PathingType}通行状态为关闭
 * 指定类型单位不能通行即通行状态为关闭.如该点不能造建筑就是'建造'通行状态为关闭.可使用'环境-设置地形通行状态'来改变通行状态.
 */
declare function IsTerrainPathable(x: number, y: number, t: pathingtype): boolean;
declare function IsTimerDialogDisplayed(whichDialog: timerdialog): boolean;

/**
 * 触发开启
 * ${触发}处于开启状态
 * 
 */
declare function IsTriggerEnabled(whichTrigger: trigger): boolean;
declare function IsTriggerWaitOnSleeps(whichTrigger: trigger): boolean;

/**
 * 单位检查
 * ${单位}与${单位}相同
 * 用来判断两个单位是否相等。
 */
declare function IsUnit(whichUnit: unit, whichSpecifiedUnit: unit): boolean;

/**
 * 是玩家的同盟单位
 * ${单位}是${Player}的同盟单位
 * 包括中立状态.单向判断玩家对单位是否为不侵犯状态.
 */
declare function IsUnitAlly(whichUnit: unit, whichPlayer: player): boolean;

/**
 * 被检测到
 * ${单位}处在${玩家}的真实视野范围内
 * 用来判断单位在这个玩家反隐形范围内，注：不包含该玩家同盟的反隐范围。
 */
declare function IsUnitDetected(whichUnit: unit, whichPlayer: player): boolean;

/**
 * 是玩家的敌对单位
 * ${单位}是${Player}的敌对单位
 * 不包括中立状态.单向判断玩家对单位是否为敌对侵犯.
 */
declare function IsUnitEnemy(whichUnit: unit, whichPlayer: player): boolean;

/**
 * 单位在迷雾中
 * ${单位}在${Player}的迷雾范围内
 * 黑色阴影内的单位不被计算在内.
 */
declare function IsUnitFogged(whichUnit: unit, whichPlayer: player): boolean;
declare function IsUnitHidden(whichUnit: unit): boolean;

/**
 * 单位类别检查(指定单位类型)
 * ${单位类型}是${Type}
 * 
 */
declare function IsUnitIdType(unitId: number, whichUnitType: unittype): boolean;
declare function IsUnitIllusion(whichUnit: unit): boolean;

/**
 * 是玩家组里玩家的单位
 * ${单位}属于${玩家组}里的玩家
 * 判断单位是否属于这个玩家组里的玩家。
 */
declare function IsUnitInForce(whichUnit: unit, whichForce: force): boolean;

/**
 * 在单位组
 * ${单位}在${单位组}中
 * 
 */
declare function IsUnitInGroup(whichUnit: unit, whichGroup: group): boolean;

/**
 * 在指定单位范围内[R]
 * ${单位}在距离${指定单位}${范围}范围内
 * 
 */
declare function IsUnitInRange(whichUnit: unit, otherUnit: unit, distance: number): boolean;

/**
 * 在指定点范围内[R]
 * ${单位}在距离${指定点}${范围}范围内
 * 
 */
declare function IsUnitInRangeLoc(whichUnit: unit, whichLocation: location, distance: number): boolean;

/**
 * 在指定坐标范围内[R]
 * ${单位}在距离坐标(${X},${Y})${范围}范围内
 * 
 */
declare function IsUnitInRangeXY(whichUnit: unit, x: number, y: number, distance: number): boolean;

/**
 * 在不规则区域内[R]
 * ${不规则区域}内存在${单位}
 * 
 */
declare function IsUnitInRegion(whichRegion: region, whichUnit: unit): boolean;
declare function IsUnitInTransport(whichUnit: unit, whichTransport: unit): boolean;

/**
 * 单位不可见
 * ${单位}对${Player}不可见
 * 
 */
declare function IsUnitInvisible(whichUnit: unit, whichPlayer: player): boolean;
declare function IsUnitLoaded(whichUnit: unit): boolean;

/**
 * 单位在黑色阴影中
 * ${单位}在${Player}的黑色阴影内
 * 
 */
declare function IsUnitMasked(whichUnit: unit, whichPlayer: player): boolean;

/**
 * 是玩家的单位
 * ${单位}属于${Player}
 * 判断单位是否属于这个玩家。
 */
declare function IsUnitOwnedByPlayer(whichUnit: unit, whichPlayer: player): boolean;
declare function IsUnitPaused(whichHero: unit): boolean;

/**
 * 单位种族检查
 * ${单位}是${Race}
 * 
 */
declare function IsUnitRace(whichUnit: unit, whichRace: race): boolean;

/**
 * 被玩家选择
 * ${单位}被${Player}选择
 * 
 */
declare function IsUnitSelected(whichUnit: unit, whichPlayer: player): boolean;

/**
 * 单位类别检查
 * ${单位}是${Type}
 * 
 */
declare function IsUnitType(whichUnit: unit, whichUnitType: unittype): boolean;

/**
 * 单位可见
 * ${单位}对${Player}可见
 * 
 */
declare function IsUnitVisible(whichUnit: unit, whichPlayer: player): boolean;

/**
 * 坐标可见
 * 坐标(${x},${y})对${玩家}可见
 * 
 */
declare function IsVisibleToPlayer(x: number, y: number, whichPlayer: player): boolean;
declare function IssueBuildOrder(whichPeon: unit, unitToBuild: string, x: number, y: number): boolean;

/**
 * 发布建造命令(指定坐标)[R]
 * 命令${单位}建造${单位类型}在坐标:(${X},${Y})
 * 
 */
declare function IssueBuildOrderById(whichPeon: unit, unitId: number, x: number, y: number): boolean;

/**
 * 发布命令(无目标)
 * 对${单位}发布${Order}命令
 * 
 */
declare function IssueImmediateOrder(whichUnit: unit, order: string): boolean;

/**
 * 发布命令(无目标)(ID)
 * 对${单位}发布${Order}命令
 * 
 */
declare function IssueImmediateOrderById(whichUnit: unit, order: number): boolean;
declare function IssueInstantPointOrder(whichUnit: unit, order: string, x: number, y: number, instantTargetWidget: widget): boolean;
declare function IssueInstantPointOrderById(whichUnit: unit, order: number, x: number, y: number, instantTargetWidget: widget): boolean;
declare function IssueInstantTargetOrder(whichUnit: unit, order: string, targetWidget: widget, instantTargetWidget: widget): boolean;
declare function IssueInstantTargetOrderById(whichUnit: unit, order: number, targetWidget: widget, instantTargetWidget: widget): boolean;

/**
 * 发布中介命令(无目标)
 * 使${玩家}对${单位}发布${Order}命令
 * 可以用来对非本玩家单位发布命令.
 */
declare function IssueNeutralImmediateOrder(forWhichPlayer: player, neutralStructure: unit, unitToBuild: string): boolean;

/**
 * 发布中介命令(无目标)(ID)
 * 使${玩家}对${单位}发布${Order}命令
 * 可以用来对非本玩家单位发布命令.
 */
declare function IssueNeutralImmediateOrderById(forWhichPlayer: player, neutralStructure: unit, unitId: number): boolean;

/**
 * 发布中介命令(指定坐标)
 * 使${玩家}对${单位}发布${Order}命令到坐标:(${X},${Y})
 * 可以用来对非本玩家单位发布命令.
 */
declare function IssueNeutralPointOrder(forWhichPlayer: player, neutralStructure: unit, unitToBuild: string, x: number, y: number): boolean;

/**
 * 发布中介命令(指定坐标)(ID)
 * 使${玩家}对${单位}发布${Order}命令到坐标:(${X},${Y})
 * 可以用来对非本玩家单位发布命令.
 */
declare function IssueNeutralPointOrderById(forWhichPlayer: player, neutralStructure: unit, unitId: number, x: number, y: number): boolean;

/**
 * 发布中介命令(指定单位)
 * 使${玩家}对${单位}发布${Order}命令到目标:${单位}
 * 可以用来对非本玩家单位发布命令.
 */
declare function IssueNeutralTargetOrder(forWhichPlayer: player, neutralStructure: unit, unitToBuild: string, target: widget): boolean;

/**
 * 发布中介命令(指定单位)(ID)
 * 使${玩家}对${单位}发布${Order}命令到目标:${单位}
 * 可以用来对非本玩家单位发布命令.
 */
declare function IssueNeutralTargetOrderById(forWhichPlayer: player, neutralStructure: unit, unitId: number, target: widget): boolean;

/**
 * 发布命令(指定坐标)
 * 对${单位}发布${Order}命令到坐标:(${X},${Y})
 * 
 */
declare function IssuePointOrder(whichUnit: unit, order: string, x: number, y: number): boolean;

/**
 * 发布命令(指定坐标)(ID)
 * 对${单位}发布${Order}命令到坐标:(${X},${Y})
 * 
 */
declare function IssuePointOrderById(whichUnit: unit, order: number, x: number, y: number): boolean;

/**
 * 发布命令(指定点)(ID)
 * 对${单位}发布${Order}命令到目标点:${指定点}
 * 
 */
declare function IssuePointOrderByIdLoc(whichUnit: unit, order: number, whichLocation: location): boolean;

/**
 * 发布命令(指定点)
 * 对${单位}发布${Order}命令到目标点:${指定点}
 * 
 */
declare function IssuePointOrderLoc(whichUnit: unit, order: string, whichLocation: location): boolean;

/**
 * 发布命令(指定单位)
 * 对${单位}发布${Order}命令到目标:${单位}
 * 
 */
declare function IssueTargetOrder(whichUnit: unit, order: string, targetWidget: widget): boolean;

/**
 * 发布命令(指定单位)(ID)
 * 对${单位}发布${Order}命令到目标:${单位}
 * 
 */
declare function IssueTargetOrderById(whichUnit: unit, order: number, targetWidget: widget): boolean;

/**
 * 添加物品类型[R]
 * 在${物品池}中添加一个${物品}比重为${数值}
 * 比重越高被选择的机率越大.
 */
declare function ItemPoolAddItemType(whichItemPool: itempool, itemId: number, weight: number): void;

/**
 * 删除物品类型[R]
 * 从${物品池}中删除${物品}
 * 
 */
declare function ItemPoolRemoveItemType(whichItemPool: itempool, itemId: number): void;

/**
 * 杀死
 * 杀死${可破坏物}
 * 
 */
declare function KillDestructable(d: destructable): void;
declare function KillSoundWhenDone(soundHandle: sound): void;

/**
 * 杀死
 * 杀死${单位}
 * 
 */
declare function KillUnit(whichUnit: unit): void;
declare function LeaderboardAddItem(lb: leaderboard, label: string, value: number, p: player): void;

/**
 * 清空[R]
 * 清空${排行榜}
 * 清空排行榜中所有内容.
 */
declare function LeaderboardClear(lb: leaderboard): void;

/**
 * 显示/隐藏[R]
 * 设置${排行榜}${Show/Hide}
 * 排行榜不能在地图初始化时显示.
 */
declare function LeaderboardDisplay(lb: leaderboard, show: boolean): void;

/**
 * 行数
 * ${Leaderboard}的行数
 * 
 */
declare function LeaderboardGetItemCount(lb: leaderboard): number;
declare function LeaderboardGetLabelText(lb: leaderboard): string;
declare function LeaderboardGetPlayerIndex(lb: leaderboard, p: player): number;
declare function LeaderboardHasPlayerItem(lb: leaderboard, p: player): boolean;
declare function LeaderboardRemoveItem(lb: leaderboard, index: number): void;
declare function LeaderboardRemovePlayerItem(lb: leaderboard, p: player): void;
declare function LeaderboardSetItemLabel(lb: leaderboard, whichItem: number, val: string): void;
declare function LeaderboardSetItemLabelColor(lb: leaderboard, whichItem: number, red: number, green: number, blue: number, alpha: number): void;
declare function LeaderboardSetItemStyle(lb: leaderboard, whichItem: number, showLabel: boolean, showValue: boolean, showIcon: boolean): void;
declare function LeaderboardSetItemValue(lb: leaderboard, whichItem: number, val: number): void;
declare function LeaderboardSetItemValueColor(lb: leaderboard, whichItem: number, red: number, green: number, blue: number, alpha: number): void;
declare function LeaderboardSetLabel(lb: leaderboard, label: string): void;

/**
 * 设置文字颜色[R]
 * 设置${Leaderboard}的文字颜色为(${Red},${Green},${Blue})Alpha通道值为:${Transparency}
 * 颜色格式为(红,绿,蓝).Alpha通道值0为不可见.颜色值和Alpha通道值取值范围为0-255.
 */
declare function LeaderboardSetLabelColor(lb: leaderboard, red: number, green: number, blue: number, alpha: number): void;
declare function LeaderboardSetSizeByItemCount(lb: leaderboard, count: number): void;
declare function LeaderboardSetStyle(lb: leaderboard, showLabel: boolean, showNames: boolean, showValues: boolean, showIcons: boolean): void;

/**
 * 设置数值颜色[R]
 * 设置${Leaderboard}的数值颜色为(${Red},${Green},${Blue})Alpha通道值为:${Transparency}
 * 颜色格式为(红,绿,蓝).Alpha通道值0为不可见.颜色值和Alpha通道值取值范围为0-255.
 */
declare function LeaderboardSetValueColor(lb: leaderboard, red: number, green: number, blue: number, alpha: number): void;
declare function LeaderboardSortItemsByLabel(lb: leaderboard, ascending: boolean): void;
declare function LeaderboardSortItemsByPlayer(lb: leaderboard, ascending: boolean): void;
declare function LeaderboardSortItemsByValue(lb: leaderboard, ascending: boolean): void;
declare function LoadAbilityHandle(table: hashtable, parentKey: number, childKey: number): ability;

/**
 * <1.24>从哈希表提取布尔
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取布尔
 * 如果不存在则返回False
 */
declare function LoadBoolean(table: hashtable, parentKey: number, childKey: number): boolean;

/**
 * <1.24>从哈希表提取布尔表达式
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取布尔表达式
 * 如果不存在则返回空
 */
declare function LoadBooleanExprHandle(table: hashtable, parentKey: number, childKey: number): boolexpr;

/**
 * <1.24>从哈希表提取对话框按钮
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取对话框按钮
 * 如果不存在则返回空
 */
declare function LoadButtonHandle(table: hashtable, parentKey: number, childKey: number): button;

/**
 * <1.24>从哈希表提取失败条件
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取失败条件
 * 如果不存在则返回空
 */
declare function LoadDefeatConditionHandle(table: hashtable, parentKey: number, childKey: number): defeatcondition;

/**
 * <1.24>从哈希表提取可破坏物
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取可破坏物
 * 如果不存在则返回空
 */
declare function LoadDestructableHandle(table: hashtable, parentKey: number, childKey: number): destructable;

/**
 * <1.24>从哈希表提取对话框
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取对话框
 * 如果不存在则返回空
 */
declare function LoadDialogHandle(table: hashtable, parentKey: number, childKey: number): dialog;

/**
 * <1.24>从哈希表提取特效
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取特效
 * 如果不存在则返回空
 */
declare function LoadEffectHandle(table: hashtable, parentKey: number, childKey: number): effect;

/**
 * <1.24>从哈希表提取可见度修正器
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取可见度修正器
 * 如果不存在则返回空
 */
declare function LoadFogModifierHandle(table: hashtable, parentKey: number, childKey: number): fogmodifier;

/**
 * <1.24>从哈希表提取迷雾状态
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取迷雾状态
 * 如果不存在则返回空
 */
declare function LoadFogStateHandle(table: hashtable, parentKey: number, childKey: number): fogstate;

/**
 * <1.24>从哈希表提取玩家组
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取玩家组
 * 如果不存在则返回空
 */
declare function LoadForceHandle(table: hashtable, parentKey: number, childKey: number): force;
declare function LoadGame(saveFileName: string, doScoreScreen: boolean): void;

/**
 * <1.24>从哈希表提取单位组
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取单位组
 * 如果不存在则返回空
 */
declare function LoadGroupHandle(table: hashtable, parentKey: number, childKey: number): group;
declare function LoadHashtableHandle(table: hashtable, parentKey: number, childKey: number): hashtable;

/**
 * <1.24>从哈希表提取图象
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取图象
 * 如果不存在则返回空
 */
declare function LoadImageHandle(table: hashtable, parentKey: number, childKey: number): image;

/**
 * <1.24>从哈希表提取整数
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取整数
 * 如果不存在则返回0
 */
declare function LoadInteger(table: hashtable, parentKey: number, childKey: number): number;

/**
 * <1.24>从哈希表提取物品
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取物品
 * 如果不存在则返回空
 */
declare function LoadItemHandle(table: hashtable, parentKey: number, childKey: number): item;

/**
 * <1.24>从哈希表提取物品池
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取物品池
 * 如果不存在则返回空
 */
declare function LoadItemPoolHandle(table: hashtable, parentKey: number, childKey: number): itempool;

/**
 * <1.24>从哈希表提取排行榜
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取排行榜
 * 如果不存在则返回空
 */
declare function LoadLeaderboardHandle(table: hashtable, parentKey: number, childKey: number): leaderboard;

/**
 * <1.24>从哈希表提取闪电效果
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取闪电效果
 * 如果不存在则返回空
 */
declare function LoadLightningHandle(table: hashtable, parentKey: number, childKey: number): lightning;

/**
 * <1.24>从哈希表提取点
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取点
 * 如果不存在则返回空
 */
declare function LoadLocationHandle(table: hashtable, parentKey: number, childKey: number): location;

/**
 * <1.24>从哈希表提取多面板
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取多面板
 * 如果不存在则返回空
 */
declare function LoadMultiboardHandle(table: hashtable, parentKey: number, childKey: number): multiboard;

/**
 * <1.24>从哈希表提取多面板项目
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取多面板项目
 * 如果不存在则返回空
 */
declare function LoadMultiboardItemHandle(table: hashtable, parentKey: number, childKey: number): multiboarditem;

/**
 * <1.24>从哈希表提取玩家
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取玩家
 * 如果不存在则返回空
 */
declare function LoadPlayerHandle(table: hashtable, parentKey: number, childKey: number): player;

/**
 * <1.24>从哈希表提取任务
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取任务
 * 如果不存在则返回空
 */
declare function LoadQuestHandle(table: hashtable, parentKey: number, childKey: number): quest;

/**
 * <1.24>从哈希表提取任务要求
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取任务要求
 * 如果不存在则返回空
 */
declare function LoadQuestItemHandle(table: hashtable, parentKey: number, childKey: number): questitem;

/**
 * <1.24>从哈希表提取实数
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取实数
 * 如果不存在则返回0.00
 */
declare function LoadReal(table: hashtable, parentKey: number, childKey: number): number;

/**
 * <1.24>从哈希表提取区域(矩型)
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取区域(矩型)
 * 如果不存在则返回空
 */
declare function LoadRectHandle(table: hashtable, parentKey: number, childKey: number): rect;

/**
 * <1.24>从哈希表提取区域(不规则)
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取区域(不规则)
 * 如果不存在则返回空
 */
declare function LoadRegionHandle(table: hashtable, parentKey: number, childKey: number): region;

/**
 * <1.24>从哈希表提取音效
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取音效
 * 如果不存在则返回空
 */
declare function LoadSoundHandle(table: hashtable, parentKey: number, childKey: number): sound;
declare function LoadStr(table: hashtable, parentKey: number, childKey: number): string;

/**
 * <1.24>从哈希表提取漂浮文字
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取漂浮文字
 * 如果不存在则返回空
 */
declare function LoadTextTagHandle(table: hashtable, parentKey: number, childKey: number): texttag;

/**
 * <1.24>从哈希表提取计时器窗口
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取计时器窗口
 * 如果不存在则返回空
 */
declare function LoadTimerDialogHandle(table: hashtable, parentKey: number, childKey: number): timerdialog;

/**
 * <1.24>从哈希表提取计时器
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取计时器
 * 如果不存在则返回空
 */
declare function LoadTimerHandle(table: hashtable, parentKey: number, childKey: number): timer;

/**
 * <1.24>从哈希表提取可追踪物
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取可追踪物
 * 如果不存在则返回空
 */
declare function LoadTrackableHandle(table: hashtable, parentKey: number, childKey: number): trackable;

/**
 * <1.24>从哈希表提取触发动作
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取触发动作
 * 如果不存在则返回空
 */
declare function LoadTriggerActionHandle(table: hashtable, parentKey: number, childKey: number): triggeraction;

/**
 * <1.24>从哈希表提取触发条件
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取触发条件
 * 如果不存在则返回空
 */
declare function LoadTriggerConditionHandle(table: hashtable, parentKey: number, childKey: number): triggercondition;

/**
 * <1.24>从哈希表提取触发事件
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取触发事件
 * 如果不存在则返回空
 */
declare function LoadTriggerEventHandle(table: hashtable, parentKey: number, childKey: number): event;

/**
 * <1.24>从哈希表提取触发器
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取触发器
 * 如果不存在则返回空
 */
declare function LoadTriggerHandle(table: hashtable, parentKey: number, childKey: number): trigger;

/**
 * <1.24>从哈希表提取地面纹理变化
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取地面纹理变化
 * 如果不存在则返回空
 */
declare function LoadUbersplatHandle(table: hashtable, parentKey: number, childKey: number): ubersplat;

/**
 * <1.24>从哈希表提取单位
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取单位
 * 如果不存在则返回空
 */
declare function LoadUnitHandle(table: hashtable, parentKey: number, childKey: number): unit;

/**
 * <1.24>从哈希表提取单位池
 * 在子索引${Value}主索引${Value}的${Hashtable}内提取单位池
 * 如果不存在则返回空
 */
declare function LoadUnitPoolHandle(table: hashtable, parentKey: number, childKey: number): unitpool;
declare function LoadWidgetHandle(table: hashtable, parentKey: number, childKey: number): widget;

/**
 * 坐标点
 * 坐标(${X},${Y})
 * 会创建点.
 */
declare function Location(x: number, y: number): location;
declare function MoveLightning(whichBolt: lightning, checkVisibility: boolean, x1: number, y1: number, x2: number, y2: number): boolean;

/**
 * 移动闪电效果(指定坐标)[R]
 * 移动${Lightning}到新位置,(${Boolean}检查可见性)新起始点:(${X},${Y},${Z})新终结点:(${X},${Y},${Z})
 * 可指定Z坐标.允许检查可见性则在指定起始点和终结点都不可见时将不移动闪电效果.
 */
declare function MoveLightningEx(whichBolt: lightning, checkVisibility: boolean, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean;

/**
 * 移动点[R]
 * 移动${点}到(${X},${Y})
 * 该点必须是一个变量.因为移动一个不可重用的点是无意义的.
 */
declare function MoveLocation(whichLocation: location, newX: number, newY: number): void;

/**
 * 移动矩形区域(指定坐标)[R]
 * 移动${矩形区域}到(${X},${Y})
 * 该区域必须是一个变量.目标点将作为该区域的新中心点.
 */
declare function MoveRectTo(whichRect: rect, newCenterX: number, newCenterY: number): void;

/**
 * 移动矩形区域(指定点)
 * 移动${矩形区域}到${目标点}
 * 该区域必须是一个变量.目标点将作为该区域的新中心点.
 */
declare function MoveRectToLoc(whichRect: rect, newCenterLoc: location): void;

/**
 * 清空多面板
 * 清空${Multiboard}
 * 清空该多面板中的所有行和列.
 */
declare function MultiboardClear(lb: multiboard): void;

/**
 * 显示/隐藏
 * ${Show/Hide}${Multiboard}
 * 多面板不能在地图初始化时显示.
 */
declare function MultiboardDisplay(lb: multiboard, show: boolean): void;

/**
 * 列数
 * ${Multiboard}的列数
 * 
 */
declare function MultiboardGetColumnCount(lb: multiboard): number;

/**
 * 多面板项目[R]
 * ${多面板}的第${X}行,第${Y}列项
 * (0,0)作为多面板首项,会创建多面板项目.
 */
declare function MultiboardGetItem(lb: multiboard, row: number, column: number): multiboarditem;

/**
 * 行数
 * ${Multiboard}的行数
 * 
 */
declare function MultiboardGetRowCount(lb: multiboard): number;

/**
 * 多面板标题
 * ${Multiboard}的标题
 * 
 */
declare function MultiboardGetTitleText(lb: multiboard): string;

/**
 * 最大/最小化
 * ${Minimize/Maximize}${Multiboard}
 * 最小化的多面板只显示标题.
 */
declare function MultiboardMinimize(lb: multiboard, minimize: boolean): void;

/**
 * 删除多面板项目[R]
 * 删除${多面板项目}
 * 并不会影响对多面板的显示.多面板项目指向多面板但不附属于多面板.
 */
declare function MultiboardReleaseItem(mbi: multiboarditem): void;

/**
 * 设置列数
 * 设置${Multiboard}的列数为${Columns}
 * 
 */
declare function MultiboardSetColumnCount(lb: multiboard, count: number): void;

/**
 * 设置项目图标
 * 设置${Multiboard}第${Column}列,第${Row}行的项目图标为${IconFile}
 * 
 */
declare function MultiboardSetItemIcon(mbi: multiboarditem, iconFileName: string): void;

/**
 * 设置项目显示风格
 * 设置${Multiboard}第${Column}列,第${Row}行项目的显示风格:${Show/Hide}文字${Show/Hide}图标
 * 可以设置行/列数为0来指代所有的行/列.
 */
declare function MultiboardSetItemStyle(mbi: multiboarditem, showValue: boolean, showIcon: boolean): void;

/**
 * 设置项目文本
 * 设置${Multiboard}第${Column}列,第${Row}行的项目文本为${文字}
 * 可以设置行/列数为0来指代所有的行/列.
 */
declare function MultiboardSetItemValue(mbi: multiboarditem, val: string): void;

/**
 * 设置指定项目颜色[R]
 * 设置${多面板项目}的项目颜色为(${Red},${Green},${Blue}),Alpha值为${Transparency}
 * 颜色格式为(红,绿,蓝).Alpha值为0是不可见的.颜色值和Alpha值取值范围为0-255.
 */
declare function MultiboardSetItemValueColor(mbi: multiboarditem, red: number, green: number, blue: number, alpha: number): void;

/**
 * 设置项目宽度
 * 设置${Multiboard}第${Column}列,第${Row}行的项目宽度为屏幕的${Width}%
 * 
 */
declare function MultiboardSetItemWidth(mbi: multiboarditem, width: number): void;
declare function MultiboardSetItemsIcon(lb: multiboard, iconPath: string): void;
declare function MultiboardSetItemsStyle(lb: multiboard, showValues: boolean, showIcons: boolean): void;
declare function MultiboardSetItemsValue(lb: multiboard, value: string): void;

/**
 * 设置所有项目颜色[R]
 * 设置${多面板}的所有项目颜色为(${Red},${Green},${Blue}),Alpha值为${Transparency}
 * 颜色格式为(红,绿,蓝).Alpha值为0是不可见的.颜色值和Alpha值取值范围为0-255.
 */
declare function MultiboardSetItemsValueColor(lb: multiboard, red: number, green: number, blue: number, alpha: number): void;
declare function MultiboardSetItemsWidth(lb: multiboard, width: number): void;

/**
 * 设置行数
 * 设置${Multiboard}的行数为${Rows}
 * 
 */
declare function MultiboardSetRowCount(lb: multiboard, count: number): void;

/**
 * 设置标题
 * 设置${Multiboard}的标题为${文字}
 * 
 */
declare function MultiboardSetTitleText(lb: multiboard, label: string): void;

/**
 * 设置标题颜色
 * 设置${Multiboard}的标题颜色为(${Red}%,${Green}%,${Blue}%)透明度为${Transparency}%
 * 颜色格式为(红,绿,蓝).透明度100%是不可见的.
 */
declare function MultiboardSetTitleTextColor(lb: multiboard, red: number, green: number, blue: number, alpha: number): void;

/**
 * 显示/隐藏多面板模式[R]
 * ${打开/关闭}隐藏多面板模式
 * 隐藏多面板模式将无法显示多面板.
 */
declare function MultiboardSuppressDisplay(flag: boolean): void;
declare function NewSoundEnvironment(environmentName: string): void;
declare function Not(operand: boolexpr | (() => boolean) | null): boolexpr;
declare function Or(operandA: boolexpr | (() => boolean) | null, operandB: boolexpr | (() => boolean) | null): boolexpr;
declare function OrderId(orderIdString: string): number;
declare function OrderId2String(orderId: number): string;
declare function PanCameraTo(x: number, y: number): void;

/**
 * 平移镜头(所有玩家)(限时)[R]
 * 平移玩家镜头到(${X},${Y}),持续${Time}秒
 * 
 */
declare function PanCameraToTimed(x: number, y: number, duration: number): void;

/**
 * 指定高度平移镜头(所有玩家)(限时)[R]
 * 平移玩家镜头到(${X},${Y}),镜头距离地面高度为${Z},持续${Time}秒
 * 在指定移动路径上镜头不会低于地面高度.
 */
declare function PanCameraToTimedWithZ(x: number, y: number, zOffsetDest: number, duration: number): void;
declare function PanCameraToWithZ(x: number, y: number, zOffsetDest: number): void;

/**
 * 暂停/恢复AI脚本运行[R]
 * 设定${Player}${暂停/恢复}当前AI脚本的运行
 * 事实上该函数是有问题的,可以这么理解:设玩家当前AI脚本的运行状态R为0,暂停1次则R+1,恢复1次则R-1,仅当R=0时该玩家才会运行AI.在使用前请先理解这段话的意思.
 */
declare function PauseCompAI(p: player, pause: boolean): void;

/**
 * 暂停/恢复游戏[R]
 * ${暂停/恢复}游戏
 * 
 */
declare function PauseGame(flag: boolean): void;

/**
 * 暂停计时器[R]
 * 暂停${计时器}
 * 
 */
declare function PauseTimer(whichTimer: timer): void;

/**
 * 暂停/恢复[R]
 * 设置${单位}${Pause/Unpause}
 * 
 */
declare function PauseUnit(whichUnit: unit, flag: boolean): void;

/**
 * 小地图信号(所有玩家)[R]
 * 对所有玩家发送小地图信号到坐标(${X},${Y})持续时间:${Duration}秒
 * 
 */
declare function PingMinimap(x: number, y: number, duration: number): void;

/**
 * 小地图信号(指定颜色)(所有玩家)[R]
 * 对所有玩家发送小地图信号到坐标(${X},${Y})持续时间:${Duration}秒,信号颜色:(${Red},${Green},${Blue})信号类型:${Style}
 * 颜色格式为(红,绿,蓝).颜色值取值范围为0-255.
 */
declare function PingMinimapEx(x: number, y: number, duration: number, red: number, green: number, blue: number, extraEffects: boolean): void;

/**
 * 选择放置物品[R]
 * 从${物品池}中任意选择一个物品并放置到(${X},${Y})点
 * 
 */
declare function PlaceRandomItem(whichItemPool: itempool, x: number, y: number): item;

/**
 * 选择放置单位[R]
 * 从${单位池}中为${玩家}任意选择一个单位并放置到点(${X},${Y})面向${度}
 * 
 */
declare function PlaceRandomUnit(whichPool: unitpool, forWhichPlayer: player, x: number, y: number, facing: number): unit;
declare function PlayCinematic(movieName: string): void;
declare function PlayModelCinematic(modelName: string): void;
declare function PlayMusic(musicName: string): void;
declare function PlayMusicEx(musicName: string, frommsecs: number, fadeinmsecs: number): void;
declare function PlayThematicMusic(musicFileName: string): void;
declare function PlayThematicMusicEx(musicFileName: string, frommsecs: number): void;
declare function Player(number: number): player;
declare function PlayerGetLeaderboard(toPlayer: player): leaderboard;

/**
 * 设置玩家使用的排行榜[R]
 * 设置${Player}使用${排行榜}
 * 每个玩家只能显示一个排行榜.
 */
declare function PlayerSetLeaderboard(toPlayer: player, lb: leaderboard): void;

/**
 * 幂运算
 * ${实数}的${实数}次幂
 * 
 */
declare function Pow(x: number, power: number): number;

/**
 * 预载文件
 * 预载${文件}
 * 可以事先载入文件并调入到游戏内存,以加快游戏的速度.
 */
declare function Preload(filename: string): void;

/**
 * 开始预载
 * 开始预载,超时设置${Time}秒
 * 将文件调入到游戏内存中.
 */
declare function PreloadEnd(timeout: number): void;
declare function PreloadEndEx(): void;
declare function PreloadGenClear(): void;
declare function PreloadGenEnd(filename: string): void;
declare function PreloadGenStart(): void;
declare function PreloadRefresh(): void;
declare function PreloadStart(): void;

/**
 * 批量预载
 * 预载所有在${文件}中列出的文件
 * 
 */
declare function Preloader(filename: string): void;
declare function QuestCreateItem(whichQuest: quest): questitem;
declare function QuestItemSetCompleted(whichQuestItem: questitem, completed: boolean): void;
declare function QuestItemSetDescription(whichQuestItem: questitem, description: string): void;
declare function QuestSetCompleted(whichQuest: quest, completed: boolean): void;
declare function QuestSetDescription(whichQuest: quest, description: string): void;
declare function QuestSetDiscovered(whichQuest: quest, discovered: boolean): void;

/**
 * 启用/禁用任务[R]
 * 设置${Quest}${Enable/Disable}
 * 被禁用的任务将不会显示在任务列表.
 */
declare function QuestSetEnabled(whichQuest: quest, enabled: boolean): void;
declare function QuestSetFailed(whichQuest: quest, failed: boolean): void;
declare function QuestSetIconPath(whichQuest: quest, iconPath: string): void;
declare function QuestSetRequired(whichQuest: quest, required: boolean): void;
declare function QuestSetTitle(whichQuest: quest, title: string): void;
declare function QueueDestructableAnimation(d: destructable, whichAnimation: string): void;
declare function QueueUnitAnimation(whichUnit: unit, whichAnimation: string): void;

/**
 * 转换实数为整数
 * 转换${Real}为整数
 * 舍弃小数部分.
 */
declare function R2I(r: number): number;

/**
 * 转换实数为字符串
 * 转换${Real}为字符串
 * 
 */
declare function R2S(r: number): string;

/**
 * 格式转换实数为字符串
 * 转换${Real}为字符串,最小宽度:${Width},小数位数:${Precision}
 * 如:转换(1.234,7,2)后为''1.23''.转换(1.234,2,5)后为''1.23400''.
 */
declare function R2SW(r: number, width: number, precision: number): string;

/**
 * 转换弧度为角度
 * 转换弧度${Radians}为角度
 * 
 */
declare function Rad2Deg(radians: number): number;

/**
 * 新建矩形区域(指定边角坐标)
 * 左下角为(${X1},${Y1}),右上角为(${X2},${Y2})的矩形区域
 * 会创建矩形区域.
 */
declare function Rect(minx: number, miny: number, maxx: number, maxy: number): rect;

/**
 * 新建矩形区域(指定边角点)
 * 左下角为${点1},右上角为${点2}的矩形区域
 * 会创建矩形区域.
 */
declare function RectFromLoc(min: location, max: location): rect;

/**
 * 恢复指定单位的警戒点
 * 恢复${单位}的警戒点
 * 这个动作通过AI来恢复特定单位的警戒点.
 */
declare function RecycleGuardPosition(hUnit: unit): void;

/**
 * 添加单元点(指定坐标)[R]
 * 对${不规则区域}添加单元点:(${X},${Y})
 * 单元点大小为32x32.
 */
declare function RegionAddCell(whichRegion: region, x: number, y: number): void;

/**
 * 添加单元点(指定点)[R]
 * 对${不规则区域}添加单元点:${点}
 * 单元点大小为32x32.
 */
declare function RegionAddCellAtLoc(whichRegion: region, whichLocation: location): void;

/**
 * 添加区域[R]
 * 对${不规则区域}添加${矩形区域}
 * 区域是游戏中一个游戏地区的集合体,可以包含地区和点.
 */
declare function RegionAddRect(whichRegion: region, r: rect): void;

/**
 * 移除单元点(指定坐标)[R]
 * 在${不规则区域}中移除单元点:(${X},${Y})
 * 单元点大小为32x32.
 */
declare function RegionClearCell(whichRegion: region, x: number, y: number): void;

/**
 * 移除单元点(指定点)[R]
 * 在${不规则区域}中移除单元点:${点}
 * 单元点大小为32x32.
 */
declare function RegionClearCellAtLoc(whichRegion: region, whichLocation: location): void;

/**
 * 移除区域[R]
 * 在${不规则区域}中移除${矩形区域}
 * 
 */
declare function RegionClearRect(whichRegion: region, r: rect): void;
declare function RegisterStackedSound(soundHandle: sound, byPosition: boolean, rectwidth: number, rectheight: number): void;
declare function ReloadGame(): void;

/**
 * 读取本地缓存数据
 * 从本地硬盘读取缓存数据
 * 只对单机游戏有效,从本地硬盘读取缓存数据,主要用来实现战役关卡间的数据传递.
 */
declare function ReloadGameCachesFromDisk(): boolean;

/**
 * 忽视所有单位的警戒点
 * 忽视${Player}的所有单位的警戒点
 * 单位将不会自动返回原警戒点.一个很有用的功能就是刷怪进攻时忽视单位警戒范围的话,怪就不会想家了.
 */
declare function RemoveAllGuardPositions(num: player): void;

/**
 * 删除
 * 删除${可破坏物}
 * 
 */
declare function RemoveDestructable(d: destructable): void;

/**
 * 忽视指定单位的警戒点
 * 忽视${单位}的警戒点
 * 单位将不会自动返回原警戒点.一个很有用的功能就是刷怪进攻时忽视单位警戒范围的话,怪就不会想家了.
 */
declare function RemoveGuardPosition(hUnit: unit): void;

/**
 * 删除
 * 删除${物品}
 * 
 */
declare function RemoveItem(whichItem: item): void;

/**
 * 删除物品(所有市场)
 * 删除${物品类型}从所有市场
 * 影响所有拥有'出售物品'技能的单位.
 */
declare function RemoveItemFromAllStock(itemId: number): void;
declare function RemoveItemFromStock(whichUnit: unit, itemId: number): void;

/**
 * 清除点[R]
 * 清除${点}
 * 点是堆积最多的垃圾资源,不需要再使用的点都要记得清除掉.
 */
declare function RemoveLocation(whichLocation: location): void;

/**
 * 踢除玩家
 * 踢除${Player}，玩家的游戏结果为${文字}
 * 
 */
declare function RemovePlayer(whichPlayer: player, gameResult: playergameresult): void;

/**
 * 删除矩形区域[R]
 * 删除${矩形区域}
 * 
 */
declare function RemoveRect(whichRect: rect): void;

/**
 * 删除不规则区域[R]
 * 删除${不规则区域}
 * 
 */
declare function RemoveRegion(whichRegion: region): void;
declare function RemoveSaveDirectory(sourceDirName: string): boolean;
declare function RemoveSavedBoolean(table: hashtable, parentKey: number, childKey: number): void;
declare function RemoveSavedHandle(table: hashtable, parentKey: number, childKey: number): void;
declare function RemoveSavedInteger(table: hashtable, parentKey: number, childKey: number): void;
declare function RemoveSavedReal(table: hashtable, parentKey: number, childKey: number): void;
declare function RemoveSavedString(table: hashtable, parentKey: number, childKey: number): void;

/**
 * 删除
 * 删除${单位}
 * 被删除的单位不会留下尸体.如果是英雄则不能再被复活.
 */
declare function RemoveUnit(whichUnit: unit): void;

/**
 * 删除单位(所有市场)
 * 删除${单位类型}从所有市场
 * 影响所有拥有'出售单位'技能的单位.
 */
declare function RemoveUnitFromAllStock(unitId: number): void;
declare function RemoveUnitFromStock(whichUnit: unit, unitId: number): void;
declare function RemoveWeatherEffect(whichEffect: weathereffect): void;
declare function RenameSaveDirectory(sourceDirName: string, destDirName: string): boolean;
declare function ResetTerrainFog(): void;

/**
 * 重置游戏镜头(所有玩家)[R]
 * 重置玩家镜头为游戏默认状态,持续${Time}秒
 * 
 */
declare function ResetToGameCamera(duration: number): void;
declare function ResetTrigger(whichTrigger: trigger): void;

/**
 * 重置地面纹理变化
 * 重置${Ubersplat}
 * 
 */
declare function ResetUbersplat(whichSplat: ubersplat): void;

/**
 * 重置身体朝向
 * 重置${单位}的身体朝向
 * 恢复单位的身体朝向为正常状态.
 */
declare function ResetUnitLookAt(whichUnit: unit): void;
declare function RestartGame(doScoreScreen: boolean): void;
declare function RestoreUnit(cache: gamecache, missionKey: string, key: string, forWhichPlayer: player, x: number, y: number, facing: number): unit;
declare function ResumeMusic(): void;

/**
 * 恢复计时器[R]
 * 恢复${计时器}
 * 
 */
declare function ResumeTimer(whichTimer: timer): void;

/**
 * 立即复活(指定坐标)[R]
 * 立即复活${英雄}在(${X},${Y}),${Show/Hide}复活动画
 * 如果英雄正在祭坛复活,则会退回部分花费(默认为100%).
 */
declare function ReviveHero(whichHero: unit, x: number, y: number, doEyecandy: boolean): boolean;

/**
 * 立即复活(指定点)
 * 立即复活${英雄}在${指定点},${Show/Hide}复活动画
 * 如果英雄正在祭坛复活,则会退回部分花费(默认为100%).
 */
declare function ReviveHeroLoc(whichHero: unit, loc: location, doEyecandy: boolean): boolean;

/**
 * 转换字符串为整数
 * 转换${String}为整数
 * 
 */
declare function S2I(s: string): number;

/**
 * 转换字符串为实数
 * 转换${String}为实数
 * 
 */
declare function S2R(s: string): number;
declare function SaveAbilityHandle(table: hashtable, parentKey: number, childKey: number, whichAbility: ability): boolean;
declare function SaveAgentHandle(table: hashtable, parentKey: number, childKey: number, whichAgent: agent): boolean;

/**
 * <1.24>保存布尔
 * 保存布尔${Value}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取布尔'可以取出保存的值
 */
declare function SaveBoolean(table: hashtable, parentKey: number, childKey: number, value: boolean): void;

/**
 * <1.24>保存布尔表达式
 * 保存布尔表达式${Boolexpr}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取布尔表达式'可以取出保存的值
 */
declare function SaveBooleanExprHandle(table: hashtable, parentKey: number, childKey: number, whichBoolexpr: boolexpr | (() => boolean) | null): boolean;

/**
 * <1.24>保存对话框按钮
 * 保存对话框按钮${Button}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取对话框按钮'可以取出保存的值
 */
declare function SaveButtonHandle(table: hashtable, parentKey: number, childKey: number, whichButton: button): boolean;

/**
 * <1.24>保存失败条件
 * 保存失败条件${Defeatcondition}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取失败条件'可以取出保存的值
 */
declare function SaveDefeatConditionHandle(table: hashtable, parentKey: number, childKey: number, whichDefeatcondition: defeatcondition): boolean;

/**
 * <1.24>保存可破坏物
 * 保存可破坏物${Destructable}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取可破坏物'可以取出保存的值
 */
declare function SaveDestructableHandle(table: hashtable, parentKey: number, childKey: number, whichDestructable: destructable): boolean;

/**
 * <1.24>保存对话框
 * 保存对话框${Dialog}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取对话框'可以取出保存的值
 */
declare function SaveDialogHandle(table: hashtable, parentKey: number, childKey: number, whichDialog: dialog): boolean;

/**
 * <1.24>保存特效
 * 保存特效${Effect}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取特效'可以取出保存的值
 */
declare function SaveEffectHandle(table: hashtable, parentKey: number, childKey: number, whichEffect: effect): boolean;

/**
 * <1.24>保存可见度修正器
 * 保存可见度修正器${Fogmodifier}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取可见度修正器'可以取出保存的值
 */
declare function SaveFogModifierHandle(table: hashtable, parentKey: number, childKey: number, whichFogModifier: fogmodifier): boolean;

/**
 * <1.24>保存迷雾状态
 * 保存迷雾状态${Fogstate}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取迷雾状态'可以取出保存的值
 */
declare function SaveFogStateHandle(table: hashtable, parentKey: number, childKey: number, whichFogState: fogstate): boolean;

/**
 * <1.24>保存玩家组
 * 保存玩家组${Force}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取玩家组'可以取出保存的值
 */
declare function SaveForceHandle(table: hashtable, parentKey: number, childKey: number, whichForce: force): boolean;

/**
 * 保存进度[R]
 * 保存游戏进度为:${Filename}
 * 
 */
declare function SaveGame(saveFileName: string): void;
declare function SaveGameCache(whichCache: gamecache): boolean;

/**
 * 游戏存档存在
 * ${存档文件}已存在
 * 
 */
declare function SaveGameExists(saveName: string): boolean;

/**
 * <1.24>保存单位组
 * 保存单位组${Group}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取单位组'可以取出保存的值
 */
declare function SaveGroupHandle(table: hashtable, parentKey: number, childKey: number, whichGroup: group): boolean;
declare function SaveHashtableHandle(table: hashtable, parentKey: number, childKey: number, whichHashtable: hashtable): boolean;

/**
 * <1.24>保存图像
 * 保存图像${Image}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取图像'可以取出保存的值
 */
declare function SaveImageHandle(table: hashtable, parentKey: number, childKey: number, whichImage: image): boolean;

/**
 * <1.24>保存整数
 * 保存整数${Value}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取整数'可以取出保存的值
 */
declare function SaveInteger(table: hashtable, parentKey: number, childKey: number, value: number): void;

/**
 * <1.24>保存物品
 * 保存物品${Item}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取物品'可以取出保存的值
 */
declare function SaveItemHandle(table: hashtable, parentKey: number, childKey: number, whichItem: item): boolean;

/**
 * <1.24>保存物品池
 * 保存物品池${Itempool}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取物品池'可以取出保存的值
 */
declare function SaveItemPoolHandle(table: hashtable, parentKey: number, childKey: number, whichItempool: itempool): boolean;

/**
 * <1.24>保存排行榜
 * 保存排行榜${Leaderboard}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取排行榜'可以取出保存的值
 */
declare function SaveLeaderboardHandle(table: hashtable, parentKey: number, childKey: number, whichLeaderboard: leaderboard): boolean;

/**
 * <1.24>保存闪电效果
 * 保存闪电效果${Lightning}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取闪电效果'可以取出保存的值
 */
declare function SaveLightningHandle(table: hashtable, parentKey: number, childKey: number, whichLightning: lightning): boolean;

/**
 * <1.24>保存点
 * 保存点${Location}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取点'可以取出保存的值
 */
declare function SaveLocationHandle(table: hashtable, parentKey: number, childKey: number, whichLocation: location): boolean;

/**
 * <1.24>保存多面板
 * 保存多面板${Multiboard}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取多面板'可以取出保存的值
 */
declare function SaveMultiboardHandle(table: hashtable, parentKey: number, childKey: number, whichMultiboard: multiboard): boolean;

/**
 * <1.24>保存多面板项目
 * 保存多面板项目${Multiboarditem}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取多面板项目'可以取出保存的值
 */
declare function SaveMultiboardItemHandle(table: hashtable, parentKey: number, childKey: number, whichMultiboarditem: multiboarditem): boolean;

/**
 * <1.24>保存玩家
 * 保存玩家${Player}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取玩家'可以取出保存的值
 */
declare function SavePlayerHandle(table: hashtable, parentKey: number, childKey: number, whichPlayer: player): boolean;

/**
 * <1.24>保存任务
 * 保存任务${Quest}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取任务'可以取出保存的值
 */
declare function SaveQuestHandle(table: hashtable, parentKey: number, childKey: number, whichQuest: quest): boolean;

/**
 * <1.24>保存任务要求
 * 保存任务要求${Questitem}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取任务要求'可以取出保存的值
 */
declare function SaveQuestItemHandle(table: hashtable, parentKey: number, childKey: number, whichQuestitem: questitem): boolean;

/**
 * <1.24>保存实数
 * 保存实数${Value}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取实数'可以取出保存的值
 */
declare function SaveReal(table: hashtable, parentKey: number, childKey: number, value: number): void;

/**
 * <1.24>保存区域(矩型)
 * 保存区域(矩型)${Rect}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取区域(矩型)'可以取出保存的值
 */
declare function SaveRectHandle(table: hashtable, parentKey: number, childKey: number, whichRect: rect): boolean;

/**
 * <1.24>保存区域(不规则)
 * 保存区域(不规则)${Region}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取区域(不规则)'可以取出保存的值
 */
declare function SaveRegionHandle(table: hashtable, parentKey: number, childKey: number, whichRegion: region): boolean;

/**
 * <1.24>保存音效
 * 保存音效${Sound}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取音效'可以取出保存的值
 */
declare function SaveSoundHandle(table: hashtable, parentKey: number, childKey: number, whichSound: sound): boolean;
declare function SaveStr(table: hashtable, parentKey: number, childKey: number, value: string): boolean;

/**
 * <1.24>保存漂浮文字
 * 保存漂浮文字${Texttag}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取漂浮文字'可以取出保存的值
 */
declare function SaveTextTagHandle(table: hashtable, parentKey: number, childKey: number, whichTexttag: texttag): boolean;

/**
 * <1.24>保存计时器窗口
 * 保存计时器窗口${Timerdialog}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取计时器窗口'可以取出保存的值
 */
declare function SaveTimerDialogHandle(table: hashtable, parentKey: number, childKey: number, whichTimerdialog: timerdialog): boolean;

/**
 * <1.24>保存计时器
 * 保存计时器${Timer}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取计时器'可以取出保存的值
 */
declare function SaveTimerHandle(table: hashtable, parentKey: number, childKey: number, whichTimer: timer): boolean;

/**
 * <1.24>保存可追踪物
 * 保存可追踪物${Trackable}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取可追踪物'可以取出保存的值
 */
declare function SaveTrackableHandle(table: hashtable, parentKey: number, childKey: number, whichTrackable: trackable): boolean;

/**
 * <1.24>保存触发动作
 * 保存触发动作${Triggeraction}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取触发动作'可以取出保存的值
 */
declare function SaveTriggerActionHandle(table: hashtable, parentKey: number, childKey: number, whichTriggeraction: triggeraction): boolean;

/**
 * <1.24>保存触发条件
 * 保存触发条件${Triggercondition}在子索引${Value}of${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取触发条件'可以取出保存的值
 */
declare function SaveTriggerConditionHandle(table: hashtable, parentKey: number, childKey: number, whichTriggercondition: triggercondition): boolean;

/**
 * <1.24>保存触发事件
 * 保存触发事件${Event}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取触发事件'可以取出保存的值
 */
declare function SaveTriggerEventHandle(table: hashtable, parentKey: number, childKey: number, whichEvent: event): boolean;

/**
 * <1.24>保存触发器
 * 保存触发器${Trigger}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取触发器'可以取出保存的值
 */
declare function SaveTriggerHandle(table: hashtable, parentKey: number, childKey: number, whichTrigger: trigger): boolean;

/**
 * <1.24>保存地面纹理变化
 * 保存地面纹理变化${Ubersplat}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取地面纹理变化'可以取出保存的值
 */
declare function SaveUbersplatHandle(table: hashtable, parentKey: number, childKey: number, whichUbersplat: ubersplat): boolean;

/**
 * <1.24>保存单位
 * 保存单位${Unit}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取单位'可以取出保存的值
 */
declare function SaveUnitHandle(table: hashtable, parentKey: number, childKey: number, whichUnit: unit): boolean;

/**
 * <1.24>保存单位池
 * 保存单位池${Unitpool}在子索引${Value}主索引${Value}位于${Hashtable}之内
 * 使用'哈希表-从哈希表提取单位池'可以取出保存的值
 */
declare function SaveUnitPoolHandle(table: hashtable, parentKey: number, childKey: number, whichUnitpool: unitpool): boolean;
declare function SaveWidgetHandle(table: hashtable, parentKey: number, childKey: number, whichWidget: widget): boolean;

/**
 * 学习技能
 * 命令${Hero}学习技能${Skill}
 * 只有当英雄有剩余技能点时有效.
 */
declare function SelectHeroSkill(whichHero: unit, abilcode: number): void;
declare function SelectUnit(whichUnit: unit, flag: boolean): void;

/**
 * 限制物品种类(所有市场)
 * 限制所有市场的可出售物品种类数为${Quantity}
 * 影响所有拥有'出售物品'技能的单位.
 */
declare function SetAllItemTypeSlots(slots: number): void;

/**
 * 限制单位种类(所有市场)
 * 限制所有市场的可出售单位种类数为${Quantity}
 * 影响所有拥有'出售单位'技能的单位.
 */
declare function SetAllUnitTypeSlots(slots: number): void;

/**
 * 设置联盟颜色显示
 * 设置联盟颜色显示状态为${State}
 * 0为不开启.1为小地图显示.2为小地图和游戏都显示.相当于游戏中Alt+A功能.
 */
declare function SetAllyColorFilterState(state: number): void;

/**
 * 设置小地图特殊标志
 * 设置小地图特殊标志为${Image}
 * 必须使用16x16的图像.
 */
declare function SetAltMinimapIcon(iconPath: string): void;

/**
 * 创建/删除荒芜地表(圆范围)(指定坐标)[R]
 * 为${Player}在圆心为(${X},${Y}),半径为${R}的圆范围内${Create/Remove}一块荒芜地表
 * 
 */
declare function SetBlight(whichPlayer: player, x: number, y: number, radius: number, addBlight: boolean): void;
declare function SetBlightLoc(whichPlayer: player, whichLocation: location, radius: number, addBlight: boolean): void;
declare function SetBlightPoint(whichPlayer: player, x: number, y: number, addBlight: boolean): void;

/**
 * 创建/删除荒芜地表(矩形区域)[R]
 * 为${Player}在${Region}${Create/Remove}一块荒芜地表
 * 
 */
declare function SetBlightRect(whichPlayer: player, r: rect, addBlight: boolean): void;

/**
 * 设置可用镜头区域(所有玩家)[R]
 * 设置玩家可用镜头区域:左下角(${X},${Y}),左上角(${X},${Y}),右上角(${X},${Y}),右下角(${X},${Y})
 * 该动作同样会影响小地图的显示.但小地图的图片是无法改变的.实际可用区域要大于可用镜头区域.
 */
declare function SetCameraBounds(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): void;

/**
 * 设置镜头属性(所有玩家)(限时)[R]
 * 设置玩家的镜头属性${Field}为${数值},持续${Time}秒
 * 
 */
declare function SetCameraField(whichField: camerafield, value: number, duration: number): void;

/**
 * 锁定镜头到单位(固定镜头源)(所有玩家)[R]
 * 锁定玩家镜头到${单位},偏移坐标(${X},${Y})
 * 偏移坐标(X,Y)以单位脚底为原点坐标.
 */
declare function SetCameraOrientController(whichUnit: unit, xoffset: number, yoffset: number): void;
declare function SetCameraPosition(x: number, y: number): void;

/**
 * 设置空格键转向点(所有玩家)[R]
 * 设置玩家的空格键转向点为(${X},${Y})
 * 按下空格键时镜头转向的位置.
 */
declare function SetCameraQuickPosition(x: number, y: number): void;

/**
 * 指定点旋转镜头(所有玩家)(弧度)(限时)[R]
 * 以(${X},${Y})为中心,旋转弧度为${Rad},持续:${Time}秒
 * 
 */
declare function SetCameraRotateMode(x: number, y: number, radiansToSweep: number, duration: number): void;

/**
 * 锁定镜头到单位(所有玩家)[R]
 * 锁定玩家镜头到${单位},偏移坐标(${X},${Y}),使用${RotationSource}
 * 偏移坐标(X,Y)以单位脚底为原点坐标.
 */
declare function SetCameraTargetController(whichUnit: unit, xoffset: number, yoffset: number, inheritOrientation: boolean): void;
declare function SetCampaignAvailable(campaignNumber: number, available: boolean): void;
declare function SetCampaignMenuRace(r: race): void;
declare function SetCampaignMenuRaceEx(campaignIndex: number): void;
declare function SetCineFilterBlendMode(whichMode: blendmode): void;
declare function SetCineFilterDuration(duration: number): void;
declare function SetCineFilterEndColor(red: number, green: number, blue: number, alpha: number): void;
declare function SetCineFilterEndUV(minu: number, minv: number, maxu: number, maxv: number): void;
declare function SetCineFilterStartColor(red: number, green: number, blue: number, alpha: number): void;
declare function SetCineFilterStartUV(minu: number, minv: number, maxu: number, maxv: number): void;
declare function SetCineFilterTexMapFlags(whichFlags: texmapflags): void;
declare function SetCineFilterTexture(filename: string): void;

/**
 * 播放电影镜头(所有玩家)[R]
 * 对所有玩家播放电影镜头:${CameraFile}
 * 在'Objects\\CinematicCameras'目录下有一些电影镜头,可用Mpq工具来查询.
 */
declare function SetCinematicCamera(cameraModelFile: string): void;
declare function SetCinematicScene(portraitUnitId: number, color: playercolor, speakerTitle: string, text: string, sceneDuration: number, voiceoverDuration: number): void;
declare function SetCreatureDensity(whichdensity: mapdensity): void;

/**
 * 设置小地图中立生物显示
 * 小地图${Show/Hide}中立生物
 * 相当于游戏中Alt+R功能.
 */
declare function SetCreepCampFilterState(state: boolean): void;
declare function SetCustomCampaignButtonVisible(whichButton: number, visible: boolean): void;
declare function SetDayNightModels(terrainDNCFile: string, unitDNCFile: string): void;
declare function SetDefaultDifficulty(g: gamedifficulty): void;
declare function SetDestructableAnimation(d: destructable, whichAnimation: string): void;

/**
 * 改变可破坏物动画播放速度[R]
 * 改变${可破坏物}的动画播放速度为正常的${Percent}倍
 * 设置1倍动画播放速度来恢复正常状态.
 */
declare function SetDestructableAnimationSpeed(d: destructable, speedFactor: number): void;
declare function SetDestructableInvulnerable(d: destructable, flag: boolean): void;

/**
 * 设置生命值(指定值)
 * 设置${可破坏物}的生命值为${Value}
 * 
 */
declare function SetDestructableLife(d: destructable, life: number): void;
declare function SetDestructableMaxLife(d: destructable, max: number): void;

/**
 * 设置闭塞高度
 * 设置${可破坏物}的闭塞高度为${Height}
 * 
 */
declare function SetDestructableOccluderHeight(d: destructable, height: number): void;

/**
 * 播放圆范围内地形装饰物动画[R]
 * 选取圆心为(${X},${Y}),半径为${半径}的圆范围内的${装饰物类型}(选取方式:${选取方式}),做${AnimationName}动作(${允许/禁止}随机播放)
 * 特殊动画名:'show','hide','soundon','soundoff'.随机播放:比如某装饰物有好几个'stand'动作,则允许该项时会随机抽取某个动作播放,而禁止该项时只播放首个动作.
 */
declare function SetDoodadAnimation(x: number, y: number, radius: number, doodadID: number, nearestOnly: boolean, animName: string, animRandom: boolean): void;

/**
 * 播放矩形区域内地形装饰物动画[R]
 * 播放${Rect}内所有${装饰物类型}的${AnimationName}动作(${允许/禁止}随机播放)
 * 特殊动画名:'show','hide','soundon','soundoff'.随机播放:比如某装饰物有好几个'stand'动作,则允许该项时会随机抽取某个动作播放,而禁止该项时只播放首个动作.
 */
declare function SetDoodadAnimationRect(r: rect, doodadID: number, animName: string, animRandom: boolean): void;
declare function SetEdCinematicAvailable(campaignNumber: number, available: boolean): void;
declare function SetFloatGameState(whichFloatGameState: fgamestate, value: number): void;

/**
 * 设置地图迷雾(圆范围)[R]
 * 为${玩家}设置${FogStateVisible}在圆心为(${X},${Y})半径为${数值}的范围,(对盟友${共享}视野)
 * 
 */
declare function SetFogStateRadius(forWhichPlayer: player, whichState: fogstate, centerx: number, centerY: number, radius: number, useSharedVision: boolean): void;
declare function SetFogStateRadiusLoc(forWhichPlayer: player, whichState: fogstate, center: location, radius: number, useSharedVision: boolean): void;

/**
 * 设置地图迷雾(矩形区域)[R]
 * 为${玩家}设置${FogStateVisible}在${矩形区域}(对盟友${共享}视野)
 * 
 */
declare function SetFogStateRect(forWhichPlayer: player, whichState: fogstate, where: rect, useSharedVision: boolean): void;

/**
 * 设置游戏难度[R]
 * 设置当前游戏难度为${GameDifficulty}
 * 游戏难度只是作为运行AI的一个参考值,没有AI的地图该功能无用.
 */
declare function SetGameDifficulty(whichdifficulty: gamedifficulty): void;
declare function SetGamePlacement(whichPlacementType: placement): void;

/**
 * 设定游戏速度
 * 设定游戏速度为${Speed}
 * 你可以通过'游戏-锁定游戏速度'动作来锁定游戏速度.
 */
declare function SetGameSpeed(whichspeed: gamespeed): void;
declare function SetGameTypeSupported(whichGameType: gametype, value: boolean): void;

/**
 * 设置英雄敏捷[R]
 * 设置${英雄}的敏捷为${Value},(${Permanent}永久奖励)
 * 永久奖励貌似无效项,不需要理会.
 */
declare function SetHeroAgi(whichHero: unit, newAgi: number, permanent: boolean): void;

/**
 * 设置英雄智力[R]
 * 设置${英雄}的智力为${Value},(${Permanent}永久奖励)
 * 永久奖励貌似无效项,不需要理会.
 */
declare function SetHeroInt(whichHero: unit, newInt: number, permanent: boolean): void;
declare function SetHeroLevel(whichHero: unit, level: number, showEyeCandy: boolean): void;

/**
 * 设置英雄力量[R]
 * 设置${英雄}的力量为${Value},(${Permanent}永久奖励)
 * 永久奖励貌似无效项,不需要理会.
 */
declare function SetHeroStr(whichHero: unit, newStr: number, permanent: boolean): void;

/**
 * 设置经验值
 * 设置${Hero}的经验值为${Quantity},${Show/Hide}升级动画
 * 经验值不能倒退.
 */
declare function SetHeroXP(whichHero: unit, newXpVal: number, showEyeCandy: boolean): void;

/**
 * 图像水面显示状态
 * 设置${Image}:${Enable/Disable}水面显示,${Enable/Disable}水的Alpha通道
 * 前者设置图像在水面或是水底显示.后者设置图像是否受水的Alpha通道影响.
 */
declare function SetImageAboveWater(whichImage: image, flag: boolean, useWaterAlpha: boolean): void;

/**
 * 改变图像颜色
 * 设置${Image}的颜色值为(${Red}%,${Green}%,${Blue}%)透明度为${Transparency}%
 * 颜色格式为(红,绿,蓝).透明度100%是不可见的.
 */
declare function SetImageColor(whichImage: image, red: number, green: number, blue: number, alpha: number): void;

/**
 * 设置图像高度
 * 设置${Image}${Enable/Disable}Z轴显示,并设置高度为${Height}
 * 实际显示高度为图像高度+Z轴偏移.只有允许Z轴显示时才有效.
 */
declare function SetImageConstantHeight(whichImage: image, flag: boolean, height: number): void;

/**
 * 改变图像位置(指定点)
 * 改变${Image}的位置为${Position},Z轴偏移为${Z}
 * 指图像的左下角位置.
 */
declare function SetImagePosition(whichImage: image, x: number, y: number, z: number): void;

/**
 * 设置图像渲染状态
 * 设置${Image}:${Enable/Disable}显示状态
 * 未发现有任何作用.
 */
declare function SetImageRender(whichImage: image, flag: boolean): void;

/**
 * 设置图像永久渲染状态
 * 设置${Image}:${Enable/Disable}永久显示状态
 * 要显示图像则必须开启该项.
 */
declare function SetImageRenderAlways(whichImage: image, flag: boolean): void;

/**
 * 改变图像类型
 * 改变${Image}类型为${Type}
 * 
 */
declare function SetImageType(whichImage: image, imageType: number): void;
declare function SetIntegerGameState(whichIntegerGameState: igamestate, value: number): void;
declare function SetIntroShotModel(introModelPath: string): void;
declare function SetIntroShotText(introText: string): void;

/**
 * 设置物品使用次数
 * 设置${物品}的使用次数为${Charges}
 * 设置为0可以使物品能无限次使用.
 */
declare function SetItemCharges(whichItem: item, charges: number): void;

/**
 * 设置重生神符的产生单位类型
 * 设置${物品}产生${单位类型}
 * 设置重生神符对应的单位类型后，当英雄吃了重生神符，则会产生指定类型的单位。
 */
declare function SetItemDropID(whichItem: item, unitId: number): void;
declare function SetItemDropOnDeath(whichItem: item, flag: boolean): void;
declare function SetItemDroppable(i: item, flag: boolean): void;
declare function SetItemInvulnerable(whichItem: item, flag: boolean): void;

/**
 * 设置物品可否抵押
 * 设置${物品}${Pawnable/Unpawnable}
 * 不可抵押物品不能被卖到商店.
 */
declare function SetItemPawnable(i: item, flag: boolean): void;
declare function SetItemPlayer(whichItem: item, whichPlayer: player, changeColor: boolean): void;

/**
 * 移动物品到坐标(立即)(指定坐标)[R]
 * 移动${物品}到(${X},${Y})
 * 
 */
declare function SetItemPosition(i: item, x: number, y: number): void;

/**
 * 限制物品种类(指定市场)
 * 限制${Marketplace}的可出售物品种类数为${Quantity}
 * 只影响有'出售物品'技能的单位.
 */
declare function SetItemTypeSlots(whichUnit: unit, slots: number): void;

/**
 * 设置物品自定义值
 * 设置${物品}的自定义值为${Index}
 * 物品自定义值只用于触发器.可以用来为物品绑定一个整型数据.
 */
declare function SetItemUserData(whichItem: item, data: number): void;

/**
 * 显示/隐藏[R]
 * 设置${物品}的状态为:${Show/Hide}
 * 只对在地面的物品有效,不会影响在物品栏中的物品.单位通过触发得到一个隐藏物品时,会自动显示该物品.
 */
declare function SetItemVisible(whichItem: item, show: boolean): void;
declare function SetLightningColor(whichBolt: lightning, r: number, g: number, b: number, a: number): boolean;
declare function SetMapDescription(description: string): void;

/**
 * 设置地图参数
 * 设置${MapFlag}为${On/Off}
 * 
 */
declare function SetMapFlag(whichMapFlag: mapflag, value: boolean): void;

/**
 * 设置背景音乐列表[R]
 * 设置背景音乐列表为:${Music},${允许/禁止}随机播放,开始播放序号为${Index}
 * 可指定播放文件或播放目录.
 */
declare function SetMapMusic(musicName: string, random: boolean, index: number): void;
declare function SetMapName(name: string): void;
declare function SetMissionAvailable(campaignNumber: number, missionNumber: number, available: boolean): void;
declare function SetMusicPlayPosition(millisecs: number): void;

/**
 * 设置背景音乐音量[R]
 * 设置背景音乐音量为${Volume}
 * 音量取值范围为0-127.
 */
declare function SetMusicVolume(volume: number): void;
declare function SetOpCinematicAvailable(campaignNumber: number, available: boolean): void;

/**
 * 允许/禁用技能[R]
 * 设置${Player}的${技能}为${Enable/Disable}
 * 设置玩家能否使用该技能.
 */
declare function SetPlayerAbilityAvailable(whichPlayer: player, abilid: number, avail: boolean): void;

/**
 * 设置联盟状态(指定项目)[R]
 * 命令${Player}对${Player}设置${AllianceType}${On/Off}
 * 注意:可以对玩家自己设置联盟状态.可用来实现一些特殊效果.
 */
declare function SetPlayerAlliance(sourcePlayer: player, otherPlayer: player, whichAllianceSetting: alliancetype, value: boolean): void;

/**
 * 改变玩家颜色[R]
 * 将${Player}的玩家颜色改为${Color}
 * 不改变现有单位的颜色.
 */
declare function SetPlayerColor(whichPlayer: player, color: playercolor): void;
declare function SetPlayerController(whichPlayer: player, controlType: mapcontrol): void;

/**
 * 设置生命上限[R]
 * 设置${Player}的生命障碍为正常的${Percent}倍
 * 生命上限影响玩家拥有单位的生命最大值.生命之书并不受生命上限限制,所以对英雄血量可能会有偏差.
 */
declare function SetPlayerHandicap(whichPlayer: player, handicap: number): void;

/**
 * 设置经验获得率[R]
 * 设置${Player}的经验获得率为正常的${Value}倍
 * 
 */
declare function SetPlayerHandicapXP(whichPlayer: player, handicap: number): void;

/**
 * 更改名字
 * 更改${Player}的名字为${文字}
 * 
 */
declare function SetPlayerName(whichPlayer: player, name: string): void;

/**
 * 显示/隐藏计分屏显示[R]
 * 设置${Player}${Show/Hide}在计分屏的显示.
 * 
 */
declare function SetPlayerOnScoreScreen(whichPlayer: player, flag: boolean): void;
declare function SetPlayerRacePreference(whichPlayer: player, whichRacePreference: racepreference): void;
declare function SetPlayerRaceSelectable(whichPlayer: player, value: boolean): void;
declare function SetPlayerStartLocation(whichPlayer: player, startLocIndex: number): void;
declare function SetPlayerState(whichPlayer: player, whichPlayerState: playerstate, value: number): void;

/**
 * 设置税率
 * 设置${Rate}%的${Resource}所得税,${Player}交纳给${Player}
 * 缴纳所得税所损失的资源可以通过'玩家得分'的'税务损失的黄金/木材'来获取.所得税最高为100%.且玩家1对玩家2和玩家3都交纳80%所得税.则玩家1采集黄金时将给玩家28黄金,玩家32黄金.
 */
declare function SetPlayerTaxRate(sourcePlayer: player, otherPlayer: player, whichResource: playerstate, rate: number): void;

/**
 * 设置玩家队伍
 * 设置${Player}的队伍为${队伍ID}
 * 
 */
declare function SetPlayerTeam(whichPlayer: player, whichTeam: number): void;
declare function SetPlayerTechMaxAllowed(whichPlayer: player, techid: number, maximum: number): void;
declare function SetPlayerTechResearched(whichPlayer: player, techid: number, setToLevel: number): void;
declare function SetPlayerUnitsOwner(whichPlayer: player, newOwner: number): void;
declare function SetPlayers(playercount: number): void;

/**
 * 设置随机种子
 * 设置随机种子数为：${整数}
 * 设置游戏的随机种子，随机种子会影响随机整数，攻击骰子之类的随机数。
 */
declare function SetRandomSeed(seed: number): void;

/**
 * 设置矩形区域(指定坐标)[R]
 * 重新设置${矩形区域},左下角坐标为(${X},${Y}),右上角坐标为(${X},${Y})
 * 该区域必须是一个变量.重新设置矩形区域的大小和位置.
 */
declare function SetRect(whichRect: rect, minx: number, miny: number, maxx: number, maxy: number): void;

/**
 * 设置矩形区域(指定点)[R]
 * 重新设置${矩形区域},左下角点为${点}右上角点为${点}
 * 该区域必须是一个变量.重新设置矩形区域的大小和位置.
 */
declare function SetRectFromLoc(whichRect: rect, min: location, max: location): void;

/**
 * 保留英雄图标
 * 为玩家保留${Number}个左上角英雄图标.
 * 因为共享单位而被控制的其他玩家英雄的图标将在保留位置之后开始显示.
 */
declare function SetReservedLocalHeroButtons(reserved: number): void;

/**
 * 设置黄金储量
 * 设置${金矿}的黄金储量为${Quantity}
 * 
 */
declare function SetResourceAmount(whichUnit: unit, amount: number): void;
declare function SetResourceDensity(whichdensity: mapdensity): void;

/**
 * 设置天空
 * 设置天空模型为${Sky}
 * 
 */
declare function SetSkyModel(skyModelFile: string): void;
declare function SetSoundChannel(soundHandle: sound, channel: number): void;
declare function SetSoundConeAngles(soundHandle: sound, inside: number, outside: number, outsideVolume: number): void;
declare function SetSoundConeOrientation(soundHandle: sound, x: number, y: number, z: number): void;
declare function SetSoundDistanceCutoff(soundHandle: sound, cutoff: number): void;

/**
 * 设置3D音效衰减范围
 * 设置${3D音效}的衰减最小范围:${数值}最大范围:${数值}
 * 该动作仅用于3D音效.注意不一定要达到最大范围,音量衰减到一定程度也会变没的.
 */
declare function SetSoundDistances(soundHandle: sound, minDist: number, maxDist: number): void;
declare function SetSoundDuration(soundHandle: sound, duration: number): void;
declare function SetSoundParamsFromLabel(soundHandle: sound, soundLabel: string): void;
declare function SetSoundPitch(soundHandle: sound, pitch: number): void;

/**
 * 设置音效播放时间点[R]
 * 设置${音效}的播放时间点为${Offset}毫秒
 * 音效必须是正在播放的.不能用于3D音效.
 */
declare function SetSoundPlayPosition(soundHandle: sound, millisecs: number): void;

/**
 * 设置3D音效位置(指定坐标)[R]
 * 设置${3D音效}的播放位置为(${X},${Y}),Z轴高度为${Z}
 * 该动作仅用于3D音效.
 */
declare function SetSoundPosition(soundHandle: sound, x: number, y: number, z: number): void;
declare function SetSoundVelocity(soundHandle: sound, x: number, y: number, z: number): void;

/**
 * 设置音效音量[R]
 * 设置${音效}的音量为${Volume}
 * 音量取值范围0-127.
 */
declare function SetSoundVolume(soundHandle: sound, volume: number): void;
declare function SetStackedSound(...option:any[]):any;
declare function SetStackedSoundRect(...option:any[]):any;
declare function SetStartLocPrio(whichStartLoc: number, prioSlotIndex: number, otherStartLocIndex: number, priority: startlocprio): void;
declare function SetStartLocPrioCount(whichStartLoc: number, prioSlotCount: number): void;
declare function SetTeams(teamcount: number): void;
declare function SetTerrainFog(a: number, b: number, c: number, d: number, e: number): void;

/**
 * 设置迷雾[R]
 * 迷雾风格:${Style},Z轴开始端:${Z-Start},Z轴结束端:${Z-End},密度:${Density}颜色:(${Red},${Green},${Blue})
 * 颜色格式为(红,绿,蓝).取值范围0.00-1.00.
 */
declare function SetTerrainFogEx(style: number, zstart: number, zend: number, density: number, red: number, green: number, blue: number): void;

/**
 * 设置地形通行状态(指定点)
 * 设置${指定点}处单元点的${Pathing}地形通行状态为:${On/Off}
 * 例:设置'建造'通行状态为开,则该点可以建造建筑.一个单元点范围为32x32.
 */
declare function SetTerrainPathable(x: number, y: number, t: pathingtype, flag: boolean): void;

/**
 * 改变地形类型(指定点)
 * 改变${指定点}处的地形为${TerrainType},使用样式:${Variation}范围:${Area}形状:${Shape}
 * 地形样式-1表示随机样式.范围即地形编辑器中的刷子大小.1表示128x128范围
 */
declare function SetTerrainType(x: number, y: number, terrainType: number, variation: number, area: number, shape: number): void;
declare function SetTextTagAge(t: texttag, age: number): void;

/**
 * 改变颜色[R]
 * 改变${FloatingText}的颜色为(${Red},${Green},${Blue})透明值为${Transparency}
 * 颜色格式为(红,绿,蓝).透明值0为不可见.颜色值和透明值取值范围为0-255.
 */
declare function SetTextTagColor(t: texttag, red: number, green: number, blue: number, alpha: number): void;
declare function SetTextTagFadepoint(t: texttag, fadepoint: number): void;
declare function SetTextTagLifespan(t: texttag, lifespan: number): void;
declare function SetTextTagPermanent(t: texttag, flag: boolean): void;

/**
 * 改变位置(点)
 * 改变${FloatingText}的位置为${指定点},Z轴高度为${Z}
 * 
 */
declare function SetTextTagPos(t: texttag, x: number, y: number, heightOffset: number): void;
declare function SetTextTagPosUnit(t: texttag, whichUnit: unit, heightOffset: number): void;
declare function SetTextTagSuspended(t: texttag, flag: boolean): void;

/**
 * 改变文字内容
 * 改变${FloatingText}的内容为${文字},字体大小:${Size}
 * 
 */
declare function SetTextTagText(t: texttag, s: string, height: number): void;

/**
 * 设置速率[R]
 * 设置${FloatingText}的X轴速率:${XSpeed},Y轴速率:${YSpeed}
 * 对移动后的漂浮文字设置速率,该漂浮文字会先回到原点再向设定的角度移动.这里的1约等于游戏中的1800速度.
 */
declare function SetTextTagVelocity(t: texttag, xvel: number, yvel: number): void;

/**
 * 显示/隐藏(所有玩家)[R]
 * 对所有玩家${Show/Hide}${FloatingText}
 * 
 */
declare function SetTextTagVisibility(t: texttag, flag: boolean): void;

/**
 * 设置主题音乐播放时间点[R]
 * 设置当前主题音乐播放时间点为${Offset}毫秒
 * 
 */
declare function SetThematicMusicPlayPosition(millisecs: number): void;

/**
 * 设置昼夜时间流逝速度[R]
 * 设置昼夜时间流逝速度为默认值的${Value}倍
 * 设置100%来恢复正常值.该值并不影响游戏速度.
 */
declare function SetTimeOfDayScale(r: number): void;
declare function SetTutorialCleared(cleared: boolean): void;

/**
 * 设置渲染状态
 * 设置${Ubersplat}:${Enable/Disable}渲染状态
 * 未发现有任何作用.
 */
declare function SetUbersplatRender(whichSplat: ubersplat, flag: boolean): void;

/**
 * 设置永久渲染状态
 * 设置${Ubersplat}:${Enable/Disable}永久渲染状态
 * 要显示地面纹理变化则必须开启该项.
 */
declare function SetUbersplatRenderAlways(whichSplat: ubersplat, flag: boolean): void;

/**
 * 设置技能等级[R]
 * 设置${单位}的${技能}等级为${Level}
 * 改变死亡单位的光环技能会导致魔兽崩溃.
 */
declare function SetUnitAbilityLevel(whichUnit: unit, abilcode: number, level: number): number;
declare function SetUnitAcquireRange(whichUnit: unit, newAcquireRange: number): void;

/**
 * 播放单位动画
 * 播放${Unit}的${动画名}动作
 * 通过'重置单位动作'恢复到普通的动作.
 */
declare function SetUnitAnimation(whichUnit: unit, whichAnimation: string): void;

/**
 * 播放单位指定序号动动作[R]
 * 播放${单位}的第${序号}号动作
 * 可以指定播放所有的单位动画,不过需要自己多尝试.每个单位的动作序号不一样的.
 */
declare function SetUnitAnimationByIndex(whichUnit: unit, whichAnimation: number): void;

/**
 * 播放单位动运作(指定概率)
 * 播放${单位}的${AnimationName}动作,只用${Rarity}动作
 * 通过'重置单位动作'恢复到普通的动作.
 */
declare function SetUnitAnimationWithRarity(whichUnit: unit, whichAnimation: string, rarity: raritycontrol): void;
declare function SetUnitBlendTime(whichUnit: unit, blendTime: number): void;

/**
 * 改变队伍颜色
 * 改变${单位}的队伍颜色为${Color}
 * 改变队伍颜色并不会改变单位所属.
 */
declare function SetUnitColor(whichUnit: unit, whichColor: playercolor): void;

/**
 * 锁定指定单位的警戒点[R]
 * 设置${单位}的警戒点:${option}
 * 锁定并防止AI脚本改动单位警戒点.
 */
declare function SetUnitCreepGuard(whichUnit: unit, creepGuard: boolean): void;
declare function SetUnitExploded(whichUnit: unit, exploded: boolean): void;

/**
 * 设置单位面向角度[R]
 * 设置${单位}的面向角度为${Angle}度
 * 面向角度采用角度制,0度为正东方向,90度为正北方向。速度等于单位的转身速度。
 */
declare function SetUnitFacing(whichUnit: unit, facingAngle: number): void;

/**
 * 设置单位面向角度(指定时间)
 * 设置${单位}的面向角度为${Angle}度,使用时间${Time}秒
 * 面向角度采用角度制,0度为正东方向,90度为正北方向。不能超过单位的转身速度。
 */
declare function SetUnitFacingTimed(whichUnit: unit, facingAngle: number, duration: number): void;
declare function SetUnitFlyHeight(whichUnit: unit, newHeight: number, rate: number): void;
declare function SetUnitFog(a: number, b: number, c: number, d: number, e: number): void;

/**
 * 设置无敌/可攻击
 * 设置${单位}${Invulnerable/Vulnerable}
 * 
 */
declare function SetUnitInvulnerable(whichUnit: unit, flag: boolean): void;

/**
 * 锁定身体朝向
 * 锁定${单位}的${Source}朝向${目标单位},偏移坐标(${X},${Y},${Z})
 * 单位的该身体部件会一直朝向目标单位的偏移坐标点处,直到使用'重置身体朝向'.坐标偏移以目标单位脚下为坐标原点.
 */
declare function SetUnitLookAt(whichUnit: unit, whichBone: string, lookAtTarget: unit, offsetX: number, offsetY: number, offsetZ: number): void;

/**
 * 设置移动速度
 * 设置${单位}的移动速度为${Speed}
 * 
 */
declare function SetUnitMoveSpeed(whichUnit: unit, newSpeed: number): void;

/**
 * 改变所属
 * 改变${单位}所属为${Player}并${Change/RetainColor}
 * 
 */
declare function SetUnitOwner(whichUnit: unit, whichPlayer: player, changeColor: boolean): void;

/**
 * 设置碰撞开关
 * 设置${单位}${On/Off}碰撞
 * 关闭碰撞的单位无视障碍物,但其他单位仍视其为障碍物.
 */
declare function SetUnitPathing(whichUnit: unit, flag: boolean): void;

/**
 * 移动单位(立即)(指定坐标)[R]
 * 立即移动${单位}到(${X},${Y})
 * 
 */
declare function SetUnitPosition(whichUnit: unit, newX: number, newY: number): void;

/**
 * 移动单位(立即)(指定点)
 * 立即移动${单位}到${指定点}
 * 
 */
declare function SetUnitPositionLoc(whichUnit: unit, whichLocation: location): void;

/**
 * 改变单位转向角度(弧度制)[R]
 * 改变${单位}的转向角度为${数值}(弧度制)
 * 设置单位转身时的转向角度.数值越大转向幅度越大.
 */
declare function SetUnitPropWindow(whichUnit: unit, newPropWindowAngle: number): void;

/**
 * 设置可否营救(对玩家)[R]
 * 设置${单位}对${玩家}${Rescuable/Unrescuable}
 * 
 */
declare function SetUnitRescuable(whichUnit: unit, byWhichPlayer: player, flag: boolean): void;

/**
 * 设置营救范围
 * 设置${单位}的营救范围为${Range}
 * 
 */
declare function SetUnitRescueRange(whichUnit: unit, range: number): void;

/**
 * 改变单位尺寸(按倍数)[R]
 * 改变${单位}的尺寸缩放为:(${X},${Y},${Z})
 * 缩放尺寸使用(长,宽,高)格式.
 */
declare function SetUnitScale(whichUnit: unit, scaleX: number, scaleY: number, scaleZ: number): void;

/**
 * 设置单位属性[R]
 * 设置${单位}的${属性}为${Value}
 * 
 */
declare function SetUnitState(whichUnit: unit, whichUnitState: unitstate, newVal: number): void;

/**
 * 改变单位动画播放速度(按倍数)[R]
 * 改变${单位}的动画播放速度为正常速度的${Percent}倍
 * 设置1倍动画播放速度来恢复正常状态.
 */
declare function SetUnitTimeScale(whichUnit: unit, timeScale: number): void;
declare function SetUnitTurnSpeed(whichUnit: unit, newTurnSpeed: number): void;

/**
 * 限制单位种类(指定市场)
 * 限制${Marketplace}的可出售单位种类数为${Quantity}
 * 只影响有'出售单位'技能的单位.
 */
declare function SetUnitTypeSlots(whichUnit: unit, slots: number): void;

/**
 * 允许/禁止人口占用[R]
 * 设置${单位}:${Enable/Disable}其人口占用
 * 
 */
declare function SetUnitUseFood(whichUnit: unit, useFood: boolean): void;

/**
 * 设置自定义值
 * 设置${单位}的自定义值为${Index}
 * 单位自定义值仅用于触发器.可用来给单位绑定一个整型数据.
 */
declare function SetUnitUserData(whichUnit: unit, data: number): void;

/**
 * 改变单位的颜色(RGB:0-255)[R]
 * 改变${单位}的颜色值:(${Red},${Green},${Blue}),透明值:${Transparency}
 * 颜色格式为(红,绿,蓝).大多数单位使用(255,255,255)的颜色值和255的Alpha值.透明值为0是不可见的.颜色值和Alpha值取值范围为0-255.
 */
declare function SetUnitVertexColor(whichUnit: unit, red: number, green: number, blue: number, alpha: number): void;

/**
 * 设置X坐标[R]
 * 设置${单位}的X坐标为${X}
 * 注意如果坐标超出地图边界是会出错的.
 */
declare function SetUnitX(whichUnit: unit, newX: number): void;

/**
 * 设置Y坐标[R]
 * 设置${单位}的Y坐标为${Y}
 * 注意如果坐标超出地图边界是会出错的.
 */
declare function SetUnitY(whichUnit: unit, newY: number): void;

/**
 * 设置水颜色[R]
 * 设置水颜色为:(${Red},${Green},${Blue}),透明值为:${Transparency}
 * 颜色格式为(红,绿,蓝).透明值0为不可见.颜色值和透明道值取值范围为0-255.
 */
declare function SetWaterBaseColor(red: number, green: number, blue: number, alpha: number): void;

/**
 * 开启/关闭水面变形
 * ${On/Off}水面变形
 * 开启时当发生地形变化时水面高度也会随着变化.对永久变形无效.
 */
declare function SetWaterDeforms(val: boolean): void;
declare function SetWidgetLife(whichWidget: widget, newLife: number): void;

/**
 * 显示/隐藏[R]
 * 设置${可破坏物}的状态为${Show/Hide}
 * 隐藏的可破坏物不被显示,但仍影响通行和视线.
 */
declare function ShowDestructable(d: destructable, flag: boolean): void;

/**
 * 显示/隐藏图像
 * ${Show/Hide}${Image}
 * 
 */
declare function ShowImage(whichImage: image, flag: boolean): void;

/**
 * 开启/关闭信箱模式(所有玩家)[R]
 * ${开启/关闭}信箱模式,转换时间为${Duration}秒
 * 使用电影镜头模式,隐藏游戏界面.
 */
declare function ShowInterface(flag: boolean, fadeDuration: number): void;

/**
 * 显示/隐藏地面纹理变化
 * ${Show/Hide}${Ubersplat}
 * 
 */
declare function ShowUbersplat(whichSplat: ubersplat, flag: boolean): void;

/**
 * 显示/隐藏[R]
 * 设置${单位}的状态为${显示/隐藏}
 * 隐藏单位不会被'区域内单位'所选取.
 */
declare function ShowUnit(whichUnit: unit, show: boolean): void;

/**
 * 正弦(弧度)[R]
 * Sin(${Angle})
 * 采用弧度制计算.
 */
declare function Sin(radians: number): number;

/**
 * 平方根
 * ${实数}的平方根
 * 
 */
declare function SquareRoot(x: number): number;

/**
 * 启用战役AI
 * 为${Player}启用战役AI:${Script}
 * AI只能对电脑玩家使用,当运行该动作后,与之配匹的电脑玩家会强制执行该AI脚本.
 */
declare function StartCampaignAI(num: player, script: string): void;

/**
 * 启用对战AI
 * 为${Player}启用对战AI:${Script}
 * AI只能对电脑玩家使用,当运行该动作后,与之配匹的电脑玩家会强制执行该AI脚本.
 */
declare function StartMeleeAI(num: player, script: string): void;
declare function StartSound(soundHandle: sound): void;

/**
 * 停止播放镜头(所有玩家)[R]
 * 让所有玩家停止播放镜头
 * 比如在平移镜头的过程中可用该动作来中断平移.
 */
declare function StopCamera(): void;
declare function StopMusic(fadeOut: boolean): void;
declare function StopSound(soundHandle: sound, killWhenDone: boolean, fadeOut: boolean): void;

/**
 * 记录布尔值
 * 缓存:${GameCache}类别名:${Category}使用名称:${文字}记录:${布尔值}
 * 使用'游戏缓存-读取布尔值'来读取该值.名称和类别名不能包含空格.
 */
declare function StoreBoolean(cache: gamecache, missionKey: string, key: string, value: boolean): void;

/**
 * 记录整数
 * 缓存:${GameCache}类别名:${Category}使用名称:${文字}记录:${整数}
 * 使用'游戏缓存-读取整数'来读取该数值.名称和类别名不能包含空格.
 */
declare function StoreInteger(cache: gamecache, missionKey: string, key: string, value: number): void;

/**
 * 记录实数
 * 缓存:${GameCache}类别名:${Category}使用名称:${文字}记录:${实数}
 * 使用'游戏缓存-读取实数'来读取该数值.名称和类别名不能包含空格.
 */
declare function StoreReal(cache: gamecache, missionKey: string, key: string, value: number): void;

/**
 * 记录字符串
 * 缓存:${GameCache}类别名:${Category}使用名称:${文字}记录:${字符串}
 * 使用'游戏缓存-读取字符串'来读取该值.名称和类别名不能包含空格.
 */
declare function StoreString(cache: gamecache, missionKey: string, key: string, value: string): boolean;
declare function StoreUnit(cache: gamecache, missionKey: string, key: string, whichUnit: unit): boolean;

/**
 * 大小写转换
 * 转换${字符串}为${Lower/UpperCase}形式
 * 
 */
declare function StringCase(source: string, upper: boolean): string;

/**
 * <1.24>获取字符串的哈希值
 * 转换${String}为整数
 * 创建一个对应该字符串的永久密钥,可以在哈希表中作为索引号使用
 */
declare function StringHash(s: string): number;

/**
 * 字符串长度
 * ${String}的长度
 * 
 */
declare function StringLength(s: string): number;

/**
 * 截取字符串[R]
 * 截取${字符串}的${Start}-${End}字节部分(不包括首字节)
 * 例:截取''Gruntsstink''的2-4字节部分=''un''.
 */
declare function SubString(source: string, start: number, end: number): string;

/**
 * 允许/禁止经验获取[R]
 * ${Enable/Disable}${Hero}的经验获取
 * 
 */
declare function SuspendHeroXP(whichHero: unit, flag: boolean): void;
declare function SuspendTimeOfDay(b: boolean): void;
declare function SyncSelections(): void;
declare function SyncStoredBoolean(cache: gamecache, missionKey: string, key: string): void;
declare function SyncStoredInteger(cache: gamecache, missionKey: string, key: string): void;
declare function SyncStoredReal(cache: gamecache, missionKey: string, key: string): void;
declare function SyncStoredString(cache: gamecache, missionKey: string, key: string): void;
declare function SyncStoredUnit(cache: gamecache, missionKey: string, key: string): void;

/**
 * 正切(弧度)[R]
 * Tan(${Angle})
 * 采用弧度制计算.
 */
declare function Tan(radians: number): number;

/**
 * 新建地形变化:弹坑[R]
 * 新建的弹坑变形.中心坐标:(${X},${Y})半径:${Radius}深度:${Depth}持续时间:${Duration}毫秒,变化类型:${Type}
 * 深度可取负数.永久地形变化在保存游戏时不会被记录.
 */
declare function TerrainDeformCrater(x: number, y: number, radius: number, depth: number, duration: number, permanent: boolean): terraindeformation;

/**
 * 新建地形变化:随机[R]
 * 新建的随机变形.中心坐标:(${X},${Y})半径:${Radius}最小高度变化:${Depth}最大高度变化:${Depth}持续时间:${Duration}毫秒,变化周期:${Duration}毫秒
 * 
 */
declare function TerrainDeformRandom(x: number, y: number, radius: number, minDelta: number, maxDelta: number, duration: number, updateInterval: number): terraindeformation;

/**
 * 新建地形变化:波纹[R]
 * 新建的波纹变形.中心坐标:(${X},${Y})最终半径:${Radius}深度:${Depth}持续时间:${Duration}毫秒,变化次数:${Count}面波数:${SpaceWave}总波数:${TimeWave}初始半径率:${数值}变化类型:${Type}
 * 初始半径率=初始半径/最终半径.
 */
declare function TerrainDeformRipple(x: number, y: number, radius: number, depth: number, duration: number, count: number, spaceWaves: number, timeWaves: number, radiusStartPct: number, limitNeg: boolean): terraindeformation;

/**
 * 停止地形变化[R]
 * 停止${TerrainDeformation},衰退时间:${Duration}毫秒
 * 地形变化会平滑地过渡到无.
 */
declare function TerrainDeformStop(deformation: terraindeformation, duration: number): void;

/**
 * 停止所有地形变化
 * 停止所有地形变化
 * 包括由技能引起的地形变化.
 */
declare function TerrainDeformStopAll(): void;

/**
 * 新建地形变化:冲击波[R]
 * 新建的冲击波变形.起始坐标:(${X},${Y})波方向:(${X},${Y})波距离:${distance}波速度:${speed}波半径:${radius}深度:${Depth}变形效果持续时间:${Delay}毫秒,变化次数:${Count}
 * 深度可取负数.方向以(X,Y)坐标形式表示,如(1,1)表示45度.
 */
declare function TerrainDeformWave(x: number, y: number, dirX: number, dirY: number, distance: number, speed: number, radius: number, depth: number, trailTime: number, count: number): terraindeformation;

/**
 * 显示/隐藏计时器窗口(所有玩家)[R]
 * 设置${计时器窗口}的状态为${Show/Hide}
 * 计时器窗口不能在地图初始化时显示.
 */
declare function TimerDialogDisplay(whichDialog: timerdialog, display: boolean): void;
declare function TimerDialogSetRealTimeRemaining(whichDialog: timerdialog, timeRemaining: number): void;

/**
 * 设置计时器窗口速率[R]
 * 设置${TimerWindow}的时间流逝速度为${Factor}倍
 * 同时计时器显示时间也会随之变化.就是说60秒的计时器设置为2倍速则显示时间也会变为120秒.
 */
declare function TimerDialogSetSpeed(whichDialog: timerdialog, speedMultFactor: number): void;

/**
 * 改变计时器窗口计时颜色[R]
 * 改变${TimerWindow}的计间颜色为(${Red},${Green},${Blue})透明值为:${Transparency}
 * 颜色格式为(红,绿,蓝).Alpha通道值0为不可见.颜色值和透明值值取值范围为0-255.
 */
declare function TimerDialogSetTimeColor(whichDialog: timerdialog, red: number, green: number, blue: number, alpha: number): void;
declare function TimerDialogSetTitle(whichDialog: timerdialog, title: string): void;

/**
 * 改变计时器窗口文字颜色[R]
 * 改变${TimerWindow}文字颜色为(${Red},${Green},${Blue})透明值为:${Transparency}
 * 颜色格式为(红,绿,蓝).Alpha通道值0为不可见.颜色值和透明值值取值范围为0-255.
 */
declare function TimerDialogSetTitleColor(whichDialog: timerdialog, red: number, green: number, blue: number, alpha: number): void;

/**
 * 逝去时间
 * ${计时器}的逝去时间
 * 
 */
declare function TimerGetElapsed(whichTimer: timer): number;

/**
 * 剩余时间
 * ${计时器}的剩余时间
 * 
 */
declare function TimerGetRemaining(whichTimer: timer): number;

/**
 * 设置时间
 * ${计时器}设置的时间
 * 
 */
declare function TimerGetTimeout(whichTimer: timer): number;

/**
 * 运行计时器[C]
 * 运行${计时器}，周期:${时间}秒，模式:${模式}，运行函数:${函数}
 * 等同于TimerStart
 */
declare function TimerStart(whichTimer: timer, timeout: number, periodic: boolean, handlerFunc: () => void): void;
declare function TriggerAddAction(whichTrigger: trigger, actionFunc: () => void): triggeraction;
declare function TriggerAddCondition(whichTrigger: trigger, condition: boolexpr | (() => boolean) | null): triggercondition;
declare function TriggerClearActions(whichTrigger: trigger): void;
declare function TriggerClearConditions(whichTrigger: trigger): void;

/**
 * 触发条件成立
 * ${触发}的条件成立
 * 
 */
declare function TriggerEvaluate(whichTrigger: trigger): boolean;

/**
 * 运行触发(无视条件)
 * 运行${触发}(无视条件)
 * 无视事件和条件,运行触发动作.
 */
declare function TriggerExecute(whichTrigger: trigger): void;
declare function TriggerExecuteWait(whichTrigger: trigger): void;

/**
 * 可破坏物死亡
 * ${可破坏物}死亡
 * 使用'事件响应-死亡的可破坏物'来获取死亡物体.
 */
declare function TriggerRegisterDeathEvent(whichTrigger: trigger, whichWidget: widget): event;

/**
 * 对话框按钮被点击[R]
 * ${对话框按钮}被点击
 * 指定对话框按钮被点击,该事件一般需要在其他触发为其添加.
 */
declare function TriggerRegisterDialogButtonEvent(whichTrigger: trigger, whichButton: button): event;
declare function TriggerRegisterDialogEvent(whichTrigger: trigger, whichDialog: dialog): event;

/**
 * 单位进入不规则区域(指定条件)[R]
 * 单位进入${区域}并满足${条件}
 * 使用'事件响应-进入的单位'来响应进入该区域的单位.该事件需要在其他触发为其添加.
 */
declare function TriggerRegisterEnterRegion(whichTrigger: trigger, whichRegion: region, filter: boolexpr | (() => boolean) | null): event;
declare function TriggerRegisterFilterUnitEvent(whichTrigger: trigger, whichUnit: unit, whichEvent: unitevent, filter: boolexpr | (() => boolean) | null): event;

/**
 * 比赛游戏事件
 * 该游戏将在${EventType}后结束
 * 该事件只出现在Battle.net的自动匹配游戏.
 */
declare function TriggerRegisterGameEvent(whichTrigger: trigger, whichGameEvent: gameevent): event;
declare function TriggerRegisterGameStateEvent(whichTrigger: trigger, whichState: gamestate, opcode: limitop, limitval: number): event;

/**
 * 单位离开不规则区域(指定条件)[R]
 * 单位离开${区域}并满足${条件}
 * 使用'事件响应-离开的单位'来响应离开该区域的单位.该事件需要在其他触发为其添加.
 */
declare function TriggerRegisterLeaveRegion(whichTrigger: trigger, whichRegion: region, filter: boolexpr | (() => boolean) | null): event;

/**
 * 联盟状态更改(指定项目)
 * ${Player}更改${AllianceType}设置
 * 当改变项目为【共享单位】时，(触发玩家)会不生效，此时不建议使用【任意玩家】事件。
 */
declare function TriggerRegisterPlayerAllianceChange(whichTrigger: trigger, whichPlayer: player, whichAlliance: alliancetype): event;

/**
 * 输入聊天信息
 * ${玩家}输入${Text},信息过滤方式${MatchType}
 * 事件ID是(096)
 */
declare function TriggerRegisterPlayerChatEvent(whichTrigger: trigger, whichPlayer: player, chatMessageToDetect: string, exactMatchOnly: boolean): event;
declare function TriggerRegisterPlayerEvent(whichTrigger: trigger, whichPlayer: player, whichPlayerEvent: playerevent): event;

/**
 * 属性事件
 * ${玩家}的${Property}属性${Operation}${值}
 * 
 */
declare function TriggerRegisterPlayerStateEvent(whichTrigger: trigger, whichPlayer: player, whichState: playerstate, opcode: limitop, limitval: number): event;
declare function TriggerRegisterPlayerUnitEvent(whichTrigger: trigger, whichPlayer: player, whichPlayerUnitEvent: playerunitevent, filter: boolexpr | (() => boolean) | null): event;
declare function TriggerRegisterTimerEvent(whichTrigger: trigger, timeout: number, periodic: boolean): event;
declare function TriggerRegisterTimerExpireEvent(whichTrigger: trigger, t: timer): event;

/**
 * 鼠标点击可追踪物[R]
 * 鼠标点击${可追踪物}
 * 
 */
declare function TriggerRegisterTrackableHitEvent(whichTrigger: trigger, t: trackable): event;

/**
 * 鼠标移动到追踪对象[R]
 * 鼠标移动到${可追踪物}
 * 
 */
declare function TriggerRegisterTrackableTrackEvent(whichTrigger: trigger, t: trackable): event;

/**
 * 指定单位事件
 * ${指定单位}${事件}
 * 
 */
declare function TriggerRegisterUnitEvent(whichTrigger: trigger, whichUnit: unit, whichEvent: unitevent): event;
declare function TriggerRegisterUnitInRange(whichTrigger: trigger, whichUnit: unit, range: number, filter: boolexpr | (() => boolean) | null): event;
declare function TriggerRegisterUnitStateEvent(whichTrigger: trigger, whichUnit: unit, whichState: unitstate, opcode: limitop, limitval: number): event;

/**
 * 实数变量事件
 * ${变量}的值${Operation}${值}
 * 这个事件只适用于实数类型的变量.
 */
declare function TriggerRegisterVariableEvent(whichTrigger: trigger, varName: string, opcode: limitop, limitval: number): event;
declare function TriggerRemoveAction(whichTrigger: trigger, whichAction: triggeraction): void;
declare function TriggerRemoveCondition(whichTrigger: trigger, whichCondition: triggercondition): void;

/**
 * 等待(玩家时间)
 * 等待${Time}秒
 * 该延迟功能受真实时间的影响(也就是玩家机器上的时间).因此每个玩家所延迟的时间可能不一致.
 */
declare function TriggerSleepAction(timeout: number): void;
declare function TriggerSyncReady(): void;
declare function TriggerSyncStart(): void;
declare function TriggerWaitForSound(s: sound, offset: number): void;
declare function TriggerWaitOnSleeps(whichTrigger: trigger, flag: boolean): void;

/**
 * 添加技能[R]
 * 为${单位}添加${技能}
 * 
 */
declare function UnitAddAbility(whichUnit: unit, abilityId: number): boolean;
declare function UnitAddIndicator(whichUnit: unit, red: number, green: number, blue: number, alpha: number): void;

/**
 * 给予物品[R]
 * 给予${单位}${物品}
 * 
 */
declare function UnitAddItem(whichUnit: unit, whichItem: item): boolean;
declare function UnitAddItemById(whichUnit: unit, itemId: number): item;

/**
 * 新建物品到指定物品栏[R]
 * 给予${单位}${物品类型}并放在物品栏#${数值}
 * 注意:物品栏编号从0-5,而不是1-6.该动作创建的物品不被'最后创建的物品'所记录.
 */
declare function UnitAddItemToSlotById(whichUnit: unit, itemId: number, itemSlot: number): boolean;
declare function UnitAddSleep(whichUnit: unit, add: boolean): void;

/**
 * 控制单位睡眠状态
 * 使${单位}${Sleep/RemainAwake}
 * 使用该功能前必须用触发为单位添加'一直睡眠'技能.
 */
declare function UnitAddSleepPerm(whichUnit: unit, add: boolean): void;

/**
 * 添加类别
 * 添加${Classification}类别到${单位}
 * 并非所有类别都是可以添加的,建议使用新函数.
 */
declare function UnitAddType(whichUnit: unit, whichUnitType: unittype): boolean;

/**
 * 设置生命周期[R]
 * 为${单位}设置${BuffType}类型的生命周期,持续时间为${Duration}秒
 * 
 */
declare function UnitApplyTimedLife(whichUnit: unit, buffId: number, duration: number): void;
declare function UnitCanSleep(whichUnit: unit): boolean;
declare function UnitCanSleepPerm(whichUnit: unit): boolean;

/**
 * 拥有Buff数量[R]
 * ${单位}的附带Buff数量,(${Include/Exclude}正面Buff,${Include/Exclude}负面Buff${Include/Exclude}魔法Buff,${Include/Exclude}物理Buff${Include/Exclude}生命周期,${Include/Exclude}光环效果${Include/Exclude}不可驱散Buff)
 * 
 */
declare function UnitCountBuffsEx(whichUnit: unit, removePositive: boolean, removeNegative: boolean, magic: boolean, physical: boolean, timedLife: boolean, aura: boolean, autoDispel: boolean): number;

/**
 * 伤害区域[R]
 * 命令${单位}在${Seconds}秒后对半径为${Size}圆心为(${X},${Y})的范围造成${Amount}点伤害(${是}攻击伤害,${是}远程攻击)攻击类型:${AttackType}伤害类型:${DamageType}装甲类型:${WeaponType}
 * 该动作不会打断单位动作.由该动作伤害/杀死单位同样正常触发'受到伤害'和'死亡'单位事件.
 */
declare function UnitDamagePoint(whichUnit: unit, delay: number, radius: number, x: number, y: number, amount: number, attack: boolean, ranged: boolean, attackType: attacktype, damageType: damagetype, weaponType: weapontype): boolean;

/**
 * 伤害目标
 * 命令${单位}对${Target}造成${Amount}点伤害,攻击类型:${AttackType}伤害类型:${DamageType}
 * 该动作不会打断单位动作.由该动作伤害/杀死单位同样正常触发'受到伤害'和'死亡'单位事件.
 */
declare function UnitDamageTarget(whichUnit: unit, target: widget, amount: number, attack: boolean, ranged: boolean, attackType: attacktype, damageType: damagetype, weaponType: weapontype): boolean;
declare function UnitDropItemPoint(whichUnit: unit, whichItem: item, x: number, y: number): boolean;

/**
 * 移动物品到物品栏
 * 命令${单位}移动${物品}到物品栏第${Index}格
 * 只有当单位持有该物品时才有效.
 */
declare function UnitDropItemSlot(whichUnit: unit, whichItem: item, slot: number): boolean;
declare function UnitDropItemTarget(whichUnit: unit, whichItem: item, target: widget): boolean;
declare function UnitHasBuffsEx(whichUnit: unit, removePositive: boolean, removeNegative: boolean, magic: boolean, physical: boolean, timedLife: boolean, aura: boolean, autoDispel: boolean): boolean;

/**
 * 持有物品
 * ${Hero}拥有${物品}
 * 
 */
declare function UnitHasItem(whichUnit: unit, whichItem: item): boolean;
declare function UnitId(unitIdString: string): number;
declare function UnitId2String(unitId: number): string;
declare function UnitIgnoreAlarm(whichUnit: unit, flag: boolean): boolean;
declare function UnitIgnoreAlarmToggled(whichUnit: unit): boolean;
declare function UnitInventorySize(whichUnit: unit): number;
declare function UnitIsSleeping(whichUnit: unit): boolean;

/**
 * 单位持有物品
 * ${单位}物品栏第${Index}格的物品
 * 第一个单位格的位置为0.
 */
declare function UnitItemInSlot(whichUnit: unit, itemSlot: number): item;
declare function UnitMakeAbilityPermanent(whichUnit: unit, permanent: boolean, abilityId: number): boolean;

/**
 * 添加剩余技能点[R]
 * 增加${英雄}${Value}点剩余技能点
 * 
 */
declare function UnitModifySkillPoints(whichHero: unit, skillPointDelta: number): boolean;

/**
 * 暂停/恢复生命周期[R]
 * 使${单位}${Pause/Unpause}生命周期
 * 只有召唤单位有生命周期.
 */
declare function UnitPauseTimedLife(whichUnit: unit, flag: boolean): void;

/**
 * 添加单位类型[R]
 * 在${单位池}中添加一个${单位}比重为${数值}
 * 比重越高被选择的机率越大
 */
declare function UnitPoolAddUnitType(whichPool: unitpool, unitId: number, weight: number): void;

/**
 * 删除单位类型[R]
 * 从${单位池}中删除${单位}
 * 
 */
declare function UnitPoolRemoveUnitType(whichPool: unitpool, unitId: number): void;

/**
 * 删除技能[R]
 * 为${单位}删除${技能}
 * 
 */
declare function UnitRemoveAbility(whichUnit: unit, abilityId: number): boolean;
declare function UnitRemoveBuffs(whichUnit: unit, removePositive: boolean, removeNegative: boolean): void;
declare function UnitRemoveBuffsEx(whichUnit: unit, removePositive: boolean, removeNegative: boolean, magic: boolean, physical: boolean, timedLife: boolean, aura: boolean, autoDispel: boolean): void;
declare function UnitRemoveItem(whichUnit: unit, whichItem: item): void;
declare function UnitRemoveItemFromSlot(whichUnit: unit, itemSlot: number): item;

/**
 * 删除类别
 * 删除${Classification}类别从${单位}
 * 并非所有类别都是可以删除的,建议使用新函数.
 */
declare function UnitRemoveType(whichUnit: unit, whichUnitType: unittype): boolean;

/**
 * 重置技能CD
 * 重置${单位}的所有技能冷却时间
 * 如果要重置单一技能的CD,可以通过删除技能+添加技能+设置技能等级来完成.
 */
declare function UnitResetCooldown(whichUnit: unit): void;

/**
 * 设置建筑建造进度条
 * 设置${Building}的建造进度条为${Progress}%
 * 只作用于正在建造的建筑.
 */
declare function UnitSetConstructionProgress(whichUnit: unit, constructionPercentage: number): void;

/**
 * 设置建筑升级进度条
 * 设置${Building}的升级进度条为${Progress}%
 * 只作用于正在升级的建筑.是建筑A升级为建筑B的升级,不是科技的研究.
 */
declare function UnitSetUpgradeProgress(whichUnit: unit, upgradePercentage: number): void;
declare function UnitSetUsesAltIcon(whichUnit: unit, flag: boolean): void;

/**
 * 共享视野[R]
 * 设置${单位}的视野对${Player}${on/off}
 * 
 */
declare function UnitShareVision(whichUnit: unit, whichPlayer: player, share: boolean): void;

/**
 * 降低等级[R]
 * 降低${Hero}${Level}个等级
 * 只能降低等级.英雄经验将重置为该等级的初始值.
 */
declare function UnitStripHeroLevel(whichHero: unit, howManyLevels: number): boolean;

/**
 * 暂停尸体腐烂[R]
 * 设置${单位}的尸体腐烂状态:${Suspend/Resume}
 * 只对已完成死亡动作的尸体有效.
 */
declare function UnitSuspendDecay(whichUnit: unit, suspend: boolean): void;

/**
 * 使用物品(无目标)
 * 命令${单位}使用${物品}
 * 
 */
declare function UnitUseItem(whichUnit: unit, whichItem: item): boolean;

/**
 * 使用物品(指定坐标)
 * 命令${单位}使用${物品},目标坐标:(${X},${Y})
 * 
 */
declare function UnitUseItemPoint(whichUnit: unit, whichItem: item, x: number, y: number): boolean;

/**
 * 使用物品(对单位)
 * 命令${单位}使用${物品},目标:${单位}
 * 
 */
declare function UnitUseItemTarget(whichUnit: unit, whichItem: item, target: widget): boolean;
declare function UnitWakeUp(whichUnit: unit): void;
declare function UnregisterStackedSound(soundHandle: sound, byPosition: boolean, rectwidth: number, rectheight: number): void;
declare function VersionCompatible(whichVersion: version): boolean;
declare function VersionGet(): version;
declare function VersionSupported(whichVersion: version): boolean;
declare function VolumeGroupReset(): void;

/**
 * 设置多通道音量[R]
 * 设置${VolumeChannel}的音量为${Volume}
 * 音量取值范围0-1.
 */
declare function VolumeGroupSetVolume(vgroup: volumegroup, scale: number): void;
declare function WaygateActivate(waygate: unit, activate: boolean): void;

/**
 * 传送门目的地X坐标
 * ${传送门}的目的地X坐标
 * 
 */
declare function WaygateGetDestinationX(waygate: unit): number;

/**
 * 传送门目的地Y坐标
 * ${传送门}的目的地Y坐标
 * 
 */
declare function WaygateGetDestinationY(waygate: unit): number;
declare function WaygateIsActive(waygate: unit): boolean;

/**
 * 设置传送门目的坐标[R]
 * 设置${传送门}的目的地为(${X},${Y})
 * 
 */
declare function WaygateSetDestination(waygate: unit, x: number, y: number): void;
