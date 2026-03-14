/**
 * 生日蛋糕彩蛋模块
 * 每年8月23日显示生日蛋糕，点击显示市长感谢对话框
 */

/**
 * 计算金川市成立周年数
 */
function calculateAnniversary() {
    const foundationDate = new Date('2020-08-23T00:00:00');
    const now = new Date();
    
    // 设置当前日期为8月23日进行比较
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    
    // 如果还没到今年的8月23日，则周年数减1
    let anniversary = currentYear - foundationDate.getFullYear();
    if (currentMonth < 8 || (currentMonth === 8 && currentDay < 23)) {
        anniversary -= 1;
    }
    
    return Math.max(anniversary, 0);
}

/**
 * 创建生日蛋糕元素
 */
function createBirthdayCake() {
    const anniversary = calculateAnniversary();
    
    const cakeContainer = document.createElement('div');
    cakeContainer.id = 'birthday-cake-container';
    cakeContainer.className = 'birthday-cake-container';
    
    cakeContainer.innerHTML = `
        <div class="birthday-cake-wrapper">
            <div class="birthday-cake">
                <div class="cake-candles">
                    <div class="candle candle-1">
                        <div class="flame flame-1"></div>
                    </div>
                    <div class="candle candle-2">
                        <div class="flame flame-2"></div>
                    </div>
                    <div class="candle candle-3">
                        <div class="flame flame-3"></div>
                    </div>
                </div>
                <div class="cake-top"></div>
                <div class="cake-middle"></div>
                <div class="cake-bottom"></div>
            </div>
            <div class="cake-anniversary-text">
                今天是金川市成立${anniversary}周年纪念日
            </div>
        </div>
    `;
    
    // 添加点击事件
    cakeContainer.addEventListener('click', () => {
        showMayorDialog();
    });
    
    // 添加悬停提示
    cakeContainer.title = '点击蛋糕查看市长留言';
    
    return cakeContainer;
}

/**
 * 显示市长对话框
 */
