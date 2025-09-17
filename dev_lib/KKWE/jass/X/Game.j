#ifndef X_GAME_inc
#define X_GAME_inc

native X_GetCurrentSyncCheckSum                     takes nothing returns integer
native X_SetGlobalUnitMinMaxMoveSpeed               takes real building_min, real building_max, real unit_min, real unit_max, real GC_building_min, real GC_building_max, real GC_unit_min, real GC_unit_max, real harvest_min, real windwalk_max returns nothing
native X_EnableAutoDumpGameLog                      takes nothing returns string
native X_DumpGameLog                                takes nothing returns string
native X_EnableSyncLog                              takes nothing returns string
native X_SetGameConstantFoodCeiling                 takes integer value returns nothing
native X_EnableCrashDump                            takes nothing returns nothing
native X_SetPlayerPathFindingLimit                  takes player whichPlayer, integer limit_1, integer limit_2, integer limit_3, integer limit_4 returns boolean
native X_SetMinMaxAttackSpeedFactor                 takes real min, real max returns nothing
native X_SetMoveSpeedBonusesStack                   takes boolean flag returns nothing

#endif
