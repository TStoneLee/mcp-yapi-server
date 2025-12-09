# mcp-yapi-server

[![npm version](https://img.shields.io/npm/v/mcp-yapi-server.svg)](https://www.npmjs.com/package/mcp-yapi-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/TStoneLee/mcp-yapi-server.svg)](https://github.com/TStoneLee/mcp-yapi-server/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/TStoneLee/mcp-yapi-server.svg)](https://github.com/TStoneLee/mcp-yapi-server/network)

基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 的 YApi 集成服务器，在 Cursor 等支持 MCP 的编辑器中直接查询 YApi API 文档。

## ✨ 功能特性

- 🔗 **直接粘贴 URL** - 最简单！粘贴 YApi 链接即可查询
- 🔍 **查询接口详情** - 完整的请求/响应参数
- 📋 **列出接口** - 查看项目所有接口
- 🔎 **搜索接口** - 按关键词搜索
- 🤖 **AI 辅助** - 自动生成代码、类型定义等

## 📦 安装

```bash
npm install -g mcp-yapi-server
```

或作为项目依赖：

```bash
npm install mcp-yapi-server
```

## 🚀 快速开始

### 1. 安装

```bash
npm install -g mcp-yapi-server
```

### 2. 配置 Cursor

在 Cursor 设置中添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "mcp-yapi-server",
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token_here"
      }
    }
  }
}
```

**或使用本地安装：**

```json
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": ["./node_modules/mcp-yapi-server/dist/index.js"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token_here"
      }
    }
  }
}
```

### 3. 重启 Cursor

### 4. 开始使用

在 Cursor 中直接粘贴 YApi 链接：

```
https://yapi.example.com/project/100/interface/api/12345
```

## 📚 文档

- [快速开始指南](./docs/QUICK_START.md)
- [使用指南](./docs/USAGE.md)
- [故障排除](./docs/TROUBLESHOOTING.md)

## 🔧 常见问题

### "No server info found"
**原因**: Node.js 版本 < 18  
**解决**: `nvm install 18 && nvm use 18`

### "请登录..."
**原因**: 需要配置 Token  
**解决**: 在 Cursor 配置中设置 `YAPI_TOKEN`

详见 [故障排除文档](./docs/TROUBLESHOOTING.md)

## 🛠 开发

```bash
# 克隆项目
git clone https://github.com/TStoneLee/mcp-yapi-server.git
cd mcp-yapi-server

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 📄 许可证

MIT License

## 🔗 相关链接

- [Model Context Protocol](https://modelcontextprotocol.io)
- [YApi 官方文档](https://hellosean1025.github.io/yapi/)
- [Cursor 编辑器](https://cursor.sh)
