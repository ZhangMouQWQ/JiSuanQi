@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   股票信息查询 - Cloudflare Workers 部署
echo ==========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Node.js 未安装
    echo 请从 https://nodejs.org/ 下载并安装 Node.js
    pause
    exit /b 1
)

echo ✓ Node.js 版本:
node --version
echo.

REM 检查 Wrangler
wrangler --version >nul 2>&1
if errorlevel 1 (
    echo 正在全局安装 Wrangler CLI...
    call npm install -g wrangler
    echo.
)

echo ✓ Wrangler 版本:
wrangler --version
echo.

REM 安装项目依赖
echo 安装项目依赖...
call npm install
echo ✓ 依赖安装完成
echo.

echo ==========================================
echo   准备部署
echo ==========================================
echo.
echo 请选择部署方式:
echo 1) 部署到开发环境（本地测试）
echo 2) 部署到生产环境（需要 Cloudflare 账户）
echo.
set /p choice="请选择 (1 或 2): "

if "%choice%"=="1" (
    echo.
    echo 启动本地开发服务器...
    echo 访问 http://localhost:8787 进行测试
    echo.
    call npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 需要进行 Cloudflare 身份验证...
    call wrangler login
    
    echo.
    echo 部署到生产环境...
    call npm run deploy
    
    echo.
    echo ✓ 部署完成！
    echo 您的应用已部署到 Cloudflare Workers
) else (
    echo ❌ 无效选择
    pause
    exit /b 1
)

pause
