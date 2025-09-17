#ifndef X_SIMPLETRIGGERUI_HEALTHBAR_inc
#define X_SIMPLETRIGGERUI_HEALTHBAR_inc

#include "X/LowLevelJAPI/Frame.j"
#include "X/Unit.j"
#include "X/Util.j"
#include "X/Vector.j"
#include "X/TriggerEvent/Unit/Damage.j"
#include "X/TriggerEvent/Unit/ChangeID.j"
#include "X/AsyncEvent/HealthBar.j"
#include "BlizzardAPI.j"

// V1  初始版本
// V2  使用SIMPLESTATUSBAR
// V3  添加注释
// V4  忘了
// V5  修了个加载时卡死问题
//  1) 修复退出电影模式 UI 会自动显示
//  2) 迁移到 X JAPI
// V6  添加死亡淡化
// V7  触发封装化
// V8  蓝条 玩家名称 英雄头像
// V9  同步创建 vector 防止已使用的 handleID 计数不同间接导致的异步
// V10 删掉多余的 native 定义
// V11 替换 _unsafe 调用
// V12 中立单位显示英雄名称 改成 非玩家单位显示英雄名称
// V13 忘了一个 return 导致单位在淡化时删除会崩溃
// V14 单位更改ID 同步替换英雄图标
// V15 接受 莫招烟云 的修改, 并加上几个忘了导出供修改的配置
library XSimpleTriggerUIHealthBar initializer init
#define _margin 0.003                           // 外围大小
#define _offsetL (_margin / 2)                  // 次frame的左边偏移
#define _offsetT (-_margin / 2)                 // 次frame的上边偏移
#define _offsetB (_margin / 2)                  // 次frame的下边偏移
#define _offsetR (-_margin / 2)                 // 次frame的右边偏移
#define P_TOPLEFT 0                             // 设置ui位置的定义 (左上)
#define P_TOP 1                                 // 设置ui位置的定义 (正上)
#define P_TOPRIGHT 2                            // 设置ui位置的定义 (右上)
#define P_BTMLEFT 6                             // 设置ui位置的定义 (左下)
#define P_BTM 7                                 // 设置ui位置的定义 (正下)
#define P_BTMRIGHT 8                            // 设置ui位置的定义 (右下)
globals
    private hashtable HT
    private key UI_MAIN_FRAME
    private key UI_HP_background
    private key UI_HP_bar
    private key UI_MP_background
    private key UI_MP_bar
    private key UI_HP_effect
    private key UI_HP_last_damaged_time
    private key UI_HP_effect_percent
    private key UI_HERO_FRAME
    private key UI_player_name
    private key UI_hero_icon
    private key UI_is_unit_dead
    private key UI_unit_dead_time
    private key UI_HP_width
    private boolean initialized = false // 必须全局初始化
    private boolean initialized_async = false // 必须全局初始化
    private X_Vector dead_units
    // async config
    private string background_texture = "textures\\black32.blp"
    
    private string ally_bar_texture = "replaceabletextures\\teamcolor\\teamcolor06.blp"
    private string enemy_bar_texture = "replaceabletextures\\teamcolor\\teamcolor06.blp"
    private string self_bar_texture = "replaceabletextures\\teamcolor\\teamcolor06.blp"
    
    private string ally_effect_texture = "replaceabletextures\\teamcolor\\teamcolor05.blp"
    private string enemy_effect_texture = "replaceabletextures\\teamcolor\\teamcolor05.blp"
    private string self_effect_texture = "replaceabletextures\\teamcolor\\teamcolor05.blp"
    
    private string MP_background_texture = "textures\\black32.blp"
    
    private string ally_MP_bar_texture = "replaceabletextures\\teamcolor\\teamcolor01.blp"
    private string enemy_MP_bar_texture = "replaceabletextures\\teamcolor\\teamcolor01.blp"
    private string self_MP_bar_texture = "replaceabletextures\\teamcolor\\teamcolor01.blp"
    
    private string player_name_font = "fonts\\frizqt__.ttf"
    private real player_name_font_height = 0.01
    
    private real hero_icon_size_w = 0.02
    private real hero_icon_size_h = 0.02
    
    private real size_h = 0.01
    private real offsetL = <?= _offsetL ?>
    private real offsetT = <?= _offsetT ?>
    private real offsetB = <?= _offsetB ?>
    private real offsetR = <?= _offsetR ?>
    private real offsetX = 0
    private real offsetY = 0.02
    
    private integer DELAY = 0
    private integer HP_effect_drop_speed = 500
    private integer HP_fade_speed = 750
    private boolean HEALTHBAR_FADE_BUFFER = true
    private real DELAY_TO_CONSIDER_SCRIPT_KILL = 32
