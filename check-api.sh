#!/bin/bash
# 快速检查 API 服务器是否在运行

echo "🔍 检查 API 服务器状态..."
echo ""

# 方法 1: 检查端口
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "✅ 端口 3000 已被占用（可能有服务在运行）"
else
  echo "❌ 端口 3000 未被占用（服务器可能没有运行）"
fi

echo ""

# 方法 2: 检查健康端点
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "✅ API 服务器正在运行！"
  echo ""
  echo "健康检查响应："
  curl -s http://localhost:3000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/health
else
  echo "❌ API 服务器没有运行"
  echo ""
  echo "请运行以下命令启动服务器："
  echo "  npm run api"
fi

echo ""
