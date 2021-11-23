#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

bin="/usr/bin/convert"

"$bin" "in.svg" -resize "16x16" "0016b.png"
"$bin" "in.svg" -resize "32x32" "0032b.png"
"$bin" "in.svg" -resize "48x48" "0048b.png"
"$bin" "in.svg" -resize "64x64" "0064b.png"
"$bin" "in.svg" -resize "128x128" "0128b.png"
"$bin" "in.svg" -resize "256x256" "0256b.png"

read -n 1 -s -r -p "(Press any key to end)"
