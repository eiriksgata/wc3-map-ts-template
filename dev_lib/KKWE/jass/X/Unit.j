#ifndef X_UNIT_inc
#define X_UNIT_inc

native X_IsUnitInvulnerable                         takes unit whichUnit returns boolean
native X_ShouldUnitShowHPBar                        takes unit whichUnit returns boolean
native X_GetUnitHPBarX                              takes unit whichUnit returns real
native X_GetUnitHPBarY                              takes unit whichUnit returns real
native X_Handle2Unit                                takes integer handleID returns unit
native X_SetUnitLifeRegen                           takes unit whichUnit, real value returns boolean
native X_GetUnitLifeRegen                           takes unit whichUnit returns real
native X_SetUnitManaRegen                           takes unit whichUnit, real value returns boolean
native X_GetUnitManaRegen                           takes unit whichUnit returns real
native X_GetUnitPojectileLaunchX                    takes unit whichUnit returns real
native X_GetUnitPojectileLaunchY                    takes unit whichUnit returns real
native X_GetUnitPojectileLaunchZ                    takes unit whichUnit returns real
native X_GetUnitZ                                   takes unit whichUnit returns real
native X_SetUnitMinSpeed                            takes unit whichUnit, real value, boolean ignore_polymorph returns boolean
native X_SetUnitMaxSpeed                            takes unit whichUnit, real value, boolean ignore_polymorph returns boolean
native X_SetUnitCastPoint                           takes unit whichUnit, real value returns boolean
native X_GetUnitCastPoint                           takes unit whichUnit returns real
native X_SetUnitBackSwing                           takes unit whichUnit, real value returns boolean
native X_GetUnitBackSwing                           takes unit whichUnit returns real
native X_KillUnit                                   takes unit whichUnit, unit killer returns boolean
native X_GetUnitDefense                             takes unit whichUnit, boolean include_bonus returns real
native X_GetPlayerSelectedMainUnit                  takes player whichPlayer returns unit

#endif
