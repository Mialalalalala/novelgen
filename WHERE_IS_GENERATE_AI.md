# "Generate with AI" 在哪里？

## 📍 位置说明

"Generate with AI" 选项会出现在 **发布按钮旁边的下拉菜单** 中。

### 具体位置：

1. **在编辑面板的底部工具栏**
   - 找到 "Publish"（发布）按钮
   - 在 "Publish" 按钮的**右侧**，有一个下拉箭头（▼）或三个点（...）
   - 点击这个下拉菜单

2. **菜单中应该包含：**
   - Publish（发布）
   - Unpublish（取消发布）
   - Discard changes（丢弃更改）
   - **Generate with AI** ← 这就是你要找的！

### 图示说明：

```
[编辑面板底部]
┌─────────────────────────────────────┐
│  [Publish] ▼  ← 点击这个下拉箭头    │
│     ↓                                │
│   ┌─────────────────────┐           │
│   │ Publish              │           │
│   │ Unpublish            │           │
│   │ Discard changes      │           │
│   │ Generate with AI ✨  │ ← 这里！  │
│   └─────────────────────┘           │
└─────────────────────────────────────┘
```

## 🔍 如果看不到怎么办？

### 步骤 1: 确认文档类型
- 确保你正在编辑的是 **Novel**（小说）类型的文档
- 不是 Page、Product 或其他类型

### 步骤 2: 重启 Sanity Studio
```bash
# 停止服务器 (Ctrl+C 或 Cmd+C)
# 然后重新启动
npm run dev
```

### 步骤 3: 清除浏览器缓存
- Windows/Linux: 按 `Ctrl + Shift + R`
- Mac: 按 `Cmd + Shift + R`

### 步骤 4: 检查浏览器控制台
1. 按 `F12` 打开开发者工具
2. 查看 Console 标签页
3. 看是否有错误信息

### 步骤 5: 检查插件是否加载
在浏览器控制台运行：
```javascript
console.log('Checking for plugins...')
```

## 🎯 快捷键

如果菜单中有 "Generate with AI"，你可以使用快捷键：
- **Windows/Linux**: `Ctrl + Alt + G`
- **Mac**: `Cmd + Option + G`

## 📝 替代方案

如果在下拉菜单中找不到，你也可以：

1. **直接在内容字段中使用**
   - 在 "Content"（内容）字段中
   - 点击工具栏中的 AI 图标（如果有的话）

2. **使用 API 直接调用**
   - 通过 API 服务器直接生成内容
   - 然后复制粘贴到 Sanity Studio

## ❓ 仍然找不到？

如果按照以上步骤仍然找不到，请：
1. 截图显示发布按钮区域
2. 检查浏览器控制台的错误信息
3. 确认插件已正确安装和配置
