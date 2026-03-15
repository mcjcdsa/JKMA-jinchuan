/**
 * 城市规划模块
 * 管理城市规划图和交通规划的展示
 */

/**
 * 城市规划数据
 */
export const planningData = {
    cityPlanning: {
        title: '城市未来规划图',
        mapImage: 'planning/city-planning-map.png' // 规划图路径，需要用户提供
    },
    transportation: {
        overview: {
            title: '交通总体规划',
            mapImage: 'planning/transport-overview-map.png'
        },
        metro: {
            title: '轨道交通规划',
            mapImage: 'planning/transport-metro-map.png'
        },
        railway: {
            title: '铁路规划',
            mapImage: 'planning/transport-railway-map.png'
        },
        road: {
            title: '道路规划',
            mapImage: 'planning/transport-road-map.png'
        },
        bus: {
            title: '公交车规划',
            mapImage: 'planning/transport-bus-map.png'
        }
    }
};

/**
 * 创建规划图容器
 */
function createPlanningMap(imagePath, title) {
    const container = document.createElement('div');
    container.className = 'planning-map-wrapper';
    
    container.innerHTML = `
        <div class="planning-map-image-container">
            <img src="${imagePath}" alt="${title}" class="planning-map-image" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'%3E%3Crect width=\'800\' height=\'600\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' fill=\'%23999\' font-size=\'20\'%3E规划图待添加%3C/text%3E%3C/svg%3E';">
        </div>
        <p class="planning-map-note">${title} - 规划图待添加</p>
    `;
    
    return container;
}

/**
 * 初始化城市规划
 */
export function initPlanning() {
    // 初始化城市未来规划图
    const cityPlanningContainer = document.getElementById('city-planning-map');
    if (cityPlanningContainer) {
        const cityMap = createPlanningMap(
            planningData.cityPlanning.mapImage,
            planningData.cityPlanning.title
        );
        cityPlanningContainer.appendChild(cityMap);
    }
    
    // 初始化交通规划图
    const transportMaps = {
        'transport-overview-map': planningData.transportation.overview,
        'transport-metro-map': planningData.transportation.metro,
        'transport-railway-map': planningData.transportation.railway,
        'transport-road-map': planningData.transportation.road,
        'transport-bus-map': planningData.transportation.bus
    };
    
    Object.keys(transportMaps).forEach(mapId => {
        const container = document.getElementById(mapId);
        if (container) {
            const mapData = transportMaps[mapId];
            const map = createPlanningMap(mapData.mapImage, mapData.title);
            container.appendChild(map);
        }
    });
    
    // 初始化标签页切换
    initTransportTabs();
}

/**
 * 初始化交通规划标签页
 */
function initTransportTabs() {
    const tabButtons = document.querySelectorAll('.transport-tab-btn');
    const tabContents = document.querySelectorAll('.transport-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            const targetContent = document.getElementById(`transport-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

