/**
 * 查询页面模块
 */

const buildings = [
    { name: "市政厅", coordinate: "0 64 0", description: "金川市行政中心" },
    { name: "中央广场", coordinate: "0 64 0", description: "城市中心广场" },
    { name: "火车站", coordinate: "100 64 100", description: "主要交通枢纽" },
    { name: "商业区", coordinate: "50 64 50", description: "商业活动中心" },
    { name: "住宅区", coordinate: "-50 64 -50", description: "居民居住区" }
];

const teleports = [
    { name: "主传送点", coordinate: "0 64 0", description: "城市中心传送点" },
    { name: "火车站传送点", coordinate: "100 64 100", description: "火车站附近" },
    { name: "商业区传送点", coordinate: "50 64 50", description: "商业区入口" }
];

export function switchTab(tabName, targetElement = null) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    if (targetElement) {
        targetElement.classList.add('active');
    }

    if (tabName === 'teleport') {
        displayTeleports();
    }
    
    if (tabName === 'districts') {
        // 行政区域查询在query.html中初始化
    }
}

export function queryCoordinate() {
    const input = document.getElementById('coordinate-input').value.trim();
    const result = document.getElementById('coordinate-result');
    
    if (!input) {
        result.innerHTML = '<p class="error">请输入坐标</p>';
        return;
    }

    const coords = input.replace(/,/g, ' ').split(/\s+/).filter(c => c);
    
    if (coords.length >= 2) {
        const x = coords[0];
        const z = coords[1];
        const y = coords[2] || '64';
        
        result.innerHTML = `
            <div class="result-card">
                <h4>查询结果</h4>
                <p><strong>坐标：</strong>X: ${x}, Y: ${y}, Z: ${z}</p>
                <p><strong>位置信息：</strong>坐标位于金川市范围内</p>
                <p class="result-note">提示：这是基础查询功能，更多详细信息请联系管理员</p>
            </div>
        `;
    } else {
        result.innerHTML = '<p class="error">坐标格式不正确，请输入 X Y Z 或 X,Z 格式</p>';
    }
}

export function searchBuildings(value) {
    const list = document.getElementById('building-list');
    if (!value) {
        list.innerHTML = '';
        return;
    }

    const filtered = buildings.filter(b => b.name.includes(value));
    if (filtered.length > 0) {
        list.innerHTML = filtered.map(b => `
            <div class="building-item" onclick="window.selectBuilding('${b.name}')">
                <strong>${b.name}</strong> - ${b.description}
            </div>
        `).join('');
    } else {
        list.innerHTML = '<p class="no-result">未找到相关建筑</p>';
    }
}

export function queryBuilding() {
    const input = document.getElementById('building-input').value.trim();
    const result = document.getElementById('building-result');
    
    if (!input) {
        result.innerHTML = '<p class="error">请输入建筑名称</p>';
        return;
    }

    const building = buildings.find(b => b.name === input);
    if (building) {
        result.innerHTML = `
            <div class="result-card">
                <h4>${building.name}</h4>
                <p><strong>坐标：</strong>${building.coordinate}</p>
                <p><strong>描述：</strong>${building.description}</p>
            </div>
        `;
    } else {
        result.innerHTML = '<p class="error">未找到该建筑，请检查名称是否正确</p>';
    }
}

export function selectBuilding(name) {
    document.getElementById('building-input').value = name;
    queryBuilding();
}

export function displayTeleports() {
    const result = document.getElementById('teleport-result');
    result.innerHTML = teleports.map(t => `
        <div class="teleport-item">
            <h4>${t.name}</h4>
            <p><strong>坐标：</strong>${t.coordinate}</p>
            <p><strong>描述：</strong>${t.description}</p>
        </div>
    `).join('');
}

export function initQueryPage() {
    // 绑定回车键事件
    const coordinateInput = document.getElementById('coordinate-input');
    if (coordinateInput) {
        coordinateInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                queryCoordinate();
            }
        });
    }

    const buildingInput = document.getElementById('building-input');
    if (buildingInput) {
        buildingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                queryBuilding();
            }
        });
    }

    // 将函数暴露到全局作用域以便onclick使用
    window.switchTab = (tabName) => {
        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        switchTab(tabName, activeBtn);
    };
    window.queryCoordinate = queryCoordinate;
    window.queryBuilding = queryBuilding;
    window.searchBuildings = searchBuildings;
    window.selectBuilding = selectBuilding;
}

