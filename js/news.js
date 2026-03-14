/**
 * 新闻页面模块
 */

const newsData = [
    {
        id: 1,
        title: "金川市官方网站正式上线",
        category: "announcement",
        date: "2026-03-14",
        content: "金川市官方网站今日正式上线，为广大市民提供便捷的信息查询和服务。",
        summary: "金川市官方网站今日正式上线，为广大市民提供便捷的信息查询和服务。"
    },
    {
        id: 2,
        title: "六周年庆典大会筹备中",
        category: "activity",
        date: "2026-03-14",
        content: "2026年8月23日将举行金川市成立六周年庆典大会，现正积极筹备中。",
        summary: "2026年8月23日将举行金川市成立六周年庆典大会，现正积极筹备中。"
    }
];

export function displayNews(newsArray) {
    const list = document.getElementById('news-list');
    if (!list) return;
    
    if (newsArray.length === 0) {
        list.innerHTML = '<p class="no-news">暂无新闻</p>';
        return;
    }

    list.innerHTML = newsArray.map(news => `
        <div class="news-item" onclick="window.viewNews(${news.id})">
            <div class="news-category ${news.category}">${getCategoryName(news.category)}</div>
            <h3 class="news-title">${news.title}</h3>
            <p class="news-summary">${news.summary}</p>
            <div class="news-meta">
                <span class="news-date">${news.date}</span>
            </div>
        </div>
    `).join('');
}

export function getCategoryName(category) {
    const names = {
        'announcement': '公告',
        'activity': '活动',
        'update': '更新'
    };
    return names[category] || '其他';
}

export function filterNews(category, targetElement = null) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (targetElement) {
        targetElement.classList.add('active');
    }

    let filteredNews = newsData;
    if (category !== 'all') {
        filteredNews = newsData.filter(news => news.category === category);
    }

    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayNews(filteredNews);
}

export function viewNews(id) {
    const news = newsData.find(n => n.id === id);
    if (news) {
        localStorage.setItem('currentNews', JSON.stringify(news));
        window.location.href = 'news-detail.html';
    }
}

export function initNewsPage() {
    // 将函数暴露到全局作用域以便onclick使用
    window.filterNews = (category) => {
        const activeBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        filterNews(category, activeBtn);
    };
    window.viewNews = viewNews;
    
    // 初始显示所有新闻
    displayNews(newsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
}