endglobals
// 这行被注释了得手动添加
native DzSimpleFrameShow takes integer frame, boolean show returns nothing
native EXExecuteScript takes string s returns string
// 血条更新回调
private function onUpdateHPBar takes nothing returns nothing
    // 获取事件的坐标X
    local real ui_x = X_GetHPBarUpdateEventX()
    // 获取事件的坐标Y
    local real ui_y = X_GetHPBarUpdateEventY()
    // 获取事件的单位
    local unit u = X_GetHPBarUpdateEventUnit()
    // 获取哈希表索引
    local integer i = GetHandleId(u)
    local integer MAIN_FRAME
    local integer HP_background
    local integer HP_bar
    local integer MP_background
    local integer MP_bar
    local integer HP_effect
    local integer HERO_FRAME
    local integer player_name
    local integer hero_icon
    local real hp_percent
    local integer last_damaged_time
    local real size_w = X_GetHPBarUpdateEventWidth() // DzFrameGetWidth(GetHPBarUpdateEventUI()) 会崩
    // 如果 不是单位
    if u == null then
        // 忽略
        return
    endif
    // 隐藏触发事件的血条
    call X_HideHPBarUpdateEventUI()
    // 如果 尚未初始化
    if not HaveSavedInteger(HT, i, UI_MAIN_FRAME) then
        // 主 UI
        set MAIN_FRAME = DzCreateFrameByTagName("SIMPLEFRAME", "", 0, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_MAIN_FRAME, MAIN_FRAME)
        
        // 创建 UI (背景)
        set HP_background = DzCreateFrameByTagName("SIMPLESTATUSBAR", "", MAIN_FRAME, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_HP_background, HP_background)
        // 设置 UI 最小与最大值
        call DzFrameSetMinMaxValue(HP_background, 0, 1)
        // 设置 UI 当前值
        call DzFrameSetValue(HP_background, 1)
        // 设置 UI 位置
        // DzFrameSetSize 有问题这里换成 DzFrameSetAbsolutePoint
        call DzFrameSetAbsolutePoint(HP_background, P_TOPLEFT, ui_x - size_w / 2 + offsetX, ui_y + offsetY)
        call DzFrameSetAbsolutePoint(HP_background, P_BTMRIGHT, ui_x + size_w / 2 + offsetX, ui_y - size_h + offsetY)
        // 设置 UI 贴图
        call DzFrameSetTexture(HP_background, background_texture, 0)
        
        // 创建 UI (渐变)
        set HP_effect = DzCreateFrameByTagName("SIMPLESTATUSBAR", "", HP_background, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_HP_effect, HP_effect)
        // 计算单位当前生命值的百分比
        set hp_percent = GetUnitState(u, UNIT_STATE_LIFE) / GetUnitState(u, UNIT_STATE_MAX_LIFE)
        // 设置 UI 最小与最大值
        call DzFrameSetMinMaxValue(HP_effect, 0, 1)
        // 设置 UI 当前值
        call DzFrameSetValue(HP_effect, hp_percent)
        // 设置 UI 位置
        call DzFrameSetPoint(HP_effect, P_TOPLEFT, HP_background, P_TOPLEFT, offsetL, offsetT)
        call DzFrameSetPoint(HP_effect, P_BTMRIGHT, HP_background, P_BTMRIGHT, offsetR, offsetB)
        // 设置 UI 贴图
        if GetOwningPlayer(u) == GetLocalPlayer() then
            call DzFrameSetTexture(HP_effect, self_effect_texture, 0)
        elseif IsUnitAlly(u, GetLocalPlayer()) then
            call DzFrameSetTexture(HP_effect, ally_effect_texture, 0)
        else
            call DzFrameSetTexture(HP_effect, enemy_effect_texture, 0)
        endif
        
        // 创建 UI (血条)
        set HP_bar = DzCreateFrameByTagName("SIMPLESTATUSBAR", "", HP_effect, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_HP_bar, HP_bar)
        // 设置 UI 最小与最大值
        call DzFrameSetMinMaxValue(HP_bar, 0, 1)
        // 设置 UI 当前值
        call DzFrameSetValue(HP_bar, hp_percent)
        // 设置 UI 位置
        call DzFrameSetPoint(HP_bar, P_TOPLEFT, HP_background, P_TOPLEFT, offsetL, offsetT)
        call DzFrameSetPoint(HP_bar, P_BTMRIGHT, HP_background, P_BTMRIGHT, offsetR, offsetB)
        // 设置 UI 贴图
        if GetOwningPlayer(u) == GetLocalPlayer() then
            call DzFrameSetTexture(HP_bar, self_bar_texture, 0)
        elseif IsUnitAlly(u, GetLocalPlayer()) then
            call DzFrameSetTexture(HP_bar, ally_bar_texture, 0)
        else
            call DzFrameSetTexture(HP_bar, enemy_bar_texture, 0)
        endif
        // 设置 UI 位置
        call DzFrameSetPoint(HP_bar, P_TOPLEFT, HP_background, P_TOPLEFT, offsetL, offsetT)
        call DzFrameSetPoint(HP_bar, P_BTMRIGHT, HP_background, P_BTMRIGHT, offsetR, offsetB)
        
        // 初始化其他数值
        // 渐变条当前百分比
        call SaveReal(HT, i, UI_HP_effect_percent, hp_percent)
        // 受到伤害时间
        call SaveInteger(HT, i, UI_HP_last_damaged_time, 0)
        // 单位是否死亡
        call SaveBoolean(HT, i, UI_is_unit_dead, false)
        // 血条宽度
        call SaveReal(HT, i, UI_HP_width, size_w)
        
        // 蓝条
        // 创建 UI (蓝条背景)
        set MP_background = DzCreateFrameByTagName("SIMPLESTATUSBAR", "", MAIN_FRAME, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_MP_background, MP_background)
        // 设置 UI 最小与最大值
        call DzFrameSetMinMaxValue(MP_background, 0, 1)
        // 设置 UI 当前值
        call DzFrameSetValue(MP_background, 1)
        // 设置 UI 位置
        // DzFrameSetSize 有问题这里换成 DzFrameSetAbsolutePoint
        call DzFrameSetPoint(MP_background, P_TOPLEFT, HP_background, P_BTMLEFT, 0, 0)
        call DzFrameSetPoint(MP_background, P_BTMRIGHT, HP_background, P_BTMRIGHT, 0, -size_h)
        // 设置 UI 贴图
        call DzFrameSetTexture(MP_background, MP_background_texture, 0)
        
        // 创建 UI (蓝条)
        set MP_bar = DzCreateFrameByTagName("SIMPLESTATUSBAR", "", MP_background, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_MP_bar, MP_bar)
        // 设置 UI 最小与最大值
        call DzFrameSetMinMaxValue(MP_bar, 0, 1)
        // 设置 UI 当前值
        call DzFrameSetValue(MP_bar, hp_percent)
        // 设置 UI 位置
        call DzFrameSetPoint(MP_bar, P_TOPLEFT, MP_background, P_TOPLEFT, offsetL, offsetT)
        call DzFrameSetPoint(MP_bar, P_BTMRIGHT, MP_background, P_BTMRIGHT, offsetR, offsetB)
        // 设置 UI 贴图
        if GetOwningPlayer(u) == GetLocalPlayer() then
            call DzFrameSetTexture(MP_bar, self_MP_bar_texture, 0)
        elseif IsUnitAlly(u, GetLocalPlayer()) then
            call DzFrameSetTexture(MP_bar, ally_MP_bar_texture, 0)
        else
            call DzFrameSetTexture(MP_bar, enemy_MP_bar_texture, 0)
        endif
        
        if GetUnitState(u, UNIT_STATE_MAX_MANA) > 0 then
            call DzFrameSetValue(MP_bar, GetUnitState(u, UNIT_STATE_MANA) / GetUnitState(u, UNIT_STATE_MAX_MANA))
        else
            call DzSimpleFrameShow(MP_background, false)
            call DzSimpleFrameShow(MP_bar, false)
        endif
        
        // 英雄 UI
        set HERO_FRAME = DzCreateFrameByTagName("SIMPLEFRAME", "", MAIN_FRAME, "", 0)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_HERO_FRAME, HERO_FRAME)
        // 设置 UI 优先级
        call DzFrameSetPriority(HERO_FRAME, 1)
        
        // 玩家名称
        // 创建 UI
        set player_name = X_CreateSimpleFontString(HERO_FRAME)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_player_name, player_name)
        // 设置 UI 位置
        call DzFrameSetPoint(player_name, P_BTM, HP_background, P_TOP, 0, 0)
        call DzFrameSetTextAlignment(player_name, 20)
        // 设置 UI 字体
        call DzFrameSetFont(player_name, player_name_font, player_name_font_height, 0)
        // 设置 UI 文本
        if GetPlayerController(GetOwningPlayer(u)) == MAP_CONTROL_USER then
            call DzFrameSetText(player_name, GetPlayerName(GetOwningPlayer(u)))
        else
            // 非玩家 使用单位名称
            call DzFrameSetText(player_name, GetUnitName(u))
        endif
        
        // 英雄图标
        // 创建 UI
        set hero_icon = X_CreateSimpleTexture(HERO_FRAME)
        call X_SimpleTextureSetAlphaMode(hero_icon, 2)
        // 绑定 UI 到单位
        call SaveInteger(HT, i, UI_hero_icon, hero_icon)
        // 设置 UI 位置
        call DzFrameSetPoint(hero_icon, P_TOPRIGHT, HP_background, P_TOPLEFT, 0, 0)
        call DzFrameSetSize(hero_icon, hero_icon_size_w, hero_icon_size_h)
        // 设置 UI 贴图
        call DzFrameSetTexture(hero_icon, EXExecuteScript("require 'jass.slk'.unit[" + I2S(GetUnitTypeId(u)) + "].Art"), 0)
        
        if not IsHeroUnitId(GetUnitTypeId(u)) then
            call DzSimpleFrameShow(HERO_FRAME, false)
        endif
    else
        // 初始化变量
        set MAIN_FRAME = LoadInteger(HT, i, UI_MAIN_FRAME)
        set HP_background = LoadInteger(HT, i, UI_HP_background)
        set HP_effect = LoadInteger(HT, i, UI_HP_effect)
        set HP_bar = LoadInteger(HT, i, UI_HP_bar)
        set MP_background = LoadInteger(HT, i, UI_MP_background)
        set MP_bar = LoadInteger(HT, i, UI_MP_bar)
        set HERO_FRAME = LoadInteger(HT, i, UI_HERO_FRAME)
        set player_name = LoadInteger(HT, i, UI_player_name)
        set hero_icon = LoadInteger(HT, i, UI_hero_icon)
        // 显示 UI
        call DzSimpleFrameShow(MAIN_FRAME, true)
        // 设置 UI 位置
        call DzFrameSetAbsolutePoint(HP_background, P_TOPLEFT, ui_x - size_w / 2 + offsetX, ui_y + offsetY)
        call DzFrameSetAbsolutePoint(HP_background, P_BTMRIGHT, ui_x + size_w / 2 + offsetX, ui_y - size_h + offsetY)
        // 计算单位当前生命值的百分比
        set hp_percent = GetUnitState(u, UNIT_STATE_LIFE) / GetUnitState(u, UNIT_STATE_MAX_LIFE)
        // 获取上次受到伤害时间
        set last_damaged_time = LoadInteger(HT, i, UI_HP_last_damaged_time)
        // 如果 当前生命值的百分比 大于 渐变条的百分比
        // 或   距离上次受到伤害时间超过 DELAY + HP_effect_drop_speed
        if hp_percent > LoadReal(HT, i, UI_HP_effect_percent) or X_timeGetTime() - last_damaged_time > DELAY + HP_effect_drop_speed then
            // 设置 渐变条UI 当前值
            call DzFrameSetValue(HP_effect, hp_percent)
            // 保存 渐变条UI 百分比
            call SaveReal(HT, i, UI_HP_effect_percent, hp_percent)
        // 如果 距离上次受到伤害时间超过 DELAY 且小于 DELAY + HP_effect_drop_speed
        elseif X_timeGetTime() - last_damaged_time > DELAY then
            // 设置 渐变条UI 当前值
            call DzFrameSetValue(HP_effect, LoadReal(HT, i, UI_HP_effect_percent) - (LoadReal(HT, i, UI_HP_effect_percent) - hp_percent) * (X_timeGetTime() - last_damaged_time - DELAY) / HP_effect_drop_speed)
            // 这里没有保存 渐变条UI 百分比
            // 因为上面的算法要求
        endif
        // 设置 血条UI 当前值
        call DzFrameSetValue(HP_bar, hp_percent)
        // 蓝条
        if GetUnitState(u, UNIT_STATE_MAX_MANA) > 0 then
            call DzFrameSetValue(MP_bar, GetUnitState(u, UNIT_STATE_MANA) / GetUnitState(u, UNIT_STATE_MAX_MANA))
        else
            call DzSimpleFrameShow(MP_background, false)
            call DzSimpleFrameShow(MP_bar, false)
        endif
        // 英雄 UI
        if not IsHeroUnitId(GetUnitTypeId(u)) then
            call DzSimpleFrameShow(HERO_FRAME, false)
        endif
        // 单位是否死亡
        if LoadBoolean(HT, i, UI_is_unit_dead) then
            // 重置透明度
            call DzFrameSetVertexColor(HP_background, 0xFFFFFFFF)
            call DzFrameSetVertexColor(HP_bar, 0xFFFFFFFF)
            call DzFrameSetVertexColor(HP_effect, 0xFFFFFFFF)
            call DzFrameSetVertexColor(MP_background, 0xFFFFFFFF)
            call DzFrameSetVertexColor(MP_bar, 0xFFFFFFFF)
            call X_SimpleRegionSetVertexColor(player_name, 0xFFFFFFFF)
            call X_SimpleRegionSetVertexColor(hero_icon, 0xFFFFFFFF) // 这个可以用 DzFrameSetVertexColor
            // 移出死亡淡化队列
            call X_VectorEraseValue(dead_units, i)
            // 标识单位存活
            call SaveBoolean(HT, i, UI_is_unit_dead, false)
        endif
        // 血条宽度
        call SaveReal(HT, i, UI_HP_width, size_w)
    endif
