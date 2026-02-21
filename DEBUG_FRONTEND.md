# 前端页面一直加载中的问题排查

## 可能的原因

### 1. Sanity CORS 配置问题

前端页面无法访问 Sanity API，需要配置 CORS。

**解决方法：**

1. 访问 Sanity 管理控制台：https://www.sanity.io/manage
2. 选择你的项目（projectId: 9cp0f5xw）
3. 进入 "API" > "CORS origins"
4. 添加你的前端域名：
   - `https://sanity-1myzwabj4-zhazhadezhazha-9763s-projects.vercel.app`
   - 或者使用通配符：`https://*.vercel.app`（允许所有 Vercel 子域名）
5. 确保勾选了 "Allow credentials"

### 2. 没有已发布的小说

如果 Sanity 中没有 status 为 "published" 的小说，页面会显示"暂无小说"。

**解决方法：**

1. 访问 Sanity Studio：`https://your-project.sanity.studio`
2. 创建或编辑 Novel 文档
3. 确保状态设置为 "Published"
4. 点击 "Publish" 按钮

### 3. 项目 ID 或数据集错误

**检查方法：**

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页
3. 查看 Network 标签页，检查是否有失败的请求

### 4. Sanity CDN 问题

如果使用 CDN，可能需要等待内容同步。

**解决方法：**

在 `index.html` 中，将 `useCdn: true` 改为 `useCdn: false` 进行测试。

## 快速检查步骤

### 步骤 1: 检查浏览器控制台

1. 打开你的前端页面
2. 按 F12 打开开发者工具
3. 查看 Console 标签页的错误信息
4. 查看 Network 标签页，检查对 Sanity API 的请求是否成功

### 步骤 2: 检查 CORS 设置

访问：https://www.sanity.io/manage

1. 选择项目
2. 进入 API > CORS origins
3. 确认你的域名已添加

### 步骤 3: 测试 Sanity API

在浏览器控制台运行：

```javascript
const client = sanity.createClient({
  projectId: '9cp0f5xw',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})

client.fetch('*[_type == "novel"]').then(console.log).catch(console.error)
```

如果这个命令失败，说明是 CORS 或配置问题。

### 步骤 4: 检查是否有已发布的小说

在浏览器控制台运行：

```javascript
client.fetch('*[_type == "novel" && status == "published"]').then(novels => {
  console.log('已发布的小说数量:', novels.length)
  console.log('小说列表:', novels)
})
```

## 临时解决方案

如果 CORS 还没配置好，可以临时修改前端代码，使用 token 进行认证：

```javascript
const client = sanity.createClient({
  projectId: '9cp0f5xw',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
  token: 'your-read-token' // 需要创建 read token
})
```

**创建 read token：**
1. 访问 Sanity 管理控制台
2. API > Tokens
3. 创建新的 token，选择 "Read" 权限

## 最可能的问题

根据你的情况，**最可能是 CORS 配置问题**。

**立即检查：**
1. 访问 https://www.sanity.io/manage
2. 选择项目 9cp0f5xw
3. API > CORS origins
4. 添加：`https://sanity-1myzwabj4-zhazhadezhazha-9763s-projects.vercel.app`

添加后，刷新前端页面应该就能正常加载了。
