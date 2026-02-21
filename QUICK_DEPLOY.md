# 快速部署指南 - 5 分钟上线

## 🚀 最简单的方法：使用 Vercel（推荐）

### 步骤 1: 部署 Sanity Studio（管理后台）

```bash
npm run deploy
```

这会部署到：`https://your-project.sanity.studio`

### 步骤 2: 部署前端和 API（Vercel）

1. **安装 Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **设置环境变量**（重要！）：
   ```bash
   vercel env add OPENAI_API_KEY production
   # 粘贴你的 OpenAI API Key，然后按 Enter
   ```
   
   也可以为其他环境设置：
   ```bash
   vercel env add OPENAI_API_KEY preview
   vercel env add OPENAI_API_KEY development
   ```

4. **部署**：
   ```bash
   vercel --prod
   ```
   
   **注意**：如果遇到环境变量错误，确保先设置环境变量再部署！

5. **完成！** 你会得到一个 URL，比如：`https://your-project.vercel.app`

### 步骤 3: 更新前端配置

部署后，需要更新前端页面中的 API URL：

1. 在 Vercel 控制台找到你的项目 URL
2. 编辑 `frontend/index.html`，找到这一行（约第 147 行）：
   ```javascript
   const API_URL = import.meta.env.SANITY_STUDIO_AI_API_URL || 'http://localhost:3000/api/generate-novel'
   ```
3. 改为你的 Vercel URL：
   ```javascript
   const API_URL = 'https://your-project.vercel.app/api/generate-novel'
   ```
4. 重新部署：
   ```bash
   vercel --prod
   ```

## 🎯 更简单的方法：使用 Netlify

### 步骤 1: 部署 Sanity Studio
```bash
npm run deploy
```

### 步骤 2: 部署到 Netlify

1. **安装 Netlify CLI**：
   ```bash
   npm i -g netlify-cli
   ```

2. **登录 Netlify**：
   ```bash
   netlify login
   ```

3. **初始化项目**：
   ```bash
   netlify init
   ```

4. **设置环境变量**：
   - 在 Netlify 控制台：Site settings > Environment variables
   - 添加 `OPENAI_API_KEY`

5. **部署**：
   ```bash
   netlify deploy --prod
   ```

## 📝 部署检查清单

- [ ] Sanity Studio 已部署（`npm run deploy`）
- [ ] 前端页面已部署（Vercel/Netlify）
- [ ] API 服务器已部署（作为 serverless function）
- [ ] 环境变量已设置（`OPENAI_API_KEY`）
- [ ] 前端中的 API URL 已更新
- [ ] 测试所有功能是否正常

## 🔗 分享链接

部署完成后，你可以分享：

1. **前端网站**：`https://your-project.vercel.app`（给用户看）
2. **管理后台**：`https://your-project.sanity.studio`（给自己用）

## 💡 提示

- **免费额度**：Vercel 和 Netlify 都有免费额度，足够小项目使用
- **自定义域名**：可以在 Vercel/Netlify 控制台添加自己的域名
- **自动部署**：连接 GitHub 后，每次 push 代码会自动部署

## 🐛 常见问题

### 问题 1: API 调用失败
**解决**：检查环境变量是否设置，API URL 是否正确

### 问题 2: CORS 错误
**解决**：确保 API 服务器配置了正确的 CORS 设置

### 问题 3: 前端无法加载数据
**解决**：检查 Sanity 项目 ID 和数据集名称是否正确

## 下一步

1. 选择一个平台（Vercel 或 Netlify）
2. 按照步骤部署
3. 测试功能
4. 分享链接给用户！
