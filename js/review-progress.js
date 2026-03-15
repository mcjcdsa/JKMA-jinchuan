/**
 * 审核进度模块
 * 管理审核进度表格的展示
 */

/**
 * 审核进度数据
 * 注意：实际应用中，这些数据应该从后端API获取
 */
export const reviewProgressData = [
    // 示例数据，实际使用时需要从服务器获取
    // {
    //     gameName: '示例玩家',
    //     qq: '123456789',
    //     status: '通过', // '通过' 或 '不通过'
    //     note: '审核通过'
    // }
];

/**
 * 初始化审核进度表格
 */
export function initReviewProgress() {
    const tbody = document.getElementById('review-progress-body');

    if (!tbody) {
        console.error('审核进度表格容器未找到');
        return;
    }

    if (!reviewProgressData || reviewProgressData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table-cell">暂无审核进度数据</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = reviewProgressData.map(item => {
        const statusClass = item.status === '通过' ? 'status-pass' : 'status-fail';
        const statusBgColor = item.status === '通过' ? '#10b981' : '#ef4444';
        
        return `
            <tr>
                <td>${item.gameName || '-'}</td>
                <td>${item.qq || '-'}</td>
                <td class="status-cell ${statusClass}" style="background-color: ${statusBgColor};">
                    ${item.status || '-'}
                </td>
                <td>${item.note || '-'}</td>
            </tr>
        `;
    }).join('');
}

