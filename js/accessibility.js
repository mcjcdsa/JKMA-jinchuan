/**
 * 可访问性（A11y）改进模块
 */

/**
 * 初始化键盘导航支持
 */
export function initKeyboardNavigation() {
    // 为所有可交互元素添加键盘支持
    document.addEventListener('keydown', function(e) {
        // ESC键关闭菜单
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.nav-container.mobile-open');
            if (mobileMenu) {
                mobileMenu.classList.remove('mobile-open');
                const hamburger = document.querySelector('.hamburger-menu');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        }
        
        // Tab键导航时显示焦点
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // 鼠标点击时移除键盘导航样式
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * 添加ARIA标签到导航
 */
export function enhanceNavigationAria() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        if (link.classList.contains('active')) {
            link.setAttribute('aria-current', 'page');
        }
        link.setAttribute('role', 'menuitem');
    });
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.setAttribute('role', 'navigation');
        navbar.setAttribute('aria-label', '主导航');
    }
}

/**
 * 添加ARIA标签到按钮
 */
export function enhanceButtonAria() {
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
        if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
            // 为没有文本的按钮添加aria-label
            if (button.classList.contains('back-to-top')) {
                button.setAttribute('aria-label', '返回顶部');
            } else if (button.classList.contains('hamburger-menu')) {
                button.setAttribute('aria-label', '切换菜单');
            }
        }
    });
}

/**
 * 添加跳过链接（Skip Link）
 */
export function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = '跳转到主要内容';
    skipLink.setAttribute('aria-label', '跳转到主要内容');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // 确保有main-content ID
    const mainContent = document.querySelector('.section, main, .container');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
    }
}

/**
 * 初始化所有可访问性功能
 */
export function initAccessibility() {
    initKeyboardNavigation();
    enhanceNavigationAria();
    enhanceButtonAria();
    addSkipLink();
}