endfunction
// 隐藏血条回调
private function onHide takes nothing returns nothing
    // 获取哈希表索引
    local integer i = GetHandleId(X_GetHPBarHideEventUnit())
    // 如果 已经初始化
    if i != 0 and HaveSavedInteger(HT, i, UI_MAIN_FRAME) then
        // 隐藏 UI
        call DzSimpleFrameShow(LoadInteger(HT, i, UI_MAIN_FRAME), false)
    endif
endfunction
// 受到伤害回调
private function onDamage takes nothing returns nothing
    // 受到伤害的单位
    local unit u = GetTriggerUnit()
    // 获取哈希表索引
    local integer i = GetHandleId(u)
    local real hp_percent
    // 如果 超过渐变时间
    if X_timeGetTime() - LoadInteger(HT, i, UI_HP_last_damaged_time) > DELAY then
        // 跳过渐变动画
        set hp_percent = GetUnitState(u, UNIT_STATE_LIFE) / GetUnitState(u, UNIT_STATE_MAX_LIFE)
        call DzFrameSetValue(LoadInteger(HT, i, UI_HP_effect), hp_percent)
        call SaveReal(HT, i, UI_HP_effect_percent, hp_percent)
    endif
    // 保存受到伤害的时间
    call SaveInteger(HT, i, UI_HP_last_damaged_time, X_timeGetTime())
