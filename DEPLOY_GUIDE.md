# Cloudflare Workers 部署指南

## 5 分钟快速部署

### 第 1 步：安装 Node.js

如果未安装 Node.js，请从 [nodejs.org](https://nodejs.org/) 下载安装。

验证安装：
```bash
node --version
npm --version
```

### 第 2 步：运行部署脚本

#### Windows 用户
双击 `deploy.bat` 文件

#### Mac/Linux 用户
```bash
bash deploy.sh
```

脚本会自动处理所有步骤。

## 详细步骤（手动部署）

## 详细步骤（手动部署）

### 1. 创建/登录 Cloudflare 账户

访问 [cloudflare.com](https://www.cloudflare.com/) 创建免费账户。

### 2. 安装依赖

```bash
npm install
```

### 3. 登录 Cloudflare

```bash
wrangler login
```

会自动打开浏览器进行授权，按提示完成登录。

### 4. 部署

```bash
npm run deploy
```

部署完成后，您会获得一个免费 URL：
```
https://stock-query-worker.your-account.workers.dev
```

## 本地测试（可选）

在部署之前可以先本地测试：

```bash
npm install
npm run dev
```

访问 http://localhost:8787 进行测试。

## 测试您的部署

### 在浏览器中测试

打开生成的 URL，输入股票代码查询。

### 使用 curl 测试 API

```bash
curl -X POST https://stock-query-worker.your-account.workers.dev/api/stock \
  -H "Content-Type: application/json" \
  -d '{"code":"600519"}'
```

### 预期响应

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

## 常见问题

**Q: 需要信用卡吗？**  
A: 不需要。Cloudflare 免费账户无需绑定信用卡。

**Q: 有请求限制吗？**  
A: 免费账户每天 100,000 请求额度。

**Q: 如何查看日志？**  
A: 使用 `wrangler tail` 命令查看实时日志。

**Q: 如何更新代码？**  
A: 修改 `src/index.js` 后，重新运行 `npm run deploy`。

**Q: 如何绑定自定义域名？**  
A: 
1. 在 Cloudflare Dashboard 添加您的域名
2. 编辑 `wrangler.toml` 中的路由配置
3. 重新部署

## 自定义配置

编辑 `wrangler.toml` 可以修改配置：

```toml
name = "stock-query-worker"
main = "src/index.js"
compatibility_date = "2024-05-24"

# 可选：绑定自定义域名
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

修改后重新部署：
```bash
npm run deploy -- --env production
```

## 常用命令

```bash
# 本地开发
npm run dev

# 部署到生产
npm run deploy

# 查看实时日志
wrangler tail

# 查看部署状态
wrangler status

# 删除部署
wrangler delete
```

## 后续扩展

如果需要保存数据，可以集成：
- **Cloudflare KV**：缓存和键值存储
- **Cloudflare D1**：数据库服务
- **Durable Objects**：有状态计算

## 获取帮助

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 参考](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Cloudflare 社区](https://community.cloudflare.com/)

---

祝部署顺利！🚀
