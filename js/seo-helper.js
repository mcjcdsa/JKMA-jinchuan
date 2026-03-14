/**
 * SEO辅助函数
 * 用于在HTML中添加SEO元标签
 */

/**
 * 添加Open Graph标签
 */
export function addOpenGraphTags(data) {
    const tags = {
        'og:title': data.title,
        'og:description': data.description,
        'og:type': data.type || 'website',
        'og:url': data.url || window.location.href,
        'og:image': data.image || window.location.origin + '/64018EEC5FC9515CE725726DC59EB387.jpeg',
        'og:site_name': 'JKMA都市圈|金川市官方网站',
        'og:locale': 'zh_CN'
    };
    
    Object.entries(tags).forEach(([property, content]) => {
        if (content) {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        }
    });
}

/**
 * 添加Twitter Card标签
 */
export function addTwitterCardTags(data) {
    const tags = {
        'twitter:card': 'summary_large_image',
        'twitter:title': data.title,
        'twitter:description': data.description,
        'twitter:image': data.image || window.location.origin + '/64018EEC5FC9515CE725726DC59EB387.jpeg'
    };
    
    Object.entries(tags).forEach(([name, content]) => {
        if (content) {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        }
    });
}

/**
 * 添加canonical标签
 */
export function addCanonicalTag(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', url || window.location.href);
}

