# 如何启动 API 服务器

## 错误：Failed to fetch

这个错误表示 API 服务器没有运行。请按照以下步骤启动：

## 快速启动步骤

### 1. 检查依赖是否安装

```bash
npm install express cors dotenv
```

### 2. 创建 .env 文件（如果还没有）

在项目根目录创建 `.env` 文件：

```bash
# 复制示例文件
cp env.example .env
```

然后编辑 `.env`，添加你的 Claude API Key：

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
SANITY_STUDIO_AI_API_URL=http://localhost:3000/api/generate-novel
```

### 3. 启动 API 服务器

**在新的终端窗口中运行：**

```bash
npm run api
```

或者：

```bash
node api-server.js
```

你应该看到：

```
🚀 AI Novel Generation API server running on http://localhost:3000
📝 Using Claude API (Anthropic)
🔑 Make sure ANTHROPIC_API_KEY is set in .env file
```

### 4. 测试 API 是否工作

在浏览器中访问：http://localhost:3000/health

应该看到：
```json
{"status":"ok","message":"AI Novel Generation API is running","provider":"Claude (Anthropic)"}
```

### 5. 保持两个服务运行

你需要同时运行两个服务：

**终端 1 - API 服务器：**
```bash
npm run api
```

**终端 2 - Sanity Studio：**
```bash
npm run dev
```

## 常见问题

### 问题 1: 端口 3000 已被占用

如果看到 "port 3000 is already in use"：

1. 找到占用端口的进程：
   ```bash
   lsof -ti:3000
   ```

2. 停止它，或者修改端口：
   在 `api-server.js` 中修改：
   ```javascript
   const PORT = process.env.PORT || 3001  // 改为 3001
   ```
   
   然后在 `.env` 中更新：
   ```env
   SANITY_STUDIO_AI_API_URL=http://localhost:3001/api/generate-novel
   ```

### 问题 2: 找不到模块

如果看到 "Cannot find module 'express'"：

```bash
npm install express cors dotenv
```

### 问题 3: API Key 错误

如果看到 "Anthropic API key not configured"：

1. 检查 `.env` 文件是否存在
2. 检查 `ANTHROPIC_API_KEY` 是否正确设置
3. 确保 API key 格式正确（应该以 `sk-ant-` 开头）

### 问题 4: CORS 错误

如果看到 CORS 相关错误，确保 `api-server.js` 中有：

```javascript
app.use(cors())
```

## 验证步骤

1. ✅ API 服务器正在运行（终端显示运行信息）
2. ✅ 可以访问 http://localhost:3000/health
3. ✅ `.env` 文件中有正确的 `ANTHROPIC_API_KEY`
4. ✅ Sanity Studio 正在运行
5. ✅ 在 Novel 文档中点击 "Generate with AI"

## 下一步

一旦 API 服务器运行，你就可以：
1. 在 Sanity Studio 中打开 Novel 文档
2. 点击发布按钮旁边的菜单
3. 选择 "Generate with AI"
4. 填写参数并生成内容
