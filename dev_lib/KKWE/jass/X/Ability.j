#ifndef X_ABILITY_inc
#define X_ABILITY_inc

native X_StartUnitAbilityCooldown           takes unit whichUnit, integer abilID, real cooldown returns boolean
native X_IsUnitAbilityInCooldown            takes unit whichUnit, integer abilID returns boolean
native X_EndUnitAbilityCooldown             takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityTargetFlags          takes unit whichUnit, integer abilID, integer value returns boolean
native X_GetUnitAbilityTargetFlags          takes unit whichUnit, integer abilID returns integer
native X_ResetUnitAbilityTargetFlags        takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityCastTime             takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityCastTime             takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityCastTime           takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDuration             takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDuration             takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDuration           takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityHeroDuration         takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityHeroDuration         takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityHeroDuration       takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityManaCost             takes unit whichUnit, integer abilID, integer value returns boolean
native X_GetUnitAbilityManaCost             takes unit whichUnit, integer abilID returns integer
native X_ResetUnitAbilityManaCost           takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityCooldown             takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityCooldown             takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityCooldown           takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityAreaOfEffect         takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityAreaOfEffect         takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityAreaOfEffect       takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityRange                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityRange                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityRange              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataA                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataA                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataA              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataB                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataB                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataB              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataC                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataC                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataC              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataD                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataD                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataD              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataE                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataE                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataE              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataF                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataF                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataF              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataG                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataG                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataG              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataH                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataH                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataH              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityDataI                takes unit whichUnit, integer abilID, real value returns boolean
native X_GetUnitAbilityDataI                takes unit whichUnit, integer abilID returns real
native X_ResetUnitAbilityDataI              takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityUnitID               takes unit whichUnit, integer abilID, integer value returns boolean
native X_GetUnitAbilityUnitID               takes unit whichUnit, integer abilID returns integer
native X_ResetUnitAbilityUnitID             takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityBuffID               takes unit whichUnit, integer abilID, integer index, integer value returns boolean
native X_GetUnitAbilityBuffID               takes unit whichUnit, integer abilID, integer index returns integer
native X_ResetUnitAbilityBuffID             takes unit whichUnit, integer abilID, integer index returns boolean
native X_ResetUnitAbilityAllBuffID          takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityEffectID             takes unit whichUnit, integer abilID, integer index, integer value returns boolean
native X_GetUnitAbilityEffectID             takes unit whichUnit, integer abilID, integer index returns integer
native X_ResetUnitAbilityEffectID           takes unit whichUnit, integer abilID, integer index returns boolean
native X_ResetUnitAbilityAllEffectID        takes unit whichUnit, integer abilID returns boolean

// 下面这些只是和技能栏有关
native X_SetUnitAbilityArt                  takes unit whichUnit, integer abilID, integer orderID, string value returns boolean
native X_GetUnitAbilityOverrideArt          takes unit whichUnit, integer abilID, integer orderID returns string
native X_ResetUnitAbilityArt                takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllArt             takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityPos                  takes unit whichUnit, integer abilID, integer orderID, integer x, integer y returns boolean
native X_SetUnitAbilityAllPos               takes unit whichUnit, integer abilID, integer x, integer y returns boolean
native X_GetUnitAbilityOverridePosX         takes unit whichUnit, integer abilID, integer orderID returns integer
native X_GetUnitAbilityOverridePosY         takes unit whichUnit, integer abilID, integer orderID returns integer
native X_ResetUnitAbilityPos                takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllPos             takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityHotkey               takes unit whichUnit, integer abilID, integer orderID, integer value returns boolean
native X_SetUnitAbilityAllHotkey            takes unit whichUnit, integer abilID, integer value returns boolean
native X_GetUnitAbilityOverrideHotkey       takes unit whichUnit, integer abilID, integer orderID returns integer
native X_ResetUnitAbilityHotkey             takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllHotkey          takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityName                 takes unit whichUnit, integer abilID, integer orderID, string value returns boolean
native X_GetUnitAbilityOverrideName         takes unit whichUnit, integer abilID, integer orderID returns string
native X_ResetUnitAbilityName               takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllName            takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityTip                  takes unit whichUnit, integer abilID, integer orderID, string value returns boolean
native X_GetUnitAbilityOverrideTip          takes unit whichUnit, integer abilID, integer orderID returns string
native X_ResetUnitAbilityTip                takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllTip             takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityUberTip              takes unit whichUnit, integer abilID, integer orderID, string value returns boolean
native X_GetUnitAbilityOverrideUberTip      takes unit whichUnit, integer abilID, integer orderID returns string
native X_ResetUnitAbilityUberTip            takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllUberTip         takes unit whichUnit, integer abilID returns boolean

native X_SetUnitAbilityCharges              takes unit whichUnit, integer abilID, integer orderID, integer value returns boolean
native X_GetUnitAbilityOverrideCharges      takes unit whichUnit, integer abilID, integer orderID returns integer
native X_ResetUnitAbilityCharges            takes unit whichUnit, integer abilID, integer orderID returns boolean
native X_ResetUnitAbilityAllCharges         takes unit whichUnit, integer abilID returns boolean

native  X_SetUnitAbilityChannelTime         takes unit whichUnit, integer abilID, real value returns boolean
native  X_GetUnitAbilityChannelTime         takes unit whichUnit, integer abilID returns real

native  X_SetUnitAbilityCastPoint           takes unit whichUnit, integer abilID, real value returns boolean
native  X_GetUnitAbilityCastPoint           takes unit whichUnit, integer abilID returns real

native  X_SetUnitAbilityBackSwing           takes unit whichUnit, integer abilID, real value returns boolean
native  X_GetUnitAbilityBackSwing           takes unit whichUnit, integer abilID returns real

native X_EngineeringUpgradeUnitAbility      takes unit whichUnit, integer old_id, integer new_id, boolean update_hero_ability returns boolean 

#endif
