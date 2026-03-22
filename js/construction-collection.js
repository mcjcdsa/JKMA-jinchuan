/**
 * 关于我们 — 建设合集区块渲染
 * B 站嵌入：官方 player.bilibili.com iframe（与根目录 11111 演示一致），静态部署无后端。
 */
import { constructionVideos } from './construction-videos.js';

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** 从 B 站视频页 URL 或显式 bvid 字段解析 BV 号 */
function resolveBvid(item) {
    if (item.bvid && typeof item.bvid === 'string') {
        const m = item.bvid.match(/BV[0-9A-Za-z]+/);
        if (m) return m[0];
    }
    if (!item.url) return null;
    const m = String(item.url).match(/BV[0-9A-Za-z]+/i);
    return m ? m[0] : null;
}

/** 官方嵌入地址（HTTPS，适配 GitHub Pages），参数与 B 站嵌入文档一致 */
function bilibiliPlayerSrc(bvid, page) {
    const p = Math.max(1, parseInt(String(page || 1), 10) || 1);
    return `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(bvid)}&page=${p}&high_quality=1`;
}

export function initConstructionCollection() {
    const root = document.getElementById('construction-collection');
    if (!root) return;

    const html = constructionVideos
        .map((item) => {
            const title = escapeHtml(item.title);
            const desc = escapeHtml(item.description);
            const ep = escapeHtml(String(item.episode));
            const thumbStyle = `construction-thumb construction-thumb--ep${item.episode}`;

            const btn = item.comingSoon || !item.url
                ? `<span class="construction-btn construction-btn--disabled" aria-disabled="true">敬请期待</span>`
                : `<a href="${escapeHtml(item.url)}" class="construction-btn" target="_blank" rel="noopener noreferrer">在哔哩哔哩打开 <span class="construction-btn-chevron" aria-hidden="true">›</span></a>`;

            const bvid = !item.comingSoon && item.url ? resolveBvid(item) : null;
            const pageNum = item.page != null ? item.page : 1;

            const leftMedia = bvid
                ? `
                <div class="construction-video-frame" role="region" aria-label="B站视频嵌入：${title}">
                    <span class="construction-ep-badge construction-ep-badge--on-video">第 ${ep} 集</span>
                    <iframe
                        class="construction-bilibili-iframe"
                        src="${escapeHtml(bilibiliPlayerSrc(bvid, pageNum))}"
                        scrolling="no"
                        allowfullscreen="true"
                        allow="fullscreen; autoplay; clipboard-write"
                        title="${title}"
                        loading="lazy"
                    ></iframe>
                </div>
                <p class="construction-embed-hint">上为站内嵌入；若无法播放或卡顿，请点右侧在哔哩哔哩打开。</p>
            `
                : `
                <div class="${thumbStyle}">
                    <span class="construction-ep-badge">第 ${ep} 集</span>
                </div>
            `;

            return `
                <div class="construction-overlap" data-episode="${ep}">
                    <div class="construction-left-rectangle">
                        ${leftMedia}
                    </div>
                    <div class="construction-right-rectangle">
                        <div class="construction-black-content">
                            <h3 class="construction-black-title">${title}</h3>
                            <p class="construction-black-text">${desc}</p>
                            <div class="construction-action-row">${btn}</div>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');

    root.innerHTML = html;
}
