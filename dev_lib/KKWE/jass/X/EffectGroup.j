#ifndef X_EFFECTGROUP_inc
#define X_EFFECTGROUP_inc

type X_EffectGroup                              extends agent

native X_EffectGroupCreate                      takes nothing returns X_EffectGroup
native X_EffectGroupGetSize                     takes X_EffectGroup whichEffectGroup returns integer
native X_EffectGroupAt                          takes X_EffectGroup whichEffectGroup, integer index returns effect
native X_EffectGroupClear                       takes X_EffectGroup whichEffectGroup returns integer
native X_EffectGroupAdd                         takes X_EffectGroup whichEffectGroup, effect whichEffect, boolean allowDuplicate returns integer
native X_EffectGroupRemove                      takes X_EffectGroup whichEffectGroup, effect whichEffect, boolean firstOnly returns boolean
native X_EffectGroupEnumRange                   takes X_EffectGroup whichEffectGroup, real x, real y, real range, boolean clear, boolean allowDuplicate returns integer
native X_EffectGroupEnumRect                    takes X_EffectGroup whichEffectGroup, rect whichRect, boolean clear, boolean allowDuplicate returns integer
native X_EffectGroupDestroy                     takes X_EffectGroup whichEffectGroup returns boolean
native X_GetEnumEffect                          takes nothing returns effect
native X_ForEffectGroup                         takes X_EffectGroup whichEffectGroup, code callback returns integer

#endif
