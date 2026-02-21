# GitHub 认证问题解决方案

## 问题

GitHub 不再支持密码认证，需要使用 Personal Access Token (PAT) 或 SSH key。

## 解决方案 1: 使用 Personal Access Token（推荐）

### 步骤 1: 创建 Personal Access Token

1. **访问 GitHub 设置**：
   ```
   https://github.com/settings/tokens
   ```

2. **创建新 Token**：
   - 点击 "Generate new token"
   - 选择 "Generate new token (classic)"

3. **配置 Token**：
   - **Note**: 输入描述，如 "NovelGen Project"
   - **Expiration**: 选择过期时间（建议 90 天或 No expiration）
   - **Scopes**: 勾选 `repo`（完整仓库访问权限）

4. **生成并复制 Token**：
   - 点击 "Generate token"
   - **重要**：立即复制 token（只显示一次！）
   - Token 格式：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 2: 使用 Token 推送

**方法 A: 在 URL 中使用 Token**

```bash
git remote set-url origin https://ghp_YOUR_TOKEN@github.com/Mialalalalala/novelgen.git
git push -u origin main
```

替换 `YOUR_TOKEN` 为你刚才复制的 token。

**方法 B: 使用 Git Credential Helper（推荐）**

```bash
# 设置远程 URL（不带 token）
git remote set-url origin https://github.com/Mialalalalala/novelgen.git

# 推送时，用户名输入：Mialalalalala
# 密码输入：你的 Personal Access Token
git push -u origin main
```

### 步骤 3: 保存凭据（可选）

```bash
# macOS
git config --global credential.helper osxkeychain

# 然后推送，输入一次 token 后会自动保存
git push -u origin main
```

## 解决方案 2: 使用 SSH Key（更安全）

### 步骤 1: 检查是否已有 SSH key

```bash
ls -al ~/.ssh
```

如果看到 `id_rsa.pub` 或 `id_ed25519.pub`，说明已有 SSH key。

### 步骤 2: 创建 SSH key（如果没有）

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

按 Enter 使用默认位置，设置密码（可选）。

### 步骤 3: 添加 SSH key 到 GitHub

1. **复制公钥**：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # 或
   cat ~/.ssh/id_rsa.pub
   ```

2. **添加到 GitHub**：
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - **Title**: 输入描述
   - **Key**: 粘贴刚才复制的公钥
   - 点击 "Add SSH key"

### 步骤 4: 使用 SSH URL

```bash
# 更改远程 URL 为 SSH
git remote set-url origin git@github.com:Mialalalalala/novelgen.git

# 推送
git push -u origin main
```

## 快速解决方案（最简单）

### 使用 GitHub CLI（如果已安装）

```bash
gh auth login
gh repo create novelgen --public --source=. --remote=origin --push
```

### 或者手动使用 Token

1. **创建 Token**（见上面步骤）

2. **一次性推送**：
   ```bash
   git remote set-url origin https://ghp_YOUR_TOKEN@github.com/Mialalalalala/novelgen.git
   git push -u origin main
   ```

3. **之后可以改回普通 URL**（token 已保存）：
   ```bash
   git remote set-url origin https://github.com/Mialalalalala/novelgen.git
   ```

## 推荐方案

**最简单**：使用 Personal Access Token + Git Credential Helper

1. 创建 Token：https://github.com/settings/tokens
2. 推送时，密码输入 token
3. 配置 credential helper 自动保存

**最安全**：使用 SSH Key（长期使用推荐）

## 注意事项

- ⚠️ **不要**将 Personal Access Token 提交到代码中
- ✅ Token 应该保存在系统的 credential helper 中
- ✅ 如果 token 泄露，立即在 GitHub 设置中撤销
