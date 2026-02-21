# AI 生成电子小说售卖系统 - 最小示例

这是一个使用 Sanity CMS 构建的 AI 生成电子小说并在网站售卖的最小示例。

## 功能特性

### 1. 小说管理 (Novel Schema)
- 标题、描述、封面图片
- 小说内容（支持富文本）
- 价格和货币设置
- 类型分类（Fantasy, Sci-Fi, Romance 等）
- 作者信息
- 字数统计
- 发布状态管理

### 2. 订单管理 (Order Schema)
- 订单号自动生成
- 客户信息（姓名、邮箱）
- 支付方式和状态
- 关联小说
- 购买时间记录

### 3. AI 生成功能
- 在 Sanity Studio 中为小说文档添加 "Generate with AI" 操作
- 支持自定义标题、类型、字数
- 自动生成小说内容并填充到文档中

### 4. 前端展示页面
- 小说列表展示
- 小说详情页
- 购买表单
- 响应式设计

## 安装和设置

### 1. 安装依赖

```bash
npm install
```

### 2. 运行 Sanity Studio

```bash
npm run dev
```

访问 `http://localhost:3333` 查看 Sanity Studio。

### 3. 创建小说

1. 在 Sanity Studio 中，点击 "Create" → "Novel"
2. 填写基本信息（标题、类型、价格等）
3. 点击文档操作菜单（三个点），选择 "Generate with AI"
4. 填写生成参数，点击确认生成内容
5. 编辑和完善生成的内容
6. 设置状态为 "Published" 并发布

### 4. 查看前端页面

打开 `frontend/index.html` 文件在浏览器中查看。

**注意**: 前端页面需要配置正确的 Sanity 项目 ID。请确保 `frontend/index.html` 中的 `projectId` 与你的 Sanity 项目匹配。

## 项目结构

```
sanity/
├── schemaTypes/
│   └── documents/
│       ├── novel.ts          # 小说文档类型
│       └── order.ts           # 订单文档类型
├── plugins/
│   └── aiNovelGenerator/     # AI 生成插件
│       ├── index.tsx         # 生成操作实现
│       └── plugin.ts         # 插件配置
└── frontend/
    └── index.html            # 前端展示页面
```

## AI 集成说明

当前实现使用占位符内容。要集成真实的 AI 服务，需要：

### 选项 1: 使用 OpenAI

1. 在 `plugins/aiNovelGenerator/index.tsx` 中的 `generateNovelContent` 函数
2. 添加 API 调用：

```typescript
async function generateNovelContent(prompt: string, targetWords: number): Promise<any[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.floor(targetWords * 1.5)
    })
  })
  const data = await response.json()
  const text = data.choices[0].message.content
  return convertTextToBlocks(text)
}
```

### 选项 2: 使用 Sanity AI

Sanity 提供了内置的 AI 功能，可以通过 `@sanity/assist` 包使用。

### 选项 3: 使用服务器端 API

创建一个 API 路由（如 Next.js API route 或 serverless function）来处理 AI 生成，避免在前端暴露 API 密钥。

## 支付集成

当前实现仅展示购买表单。要集成真实支付，需要：

1. **Stripe**: 使用 Stripe Checkout 或 Payment Intents
2. **PayPal**: 使用 PayPal SDK
3. **其他支付网关**: 根据需求选择

在 `frontend/index.html` 的 `handlePurchase` 函数中添加支付处理逻辑。

## 扩展功能建议

1. **用户认证**: 添加用户登录/注册功能
2. **购物车**: 支持多本小说同时购买
3. **阅读器**: 创建专门的电子书阅读界面
4. **下载功能**: 支持 PDF/EPUB 格式下载
5. **评论系统**: 允许用户评论和评分
6. **推荐系统**: 基于类型和购买历史推荐
7. **分析统计**: 添加销售和阅读数据分析

## 注意事项

- 这是一个最小示例，生产环境需要添加错误处理、验证、安全措施等
- AI 生成的内容需要人工审核和编辑
- 支付处理必须在安全的服务器端进行
- 确保遵守相关法律法规（版权、数据保护等）

## 许可证

本项目仅作为示例使用。
