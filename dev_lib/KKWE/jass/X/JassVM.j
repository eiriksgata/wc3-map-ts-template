#ifndef X_JASSVM_inc
#define X_JASSVM_inc

native X_EnableOpcodeLimit                          takes boolean enable returns nothing
native X_EnableOpcodeCounter                        takes boolean enable returns nothing
native X_SetOpcodeBehavior                          takes boolean enablelimit, boolean enablecounter returns nothing
native X_DoGC                                       takes code callback returns integer
native X_GetGCHandle                                takes nothing returns handle

#endif
