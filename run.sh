#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

profileName="linuxDirectoriesBreezeOrange"
outputPath="/home/Temp"

node "./src/main.mjs" $profileName $outputPath

read -n 1 -s -r -p "(Press any key to end)"
