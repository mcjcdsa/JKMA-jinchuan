/**
 * 金川服务器控制中心 - Electron主进程
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise');
const Rcon = require('rcon');

// 数据库连接配置（存储在用户数据目录）
const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');
const fs = require('fs');

let mainWindow;
let dbConnection = null;
let rconConnection = null;

/**
 * 读取配置文件
 */
function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        }
    } catch (error) {
        console.error('读取配置失败:', error);
    }
    return {
        database: {
            host: '',
            port: 3306,
            user: '',
            password: '',
            database: 'permission_center'
        },
        rcon: {
            host: '',
            port: 25575,
            password: ''
        }
    };
}

/**
 * 保存配置文件
 */
function saveConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('保存配置失败:', error);
        return false;
    }
}

/**
 * 创建主窗口
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        titleBarStyle: 'default',
        show: false
    });

    mainWindow.loadFile('index.html');

    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 开发模式下打开开发者工具
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

/**
 * 连接数据库
 */
async function connectDatabase(config) {
    try {
        if (dbConnection) {
            await dbConnection.end();
        }

        dbConnection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
            charset: 'utf8mb4'
        });

        // 测试连接
        await dbConnection.ping();
        return { success: true, message: '数据库连接成功' };
    } catch (error) {
        console.error('数据库连接失败:', error);
        return { success: false, message: `数据库连接失败: ${error.message}` };
    }
}

/**
 * 断开数据库连接
 */
async function disconnectDatabase() {
    if (dbConnection) {
        await dbConnection.end();
        dbConnection = null;
    }
}

/**
 * 连接RCON
 */
function connectRCON(config) {
    return new Promise((resolve, reject) => {
        try {
            if (rconConnection) {
                rconConnection.disconnect();
            }

            rconConnection = new Rcon(config.host, config.port, config.password);

            rconConnection.on('auth', () => {
                resolve({ success: true, message: 'RCON连接成功' });
            });

            rconConnection.on('error', (error) => {
                reject({ success: false, message: `RCON连接失败: ${error.message}` });
            });

            rconConnection.connect();
        } catch (error) {
            reject({ success: false, message: `RCON连接失败: ${error.message}` });
        }
    });
}

/**
 * 断开RCON连接
 */
function disconnectRCON() {
    if (rconConnection) {
        rconConnection.disconnect();
        rconConnection = null;
    }
}

/**
 * 执行Minecraft命令
 */
function executeMinecraftCommand(command) {
    return new Promise((resolve, reject) => {
        if (!rconConnection) {
            reject({ success: false, message: 'RCON未连接' });
            return;
        }

        rconConnection.send(command, (response) => {
            resolve({ success: true, data: response });
        });
    });
}

/**
 * 执行SQL查询
 */
async function executeSQL(sql, params = []) {
    if (!dbConnection) {
        throw new Error('数据库未连接');
    }

    try {
        const [rows] = await dbConnection.execute(sql, params);
        return { success: true, data: rows, affectedRows: rows.affectedRows || 0 };
    } catch (error) {
        throw new Error(`SQL执行失败: ${error.message}`);
    }
}

// IPC通信处理

// 读取配置
ipcMain.handle('get-config', () => {
    return loadConfig();
});

// 保存配置
ipcMain.handle('save-config', (event, config) => {
    return saveConfig(config);
});

// 连接数据库
ipcMain.handle('connect-database', async (event, config) => {
    const result = await connectDatabase(config);
    if (result.success) {
        // 保存数据库配置
        const currentConfig = loadConfig();
        currentConfig.database = config;
        saveConfig(currentConfig);
    }
    return result;
});

// 断开数据库连接
ipcMain.handle('disconnect-database', async () => {
    await disconnectDatabase();
    return { success: true };
});

// 连接RCON
ipcMain.handle('connect-rcon', async (event, config) => {
    try {
        const result = await connectRCON(config);
        if (result.success) {
            // 保存RCON配置
            const currentConfig = loadConfig();
            currentConfig.rcon = config;
            saveConfig(currentConfig);
        }
        return result;
    } catch (error) {
        return error;
    }
});

// 断开RCON连接
ipcMain.handle('disconnect-rcon', () => {
    disconnectRCON();
    return { success: true };
});

