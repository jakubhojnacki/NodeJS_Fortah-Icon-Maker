@echo off

set ProfileName="windowsFilesMiddle"
set OutputPath="C:\\Temp"

node .\src\main.mjs %ProfileName% %OutputPath%

pause