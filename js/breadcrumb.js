/**
 * 面包屑导航模块
 */

/**
 * 生成面包屑导航
 * @param {Array} items - 面包屑项数组 [{text: '文本', url: '链接'}]
 */
export function generateBreadcrumb(items) {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', '面包屑导航');
    
    const list = document.createElement('ol');
    list.className = 'breadcrumb-list';
    
    items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'breadcrumb-item';
        
        if (index === items.length - 1) {
            // 最后一项（当前页）
            listItem.setAttribute('aria-current', 'page');
            const span = document.createElement('span');
            span.className = 'breadcrumb-current';
            span.textContent = item.text;
            listItem.appendChild(span);
        } else {
            // 链接项
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.text;
            link.className = 'breadcrumb-link';
            listItem.appendChild(link);
        }
        
        list.appendChild(listItem);
    });
    
    breadcrumb.appendChild(list);
    return breadcrumb;
}

/**
 * 根据当前页面自动生成面包屑
 */
export function initBreadcrumb() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': [{ text: '主页', url: 'index.html' }],
        'activity.html': [
            { text: '主页', url: 'index.html' },
            { text: '活动', url: 'activity.html' }
        ],
        'team.html': [
            { text: '主页', url: 'index.html' },
            { text: '团队成员', url: 'team.html' }
        ],
        'query.html': [
            { text: '主页', url: 'index.html' },
            { text: '城市查询', url: 'query.html' }
        ],
        'news.html': [
            { text: '主页', url: 'index.html' },
            { text: '新闻动态', url: 'news.html' }
        ],
        'news-detail.html': [
            { text: '主页', url: 'index.html' },
            { text: '新闻动态', url: 'news.html' },
            { text: '新闻详情', url: 'news-detail.html' }
        ],
        'join.html': [
            { text: '主页', url: 'index.html' },
            { text: '加入我们', url: 'join.html' }
        ],
        'partner.html': [
            { text: '主页', url: 'index.html' },
            { text: '合作伙伴', url: 'partner.html' }
        ],
        'about.html': [
            { text: '主页', url: 'index.html' },
            { text: '关于我们', url: 'about.html' }
        ],
        'blacklist.html': [
            { text: '主页', url: 'index.html' },
            { text: '黑名单', url: 'blacklist.html' }
        ],
        'rules.html': [
            { text: '主页', url: 'index.html' },
            { text: '城市守则', url: 'rules.html' }
        ]
    };
    
    const breadcrumbItems = pageMap[currentPage] || [{ text: '主页', url: 'index.html' }];
    const breadcrumb = generateBreadcrumb(breadcrumbItems);
    
    // 插入到导航栏之后
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.nextSibling) {
        navbar.parentNode.insertBefore(breadcrumb, navbar.nextSibling);
    } else if (navbar) {
        navbar.parentNode.appendChild(breadcrumb);
    }
}

