@echo off

set subfolder=Files
set templatesFolderPath=.\%subfolder%\Templates
set symbolsFolderPath=.\%subfolder%\Symbols
set iconsFolderPath=.\%subfolder%\Icons
set temporaryFolderPath=.\Temp
set settingsPath=.\%subfolder%\settings.json

node "./main.js" "%templatesFolderPath%" "%symbolsFolderPath%" "%iconsFolderPath%" "%temporaryFolderPath%" "%settingsPath%"

pause