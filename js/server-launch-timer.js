/**
 * 首页「开服时间」计时（独立文件）
 * 与 timer.js 分离，避免 GitHub Pages / 浏览器长期缓存旧 timer.js 导致缺少 initServerLaunchTimer 导出。
 */

function formatTimeDiff(diff) {
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { years, months, days, hours, minutes, seconds };
}

/**
 * 开服计时：开服前为倒计时，开服后为已开服时长（与成立计时器格式一致）
 * @param {string} elementId
 * @param {string} launchDate ISO 本地时间，如 2026-03-21T18:58:00
 */
export function initServerLaunchTimer(elementId, launchDate = '2026-03-21T18:58:00') {
    function init() {
        const openAt = new Date(launchDate);
        const el = document.getElementById(elementId);

        if (!el) {
            console.warn(`开服计时元素 ${elementId} 未找到，将在100ms后重试`);
            setTimeout(init, 100);
            return;
        }

        if (isNaN(openAt.getTime())) {
            el.textContent = '开服时间：日期格式错误';
            return;
        }

        function update() {
            const now = new Date();
            const diff = now - openAt;

            if (diff < 0) {
                const remain = -diff;
                const days = Math.floor(remain / (1000 * 60 * 60 * 24));
                const hours = Math.floor((remain % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remain % (1000 * 60)) / 1000);
                el.textContent = `距开服还有：${days}天${hours}时${minutes}分${seconds}秒`;
                return;
            }

            const time = formatTimeDiff(diff);
            el.textContent = `已开服：${time.years}年${time.months}月${time.days}天 ${time.hours}时${time.minutes}分${time.seconds}秒`;
        }

        update();
        setInterval(update, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}
