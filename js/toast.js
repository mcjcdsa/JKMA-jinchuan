/**
 * Toast通知系统
 */

let toastContainer = null;

/**
 * 创建Toast容器
 */
function createToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * 显示Toast通知
 * @param {string} message - 消息内容
 * @param {string} type - 类型：'success', 'error', 'info', 'warning'
 * @param {number} duration - 显示时长（毫秒）
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="关闭通知" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // 触发动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动关闭
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    // 点击关闭
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        removeToast(toast);
    });
}

/**
 * 获取Toast图标
 */
function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

/**
 * 移除Toast
 */
function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

/**
 * 成功提示
 */
export function showSuccess(message, duration) {
    showToast(message, 'success', duration);
}

/**
 * 错误提示
 */
export function showError(message, duration) {
    showToast(message, 'error', duration);
}

/**
 * 警告提示
 */
export function showWarning(message, duration) {
    showToast(message, 'warning', duration);
}

/**
 * 信息提示
 */
export function showInfo(message, duration) {
    showToast(message, 'info', duration);
}

