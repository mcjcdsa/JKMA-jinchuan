/**
 * 时间轴模块
 * 处理城市历史时间轴的展示和交互
 */

// 城市历史事件数据
const timelineEvents = [
    {
        date: '2020-07',
        title: 'TUS成立（金川市前身）',
        description: '金川市市长黑狗妹妹受到TIS里面的轨道交通影响，便有了建设轨道交通的想法，金川市前身TUS成立（后改名金川市）。这是金川市历史的起点。'
    },
    {
        date: '2020-08-23',
        title: '金川市正式成立',
        description: '金川市正式成立！在成立当天，一代中的地铁一号线草原站（后改名浏阳河站）开始建设。一代的金川市全部由黑狗妹妹负责建设，标志着城市建设的正式开始。'
    },
    {
        date: '2020-11',
        title: '地铁一号线3座车站完成',
        description: '金川地铁一号线已经完成了3座车站施工，轨道交通建设取得初步成果。'
    },
    {
        date: '2021-02',
        title: '地铁一号线一期开通',
        description: '金川地铁一号线一期（浏阳河到羊甫）正式开通！这是城市交通系统的重要里程碑。'
    },
    {
        date: '2021-03',
        title: '2号线开工建设',
        description: '金川地铁2号线（后来更改成3号线）开工建设，城市轨道交通网络继续扩展。'
    },
    {
        date: '2021-07',
        title: '地铁二号线一期开通',
        description: '金川地铁二号线一期正式开通，进一步完善了城市交通网络。'
    },
    {
        date: '2021-08',
        title: '地铁一号线二期开通',
        description: '金川地铁一号线二期开通，地铁一号线建设取得重大进展。'
    },
    {
        date: '2021-08-23',
        title: '金川市成立一周年庆',
        description: '金川市成立一周年庆典活动，回顾一年来的建设成果。城市轨道交通系统初具规模。'
    },
    {
        date: '2021-11',
        title: '4号线开工建设',
        description: '金川地铁4号线开工建设，城市轨道交通网络持续扩展。'
    },
    {
        date: '2022-03',
        title: '4号线一期开通',
        description: '金川地铁4号线一期正式开通，城市轨道交通网络进一步完善。'
    },
    {
        date: '2022-04',
        title: '市区线开始建设',
        description: '金川市市区线开始建设，标志着城市轨道交通建设进入新阶段。'
    },
    {
        date: '2022-06',
        title: '市区线一期开通',
        description: '金川市市区线一期正式开通，城市交通系统更加完善。'
    },
    {
        date: '2022-07',
        title: '3号线开通',
        description: '金川地铁3号线正式开通。至此，随着金川市市长拥有自己的手机，金川市一代结束。金川市一代只有轨道交通，并且质量不好，一号线是单向轨道。'
    },
    {
        date: '2023-01',
        title: '与林联建交',
        description: '金川市与林联（原来的长海）建交，建立友好合作关系，促进跨城市交流。'
    },
    {
        date: '2023-08',
        title: '金川市二代开始建设',
        description: '金川市二代开始在网易建设。二代建设人员：黑狗妹妹、忘仔、汤姆猫、嗮明。城市发展进入新阶段。'
    },
    {
        date: '2023-12',
        title: '团队调整',
        description: '由于一些事件，金川市被迫开除了忘仔、汤姆猫（这次事件是别个工艺出现的，波及到金川工艺群里一些人）。团队进行调整。'
    },
    {
        date: '2023-12',
        title: '二代结束',
        description: '二代由于金川市市长没有合理规划，导致二代结束。城市发展进入反思和调整期。'
    },
    {
        date: '2024-01',
        title: '金川市三代开始建设',
        description: '金川市3代开始建设，建设人员包括：雪碧、建地铁的新手、一只merry、CR_长客金凤凰、狂笑的人出击、滨江。城市进入蓬勃发展期。'
    },
    {
        date: '2024-02',
        title: '三代南北长度突破1000格',
        description: '金川市三代南北长度突破1000格，城市规模快速扩大，建设取得重大进展。'
    },
    {
        date: '2024-06',
        title: '三代停止建设并发布0.1版本',
        description: '由于市长的原因，三代被迫停止建设。在这个时期，狂笑的人出击因为在群里多次发政治和建违章建筑被踢出去并且拉入一级黑名单。6月下旬金川市三代发布0.1版本，这是金川市2个作品发布之一。'
    },
    {
        date: '2024-08',
        title: '金川市四代开始建设',
        description: '金川市四代开始建设，建设人员包括：黑狗妹妹、雪碧、滨江。城市继续向前发展。'
    },
    {
        date: '2024-09',
        title: '金川南站开始建设',
        description: '金川南站开始建设，这是城市交通枢纽的重要节点。'
    },
    {
        date: '2024-10',
        title: '退出网易版，加入国际版',
        description: '金川市因为刚易的一些原因导致退出了网易版，加入国际版。这是城市发展的重要转折点。'
    },
    {
        date: '2024-11',
        title: 'JAVA版开始建设',
        description: '市长拥有人生中的第一台电脑，金川市JAVA版开始建设。城市进入全新的发展阶段。'
    },
    {
        date: '2025-05',
        title: '金川市二周目开始建设',
        description: '金川市二周目开始建设，城市发展进入新的周期，建设经验更加丰富。'
    },
    {
        date: '2026-03-14',
        title: '金川市与昆川市合并为JKMA都市圈',
        description: '金川市与昆川市正式合并为JKMA都市圈。这是城市发展史上的重要里程碑，标志着两个城市携手合作，共同进入新的发展阶段，将以全新的身份继续发展壮大。'
    },
    {
        date: '2026-03-14',
        title: '金川市官网上线',
        description: '金川市官方网站正式上线，为市民和访客提供便捷的信息查询和服务。网站成为城市对外展示的重要窗口，标志着城市信息化建设的新起点。'
    }
];

