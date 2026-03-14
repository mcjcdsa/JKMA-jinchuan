/**
 * SEO优化模块
 * 生成结构化数据和SEO标签
 */

/**
 * 生成结构化数据（JSON-LD）
 * @param {Object} data - 结构化数据对象
 */
export function addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

/**
 * 为首页添加结构化数据
 */
export function addHomePageStructuredData() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "JKMA都市圈|金川市",
        "alternateName": ["金川市", "昆川市", "JKMA都市圈"],
        "url": window.location.origin,
        "logo": window.location.origin + "/64018EEC5FC9515CE725726DC59EB387.jpeg",
        "description": "JKMA都市圈|金川市官方网站，成立于2020年8月23日，Java版城市。2026年3月14日，金川市与昆川市合并为JKMA都市圈",
        "foundingDate": "2020-08-23",
        "founder": {
            "@type": "Person",
            "name": "布莱克多格"
        }
    };
    addStructuredData(data);
}

/**
 * 为新闻页面添加结构化数据
 */
export function addNewsStructuredData(news) {
    const data = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": news.title,
        "datePublished": news.date,
        "description": news.summary || news.content
    };
    addStructuredData(data);
}

/**
 * 添加面包屑结构化数据
 * @param {Array} items - 面包屑项数组
 */
export function addBreadcrumbStructuredData(items) {
    const data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.text,
            "item": window.location.origin + "/" + item.url
        }))
    };
    addStructuredData(data);
}

