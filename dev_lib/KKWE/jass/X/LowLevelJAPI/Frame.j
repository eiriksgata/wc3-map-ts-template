#ifndef X_LowLevelJAPI_FRAME_inc
#define X_LowLevelJAPI_FRAME_inc

native X_SpriteFrameSetDefaultLight                     takes integer spriteframe returns boolean
native X_DestroySimpleFrame                             takes integer simpleframe returns boolean
native X_CreateSimpleFontString                         takes integer parent returns integer
native X_CreateSimpleTexture                            takes integer parent returns integer
native X_SimpleTextureSetAlphaMode                      takes integer simpletexture, integer mode returns boolean
native X_SimpleTextureSetTexCoord                       takes integer simpletexture, real top, real left, real bottom, real right returns boolean
native X_SimpleRegionSetVertexColor                     takes integer simpleregion, integer color returns boolean
native X_SimpleFrameSetAlpha                            takes integer simpleframe, integer alpha returns boolean
native X_ShouldShowHPBar                                takes nothing returns boolean
native X_GetInventoryBarButton                          takes integer index returns integer
native X_CreatePortraitButton                           takes integer parent returns integer
native X_PortraitButtonSetModel                         takes integer frame, string model, integer team_color, boolean keep_current_camera returns boolean
native X_LayerAddStyle                                  takes integer frame, integer style returns boolean
native X_LayerRemoveStyle                               takes integer frame, integer style returns boolean
native X_LayerSetStyle                                  takes integer frame, integer style returns boolean
native X_LayerGetStyle                                  takes integer frame returns integer
native X_MoveCommandButton                              takes integer pCommandButton, real x, real y, real width, real height, real model_width, real model_height, boolean resize_cooldown, boolean resize_autocast returns boolean
     
#endif