endfunction
private function updateDeadUnit takes nothing returns nothing
    local integer i = X_VectorGetEnumValue()
    local unit u = X_Handle2Unit(i)
    
    // 初始化变量
    local integer MAIN_FRAME = LoadInteger(HT, i, UI_MAIN_FRAME)
    local integer HP_background = LoadInteger(HT, i, UI_HP_background)
    local integer HP_bar = LoadInteger(HT, i, UI_HP_bar)
    local integer HP_effect = LoadInteger(HT, i, UI_HP_effect)
    local integer MP_background = LoadInteger(HT, i, UI_MP_background)
    local integer MP_bar = LoadInteger(HT, i, UI_MP_bar)
    local integer HERO_FRAME = LoadInteger(HT, i, UI_HERO_FRAME)
    local integer player_name = LoadInteger(HT, i, UI_player_name)
    local integer hero_icon = LoadInteger(HT, i, UI_hero_icon)
    local integer time = X_timeGetTime() - LoadInteger(HT, i, UI_unit_dead_time)
    
    // 局部变量
    local integer alpha
    local real ui_x
    local real ui_y
    local real size_w
    local integer last_damaged_time
    
    // 单位已被删除
    if u == null then
        // 清理 UI
        // 其他 UI 会同时清理
        call X_DestroySimpleFrame(MAIN_FRAME)
        // 清空哈希表
        call FlushChildHashtable(HT, i)
        // 移出死亡淡化队列
        call X_VectorEraseValue(dead_units, i)
        return
    // 是否显示此单位的血条
    elseif not X_ShouldUnitShowHPBar(u) then
        if HEALTHBAR_FADE_BUFFER then
            // 隐藏 UI
            call DzSimpleFrameShow(MAIN_FRAME, false)
        else
            // 清理 UI
            // 其他 UI 会同时清理
            call X_DestroySimpleFrame(MAIN_FRAME)
            // 清空哈希表
            call FlushChildHashtable(HT, i)
            // 移出死亡淡化队列
            call X_VectorEraseValue(dead_units, i)
        endif
        return
    endif
    
    if time >= HP_fade_speed then
        set alpha = 0
    else
        set alpha = 255 - R2I(I2R(time) / HP_fade_speed * 255)
    endif
    
    if alpha != 0 then
        set ui_x = X_GetUnitHPBarX(u)
        // 屏幕外
        if ui_x == -1 then
            if HEALTHBAR_FADE_BUFFER then
                // 隐藏 UI
                call DzSimpleFrameShow(MAIN_FRAME, false)
            else
                // 清理 UI
                // 其他 UI 会同时清理
                call X_DestroySimpleFrame(MAIN_FRAME)
                // 清空哈希表
                call FlushChildHashtable(HT, i)
                // 移出死亡淡化队列
                call X_VectorEraseValue(dead_units, i)
            endif
            return
        endif
        set ui_y = X_GetUnitHPBarY(u)
        
        // 显示 UI
        call DzSimpleFrameShow(MAIN_FRAME, true)
    
        // 设置透明度
        call DzFrameSetVertexColor(HP_background, alpha * 0x1000000 + 0xFFFFFF)
        call DzFrameSetVertexColor(HP_bar, alpha * 0x1000000 + 0xFFFFFF)
        call DzFrameSetVertexColor(HP_effect, alpha * 0x1000000 + 0xFFFFFF)
        call DzFrameSetVertexColor(MP_background, alpha * 0x1000000 + 0xFFFFFF)
        call DzFrameSetVertexColor(MP_bar, alpha * 0x1000000 + 0xFFFFFF)
        call X_SimpleRegionSetVertexColor(player_name, alpha * 0x1000000 + 0xFFFFFF)
        call X_SimpleRegionSetVertexColor(hero_icon, alpha * 0x1000000 + 0xFFFFFF) // 这个可以用 DzFrameSetVertexColor
        
        // 读取宽度
        set size_w = LoadReal(HT, i, UI_HP_width)
        
        // 设置 UI 位置
        call DzFrameSetAbsolutePoint(HP_background, P_TOPLEFT, ui_x - size_w / 2 + offsetX, ui_y + offsetY)
        call DzFrameSetAbsolutePoint(HP_background, P_BTMRIGHT, ui_x + size_w / 2 + offsetX, ui_y - size_h + offsetY)
        call DzFrameClearAllPoints(player_name)
        call DzFrameSetPoint(player_name, P_BTM, HP_background, P_TOP, 0, 0)
        
        // 设置 血条UI 当前值
        call DzFrameSetValue(HP_bar, 0)
        
        // 获取上次受到伤害时间
        set last_damaged_time = LoadInteger(HT, i, UI_HP_last_damaged_time)
        
        // 距离上次受到伤害时间超过 DELAY + HP_effect_drop_speed
        if X_timeGetTime() - last_damaged_time > DELAY + HP_effect_drop_speed then
            // 设置 渐变条UI 当前值
            call DzFrameSetValue(HP_effect, 0)
        // 如果 距离上次受到伤害时间超过 DELAY 且小于 DELAY + HP_effect_drop_speed
        elseif X_timeGetTime() - last_damaged_time > DELAY then
            // 设置 渐变条UI 当前值
            call DzFrameSetValue(HP_effect, LoadReal(HT, i, UI_HP_effect_percent) - (LoadReal(HT, i, UI_HP_effect_percent) - 0) * (X_timeGetTime() - last_damaged_time - DELAY) / HP_effect_drop_speed)
            // 这里没有保存 渐变条UI 百分比
            // 因为上面的算法要求
        endif
        
        // 蓝条
        if GetUnitState(u, UNIT_STATE_MAX_MANA) > 0 then
            call DzFrameSetValue(MP_bar, GetUnitState(u, UNIT_STATE_MANA) / GetUnitState(u, UNIT_STATE_MAX_MANA))
        else
            call DzSimpleFrameShow(MP_background, false)
            call DzSimpleFrameShow(MP_bar, false)
        endif
        
        // 英雄 UI
        if not IsHeroUnitId(GetUnitTypeId(u)) then
            call DzSimpleFrameShow(HERO_FRAME, false)
        endif
    else
        // 清理 UI
        // 其他 UI 会同时清理
        call X_DestroySimpleFrame(MAIN_FRAME)
        
        // 清空哈希表
        call FlushChildHashtable(HT, i)
        
        // 移出死亡淡化队列
        call X_VectorEraseValue(dead_units, i)
    endif
