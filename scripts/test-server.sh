#!/bin/bash

# MCP YApi Server 测试脚本

echo "======================================"
echo "MCP YApi Server 测试"
echo "======================================"
echo ""

# 设置颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否已构建
if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}错误: 未找到 dist/index.js${NC}"
    echo "请先运行: npm run build"
    exit 1
fi

echo -e "${GREEN}✓${NC} 找到构建文件"

# 检查环境变量
if [ -z "$YAPI_BASE_URL" ]; then
    echo -e "${YELLOW}⚠${NC}  警告: 未设置 YAPI_BASE_URL 环境变量"
    echo "   建议设置: export YAPI_BASE_URL=https://yapi.example.com"
else
    echo -e "${GREEN}✓${NC} YAPI_BASE_URL: $YAPI_BASE_URL"
fi

if [ -z "$YAPI_TOKEN" ]; then
    echo -e "${YELLOW}⚠${NC}  YAPI_TOKEN 未设置 (如果是公开项目可以忽略)"
else
    echo -e "${GREEN}✓${NC} YAPI_TOKEN 已设置"
fi

echo ""
echo "======================================"
echo "启动服务器测试"
echo "======================================"
echo ""
echo "提示: 服务器将通过 stdio 通信"
echo "你可以尝试发送 MCP 协议消息进行测试"
echo ""
echo "或者使用 MCP Inspector:"
echo "  npx @modelcontextprotocol/inspector node dist/index.js"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
node dist/index.js

