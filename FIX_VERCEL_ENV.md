# 修复 Vercel 环境变量错误

## 问题

错误信息：`Environment Variable "OPENAI_API_KEY" references Secret "openai_api_key", which does not exist.`

这是因为 `vercel.json` 中引用了不存在的 Secret。

## 解决方案

### 方法 1: 使用 Vercel CLI 设置环境变量（推荐）

1. **删除旧的配置**（我已经修复了 `vercel.json`）

2. **使用 CLI 设置环境变量**：
   ```bash
   vercel env add OPENAI_API_KEY production
   ```
   然后粘贴你的 OpenAI API Key

3. **也可以为预览环境设置**：
   ```bash
   vercel env add OPENAI_API_KEY preview
   vercel env add OPENAI_API_KEY development
   ```

4. **重新部署**：
   ```bash
   vercel --prod
   ```

### 方法 2: 在 Vercel 控制台设置

1. 访问 https://vercel.com
2. 选择你的项目
3. 进入 "Settings" > "Environment Variables"
4. 添加新变量：
   - **Name**: `OPENAI_API_KEY`
   - **Value**: 你的 OpenAI API Key
   - **Environment**: 选择所有环境（Production, Preview, Development）
5. 点击 "Save"
6. 重新部署项目

### 方法 3: 使用 Vercel Secrets（高级）

如果你想使用 Secrets（更安全）：

1. **创建 Secret**：
   ```bash
   vercel secrets add openai_api_key
   ```
   然后粘贴你的 API Key

2. **更新 `vercel.json`**（如果需要）：
   ```json
   {
     "env": {
       "OPENAI_API_KEY": "@openai_api_key"
     }
   }
   ```

## 验证环境变量

部署后，检查环境变量是否正确设置：

1. 在 Vercel 控制台查看 "Settings" > "Environment Variables"
2. 或者在函数日志中检查（不应该显示 API Key，但应该能正常工作）

## 快速修复步骤

```bash
# 1. 设置环境变量
vercel env add OPENAI_API_KEY production

# 2. 重新部署
vercel --prod
```

## 注意事项

- ✅ 环境变量设置后，需要重新部署才能生效
- ✅ 不要将 API Key 提交到 Git
- ✅ 确保 `.env` 在 `.gitignore` 中
- ✅ 为每个环境（production, preview, development）分别设置

## 如果仍然有问题

1. 检查 API Key 是否正确复制
2. 确认环境变量名称是 `OPENAI_API_KEY`（全大写）
3. 查看 Vercel 部署日志中的错误信息
4. 尝试删除并重新添加环境变量
