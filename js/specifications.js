/**
 * 建设规范模块
 * 管理金川轨道交通建设规范的展示
 */

/**
 * 建设规范数据
 */
const specificationsData = {
    title: '金川轨道交通建设规范',
    sections: [
        {
            id: 'metro',
            title: '一. 地铁',
            icon: '🚇',
            subsections: [
                {
                    id: 'depot',
                    title: '1. 车辆段',
                    items: [
                        {
                            type: 'rule',
                            content: '车辆段内部速度不能超过20KM/h'
                        },
                        {
                            type: 'requirement',
                            content: '车辆段应该有完整的配套设施（停车库，检修库，洗车库，试车线，司机公寓，办公区域等等）'
                        },
                        {
                            type: 'standard',
                            content: '建设规范：用地要符合城市总体规划，有足够的有效用地和远期发展余地'
                        },
                        {
                            type: 'standard',
                            content: '停车库和检修库和洗车库应该低于地面一格'
                        },
                        {
                            type: 'standard',
                            content: '出库线路半径不宜过小'
                        },
                        {
                            type: 'limit',
                            content: '道岔数量一次性最多不能多余4个'
                        },
                        {
                            type: 'requirement',
                            content: '车辆段一定要防止出现堵车现象'
                        },
                        {
                            type: 'requirement',
                            content: '车辆段必须具备有信号'
                        },
                        {
                            type: 'requirement',
                            content: '停车线最少不能断于你的列车长度'
                        }
                    ]
                },
                {
                    id: 'section',
                    title: '2. 区间',
                    items: [
                        {
                            type: 'limit',
                            content: '区间长度不能少于300米，同理不能多于5公里'
                        },
                        {
                            type: 'standard',
                            content: '区间转弯半径最小曲线半径在正线上一般取300米，困难地段不小于250米；最大坡度正线一般取30‰'
                        },
                        {
                            type: 'speed',
                            content: '限速：1公里以内限速60，2公里到1公里以内限速80，2公里以上限速120如果遇到前方有道岔最大时速不可以超过60，如果需要从道岔换向最高时速不可以超过40；曲线半径越小限速越低（如石家庄地铁案例中，半径250m限速49km/h，半径800m限速73km/h）'
                        },
                        {
                            type: 'standard',
                            content: '区间坡度不可以过小'
                        }
                    ]
                },
                {
                    id: 'station',
                    title: '3. 车站',
                    items: [
                        {
                            type: 'standard',
                            content: '车站长度应当取决于你的列车长度'
                        },
                        {
                            type: 'requirement',
                            content: '车站应当具备以下设施：1）车站主体'
                        },
                        {
                            type: 'description',
                            title: '车站主体',
                            content: '车站主体是列车的停车点，它不仅要供乘客上下车、集散、候车，一般也是办理运营业务和运营设备设置的地方。根据功能的不同，可分为以下两大部分：'
                        },
                        {
                            type: 'subsection',
                            title: '1. 乘客使用空间',
                            items: [
                                {
                                    type: 'item',
                                    content: '①站厅。站厅主要功能是集散客流兼客运服务等，如站厅中部为公用厅，两侧为客运管理区、机电设备区。'
                                },
                                {
                                    type: 'item',
                                    content: '②站台。站台主要供乘客上、下车，集散客流，作短暂的停留候车。'
                                }
                            ]
                        },
                        {
                            type: 'description',
                            content: '乘客使用空间又可分为非付费区和付费区。非付费区是乘客购票并正式进入车站前的活动区域。付费区包括站台、楼梯和自动扶梯、导向牌等，它是为乘客候车服务的设施，地铁出入口（出入口最少不能少于2个）'
                        }
                    ]
                },
                {
                    id: 'line',
                    title: '4. 线路',
                    items: [
                        {
                            type: 'requirement',
                            content: '线路走向应当按照规划图走向建设，不可以出现偏差过大'
                        },
                        {
                            type: 'requirement',
                            content: '一条线路应该有1个车辆段，一个停车场，3个存车线，折返不能少于2个，联络线等等'
                        },
                        {
                            type: 'requirement',
                            content: '应当设置列车发车间隔防止出现堵车'
                        },
                        {
                            type: 'standard',
                            content: '地铁联络线的最大坡度不宜大于35‰'
                        },
                        {
                            type: 'subsection',
                            title: '坡度要求',
                            items: [
                                {
                                    type: 'item',
                                    content: '区间正线：最大坡度不宜大于30‰，困难条件下可采用35‰'
                                },
                                {
                                    type: 'item',
                                    content: '车站：地下站站台计算长度段线路坡度宜采用2‰，困难条件下可设在不大于3‰的坡道上；地面和高架车站一般设在平坡段上，困难时可设在不大于3‰的坡道上'
                                },
                                {
                                    type: 'item',
                                    content: '车场线：宜设在平坡道上，条件困难时库外线可设在不大于1.5‰的坡道上'
                                },
                                {
                                    type: 'item',
                                    content: '折返线和停车线：应布置在面向车挡或区间的下坡道上，隧道内的坡度宜为2‰，地面和高架桥上的折返线、停车线，其坡度不宜大于2‰'
                                }
                            ]
                        },
                        {
                            type: 'note',
                            content: '地铁是否需要越行线取决于线路的客流需求、规划条件'
                        }
                    ]
                },
                {
                    id: 'trial-run',
                    title: '5. 空载试运行',
                    items: [
                        {
                            type: 'requirement',
                            content: '空载试运行不得少于一个星期'
                        },
                        {
                            type: 'requirement',
                            content: '所有轨道交通线路必须进行空载试运行，开通前需报备，报备后获得开通运营的条件：'
                        },
                        {
                            type: 'subsection',
                            title: '开通运营条件',
                            items: [
                                {
                                    type: 'condition',
                                    content: '线路设计合理'
                                },
                                {
                                    type: 'condition',
                                    content: '不得出现堵车现象，比如说这辆车还在这个站，下一趟车就来了'
                                },
                                {
                                    type: 'condition',
                                    content: '安排合理发车间隔，高峰期发车间隔不少于3分钟，不高于5分钟，其它时间段不少于5分钟，不多于15分钟'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

/**
 * 获取项目类型样式类
 */
function getItemTypeClass(type) {
    const typeMap = {
        'rule': 'spec-item-rule',
        'requirement': 'spec-item-requirement',
        'standard': 'spec-item-standard',
        'limit': 'spec-item-limit',
        'speed': 'spec-item-speed',
        'description': 'spec-item-description',
        'note': 'spec-item-note',
        'condition': 'spec-item-condition',
        'item': 'spec-item-normal'
    };
    return typeMap[type] || 'spec-item-normal';
}

/**
 * 获取项目类型图标
 */
function getItemTypeIcon(type) {
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
 * 创建规范项目
 */
function createSpecItem(item, level = 0) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `spec-item ${getItemTypeClass(item.type)} level-${level}`;
    
    if (item.type === 'subsection') {
        // 子章节
        itemDiv.innerHTML = `
            <div class="spec-subsection">
                <h4 class="spec-subsection-title">${item.title}</h4>
                <div class="spec-subsection-items">
                    ${item.items.map(subItem => createSpecItem(subItem, level + 1).outerHTML).join('')}
                </div>
            </div>
        `;
    } else if (item.type === 'description' && item.title) {
        // 带标题的描述
        itemDiv.innerHTML = `
            <div class="spec-description">
                <h5 class="spec-description-title">${item.title}</h5>
                <p class="spec-description-content">${item.content}</p>
            </div>
        `;
    } else {
        // 普通项目
        const icon = getItemTypeIcon(item.type);
        itemDiv.innerHTML = `
            <div class="spec-item-content">
                <span class="spec-item-icon">${icon}</span>
                <span class="spec-item-text">${item.content || item.title}</span>
            </div>
        `;
    }
    
    return itemDiv;
}

/**
 * 创建章节
 */
function createSection(section) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'spec-section';
    sectionDiv.setAttribute('data-section-id', section.id);
    
    sectionDiv.innerHTML = `
        <div class="spec-section-header">
            <span class="spec-section-icon">${section.icon || '📋'}</span>
            <h2 class="spec-section-title">${section.title}</h2>
        </div>
        <div class="spec-section-content">
            ${section.subsections.map(subsection => `
                <div class="spec-subsection-wrapper">
                    <h3 class="spec-subsection-main-title">${subsection.title}</h3>
                    <div class="spec-items-list">
                        ${subsection.items.map(item => createSpecItem(item).outerHTML).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    return sectionDiv;
}

/**
 * 初始化建设规范页面
 */
export function initSpecifications() {
    const container = document.getElementById('specifications-container');
    
    if (!container) {
        console.error('建设规范容器未找到');
        return;
    }
    
    if (!specificationsData.sections || specificationsData.sections.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无建设规范信息</p>
            </div>
        `;
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建并添加章节
    specificationsData.sections.forEach(section => {
        const sectionElement = createSection(section);
        container.appendChild(sectionElement);
    });
}

