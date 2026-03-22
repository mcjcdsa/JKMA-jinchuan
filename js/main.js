/**
 * 主入口文件
 * 初始化所有通用功能
 */

// 导入polyfill（确保兼容性）
import './polyfill.js';

import { initBackToTop, initLazyImages } from './utils.js';
import { initMobileMenu, highlightActiveNav, initSmoothScroll } from './navigation.js';
import { initBreadcrumb } from './breadcrumb.js';
import { initLoadingEffects } from './loading.js';
import { initAccessibility } from './accessibility.js';
import { initErrorHandling } from './error-handler.js';

/**
 * 初始化所有通用功能
 */
export function init() {
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}

function initAll() {
    // 初始化导航
    initMobileMenu();
    highlightActiveNav();
    initSmoothScroll();
    
    // 初始化面包屑
    initBreadcrumb();
    
    // 初始化通用功能
    initBackToTop();
    initLazyImages();
    
    // 初始化可访问性
    initAccessibility();
    
    // 初始化错误处理
    initErrorHandling();
    
    // 初始化加载效果（仅在首次加载时）
    if (!sessionStorage.getItem('pageLoaded')) {
        initLoadingEffects();
        sessionStorage.setItem('pageLoaded', 'true');
    }
    
}

// 不在此自动执行 init：各页面已通过 import 后显式调用 init()，
// 若此处再 init() 会导致面包屑、导航等初始化逻辑重复执行。

