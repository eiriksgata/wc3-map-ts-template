#ifndef X_VECTOR_inc
#define X_VECTOR_inc

type X_Vector                               extends agent
native X_VectorCreate                       takes boolean async returns X_Vector
native X_VectorPushback                     takes X_Vector vector, integer value returns integer
native X_VectorExist                        takes X_Vector vector, integer value returns boolean
native X_VectorGet                          takes X_Vector vector, integer index returns integer
native X_VectorSet                          takes X_Vector vector, integer index, integer value returns boolean
native X_VectorInsert                       takes X_Vector vector, integer index, integer value returns boolean
native X_VectorEraseIndex                   takes X_Vector vector, integer index returns boolean
native X_VectorEraseValue                   takes X_Vector vector, integer value returns boolean
native X_VectorEraseAllValue                takes X_Vector vector, integer value returns integer
native X_VectorClear                        takes X_Vector vector returns integer
native X_VectorResize                       takes X_Vector vector, integer size returns boolean
native X_VectorShrink                       takes X_Vector vector returns boolean
native X_VectorReverse                      takes X_Vector vector returns boolean
native X_VectorGetEnumValue                 takes nothing returns integer
native X_VectorForEach                      takes X_Vector vector, code callback, boolean async returns integer
native X_VectorDestroy                      takes X_Vector vector returns boolean

#endif
