#ifndef KKAPIINCLUDE 
#define KKAPIINCLUDE 

library LBKKAPI initializer Init

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
    
endlibrary



// [DzSetUnitMoveType]  
// title = "设置单位移动类型[NEW]"  
// description = "设置 ${单位} 的移动类型：${movetype} "  
// comment = ""  
// category = TC_KKPRE  
// [[.args]]  
// type = unit  
// [[.args]]  
// type = MoveTypeName  
// default = MoveTypeName01  


#endif 

