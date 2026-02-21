# 部署指南 - 让项目上线

## 部署架构

你的项目包含三个部分：
1. **Sanity Studio** - 内容管理后台
2. **前端页面** - 展示和售卖页面
3. **API 服务器** - AI 生成功能

## 方案 1: 使用 Vercel（推荐，最简单）

### 步骤 1: 部署 Sanity Studio

Sanity Studio 可以免费部署到 Sanity 的服务器：

```bash
npm run deploy
```

这会部署到 `https://your-project.sanity.studio`

### 步骤 2: 部署前端页面

#### 选项 A: 使用 Vercel（推荐）

1. **安装 Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **创建前端项目结构**：
   在项目根目录创建 `vercel.json`：
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "frontend/index.html",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/frontend/$1"
       }
     ]
   }
   ```

3. **部署**：
   ```bash
   vercel
   ```

#### 选项 B: 使用 Netlify

1. **安装 Netlify CLI**：
   ```bash
   npm i -g netlify-cli
   ```

2. **创建 `netlify.toml`**：
   ```toml
   [build]
   publish = "frontend"
   
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

3. **部署**：
   ```bash
   netlify deploy --prod
   ```

### 步骤 3: 部署 API 服务器

#### 使用 Vercel Serverless Functions

1. **创建 `api/generate-novel.js`**（已存在）

2. **创建 `vercel.json`**（如果还没有）：
   ```json
   {
     "version": 2,
     "functions": {
       "api/generate-novel.js": {
         "runtime": "nodejs18.x"
       }
     },
     "env": {
       "OPENAI_API_KEY": "@openai_api_key"
     }
   }
   ```

3. **设置环境变量**：
   - 在 Vercel 控制台设置 `OPENAI_API_KEY`
   - 或使用 CLI：`vercel env add OPENAI_API_KEY`

4. **部署**：
   ```bash
   vercel
   ```

5. **更新前端配置**：
   在 `frontend/index.html` 中更新 API URL：
   ```javascript
   const API_URL = 'https://your-project.vercel.app/api/generate-novel'
   ```

## 方案 2: 使用 Netlify（全栈部署）

### 步骤 1: 部署 Sanity Studio
```bash
npm run deploy
```

### 步骤 2: 部署前端和 API

1. **创建 `netlify.toml`**：
   ```toml
   [build]
   publish = "frontend"
   command = "echo 'No build needed'"
   
   [functions]
   directory = "api"
   node_bundler = "esbuild"
   
   [[redirects]]
   from = "/api/*"
   to = "/.netlify/functions/:splat"
   status = 200
   
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

2. **创建 `netlify/functions/generate-novel.js`**：
   复制 `api/generate-novel.js` 到 `netlify/functions/` 目录

3. **设置环境变量**：
   在 Netlify 控制台设置 `OPENAI_API_KEY`

4. **部署**：
   ```bash
   netlify deploy --prod
   ```

## 方案 3: 使用传统服务器（VPS/云服务器）

### 使用 PM2 管理进程

1. **安装 PM2**：
   ```bash
   npm install -g pm2
   ```

2. **创建 `ecosystem.config.js`**：
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'api-server',
         script: './api-server.js',
         env: {
           NODE_ENV: 'production',
           PORT: 3000
         }
       }
     ]
   }
   ```

3. **启动服务**：
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **配置 Nginx**：
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     # API 服务器
     location /api {
       proxy_pass http://localhost:3000;
     }
     
     # 前端页面
     location / {
       root /path/to/frontend;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

## 快速部署检查清单

### Sanity Studio
- [ ] 运行 `npm run deploy`
- [ ] 记录部署 URL（如：`https://your-project.sanity.studio`）
- [ ] 测试登录和内容管理

### 前端页面
- [ ] 更新 `frontend/index.html` 中的 Sanity 项目 ID
- [ ] 更新 API URL（如果部署了 API 服务器）
- [ ] 部署到 Vercel/Netlify
- [ ] 测试页面加载和功能

### API 服务器
- [ ] 部署到 Vercel/Netlify Functions
- [ ] 设置环境变量 `OPENAI_API_KEY`
- [ ] 更新前端中的 API URL
- [ ] 测试 API 端点

## 环境变量配置

### Vercel
```bash
vercel env add OPENAI_API_KEY
vercel env add SANITY_STUDIO_AI_API_URL
```

### Netlify
在控制台的 "Site settings" > "Environment variables" 中添加

### 服务器
在 `.env` 文件中配置（不要提交到 Git）

## 域名配置

### 自定义域名

1. **Vercel**：
   - 在项目设置中添加域名
   - 配置 DNS 记录

2. **Netlify**：
   - 在 "Domain settings" 中添加域名
   - 配置 DNS 记录

3. **服务器**：
   - 配置 Nginx/Apache
   - 设置 SSL 证书（Let's Encrypt）

## 安全注意事项

1. **API Key 安全**：
   - ✅ 使用环境变量，不要硬编码
   - ✅ 不要提交 `.env` 到 Git
   - ✅ 设置 API 使用限额

2. **CORS 配置**：
   - 在 API 服务器中配置允许的域名
   - 不要使用 `*` 允许所有域名

3. **速率限制**：
   - 考虑添加 API 速率限制
   - 防止滥用

## 监控和维护

1. **日志监控**：
   - 使用 Vercel/Netlify 的日志功能
   - 或使用 Sentry 等错误监控服务

2. **性能监控**：
   - 使用 Google Analytics
   - 监控 API 响应时间

3. **备份**：
   - Sanity 数据会自动备份
   - 定期导出重要数据

## 推荐部署方案

**最简单**：Vercel（前端 + API）+ Sanity Studio（Sanity 托管）

**最灵活**：Netlify（全栈部署）

**最控制**：VPS/云服务器（完全控制）

## 下一步

1. 选择部署方案
2. 按照步骤部署
3. 测试所有功能
4. 配置自定义域名（可选）
5. 上线！
