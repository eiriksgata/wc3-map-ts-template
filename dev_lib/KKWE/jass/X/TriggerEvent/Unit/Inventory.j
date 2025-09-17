#ifndef X_TRIGGEREVENT_INVENTORY_inc
#define X_TRIGGEREVENT_INVENTORY_inc

native X_TriggerRegisterPlayerUnitUpdateInventoryEvent          takes trigger whichTrigger, player whichPlayer returns event

native X_TriggerRegisterPlayerUnitSwapItemSlotEvent             takes trigger whichTrigger, player whichPlayer returns event
native X_GetSwapItemSlotEventFromSlotID                         takes nothing returns integer
native X_GetSwapItemSlotEventToSlotID                           takes nothing returns integer

#endif
