@echo off

set ProfileName="windowsDirectories"
set OutputPath="C:\Temp"

node .\src\main.mjs %ProfileName% %OutputPath%

pause