# 📚 使用指南

## 🚀 最简单的方式 - 直接粘贴 URL

在 Cursor 中直接粘贴 YApi 接口链接:

```
https://yapi.example.com/project/100/interface/api/12345
```

AI 会自动识别并查询接口详情！

## 📖 可用工具

### 1. 通过 URL 查询 ⭐ (推荐)

**直接粘贴链接:**
```
https://yapi.example.com/project/100/interface/api/12345
```

**或带说明:**
```
帮我查询这个接口: https://yapi.example.com/project/100/interface/api/12345
```

### 2. 查询接口详情

```
查询接口 12345 的详细信息
```

### 3. 搜索接口

```
在项目 100 中搜索"用户登录"
```

### 4. 列出接口

```
列出项目 100 的所有接口
```

### 5. 获取项目信息

```
获取项目 100 的信息
```

## 💡 实用示例

### 生成调用代码

```
为这个接口生成 TypeScript 调用代码:
https://yapi.example.com/project/100/interface/api/12345
```

AI 会生成:
```typescript
import axios from 'axios';

async function apiCall() {
  const response = await axios.post('/api/xxx', {
    // 参数...
  });
  return response.data;
}
```

### 生成类型定义

```
生成这个接口的 TypeScript 类型定义:
https://yapi.example.com/project/100/interface/api/12345
```

AI 会生成:
```typescript
interface ApiRequest {
  // 请求类型...
}

interface ApiResponse {
  // 响应类型...
}
```

### 批量查询

```
帮我查询以下接口:
1. https://yapi.example.com/project/100/interface/api/12345
2. https://yapi.example.com/project/100/interface/api/12346
```

### 对比接口

```
对比这两个接口的参数差异:
https://yapi.example.com/project/100/interface/api/12345
https://yapi.example.com/project/100/interface/api/12346
```

## 🔧 配置 Token (私有项目)

如果需要访问私有项目，在 Cursor 配置中添加:

```json
{
  "mcpServers": {
    "yapi": {
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "your_token_here"
      }
    }
  }
}
```

### 获取 Token

1. 登录 YApi
2. 点击右上角头像 → 个人设置
3. 复制 token 字段
4. 粘贴到 Cursor 配置
5. 重启 Cursor

## 📊 返回的数据

查询接口会返回:

```json
{
  "title": "接口名称",
  "method": "POST",
  "path": "/api/xxx",
  "request": {
    "params": [...],
    "headers": [...],
    "body": {...}
  },
  "response": {
    "example": {...},
    "schema": {...}
  }
}
```

## 💡 使用技巧

1. **从 YApi 复制链接最快** - 直接 Ctrl/Cmd + C, Ctrl/Cmd + V
2. **让 AI 帮你生成代码** - "生成调用代码"、"生成类型定义"
3. **批量处理** - 一次粘贴多个链接
4. **对比分析** - 对比不同接口的差异

## 🆘 遇到问题?

- **"请登录"错误** → 配置 YAPI_TOKEN
- **"No server info found"** → 升级 Node.js 到 18+
- **工具不显示** → 重启 Cursor

详见 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**开始使用**: 复制一个 YApi 链接,粘贴到 Cursor! 🚀
