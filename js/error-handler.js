/**
 * 错误处理模块
 */

/**
 * 初始化全局错误处理
 */
export function initErrorHandling() {
    // JavaScript错误捕获
    window.addEventListener('error', function(e) {
        console.error('JavaScript错误:', e.error);
        showErrorNotification('页面加载时发生错误，请刷新页面重试');
    });
    
    // Promise错误捕获
    window.addEventListener('unhandledrejection', function(e) {
        console.error('未处理的Promise错误:', e.reason);
        showErrorNotification('操作失败，请稍后重试');
    });
    
    // 网络错误检测
    window.addEventListener('online', function() {
        showSuccessNotification('网络连接已恢复');
    });
    
    window.addEventListener('offline', function() {
        showErrorNotification('网络连接已断开，请检查您的网络设置');
    });
}

/**
 * 显示错误通知
 */
function showErrorNotification(message) {
    // 使用Toast系统显示错误
    if (typeof showError === 'function') {
        import('./toast.js').then(module => {
            module.showError(message, 5000);
        });
    } else {
        console.error(message);
    }
}

/**
 * 显示成功通知
 */
function showSuccessNotification(message) {
    if (typeof showSuccess === 'function') {
        import('./toast.js').then(module => {
            module.showSuccess(message, 3000);
        });
    }
}

/**
 * 检查404错误
 */
export function check404() {
    // 如果页面标题包含404或页面不存在，可以显示404页面
    const title = document.title.toLowerCase();
    if (title.includes('404') || title.includes('not found')) {
        redirectTo404();
    }
}

/**
 * 重定向到404页面
 */
function redirectTo404() {
    if (window.location.pathname !== '/404.html') {
        window.location.href = '404.html';
    }
}

