# AI API 集成设置指南 (Claude API)

## 方案 1: 使用 API 路由（推荐）

这是最安全的方式，API key 不会暴露在客户端。

### 步骤 1: 部署 API 路由

#### 选项 A: Vercel Serverless Function

1. 在项目根目录创建 `api/generate-novel.js`（或 `.ts`）
2. 复制 `api/generate-novel.js` 的内容
3. 在 Vercel 项目中设置环境变量 `ANTHROPIC_API_KEY`
4. 部署到 Vercel

#### 选项 B: Netlify Function

1. 在项目根目录创建 `netlify/functions/generate-novel.js`
2. 复制并修改 `api/generate-novel.js` 的内容（使用 Netlify 格式）
3. 在 Netlify 项目中设置环境变量 `ANTHROPIC_API_KEY`
4. 部署到 Netlify

#### 选项 C: Next.js API Route

1. 在 Next.js 项目中创建 `pages/api/generate-novel.js`（或 `app/api/generate-novel/route.js`）
2. 复制 `api/generate-novel.js` 的内容
3. 在 `.env.local` 中设置 `ANTHROPIC_API_KEY`
4. 运行 Next.js 开发服务器

#### 选项 D: Express Server

```javascript
// server.js
const express = require('express')
const handler = require('./api/generate-novel')

const app = express()
app.use(express.json())
app.post('/api/generate-novel', handler)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

### 步骤 2: 配置 Sanity Studio

1. 创建 `.env` 文件（复制 `.env.example`）
2. 设置 API URL：
   ```bash
   SANITY_STUDIO_AI_API_URL=http://localhost:3000/api/generate-novel
   ```
   或你的部署 URL：
   ```bash
   SANITY_STUDIO_AI_API_URL=https://your-api.vercel.app/api/generate-novel
   ```

3. 重启 Sanity Studio：
   ```bash
   npm run dev
   ```

## 方案 2: 直接调用 Claude API（仅用于开发）

⚠️ **警告**: 这种方式会将 API key 暴露在客户端代码中，仅用于开发测试。不推荐用于生产环境。

1. 创建 `.env` 文件
2. 设置：
   ```bash
   SANITY_STUDIO_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   ```
3. 修改 `plugins/aiNovelGenerator/index.tsx`，添加直接调用 Claude API 的代码

## 获取 Anthropic Claude API Key

1. 访问 https://console.anthropic.com/
2. 登录或注册账号
3. 进入 API Keys 页面
4. 点击 "Create Key"
5. 复制 API key（格式：sk-ant-...）
6. 设置使用限额以避免意外费用

## 测试 API

### 使用 curl 测试：

```bash
curl -X POST http://localhost:3000/api/generate-novel \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a fantasy novel titled \"The Magic Forest\". The novel should be approximately 1000 words long.",
    "targetWords": 1000
  }'
```

### 使用 JavaScript 测试：

```javascript
fetch('http://localhost:3000/api/generate-novel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Write a fantasy novel titled "The Magic Forest".',
    targetWords: 1000
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

## 成本估算

Claude API 定价（2024）：
- **Claude 3.5 Sonnet**: $3/1M input tokens + $15/1M output tokens
- **Claude 3 Opus**: $15/1M input tokens + $75/1M output tokens  
- **Claude 3 Haiku**: $0.25/1M input tokens + $1.25/1M output tokens

1000 字小说 ≈ 1300 tokens，使用 Claude 3.5 Sonnet 约 $0.01-0.02

## 故障排除

1. **API key 未配置**: 确保环境变量已设置并重启服务
2. **CORS 错误**: 如果从不同域名调用，需要在 API 路由中添加 CORS 头
3. **速率限制**: OpenAI API 有速率限制，如果频繁调用可能被限制
4. **网络错误**: 检查网络连接和防火墙设置

## 其他 AI 服务

你也可以使用其他 AI 服务：

- **OpenAI GPT**: 修改 API endpoint 和请求格式（参考注释代码）
- **Google Gemini**: 使用 Google AI API
- **本地模型**: 使用 Ollama 或其他本地部署的模型

只需修改 `api/generate-novel.js` 中的 API 调用部分即可。
