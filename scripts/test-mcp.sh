#!/bin/bash

# MCP 服务器测试脚本

echo "======================================"
echo "MCP YApi Server 诊断工具"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. 检查 Node.js 版本
echo -e "${BLUE}[1/7] 检查 Node.js 版本...${NC}"
NODE_VERSION=$(node --version)
echo "Node.js 版本: $NODE_VERSION"

# 提取主版本号
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 版本过低 (需要 >= 18)${NC}"
    echo "  请升级 Node.js: nvm install 18 && nvm use 18"
    exit 1
else
    echo -e "${GREEN}✓ Node.js 版本满足要求${NC}"
fi
echo ""

# 2. 检查文件是否存在
echo -e "${BLUE}[2/7] 检查项目文件...${NC}"
if [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✓ dist/index.js 存在${NC}"
    ls -lh dist/index.js
else
    echo -e "${RED}✗ dist/index.js 不存在${NC}"
    echo "  请运行: npm run build"
    exit 1
fi
echo ""

# 3. 检查依赖
echo -e "${BLUE}[3/7] 检查依赖...${NC}"
if [ -d "node_modules/@modelcontextprotocol/sdk" ]; then
    echo -e "${GREEN}✓ MCP SDK 已安装${NC}"
else
    echo -e "${RED}✗ MCP SDK 未安装${NC}"
    echo "  请运行: npm install"
    exit 1
fi
echo ""

# 4. 检查环境变量
echo -e "${BLUE}[4/7] 检查环境变量...${NC}"
if [ -z "$YAPI_BASE_URL" ]; then
    echo -e "${YELLOW}⚠ YAPI_BASE_URL 未设置${NC}"
    echo "  将使用默认值: https://yapi.example.com"
    export YAPI_BASE_URL="https://yapi.example.com"
else
    echo -e "${GREEN}✓ YAPI_BASE_URL: $YAPI_BASE_URL${NC}"
fi

if [ -z "$YAPI_TOKEN" ]; then
    echo -e "${YELLOW}⚠ YAPI_TOKEN 未设置 (如果是公开项目可以忽略)${NC}"
else
    echo -e "${GREEN}✓ YAPI_TOKEN: ${YAPI_TOKEN:0:10}...${NC}"
fi
echo ""

# 5. 测试服务器启动
echo -e "${BLUE}[5/7] 测试服务器启动...${NC}"
echo "启动服务器 (5秒后自动退出)..."

# 启动服务器并在后台运行
timeout 5s node dist/index.js 2>&1 &
SERVER_PID=$!

sleep 2

# 检查进程是否还在运行
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 服务器成功启动 (PID: $SERVER_PID)${NC}"
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
else
    echo -e "${RED}✗ 服务器启动失败或立即退出${NC}"
    echo "  请查看上方的错误信息"
fi
echo ""

# 6. 测试 JSON-RPC 初始化
echo -e "${BLUE}[6/7] 测试 JSON-RPC 初始化...${NC}"
echo "发送初始化请求..."

# 创建临时测试脚本
cat > /tmp/test-mcp-init.js << 'EOJS'
const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(process.cwd(), 'dist/index.js');
const server = spawn('node', [serverPath], {
  env: {
    ...process.env,
    YAPI_BASE_URL: process.env.YAPI_BASE_URL || 'https://yapi.example.com'
  }
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// 发送初始化请求
const initRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

setTimeout(() => {
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 500);

setTimeout(() => {
  server.kill();
  
  console.log('=== stdout ===');
  console.log(output || '(empty)');
  console.log('\n=== stderr ===');
  console.log(errorOutput || '(empty)');
  
  if (output.includes('"result"')) {
    console.log('\n✓ 服务器正确响应了初始化请求');
    process.exit(0);
  } else {
    console.log('\n✗ 服务器没有正确响应');
    process.exit(1);
  }
}, 3000);
EOJS

# 运行测试
node /tmp/test-mcp-init.js
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ JSON-RPC 初始化成功${NC}"
else
    echo -e "${RED}✗ JSON-RPC 初始化失败${NC}"
fi

rm /tmp/test-mcp-init.js
echo ""

# 7. 生成 Cursor 配置
echo -e "${BLUE}[7/7] 生成 Cursor 配置...${NC}"
CURRENT_DIR=$(pwd)
cat > /tmp/cursor-mcp-config.json << EOF
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": [
        "$CURRENT_DIR/dist/index.js"
      ],
      "env": {
        "YAPI_BASE_URL": "${YAPI_BASE_URL:-https://yapi.example.com}",
        "YAPI_TOKEN": "${YAPI_TOKEN:-}"
      }
    }
  }
}
EOF

echo -e "${GREEN}✓ 配置已生成${NC}"
echo ""
echo "请将以下配置复制到 Cursor 的 MCP 设置中:"
echo ""
cat /tmp/cursor-mcp-config.json
echo ""

# 总结
echo "======================================"
echo "诊断完成"
echo "======================================"
echo ""
echo "如果所有检查都通过,请:"
echo "1. 复制上面的配置到 Cursor"
echo "2. 重启 Cursor"
echo "3. 在聊天中尝试: '列出项目 100 的所有接口'"
echo ""
echo "如果遇到问题,请查看: TROUBLESHOOTING.md"
echo ""

