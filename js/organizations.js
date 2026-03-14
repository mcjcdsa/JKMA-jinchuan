/**
 * 金川市集团划分模块
 * 管理金川市各领域集团和部门的展示
 */

/**
 * 集团划分数据
 */
const organizationsData = {
    fields: [
        {
            id: 'transportation',
            name: '交通领域',
            icon: '🚇',
            organizations: [
                {
                    id: 1,
                    name: '金川交通局',
                    fullName: '金川市交通规划与运营负责处',
                    description: '负责金川市交通规划与运营管理'
                },
                {
                    id: 2,
                    name: '金川铁路局',
                    fullName: '金川市铁路，高铁运营与规划负责处',
                    description: '负责金川市铁路、高铁运营与规划管理'
                },
                {
                    id: 3,
                    name: '金川轨道交通集团有限公司',
                    fullName: '金川市轨道交通运营与规划建设负责处',
                    description: '负责金川市轨道交通运营与规划建设'
                },
                {
                    id: 4,
                    name: '金川公交集团有限公司',
                    fullName: '金川市公交规划与运营',
                    description: '负责金川市公交规划与运营管理'
                }
            ]
        },
        {
            id: 'technology',
            name: '科技领域',
            icon: '🚀',
            organizations: [
                {
                    id: 5,
                    name: '金川航天局',
                    fullName: '金川市航天发射与运营',
                    description: '负责金川市航天发射与运营管理'
                }
            ]
        },
        {
            id: 'construction',
            name: '城建',
            icon: '🏗️',
            organizations: [
                {
                    id: 6,
                    name: '金川市城建局',
                    fullName: '金川市城建规划与建设负责处',
                    description: '负责金川市城建规划与建设管理'
                }
            ]
        }
    ]
};

/**
 * 创建领域卡片
 */
function createFieldCard(field) {
    const card = document.createElement('div');
    card.className = 'organization-field-card';
    card.setAttribute('data-field-id', field.id);
    
    card.innerHTML = `
        <div class="field-header">
            <div class="field-icon">${field.icon}</div>
            <h3 class="field-name">${field.name}</h3>
        </div>
        <div class="field-organizations">
            ${field.organizations.map(org => `
                <div class="organization-item">
                    <div class="org-name">${org.name}</div>
                    <div class="org-full-name">${org.fullName}</div>
                    <div class="org-description">${org.description}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

/**
 * 初始化集团划分展示
 */
export function initOrganizations() {
    const container = document.getElementById('organizations-container');
    
    if (!container) {
        console.error('集团划分容器未找到');
        return;
    }
    
    if (!organizationsData.fields || organizationsData.fields.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无集团划分信息</p>
            </div>
        `;
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建并添加领域卡片
    organizationsData.fields.forEach(field => {
        const card = createFieldCard(field);
        container.appendChild(card);
    });
}

