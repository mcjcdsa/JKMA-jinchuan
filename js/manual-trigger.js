/**
 * 手动触发按钮模块
 * 用于测试和演示烟花和生日蛋糕效果
 */

import { triggerFireworks } from './fireworks.js';
import { triggerBirthdayCake } from './birthday-cake.js';

/**
 * 创建手动触发按钮
 */
export function createManualTriggerButton() {
    // 检查是否已存在按钮
    if (document.getElementById('manual-trigger-btn')) {
        return;
    }
    
    const button = document.createElement('button');
    button.id = 'manual-trigger-btn';
    button.className = 'manual-trigger-btn';
    button.innerHTML = '<span class="trigger-icon">🎆🎂</span><span class="trigger-text">体验纪念日效果</span>';
    button.setAttribute('aria-label', '手动触发烟花和生日蛋糕效果');
    
    // 添加点击事件
    button.addEventListener('click', () => {
        triggerAllEffects();
    });
    
    // 添加到页面
    document.body.appendChild(button);
    
    // 添加样式（如果还没有）
    if (!document.getElementById('manual-trigger-styles')) {
        addManualTriggerStyles();
    }
}

/**
 * 触发所有效果
 */
function triggerAllEffects() {
    try {
        // 触发烟花效果（内部已包含提示信息）
        triggerFireworks();
        
        // 触发生日蛋糕效果
        triggerBirthdayCake();
        
        console.log('🎆🎂 手动触发成功！');
    } catch (error) {
        console.error('手动触发失败:', error);
    }
}

/**
 * 添加手动触发按钮样式
 */
function addManualTriggerStyles() {
    const style = document.createElement('style');
    style.id = 'manual-trigger-styles';
    style.textContent = `
        .manual-trigger-btn {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 9997;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
            animation: buttonPulse 2s ease-in-out infinite;
        }
        
        .manual-trigger-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        .manual-trigger-btn:active {
            transform: translateY(-1px);
        }
        
        @keyframes buttonPulse {
            0%, 100% {
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            50% {
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6);
            }
        }
        
        .trigger-icon {
            font-size: 20px;
            line-height: 1;
        }
        
        .trigger-text {
            white-space: nowrap;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .manual-trigger-btn {
                bottom: 20px;
                left: 20px;
                padding: 12px 20px;
                font-size: 14px;
            }
            
            .trigger-icon {
                font-size: 18px;
            }
            
            .trigger-text {
                display: none;
            }
        }
        
        @media (max-width: 480px) {
            .manual-trigger-btn {
                bottom: 15px;
                left: 15px;
                padding: 10px 15px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * 初始化手动触发按钮
 */
export function initManualTrigger() {
    // DOM加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createManualTriggerButton();
        });
    } else {
        createManualTriggerButton();
    }
}

