#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

convert "/home/Multimedia/Icons/0256/Dynamics/Dynamics BC 15 01.png" -resize "192x192" "/home/Development/Node JS/Applications/Icon Maker/temp/Dynamics BC 15 01.png"

read -n 1 -s -r -p "{text_to_show}"
