/**
 * 金川服务器控制中心 - 渲染进程脚本
 */

// 全局状态
let currentConfig = null;
let currentRequestId = null;
let autoRefreshInterval = null;

// 检查是否在Electron环境中
function checkElectronEnvironment() {
    if (typeof window.electronAPI === 'undefined') {
        // 不在Electron环境中，显示提示
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; font-family: 'Microsoft YaHei', sans-serif; background: #f5f5f5;">
                <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
                    <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ 运行环境错误</h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        此应用需要在Electron环境中运行，不能直接在浏览器中打开。
                    </p>
                    <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; text-align: left;">
                        <h3 style="color: #1e40af; margin-top: 0;">正确的运行方式：</h3>
                        <ol style="color: #666; line-height: 2;">
                            <li>打开终端（命令提示符或PowerShell）</li>
                            <li>进入项目目录：<code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">cd F:\\jchtmlcss\\control-center</code></li>
                            <li>安装依赖：<code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">npm install</code></li>
                            <li>运行应用：<code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">npm start</code></li>
                        </ol>
                    </div>
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; text-align: left;">
                        <p style="margin: 0; color: #92400e;">
                            <strong>注意：</strong>如果还没有安装Node.js，请先访问 
                            <a href="https://nodejs.org" target="_blank" style="color: #3b82f6;">nodejs.org</a> 
                            下载安装。
                        </p>
                    </div>
                </div>
            </div>
        `;
        return false;
    }
    return true;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if (checkElectronEnvironment()) {
        init();
    }
});

/**
 * 初始化应用
 */
async function init() {
    // 加载配置
    await loadConfig();
    
    // 初始化标签页切换
    initTabs();
    
    // 初始化数据库连接表单
    initDatabaseForm();
    
    // 初始化RCON连接表单
    initRCONForm();
    
    // 初始化申请列表
    initRequestsTab();
    
    // 初始化账号管理
    initAccountsTab();
    
    // 初始化SQL指令
    initSQLTab();
    
    // 初始化日志
    initLogsTab();
    
    // 初始化模态框
    initModals();
}

/**
 * 加载配置
 */
async function loadConfig() {
    try {
        currentConfig = await window.electronAPI.getConfig();
        
        // 填充数据库配置表单
        if (currentConfig.database) {
            document.getElementById('db-host').value = currentConfig.database.host || '';
            document.getElementById('db-port').value = currentConfig.database.port || 3306;
            document.getElementById('db-user').value = currentConfig.database.user || '';
            document.getElementById('db-password').value = currentConfig.database.password || '';
            document.getElementById('db-database').value = currentConfig.database.database || 'permission_center';
        }
        
        // 填充RCON配置表单
        if (currentConfig.rcon) {
            document.getElementById('rcon-host').value = currentConfig.rcon.host || '';
            document.getElementById('rcon-port').value = currentConfig.rcon.port || 25575;
            document.getElementById('rcon-password').value = currentConfig.rcon.password || '';
        }
    } catch (error) {
        showToast('加载配置失败: ' + error.message, 'error');
    }
}

/**
 * 初始化标签页切换
 */
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.getAttribute('data-tab');
            
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // 激活选中的标签页
            item.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // 根据标签页加载数据
            if (tabName === 'requests') {
                loadRequests();
            } else if (tabName === 'accounts') {
                loadAccounts();
            } else if (tabName === 'logs') {
                loadLogs();
            }
        });
    });
}

/**
 * 初始化数据库连接表单
 */
function initDatabaseForm() {
    const form = document.getElementById('db-config-form');
    const disconnectBtn = document.getElementById('disconnect-db-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const config = {
            host: document.getElementById('db-host').value,
            port: parseInt(document.getElementById('db-port').value),
            user: document.getElementById('db-user').value,
            password: document.getElementById('db-password').value,
            database: document.getElementById('db-database').value
        };
        
        try {
            const result = await window.electronAPI.connectDatabase(config);
            if (result.success) {
                updateDBStatus(true);
                showToast('数据库连接成功', 'success');
                // 自动加载申请列表
                if (document.getElementById('requests-tab').classList.contains('active')) {
                    loadRequests();
                }
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('连接失败: ' + error.message, 'error');
        }
    });
    
    disconnectBtn.addEventListener('click', async () => {
        try {
            await window.electronAPI.disconnectDatabase();
            updateDBStatus(false);
            showToast('已断开数据库连接', 'info');
        } catch (error) {
            showToast('断开连接失败: ' + error.message, 'error');
        }
    });
}

/**
 * 初始化RCON连接表单
 */
function initRCONForm() {
    const form = document.getElementById('rcon-config-form');
    const disconnectBtn = document.getElementById('disconnect-rcon-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const config = {
            host: document.getElementById('rcon-host').value,
            port: parseInt(document.getElementById('rcon-port').value),
            password: document.getElementById('rcon-password').value
        };
        
        try {
            const result = await window.electronAPI.connectRCON(config);
            if (result.success) {
                updateRCONStatus(true);
                showToast('RCON连接成功', 'success');
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('连接失败: ' + error.message, 'error');
        }
    });
    
    disconnectBtn.addEventListener('click', async () => {
        try {
            await window.electronAPI.disconnectRCON();
            updateRCONStatus(false);
            showToast('已断开RCON连接', 'info');
        } catch (error) {
            showToast('断开连接失败: ' + error.message, 'error');
        }
    });
}

/**
 * 更新数据库连接状态
 */
function updateDBStatus(connected) {
    const statusBadge = document.getElementById('db-status');
    if (connected) {
        statusBadge.textContent = '已连接';
        statusBadge.className = 'status-badge connected';
    } else {
        statusBadge.textContent = '未连接';
        statusBadge.className = 'status-badge disconnected';
    }
}

/**
 * 更新RCON连接状态
 */
function updateRCONStatus(connected) {
    const statusBadge = document.getElementById('rcon-status');
    if (connected) {
        statusBadge.textContent = '已连接';
        statusBadge.className = 'status-badge connected';
    } else {
        statusBadge.textContent = '未连接';
        statusBadge.className = 'status-badge disconnected';
    }
}

/**
 * 初始化申请列表标签页
 */
function initRequestsTab() {
    // 刷新按钮
    document.getElementById('refresh-requests-btn').addEventListener('click', loadRequests);
    
    // 筛选器
    document.getElementById('request-status-filter').addEventListener('change', loadRequests);
    document.getElementById('request-username-filter').addEventListener('input', debounce(loadRequests, 500));
}

/**
 * 加载申请列表
 */
async function loadRequests() {
    const tbody = document.getElementById('requests-tbody');
    tbody.innerHTML = '<tr><td colspan="8" class="empty-message">加载中...</td></tr>';
    
    try {
        const filters = {
            status: document.getElementById('request-status-filter').value || undefined,
            username: document.getElementById('request-username-filter').value || undefined
        };
        
        const result = await window.electronAPI.getRequests(filters);
        
        if (!result.success) {
            tbody.innerHTML = `<tr><td colspan="8" class="empty-message">${result.message}</td></tr>`;
            return;
        }
        
        if (result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-message">暂无申请记录</td></tr>';
            return;
        }
        
        tbody.innerHTML = result.data.map(request => {
            const statusMap = {
                'pending': { text: '待审核', class: 'pending' },
                'approved': { text: '已通过', class: 'approved' },
                'rejected': { text: '已拒绝', class: 'rejected' },
                'processed': { text: '已处理', class: 'processed' }
            };
            const status = statusMap[request.status] || { text: request.status, class: 'pending' };
            
            return `
                <tr>
                    <td>${request.id}</td>
                    <td>${escapeHtml(request.minecraft_username)}</td>
                    <td>${request.qq_number || '-'}</td>
                    <td>${escapeHtml(request.reason || '-')}</td>
                    <td><span class="status-tag ${status.class}">${status.text}</span></td>
                    <td>${formatDateTime(request.created_at)}</td>
                    <td>${request.processed_at ? formatDateTime(request.processed_at) : '-'}</td>
                    <td>
                        ${request.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="reviewRequest(${request.id}, 'approve')">通过</button>
                            <button class="btn btn-sm btn-danger" onclick="reviewRequest(${request.id}, 'reject')">拒绝</button>
                        ` : '-'}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-message">加载失败: ${error.message}</td></tr>`;
    }
}

/**
 * 审核申请
 */
async function reviewRequest(requestId, action) {
    currentRequestId = requestId;
    
    // 获取申请详情
    try {
        const result = await window.electronAPI.executeSQL(
            'SELECT * FROM permission_requests WHERE id = ?',
            [requestId]
        );
        
        if (!result.success || result.data.length === 0) {
            showToast('获取申请详情失败', 'error');
            return;
        }
        
        const request = result.data[0];
        
        // 显示审核模态框
        document.getElementById('review-modal-title').textContent = 
            action === 'approve' ? '通过申请' : '拒绝申请';
        
        document.getElementById('review-request-info').innerHTML = `
            <div style="margin-bottom: 15px;">
                <strong>游戏账号:</strong> ${escapeHtml(request.minecraft_username)}<br>
                <strong>QQ号:</strong> ${request.qq_number || '-'}<br>
                <strong>申请理由:</strong> ${escapeHtml(request.reason || '-')}<br>
                <strong>申请时间:</strong> ${formatDateTime(request.created_at)}
            </div>
        `;
        
        const rejectSection = document.getElementById('reject-reason-section');
        if (action === 'reject') {
            rejectSection.style.display = 'block';
            document.getElementById('reject-reason-input').value = '';
        } else {
            rejectSection.style.display = 'none';
        }
        
        // 设置按钮事件
        const approveBtn = document.getElementById('approve-btn');
        const rejectBtn = document.getElementById('reject-btn');
        
        approveBtn.onclick = null;
        rejectBtn.onclick = null;
        
        if (action === 'approve') {
            approveBtn.style.display = 'inline-flex';
            rejectBtn.style.display = 'none';
            approveBtn.onclick = () => submitReview('approved', '');
        } else {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'inline-flex';
            rejectBtn.onclick = () => {
                const reason = document.getElementById('reject-reason-input').value.trim();
                if (!reason) {
                    showToast('请输入拒绝原因', 'error');
                    return;
                }
                submitReview('rejected', reason);
            };
        }
        
        showModal('review-modal');
    } catch (error) {
        showToast('获取申请详情失败: ' + error.message, 'error');
    }
}

/**
 * 提交审核
 */
async function submitReview(status, rejectReason) {
    try {
        const result = await window.electronAPI.updateRequestStatus(
            currentRequestId,
            status,
            'admin', // 这里应该从用户输入获取
            rejectReason || null
        );
        
        if (result.success) {
            showToast(status === 'approved' ? '申请已通过' : '申请已拒绝', 'success');
            hideModal('review-modal');
            
            // 如果已连接RCON，执行Minecraft命令
            if (status === 'approved') {
                // 获取用户名
                const requestResult = await window.electronAPI.executeSQL(
                    'SELECT minecraft_username FROM permission_requests WHERE id = ?',
                    [currentRequestId]
                );
                
                if (requestResult.success && requestResult.data.length > 0) {
                    const username = requestResult.data[0].minecraft_username;
                    // 执行权限添加命令（需要根据实际权限插件调整）
                    try {
                        await window.electronAPI.executeMinecraftCommand(
                            `/lp user ${username} parent set player`
                        );
                    } catch (error) {
                        console.error('执行Minecraft命令失败:', error);
                    }
                }
            }
            
            // 刷新列表
            loadRequests();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('提交审核失败: ' + error.message, 'error');
    }
}

/**
 * 初始化账号管理标签页
 */
function initAccountsTab() {
    document.getElementById('add-account-btn').addEventListener('click', () => {
        document.getElementById('add-account-form').reset();
        showModal('add-account-modal');
    });
    
    document.getElementById('refresh-accounts-btn').addEventListener('click', loadAccounts);
    
    document.getElementById('save-account-btn').addEventListener('click', saveAccount);
    
    document.getElementById('account-level-filter').addEventListener('change', loadAccounts);
    document.getElementById('account-username-filter').addEventListener('input', debounce(loadAccounts, 500));
}

/**
 * 加载账号列表
 */
async function loadAccounts() {
    const tbody = document.getElementById('accounts-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="empty-message">加载中...</td></tr>';
    
    try {
        const filters = {
            permission_level: document.getElementById('account-level-filter').value || undefined,
            username: document.getElementById('account-username-filter').value || undefined
        };
        
        const result = await window.electronAPI.getAccounts(filters);
        
        if (!result.success) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-message">${result.message}</td></tr>`;
            return;
        }
        
        if (result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-message">暂无账号记录</td></tr>';
            return;
        }
        
        tbody.innerHTML = result.data.map(account => {
            return `
                <tr>
                    <td>${escapeHtml(account.minecraft_username)}</td>
                    <td>${escapeHtml(account.permission_level)}</td>
                    <td>${formatDateTime(account.granted_at)}</td>
                    <td>${account.expires_at ? formatDateTime(account.expires_at) : '永久'}</td>
                    <td>${account.granted_by || '-'}</td>
                    <td>${escapeHtml(account.notes || '-')}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteAccount('${escapeHtml(account.minecraft_username)}')">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-message">加载失败: ${error.message}</td></tr>`;
    }
}

/**
 * 保存账号
 */
async function saveAccount() {
    const username = document.getElementById('add-username').value.trim();
    const permissionLevel = document.getElementById('add-permission-level').value;
    const expiresAt = document.getElementById('add-expires-at').value;
    const notes = document.getElementById('add-notes').value.trim();
    
    if (!username) {
        showToast('请输入游戏账号名称', 'error');
        return;
    }
    
    try {
        const accountData = {
            username: username,
            permission_level: permissionLevel,
            expires_at: expiresAt ? new Date(expiresAt).toISOString().slice(0, 19).replace('T', ' ') : null,
            granted_by: 'admin', // 这里应该从用户输入获取
            notes: notes || null
        };
        
        const result = await window.electronAPI.addAccount(accountData);
        
        if (result.success) {
            showToast('账号添加成功', 'success');
            hideModal('add-account-modal');
            
            // 如果已连接RCON，执行Minecraft命令
            try {
                await window.electronAPI.executeMinecraftCommand(
                    `/lp user ${username} parent set ${permissionLevel}`
                );
            } catch (error) {
                console.error('执行Minecraft命令失败:', error);
            }
            
            loadAccounts();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('添加账号失败: ' + error.message, 'error');
    }
}

/**
 * 删除账号
 */
async function deleteAccount(username) {
    if (!confirm(`确定要删除账号 "${username}" 吗？`)) {
        return;
    }
    
    try {
        const result = await window.electronAPI.deleteAccount(username, 'admin');
        
        if (result.success) {
            showToast('账号删除成功', 'success');
            
            // 如果已连接RCON，执行Minecraft命令
            try {
                await window.electronAPI.executeMinecraftCommand(
                    `/lp user ${username} parent clear`
                );
            } catch (error) {
                console.error('执行Minecraft命令失败:', error);
            }
            
            loadAccounts();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('删除账号失败: ' + error.message, 'error');
    }
}

/**
 * 初始化SQL指令标签页
 */
function initSQLTab() {
    document.getElementById('execute-sql-btn').addEventListener('click', executeSQL);
    document.getElementById('clear-sql-btn').addEventListener('click', () => {
        document.getElementById('sql-input').value = '';
        document.getElementById('sql-result').textContent = '';
    });
}

/**
 * 执行SQL指令
 */
async function executeSQL() {
    const sql = document.getElementById('sql-input').value.trim();
    const resultDiv = document.getElementById('sql-result');
    
    if (!sql) {
        showToast('请输入SQL指令', 'error');
        return;
    }
    
    // 检查危险指令
    const dangerousKeywords = ['DROP', 'TRUNCATE', 'ALTER TABLE DROP'];
    const upperSQL = sql.toUpperCase();
    
    for (const keyword of dangerousKeywords) {
        if (upperSQL.includes(keyword)) {
            resultDiv.className = 'sql-result error';
            resultDiv.textContent = `错误: 禁止执行危险SQL指令 (${keyword})`;
            return;
        }
    }
    
    resultDiv.textContent = '执行中...';
    resultDiv.className = 'sql-result';
    
    try {
        const result = await window.electronAPI.executeSQL(sql);
        
        if (result.success) {
            resultDiv.className = 'sql-result success';
            if (Array.isArray(result.data)) {
                if (result.data.length === 0) {
                    resultDiv.textContent = '查询结果为空';
                } else {
                    resultDiv.textContent = JSON.stringify(result.data, null, 2);
                }
            } else {
                resultDiv.textContent = `执行成功，影响行数: ${result.affectedRows || 0}`;
            }
        } else {
            resultDiv.className = 'sql-result error';
            resultDiv.textContent = result.message;
        }
    } catch (error) {
        resultDiv.className = 'sql-result error';
        resultDiv.textContent = '执行失败: ' + error.message;
    }
}

/**
 * 初始化日志标签页
 */
function initLogsTab() {
    document.getElementById('refresh-logs-btn').addEventListener('click', loadLogs);
    document.getElementById('log-type-filter').addEventListener('change', loadLogs);
    document.getElementById('log-username-filter').addEventListener('input', debounce(loadLogs, 500));
}

/**
 * 加载日志列表
 */
async function loadLogs() {
    const tbody = document.getElementById('logs-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">加载中...</td></tr>';
    
    try {
        const filters = {
            operation_type: document.getElementById('log-type-filter').value || undefined,
            username: document.getElementById('log-username-filter').value || undefined
        };
        
        const result = await window.electronAPI.getLogs(filters);
        
        if (!result.success) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-message">${result.message}</td></tr>`;
            return;
        }
        
        if (result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-message">暂无日志记录</td></tr>';
            return;
        }
        
        tbody.innerHTML = result.data.map(log => {
            let details = '-';
            try {
                if (log.details) {
                    const parsed = JSON.parse(log.details);
                    details = JSON.stringify(parsed, null, 2);
                }
            } catch (e) {
                details = log.details || '-';
            }
            
            return `
                <tr>
                    <td>${formatDateTime(log.operation_time)}</td>
                    <td>${escapeHtml(log.operation_type)}</td>
                    <td>${escapeHtml(log.minecraft_username || '-')}</td>
                    <td>${escapeHtml(log.operator || '-')}</td>
                    <td><pre style="margin:0;font-size:11px;max-width:300px;overflow:auto;">${escapeHtml(details)}</pre></td>
                    <td>${escapeHtml(log.ip_address || '-')}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-message">加载失败: ${error.message}</td></tr>`;
    }
}

/**
 * 初始化模态框
 */
function initModals() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            hideModal(modalId);
        });
    });
    
    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
}

/**
 * 显示模态框
 */
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

/**
 * 隐藏模态框
 */
function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

/**
 * 显示消息提示
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * 转义HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateTime) {
    if (!dateTime) return '-';
    try {
        const date = new Date(dateTime);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateTime;
    }
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

