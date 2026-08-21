#ifndef KKAPIINCLUDE 
#define KKAPIINCLUDE 

library LBKKAPI initializer Init

        type dzeffectgroup                              extends agent
        globals 
                string MOVE_TYPE_NONE = "none" //没有（无视碰撞）  
                string MOVE_TYPE_FOOT = "foot" //步行  
                string MOVE_TYPE_HORSE = "horse" //骑马  
                string MOVE_TYPE_FLY = "fly" //飞行（还具有空中视野，也可以设置飞行高度）  
                string MOVE_TYPE_HOVER = "hover" //浮空（不会踩中地雷）  
                string MOVE_TYPE_FLOAT = "float" //漂浮（只能在深水里活动）  
                string MOVE_TYPE_AMPH = "amph" //两栖  
                string MOVE_TYPE_UNBUILD = "unbuild" //不可建造  
                constant integer DEFENSE_TYPE_SMALL = 0 
		constant integer DEFENSE_TYPE_MEDIUM = 1 
		constant integer DEFENSE_TYPE_LARGE = 2 
		constant integer DEFENSE_TYPE_FORT = 3 
		constant integer DEFENSE_TYPE_NORMAL = 4 
		constant integer DEFENSE_TYPE_HERO = 5 
		constant integer DEFENSE_TYPE_DIVINE = 6 
		constant integer DEFENSE_TYPE_NONE = 7 
                private integer array MonthDay
                private hashtable Hash=InitHashtable()
                dzeffectgroup bj_lastCreatedDzEffectGroup = null
        endglobals 

        native DzGetSelectedLeaderUnit takes nothing returns unit 
        native DzIsChatBoxOpen takes nothing returns boolean 
        native DzSetUnitPreselectUIVisible takes unit whichUnit, boolean visible returns nothing 
        native DzSetEffectAnimation takes effect whichEffect, integer index, integer flag returns nothing 
        native DzSetEffectPos takes effect whichEffect, real x, real y, real z returns nothing 
        native DzSetEffectVertexColor takes effect whichEffect, integer color returns nothing 
        native DzSetEffectVertexAlpha takes effect whichEffect, integer alpha returns nothing 
        native DzSetEffectModel takes effect whichEffect, string model returns nothing
        native DzSetEffectTeamColor takes effect whichHandle, integer playerId returns nothing
        native DzFrameSetClip takes integer whichframe, boolean enable returns nothing 
        native DzChangeWindowSize takes integer width, integer height returns boolean 
        native DzPlayEffectAnimation takes effect whichEffect, string anim, string link returns nothing 
        native DzBindEffect takes widget parent, string attachPoint, effect whichEffect returns nothing 
        native DzUnbindEffect takes effect whichEffect returns nothing 
        native DzSetWidgetSpriteScale takes widget whichUnit, real scale returns nothing 
        native DzSetEffectScale takes effect whichHandle, real scale returns nothing 
        native DzGetEffectVertexColor takes effect whichEffect returns integer 
        native DzGetEffectVertexAlpha takes effect whichEffect returns integer 
        native DzGetItemAbility takes item whichEffect, integer index returns ability 
        native DzFrameGetChildrenCount takes integer whichframe returns integer 
        native DzFrameGetChild takes integer whichframe, integer index returns integer 
        native DzUnlockBlpSizeLimit takes boolean enable returns nothing 
        native DzGetActivePatron takes unit store, player p returns unit 
        native DzGetLocalSelectUnitCount takes nothing returns integer 
        native DzGetLocalSelectUnit takes integer index returns unit 
        native DzGetJassStringTableCount takes nothing returns integer 
        native DzModelRemoveFromCache takes string path returns nothing 
        native DzModelRemoveAllFromCache takes nothing returns nothing 
        native DzFrameGetInfoPanelSelectButton takes integer index returns integer 
        native DzFrameGetInfoPanelBuffButton takes integer index returns integer 
        native DzFrameGetPeonBar takes nothing returns integer 
        native DzFrameGetCommandBarButtonNumberText takes integer whichframe returns integer 
        native DzFrameGetCommandBarButtonNumberOverlay takes integer whichframe returns integer 
        native DzFrameGetCommandBarButtonCooldownIndicator takes integer whichframe returns integer 
        native DzFrameGetCommandBarButtonAutoCastIndicator takes integer whichframe returns integer 
        native DzToggleFPS takes boolean show returns nothing 
        native DzGetFPS takes nothing returns integer 
        native DzFrameWorldToMinimapPosX takes real x, real y returns real 
        native DzFrameWorldToMinimapPosY takes real x, real y returns real 
        native DzWidgetSetMinimapIcon takes unit whichunit, string path returns nothing 
        native DzWidgetSetMinimapIconEnable takes unit whichunit, boolean enable returns nothing 
        native DzFrameGetWorldFrameMessage takes nothing returns integer 
        native DzSimpleMessageFrameAddMessage takes integer whichframe, string text, integer color, real duration, boolean permanent returns nothing 
        native DzSimpleMessageFrameClear takes integer whichframe returns nothing 
        //转换屏幕坐标到世界坐标  
        native DzConvertScreenPositionX takes real x, real y returns real 
        native DzConvertScreenPositionY takes real x, real y returns real 
        //监听建筑选位置  
        native DzRegisterOnBuildLocal takes code func returns nothing 
        //等于0时是结束事件  
        native DzGetOnBuildOrderId takes nothing returns integer 
        native DzGetOnBuildOrderType takes nothing returns integer 
        native DzGetOnBuildAgent takes nothing returns widget 
        //监听技能选目标  
        native DzRegisterOnTargetLocal takes code func returns nothing 
        //等于0时是结束事件  
        native DzGetOnTargetAbilId takes nothing returns integer 
        native DzGetOnTargetOrderId takes nothing returns integer 
        native DzGetOnTargetOrderType takes nothing returns integer 
        native DzGetOnTargetAgent takes nothing returns widget 
        native DzGetOnTargetInstantTarget takes nothing returns widget 
        // 打开QQ群链接  
        native DzOpenQQGroupUrl takes string url returns boolean 
        native DzFrameEnableClipRect takes boolean enable returns nothing 
        native DzSetUnitName takes unit whichUnit, string name returns nothing 
        native DzSetUnitPortrait takes unit whichUnit, string modelFile returns nothing 
        native DzSetUnitDescription takes unit whichUnit, string value returns nothing 
        native DzSetUnitMissileArc takes unit whichUnit, real arc returns nothing 
        native DzSetUnitMissileModel takes unit whichUnit, string modelFile returns nothing 
        native DzSetUnitProperName takes unit whichUnit, string name returns nothing 
        native DzSetUnitMissileHoming takes unit whichUnit, boolean enable returns nothing 
        native DzSetUnitMissileSpeed takes unit whichUnit, real speed returns nothing 
        native DzSetEffectVisible takes effect whichHandle, boolean enable returns nothing 
        native DzReviveUnit takes unit whichUnit, player whichPlayer, real hp, real mp, real x, real y returns nothing 
        native DzGetAttackAbility takes unit whichUnit returns ability 
        native DzAttackAbilityEndCooldown takes ability whichHandle returns nothing 
        native EXSetUnitArrayString takes integer uid, integer id, integer n, string name returns boolean 
        native EXSetUnitInteger takes integer uid, integer id, integer n returns boolean 
        function DzSetHeroTypeProperName takes integer uid, string name returns nothing 
                call EXSetUnitArrayString(uid, 61, 0, name) 
                call EXSetUnitInteger(uid, 61, 1) 
        endfunction 
        function DzSetUnitTypeName takes integer uid, string name returns nothing 
                call EXSetUnitArrayString(uid, 10, 0, name) 
                call EXSetUnitInteger(uid, 10, 1) 
        endfunction 
        function DzIsUnitAttackType takes unit whichUnit, integer index, attacktype attackType returns boolean 
                return ConvertAttackType(R2I(GetUnitState(whichUnit, ConvertUnitState(16 + 19 * index)))) == attackType 
        endfunction 
        function DzSetUnitAttackType takes unit whichUnit, integer index, attacktype attackType returns nothing 
                call SetUnitState(whichUnit, ConvertUnitState(16 + 19 * index), GetHandleId(attackType)) 
        endfunction 
        function DzIsUnitDefenseType takes unit whichUnit, integer defenseType returns boolean 
                return R2I(GetUnitState(whichUnit, ConvertUnitState(0x50))) == defenseType 
        endfunction 
        function DzSetUnitDefenseType takes unit whichUnit, integer defenseType returns nothing 
                call SetUnitState(whichUnit, ConvertUnitState(0x50), defenseType) 
        endfunction 

        // 地形装饰物
        native DzDoodadCreate takes integer id, integer var, real x, real y, real z, real rotate, real scale returns integer 
        native DzDoodadGetTypeId takes integer doodad returns integer 
        native DzDoodadSetModel takes integer doodad, string modelFile returns nothing 
        native DzDoodadSetTeamColor takes integer doodad, integer color returns nothing 
        native DzDoodadSetColor takes integer doodad, integer color returns nothing 
        native DzDoodadGetX takes integer doodad returns real 
        native DzDoodadGetY takes integer doodad returns real 
        native DzDoodadGetZ takes integer doodad returns real 
        native DzDoodadSetPosition takes integer doodad, real x, real y, real z returns nothing 
        native DzDoodadSetOrientMatrixRotate takes integer doodad, real angle, real axisX, real axisY, real axisZ returns nothing 
        native DzDoodadSetOrientMatrixScale takes integer doodad, real x, real y, real z returns nothing 
        native DzDoodadSetOrientMatrixResize takes integer doodad returns nothing 
        native DzDoodadSetVisible takes integer doodad, boolean enable returns nothing 
        native DzDoodadSetAnimation takes integer doodad, string animName, boolean animRandom returns nothing 
        native DzDoodadSetTimeScale takes integer doodad, real scale returns nothing 
        native DzDoodadGetTimeScale takes integer doodad returns real 
        native DzDoodadGetCurrentAnimationIndex takes integer doodad returns integer 
        native DzDoodadGetAnimationCount takes integer doodad returns integer 
        native DzDoodadGetAnimationName takes integer doodad, integer index returns string 
        native DzDoodadGetAnimationTime takes integer doodad, integer index returns integer 
        // 解锁JASS字节码限制
        native DzUnlockOpCodeLimit takes boolean enable returns nothing
        // 设置剪切板内容
        native DzSetClipboard takes string content returns boolean
        //删除装饰物
        native DzDoodadRemove takes integer doodad returns nothing
        //移除科技等级
        native DzRemovePlayerTechResearched takes player whichPlayer, integer techid, integer removelevels returns nothing
        
        // 查找单位技能
        native DzUnitFindAbility takes unit whichUnit, integer abilcode returns ability
        // 修改技能数据-字符串
        native DzAbilitySetStringData takes ability whichAbility, string key, string value returns nothing
                
        // 启用/禁用技能
        native DzAbilitySetEnable takes ability whichAbility, boolean enable, boolean hideUI returns nothing
        // 设置单位移动类型
        native DzUnitSetMoveType takes unit whichUnit, string moveType returns nothing
        // 获取控件宽度
        native DzFrameGetWidth takes integer frame returns real
        native DzFrameSetAnimateByIndex takes integer frame, integer index, integer flag returns nothing
        native DzSetUnitDataCacheInteger takes integer uid, integer id,integer index,integer v returns nothing
        native DzUnitUIAddLevelArrayInteger takes integer uid, integer id,integer lv,integer v returns nothing

        function KKWESetUnitDataCacheInteger takes integer uid,integer id,integer v returns nothing
                call DzSetUnitDataCacheInteger( uid, id, 0, v)
        endfunction

        function KKWEUnitUIAddUpgradesIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 94, id, v)
        endfunction

        function KKWEUnitUIAddBuildsIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 100, id, v)
        endfunction

        function KKWEUnitUIAddResearchesIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 112, id, v)
        endfunction

        function KKWEUnitUIAddTrainsIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 106, id, v)
        endfunction

        function KKWEUnitUIAddSellsUnitIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 118, id, v)
        endfunction

        function KKWEUnitUIAddSellsItemIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 124, id, v)
        endfunction

        function KKWEUnitUIAddMakesItemIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 130, id, v)
        endfunction

        function KKWEUnitUIAddRequiresUnitCode takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 166, id, v)
        endfunction

        function KKWEUnitUIAddRequiresTechcode takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 166, id, v)
        endfunction

        function KKWEUnitUIAddRequiresAmounts takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger( uid, 172, id, v)
        endfunction

         // 设置道具模型
        native DzItemSetModel takes item whichItem, string file returns nothing
        // 设置道具颜色
        native DzItemSetVertexColor takes item whichItem, integer color returns nothing
        // 设置道具透明度
        native DzItemSetAlpha takes item whichItem, integer color returns nothing
        // 设置道具头像
        native DzItemSetPortrait takes item whichItem, string modelPath returns nothing
	native DzFrameHookHpBar takes code func returns nothing
	native DzFrameGetTriggerHpBarUnit takes nothing returns unit
	native DzFrameGetTriggerHpBar takes nothing returns integer
	native DzFrameGetUnitHpBar takes unit whichUnit returns integer

        native DzGetCursorFrame takes nothing returns integer
        native DzFrameGetPointValid takes integer frame, integer anchor returns boolean
        native DzFrameGetPointRelative takes integer frame, integer anchor returns integer
        native DzFrameGetPointRelativePoint takes integer frame, integer anchor returns integer
        native DzFrameGetPointX takes integer frame, integer anchor returns real
        native DzFrameGetPointY takes integer frame, integer anchor returns real
                
        function DzIsLeapYear takes integer year returns boolean
                return (ModuloInteger(year , 4) == 0 and ModuloInteger(year , 100) != 0) or (ModuloInteger(year , 400) == 0)
        endfunction

        function DzGetTimeDateFromTimestamp takes integer timestamp returns string
                local integer totalSeconds = timestamp+28800
                local integer days = 0
                local integer day = 0
                local integer secondsInDay = 86400
                local integer remainingSeconds = ModuloInteger(totalSeconds, secondsInDay)
                local integer year = 1970
                local integer totalDays = (totalSeconds+86399) / (secondsInDay)
                local integer num= 0
                local integer month=0
                local integer hour
                local integer minute
                local integer second
                local string str
                loop
                if DzIsLeapYear(year) then
                        set num = num + 366
                else
                        set num = num + 365
                endif
                if num > totalDays then
                        set totalDays=totalDays-days
                        exitwhen true
                else
                        set days=num
                endif
                set year = year + 1
                endloop
                set month=1
                set num=0
                set days=0
                if(DzIsLeapYear(year))then
                loop
                        set num = num + MonthDay[100+month]
                        if num >= totalDays then
                        set day=totalDays-days
                        exitwhen true
                        else
                        set days=num
                        endif
                        set month = month + 1
                endloop
                else
                loop
                        set num = num + MonthDay[month]
                        if num >= totalDays then
                        set day=totalDays-days
                        exitwhen true
                        else
                        set days=num
                        endif
                        set month = month + 1
                endloop
                endif
                if(day==0)then
                set day=1
                endif
                set hour = remainingSeconds / 3600
                set remainingSeconds = ModuloInteger(remainingSeconds, 3600)
                set minute = remainingSeconds / 60
                set second = ModuloInteger(remainingSeconds, 60)
                set str=I2S(year) + "-" + I2S(month) + "-" + I2S(day) + " " + I2S(hour) + ":" + I2S(minute) + ":" + I2S(second)
                call SaveInteger(Hash,timestamp,1,year)
                call SaveInteger(Hash,timestamp,2,month)
                call SaveInteger(Hash,timestamp,3,day)
                call SaveStr(Hash,timestamp,4,str)
                return str
        endfunction

        function KKAPIGetTimeDateFromTimestamp takes integer timestamp returns string
                set timestamp=IMaxBJ(timestamp,0)
                if(HaveSavedString(Hash,timestamp,4))then
                        return LoadStr(Hash,timestamp,4)
                else
                        return DzGetTimeDateFromTimestamp(timestamp)
                endif
        endfunction

        function  KKAPIGetTimestampYear takes integer timestamp returns integer
                set timestamp=IMaxBJ(timestamp,0)
                if(HaveSavedInteger(Hash,timestamp,1)==false)then
                        call DzGetTimeDateFromTimestamp(timestamp)
                endif
                 return LoadInteger(Hash,timestamp,1)
        endfunction

        function  KKAPIGetTimestampMonth takes integer timestamp returns integer
                set timestamp=IMaxBJ(timestamp,0)
                if(HaveSavedInteger(Hash,timestamp,2)==false)then
                        call DzGetTimeDateFromTimestamp(timestamp)
                endif
                 return LoadInteger(Hash,timestamp,2)
        endfunction

        function  KKAPIGetTimestampDay takes integer timestamp returns integer
                set timestamp=IMaxBJ(timestamp,0)
                if(HaveSavedInteger(Hash,timestamp,3)==false)then
                        call DzGetTimeDateFromTimestamp(timestamp)
                endif
                 return LoadInteger(Hash,timestamp,3)
        endfunction

        private function Init takes nothing returns nothing
                set MonthDay[1]=31
                set MonthDay[2]=28
                set MonthDay[3]=31
                set MonthDay[4]=30
                set MonthDay[5]=31
                set MonthDay[6]=30
                set MonthDay[7]=31
                set MonthDay[8]=31
                set MonthDay[9]=30
                set MonthDay[10]=31
                set MonthDay[11]=30
                set MonthDay[12]=31
                set MonthDay[101]=31
                set MonthDay[102]=29
                set MonthDay[103]=31
                set MonthDay[104]=30
                set MonthDay[105]=31
                set MonthDay[106]=30
                set MonthDay[107]=31
                set MonthDay[108]=31
                set MonthDay[109]=30
                set MonthDay[110]=31
                set MonthDay[111]=30
                set MonthDay[112]=31
        endfunction

        native DzWriteLog takes string msg returns nothing

        // texttag
        native DzTextTagGetFont takes nothing returns string
        native DzTextTagSetFont takes string fileName returns nothing
        native DzTextTagSetStartAlpha takes texttag t, integer alpha returns nothing
        native DzTextTagGetShadowColor takes texttag t returns integer
        native DzTextTagSetShadowColor takes texttag t, integer color returns nothing
    
        // group
        native DzGroupGetCount takes group g returns integer
        native DzGroupGetUnitAt takes group g, integer index returns unit
    
        // unit
        native DzUnitCreateIllusion takes player p, integer unitId, real x, real y, real face returns unit
        native DzUnitCreateIllusionFromUnit takes unit u returns unit
    
        // string
        native DzStringContains takes string s, string whichString, boolean caseSensitive returns boolean
        native DzStringFind takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindFirstOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindFirstNotOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindLastOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindLastNotOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringTrimLeft takes string s returns string
        native DzStringTrimRight takes string s returns string
        native DzStringTrim takes string s returns string
        native DzStringReverse takes string s returns string
        native DzStringReplace takes string s, string whichString, string replaceWith, boolean caseSensitive returns string
        native DzStringInsert takes string s, integer whichPosition, string whichString returns string
    
        // bit
        native DzBitGet takes integer i, integer byteIndex returns integer
        native DzBitSet takes integer i, integer byteIndex, integer byteValue returns integer
        native DzBitGetByte takes integer i, integer byteIndex returns integer
        native DzBitSetByte takes integer i, integer byteIndex, integer byteValue returns integer
        native DzBitNot takes integer i returns integer
        native DzBitAnd takes integer a, integer b returns integer
        native DzBitOr takes integer a, integer b returns integer
        native DzBitXor takes integer a, integer b returns integer
        native DzBitShiftLeft takes integer i, integer bitsToShift returns integer
        native DzBitShiftRight takes integer i, integer bitsToShift returns integer
        native DzBitToInt takes integer b1, integer b2, integer b3, integer b4 returns integer
    
        // issue
        native DzQueueGroupImmediateOrderById              takes group whichGroup, integer order returns boolean
        native DzQueueGroupPointOrderById                  takes group whichGroup, integer order, real x, real y returns boolean
        native DzQueueGroupTargetOrderById                 takes group whichGroup, integer order, widget targetWidget returns boolean
        native DzQueueIssueImmediateOrderById      takes unit whichUnit, integer order returns boolean
        native DzQueueIssuePointOrderById          takes unit whichUnit, integer order, real x, real y returns boolean
        native DzQueueIssueTargetOrderById         takes unit whichUnit, integer order, widget targetWidget returns boolean
        native DzQueueIssueInstantPointOrderById   takes unit whichUnit, integer order, real x, real y, widget instantTargetWidget returns boolean
        native DzQueueIssueInstantTargetOrderById  takes unit whichUnit, integer order, widget targetWidget, widget instantTargetWidget returns boolean
        native DzQueueIssueBuildOrderById          takes unit whichPeon, integer unitId, real x, real y returns boolean
        native DzQueueIssueNeutralImmediateOrderById   takes player forWhichPlayer,unit neutralStructure, integer unitId returns boolean
        native DzQueueIssueNeutralPointOrderById       takes player forWhichPlayer,unit neutralStructure, integer unitId, real x, real y returns boolean
        native DzQueueIssueNeutralTargetOrderById      takes player forWhichPlayer,unit neutralStructure, integer unitId, widget target returns boolean
        native DzUnitOrdersCount takes unit u returns integer
        native DzUnitOrdersClear takes unit u, boolean onlyQueued returns nothing
        native DzUnitOrdersExec takes unit u returns nothing
        native DzUnitOrdersForceStop takes unit u, boolean clearQueue returns nothing
        native DzUnitOrdersReverse takes unit u returns nothing
        // xlsx
        native DzXlsxOpen takes string filePath returns integer
        native DzXlsxClose takes integer docHandle returns boolean
        native DzXlsxWorksheetGetRowCount takes integer docHandle, string sheetName returns integer
        native DzXlsxWorksheetGetColumnCount takes integer docHandle, string sheetName returns integer
        native DzXlsxWorksheetGetCellType takes integer docHandle, string sheetName, integer row, integer column returns integer
        native DzXlsxWorksheetGetCellString takes integer docHandle, string sheetName, integer row, integer column returns string
        native DzXlsxWorksheetGetCellInteger takes integer docHandle, string sheetName, integer row, integer column returns integer
        native DzXlsxWorksheetGetCellBoolean takes integer docHandle, string sheetName, integer row, integer column returns boolean
        native DzXlsxWorksheetGetCellFloat takes integer docHandle, string sheetName, integer row, integer column returns real
    
        native DzFrameSetTexCoord takes integer frame, real left, real top, real right, real bottom returns nothing

        native DzSetUnitAbilityRange takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityRange takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityArea takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityArea takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityCool takes unit Unit, integer abil_code, real cool, real max_cool returns boolean
        native DzGetUnitAbilityCool takes unit Unit, integer abil_code returns real
        native DzGetUnitAbilityMaxCool takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityDataA takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataA takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityDataB takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataB takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityDataC takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataC takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityDataD takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataD takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityDataE takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataE takes unit Unit, integer abil_code returns real

        native DzSetUnitAbilityButtonPos takes unit Unit, integer abil_code, integer x, integer y returns boolean
        native DzSetUnitAbilityHotkey takes unit Unit, integer abil_code, string key returns boolean

        native DzConvertTargs2Str takes integer targs returns string 
        native DzConvertStr2Targs takes string targs returns integer 

        native DzSetUnitAbilityTargs takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityTargs takes unit Unit, integer abil_code returns integer

        native DzSetUnitAbilityCost takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityCost takes unit Unit, integer abil_code returns integer

        native DzSetUnitAbilityReqLevel takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityReqLevel takes unit Unit, integer abil_code returns integer
        
        native DzSetUnitAbilityUnitId takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityUnitId takes unit Unit, integer abil_code returns integer

        native DzSetUnitAbilityBuildOrderId takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityBuildOrderId takes unit Unit, integer abil_code returns integer
        
        native DzSetUnitAbilityBuildModel takes unit Unit, integer abil_code, string model_path, real model_scale returns boolean 

        native DzUnitHasAbility takes unit Unit, integer abil_code returns boolean 
        
        
        native KKCreateCommandButton takes nothing returns integer 
        native KKDestroyCommandButton takes integer btn returns nothing 
        native KKCommandButtonClick takes integer btn, integer mouse_type returns nothing
        native KKCommandTargetClick takes integer mouse_type, widget target returns boolean 
        native KKCommandTerrainClick takes integer mouse_type, real x, real y, real z returns boolean 
        native KKSetCommandUnitAbility takes integer btn, unit Unit, integer abil_code returns nothing 

        native DzItemGetVertexColor takes item Item returns integer 
        native DzItemSetSize takes item Item, real size returns nothing 
        native DzItemGetSize takes item Item returns real 
        native DzItemMatRotateX takes item Item, real x returns nothing
        native DzItemMatRotateY takes item Item, real y returns nothing
        native DzItemMatRotateZ takes item Item, real z returns nothing
        native DzItemMatScale takes item Item, real x, real y, real z returns nothing
        native DzItemMatReset takes item Item returns nothing 
        native DzGetLastSelectedItem takes nothing returns item 
        
        native DzSetPariticle2Size takes agent Widget, real scale returns nothing 

        native DzSetUnitCollisionSize takes unit Unit, real size returns nothing 
        native DzGetUnitCollisionSize takes unit Unit returns real 

        native DzSetWidgetTexture takes agent Handle, string TexturePath, integer ReplaceId returns nothing 
        native DzSetUnitSelectScale takes unit Unit, real scale returns nothing 
        native DzSetUnitHitIgnore takes unit Unit, boolean ignore returns nothing 
        native DzEffectBindEffect takes agent Handle, string AttachName, effect eff returns nothing

        function KKConvertInt2AbilId takes integer i returns integer 
                return i
        endfunction

        function KKConvertAbilId2Int takes integer i returns integer 
                return i
        endfunction

        function KKConvertInt2Color takes integer i returns integer
                return i
        endfunction

        function KKConvertColor2Int takes integer i returns integer
                return i
        endfunction

        native DzFrameSetIgnoreTrackEvents takes integer frame, boolean ignore returns nothing 
        native DzFrameAddModel takes integer parent_frame returns integer 
        native DzFrameSetModel2 takes integer model_frame, string model_file, integer team_color_id returns nothing 
        native DzFrameAddModelEffect takes integer model_frame, string attach_point, string model_file returns integer 
        native DzFrameRemoveModelEffect takes integer model_frame, integer effect_frame returns nothing 
        native DzFrameSetModelAnimationByIndex takes integer model_frame, integer anim_index returns nothing 
        native DzFrameSetModelAnimation takes integer model_frame, string animation returns nothing 
        native DzFrameSetModelCameraSource takes integer model_frame, real x, real y, real z returns nothing 
        native DzFrameSetModelCameraTarget takes integer model_frame, real x, real y, real z returns nothing 
        native DzFrameSetModelSize takes integer model_frame, real size returns nothing 
        native DzFrameGetModelSize takes integer model_frame returns real 
        native DzFrameSetModelPosition takes integer model_frame, real x, real y, real z returns nothing
        native DzFrameSetModelX takes integer model_frame, real x returns nothing 
        native DzFrameGetModelX takes integer model_frame returns real 
        native DzFrameSetModelY takes integer model_frame, real y returns nothing 
        native DzFrameGetModelY takes integer model_frame returns real 
        native DzFrameSetModelZ takes integer model_frame, real z returns nothing 
        native DzFrameGetModelZ takes integer model_frame returns real 
        native DzFrameSetModelSpeed takes integer model_frame, real speed returns nothing 
        native DzFrameGetModelSpeed takes integer model_frame returns real 
        native DzFrameSetModelScale takes integer model_frame, real x, real y, real z returns nothing 
        native DzFrameSetModelMatReset takes integer model_frame returns nothing 
        native DzFrameSetModelRotateX takes integer model_frame, real x returns nothing 
        native DzFrameSetModelRotateY takes integer model_frame, real y returns nothing 
        native DzFrameSetModelRotateZ takes integer model_frame, real z returns nothing 
        native DzFrameSetModelColor takes integer model_frame, integer color returns nothing 
        native DzFrameGetModelColor takes integer model_frame returns integer
        native DzFrameSetModelTexture takes integer model_frame, string texture_file, integer replace_texutre_id returns nothing 
        native DzFrameSetModelParticle2Size takes integer model_frame, real scale returns nothing 
        native DzGetGlueUI takes nothing returns integer 
        native DzFrameGetMouse takes nothing returns integer 
        native DzFrameGetContext takes integer frame returns integer 
        native DzFrameGetName takes integer frame returns string 
        native DzFrameSetNameContext takes integer frame, string name, integer context returns nothing 
        native DzFrameSetTextFontSpacing takes integer text_frame, real spacing returns nothing 
        native KKCommandGetCooldownModel takes integer cmd_btn returns integer 
        native KKCommandSetCooldownModelSize takes integer cmd_btn, real size returns nothing 
        native KKCommandSetCooldownModelSize2 takes integer cmd_btn, real width, real height returns nothing 
        native DzGetPlayerLastSelectedItem takes player p returns item 
        native DzGetCacheModelCount takes nothing returns integer 
        native DzSetMaxFps takes integer max_fps returns nothing 
        
                
        native DzEnableDrawSkillPanel takes unit u, boolean is_enable returns nothing 
        native DzEnableDrawSkillPanelByPlayer takes player p, boolean is_enable returns nothing 
        native DzSetEffectFogVisible takes effect eff, boolean is_visible returns nothing 
        native DzSetEffectMaskVisible takes effect eff, boolean is_visible returns nothing 

        native DzFrameBindWidget takes integer frame, widget u, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible, boolean unit_visible, boolean dead_visible returns nothing 
        native DzFrameBindWorldPos takes integer frame, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible returns nothing
        native DzFrameUnBind takes integer frame returns nothing 

        function KKFrameBindItem takes integer frame, widget u, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible, boolean item_visible returns nothing 
                call DzFrameBindWidget(frame, u, world_x, world_y, world_z, screen_x, screen_y, fog_visible, item_visible, false)
        endfunction

        native DzDisableUnitPreselectUi takes nothing returns nothing
        native DzDisableItemPreselectUi takes nothing returns nothing
        native DzFrameGetLowerLevelFrame takes nothing returns integer 
        native DzFrameSetCheckBoxState takes integer check_box_frame, boolean checked returns nothing
        native DzFrameGetCheckBoxState takes integer check_box_frame returns boolean
        native DzFrameIsFocus takes integer frame returns boolean 
        native DzFrameSetEditBoxActive takes integer frame, boolean is_active returns nothing 
        native DzFrameSetEditBoxDisableIme takes integer frame, boolean is_disable returns nothing 

        native DzIsWindowMode takes nothing returns boolean 
        native DzIsWindowActive takes nothing returns boolean
        native DzWindowSetPoint takes integer x, integer y returns nothing 
        native DzWindowSetSize takes integer width, integer height returns nothing 
        native DzGetSystemMetricsWidth takes nothing returns integer 
        native DzGetSystemMetricsHeight takes nothing returns integer 

        native DzGetDoodadsCount takes nothing returns integer 
        native DzSetDoodadsMatScale takes integer doodads_index, real x, real y, real z returns nothing 
        native DzSetDoodadsMatRotateX takes integer doodads_index, real x returns nothing 
        native DzSetDoodadsMatRotateY takes integer doodads_index, real y returns nothing 
        native DzSetDoodadsMatRotateZ takes integer doodads_index, real z returns nothing 
        native DzSetDoodadsMatReset takes integer doodads_index returns nothing 


           
        native DzSetUnitAbilityArt takes unit u, integer abil_id, string art_path returns boolean
        native DzGetUnitAbilityArt takes unit u, integer abil_id returns string
        native DzSetUnitAbilityTip takes unit u, integer abil_id, string tip returns boolean
        native DzGetUnitAbilityTip takes unit u, integer abil_id returns string
        native DzSetUnitAbilityUberTip takes unit u, integer abil_id, string ubertip returns boolean
        native DzGetUnitAbilityUberTip takes unit u, integer abil_id returns string
        native DzSetUnitAbilityUpdate takes unit u, integer abil_id returns boolean 
        native DzSetUnitAbilityOrderId takes unit u, integer abil_id, integer order_id returns boolean
        native DzGetUnitAbilityOrderId takes unit u, integer abil_id returns integer
        native DzSetUnitAbilitySpellBookList takes unit u, integer abil_id, string abil_list, boolean save_cooldown returns boolean 
        native DzGetUnitAbilitySpellBookList takes unit u, integer abil_id returns string 
        native DzSetUnitAbilityMissileArt takes unit u, integer abil_id, string missile_art returns boolean
        native DzGetUnitAbilityMissileArt takes unit u, integer abil_id returns string
        native DzSetUnitAbilityMissileSpeed takes unit u, integer abil_id, real missile_speed returns boolean
        native DzGetUnitAbilityMissileSpeed takes unit u, integer abil_id returns real
        native DzSetUnitAbilityMissileArc takes unit u, integer abil_id, real missile_arc returns boolean
        native DzGetUnitAbilityMissileArc takes unit u, integer abil_id returns real
        native DzSetUnitAbilityMissileHoming takes unit u, integer abil_id, boolean missile_homing returns boolean
        native DzGetUnitAbilityMissileHoming takes unit u, integer abil_id returns boolean
        native DzSetUnitAbilityMissileCount takes unit u, integer abil_id, integer missile_count returns boolean
        native DzGetUnitAbilityMissileCount takes unit u, integer abil_id returns integer
        native DzSetUnitAbilityMissileDamage takes unit u, integer abil_id, real damage, real max_damage, attacktype atktp, damagetype dmgtp returns boolean
        native DzGetUnitAbilityMissileDamage takes unit u, integer abil_id returns real
        native DzGetUnitAbilityMissileMaxDamage takes unit u, integer abil_id returns real
        
        

        native DzSendKeyboard takes player p, integer key_code, integer is_down returns nothing
        native DzForceUiKeyboard takes player p, integer key_code, integer is_down returns nothing
        native DzDisableWindowKeyboard takes player p, integer key_code returns nothing 
        native DzDisableGameUIKeyboard takes player p, integer key_code returns nothing 
        native DzUnitCanPlaceAround takes widget obj, real x, real y returns boolean 

        function KKUnitCanPlaceAroundLoc takes widget obj, location loc returns boolean 
                return DzUnitCanPlaceAround(obj, GetLocationX(loc), GetLocationY(loc))
        endfunction     

        function kkUnitCanPlaceAroundItem takes widget obj, real x, real y returns boolean
                return DzUnitCanPlaceAround(obj, x, y)
        endfunction 

        function KKUnitCanPlaceAroundLocItem takes widget obj, location loc returns boolean
                return DzUnitCanPlaceAround(obj, GetLocationX(loc), GetLocationY(loc))
        endfunction 

        native DzPositionCanPlaceAround takes real x, real y, real collision_size, integer collision_type returns boolean 

        function KKPositionCanPlaceAroundLoc takes location loc, real collision_size, integer collision_type returns boolean 
                return DzPositionCanPlaceAround(GetLocationX(loc), GetLocationY(loc), collision_size, collision_type)
        endfunction 

        native DzGetTerrainZ takes real x, real y returns real 
        native DzGetUnitZ takes unit u returns real 
        native DzGetUnitOverheadOffset takes widget u returns real

        native DzFrameSetModelEnableWideScreen takes integer frame, boolean is_enable returns nothing 

        native DzSetUnitAbilityEnable takes unit u, integer abil_id returns boolean
        native DzSetUnitAbilityDisable takes unit u, integer abil_id returns boolean
        native DzGetUnitAbilityIsDisabled takes unit u, integer abil_id returns boolean
        native DzGetUnitAbilityDisabledCount takes unit u, integer abil_id returns integer
        native DzSetUnitAbilityTechReach takes unit u, integer abil_id, boolean reach returns boolean
        native DzGetUnitAbilityTechReach takes unit u, integer abil_id returns boolean
        native DzSetUnitAbilityTechReachTip takes unit u, integer abil_id, string tip returns boolean 

        native DzAsyncGetCurrentBuildingAbilityId takes nothing returns integer 
        native DzAsyncGetCurrentBuildingUnitId takes nothing returns integer 
        native DzFrameUnlockMouseRectLimit takes boolean is_unlock returns nothing 
        native KKSimpleFrameIsVisible takes integer simple_frame returns boolean
        native DzFrameGetChatEditBar takes nothing returns integer

        native DzGetLocalChatRecipient takes nothing returns integer 
        native DzPlayerSendChat takes player p, string msg, integer recipient returns nothing 


        native DzEnableHashtableSetNull takes boolean is_enable returns nothing 
        native DzSetItemCollisionSize takes item it, real size returns nothing 
        native DzGetItemCollisionSize takes item it returns real 
        native DzSetUnitDisableLocalOrder takes unit u, boolean is_disable returns nothing 
        native DzGetUnitDisableLocalOrder takes unit u returns boolean 
        native DzSetUnitDisableControlOrder takes unit u, boolean is_disable returns nothing 
        native DzGetUnitDisableControlOrder takes unit u returns boolean 
        native DzSetUnitAttack1TargetType takes unit u, integer target_type returns nothing
        native DzGetUnitAttack1TargetType takes unit u returns integer
        native DzSetUnitAttack2TargetType takes unit u, integer target_type returns nothing
        native DzGetUnitAttack2TargetType takes unit u returns integer
        native DzSetUnitAsAttackTargetType takes unit u, integer target_type returns nothing
        native DzGetUnitAsAttackTargetType takes unit u returns integer
        native DzFrameBindAddHideRect takes integer frame, real left, real bottom, real right, real top, real width, real height returns nothing 
        native DzFrameGetRealWidth takes integer frame returns real 
        native DzFrameGetRealHeight takes integer frame returns real 
        native DzSetUnitAbilitySpellBookAddAbility takes unit u, integer abil_id, integer add_abil_id returns boolean
        native DzSetUnitAbilitySpellBookRemoveAbility takes unit u, integer abil_id, integer remove_abil_id returns boolean
        native KKCommandButtonGetAbilityId takes integer command_button returns integer 
        native KKCommandButtonGetOrderId takes integer command_button returns integer 
        native DzFixUnitEventMemoryLeak takes nothing returns nothing
        
        function KKConvertStr2Targs takes string s returns integer 
                return DzConvertStr2Targs(s)
        endfunction

        native DzGetUnitPojectileLaunchX takes unit u returns real
        native DzGetUnitPojectileLaunchY takes unit u returns real
        native DzGetUnitPojectileLaunchZ takes unit u returns real

        native DzLaunchMissile takes unit source, widget target, string model, integer team_color, integer color, real x, real y, real z, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, real arc, boolean homing, boolean can_miss, boolean never_miss, boolean attack, integer flags returns boolean
        native DzLaunchMissileBounce takes unit source, widget target, string model, integer team_color, integer color, real x, real y, real z, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, real arc, boolean homing, boolean can_miss, boolean never_miss, boolean attack, integer flags, integer target_flags, integer target_count, real bounce_range, real damage_loss returns boolean
        native DzLaunchMissileLine takes unit source, widget target, string model, integer team_color, integer color, real x, real y, real z, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, real arc, boolean homing, boolean can_miss, boolean never_miss, boolean attack, integer flags, integer target_flags, real damage_loss, real distance, real range returns boolean
        native DzLaunchMissileSplash takes unit source, widget target, string model, integer team_color, integer color, real x, real y, real z, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, real arc, boolean homing, boolean can_miss, boolean never_miss, boolean attack, integer flags, integer target_flags, real half_factor, real quar_factor, real full_area, real half_area, real quar_area returns boolean
        native DzLaunchArtillery takes unit source, widget target, real target_x, real target_y, string model, integer team_color, integer color, real x, real y, real z, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, real arc, boolean attack, integer flags, real min_distance, integer target_flags, real half_factor, real quar_factor, real full_area, real half_area, real quar_area returns boolean
        native DzLaunchArtilleryLine takes unit source, widget target, real target_x, real target_y, string model, integer team_color, integer color, real x, real y, real z, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, real arc, boolean attack, integer flags, real min_distance, integer target_flags, real half_factor, real quar_factor, real full_area, real half_area, real quar_area, real damage_loss, real distance, real range returns boolean
        native DzLaunchMissileCarrionSwarmEx takes unit source, string model, integer team_color, integer color, real x, real y, real z, real facing, real distance, real scale, real speed, attacktype attack_type, damagetype damage_type, weapontype weapon_type, real damage, integer flags, integer target_flags, real start_radius, real end_radius, real max_damage, integer buffID returns boolean

        native DzKillUnit takes unit whichUnit, unit killer returns boolean
        native DzSetUnitXY takes unit whichUnit, real x, real y returns boolean
        native DzSetUnitAbilityEngineeringUpgrade takes unit whichUnit, integer old_id, integer new_id, boolean update_hero_ability returns boolean 
        native DzSetUnitAbilityEngineeringUpgradeCancel takes unit whichUnit, integer old_id returns boolean 
        native DzGetUnitAbilityEngineeringUpgradeNewId takes unit whichUnit, integer old_id returns integer 
        native DzGetUnitAbilityEngineeringUpgradeOldId takes unit whichUnit, integer new_id returns integer 


        native DzSetUnitAbilityCastTime takes unit u, integer abil_id, real value returns boolean 
        native DzGetUnitAbilityCastTime takes unit u, integer abil_id returns real 
        native DzSetUnitAbilityDuration takes unit u, integer abil_id, real value returns boolean 
        native DzGetUnitAbilityDuration takes unit u, integer abil_id returns real 
        native DzSetUnitAbilityHeroDuration takes unit u, integer abil_id, real value returns boolean 
        native DzGetUnitAbilityHeroDuration takes unit u, integer abil_id returns real 
        native DzSetUnitAbilityCastPoint takes unit u, integer abil_id, real value returns boolean 
        native DzGetUnitAbilityCastPoint takes unit u, integer abil_id returns real 
        native DzSetUnitAbilityBackSwing takes unit u, integer abil_id, real value returns boolean 
        native DzGetUnitAbilityBackSwing takes unit u, integer abil_id returns real 

        
        native DzSetUnitLifeRegen takes unit whichUnit, real regen returns boolean
        native DzGetUnitLifeRegen takes unit whichUnit returns real
        native DzSetUnitManaRegen takes unit whichUnit, real regen returns boolean
        native DzGetUnitManaRegen takes unit whichUnit returns real
        native DzSetUnitMinSpeed takes unit whichUnit, real speed, boolean ignore_polymorph returns boolean
        native DzGetUnitMinSpeed takes unit whichUnit returns real
        native DzSetUnitMaxSpeed takes unit whichUnit, real speed, boolean ignore_polymorph returns boolean
        native DzGetUnitMaxSpeed takes unit whichUnit returns real
        native DzSetUnitCastPoint takes unit whichUnit, real cast_point returns boolean
        native DzGetUnitCastPoint takes unit whichUnit returns real
        native DzSetUnitBackSwing takes unit whichUnit, real back_swing returns boolean
        native DzGetUnitBackSwing takes unit whichUnit returns real
        native DzSetUnitAttackTargetCount takes unit whichUnit, integer index, integer target_count returns boolean
        native DzGetUnitAttackTargetCount takes unit whichUnit, integer index returns integer
        native DzSetHeroPrimaryAttributeType takes unit whichUnit, integer attribute, boolean keep_primary_bonus returns boolean
        native DzGetHeroPrimaryAttributeType takes unit whichUnit returns integer
        native DzSetHeroPrimaryAttribute takes unit whichUnit, integer attribute returns boolean
        native DzGetHeroPrimaryAttribute takes unit whichUnit, boolean include_bonus returns integer
        native DzSetHeroPrimaryAttributePlus takes unit whichUnit, integer attreibute, real value, boolean keep_current_bonus returns boolean
        native DzGetHeroPrimaryAttributePlus takes unit whichUnit, integer attribute returns real
        native DzDisableAttackSpeedLimit takes nothing returns nothing
        native DzSetMinMaxAttackSpeedFactor takes real min_factor, real max_factor returns nothing
        native DzSetMoveSpeedBonusesStack takes boolean is_enable returns nothing
        native DzSetGlobalUnitMinMaxMoveSpeed takes real building_min, real building_max, real unit_min, real unit_max, real GC_building_min, real GC_building_max, real GC_unit_min, real GC_unit_max, real harvest_min, real windwalk_max returns nothing

        native DzSaveHandleId takes hashtable whichHashtable, integer parentKey, integer childKey, integer handleId returns boolean
        native DzSaveHandleIdEx takes hashtable whichHashtable, integer parentKey, integer childKey, integer handleId, integer handleType returns boolean
        native DzLoadHandleId takes hashtable whichHashtable, integer parentKey, integer childKey returns integer
        native DzSetHashtableLimit takes integer maxCount returns nothing
        native DzDisableRemoveExtraDeadHero takes nothing returns nothing
        native DzSetPlayerPathFindingLimit takes player whichPlayer, integer limit1, integer limit2, integer limit3, integer limit4 returns boolean
        native DzSetGameConstantFoodCeiling takes integer value returns nothing
        native DzDisableLoadingPressAKey takes nothing returns nothing
        native DzMultiboardGetFrame takes multiboard whichMultiboard returns integer
        native DzTimerDialogGetFrame takes timerdialog whichTimerDialog returns integer
        native DzFrameAddTextShadow takes integer whichFrame, real offsetX, real offsetY, integer color returns boolean
        native DzFrameDuplicateTextShadow takes integer whichFrame, integer count returns boolean
        native DzSetCommandButtonShowCooldown takes boolean showAbility, boolean showItem returns nothing
        native DzSetCommandButtonShowHotkey takes boolean showAbility, boolean showItem returns nothing
        native DzSetCommandButtonHotkeyBackground takes string filepath returns nothing

        native DzEffectGroupCreate                      takes nothing returns dzeffectgroup
        native DzEffectGroupGetSize                     takes dzeffectgroup whichEffectGroup returns integer
        native DzEffectGroupAt                          takes dzeffectgroup whichEffectGroup, integer index returns effect
        native DzEffectGroupClear                       takes dzeffectgroup whichEffectGroup returns integer
        native DzEffectGroupAdd                         takes dzeffectgroup whichEffectGroup, effect whichEffect, boolean allowDuplicate returns integer
        native DzEffectGroupRemove                      takes dzeffectgroup whichEffectGroup, effect whichEffect, boolean firstOnly returns boolean
        native DzEffectGroupEnumRange                   takes dzeffectgroup whichEffectGroup, real x, real y, real range, boolean clear, boolean allowDuplicate returns integer
        native DzEffectGroupEnumRect                    takes dzeffectgroup whichEffectGroup, rect whichRect, boolean clear, boolean allowDuplicate returns integer
        native DzEffectGroupContains                    takes dzeffectgroup whichEffectGroup, effect whichEffect returns boolean
        native DzEffectGroupDestroy                     takes dzeffectgroup whichEffectGroup returns boolean
        native DzGetEnumEffect                          takes nothing returns effect
        native DzForEffectGroup                         takes dzeffectgroup whichEffectGroup, code callback returns integer
        native DzHandle2EffectGroup                     takes integer handleID returns dzeffectgroup
        native SaveDzEffectGroupHandle                  takes hashtable table, integer parentKey, integer childKey, dzeffectgroup g returns boolean
        native LoadDzEffectGroupHandle                  takes hashtable table, integer parentKey, integer childKey returns dzeffectgroup

        native DzUpdateEffectSmartPosition              takes effect whichEffect returns boolean
        native DzRemoveEffect                           takes effect whichEffect returns boolean
        native DzRemoveEffectTimed                      takes effect whichEffect, real time returns boolean
        native DzSetEffectAlwaysRender                  takes effect whichEffect, boolean flag returns boolean
        native DzDieEffectTimed                         takes effect whichEffect, real time returns boolean
        native DzSetEffectGroupBlacklist                takes effect whichEffect, boolean flag returns boolean
        native DzSetEffectAttachedModelScale            takes effect whichEffect, real scaleX, real scaleY, real scaleZ returns boolean
        native DzFrameSetAttachedModelScale             takes integer frame, real scaleX, real scaleY, real scaleZ returns boolean
        native DzEffectReplayBirth                      takes effect whichEffect returns nothing
        

        function DzEffectGroupCreateBJ takes nothing returns dzeffectgroup
                set bj_lastCreatedDzEffectGroup = DzEffectGroupCreate()
                return bj_lastCreatedDzEffectGroup
        endfunction

        function DzEffectGroupCreateEnumRangeBJ takes real x, real y, real range returns dzeffectgroup
                set bj_lastCreatedDzEffectGroup = DzEffectGroupCreate()
                call DzEffectGroupEnumRange(bj_lastCreatedDzEffectGroup, x, y, range, false, false)
                return bj_lastCreatedDzEffectGroup
        endfunction

        function DzEffectGroupCreateEnumRectBJ takes rect whichRect returns dzeffectgroup
                set bj_lastCreatedDzEffectGroup = DzEffectGroupCreate()
                call DzEffectGroupEnumRect(bj_lastCreatedDzEffectGroup, whichRect, false, false)
                return bj_lastCreatedDzEffectGroup
        endfunction

        function DzEffectGroupAddBJ takes effect whichEffect, dzeffectgroup whichEffectGroup, boolean allowDuplicate returns integer
                return DzEffectGroupAdd(whichEffectGroup, whichEffect, allowDuplicate)
        endfunction

        function DzEffectGroupEnumRangeBJ takes real x, real y, real range, dzeffectgroup whichEffectGroup, boolean clear, boolean allowDuplicate returns integer
                return DzEffectGroupEnumRange(whichEffectGroup, x, y, range, clear, allowDuplicate)
        endfunction 

        function DzEffectGroupEnumRectBJ takes rect whichRect, dzeffectgroup whichEffectGroup, boolean clear, boolean allowDuplicate returns integer
                return DzEffectGroupEnumRect(whichEffectGroup, whichRect, clear, allowDuplicate)
        endfunction

        function DzRemoveEffectTimedBJ takes real time, effect whichEffect returns boolean
                return DzRemoveEffectTimed(whichEffect, time)
        endfunction

        function DzDieEffectTimedBJ takes real time, effect whichEffect returns boolean
                return DzDieEffectTimed(whichEffect, time)
        endfunction

        function DzGetEffectGroupIdBJ takes dzeffectgroup g returns integer
                return GetHandleId(g)
        endfunction


endlibrary



// [DzSetUnitMoveType]  
// title = "设置单位移动类型[NEW]"  
// description = "设置 ${单位} 的移动类型：${movetype} "  
// comment = ""  
// category = TC_KKAPI  
// [[.args]]  
// type = unit  
// [[.args]]  
// type = MoveTypeName  
// default = MoveTypeName01  


#endif 

