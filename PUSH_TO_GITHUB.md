# 如何推送到 GitHub

## 当前状态

✅ 所有文件已添加到 Git  
✅ 更改已提交到本地仓库  

## 推送到 GitHub 的步骤

### 方法 1: 如果还没有 GitHub 仓库

1. **在 GitHub 创建新仓库**：
   - 访问 https://github.com/new
   - 仓库名称：例如 `novelgen` 或 `ai-novel-store`
   - 选择 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license（因为本地已有）
   - 点击 "Create repository"

2. **添加远程仓库并推送**：
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### 方法 2: 如果已有 GitHub 仓库

1. **添加远程仓库**（如果还没有）：
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   ```

2. **推送到 GitHub**：
   ```bash
   git push -u origin main
   ```

### 方法 3: 使用 GitHub CLI（如果已安装）

```bash
gh repo create novelgen --public --source=. --remote=origin --push
```

## 重要提示

### 不要提交的文件

确保以下文件在 `.gitignore` 中（已配置）：
- `.env` - 包含 API keys
- `node_modules/` - 依赖包
- `.sanity/` - Sanity 缓存

### 如果遇到问题

**问题 1: 远程仓库已存在内容**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**问题 2: 需要强制推送（谨慎使用）**
```bash
git push -u origin main --force
```

**问题 3: 认证问题**
- 使用 Personal Access Token 而不是密码
- 或使用 SSH key

## 推送后的步骤

1. **在 GitHub 上查看仓库**
2. **添加 README**（可选）：
   - 可以复制 `COPY_PASTE_VERSION.md` 的内容到 README.md
3. **添加描述和标签**
4. **分享仓库链接**

## 快速命令（复制粘贴）

```bash
# 1. 创建 GitHub 仓库后，运行：
git remote add origin https://github.com/your-username/your-repo-name.git

# 2. 推送代码：
git push -u origin main
```

替换 `your-username` 和 `your-repo-name` 为你的实际值。
