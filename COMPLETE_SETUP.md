# 完整设置步骤 - 从零开始使用 AI 生成小说

## ✅ 步骤 1: 安装依赖（如果还没完成）

```bash
npm install
```

如果遇到依赖冲突，`.npmrc` 文件已经配置好了，会自动处理。

## ✅ 步骤 2: 配置 API Key

确保 `.env` 文件存在并包含你的 Claude API Key：

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
SANITY_STUDIO_AI_API_URL=http://localhost:3000/api/generate-novel
```

如果没有 `.env` 文件：
```bash
cp env.example .env
# 然后编辑 .env，填入你的 API Key
```

## ✅ 步骤 3: 启动 API 服务器

**打开第一个终端窗口**，运行：

```bash
npm run api
```

你应该看到：
```
🚀 AI Novel Generation API server running on http://localhost:3000
📝 Using Claude API (Anthropic)
🔑 Make sure ANTHROPIC_API_KEY is set in .env file
```

**保持这个终端窗口打开！**

## ✅ 步骤 4: 启动 Sanity Studio

**打开第二个终端窗口**，运行：

```bash
npm run dev
```

等待看到：
```
✔ Sanity Studio is running at http://localhost:3333
```

## ✅ 步骤 5: 使用 AI 生成功能

1. **打开浏览器**，访问 http://localhost:3333

2. **创建或打开 Novel 文档**
   - 在左侧菜单点击 "Novels"
   - 点击 "+" 创建新小说，或打开已存在的小说

3. **找到 "Generate with AI" 选项**
   - 在编辑面板底部，找到 "Publish" 按钮
   - 点击 "Publish" 按钮**右侧**的下拉箭头（▼）
   - 在下拉菜单中找到 **"Generate with AI"**

4. **生成小说内容**
   - 点击 "Generate with AI"
   - 填写：
     - **标题**：例如 "魔法森林的冒险"
     - **类型**：选择类型（Fantasy, Sci-Fi 等）
     - **目标字数**：例如 1000
   - 点击确认
   - 等待 AI 生成内容（可能需要几秒到几十秒）

5. **编辑和发布**
   - 生成完成后，内容会自动填充到文档中
   - 你可以编辑和完善内容
   - 点击 "Publish" 发布小说

## 🎯 快速检查清单

- [ ] 依赖已安装 (`npm install`)
- [ ] `.env` 文件存在并包含 `ANTHROPIC_API_KEY`
- [ ] API 服务器正在运行（终端 1：`npm run api`）
- [ ] Sanity Studio 正在运行（终端 2：`npm run dev`）
- [ ] 浏览器打开了 http://localhost:3333
- [ ] 创建或打开了 Novel 文档
- [ ] 找到了 "Generate with AI" 选项

## 🐛 常见问题

### 问题 1: "Failed to fetch" 错误
**解决**：确保 API 服务器正在运行（步骤 3）

### 问题 2: 找不到 "Generate with AI"
**解决**：
- 确认是 Novel 类型的文档
- 重启 Sanity Studio
- 硬刷新浏览器（Ctrl+Shift+R）

### 问题 3: API Key 错误
**解决**：检查 `.env` 文件中的 `ANTHROPIC_API_KEY` 是否正确

### 问题 4: 端口被占用
**解决**：
- 检查是否有其他服务占用端口 3000
- 或修改 `api-server.js` 中的端口号

## 📝 下一步

生成小说后，你可以：
1. 在前端页面查看：打开 `frontend/index.html`
2. 编辑和完善内容
3. 设置价格和封面
4. 发布并开始售卖

## 💡 提示

- API 服务器和 Sanity Studio 需要**同时运行**
- 生成内容可能需要一些时间，请耐心等待
- 如果生成失败，检查 API 服务器的终端输出，查看错误信息
