# 项目清理指南

## 自动清理

### Windows 用户
双击 `cleanup.bat`

### Mac/Linux 用户
```bash
bash cleanup.sh
```

## 手动清理

如果不想使用自动脚本，可以手动删除以下文件：

### 可删除的文件

| 文件 | 原因 |
|------|------|
| `index.html` | 已嵌入 src/index.js |
| `app.py` | Flask 应用（不需要） |
| `Ashare.py` | Python 库（不需要） |
| `MyTT.py` | Python 库（不需要） |
| `requirements.txt` | Python 依赖（不需要） |
| `run.bat` | 本地启动脚本（不需要） |
| `quick-start.js` | 快速启动脚本（不需要） |
| `DEPLOYMENT_COMPARISON.md` | 部署对比文档（不需要） |
| `README-CloudflareWorkers.md` | 已改为 README.md |

### 保留的文件

| 文件 | 用途 |
|------|------|
| `src/index.js` | **Worker 脚本** |
| `wrangler.toml` | **配置文件** |
| `package.json` | **依赖配置** |
| `deploy.bat` | Windows 部署脚本 |
| `deploy.sh` | Mac/Linux 部署脚本 |
| `README.md` | 项目文档 |
| `DEPLOY_GUIDE.md` | 部署指南 |
| `.gitignore` | Git 配置 |
| `cleanup.bat` | 清理脚本（可选） |
| `cleanup.sh` | 清理脚本（可选） |

## 最终项目结构

清理后的项目只有以下文件：

```
.
├── src/
│   └── index.js              # Worker 脚本（核心）
├── wrangler.toml             # Cloudflare 配置
├── package.json              # npm 依赖
├── deploy.bat                # Windows 部署脚本
├── deploy.sh                 # Mac/Linux 部署脚本
├── README.md                 # 项目文档
├── DEPLOY_GUIDE.md           # 部署指南
├── .gitignore                # Git 配置
└── .git/                     # Git 仓库
```

## 清理后的大小

清理前：~200 KB（包括 Python 库和文档）  
清理后：~50 KB（只保留必需文件）

## 确认清理

清理前请确认：
- ✅ `src/index.js` 包含完整的 Worker 代码
- ✅ 已有备份（Git 或其他）
- ✅ `wrangler.toml` 配置正确

如果误删，可以从 Git 恢复：
```bash
git checkout HEAD -- filename
```
