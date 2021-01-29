@echo off

set subfolder=Files
set templatesFolderPath=.\res\%subfolder%\Templates
set symbolsFolderPath=.\res\%subfolder%\Symbols
set iconsFolderPath=.\res\%subfolder%\Icons
set temporaryFolderPath=.\tmp
set globalSettingsPath=.\res\settings.json
set localSettingsPath=.\res\%subfolder%\settings.json

node "./main.js" "%templatesFolderPath%" "%symbolsFolderPath%" "%iconsFolderPath%" "%temporaryFolderPath%" "%globalSettingsPath%" "%localSettingsPath%"

pause