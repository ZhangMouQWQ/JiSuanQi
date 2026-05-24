# 股票当日信息查询 - Cloudflare Workers

基于实时行情数据接口的股票当日信息查询工具，部署在 Cloudflare Workers 上。

## 项目结构

```
.
├── src/
│   └── index.js          # Worker 脚本
├── wrangler.toml         # Cloudflare Worker 配置
├── package.json          # 项目依赖
├── deploy.bat            # Windows 部署脚本
├── deploy.sh             # Mac/Linux 部署脚本
├── DEPLOY_GUIDE.md       # 部署指南
└── README.md             # 本文件
```

## 功能特性

✅ **实时数据**：获取 A 股股票当日行情  
✅ **多格式支持**：支持多种股票代码格式  
✅ **全球加速**：利用 Cloudflare 全球网络  
✅ **完全免费**：每日 100,000 请求免费额度  
✅ **无需运维**：自动扩展，无服务器部署  

## 快速部署

### Windows 用户
```bash
双击 deploy.bat
```

### Mac/Linux 用户
```bash
bash deploy.sh
```

### 或使用 npm
```bash
npm install
npm run dev       # 本地测试
npm run deploy    # 部署到 Cloudflare
```

## 部署说明

### 第 1 步：安装依赖
```bash
npm install
```

### 第 2 步：登录 Cloudflare
```bash
wrangler login
```
会自动打开浏览器进行授权。

### 第 3 步：部署
```bash
npm run deploy
```

部署完成后会获得一个 Worker URL：
```
https://stock-query-worker.your-account.workers.dev
```

## 支持的股票代码

| 格式 | 示例 |
|------|------|
| 通达信 | sh600519、sz000001 |
| 标准格式 | 600519.XSHG、000001.XSHE |
| 纯数字 | 600519、000001 |

常见股票：
- 贵州茅台：600519
- 中国平安：601318
- 上证指数：000001
- 平安银行：000001

## API 接口

### POST /api/stock
获取股票当日信息

**请求：**
```bash
curl -X POST https://your-worker.workers.dev/api/stock \
  -H "Content-Type: application/json" \
  -d '{"code":"600519"}'
```

**响应：**
```json
{
  "code": "600519",
  "date": "2024-05-24",
  "open": 1850.50,
  "close": 1875.25,
  "high": 1880.00,
  "low": 1845.50,
  "volume": 12500000.0
}
```

### GET /api/health
健康检查

```bash
curl https://your-worker.workers.dev/api/health
```

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:8787 进行测试

## Cloudflare Workers 优势

- 🌍 **全球分布式**：毫秒级响应
- 💰 **成本低廉**：免费额度充足
- ⚡ **极致性能**：无冷启动
- 🔒 **内置安全**：DDoS 防护、SSL/TLS
- 📈 **自动扩展**：无需管理服务器

## 配置修改

### 绑定自定义域名

编辑 `wrangler.toml`：
```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

部署：
```bash
npm run deploy -- --env production
```

### 查看日志

```bash
wrangler tail
```

## 常见问题

**Q: 需要信用卡吗？**  
A: 不需要，免费账户无需信用卡。

**Q: 有请求限制吗？**  
A: 免费账户每天 100,000 请求。

**Q: 如何更新代码？**  
A: 修改 `src/index.js` 后运行 `npm run deploy`。

**Q: 数据延迟多久？**  
A: 数据来自新浪财经和腾讯股票 API，通常是实时的。

## 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler 命令参考](https://developers.cloudflare.com/workers/wrangler/commands/)
- [部署指南](./DEPLOY_GUIDE.md)

## 许可证

MIT
