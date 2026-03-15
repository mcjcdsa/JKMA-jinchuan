/**
 * 下载管理模块
 * 管理服务器相关文件的下载链接
 */

/**
 * 下载文件数据
 */
export const downloadsData = [
    {
        id: 'mods',
        name: '服务器Mod包',
        description: '包含服务器所需的所有Mod文件，解压后放入客户端的mods文件夹即可使用。',
        type: 'ZIP压缩包',
        size: '约297MB',
        downloadUrl: '', // 外部下载链接，如果为空则显示QQ群提示
        alternative: {
            type: 'qq',
            qq: '467257156',
            message: '文件较大，请联系管理员获取下载链接或通过QQ群获取。'
        }
    }
    // 可以在这里添加更多下载项
];

/**
 * 创建下载项卡片
 */
function createDownloadCard(item) {
    const card = document.createElement('div');
    card.className = 'download-item';
    
    let downloadActionHTML = '';
    
    if (item.downloadUrl) {
        // 有下载链接，显示下载按钮
        downloadActionHTML = `
            <div class="download-action">
                <a href="${item.downloadUrl}" target="_blank" rel="noopener noreferrer" class="download-btn">
                    <span class="download-icon">⬇️</span>
                    <span>下载</span>
                </a>
                ${item.size ? `<p class="download-size">文件大小：${item.size}</p>` : ''}
            </div>
        `;
    } else if (item.alternative) {
        // 没有下载链接，显示替代方案
        if (item.alternative.type === 'qq') {
            downloadActionHTML = `
                <div class="download-action">
                    <p class="download-note">${item.alternative.message}</p>
                    <p class="download-note">QQ审核群：<span id="qq-number-${item.id}" class="qq-number">${item.alternative.qq}</span></p>
                    <p class="copy-hint" id="copy-hint-${item.id}" style="display: none;"></p>
                </div>
            `;
        }
    }
    
    card.innerHTML = `
        <div class="download-info">
            <h4 class="download-name">${item.name}</h4>
            <p class="download-description">${item.description}</p>
            <div class="download-meta">
                <span class="download-type">${item.type}</span>
                ${item.size ? `<span class="download-size-badge">${item.size}</span>` : ''}
            </div>
        </div>
        ${downloadActionHTML}
    `;
    
    return card;
}

/**
 * 初始化下载页面
 */
export function initDownloads() {
    const container = document.getElementById('downloads-container');

    if (!container) {
        console.error('下载容器未找到');
        return;
    }

    if (!downloadsData || downloadsData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无下载文件</p>
            </div>
        `;
        return;
    }

    container.innerHTML = ''; // 清空容器

    downloadsData.forEach(item => {
        const card = createDownloadCard(item);
        container.appendChild(card);
        
        // 如果有QQ群号，初始化复制功能
        if (item.alternative && item.alternative.type === 'qq') {
            const qqElement = document.getElementById(`qq-number-${item.id}`);
            if (qqElement) {
                qqElement.addEventListener('click', async function() {
                    const { copyToClipboard } = await import('./utils.js');
                    const { showSuccess, showError } = await import('./toast.js');
                    const success = await copyToClipboard(item.alternative.qq);
                    if (success) {
                        showSuccess('群号已复制到剪贴板！');
                        const hint = document.getElementById(`copy-hint-${item.id}`);
                        if (hint) {
                            hint.textContent = '群号已复制到剪贴板！';
                            hint.style.display = 'block';
                            setTimeout(() => {
                                hint.style.display = 'none';
                            }, 2000);
                        }
                    } else {
                        showError('复制失败，请手动复制');
                    }
                });
            }
        }
    });
}

