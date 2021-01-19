@echo off

set subfolder=Folders
set templatesFolderPath=.\res\%subfolder%\Templates
set symbolsFolderPath=.\res\%subfolder%\Symbols
set iconsFolderPath=.\res\%subfolder%\Icons
set temporaryFolderPath=.\res\Temp
set settingsPath=.\res\%subfolder%\settings.json

node "./main.js" "%templatesFolderPath%" "%symbolsFolderPath%" "%iconsFolderPath%" "%temporaryFolderPath%" "%settingsPath%"

pause