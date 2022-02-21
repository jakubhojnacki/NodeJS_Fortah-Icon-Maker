@echo off

set ProfileName="serviceStop"
set OutputPath="C:\\Temp"

node .\src\main.mjs %ProfileName% %OutputPath%

pause