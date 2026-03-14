/**
 * 团队成员模块
 */

/**
 * 切换成员详情显示/隐藏
 * @param {HTMLElement} button - 触发按钮元素
 */
export function toggleMemberDetails(button) {
    const memberCard = button.closest('.member-card');
    const details = memberCard.querySelector('.member-details');
    const toggleText = button.querySelector('.toggle-text');
    const toggleIcon = button.querySelector('.toggle-icon');
    
    if (!memberCard || !details) return;
    
    const isExpanded = memberCard.classList.contains('expanded');
    
    if (isExpanded) {
        memberCard.classList.remove('expanded');
        details.style.maxHeight = '0';
        toggleText.textContent = '查看详情';
        toggleIcon.textContent = '▼';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        memberCard.classList.add('expanded');
        details.style.maxHeight = details.scrollHeight + 'px';
        toggleText.textContent = '收起详情';
        toggleIcon.textContent = '▲';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

/**
 * 初始化成员卡片功能
 */
export function initMemberCards() {
    const toggleButtons = document.querySelectorAll('.member-toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleMemberDetails(this);
        });
    });
}

/**
 * 模拟在线状态更新（实际应用中应从服务器获取）
 */
export function updateOnlineStatus() {
    const onlineStatuses = document.querySelectorAll('.online-status');
    // 这里可以添加实际的在线状态检查逻辑
    // 例如：通过WebSocket或定期API请求获取成员在线状态
    onlineStatuses.forEach(status => {
        // 示例：随机设置在线状态（实际应用中应从服务器获取）
        // const isOnline = Math.random() > 0.5;
        // status.classList.toggle('online', isOnline);
        // status.classList.toggle('offline', !isOnline);
    });
}

/**
 * 计算从加入日期到现在的总小时数
 * @param {string} joinDate - 加入日期，格式：YYYY-MM-DD
 * @returns {number} 总小时数
 */
function calculateJoinedHours(joinDate) {
    const join = new Date(joinDate + 'T00:00:00');
    const now = new Date();
    const diffMs = now - join;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours;
}

/**
 * 格式化小时数显示
 * @param {number} hours - 总小时数
 * @returns {string} 格式化后的字符串
 */
function formatHours(hours) {
    if (hours < 0) {
        return '0h';
    }
    if (hours < 1000) {
        return `${hours}h`;
    }
    // 超过1000小时，显示为千小时单位
    const thousands = (hours / 1000).toFixed(1);
    return `${thousands}k h`;
}

/**
 * 更新所有成员的已加入小时数
 */
export function updateJoinedHours() {
    const joinedHoursElements = document.querySelectorAll('.joined-hours');
    
    joinedHoursElements.forEach(element => {
        const joinDate = element.getAttribute('data-join-date');
        if (joinDate) {
            const hours = calculateJoinedHours(joinDate);
            element.textContent = formatHours(hours);
        }
    });
}

/**
 * 初始化已加入小时数更新
 */
export function initJoinedHours() {
    // 立即更新一次
    updateJoinedHours();
    
    // 每小时更新一次（3600000毫秒 = 1小时）
    setInterval(updateJoinedHours, 3600000);
}

