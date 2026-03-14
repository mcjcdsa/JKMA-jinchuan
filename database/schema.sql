-- ============================================
-- 游戏账号权限申请系统数据库设计
-- 数据库名称：permission_center
-- 创建日期：2026-03-14
-- ============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS permission_center 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE permission_center;

-- ============================================
-- 1. 权限申请表（permission_requests）
-- ============================================
CREATE TABLE IF NOT EXISTS permission_requests (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，自增',
    minecraft_username VARCHAR(16) NOT NULL COMMENT '游戏账号名称（1-16个字符）',
    qq_number VARCHAR(15) DEFAULT NULL COMMENT 'QQ号（可选）',
    reason TEXT DEFAULT NULL COMMENT '申请理由（可选）',
    status ENUM('pending', 'approved', 'rejected', 'processed') NOT NULL DEFAULT 'pending' COMMENT '申请状态：pending=待审核，approved=已通过，rejected=已拒绝，processed=已处理',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    processed_at DATETIME DEFAULT NULL COMMENT '处理时间',
    processed_by VARCHAR(50) DEFAULT NULL COMMENT '处理人',
    reject_reason TEXT DEFAULT NULL COMMENT '拒绝原因（可选）',
    ip_address VARCHAR(45) DEFAULT NULL COMMENT '提交IP地址（IPv4或IPv6）',
    
    -- 索引
    UNIQUE KEY uk_username_time (minecraft_username, created_at),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_minecraft_username (minecraft_username),
    
    -- 约束
    CONSTRAINT chk_username_format CHECK (minecraft_username REGEXP '^[a-zA-Z0-9_]{1,16}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限申请表';

-- ============================================
-- 2. 权限账号表（permission_accounts）
-- ============================================
CREATE TABLE IF NOT EXISTS permission_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，自增',
    minecraft_username VARCHAR(16) NOT NULL COMMENT '游戏账号名称（1-16个字符）',
    permission_level VARCHAR(50) NOT NULL DEFAULT 'player' COMMENT '权限等级（如：player, vip, admin等）',
    granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at DATETIME DEFAULT NULL COMMENT '过期时间（NULL表示永久）',
    granted_by VARCHAR(50) DEFAULT NULL COMMENT '授权人',
    last_login DATETIME DEFAULT NULL COMMENT '最后登录时间（可选）',
    notes TEXT DEFAULT NULL COMMENT '备注信息',
    
    -- 索引
    UNIQUE KEY uk_minecraft_username (minecraft_username),
    INDEX idx_permission_level (permission_level),
    INDEX idx_granted_at (granted_at),
    INDEX idx_expires_at (expires_at),
    
    -- 约束
    CONSTRAINT chk_username_format_accounts CHECK (minecraft_username REGEXP '^[a-zA-Z0-9_]{1,16}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限账号表';

-- ============================================
-- 3. 操作日志表（operation_logs）
-- ============================================
CREATE TABLE IF NOT EXISTS operation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，自增',
    operation_type ENUM('apply', 'approve', 'reject', 'add', 'delete', 'update', 'sql') NOT NULL COMMENT '操作类型：apply=提交申请，approve=通过申请，reject=拒绝申请，add=添加权限，delete=删除权限，update=更新权限，sql=SQL指令',
    minecraft_username VARCHAR(16) DEFAULT NULL COMMENT '相关游戏账号名称',
    operator VARCHAR(50) DEFAULT NULL COMMENT '操作人',
    operation_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    details JSON DEFAULT NULL COMMENT '操作详情（JSON格式）',
    ip_address VARCHAR(45) DEFAULT NULL COMMENT '操作IP地址',
    sql_command TEXT DEFAULT NULL COMMENT 'SQL指令（如使用指令操作）',
    
    -- 索引
    INDEX idx_operation_type (operation_type),
    INDEX idx_minecraft_username (minecraft_username),
    INDEX idx_operation_time (operation_time),
    INDEX idx_operator (operator)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- ============================================
-- 4. 初始化数据（可选）
-- ============================================

-- 插入示例权限等级说明（如果需要）
-- 注意：实际权限等级应该根据Minecraft服务器配置来设置

-- ============================================
-- 5. 视图（可选，便于查询）
-- ============================================

-- 申请统计视图
CREATE OR REPLACE VIEW v_request_statistics AS
SELECT 
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM permission_requests
GROUP BY status, DATE(created_at);

-- 权限账号统计视图
CREATE OR REPLACE VIEW v_account_statistics AS
SELECT 
    permission_level,
    COUNT(*) as count,
    COUNT(CASE WHEN expires_at IS NULL OR expires_at > NOW() THEN 1 END) as active_count
FROM permission_accounts
GROUP BY permission_level;

-- ============================================
-- 6. 存储过程（可选）
-- ============================================

-- 检查24小时内是否已提交申请
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_check_recent_request(
    IN p_username VARCHAR(16),
    OUT p_exists INT
)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM permission_requests
    WHERE minecraft_username = p_username
    AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
END //
DELIMITER ;

-- ============================================
-- 7. 触发器（可选）
-- ============================================

-- 当申请状态更新为已通过时，自动添加到权限账号表
DELIMITER //
CREATE TRIGGER IF NOT EXISTS trg_auto_add_account
AFTER UPDATE ON permission_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO permission_accounts (
            minecraft_username,
            permission_level,
            granted_at,
            granted_by
        ) VALUES (
            NEW.minecraft_username,
            'player', -- 默认权限等级，可根据需要修改
            NOW(),
            NEW.processed_by
        )
        ON DUPLICATE KEY UPDATE
            granted_at = NOW(),
            granted_by = NEW.processed_by;
    END IF;
END //
DELIMITER ;

-- ============================================
-- 8. 权限设置（根据实际需要配置）
-- ============================================

-- 创建API用户（用于API服务）
-- CREATE USER IF NOT EXISTS 'api_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT SELECT, INSERT, UPDATE ON permission_center.permission_requests TO 'api_user'@'localhost';
-- GRANT SELECT ON permission_center.permission_accounts TO 'api_user'@'localhost';
-- GRANT INSERT ON permission_center.operation_logs TO 'api_user'@'localhost';

-- 创建管理用户（用于控制中心软件）
-- CREATE USER IF NOT EXISTS 'admin_user'@'%' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON permission_center.* TO 'admin_user'@'%';

-- FLUSH PRIVILEGES;

-- ============================================
-- 数据库设计说明
-- ============================================
-- 1. 字符集使用utf8mb4，支持完整的Unicode字符
-- 2. 使用InnoDB引擎，支持事务和外键
-- 3. 为常用查询字段创建索引，提高查询性能
-- 4. 使用ENUM类型限制状态值，保证数据一致性
-- 5. 使用JSON类型存储操作详情，灵活存储结构化数据
-- 6. 使用触发器自动处理某些业务逻辑
-- 7. 创建视图便于统计查询
-- 8. 创建存储过程封装常用逻辑
-- ============================================

