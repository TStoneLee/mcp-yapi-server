#!/bin/bash

# YApi Token 测试脚本

echo "======================================"
echo "YApi Token 测试工具"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查参数
if [ $# -lt 2 ]; then
    echo "用法: ./test-token.sh <服务器地址> <token> [接口ID]"
    echo ""
    echo "示例:"
    echo "  ./test-token.sh https://yapi.example.com 你的token 3934"
    echo ""
    echo "或者:"
    echo "  ./test-token.sh https://yapi.example.com 你的token"
    echo ""
    exit 1
fi

SERVER_URL=$1
TOKEN=$2
INTERFACE_ID=${3:-12345}

echo -e "${BLUE}测试配置:${NC}"
echo "服务器: $SERVER_URL"
echo "Token: ${TOKEN:0:10}..."
echo "接口ID: $INTERFACE_ID"
echo ""

# 测试 1: 测试 token 是否有效
echo -e "${BLUE}[1/2] 测试 Token 有效性...${NC}"

RESPONSE=$(curl -s "${SERVER_URL}/api/interface/get?id=${INTERFACE_ID}&token=${TOKEN}")

# 检查是否包含错误
if echo "$RESPONSE" | grep -q "请登录"; then
    echo -e "${RED}✗ Token 无效或已过期${NC}"
    echo ""
    echo "错误信息:"
    echo "$RESPONSE" | grep -o '"errmsg":"[^"]*"'
    echo ""
    echo "请检查:"
    echo "1. Token 是否正确"
    echo "2. Token 是否过期"
    echo "3. 是否有访问该接口的权限"
    exit 1
elif echo "$RESPONSE" | grep -q '"errcode":0'; then
    echo -e "${GREEN}✓ Token 有效!${NC}"
    
    # 提取接口名称
    TITLE=$(echo "$RESPONSE" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
    METHOD=$(echo "$RESPONSE" | grep -o '"method":"[^"]*"' | cut -d'"' -f4)
    PATH=$(echo "$RESPONSE" | grep -o '"path":"[^"]*"' | cut -d'"' -f4)
    
    echo ""
    echo "接口信息:"
    echo "  名称: $TITLE"
    echo "  方法: $METHOD"
    echo "  路径: $PATH"
else
    echo -e "${YELLOW}⚠ 无法确定结果${NC}"
    echo ""
    echo "响应内容:"
    echo "$RESPONSE" | head -20
fi

echo ""

# 测试 2: 生成 Cursor 配置
echo -e "${BLUE}[2/2] 生成 Cursor 配置...${NC}"

cat > /tmp/cursor-config-with-token.json << EOF
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": [
        "$(pwd)/dist/index.js"
      ],
      "env": {
        "YAPI_BASE_URL": "$SERVER_URL",
        "YAPI_TOKEN": "$TOKEN"
      }
    }
  }
}
EOF

echo -e "${GREEN}✓ 配置已生成${NC}"
echo ""
echo "请将以下配置复制到 Cursor 的 MCP 设置中:"
echo ""
cat /tmp/cursor-config-with-token.json
echo ""

# 总结
echo "======================================"
echo "测试完成"
echo "======================================"
echo ""
echo "下一步:"
echo "1. 复制上面的配置到 Cursor"
echo "2. 重启 Cursor (Cmd+Q 然后重新打开)"
echo "3. 测试: https://${SERVER_URL#https://}/project/100/interface/api/${INTERFACE_ID}"
echo ""

