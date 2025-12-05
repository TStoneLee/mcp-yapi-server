# 🆘 故障排除

## 常见问题

### 1. "No server info found" 错误

**原因**: Node.js 版本过低

**解决**:
```bash
# 检查版本
node --version

# 升级到 Node.js 18+
nvm install 18
nvm use 18

# 重新构建
cd /path/to/mcp-yapi-server
npm install
npm run build

# 重启 Cursor
```

### 2. "请登录..." 错误

**原因**: 需要配置 Token

**解决**:

1. **获取 Token**
   - 登录 YApi
   - 个人设置 → 复制 token

2. **配置到 Cursor**
   ```json
   {
     "mcpServers": {
       "yapi": {
         "env": {
           "YAPI_BASE_URL": "https://yapi.example.com",
           "YAPI_TOKEN": "你的token"
         }
       }
     }
   }
   ```

3. **重启 Cursor** (Mac: `Cmd + Q`)

4. **测试 Token**
   ```bash
   curl "https://yapi.example.com/api/interface/get?id=12345&token=你的token"
   ```

### 3. 工具未显示

**检查**:
```bash
# 1. 检查 Node.js 版本
node --version  # 需要 >= 18

# 2. 检查是否已构建
ls dist/index.js

# 3. 重新构建
npm run build

# 4. 测试服务器
./scripts/test-mcp.sh
```

**然后**: 重启 Cursor

### 4. 连接失败

**检查网络**:
```bash
curl https://yapi.example.com
```

**检查配置**:
- 确认 `YAPI_BASE_URL` 正确
- 确认能访问 YApi 服务器

### 5. Token 问题

**Token 无效**:
- 重新登录 YApi 获取新 token
- 更新 Cursor 配置
- 重启 Cursor

**Token 有空格**:
```json
"YAPI_TOKEN": "abc123"  // ✅ 正确
"YAPI_TOKEN": " abc123 "  // ❌ 有空格
```

## 🔧 诊断工具

```bash
# 完整诊断
./scripts/test-mcp.sh

# 测试 Token
./scripts/test-token.sh https://yapi.example.com YOUR_TOKEN 12345
```

## ✅ 检查清单

- [ ] Node.js >= 18
- [ ] 已运行 `npm run build`
- [ ] Cursor 配置路径正确
- [ ] YAPI_TOKEN 已设置(如需要)
- [ ] 已重启 Cursor

## 💡 90% 的问题通过以下解决

1. 升级 Node.js 到 18+
2. 配置正确的 YAPI_TOKEN
3. 重启 Cursor

---

还有问题? 运行 `./scripts/test-mcp.sh` 获取详细诊断信息。
