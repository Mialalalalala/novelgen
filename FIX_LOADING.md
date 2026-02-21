# 修复前端一直加载中的问题

## 问题诊断

前端一直显示"Loading..."通常是因为无法从 Sanity API 加载数据。

## 立即解决方案

### 步骤 1: 配置 Sanity CORS（最重要！）

1. **访问 Sanity 管理控制台**：
   ```
   https://www.sanity.io/manage
   ```

2. **选择你的项目**：
   - Project ID: `9cp0f5xw`

3. **进入 CORS 设置**：
   - 点击 **API** 标签
   - 选择 **CORS origins**

4. **添加你的前端域名**：
   - 点击 **Add CORS origin**
   - 输入：`https://sanity-1myzwabj4-zhazhadezhazha-9763s-projects.vercel.app`
   - 或者使用通配符：`https://*.vercel.app`（允许所有 Vercel 子域名）

5. **重要设置**：
   - ✅ 勾选 **Allow credentials**
   - ✅ 勾选 **Allow browser extensions**（可选）

6. **保存并等待几秒钟**

7. **刷新前端页面**

### 步骤 2: 检查是否有已发布的小说

1. **访问 Sanity Studio**：
   - 本地：`http://localhost:3333`
   - 或已部署的 Studio URL

2. **创建或编辑 Novel 文档**：
   - 填写标题、描述、价格等
   - **重要**：将状态设置为 **Published**
   - 点击 **Publish** 按钮

3. **如果没有已发布的小说**，页面会显示 "No Novels Available"

### 步骤 3: 检查浏览器控制台

1. 打开前端页面
2. 按 **F12** 打开开发者工具
3. 查看 **Console** 标签页
4. 查看 **Network** 标签页

**常见错误：**
- `CORS policy` - 需要配置 CORS
- `Failed to fetch` - 网络或 CORS 问题
- `404 Not Found` - 项目 ID 或数据集错误

## 快速测试

在浏览器控制台运行：

```javascript
const client = sanity.createClient({
  projectId: '9cp0f5xw',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})

// 测试连接
client.fetch('*[_type == "novel"]').then(novels => {
  console.log('✅ Connection successful!')
  console.log('Novels found:', novels.length)
  console.log('Novels:', novels)
}).catch(error => {
  console.error('❌ Connection failed:', error)
  console.error('This is likely a CORS issue')
})
```

## 如果仍然不行

### 方案 1: 使用 Sanity Token（临时解决方案）

1. **创建 Read Token**：
   - 访问：https://www.sanity.io/manage
   - 选择项目
   - **API** > **Tokens**
   - 创建新 token，选择 **Read** 权限

2. **更新前端代码**：
   在 `frontend/index.html` 中，修改 Sanity client：
   ```javascript
   const client = sanity.createClient({
     projectId: '9cp0f5xw',
     dataset: 'production',
     useCdn: true,
     apiVersion: '2024-01-01',
     token: 'your-read-token-here' // 添加这行
   })
   ```

3. **重新部署前端**

### 方案 2: 检查网络连接

- 确保网络连接正常
- 检查防火墙设置
- 尝试不同的网络环境

## 最可能的原因

根据你的情况，**99% 是 CORS 配置问题**。

**立即执行：**
1. 访问 https://www.sanity.io/manage
2. 选择项目 9cp0f5xw
3. API > CORS origins
4. 添加你的 Vercel 域名
5. 保存并刷新页面

配置完成后，页面应该能正常加载了！