function showMayorDialog() {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'mayor-dialog-overlay';
    overlay.id = 'mayor-dialog-overlay';
    
    // 创建对话框
    const dialog = document.createElement('div');
    dialog.className = 'mayor-dialog';
    dialog.id = 'mayor-dialog';
    
    dialog.innerHTML = `
        <div class="mayor-dialog-header">
            <div class="mayor-avatar">
                <img src="b_5e31ce00c9ed6a3e825e2fe6de151bbb.jpg" alt="市长" onerror="this.style.display='none'">
            </div>
            <div class="mayor-info">
                <h3 class="mayor-name">布莱克多格</h3>
                <p class="mayor-title">金川市市长</p>
            </div>
            <button class="mayor-dialog-close" id="mayor-dialog-close" aria-label="关闭对话框">×</button>
        </div>
        <div class="mayor-dialog-content">
            <div class="mayor-message">
                <p>感谢各位对金川市的支持</p>
            </div>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // 添加关闭事件
    const closeBtn = dialog.querySelector('#mayor-dialog-close');
    const closeDialog = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeDialog();
        }
    });
    
    // ESC键关闭
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeDialog();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // 显示动画
    setTimeout(() => {
        overlay.style.opacity = '1';
        dialog.style.transform = 'scale(1)';
    }, 10);
}

/**
 * 初始化生日蛋糕彩蛋
 */
export function initBirthdayCake() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 只在8月23日显示
    if (month !== 8 || day !== 23) {
        return;
    }
    
    // 延迟显示，让页面先加载
    setTimeout(() => {
        try {
            const cake = createBirthdayCake();
            document.body.appendChild(cake);
            
            // 添加蛋糕样式（如果还没有）
            if (!document.getElementById('birthday-cake-styles')) {
                addBirthdayCakeStyles();
            }
            
            console.log('🎂 生日蛋糕已显示！今天是金川市成立纪念日！');
        } catch (error) {
            console.error('生日蛋糕初始化失败:', error);
        }
    }, 1500);
}

/**
 * 添加生日蛋糕样式
 */
function addBirthdayCakeStyles() {
    const style = document.createElement('style');
    style.id = 'birthday-cake-styles';
    style.textContent = `
        /* 生日蛋糕容器 */
        .birthday-cake-container {
            position: fixed;
            bottom: 100px;
            right: 30px;
            z-index: 10000;
            cursor: pointer;
            animation: cakeFloat 3s ease-in-out infinite;
        }
        
        @keyframes cakeFloat {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        .birthday-cake-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        
        /* 生日蛋糕 */
        .birthday-cake {
            position: relative;
            width: 120px;
            height: 140px;
        }
        
        .cake-candles {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 15px;
            z-index: 10;
        }
        
        .candle {
            width: 8px;
            height: 30px;
            background: linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);
            border-radius: 4px;
            position: relative;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .flame {
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 12px;
            background: radial-gradient(circle, #ff6b00 0%, #ffaa00 50%, transparent 100%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            animation: flameFlicker 0.5s ease-in-out infinite alternate;
        }
        
        @keyframes flameFlicker {
            0% {
                transform: translateX(-50%) scale(1) rotate(-2deg);
            }
            100% {
                transform: translateX(-50%) scale(1.1) rotate(2deg);
            }
        }
        
        .cake-top {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 30px;
            background: linear-gradient(to bottom, #ff6b9d 0%, #ff8fab 100%);
            border-radius: 50px 50px 10px 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .cake-top::before {
            content: '';
            position: absolute;
            top: 5px;
            left: 10px;
            right: 10px;
            height: 8px;
            background: repeating-linear-gradient(
                90deg,
                #fff 0px,
                #fff 10px,
                transparent 10px,
                transparent 20px
            );
            border-radius: 4px;
        }
        
        .cake-middle {
            position: absolute;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 110px;
            height: 35px;
            background: linear-gradient(to bottom, #fff 0%, #f5f5f5 100%);
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .cake-bottom {
            position: absolute;
            top: 75px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 50px;
            background: linear-gradient(to bottom, #8b4513 0%, #654321 100%);
            border-radius: 10px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .cake-anniversary-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            white-space: nowrap;
            animation: textPulse 2s ease-in-out infinite;
        }
        
        @keyframes textPulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        /* 市长对话框 */
        .mayor-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .mayor-dialog {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .mayor-dialog-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            position: relative;
        }
        
        .mayor-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            flex-shrink: 0;
        }
        
        .mayor-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .mayor-info {
            flex: 1;
            color: white;
        }
        
        .mayor-name {
            margin: 0 0 5px 0;
            font-size: 20px;
            font-weight: bold;
        }
        
        .mayor-title {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .mayor-dialog-close {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border: none;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 50%;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .mayor-dialog-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .mayor-dialog-content {
            padding: 30px;
            text-align: center;
        }
        
        .mayor-message {
            font-size: 18px;
            line-height: 1.8;
            color: #333;
        }
        
        .mayor-message p {
            margin: 0;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .birthday-cake-container {
                bottom: 80px;
                right: 20px;
            }
            
            .birthday-cake {
                width: 100px;
                height: 120px;
            }
            
            .cake-top {
                width: 80px;
                height: 25px;
            }
            
            .cake-middle {
                width: 90px;
                height: 30px;
            }
            
            .cake-bottom {
                width: 100px;
                height: 40px;
            }
            
            .cake-anniversary-text {
                font-size: 12px;
                padding: 8px 16px;
            }
            
            .mayor-dialog {
                width: 95%;
            }
            
            .mayor-dialog-header {
                padding: 15px;
            }
            
            .mayor-avatar {
                width: 50px;
                height: 50px;
            }
            
            .mayor-name {
                font-size: 18px;
            }
            
            .mayor-dialog-content {
                padding: 20px;
            }
            
            .mayor-message {
                font-size: 16px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * 手动触发生日蛋糕（用于测试）
 */
export function triggerBirthdayCake() {
    if (!document.getElementById('birthday-cake-container')) {
        if (!document.getElementById('birthday-cake-styles')) {
            addBirthdayCakeStyles();
        }
        const cake = createBirthdayCake();
        document.body.appendChild(cake);
    }
}

