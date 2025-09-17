#ifndef X_LowLevelJAPI_CAMERA_inc
#define X_LowLevelJAPI_CAMERA_inc

native X_FrameCreateCamera                                      takes integer frame returns integer
native X_FrameSetCamera                                         takes integer frame, integer camera returns boolean
native X_FrameGetCamera                                         takes integer frame returns integer
native X_SetCameraTargetPosition                                takes integer camera, real x, real y, real z returns boolean
native X_SetCameraTargetPositionX                               takes integer camera, real value returns boolean
native X_SetCameraTargetPositionY                               takes integer camera, real value returns boolean
native X_SetCameraTargetPositionZ                               takes integer camera, real value returns boolean
native X_SetCameraSourcePosition                                takes integer camera, real x, real y, real z returns boolean
native X_SetCameraSourcePositionX                               takes integer camera, real value returns boolean
native X_SetCameraSourcePositionY                               takes integer camera, real value returns boolean
native X_SetCameraSourcePositionZ                               takes integer camera, real value returns boolean
native X_SetCameraDistance                                      takes integer camera, real value returns boolean
native X_SetCameraFarZ                                          takes integer camera, real value returns boolean
native X_SetCameraNearZ                                         takes integer camera, real value returns boolean

#endif
