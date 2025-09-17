@echo off
setlocal

set MAPNAME="dist\map.w3x"
set YDWEPATH="dev_lib\YDWE\bin\YDWEConfig.exe"

w2l.exe obj ./tsmap %MAPNAME%

%YDWEPATH% -launchwar3 -loadfile %MAPNAME%

endlocal