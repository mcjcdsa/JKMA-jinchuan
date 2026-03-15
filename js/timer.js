/**
 * 计时器模块
 * 处理各种计时器功能
 */

/**
 * 格式化时间差
 * @param {number} diff - 时间差（毫秒）
 * @returns {Object} - 格式化后的时间对象
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
 * 初始化成立时间计时器
 * @param {string} elementId - 显示元素的ID
 * @param {string} startDate - 开始日期字符串
 */
export function initFoundationTimer(elementId, startDate = '2020-08-23T00:00:00') {
    // 确保DOM已加载
    function init() {
        const foundationDate = new Date(startDate);
        const timerElement = document.getElementById(elementId);
        
        if (!timerElement) {
            console.warn(`计时器元素 ${elementId} 未找到，将在100ms后重试`);
            setTimeout(init, 100);
            return;
        }

        function updateTimer() {
            const now = new Date();
            const diff = now - foundationDate;
            
            if (isNaN(diff) || diff < 0) {
                timerElement.textContent = '已成立：日期计算错误';
                return;
            }
            
            const time = formatTimeDiff(diff);
            timerElement.textContent = `已成立：${time.years}年${time.months}月${time.days}天 ${time.hours}时${time.minutes}分${time.seconds}秒`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    // 如果DOM已加载，直接初始化；否则等待
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

/**
 * 初始化倒计时器
 * @param {string} elementId - 显示元素的ID
 * @param {string} targetDate - 目标日期字符串
 * @param {string} expiredMessage - 过期后显示的消息
 */
export function initCountdown(elementId, targetDate, expiredMessage = '活动已开始！') {
    // 确保DOM已加载
    function init() {
        const target = new Date(targetDate);
        const countdownElement = document.getElementById(elementId);
        
        if (!countdownElement) {
            console.warn(`倒计时元素 ${elementId} 未找到，将在100ms后重试`);
            setTimeout(init, 100);
            return;
        }
        
        if (isNaN(target.getTime())) {
            countdownElement.textContent = '倒计时：日期格式错误';
            return;
        }

        function updateCountdown() {
            const now = new Date();
            const diff = target - now;

            if (diff <= 0) {
                countdownElement.textContent = expiredMessage;
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownElement.textContent = `T-：${days}天${hours}时${minutes}分${seconds}秒`;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // 如果DOM已加载，直接初始化；否则等待
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

