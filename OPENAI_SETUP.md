# OpenAI API 设置指南

## 快速开始

### 1. 获取 OpenAI API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录或注册账号
3. 点击 "Create new secret key"
4. 复制 API key（只显示一次，请妥善保存）
5. 设置使用限额以避免意外费用

### 2. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
SANITY_STUDIO_AI_API_URL=http://localhost:3000/api/generate-novel
```

### 3. 启动服务

**终端 1 - API 服务器：**
```bash
npm run api
```

**终端 2 - Sanity Studio：**
```bash
npm run dev
```

## 模型选择

在 `api-server.js` 中可以修改模型：

### GPT-3.5 Turbo（推荐用于测试）
- 速度快，成本低
- 适合快速生成和测试
- 代码：`model: 'gpt-3.5-turbo'`

### GPT-4（推荐用于生产）
- 质量最高
- 适合正式内容生成
- 代码：`model: 'gpt-4'`

### GPT-4 Turbo
- 平衡质量和速度
- 代码：`model: 'gpt-4-turbo-preview'`

## 成本估算

- **GPT-3.5 Turbo**: $0.50/1M input + $1.50/1M output
- **GPT-4**: $30/1M input + $60/1M output
- **GPT-4 Turbo**: $10/1M input + $30/1M output

1000 字小说（约 1300 tokens）：
- GPT-3.5 Turbo: 约 $0.002-0.003
- GPT-4: 约 $0.06-0.08
- GPT-4 Turbo: 约 $0.02-0.03

## 使用建议

1. **开发/测试阶段**：使用 GPT-3.5 Turbo
2. **生产环境**：使用 GPT-4 或 GPT-4 Turbo
3. **设置使用限额**：在 OpenAI 控制台设置每月限额
4. **监控使用量**：定期检查 API 使用情况

## 故障排除

### API Key 无效
- 检查 key 是否正确复制
- 确认 key 没有被撤销
- 检查账户是否有余额

### 速率限制
- OpenAI API 有速率限制
- 如果频繁调用，可能需要等待
- 考虑升级账户或使用更高限额

### 生成内容不符合预期
- 调整 `temperature` 参数（0-2，越高越有创意）
- 修改 system prompt
- 尝试不同的模型

## 安全提示

- ⚠️ **不要**将 API key 提交到 Git
- ✅ 使用 `.env` 文件存储 key
- ✅ 将 `.env` 添加到 `.gitignore`
- ✅ 定期轮换 API key
- ✅ 设置使用限额
