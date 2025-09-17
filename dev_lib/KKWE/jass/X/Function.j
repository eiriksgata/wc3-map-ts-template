#ifndef X_FRAME_inc
#define X_FRAME_inc

native X_ExecuteFuncByCode                      takes code callback, boolean async returns boolean
native X_DelayedExecuteFuncByCode               takes code callback, real delay, boolean periodic, boolean async returns boolean

#endif
