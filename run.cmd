@echo off

set ProfileName="windowsDirectories"
set OutputPath="C:\\Multimedia\\Icons (PNG)"

node .\src\main.mjs %ProfileName% %OutputPath%

pause