endfunction
private function hideUI takes nothing returns nothing
    // 隐藏 UI
    call DzSimpleFrameShow(LoadInteger(HT, X_VectorGetEnumValue(), UI_MAIN_FRAME), false)
endfunction
private function onUpdateHPBarEnd takes nothing returns nothing
    // 是否处于可以显示血条的状态
    if X_ShouldShowHPBar() then
        // 选取做动作
        call X_VectorForEach(dead_units, function updateDeadUnit, true)
    else
        call X_VectorForEach(dead_units, function hideUI, true)
    endif
endfunction
private function onDeath takes nothing returns nothing
    // 死亡单位
    local unit u = GetTriggerUnit()
    
    // 获取哈希表索引
    local integer i = GetHandleId(u)
    
    // 检查 UI 是否存在
    if HaveSavedInteger(HT, i, UI_MAIN_FRAME) and not LoadBoolean(HT, i, UI_is_unit_dead) /* 安全起见还是检查一下是不是死两次 */then
        // 记录单位死亡
        call SaveBoolean(HT, i, UI_is_unit_dead, true)
        
        // 记录死亡时间
        call SaveInteger(HT, i, UI_unit_dead_time, X_timeGetTime())
        
        // 检查是否是触发直接杀死单位
        if X_timeGetTime() - LoadInteger(HT, i, UI_HP_last_damaged_time) > DELAY_TO_CONSIDER_SCRIPT_KILL then
            // 取当前渐变条数值覆盖渐变开始值
            call SaveReal(HT, i, UI_HP_effect_percent, DzFrameGetValue(LoadInteger(HT, i, UI_HP_effect)))
            
            // 覆盖受到伤害时间
            call SaveInteger(HT, i, UI_HP_last_damaged_time, X_timeGetTime() - DELAY)
        endif
        // 添加进死亡淡化队列
        call X_VectorPushback(dead_units, i)
    endif
