/**
 * 黑名单模块
 * 管理黑名单成员的显示
 */

/**
 * 黑名单成员数据
 */
const blacklistData = [
    {
        id: 1,
        name: '狂笑的人出击',
        qq: '3775188907',
        reason: '在群里多次发政治内容和建违章建筑',
        blacklistDate: '2024-06-15',
        level: '一级黑名单',
        description: '因在群里多次发政治内容和建违章建筑，被踢出并拉入一级黑名单。'
    }
    // 可以在这里添加更多黑名单成员
];

/**
 * 创建黑名单成员卡片
 */
function createBlacklistCard(member) {
    const card = document.createElement('div');
    card.className = 'blacklist-card';
    card.setAttribute('data-member-id', member.id);
    
    const blacklistDate = new Date(member.blacklistDate + 'T00:00:00');
    const formattedDate = blacklistDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="blacklist-card-header">
            <div class="blacklist-icon">🚫</div>
            <div class="blacklist-info">
                <h3 class="blacklist-name">${member.name}</h3>
                <div class="blacklist-level level-${member.level.includes('一级') ? '1' : '2'}">${member.level}</div>
            </div>
        </div>
        <div class="blacklist-card-body">
            <div class="blacklist-reason">
                <h4>列入原因</h4>
                <p>${member.reason}</p>
            </div>
            <div class="blacklist-details">
                ${member.qq ? `
                <div class="blacklist-detail-item">
                    <span class="detail-label">QQ号：</span>
                    <span class="detail-value qq-number">${member.qq}</span>
                </div>
                ` : ''}
                <div class="blacklist-detail-item">
                    <span class="detail-label">列入日期：</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="blacklist-detail-item">
                    <span class="detail-label">详细说明：</span>
                    <span class="detail-value">${member.description}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 初始化黑名单页面
 */
export function initBlacklist() {
    const container = document.getElementById('blacklist-members');
    
    if (!container) {
        console.error('黑名单容器未找到');
        return;
    }
    
    if (blacklistData.length === 0) {
        container.innerHTML = `
            <div class="blacklist-empty">
                <p>当前黑名单为空</p>
            </div>
        `;
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建并添加黑名单卡片
    blacklistData.forEach(member => {
        const card = createBlacklistCard(member);
        container.appendChild(card);
    });
}

