/**
 * 关于我们 — 建设合集区块渲染
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
                : `<a href="${escapeHtml(item.url)}" class="construction-btn" target="_blank" rel="noopener noreferrer">点我观看 <span class="construction-btn-chevron" aria-hidden="true">›</span></a>`;

            return `
                <div class="construction-overlap" data-episode="${ep}">
                    <div class="construction-left-rectangle">
                        <div class="${thumbStyle}">
                            <span class="construction-ep-badge">第 ${ep} 集</span>
                        </div>
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
