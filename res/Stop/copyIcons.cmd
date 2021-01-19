@echo off

set SourceFolder=Icons
set DestinationFolder=C:\Multimedia\Icons\Start Stop

copy "%SourceFolder%\DynamicsBc1501.ico" "%DestinationFolder%\Dynamics BC 01 Stop.ico"
copy "%SourceFolder%\DynamicsBc1502.ico" "%DestinationFolder%\Dynamics BC 02 Stop.ico"
copy "%SourceFolder%\DynamicsBc1503.ico" "%DestinationFolder%\Dynamics BC 03 Stop.ico"
copy "%SourceFolder%\DynamicsBc1504.ico" "%DestinationFolder%\Dynamics BC 04 Stop.ico"
copy "%SourceFolder%\DynamicsBc1505.ico" "%DestinationFolder%\Dynamics BC 05 Stop.ico"
copy "%SourceFolder%\DynamicsNav.ico" "%DestinationFolder%\Dynamics NAV Stop.ico"
copy "%SourceFolder%\DynamicsNavClassic.ico" "%DestinationFolder%\Dynamics NAV Classic Stop.ico"
copy "%SourceFolder%\Service.ico" "%DestinationFolder%\Service Stop.ico"
copy "%SourceFolder%\SQL.ico" "%DestinationFolder%\SQL Stop.ico"

pause
