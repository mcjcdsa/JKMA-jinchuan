/**
 * Electron预加载脚本
 * 在渲染进程中安全地暴露API
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    // 配置相关
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveConfig: (config) => ipcRenderer.invoke('save-config', config),

    // 数据库相关
    connectDatabase: (config) => ipcRenderer.invoke('connect-database', config),
    disconnectDatabase: () => ipcRenderer.invoke('disconnect-database'),
    executeSQL: (sql, params) => ipcRenderer.invoke('execute-sql', sql, params),

    // RCON相关
    connectRCON: (config) => ipcRenderer.invoke('connect-rcon', config),
    disconnectRCON: () => ipcRenderer.invoke('disconnect-rcon'),
    executeMinecraftCommand: (command) => ipcRenderer.invoke('execute-minecraft-command', command),

    // 申请相关
    getRequests: (filters) => ipcRenderer.invoke('get-requests', filters),
    updateRequestStatus: (requestId, status, processedBy, rejectReason) => 
        ipcRenderer.invoke('update-request-status', requestId, status, processedBy, rejectReason),

    // 账号相关
    getAccounts: (filters) => ipcRenderer.invoke('get-accounts', filters),
    addAccount: (accountData) => ipcRenderer.invoke('add-account', accountData),
    deleteAccount: (username, operator) => ipcRenderer.invoke('delete-account', username, operator),

    // 日志相关
    getLogs: (filters) => ipcRenderer.invoke('get-logs', filters)
});

