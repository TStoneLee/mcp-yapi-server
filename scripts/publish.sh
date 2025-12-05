#!/bin/bash

# npm 发布脚本

set -e

echo "======================================"
echo "npm 发布准备"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. 检查是否登录
echo -e "${BLUE}[1/6] 检查 npm 登录状态...${NC}"
if npm whoami > /dev/null 2>&1; then
    USER=$(npm whoami)
    echo -e "${GREEN}✓ 已登录为: $USER${NC}"
else
    echo -e "${RED}✗ 未登录 npm${NC}"
    echo "请运行: npm login"
    exit 1
fi
echo ""

# 2. 检查包名是否可用
echo -e "${BLUE}[2/6] 检查包名是否可用...${NC}"
PACKAGE_NAME=$(node -p "require('./package.json').name")
if npm view "$PACKAGE_NAME" > /dev/null 2>&1; then
    CURRENT_VERSION=$(npm view "$PACKAGE_NAME" version 2>/dev/null || echo "未发布")
    echo -e "${YELLOW}⚠ 包已存在，当前版本: $CURRENT_VERSION${NC}"
    read -p "是否继续发布? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ 包名可用${NC}"
fi
echo ""

# 3. 检查版本号
echo -e "${BLUE}[3/6] 检查版本号...${NC}"
VERSION=$(node -p "require('./package.json').version")
echo "当前版本: $VERSION"
read -p "是否更新版本号? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "版本类型 (patch/minor/major): " VERSION_TYPE
    npm version "$VERSION_TYPE"
    VERSION=$(node -p "require('./package.json').version")
    echo -e "${GREEN}✓ 版本已更新为: $VERSION${NC}"
fi
echo ""

# 4. 构建项目
echo -e "${BLUE}[4/6] 构建项目...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi
echo ""

# 5. 检查文件
echo -e "${BLUE}[5/6] 检查发布文件...${NC}"
if [ -f "dist/index.js" ] && [ -f "README.md" ] && [ -f "LICENSE" ]; then
    echo -e "${GREEN}✓ 必要文件存在${NC}"
else
    echo -e "${RED}✗ 缺少必要文件${NC}"
    exit 1
fi
echo ""

# 6. 预览发布内容
echo -e "${BLUE}[6/6] 预览发布内容...${NC}"
echo "将发布的文件:"
npm pack --dry-run 2>/dev/null | grep -E "^npm notice|^mcp-yapi-server" | head -20
echo ""

# 确认发布
read -p "确认发布到 npm? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}正在发布...${NC}"
    npm publish --access public
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}======================================"
        echo "✓ 发布成功!"
        echo "======================================${NC}"
        echo ""
        echo "包地址: https://www.npmjs.com/package/$PACKAGE_NAME"
        echo ""
        echo "安装命令:"
        echo "  npm install -g $PACKAGE_NAME"
        echo ""
    else
        echo -e "${RED}✗ 发布失败${NC}"
        exit 1
    fi
else
    echo "已取消发布"
    exit 0
fi

