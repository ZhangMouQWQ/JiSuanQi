#!/bin/bash
# Cloudflare Workers 部署脚本

echo "=========================================="
echo "  股票信息查询 - Cloudflare Workers 部署"
echo "=========================================="
echo ""

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请从 https://nodejs.org/ 下载并安装 Node.js"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo ""

# 检查是否安装了 Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "正在安装 Wrangler CLI..."
    npm install -g wrangler
    echo ""
fi

echo "✓ Wrangler 版本: $(wrangler --version)"
echo ""

# 安装项目依赖
echo "安装项目依赖..."
npm install
echo "✓ 依赖安装完成"
echo ""

# 提示用户登录
echo "=========================================="
echo "  准备部署"
echo "=========================================="
echo ""
echo "请选择部署方式："
echo "1) 部署到开发环境（本地测试）"
echo "2) 部署到生产环境（需要 Cloudflare 账户）"
echo ""
read -p "请选择 (1 或 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "启动本地开发服务器..."
    echo "访问 http://localhost:8787 进行测试"
    echo ""
    npm run dev
elif [ "$choice" = "2" ]; then
    echo ""
    echo "需要进行 Cloudflare 身份验证..."
    wrangler login
    
    echo ""
    echo "部署到生产环境..."
    npm run deploy
    
    echo ""
    echo "✓ 部署完成！"
    echo "您的应用已部署到 Cloudflare Workers"
else
    echo "❌ 无效选择"
    exit 1
fi
