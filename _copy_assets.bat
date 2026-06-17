@echo off
chcp 65001 > nul
echo Copying source files (HTML/CSS/JS) to _assets_fresh...
copy /Y "%~dp0*.html" "%~dp0_assets_fresh\" > nul
copy /Y "%~dp0*.css" "%~dp0_assets_fresh\" > nul
copy /Y "%~dp0*.js" "%~dp0_assets_fresh\" > nul
echo Copying images and docs...
robocopy "%~dp0images" "%~dp0_assets_fresh\images" /E /NFL /NDL /NJH /NJS /nc /ns /np
robocopy "%~dp0docs" "%~dp0_assets_fresh\docs" /E /NFL /NDL /NJH /NJS /nc /ns /np
echo.
echo Done. You can close this window.
pause
