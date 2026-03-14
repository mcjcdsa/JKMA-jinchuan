/**
 * 权限中心API服务 - Node.js + Express版本
 * 
 * 部署说明：
 * 1. 安装依赖：npm install express mysql2 cors dotenv
 * 2. 配置.env文件（参考.env.example）
 * 3. 启动服务：node server.js
 * 4. 使用PM2管理：pm2 start server.js --name permission-api
 */

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.API_PORT || 3000;

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS配置
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'https://mcjcdsa.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: false
};
app.use(cors(corsOptions));

// 数据库连接池配置
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'api_user',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'permission_center',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// 验证Minecraft用户名格式
function validateMinecraftUsername(username) {
    if (!username) return false;
    const pattern = /^[a-zA-Z0-9_]{1,16}$/;
    return pattern.test(username);
}

// 验证QQ号格式（可选）
function validateQQNumber(qq) {
    if (!qq) return true; // QQ号为可选
    const pattern = /^\d{5,15}$/;
    return pattern.test(qq);
}

// 检查24小时内是否已提交申请
async function checkRecentRequest(username) {
    try {
        const [rows] = await pool.execute(
            `SELECT COUNT(*) as count FROM permission_requests 
             WHERE minecraft_username = ? 
             AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
            [username]
        );
        return rows[0].count > 0;
    } catch (error) {
        console.error('检查重复申请失败:', error);
        throw error;
    }
}

// 记录操作日志
async function logOperation(operationType, username, operator, details, ipAddress, sqlCommand = null) {
    try {
        await pool.execute(
            `INSERT INTO operation_logs 
             (operation_type, minecraft_username, operator, details, ip_address, sql_command) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [operationType, username, operator, JSON.stringify(details), ipAddress, sqlCommand]
        );
    } catch (error) {
        console.error('记录操作日志失败:', error);
        // 日志记录失败不影响主流程
    }
}

// 获取客户端IP地址
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           'unknown';
}

/**
 * POST /api/permission/apply
 * 提交权限申请
 */
app.post('/api/permission/apply', async (req, res) => {
    const clientIP = getClientIP(req);
    
    try {
        const { minecraft_username, qq_number, reason, captcha } = req.body;
        
        // 验证必填字段
        if (!minecraft_username) {
            return res.status(400).json({
                success: false,
                message: '游戏账号名称不能为空',
                error_code: 'INVALID_USERNAME'
            });
        }
        
        if (!captcha) {
            return res.status(400).json({
                success: false,
                message: '验证码不能为空',
                error_code: 'INVALID_CAPTCHA'
            });
        }
        
        // 验证用户名格式
        if (!validateMinecraftUsername(minecraft_username)) {
            return res.status(400).json({
                success: false,
                message: '游戏账号名称格式不正确（1-16个字符，仅支持字母、数字、下划线）',
                error_code: 'INVALID_USERNAME'
            });
        }
        
        // 验证QQ号格式（如果提供）
        if (qq_number && !validateQQNumber(qq_number)) {
            return res.status(400).json({
                success: false,
                message: 'QQ号格式不正确（5-15位数字）',
                error_code: 'INVALID_QQ'
            });
        }
        
        // 检查24小时内是否已提交
        const hasRecentRequest = await checkRecentRequest(minecraft_username);
        if (hasRecentRequest) {
            return res.status(400).json({
                success: false,
                message: '24小时内已提交过申请，请稍后再试',
                error_code: 'DUPLICATE_REQUEST'
            });
        }
        
        // 插入申请记录
        const [result] = await pool.execute(
            `INSERT INTO permission_requests 
             (minecraft_username, qq_number, reason, status, ip_address) 
             VALUES (?, ?, ?, 'pending', ?)`,
            [minecraft_username, qq_number || null, reason || null, clientIP]
        );
        
        const requestId = `REQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${result.insertId.toString().padStart(3, '0')}`;
        
        // 记录操作日志
        await logOperation('apply', minecraft_username, 'system', {
            qq_number: qq_number || null,
            reason: reason || null
        }, clientIP);
        
        res.json({
            success: true,
            message: '申请提交成功',
            request_id: requestId,
            data: {
                id: result.insertId,
                status: 'pending'
            }
        });
        
    } catch (error) {
        console.error('提交申请失败:', error);
        
        // 记录错误日志
        await logOperation('apply', req.body.minecraft_username || 'unknown', 'system', {
            error: error.message
        }, clientIP);
        
        res.status(500).json({
            success: false,
            message: '服务器错误，请稍后重试',
            error_code: 'SERVER_ERROR'
        });
    }
});

/**
 * GET /api/permission/status
 * 查询申请状态
 */
app.get('/api/permission/status', async (req, res) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                message: '请提供游戏账号名称',
                error_code: 'MISSING_USERNAME'
            });
        }
        
        // 验证用户名格式
        if (!validateMinecraftUsername(username)) {
            return res.status(400).json({
                success: false,
                message: '游戏账号名称格式不正确',
                error_code: 'INVALID_USERNAME'
            });
        }
        
        // 查询最新的申请记录
        const [rows] = await pool.execute(
            `SELECT id, minecraft_username, qq_number, reason, status, 
                    created_at, processed_at, reject_reason 
             FROM permission_requests 
             WHERE minecraft_username = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '未找到申请记录',
                error_code: 'NOT_FOUND'
            });
        }
        
        const request = rows[0];
        
        // 格式化日期时间
        const formatDateTime = (dt) => {
            if (!dt) return null;
            return new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
        };
        
        res.json({
            success: true,
            data: {
                id: request.id,
                minecraft_username: request.minecraft_username,
                status: request.status,
                created_at: formatDateTime(request.created_at),
                processed_at: formatDateTime(request.processed_at),
                reject_reason: request.reject_reason,
                qq_number: request.qq_number
            }
        });
        
    } catch (error) {
        console.error('查询状态失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误，请稍后重试',
            error_code: 'SERVER_ERROR'
        });
    }
});

/**
 * 健康检查接口
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('未处理的错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error_code: 'INTERNAL_ERROR'
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        error_code: 'NOT_FOUND'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`权限中心API服务已启动`);
    console.log(`监听端口: ${PORT}`);
    console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
    console.log('收到SIGTERM信号，正在关闭服务器...');
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('收到SIGINT信号，正在关闭服务器...');
    await pool.end();
    process.exit(0);
});

