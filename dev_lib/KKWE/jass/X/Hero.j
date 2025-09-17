#ifndef X_HERO_inc
#define X_HERO_inc

native X_SetHeroPrimaryAttribute                    takes unit whichUnit, integer value returns boolean
native X_GetHeroPrimaryAttribute                    takes unit whichUnit, boolean include_bonus returns integer
native X_SetHeroPrimaryAttributeType                takes unit whichUnit, integer attribute_type, boolean keep_current_primary_bonus returns boolean
native X_GetHeroPrimaryAttributeType                takes unit whichUnit returns integer
native X_SetHeroAttributePlus                       takes unit whichUnit, integer attribute_type, real value, boolean keep_current_bonus returns boolean
native X_GetHeroAttributePlus                       takes unit whichUnit, integer attribute_type returns real

#endif
