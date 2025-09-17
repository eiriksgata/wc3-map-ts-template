#ifndef X_ASYNCEVENT_HEALTHBAR_inc
#define X_ASYNCEVENT_HEALTHBAR_inc

native X_TriggerRegisterHPBarUpdateEventByCode          takes code callback returns nothing
native X_GetHPBarUpdateEventWidget                      takes nothing returns widget
native X_GetHPBarUpdateEventUnit                        takes nothing returns unit
native X_GetHPBarUpdateEventDestructable                takes nothing returns destructable
native X_GetHPBarUpdateEventX                           takes nothing returns real
native X_GetHPBarUpdateEventY                           takes nothing returns real
native X_GetHPBarUpdateEventWidth                       takes nothing returns real
native X_HideHPBarUpdateEventUI                         takes nothing returns nothing
native X_TriggerRegisterHPBarHideEventByCode            takes code callback returns nothing
native X_GetHPBarHideEventWidget                        takes nothing returns widget
native X_GetHPBarHideEventUnit                          takes nothing returns unit
native X_GetHPBarHideEventDestructable                  takes nothing returns destructable
native X_TriggerRegisterHPBarUpdateEndEventByCode       takes code callback returns nothing

#endif
