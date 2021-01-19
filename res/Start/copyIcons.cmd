@echo off

set SourceFolder=Icons
set DestinationFolder=C:\Multimedia\Icons\Start Stop

copy "%SourceFolder%\DynamicsBc1501.ico" "%DestinationFolder%\Dynamics BC 01 Start.ico"
copy "%SourceFolder%\DynamicsBc1502.ico" "%DestinationFolder%\Dynamics BC 02 Start.ico"
copy "%SourceFolder%\DynamicsBc1503.ico" "%DestinationFolder%\Dynamics BC 03 Start.ico"
copy "%SourceFolder%\DynamicsBc1504.ico" "%DestinationFolder%\Dynamics BC 04 Start.ico"
copy "%SourceFolder%\DynamicsBc1505.ico" "%DestinationFolder%\Dynamics BC 05 Start.ico"
copy "%SourceFolder%\DynamicsNav.ico" "%DestinationFolder%\Dynamics NAV Start.ico"
copy "%SourceFolder%\DynamicsNavClassic.ico" "%DestinationFolder%\Dynamics NAV Classic Start.ico"
copy "%SourceFolder%\Service.ico" "%DestinationFolder%\Service Start.ico"
copy "%SourceFolder%\SQL.ico" "%DestinationFolder%\SQL Start.ico"

pause
