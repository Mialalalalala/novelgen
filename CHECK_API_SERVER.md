# 如何检查 API 服务器是否在运行

## 方法 1: 查看终端窗口（最简单）

**检查运行 API 服务器的终端窗口**，应该看到：

```
🚀 AI Novel Generation API server running on http://localhost:3000
📝 Using Claude API (Anthropic)
🔑 Make sure ANTHROPIC_API_KEY is set in .env file
```

如果看到这些信息，说明服务器正在运行 ✅

如果没有看到，或者终端窗口关闭了，说明服务器没有运行 ❌

## 方法 2: 访问健康检查端点（推荐）

在浏览器中访问：

```
http://localhost:3000/health
```

**如果服务器正在运行**，你会看到：
```json
{
  "status": "ok",
  "message": "AI Novel Generation API is running",
  "provider": "Claude (Anthropic)"
}
```

**如果服务器没有运行**，你会看到：
- "无法访问此网站"
- "连接被拒绝"
- "ERR_CONNECTION_REFUSED"

## 方法 3: 使用命令行检查端口

在终端运行：

```bash
lsof -ti:3000
```

**如果有输出**（显示进程 ID），说明端口 3000 被占用，API 服务器可能在运行 ✅

**如果没有输出**，说明端口 3000 没有被占用，API 服务器没有运行 ❌

## 方法 4: 使用 curl 命令测试

在终端运行：

```bash
curl http://localhost:3000/health
```

**如果服务器正在运行**，会返回：
```json
{"status":"ok","message":"AI Novel Generation API is running","provider":"Claude (Anthropic)"}
```

**如果服务器没有运行**，会返回：
```
curl: (7) Failed to connect to localhost port 3000: Connection refused
```

## 方法 5: 检查进程

在终端运行：

```bash
ps aux | grep "api-server.js"
```

**如果看到进程**，说明 API 服务器正在运行 ✅

**如果没有看到**，说明 API 服务器没有运行 ❌

## 快速检查脚本

创建一个检查脚本：

```bash
# 检查 API 服务器
if curl -s http://localhost:3000/health > /dev/null; then
  echo "✅ API 服务器正在运行"
else
  echo "❌ API 服务器没有运行"
  echo "请运行: npm run api"
fi
```

## 常见问题

### 问题 1: 端口被其他程序占用

如果端口 3000 被占用但不是你的 API 服务器：

```bash
# 查看是什么占用了端口
lsof -i:3000

# 停止占用端口的进程（替换 PID 为实际的进程 ID）
kill -9 PID
```

### 问题 2: API 服务器启动失败

检查：
1. `.env` 文件是否存在
2. `ANTHROPIC_API_KEY` 是否设置
3. 依赖是否安装（`npm install`）

### 问题 3: 服务器启动但无法访问

检查：
1. 防火墙设置
2. 端口是否正确（默认 3000）
3. 是否有错误信息在终端

## 推荐检查流程

1. **首先**：查看运行 `npm run api` 的终端窗口
2. **然后**：在浏览器访问 http://localhost:3000/health
3. **最后**：如果还是不确定，使用 `curl` 命令测试

## 如果服务器没有运行

启动 API 服务器：

```bash
npm run api
```

确保：
- 在项目根目录运行
- `.env` 文件存在
- `ANTHROPIC_API_KEY` 已设置
