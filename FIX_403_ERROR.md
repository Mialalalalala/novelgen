# 修复 GitHub 403 权限错误

## 问题原因

403 错误通常表示：
1. Token 权限不足（缺少 `repo` scope）
2. Token 已过期
3. Token 格式错误
4. 仓库不存在或没有访问权限

## 解决方案

### 步骤 1: 创建新的 Personal Access Token（确保权限正确）

1. **访问 Token 设置**：
   ```
   https://github.com/settings/tokens
   ```

2. **删除旧的 token**（如果有问题）

3. **创建新 Token**：
   - 点击 "Generate new token" → "Generate new token (classic)"
   - **Note**: `NovelGen Project`
   - **Expiration**: 选择 90 天或 No expiration
   - **Scopes**: **必须勾选以下权限**：
     - ✅ `repo` - Full control of private repositories
       - ✅ `repo:status`
       - ✅ `repo_deployment`
       - ✅ `public_repo`
       - ✅ `repo:invite`
       - ✅ `security_events`
   - 点击 "Generate token"
   - **立即复制 token**（格式：`ghp_xxxxxxxxxxxx...`）

### 步骤 2: 验证仓库存在

确保仓库 `Mialalalalala/novelgen` 存在：
- 访问：https://github.com/Mialalalalala/novelgen
- 如果不存在，创建它

### 步骤 3: 使用新 Token 推送

**方法 A: 直接在 URL 中使用（最简单）**

```bash
# 替换 YOUR_TOKEN 为你的新 token
git remote set-url origin https://ghp_YOUR_TOKEN@github.com/Mialalalalala/novelgen.git

# 推送
git push -u origin main
```

**方法 B: 使用 credential helper**

```bash
# 设置普通 URL
git remote set-url origin https://github.com/Mialalalalala/novelgen.git

# 配置 credential helper（macOS）
git config --global credential.helper osxkeychain

# 推送时：
# Username: Mialalalalala
# Password: 粘贴你的新 token（不是密码！）
git push -u origin main
```

### 步骤 4: 清除旧的凭据（如果仍然失败）

```bash
# macOS - 清除 Keychain 中的旧凭据
git credential-osxkeychain erase
host=github.com
protocol=https
# 按两次 Enter

# 或者手动删除：
# 打开 Keychain Access
# 搜索 "github.com"
# 删除相关的凭据
```

## 快速修复命令

```bash
# 1. 创建新 token（在浏览器中）
# https://github.com/settings/tokens

# 2. 使用新 token 设置远程 URL
git remote set-url origin https://ghp_YOUR_NEW_TOKEN@github.com/Mialalalalala/novelgen.git

# 3. 推送
git push -u origin main
```

## 检查当前远程 URL

```bash
git remote -v
```

如果 URL 中包含旧的 token，需要更新。

## 如果仍然失败

### 检查仓库权限

1. 访问：https://github.com/Mialalalalala/novelgen/settings
2. 确认你是仓库的所有者或有写入权限

### 使用 SSH（最可靠的方法）

```bash
# 1. 检查 SSH key
ls -al ~/.ssh

# 2. 如果没有，创建新的
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 4. 添加到 GitHub: https://github.com/settings/keys

# 5. 测试连接
ssh -T git@github.com

# 6. 使用 SSH URL
git remote set-url origin git@github.com:Mialalalalala/novelgen.git

# 7. 推送
git push -u origin main
```

## 常见错误

### 错误 1: Token 权限不足
**解决**：创建新 token，确保勾选 `repo` 的所有权限

### 错误 2: Token 已过期
**解决**：创建新 token，选择更长的过期时间

### 错误 3: 仓库不存在
**解决**：在 GitHub 上创建仓库

### 错误 4: 用户名错误
**解决**：确认 GitHub 用户名是 `Mialalalalala`
