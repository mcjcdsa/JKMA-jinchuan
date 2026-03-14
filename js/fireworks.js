/**
 * 烟花彩蛋模块
 * 每年8月23日触发烟花效果
 */

import { initBirthdayCake } from './birthday-cake.js';

/**
 * 创建烟花粒子
 */
class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.gravity = 0.1;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * 创建烟花
 */
class Firework {
    constructor(x, y, targetY) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: -Math.random() * 3 - 3
        };
        this.exploded = false;
        this.particles = [];
        this.colors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
            '#ff00ff', '#00ffff', '#ff8800', '#ff0088'
        ];
    }

    update() {
        if (!this.exploded) {
            this.velocity.y += 0.1;
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (this.y <= this.targetY) {
                this.explode();
            }
        }
    }

    explode() {
        this.exploded = true;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const particleCount = 50 + Math.random() * 50;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new FireworkParticle(this.x, this.y, color));
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.particles.forEach(particle => particle.draw(ctx));
        }
    }

    isFinished() {
        return this.exploded && this.particles.length === 0;
    }
}

/**
 * 烟花管理器
 */
class FireworksManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.fireworks = [];
        this.animationId = null;
        this.lastFireworkTime = 0;
        this.fireworkInterval = 500; // 每500ms发射一个烟花
    }

    init() {
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'fireworks-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    launchFirework() {
        const x = Math.random() * this.canvas.width;
        const targetY = Math.random() * this.canvas.height * 0.5;
        this.fireworks.push(new Firework(x, this.canvas.height, targetY));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const now = Date.now();
        if (now - this.lastFireworkTime > this.fireworkInterval) {
            this.launchFirework();
            this.lastFireworkTime = now;
        }

        // 更新和绘制烟花
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            firework.update();
            firework.updateParticles();
            firework.draw(this.ctx);

            if (firework.isFinished()) {
                this.fireworks.splice(i, 1);
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.init();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.fireworks = [];
    }
}

/**
 * 检查是否为8月23日
 */
function isAugust23() {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() 返回 0-11
    const day = now.getDate();
    return month === 8 && day === 23;
}

/**
 * 初始化烟花彩蛋
 */
let fireworksManager = null;

export function initFireworksEasterEgg() {
    if (!isAugust23()) {
        return; // 不是8月23日，不触发
    }

    // 延迟一点启动，让页面先加载
    setTimeout(() => {
        try {
            fireworksManager = new FireworksManager();
            fireworksManager.start();
            
            // 显示提示信息
            showFireworksMessage();
            
            // 初始化生日蛋糕
            initBirthdayCake();
            
            console.log('🎆 烟花彩蛋已触发！今天是8月23日，金川市成立纪念日！');
        } catch (error) {
            console.error('烟花效果初始化失败:', error);
        }
    }, 1000);
}

/**
 * 显示烟花提示信息
 */
export function showFireworksMessage() {
    const message = document.createElement('div');
    message.id = 'fireworks-message';
    message.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 16px;
        font-weight: bold;
        animation: slideDown 0.5s ease;
        pointer-events: none;
    `;
    message.textContent = '🎆 今天是8月23日，金川市成立纪念日！';
    
    // 添加动画样式
    if (!document.getElementById('fireworks-style')) {
        const style = document.createElement('style');
        style.id = 'fireworks-style';
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    // 5秒后淡出
    setTimeout(() => {
        message.style.transition = 'opacity 1s ease';
        message.style.opacity = '0';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 1000);
    }, 5000);
}

/**
 * 手动触发烟花（用于测试）
 */
export function triggerFireworks() {
    if (!fireworksManager) {
        fireworksManager = new FireworksManager();
        fireworksManager.start();
        showFireworksMessage();
    }
}

