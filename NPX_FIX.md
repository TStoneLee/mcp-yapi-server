# 🔧 修复 npx 使用问题

## 问题

使用 `npx mcp-yapi-server@latest` 时出现错误：
```
Cannot find module '@modelcontextprotocol/sdk/server/mcp.js'
```

## 原因

npx 在临时目录安装包时，可能没有正确安装依赖的依赖。

## 解决方案

### 方案 1: 使用本地安装 (推荐)

```json
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": ["./node_modules/mcp-yapi-server/dist/index.js"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token"
      }
    }
  }
}
```

**步骤**:
1. 在项目目录运行: `npm install mcp-yapi-server`
2. 使用上面的配置

### 方案 2: 全局安装

```bash
npm install -g mcp-yapi-server
```

然后配置:
```json
{
  "mcpServers": {
    "yapi": {
      "command": "mcp-yapi-server",
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token"
      }
    }
  }
}
```

### 方案 3: 使用完整路径

如果必须使用 npx，可以尝试：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "npx",
      "args": [
        "--yes",
        "--package=mcp-yapi-server@latest",
        "node",
        "-e",
        "import('mcp-yapi-server/dist/index.js')"
      ],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token"
      }
    }
  }
}
```

## 推荐配置

**最佳实践**: 使用本地安装

```bash
# 在项目根目录
npm install mcp-yapi-server
```

```json
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": ["./node_modules/mcp-yapi-server/dist/index.js"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token"
      }
    }
  }
}
```

## 验证

安装后测试：

```bash
node ./node_modules/mcp-yapi-server/dist/index.js
```

应该看到: "MCP YApi Server 已启动"

