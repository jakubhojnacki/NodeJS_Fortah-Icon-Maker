rem "C:\Program Files (x86)\ImageMagick\magick.exe" "convert" "Symbols\Access.ico[0]" "Temp\Page0.png"
rem "C:\Program Files (x86)\ImageMagick\magick.exe" "convert" "Temp\Page0.png" "-resize" "192x192" "Temp\Page0R.png"
"C:\Program Files (x86)\ImageMagick\magick.exe" "convert" "-page" "+0+0" "Templates\0256b.png" "-page" "+48+32" "Temp\Page0R.png" "-page" "+0+0" "Templates\0256f.png" "-layers" "coalesce" "-delete" "0--2" "Temp\Page0RM.png"
pause