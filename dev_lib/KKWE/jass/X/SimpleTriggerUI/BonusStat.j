#ifndef X_SIMPLETRIGGERUI_BONUSSTAT_inc
#define X_SIMPLETRIGGERUI_BONUSSTAT_inc

#include "X/Ability.j"
#include "X/Unit.j"
#include "X/TriggerEvent/Unit/Removing.j"

library XSimpleTriggerUIBonusStat initializer init
#define STAT_MIN 0
#define STAT_ATTACK 1
#define STAT_ATTACK_SPEED 2
#define STAT_ARMOR 3
#define STAT_MOVE_SPEED 4
#define STAT_STR 5
#define STAT_AGI 6
#define STAT_INT 7
#define STAT_MAX 8
#define CHECK_UNIT_INVALID(x) X_Handle2Unit(GetHandleId(x)) != x
globals
    private hashtable HT = InitHashtable()
endglobals
public function Get takes unit u, integer t returns real
    local integer aid
    // 检查参数
    if CHECK_UNIT_INVALID(u) or t <= STAT_MIN or t >= STAT_MAX then
        return 0.
    endif
    set aid = LoadInteger(HT, 0, t)
    if GetUnitAbilityLevel(u, aid) == 0 then
        return 0.
    endif
    if /*
    */ t == STAT_ATTACK             or /*
    */ t == STAT_ATTACK_SPEED       or /*
    */ t == STAT_ARMOR              or /*
    */ t == STAT_MOVE_SPEED         or /*
    */ t == STAT_AGI                   /*
    */ then
        return X_GetUnitAbilityDataA(u, aid)
    elseif t == STAT_STR then
        return X_GetUnitAbilityDataC(u, aid)
    else // STAT_INT
        return X_GetUnitAbilityDataB(u, aid)
    endif
endfunction
// 设置属性
public function Set takes unit u, integer t, real v returns nothing
    local integer aid
    // 检查参数
    if CHECK_UNIT_INVALID(u) or t <= STAT_MIN or t >= STAT_MAX then
        return
    endif
    set aid = LoadInteger(HT, 0, t)
    if GetUnitAbilityLevel(u, aid) == 0 then
        call UnitAddAbility(u, aid)
        call UnitMakeAbilityPermanent(u, true, aid)
    endif
    if /*
    */ t == STAT_ATTACK             or /*
    */ t == STAT_ATTACK_SPEED       or /*
    */ t == STAT_ARMOR              or /*
    */ t == STAT_MOVE_SPEED         or /*
    */ t == STAT_AGI                   /*
    */ then
        call X_SetUnitAbilityDataA(u, aid, v)
    elseif t == STAT_STR then
        call X_SetUnitAbilityDataC(u, aid, v)
    else // STAT_INT
        call X_SetUnitAbilityDataB(u, aid, v)
    endif
    call IncUnitAbilityLevel(u, aid)
    call DecUnitAbilityLevel(u, aid)
endfunction
// 增加属性
public function Inc takes unit u, integer t, real v returns nothing
    // 检查参数
    if CHECK_UNIT_INVALID(u) or t <= STAT_MIN or t >= STAT_MAX then
        return
    endif
    // 问就是懒
    call Set(u, t, Get(u, t) + v)
endfunction
// 减少属性
public function Dec takes unit u, integer t, real v returns nothing
    // 检查参数
    if CHECK_UNIT_INVALID(u) or t <= STAT_MIN or t >= STAT_MAX then
        return
    endif
    // 问就是懒
    call Set(u, t, Get(u, t) - v)
endfunction
// 删除单位回调
private function onRemoveUnit takes nothing returns nothing
    call FlushChildHashtable(HT, GetHandleId(GetTriggerUnit()))
endfunction
private function init takes nothing returns nothing
    // 创建触发器
    local trigger t = CreateTrigger()
    // 注册任意单位更改所有者事件
    <? for i = 0, 15, 1 do ?>
    call X_TriggerRegisterPlayerUnitRemovingEvent(t, Player(<?= i ?>))
    <? end ?>
    // 添加触发动作
    call TriggerAddCondition(t, Condition(function onRemoveUnit))
    <?
        do
            local slk = require 'slk'
            -- // 攻击
            local attack = slk.ability.AItx:new('XSimpleTriggerUIBonusStat_attack')
            attack.EditorSuffix = "(X JAPI - 绿字属性系统)"
            attack.DataA1 = 0
            attack.item = 0
            -- // 攻速
            local attack_speed = slk.ability.AIsx:new('XSimpleTriggerUIBonusStat_attack_speed')
            attack_speed.EditorSuffix = "(X JAPI - 绿字属性系统)"
            attack_speed.DataA1 = 0
            attack_speed.item = 0
            -- // 护甲
            local armor = slk.ability.AId4:new('XSimpleTriggerUIBonusStat_armor')
            armor.EditorSuffix = "(X JAPI - 绿字属性系统)"
            armor.DataA1 = 0
            armor.item = 0
            -- // 移速
            local move_speed = slk.ability.AIms:new('XSimpleTriggerUIBonusStat_move_speed')
            move_speed.EditorSuffix = "(X JAPI - 绿字属性系统)"
            move_speed.DataA1 = 0
            move_speed.item = 0
            -- // 三维
            local allstat = slk.ability.Aamk:new('XSimpleTriggerUIBonusStat_allstat')
            allstat.EditorSuffix = "(X JAPI - 绿字属性系统)"
            allstat.DataA1 = 0
            allstat.DataB1 = 0
            allstat.DataC1 = 0
            allstat.DataD1 = 1
            allstat.levels = 1
            allstat.race = "other"
            allstat.hero = 0
    ?>
    // 保存技能ID
    call SaveInteger(HT, 0, STAT_ATTACK, '<?= attack:get_id() ?>')
    call SaveInteger(HT, 0, STAT_ATTACK_SPEED, '<?= attack_speed:get_id() ?>')
    call SaveInteger(HT, 0, STAT_ARMOR, '<?= armor:get_id() ?>')
    call SaveInteger(HT, 0, STAT_MOVE_SPEED, '<?= move_speed:get_id() ?>')
    call SaveInteger(HT, 0, STAT_STR, '<?= allstat:get_id() ?>')
    call SaveInteger(HT, 0, STAT_AGI, '<?= allstat:get_id() ?>')
    call SaveInteger(HT, 0, STAT_INT, '<?= allstat:get_id() ?>')
    <? end ?>
endfunction
#undef STAT_MIN
#undef STAT_ATTACK
#undef STAT_ATTACK_SPEED
#undef STAT_ARMOR
#undef STAT_MOVE_SPEED
#undef STAT_STR
#undef STAT_AGI
#undef STAT_INT
#undef STAT_MAX
#undef CHECK_UNIT_INVALID
endlibrary

#endif