// 存储排序后的事件数组（用于索引映射）
let sortedEvents = [];

/**
 * 格式化日期显示
 */
function formatDateDisplay(dateString) {
    // 处理完整日期格式 YYYY-MM-DD
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = dateString.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        
        if (month === 8 && day === 23) {
            return `${year}年8月23日`;
        }
        return `${year}年${month}月${day}日`;
    }
    
    // 处理年月格式 YYYY-MM
    if (dateString.match(/^\d{4}-\d{2}$/)) {
        const parts = dateString.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        return `${year}年${month}月`;
    }
    
    return dateString;
}

/**
 * 初始化时间轴
 */
export function initTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) {
        console.error('时间轴元素未找到，请检查HTML中是否有id="timeline"的元素');
        return;
    }
    
    if (!timelineEvents || timelineEvents.length === 0) {
        console.error('时间轴事件数据为空');
        timeline.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">暂无历史事件数据</p>';
        return;
    }

    // 按日期排序（从早到晚）
    sortedEvents = [...timelineEvents].sort((a, b) => {
        // 标准化日期用于比较
        const dateA = a.date + (a.date.match(/^\d{4}-\d{2}$/) ? '-01' : '');
        const dateB = b.date + (b.date.match(/^\d{4}-\d{2}$/) ? '-01' : '');
        return new Date(dateA) - new Date(dateB);
    });

    // 生成时间轴HTML
    try {
        timeline.innerHTML = sortedEvents.map((event, index) => {
            const dateDisplay = formatDateDisplay(event.date);
            const originalIndex = timelineEvents.indexOf(event);

            return `
                <div class="timeline-item" data-index="${originalIndex}">
                    <div class="timeline-date">${dateDisplay}</div>
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-event" onclick="window.showEventDetail(${originalIndex})">
                            ${event.title}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log(`时间轴已生成，共${sortedEvents.length}个事件`);
    } catch (error) {
        console.error('生成时间轴HTML时出错:', error);
        timeline.innerHTML = '<p style="text-align: center; color: #dc2626; padding: 20px;">时间轴生成失败，请刷新页面重试</p>';
    }

    // 将函数暴露到全局作用域
    window.showEventDetail = showEventDetail;
    window.closeEventModal = closeEventModal;
}

/**
 * 显示事件详情
 */
function showEventDetail(index) {
    const event = timelineEvents[index];
    if (!event) return;

    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalDescription = document.getElementById('modal-description');

    if (!modal || !modalTitle || !modalDate || !modalDescription) return;

    // 格式化日期
    const dateDisplay = formatDateDisplay(event.date);

    modalTitle.textContent = event.title;
    modalDate.textContent = dateDisplay;
    modalDescription.textContent = event.description;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭事件详情模态框
 */
function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * 初始化模态框事件
 */
export function initModalEvents() {
    const modal = document.getElementById('event-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeEventModal);
    }

    if (modal) {
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEventModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeEventModal();
            }
        });
    }
}

// 页面加载完成后初始化模态框事件
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalEvents);
} else {
    initModalEvents();
}

