/**
 * 行政区域查询模块
 * 管理金川市行政区域信息
 */

/**
 * 行政区域数据
 */
export const districtsData = [
    {
        id: 'main-city',
        name: '主城区',
        positioning: 'CBD为主',
        description: '金川市主城区定位是主要以CBD为主，主城区设有金川火车站，若干个商业广场',
        features: [
            '金川火车站',
            '若干个商业广场',
            'CBD核心区'
        ],
        mapImage: 'districts/main-city-map.png' // 地图图片路径，需要用户提供
    },
    {
        id: 'west-mountain',
        name: '西山区',
        positioning: '旅游业为主',
        description: '金川市西山区定位是旅游业为主，旅游景区有西山，川马古道',
        features: [
            '西山',
            '川马古道'
        ],
        mapImage: 'districts/west-mountain-map.png'
    },
    {
        id: 'resort',
        name: '度假区',
        positioning: '旅游业和生态为主',
        description: '金川市度假区定位是旅游业和生态为主，景点有金川国际会展中心，斗南湿地公园等等',
        features: [
            '金川国际会展中心',
            '斗南湿地公园'
        ],
        mapImage: 'districts/resort-map.png'
    },
    {
        id: 'airport',
        name: '空港经济区',
        positioning: '经济为主',
        description: '金川市空港经济区主要以经济为主，该区域有金川国际机场等等',
        features: [
            '金川国际机场'
        ],
        mapImage: 'districts/airport-map.png'
    },
    {
        id: 'high-tech',
        name: '高新区',
        positioning: '高科技产业为主',
        description: '高新区主要以高科技产业为主',
        features: [
            '高科技产业园区',
            '科技创新中心'
        ],
        mapImage: 'districts/high-tech-map.png'
    },
    {
        id: 'industrial',
        name: '工业园',
        positioning: '工业为主',
        description: '工业园主要以工业为主',
        features: [
            '工业园区',
            '制造业基地'
        ],
        mapImage: 'districts/industrial-map.png'
    },
    {
        id: 'jinbei',
        name: '金北区',
        positioning: '住宅区为主',
        description: '金北区主要以住宅区为主',
        features: [
            '住宅社区',
            '生活配套设施'
        ],
        mapImage: 'districts/jinbei-map.png'
    },
    {
        id: 'guanchuan',
        name: '官川区',
        positioning: '住宅区加花卉市场为主',
        description: '官川区主要以住宅区加花卉市场为主',
        features: [
            '住宅社区',
            '花卉市场',
            '生活配套设施'
        ],
        mapImage: 'districts/guanchuan-map.png'
    }
];

/**
 * 创建行政区域卡片
 */
function createDistrictCard(district) {
    const card = document.createElement('div');
    card.className = 'district-card';
    card.innerHTML = `
        <div class="district-header">
            <h3 class="district-name">${district.name}</h3>
            <span class="district-positioning">${district.positioning}</span>
        </div>
        <div class="district-content">
            <p class="district-description">${district.description}</p>
            <div class="district-features">
                <h4>主要设施：</h4>
                <ul class="features-list">
                    ${district.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="district-map">
            <h4>区域地图：</h4>
            <div class="map-container">
                <img src="${district.mapImage}" alt="${district.name}地图" class="district-map-image" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' fill=\'%23999\' font-size=\'16\'%3E地图待添加%3C/text%3E%3C/svg%3E';">
            </div>
        </div>
    `;
    return card;
}

/**
 * 初始化行政区域查询
 */
export function initDistricts() {
    const container = document.getElementById('districts-container');

    if (!container) {
        console.error('行政区域容器未找到');
        return;
    }

    if (!districtsData || districtsData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无行政区域信息</p>
            </div>
        `;
        return;
    }

    container.innerHTML = ''; // 清空容器

    districtsData.forEach(district => {
        const card = createDistrictCard(district);
        container.appendChild(card);
    });
}

/**
 * 搜索行政区域
 */
export function searchDistricts(keyword) {
    const container = document.getElementById('districts-container');
    if (!container) return;

    if (!keyword || keyword.trim() === '') {
        initDistricts();
        return;
    }

    const filtered = districtsData.filter(district => 
        district.name.includes(keyword) || 
        district.positioning.includes(keyword) ||
        district.description.includes(keyword)
    );

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>未找到相关行政区域</p>
            </div>
        `;
        return;
    }

    filtered.forEach(district => {
        const card = createDistrictCard(district);
        container.appendChild(card);
    });
}

