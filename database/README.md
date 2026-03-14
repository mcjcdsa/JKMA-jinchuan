# 权限中心数据库设计文档

## 数据库信息

- **数据库名称**：`permission_center`
- **字符集**：`utf8mb4`
- **排序规则**：`utf8mb4_unicode_ci`
- **引擎**：`InnoDB`

## 表结构说明

### 1. permission_requests（权限申请表）

存储玩家提交的权限申请记录。

**字段说明**：
- `id`: 主键，自增
- `minecraft_username`: 游戏账号名称（1-16个字符，唯一索引）
- `qq_number`: QQ号（可选）
- `reason`: 申请理由（可选）
- `status`: 申请状态（pending/approved/rejected/processed）
- `created_at`: 申请时间
- `updated_at`: 更新时间
- `processed_at`: 处理时间
- `processed_by`: 处理人
- `reject_reason`: 拒绝原因（可选）
- `ip_address`: 提交IP地址

**索引**：
- `uk_username_time`: 用户名+创建时间的唯一索引（防止重复提交）
- `idx_status`: 状态索引（用于筛选）
- `idx_created_at`: 创建时间索引（用于排序）
- `idx_minecraft_username`: 用户名索引（用于查询）

### 2. permission_accounts（权限账号表）

存储已授权的游戏账号信息。

**字段说明**：
- `id`: 主键，自增
- `minecraft_username`: 游戏账号名称（唯一）
- `permission_level`: 权限等级（如：player, vip, admin等）
- `granted_at`: 授权时间
- `expires_at`: 过期时间（NULL表示永久）
- `granted_by`: 授权人
- `last_login`: 最后登录时间（可选）
- `notes`: 备注信息

**索引**：
- `uk_minecraft_username`: 用户名唯一索引
- `idx_permission_level`: 权限等级索引
- `idx_granted_at`: 授权时间索引
- `idx_expires_at`: 过期时间索引（用于查询过期账号）

### 3. operation_logs（操作日志表）

记录所有操作日志，用于审计和追踪。

**字段说明**：
- `id`: 主键，自增
- `operation_type`: 操作类型（apply/approve/reject/add/delete/update/sql）
- `minecraft_username`: 相关游戏账号名称
- `operator`: 操作人
- `operation_time`: 操作时间
- `details`: 操作详情（JSON格式）
- `ip_address`: 操作IP地址
- `sql_command`: SQL指令（如使用指令操作）

**索引**：
- `idx_operation_type`: 操作类型索引
- `idx_minecraft_username`: 用户名索引
- `idx_operation_time`: 操作时间索引
- `idx_operator`: 操作人索引

## 安装说明

### 1. 执行SQL脚本

```bash
mysql -u root -p < database/schema.sql
```

### 2. 配置数据库用户（可选）

根据实际需要创建数据库用户并分配权限：

```sql
-- API服务用户（只读和写入申请）
CREATE USER 'api_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT SELECT, INSERT, UPDATE ON permission_center.permission_requests TO 'api_user'@'localhost';
GRANT SELECT ON permission_center.permission_accounts TO 'api_user'@'localhost';
GRANT INSERT ON permission_center.operation_logs TO 'api_user'@'localhost';

-- 管理用户（完整权限）
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON permission_center.* TO 'admin_user'@'%';

FLUSH PRIVILEGES;
```

## 使用说明

### 查询待审核申请

```sql
SELECT * FROM permission_requests 
WHERE status = 'pending' 
ORDER BY created_at DESC;
```

### 查询申请状态

```sql
SELECT * FROM permission_requests 
WHERE minecraft_username = 'PlayerName' 
ORDER BY created_at DESC 
LIMIT 1;
```

### 检查24小时内是否已提交

```sql
CALL sp_check_recent_request('PlayerName', @exists);
SELECT @exists;
```

### 查询权限账号列表

```sql
SELECT * FROM permission_accounts 
WHERE expires_at IS NULL OR expires_at > NOW()
ORDER BY granted_at DESC;
```

### 查询操作日志

```sql
SELECT * FROM operation_logs 
ORDER BY operation_time DESC 
LIMIT 100;
```

## 维护建议

1. **定期备份**：建议每日备份数据库
2. **清理过期数据**：定期清理过期的申请记录和日志
3. **监控性能**：监控查询性能，必要时优化索引
4. **数据归档**：对于历史数据，可以考虑归档到其他表或文件

## 注意事项

1. 用户名格式验证：使用CHECK约束确保用户名格式正确
2. 唯一性约束：确保同一账号不会重复授权
3. 时间字段：使用DATETIME类型存储时间，注意时区问题
4. JSON字段：MySQL 5.7+支持JSON类型，便于存储结构化数据
5. 触发器：自动处理某些业务逻辑，但要注意性能影响

