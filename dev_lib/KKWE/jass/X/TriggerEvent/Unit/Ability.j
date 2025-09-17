#ifndef X_TRIGGEREVENT_UNIT_ABILITY_inc
#define X_TRIGGEREVENT_UNIT_ABILITY_inc

native X_TriggerRegisterPlayerUnitAddAbilityEvent                       takes trigger whichTrigger, player whichPlayer returns event
native X_TriggerRegisterPlayerUnitRemoveAbilityEvent                    takes trigger whichTrigger, player whichPlayer returns event
native X_GetModifyAbilityEventAbility                                   takes nothing returns ability
native X_GetModifyAbilityEventAbilityID                                 takes nothing returns integer

native X_TriggerRegisterPlayerUnitAbilityBaseBuildSetDurationEvent      takes trigger whichTrigger, player whichPlayer returns event
native X_GetAbilityBaseBuildSetDurationEventDuration                    takes nothing returns real
native X_SetAbilityBaseBuildSetDurationEventDuration                    takes real duration returns boolean
native X_GetAbilityBaseBuildSetDurationEventTargetEventType             takes nothing returns integer
native X_GetAbilityBaseBuildSetDurationEventTargetID                    takes nothing returns integer

#endif