endfunction
private function onOwnerChange takes nothing returns nothing
    // 触发单位
    local unit u = GetTriggerUnit()
    
    // 获取哈希表索引
    local integer i = GetHandleId(u)
    
    // 检查 UI 是否存在
    if HaveSavedInteger(HT, i, UI_MAIN_FRAME) then
    
        // 设置 UI 贴图
        if GetOwningPlayer(u) == GetLocalPlayer() then
            call DzFrameSetTexture(LoadInteger(HT, i, UI_HP_bar), self_bar_texture, 0)
            call DzFrameSetTexture(LoadInteger(HT, i, UI_HP_effect), self_effect_texture, 0)
            call DzFrameSetTexture(LoadInteger(HT, i, UI_MP_bar), self_MP_bar_texture, 0)
        elseif IsUnitAlly(u, GetLocalPlayer()) then
            call DzFrameSetTexture(LoadInteger(HT, i, UI_HP_bar), ally_bar_texture, 0)
            call DzFrameSetTexture(LoadInteger(HT, i, UI_HP_effect), ally_effect_texture, 0)
            call DzFrameSetTexture(LoadInteger(HT, i, UI_MP_bar), ally_MP_bar_texture, 0)
        else
            call DzFrameSetTexture(LoadInteger(HT, i, UI_HP_bar), enemy_bar_texture, 0)
            call DzFrameSetTexture(LoadInteger(HT, i, UI_HP_effect), enemy_effect_texture, 0)
            call DzFrameSetTexture(LoadInteger(HT, i, UI_MP_bar), enemy_MP_bar_texture, 0)
        endif
        
        // 设置名称
        if GetPlayerController(GetOwningPlayer(u)) == MAP_CONTROL_USER then
            call DzFrameSetText(LoadInteger(HT, i, UI_player_name), GetPlayerName(GetOwningPlayer(u)))
        else
            // 非玩家 使用单位名称
            call DzFrameSetText(LoadInteger(HT, i, UI_player_name), GetUnitName(u))
        endif
    endif
