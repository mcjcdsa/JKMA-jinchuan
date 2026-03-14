/**
 * 页面加载体验优化模块
 */

/**
 * 显示页面加载动画
 */
export function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">加载中...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

/**
 * 隐藏页面加载动画
 */
export function hideLoadingAnimation() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

/**
 * 显示加载进度条
 */
export function showProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    document.body.appendChild(progressBar);
    
    // 模拟加载进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => progressBar.remove(), 300);
            }, 200);
        }
        updateProgress(progress);
    }, 100);
}

/**
 * 更新进度条
 */
function updateProgress(percent) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = percent + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(percent));
    }
}

/**
 * 初始化页面加载效果
 */
export function initLoadingEffects() {
    // 显示加载动画
    showLoadingAnimation();
    
    // 显示进度条
    showProgressBar();
    
    // 页面加载完成后隐藏
    if (document.readyState === 'complete') {
        setTimeout(() => {
            hideLoadingAnimation();
        }, 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                hideLoadingAnimation();
            }, 500);
        });
    }
}

/**
 * 创建骨架屏
 * @param {HTMLElement} container - 容器元素
 */
export function createSkeleton(container) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.innerHTML = `
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
        </div>
    `;
    container.appendChild(skeleton);
    return skeleton;
}

