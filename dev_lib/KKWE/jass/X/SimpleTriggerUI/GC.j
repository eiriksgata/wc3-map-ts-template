#ifndef X_SIMPLETRIGGERUI_GC_inc
#define X_SIMPLETRIGGERUI_GC_inc
#include "X/Agent.j"
#include "X/AsyncEvent/HandleRelease.j"
#include "X/JassVM.j"

// 别封装起来
library XSimpleTriggerUIClearLeak
globals
    private boolean initialized = false
    private integer gc_count
    private integer gc_location_count
    private integer gc_group_count
    private integer gc_force_count
endglobals
private function GC_YDHT_callback takes nothing returns nothing
    // call BJDebugMsg("清除逆天自定义值: " + I2S(GetHandleId(X_GetHandleReleased())))
    call FlushChildHashtable(YDHT, GetHandleId(X_GetHandleReleased()))
endfunction
private function GC_callback takes nothing returns nothing
    local integer typeID = X_GetAgentTypeID(X_GetGCHandle())
    loop
        if typeID == '+loc' then
            set gc_location_count = gc_location_count + 1
        elseif typeID == '+grp' then
            set gc_group_count = gc_group_count + 1
        elseif typeID == '+frc' then
            set gc_force_count = gc_force_count + 1
        else
            return
        endif
        set gc_count = gc_count + 1
        call X_DestroyAgent(X_GetGCHandle())
        return
    endloop
endfunction
private function gcTimer takes nothing returns nothing
    call X_DoGC(function GC_callback)
    // set gc_count = 0
    // set gc_location_count = 0
    // set gc_group_count = 0
    // set gc_force_count = 0
    // call BJDebugMsg("共 " + I2S(X_DoGC(function GC_callback)) + " 个无效引用")
    // call BJDebugMsg("已处理 " + I2S(gc_count) + " 个无效引用")
    // call BJDebugMsg("    " + I2S(gc_location_count) + " 个点")
    // call BJDebugMsg("    " + I2S(gc_group_count) + " 个单位组")
    // call BJDebugMsg("    " + I2S(gc_force_count) + " 个玩家组")
endfunction
public function Initialize takes nothing returns nothing
    if not initialized then
        set initialized = true
        call X_TriggerRegisterHandleIDReleaseByCode(function GC_YDHT_callback)
        call TimerStart(CreateTimer(), 60, true, function gcTimer)
    endif
endfunction
endlibrary
#endif
