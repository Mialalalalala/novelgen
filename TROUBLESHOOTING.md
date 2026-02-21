# 故障排除 - "Generate with AI" 选项不显示

## 检查清单

### 1. 确认插件已加载

在浏览器控制台（F12）中检查是否有错误信息。

### 2. 重启 Sanity Studio

完全停止并重新启动开发服务器：

```bash
# 停止当前运行的服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 3. 清除缓存

```bash
# 清除 node_modules 和重新安装
rm -rf node_modules .sanity
npm install
npm run dev
```

### 4. 检查文档类型

确保你正在编辑的是 **Novel** 类型的文档，而不是其他类型。

### 5. 检查插件配置

确认 `sanity.config.ts` 中已包含插件：

```typescript
import {aiNovelGenerator} from './plugins/aiNovelGenerator/plugin'

// 在 plugins 数组中
plugins: [
  // ... 其他插件
  aiNovelGenerator(),
]
```

### 6. 检查浏览器控制台

打开浏览器开发者工具（F12），查看 Console 标签页是否有错误信息。

### 7. 验证文档操作菜单

- 确保你点击的是文档右上角的三个点菜单（...）
- 不是工具栏上的其他菜单

### 8. 检查文档状态

尝试：
1. 创建一个新的 Novel 文档
2. 或者打开一个已存在的 Novel 文档
3. 然后查看菜单

### 9. 手动测试插件

在浏览器控制台中运行：

```javascript
// 检查插件是否加载
console.log(window.__sanity)
```

### 10. 检查 TypeScript 编译错误

```bash
npm run build
```

查看是否有编译错误。

## 如果仍然不显示

1. **检查插件文件路径**：确保文件在正确的位置
   - `plugins/aiNovelGenerator/index.tsx`
   - `plugins/aiNovelGenerator/plugin.ts`

2. **检查导入路径**：在 `sanity.config.ts` 中确认导入路径正确

3. **查看网络请求**：在浏览器 Network 标签页中，查看是否有加载插件的请求失败

4. **尝试简化插件**：临时移除对话框，只返回一个简单的操作，看看是否能显示：

```typescript
return {
  label: 'Test Action',
  icon: BookIcon,
  onHandle: () => {
    alert('Plugin is working!')
  },
}
```

## 联系支持

如果以上方法都不行，请提供：
- 浏览器控制台的错误信息
- Sanity Studio 的版本
- Node.js 版本
- 完整的错误堆栈
