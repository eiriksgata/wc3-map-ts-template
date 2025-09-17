#ifndef X_LowLevelJAPI_MODEL_inc
#define X_LowLevelJAPI_MODEL_inc

native X_SpriteGetModel                                         takes integer sprite returns integer
native X_ModelFrameGetModel                                     takes integer modelframe, integer index returns integer
native X_SetModelAnimationByIndex                               takes integer model, integer index, integer flag returns boolean
native X_ScaleModelParticle2Size                                takes integer model, real rate returns boolean
native X_SetAttachedModelScale                                  takes integer model, real scale_x, real scale_y, real scale_z returns boolean

#endif
