/**
 * 建设相关文件模块
 * 管理所有建设相关文档的展示和详情查看
 */

import { specificationsData } from './specifications.js';

/**
 * 城市守则数据
 */
const rulesData = {
    id: 'rules',
    title: '金川市城市守则(1.0版)',
    pageUrl: 'rules.html',
    icon: '📋',
    category: '城市规定',
    version: '1.0版',
    description: 'JKMA都市圈|金川市城市守则，包含城市规定和处罚标准。',
    content: {
        intro: '欢迎加入JKMA都市圈！为了维护城市的良好秩序和建设环境，请所有成员严格遵守以下城市守则。',
        sections: [
            {
                title: '城市规定',
                items: [
                    {
                        number: 1,
                        content: '加入金川市后，请严格遵守金川市相关规定，若违反规定，将按照下方处罚标准执行处罚。'
                    },
                    {
                        number: 2,
                        content: '请勿建设未经批复的建筑，此类建筑一经发现将视为违章建筑，予以拆除并通知本人，同时按处罚标准进行处罚（详情见下方处罚标准）。'
                    },
                    {
                        number: 3,
                        content: '使用创世神功能时，请勿一次性粘贴过多内容、避免堆叠过量（stack过多），若因此导致服务器崩溃，将按处罚标准进行处罚（详情见下方处罚标准）。'
                    },
                    {
                        number: 4,
                        content: '建设建筑时需保证基本美观，不要求过于华丽，但不得过于丑陋、单调。一经发现不合格建筑，将提醒本人整改；若整改后仍不合格，金川市高级建设成员及市长有权拆除该建筑，并按处罚标准进行处罚（详情见下方处罚标准）。'
                    },
                    {
                        number: 5,
                        content: '金川市建设等级分为普通建设成员、中级建设成员、高级建设成员。等级由市长及审核员根据审核问卷评定，建设等级越高，可获得的建设范围越大。若你负责的建筑出现不合格情况，将予以降级处理；若降至普通建设成员后仍不合格，将永久取消你的建设资格。'
                    },
                    {
                        number: 6,
                        content: '请勿进行炸图、恶意破坏地图等行为，一经发现，将按照下方处罚标准执行处罚。'
                    }
                ]
            },
            {
                title: '处罚标准',
                isPunishment: true,
                items: [
                    {
                        number: 1,
                        content: '<strong>违反第3条、第6条规定：</strong>直接将违规者踢出服务器，并拉入一级黑名单。'
                    },
                    {
                        number: 2,
                        content: '<strong>违反第2条、第4条规定：</strong>第一次取消违规者一周的建设权限；第二次直接将违规者踢出服务器，并拉入二级黑名单。'
                    }
                ]
            }
        ],
        footer: '请所有成员认真阅读并遵守以上规定，共同维护JKMA都市圈的良好建设环境。'
    }
};

/**
 * 建设规范数据（从specifications.js导入）
 */
const constructionSpecsData = {
    id: 'specifications',
    title: '金川轨道交通建设规范',
    pageUrl: 'specifications.html',
    icon: '🚇',
    category: '技术规范',
    version: '1.0版',
    description: '金川市轨道交通（地铁）建设的各项技术标准和规范要求。',
    content: specificationsData
};

/**
 * 金川市详细规章制度 V1.0（全文独立页面，来源稿 1111）
 */
const regulationsV1Data = {
    id: 'regulations-v1',
    title: '金川市详细规章制度 V1.0',
    pageUrl: 'jinchuan-regulations-v1.html',
    icon: '📜',
    category: '规章制度',
    version: 'V1.0',
    description: '金川市内部建设规定与成员守则（完整版），含建设条例、交通、处罚标准与更新日志。',
    externalUrl: 'jinchuan-regulations-v1.html'
};

/**
 * 所有文档数据
 */
const documentsData = [
    rulesData,
    constructionSpecsData,
    regulationsV1Data
];

/**
 * 转义 HTML，避免注入并安全显示标题
 */
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * 创建文档卡片
 * 注意：参数不得命名为 document，否则会遮蔽全局 document 导致无法创建 DOM。
 */
function createDocumentCard(doc) {
    const card = document.createElement('div');
    card.className = 'document-card';
    card.setAttribute('data-document-id', doc.id);

    const titleHref = doc.pageUrl || doc.externalUrl || '#';
    const titleText = escapeHtml(doc.title);

    card.innerHTML = `
        <div class="document-card-icon">${doc.icon}</div>
        <div class="document-card-content">
            <h3 class="document-card-title">
                <a href="${titleHref}" class="document-card-title-link">${titleText}</a>
            </h3>
            <p class="document-card-category">${escapeHtml(doc.category)}</p>
            <p class="document-card-description">${escapeHtml(doc.description)}</p>
            <div class="document-card-footer">
                <span class="document-card-version">版本：${escapeHtml(doc.version)}</span>
                <span class="document-card-action">${doc.externalUrl ? '打开完整文档 →' : '在页面内查看详情 →'}</span>
            </div>
        </div>
    `;

    // 点击标题链由浏览器负责跳转；点击卡片其余区域：独立全文页则整页跳转，否则打开弹窗预览
    card.addEventListener('click', (e) => {
        if (e.target.closest('a.document-card-title-link')) {
            return;
        }
        if (doc.externalUrl) {
            window.location.href = doc.externalUrl;
            return;
        }
        showDocumentDetail(doc);
    });

    return card;
}

