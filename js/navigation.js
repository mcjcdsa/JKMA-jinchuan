/**
 * 导航模块
 * 处理导航栏相关功能
 */

/**
 * 初始化移动端汉堡菜单
 */
export function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navbar || !navContainer) return;

    // 检查是否为移动端
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 创建汉堡菜单按钮
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', '切换菜单');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        
        // 插入到body开头
        document.body.insertBefore(hamburger, document.body.firstChild);

        // 切换菜单显示
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navbar.classList.toggle('mobile-open');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // 点击导航链接后关闭菜单
        const navLinks = navContainer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbar.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // 点击遮罩层关闭菜单
        document.addEventListener('click', function(event) {
            if (navbar.classList.contains('mobile-open') && 
                !navbar.contains(event.target) && 
                !hamburger.contains(event.target)) {
                navbar.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // 窗口大小改变时处理
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    navbar.classList.remove('mobile-open');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }, 250);
        });
    }
}

/**
 * 高亮当前页面的导航链接
 */
export function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 平滑滚动到锚点
 */
export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

