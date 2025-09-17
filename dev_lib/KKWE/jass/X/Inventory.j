#ifndef X_INVENTORY_inc
#define X_INVENTORY_inc

native X_StartManageInventory                                   takes integer max_size returns boolean
native X_GetInventoryMaxSize                                    takes nothing returns integer
native X_GetInventoryDropSlotOrderID                            takes integer index returns integer
native X_GetInventoryUseSlotOrderID                             takes integer index returns integer
native X_SetInventoryHotkeyText                                 takes integer index, string text returns boolean
native X_SetInventoryHotkey                                     takes integer index, integer hotkey returns boolean

#endif
