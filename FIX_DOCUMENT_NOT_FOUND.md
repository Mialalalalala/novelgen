# 修复 "Document not found" 错误

## 问题

错误信息：`The document with the ID "5abdc52e-f1a7-4a99-9a1d-dbd50b40d608" was not found`

这个错误通常发生在：
1. 尝试更新一个不存在的文档
2. 文档 ID 格式不正确（缺少 `drafts.` 前缀）
3. 文档已被删除

## 解决方案

我已经更新了 AI 生成插件，现在会：

1. **正确处理 draft 和 published 文档**
   - 优先使用 draft ID
   - 如果没有 draft，创建新的 draft

2. **自动创建文档（如果不存在）**
   - 如果文档不存在，会自动创建
   - 如果文档存在，会更新它

3. **更好的错误处理**
   - 如果更新失败，会尝试创建新文档

## 使用方法

### 方法 1: 创建新文档后生成

1. 在 Sanity Studio 中创建新的 Novel 文档
2. 保存文档（即使字段为空）
3. 然后使用 "Generate with AI" 功能

### 方法 2: 在现有文档上生成

1. 打开已存在的 Novel 文档
2. 使用 "Generate with AI" 功能
3. 内容会自动填充到文档中

## 如果仍然遇到错误

### 检查文档是否存在

在 Sanity Studio 中：
1. 查看文档列表
2. 确认文档 ID 是否正确
3. 检查文档是否被意外删除

### 重新创建文档

如果文档确实不存在：
1. 创建新的 Novel 文档
2. 保存文档
3. 然后使用 "Generate with AI"

### 检查权限

确保你的 Sanity 用户有：
- 创建文档的权限
- 更新文档的权限

## 技术说明

Sanity 使用两种文档 ID：
- **Published**: `document-id`
- **Draft**: `drafts.document-id`

插件现在会自动处理这两种情况，确保始终使用正确的 ID。

## 更新后的行为

- ✅ 自动检测文档是否存在
- ✅ 如果不存在，自动创建
- ✅ 如果存在，更新内容
- ✅ 正确处理 draft 和 published 状态
