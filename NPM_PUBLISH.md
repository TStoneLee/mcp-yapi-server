# 📦 发布到 npm 指南

## 📋 发布前检查清单

### 1. 更新 package.json

- [x] ✅ `name`: `mcp-yapi-server` (确保唯一性)
- [x] ✅ `version`: `1.0.0` (遵循语义化版本)
- [x] ✅ `description`: 清晰描述
- [x] ✅ `author`: 你的信息
- [x] ✅ `license`: MIT
- [x] ✅ `repository`: GitHub 仓库地址
- [x] ✅ `engines`: Node.js >= 18.0.0
- [x] ✅ `files`: 指定发布文件
- [x] ✅ `bin`: CLI 命令配置

### 2. 创建必要文件

- [x] ✅ `.npmignore` - 排除不需要的文件
- [x] ✅ `LICENSE` - MIT 许可证
- [x] ✅ `README.md` - 适合 npm 的说明

### 3. 构建项目

```bash
npm run build
```

确保 `dist/` 目录包含编译后的文件。

### 4. 测试安装

```bash
# 本地测试
npm pack
tar -xzf mcp-yapi-server-1.0.0.tgz
cd package
node dist/index.js
```

## 🚀 发布步骤

### 步骤 1: 登录 npm

```bash
npm login
```

输入你的 npm 账号信息。

### 步骤 2: 检查包名是否可用

```bash
npm view mcp-yapi-server
```

如果返回 404，说明包名可用。

### 步骤 3: 更新版本号

```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 次要版本 (1.0.0 -> 1.1.0)
npm version minor

# 主要版本 (1.0.0 -> 2.0.0)
npm version major
```

或手动编辑 `package.json` 中的 `version` 字段。

### 步骤 4: 发布

```bash
npm publish
```

**首次发布**：
```bash
npm publish --access public
```

### 步骤 5: 验证发布

```bash
# 查看包信息
npm view mcp-yapi-server

# 测试安装
npm install -g mcp-yapi-server
mcp-yapi-server --help
```

## 📝 更新 package.json 中的仓库信息

发布前，请更新以下字段：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/mcp-yapi-server.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/mcp-yapi-server/issues"
  },
  "homepage": "https://github.com/your-username/mcp-yapi-server#readme"
}
```

将 `your-username` 替换为你的 GitHub 用户名。

## 🔄 后续更新

### 更新版本

```bash
# 1. 更新代码
# 2. 更新版本号
npm version patch  # 或 minor, major

# 3. 构建
npm run build

# 4. 发布
npm publish
```

### 撤销发布 (24小时内)

```bash
npm unpublish mcp-yapi-server@1.0.0
```

## ⚠️ 注意事项

1. **包名唯一性**: 确保 `mcp-yapi-server` 在 npm 上可用
2. **版本号**: 遵循语义化版本 (semver)
3. **README**: npm 会显示 README.md 的内容
4. **许可证**: 确保有 LICENSE 文件
5. **文件大小**: 检查发布包的大小，避免过大

## 📊 发布后

### 在 npm 上查看

访问: https://www.npmjs.com/package/mcp-yapi-server

### 安装使用

```bash
npm install -g mcp-yapi-server
```

### 更新文档

- GitHub README
- npm 包页面会自动显示 README.md

## 🎯 快速发布命令

```bash
# 完整流程
npm run build && \
npm version patch && \
npm publish --access public
```

## 📞 需要帮助?

- [npm 发布文档](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [语义化版本](https://semver.org/)

---

**祝发布顺利!** 🚀