endfunction
private function onChangeID takes nothing returns nothing
    // 触发单位
    local unit u = GetTriggerUnit()
    
    // 获取哈希表索引
    local integer i = GetHandleId(u)
    
    // 检查 UI 是否存在
    if HaveSavedInteger(HT, i, UI_MAIN_FRAME) then
        // 英雄图标
        // 设置 UI 贴图
        call DzFrameSetTexture(LoadInteger(HT, i, UI_hero_icon), EXExecuteScript("require 'jass.slk'.unit[" + I2S(GetUnitTypeId(u)) + "].Art"), 0)
        
        // 设置名称
        if GetPlayerController(GetOwningPlayer(u)) != MAP_CONTROL_USER then
            // 非玩家 使用单位名称
            call DzFrameSetText(LoadInteger(HT, i, UI_player_name), GetUnitName(u))
        endif
    endif
endfunction

// 配置
public function SetPlayerNameFont takes string value returns nothing
    if not initialized_async then
        set player_name_font = value
    endif
endfunction
public function SetPlayerNameFontSize takes real value returns nothing
    if not initialized_async then
        set player_name_font_height = value
    endif
endfunction
public function SetHeight takes real value returns nothing
    if not initialized_async then
        set size_h = value
    endif
endfunction
public function SetOffsetL takes real value returns nothing
    if not initialized_async then
        set offsetL = value
    endif
endfunction
public function SetOffsetT takes real value returns nothing
    if not initialized_async then
        set offsetT = value
    endif
endfunction
public function SetOffsetB takes real value returns nothing
    if not initialized_async then
        set offsetB = value
    endif
endfunction
public function SetOffsetR takes real value returns nothing
    if not initialized_async then
        set offsetR = value
    endif
endfunction
public function SetOffsetX takes real value returns nothing
    if not initialized_async then
        set offsetX = value
    endif
endfunction
public function SetOffsetY takes real value returns nothing
    if not initialized_async then
        set offsetY = value
    endif
endfunction
public function SetHeroIconSizeW takes real value returns nothing
    if not initialized_async then
        set hero_icon_size_w = value
    endif
endfunction
public function SetHeroIconSizeH takes real value returns nothing
    if not initialized_async then
        set hero_icon_size_h = value
    endif
endfunction
public function SetDelay takes integer value returns nothing
    if not initialized_async then
        set DELAY = value
    endif
endfunction
public function SetEffectDropSpeed takes integer value returns nothing
    if not initialized_async then
        set HP_effect_drop_speed = value
    endif
