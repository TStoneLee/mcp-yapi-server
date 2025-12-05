# 🚀 快速开始

## 5分钟上手指南

### 第一步: 安装依赖和构建

```bash
cd /path/to/mcp-yapi-server
npm install
npm run build
```

### 第二步: 配置 Cursor

打开 Cursor 设置,添加 MCP 服务器配置:

**Mac/Linux**: `~/.cursor/config/settings.json` 或通过 Cursor 设置界面

在 `mcpServers` 部分添加:

```json
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": [
        "/path/to/mcp-yapi-server/dist/index.js"
      ],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token_if_needed"
      }
    }
  }
}
```

> ⚠️ **重要**: 
> - 将 `YAPI_BASE_URL` 替换为你的 YApi 服务器地址
> - 如果访问私有项目,需要设置 `YAPI_TOKEN`

### 第三步: 重启 Cursor

配置完成后,重启 Cursor 使配置生效。

### 第四步: 测试使用

在 Cursor 中打开聊天窗口,尝试以下命令:

**推荐方式 ⭐ - 直接粘贴 YApi 链接:**

```
https://yapi.example.com/project/100/interface/api/12345
```

**或传统方式:**

```
请列出项目 100 的所有接口
查询接口 12345 的详细信息
```

## ✅ 验证安装

如果看到 AI 返回了接口数据,说明安装成功! 🎉

## 🔧 常见问题

### 1. 工具没有显示?

- 检查 Cursor MCP 配置是否正确
- 确认路径使用绝对路径
- 重启 Cursor

### 2. 连接失败?

- 确认 `YAPI_BASE_URL` 设置正确
- 测试网络是否能访问 YApi 服务器
- 检查防火墙设置

### 3. 权限错误?

- 确认 `YAPI_TOKEN` 设置正确
- 检查 token 是否有访问权限
- 联系 YApi 管理员

## 📚 下一步

- 查看 [USAGE.md](./USAGE.md) 了解详细使用方法
- 查看 [EXAMPLES.md](./EXAMPLES.md) 查看更多示例
- 查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解项目结构

## 🛟 获取帮助

遇到问题?
- 查看项目文档
- 提交 Issue
- 联系维护者

祝你使用愉快! 🎊