// 执行Minecraft命令
ipcMain.handle('execute-minecraft-command', async (event, command) => {
    try {
        return await executeMinecraftCommand(command);
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 执行SQL查询
ipcMain.handle('execute-sql', async (event, sql, params) => {
    try {
        return await executeSQL(sql, params);
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 查询申请列表
ipcMain.handle('get-requests', async (event, filters = {}) => {
    try {
        let sql = 'SELECT * FROM permission_requests WHERE 1=1';
        const params = [];

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.username) {
            sql += ' AND minecraft_username LIKE ?';
            params.push(`%${filters.username}%`);
        }

        sql += ' ORDER BY created_at DESC';

        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(filters.limit);
        }

        return await executeSQL(sql, params);
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 更新申请状态
ipcMain.handle('update-request-status', async (event, requestId, status, processedBy, rejectReason = null) => {
    try {
        if (!dbConnection) {
            return { success: false, message: '数据库未连接' };
        }
        
        // 先获取用户名
        const [requestRows] = await dbConnection.execute('SELECT minecraft_username FROM permission_requests WHERE id = ?', [requestId]);
        const username = requestRows[0]?.minecraft_username || 'unknown';
        
        const sql = `UPDATE permission_requests 
                     SET status = ?, processed_at = NOW(), processed_by = ?, reject_reason = ? 
                     WHERE id = ?`;
        const params = [status, processedBy, rejectReason, requestId];
        
        const result = await executeSQL(sql, params);
        
        // 记录操作日志
        if (result.success) {
            const logSql = `INSERT INTO operation_logs 
                           (operation_type, minecraft_username, operator, details, ip_address) 
                           VALUES (?, ?, ?, ?, ?)`;
            
            await executeSQL(logSql, [
                status === 'approved' ? 'approve' : 'reject',
                username,
                processedBy,
                JSON.stringify({ request_id: requestId, reject_reason: rejectReason }),
                'localhost'
            ]);
        }
        
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 查询权限账号列表
ipcMain.handle('get-accounts', async (event, filters = {}) => {
    try {
        let sql = 'SELECT * FROM permission_accounts WHERE 1=1';
        const params = [];

        if (filters.username) {
            sql += ' AND minecraft_username LIKE ?';
            params.push(`%${filters.username}%`);
        }

        if (filters.permission_level) {
            sql += ' AND permission_level = ?';
            params.push(filters.permission_level);
        }

        sql += ' ORDER BY granted_at DESC';

        return await executeSQL(sql, params);
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 添加权限账号
ipcMain.handle('add-account', async (event, accountData) => {
    try {
        const sql = `INSERT INTO permission_accounts 
                     (minecraft_username, permission_level, granted_at, expires_at, granted_by, notes) 
                     VALUES (?, ?, NOW(), ?, ?, ?)`;
        const params = [
            accountData.username,
            accountData.permission_level,
            accountData.expires_at || null,
            accountData.granted_by,
            accountData.notes || null
        ];

        const result = await executeSQL(sql, params);
        
        // 记录操作日志
        if (result.success) {
            const logSql = `INSERT INTO operation_logs 
                           (operation_type, minecraft_username, operator, details, ip_address) 
                           VALUES (?, ?, ?, ?, ?)`;
            await executeSQL(logSql, [
                'add',
                accountData.username,
                accountData.granted_by,
                JSON.stringify(accountData),
                'localhost'
            ]);
        }

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 删除权限账号
ipcMain.handle('delete-account', async (event, username, operator) => {
    try {
        const sql = 'DELETE FROM permission_accounts WHERE minecraft_username = ?';
        const result = await executeSQL(sql, [username]);
        
        // 记录操作日志
        if (result.success) {
            const logSql = `INSERT INTO operation_logs 
                           (operation_type, minecraft_username, operator, details, ip_address) 
                           VALUES (?, ?, ?, ?, ?)`;
            await executeSQL(logSql, [
                'delete',
                username,
                operator,
                JSON.stringify({ username }),
                'localhost'
            ]);
        }

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 查询操作日志
ipcMain.handle('get-logs', async (event, filters = {}) => {
    try {
        let sql = 'SELECT * FROM operation_logs WHERE 1=1';
        const params = [];

        if (filters.operation_type) {
            sql += ' AND operation_type = ?';
            params.push(filters.operation_type);
        }

        if (filters.username) {
            sql += ' AND minecraft_username LIKE ?';
            params.push(`%${filters.username}%`);
        }

        sql += ' ORDER BY operation_time DESC LIMIT 500';

        return await executeSQL(sql, params);
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// 应用启动
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 所有窗口关闭时退出（macOS除外）
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        disconnectDatabase();
        disconnectRCON();
        app.quit();
    }
});

// 应用退出前清理
app.on('before-quit', () => {
    disconnectDatabase();
    disconnectRCON();
});

