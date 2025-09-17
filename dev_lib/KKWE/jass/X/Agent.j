#ifndef X_AGENT_inc
#define X_AGENT_inc

// 别问为什么是 handle 问就是common.j 里面的 type 有错误
native X_GetAgentTypeName       takes handle whichAgent returns string
native X_GetAgentTypeID         takes handle whichAgent returns integer
native X_DestroyAgent           takes handle whichAgent returns boolean

#endif
