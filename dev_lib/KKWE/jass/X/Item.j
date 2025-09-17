#ifndef X_ITEM_inc
#define X_ITEM_inc

native X_GetItemDataInteger                 takes integer itemID, integer datatype returns integer
native X_SetItemDataInteger                 takes integer itemID, integer datatype, integer value returns boolean
native X_GetItemColor                       takes item whichItem returns integer
native X_SetItemColor                       takes item whichItem, integer color returns boolean
native X_ResetItemColor                     takes item whichItem returns boolean
native X_StartItemCooldown                  takes item whichItem, real cooldown returns boolean
native X_EndItemCooldown                    takes item whichItem returns boolean
native X_GetItemHolder                      takes item whichItem returns unit
native X_IsItemInCooldown                   takes item whichItem returns boolean
native X_IsItemInUnitCooldown               takes item whichItem, unit whichUnit returns boolean

native X_SetItemName                        takes item whichItem, string value returns boolean
native X_GetItemOverrideName                takes item whichItem returns string
native X_ResetItemName                      takes item whichItem returns boolean

native X_SetItemTip                         takes item whichItem, string value returns boolean
native X_GetItemOverrideTip                 takes item whichItem returns string
native X_ResetItemTip                       takes item whichItem returns boolean

native X_SetItemUberTip                     takes item whichItem, string value returns boolean
native X_GetItemOverrideUberTip             takes item whichItem returns string
native X_ResetItemUberTip                   takes item whichItem returns boolean

native X_SetItemArt                         takes item whichItem, string value returns boolean
native X_GetItemOverrideArt                 takes item whichItem returns string
native X_ResetItemArt                       takes item whichItem returns boolean

#endif