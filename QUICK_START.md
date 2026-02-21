# 快速开始 - AI 生成小说功能

## 快速设置（5 分钟）

### 1. 安装依赖

```bash
npm install express cors dotenv
```

### 2. 获取 OpenAI API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录或注册账号
3. 点击 "Create new secret key"
4. 复制 API key（格式：sk-...）

### 3. 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
cp env.example .env
```

然后编辑 `.env`，填入你的 OpenAI API key：

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 4. 启动 API 服务器

在一个终端窗口运行：

```bash
npm run api
```

你会看到：
```
🚀 AI Novel Generation API server running on http://localhost:3000
```

### 5. 配置 Sanity Studio

确保 `.env` 文件中有（如果没有会自动使用默认值）：

```
SANITY_STUDIO_AI_API_URL=http://localhost:3000/api/generate-novel
```

### 6. 启动 Sanity Studio

在另一个终端窗口运行：

```bash
npm run dev
```

### 7. 使用 AI 生成功能

1. 打开 http://localhost:3333
2. 创建或打开一个 Novel 文档
3. 点击右上角的三个点菜单
4. 选择 "Generate with AI"
5. 填写标题、类型、字数
6. 点击确认，等待生成完成！

## 测试 API 是否工作

访问 http://localhost:3000/health 应该看到：
```json
{"status":"ok","message":"AI Novel Generation API is running"}
```

## 常见问题

### API 服务器无法启动

- 检查是否安装了依赖：`npm install express cors dotenv`
- 检查端口 3000 是否被占用

### 生成失败

- 检查 `.env` 文件中的 `OPENAI_API_KEY` 是否正确
- 检查 API 服务器是否在运行（访问 http://localhost:3000/health）
- 查看终端中的错误信息

### CORS 错误

如果遇到 CORS 错误，确保 `api-server.js` 中已启用 CORS：
```javascript
app.use(cors())
```

## 成本说明

OpenAI API 定价：
- **GPT-4**: $30/1M input tokens, $60/1M output tokens
- **GPT-4 Turbo**: $10/1M input tokens, $30/1M output tokens
- **GPT-3.5 Turbo**: $0.50/1M input tokens, $1.50/1M output tokens（推荐用于测试）

1000 字小说使用 GPT-3.5 Turbo 约 $0.002-0.003

可以在 `api-server.js` 中修改模型：
```javascript
model: 'gpt-3.5-turbo', // 更便宜更快（推荐用于测试）
// 或
model: 'gpt-4', // 质量更高但更贵
// 或
model: 'gpt-4-turbo-preview', // 平衡质量和速度
```

## 下一步

- 查看 `API_SETUP.md` 了解如何部署到生产环境
- 查看 `README_NOVEL.md` 了解完整功能说明