/**
 * 渲染城市守则内容
 */
function renderRulesContent(content) {
    let html = `
        <div class="document-intro">
            <p>${content.intro}</p>
        </div>
    `;
    
    content.sections.forEach(section => {
        const sectionClass = section.isPunishment ? 'punishment-section' : '';
        html += `
            <div class="document-section ${sectionClass}">
                <h3 class="document-section-title">${section.title}</h3>
                <div class="document-items">
        `;
        
        section.items.forEach(item => {
            const itemClass = section.isPunishment ? 'punishment-item' : '';
            html += `
                <div class="document-item ${itemClass}">
                    <div class="document-item-number">${item.number}</div>
                    <div class="document-item-content">
                        <p>${item.content}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="document-footer">
            <p class="document-version">版本：${rulesData.version}</p>
            <p class="document-notice">${content.footer}</p>
        </div>
    `;
    
    return html;
}

/**
 * 渲染建设规范内容
 */
function renderSpecificationsContent(content) {
    let html = `
        <div class="document-intro">
            <p>本文档规定了金川市轨道交通（地铁）建设的各项技术标准和规范要求，所有建设活动必须严格遵守本规范。</p>
        </div>
    `;
    
    content.sections.forEach(section => {
        html += `
            <div class="document-section spec-section">
                <h3 class="document-section-title">
                    <span class="section-icon">${section.icon || '📋'}</span>
                    ${section.title}
                </h3>
        `;
        
        section.subsections.forEach(subsection => {
            html += `
                <div class="spec-subsection-wrapper">
                    <h4 class="spec-subsection-title">${subsection.title}</h4>
                    <div class="spec-items-list">
            `;
            
            subsection.items.forEach(item => {
                if (item.type === 'subsection') {
                    html += `
                        <div class="spec-subsection-nested">
                            <h5 class="spec-subsection-nested-title">${item.title}</h5>
                            <div class="spec-items-nested">
                    `;
                    item.items.forEach(subItem => {
                        const icon = getSpecItemIcon(subItem.type);
                        html += `
                            <div class="spec-item-nested">
                                <span class="spec-item-icon">${icon}</span>
                                <span class="spec-item-text">${subItem.content || subItem.title}</span>
                            </div>
                        `;
                    });
                    html += `
                            </div>
                        </div>
                    `;
                } else if (item.type === 'description' && item.title) {
                    html += `
                        <div class="spec-description">
                            <h5 class="spec-description-title">${item.title}</h5>
                            <p class="spec-description-content">${item.content}</p>
                        </div>
                    `;
                } else {
                    const icon = getSpecItemIcon(item.type);
                    html += `
                        <div class="spec-item">
                            <span class="spec-item-icon">${icon}</span>
                            <span class="spec-item-text">${item.content || item.title}</span>
                        </div>
                    `;
                }
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    return html;
}

/**
 * 获取规范项目图标
 */
function getSpecItemIcon(type) {
    const iconMap = {
        'rule': '📋',
        'requirement': '✅',
        'standard': '📐',
        'limit': '⚠️',
        'speed': '🚄',
        'description': '📝',
        'note': '💡',
        'condition': '✓',
        'item': '•'
    };
    return iconMap[type] || '•';
}

/**
 * 显示文档详情（弹窗预览；完整内容请点标题进入独立页面）
 */
function showDocumentDetail(doc) {
    const modal = document.getElementById('document-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = doc.title;

    // 根据文档类型渲染内容
    let contentHtml = '';
    if (doc.id === 'rules') {
        contentHtml = renderRulesContent(doc.content);
    } else if (doc.id === 'specifications') {
        contentHtml = renderSpecificationsContent(doc.content);
    }

    const pageHint = doc.pageUrl
        ? `<p class="document-modal-hint"><a href="${escapeHtml(doc.pageUrl)}">打开独立页面查看完整版 →</a></p>`
        : '';
    modalBody.innerHTML = pageHint + contentHtml;

    // 显示模态框
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭文档详情
 */
function closeDocumentDetail() {
    const modal = document.getElementById('document-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * 初始化建设相关文件页面
 */
export function initDocuments() {
    const grid = document.getElementById('documents-grid');
    
    if (!grid) {
        console.error('文档网格容器未找到');
        return;
    }
    
    if (documentsData.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>暂无建设相关文件</p>
            </div>
        `;
        return;
    }
    
    // 清空容器
    grid.innerHTML = '';
    
    // 创建并添加文档卡片
    documentsData.forEach(doc => {
        const card = createDocumentCard(doc);
        grid.appendChild(card);
    });
    
    // 绑定模态框关闭事件
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeDocumentDetail);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeDocumentDetail);
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('document-modal');
            if (modal && modal.classList.contains('active')) {
                closeDocumentDetail();
            }
        }
    });
}

