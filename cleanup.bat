@echo off
chcp 65001 >nul
echo 清理多余文件...
echo.

setlocal enabledelayedexpansion

REM 要删除的文件列表
set files=^
  index.html ^
  app.py ^
  Ashare.py ^
  MyTT.py ^
  requirements.txt ^
  run.bat ^
  quick-start.js ^
  DEPLOYMENT_COMPARISON.md ^
  README-CloudflareWorkers.md

for %%f in (%files%) do (
    if exist "%%f" (
        del /q "%%f"
        echo ✓ 删除: %%f
    )
)

echo.
echo ✓ 清理完成！
echo.
echo 保留的文件：
echo   - src/index.js ^(Worker 脚本^)
echo   - wrangler.toml ^(配置^)
echo   - package.json ^(依赖^)
echo   - deploy.bat/deploy.sh ^(部署脚本^)
echo   - README.md ^(文档^)
echo   - DEPLOY_GUIDE.md ^(部署指南^)
echo   - .gitignore ^(Git 配置^)
echo.
pause