endfunction
public function SetFadeSpeed takes integer value returns nothing
    if not initialized_async then
        set HP_fade_speed = value
    endif
endfunction
public function SetFadeUseBuffer takes boolean value returns nothing
    if not initialized_async then
        set HEALTHBAR_FADE_BUFFER = value
    endif
endfunction
public function SetDelayToConsiderScriptKill takes real value returns nothing
    if not initialized_async then
        set DELAY_TO_CONSIDER_SCRIPT_KILL = value
    endif
endfunction
public function SetBackgroundTexture takes string value returns nothing
    if not initialized_async then
        set background_texture = value
    endif
endfunction
public function SetAllyBarTexture takes string value returns nothing
    if not initialized_async then
        set ally_bar_texture = value
    endif
endfunction
public function SetEnemyBarTexture takes string value returns nothing
    if not initialized_async then
        set enemy_bar_texture = value
    endif
endfunction
public function SetSelfBarTexture takes string value returns nothing
    if not initialized_async then
        set self_bar_texture = value
    endif
endfunction
public function SetAllyEffectTexture takes string value returns nothing
    if not initialized_async then
        set ally_effect_texture = value
    endif
endfunction
public function SetEnemyEffectTexture takes string value returns nothing
    if not initialized_async then
        set enemy_effect_texture = value
    endif
endfunction
public function SetSelfEffectTexture takes string value returns nothing
    if not initialized_async then
        set self_effect_texture = value
    endif
endfunction
public function SetMPBackgroundTexture takes string value returns nothing
    if not initialized_async then
        set MP_background_texture = value
    endif
endfunction
public function SetAllyMPBarTexture takes string value returns nothing
    if not initialized_async then
        set ally_MP_bar_texture = value
    endif
endfunction
public function SetEnemyMPBarTexture takes string value returns nothing
    if not initialized_async then
        set enemy_MP_bar_texture = value
    endif
endfunction
public function SetSelfMPBarTexture takes string value returns nothing
    if not initialized_async then
        set self_MP_bar_texture = value
    endif
endfunction

public function Initialize takes player p returns nothing
    local trigger t
    
    if not initialized then
        // 初始化全局变量
        set HT = InitHashtable()
        
        // 创建触发器
        set t = CreateTrigger()
        // 注册任意单位接受伤害事件(计数护甲前, 全部玩家)
        <? for i = 0, 15, 1 do ?>
        call X_TriggerRegisterPlayerUnitDamagingEvent(t, Player(<?= i ?>))
        <? end ?>
        // 添加触发动作
        call TriggerAddCondition(t, Condition(function onDamage))
        
        // 创建触发器
        set t = CreateTrigger()
        // 注册任意单位死亡事件
        <? for i = 0, 15, 1 do ?>
        call TriggerRegisterPlayerUnitEvent(t, Player(<?= i ?>), EVENT_PLAYER_UNIT_DEATH, null)
        <? end ?>
        // 添加触发动作
        call TriggerAddCondition(t, Condition(function onDeath))
        
        // 创建触发器
        set t = CreateTrigger()
        // 注册任意单位更改所有者事件
        <? for i = 0, 15, 1 do ?>
        call TriggerRegisterPlayerUnitEvent(t, Player(<?= i ?>), EVENT_PLAYER_UNIT_CHANGE_OWNER, null)
        <? end ?>
        // 添加触发动作
        call TriggerAddCondition(t, Condition(function onOwnerChange))
        
        // 创建触发器
        set t = CreateTrigger()
        // 注册任意单位更改所有者事件
        <? for i = 0, 15, 1 do ?>
        call X_TriggerRegisterPlayerUnitChangeIDEvent(t, Player(<?= i ?>))
        <? end ?>
        // 添加触发动作
        call TriggerAddCondition(t, Condition(function onChangeID))
        
        set initialized = true
    endif
    
    if GetLocalPlayer() == p and not initialized_async then
        // 注册血条更新事件
        call X_TriggerRegisterHPBarUpdateEventByCode(function onUpdateHPBar)
        // 注册血条隐藏事件
        call X_TriggerRegisterHPBarHideEventByCode(function onHide)
        // 注册血条更新结束事件
        call X_TriggerRegisterHPBarUpdateEndEventByCode(function onUpdateHPBarEnd)
        set initialized_async = true
    endif
endfunction
private function init takes nothing returns nothing
    set dead_units = X_VectorCreate(false)
endfunction
#undef _margin
#undef _offsetL
#undef _offsetT
#undef _offsetB
#undef _offsetR
#undef P_TOPLEFT
#undef P_TOP
#undef P_TOPRIGHT
#undef P_BTMLEFT
#undef P_BTM
#undef P_BTMRIGHT
endlibrary

#endif
