# 权限中心API服务文档

## 概述

权限中心API服务是游戏账号权限申请系统的后端服务，负责处理官网前端提交的申请请求和状态查询。

## 部署位置

API服务部署在与Minecraft Java版服务器相同的服务器上，通过HTTPS对外提供服务。

## 技术选型

推荐使用以下技术栈之一：

1. **Node.js + Express**（推荐）
   - 轻量级，资源占用少
   - JavaScript技术栈统一
   - 易于与Minecraft服务器集成

2. **Python + Flask/FastAPI**
   - 简单易用
   - 丰富的数据库库
   - 资源占用适中

## API接口

### 基础信息

- **Base URL**: `https://api.jkma.city`（示例，需要替换为实际地址）
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

### 1. 提交权限申请

**接口地址**: `POST /api/permission/apply`

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "minecraft_username": "PlayerName",
  "qq_number": "123456789",
  "reason": "申请理由",
  "captcha": "验证码答案"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "申请提交成功",
  "request_id": "REQ-20260314-001",
  "data": {
    "id": 1,
    "status": "pending"
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "message": "错误信息",
  "error_code": "ERROR_CODE"
}
```

**错误码说明**:
- `INVALID_USERNAME`: 用户名格式不正确
- `DUPLICATE_REQUEST`: 24小时内已提交过申请
- `INVALID_CAPTCHA`: 验证码错误
- `DATABASE_ERROR`: 数据库错误
- `SERVER_ERROR`: 服务器错误

### 2. 查询申请状态

**接口地址**: `GET /api/permission/status`

**查询参数**:
- `username`: 游戏账号名称（必填）

**请求示例**:
```
GET /api/permission/status?username=PlayerName
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "minecraft_username": "PlayerName",
    "status": "pending",
    "created_at": "2026-03-14 19:00:00",
    "processed_at": null,
    "reject_reason": null,
    "qq_number": "123456789"
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "message": "未找到申请记录",
  "error_code": "NOT_FOUND"
}
```

## 安全措施

1. **API Key验证**（简单场景）
   - 在请求头中添加API Key
   - 服务端验证API Key有效性

2. **JWT Token验证**（推荐）
   - 使用JWT Token进行身份验证
   - Token包含过期时间和签名

3. **请求频率限制**（Rate Limiting）
   - 限制同一IP的请求频率
   - 防止恶意刷屏

4. **CORS配置**
   - 仅允许GitHub Pages域名访问
   - 配置允许的HTTP方法

5. **输入验证**
   - 验证用户名格式
   - 验证QQ号格式
   - 防止SQL注入（使用参数化查询）

## 部署说明

### Node.js + Express部署

1. 安装依赖：
```bash
npm install express mysql2 cors dotenv
```

2. 配置环境变量（`.env`文件）：
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=api_user
DB_PASSWORD=your_password
DB_NAME=permission_center
API_PORT=3000
API_KEY=your_api_key
CORS_ORIGIN=https://mcjcdsa.github.io
```

3. 启动服务：
```bash
node server.js
```

4. 使用PM2管理（推荐）：
```bash
pm2 start server.js --name permission-api
pm2 save
pm2 startup
```

### Python + Flask部署

1. 安装依赖：
```bash
pip install flask flask-cors mysql-connector-python python-dotenv
```

2. 配置环境变量（`.env`文件）：
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=api_user
DB_PASSWORD=your_password
DB_NAME=permission_center
API_PORT=3000
API_KEY=your_api_key
CORS_ORIGIN=https://mcjcdsa.github.io
```

3. 启动服务：
```bash
python app.py
```

4. 使用systemd管理（推荐）：
创建`/etc/systemd/system/permission-api.service`文件，配置服务自启动。

## Nginx反向代理配置（HTTPS）

```nginx
server {
    listen 443 ssl http2;
    server_name api.jkma.city;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 监控和日志

1. **日志记录**
   - 记录所有API请求
   - 记录错误信息
   - 日志轮转（避免日志文件过大）

2. **性能监控**
   - 监控API响应时间
   - 监控数据库连接状态
   - 监控服务器资源使用

3. **错误告警**
   - 设置错误率阈值
   - 发送告警通知

## 测试

### 使用curl测试

```bash
# 测试提交申请
curl -X POST https://api.jkma.city/api/permission/apply \
  -H "Content-Type: application/json" \
  -d '{
    "minecraft_username": "TestPlayer",
    "qq_number": "123456789",
    "reason": "测试申请",
    "captcha": "5"
  }'

# 测试查询状态
curl https://api.jkma.city/api/permission/status?username=TestPlayer
```

## 注意事项

1. **数据库连接池**：使用连接池管理数据库连接，避免连接数过多
2. **事务处理**：确保数据一致性，使用事务处理关键操作
3. **错误处理**：完善的错误处理机制，返回友好的错误信息
4. **性能优化**：优化数据库查询，使用索引提高查询速度
5. **安全更新**：定期更新依赖包，修复安全漏洞

