/**
 * 关于我们 — 城市变迁（图文时间轴）
 * 图片放在仓库根目录，与 about.html 同一路径层级，src 使用「相对当前页面」即可。
 * 不用 import.meta.url：部分浏览器下与懒加载组合时易出现长时间占位。
 * 不用 loading="lazy"：Edge 会对懒加载图片做占位与延迟（Intervention），易导致「一直灰块」观感。
 */
function imgSrc(filename) {
    try {
        return new URL(filename, window.location.href).href;
    } catch {
        return filename;
    }
}

const cityChangeItems = [
    {
        image: 'C9B1CCE85CB1CC20EB8265588FDDB1DE.png',
        dateSort: '2026-03-21',
        dateDisplay: '2026.3.21',
        content: '路网初步建设',
        linkLabel: '[JKMA-金川]第一集:平整地形',
        linkUrl:
            'https://www.bilibili.com/video/BV1ehAPzbEg4?vd_source=8908fa84f0b40de26335c43a46900d19'
    },
    {
        image: 'c7f8205b1e107e2ed4f9ee3f64e94b9e.png',
        dateSort: '2026-03-22',
        dateDisplay: '2026.3.22',
        content: '修建快速路和内部道路',
        linkLabel: '[JKMA-金川]第二集:修建快速路和内部道路',
        linkUrl:
            'https://www.bilibili.com/video/BV1sJAgzcE2j?vd_source=8908fa84f0b40de26335c43a46900d19'
    }
];

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function initCityChange() {
    const root = document.getElementById('city-change-timeline');
    if (!root) return;

    const sorted = [...cityChangeItems].sort(
        (a, b) => new Date(a.dateSort) - new Date(b.dateSort)
    );

    root.innerHTML = sorted
        .map(
            (item, index) => `
        <div class="city-change-item">
            <div class="city-change-item-inner">
                <div class="city-change-date-col">
                    <span class="city-change-date">${escapeHtml(item.dateDisplay)}</span>
                </div>
                <div class="city-change-axis">
                    <span class="city-change-dot" aria-hidden="true"></span>
                </div>
                <div class="city-change-body">
                    <div class="city-change-img-wrap">
                        <img src="${imgSrc(item.image)}" alt="${escapeHtml(item.content)}" class="city-change-img" width="400" height="225" loading="eager" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}>
                        <p class="city-change-img-error" hidden>图片未能加载。请确认仓库已包含该 PNG 并已推送部署，或 Ctrl+F5 强刷缓存。</p>
                    </div>
                    <div class="city-change-copy">
                        <p class="city-change-text">${escapeHtml(item.content)}</p>
                        <p class="city-change-link-row">
                            <span class="city-change-link-label">相关链接：</span>
                            <a href="${escapeHtml(item.linkUrl)}" class="city-change-link" target="_blank" rel="noopener noreferrer">${escapeHtml(item.linkLabel)}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
        )
        .join('');

    root.querySelectorAll('img.city-change-img').forEach((img) => {
        img.addEventListener('error', () => {
            img.classList.add('city-change-img--error');
            const wrap = img.closest('.city-change-img-wrap');
            if (!wrap) return;
            wrap.classList.add('city-change-img-wrap--error');
            const err = wrap.querySelector('.city-change-img-error');
            if (err) err.hidden = false;
        });
    });
}
