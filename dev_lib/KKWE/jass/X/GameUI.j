#ifndef X_GAMEUI_inc
#define X_GAMEUI_inc

native X_DisplayMessage                         takes string message, real duration, integer where, integer color returns boolean
native X_ClearMessage                           takes integer where returns boolean
native X_SetMessage                             takes string message, real duration, integer where, integer color returns boolean
native X_RefreshInfoBar                         takes boolean now returns boolean
native X_RefreshCommandBar                      takes boolean now returns boolean
native X_RefreshHeroBar                         takes boolean now returns boolean

#endif
