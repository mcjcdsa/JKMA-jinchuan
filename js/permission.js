/**
 * 权限申请页面逻辑
 */

import { debounce } from './utils.js';

// API配置（需要根据实际部署情况修改）
const API_BASE_URL = 'https://api.jkma.city'; // 示例API地址，需要替换为实际地址
const API_ENDPOINTS = {
    apply: '/api/permission/apply',
    status: '/api/permission/status'
};

// 验证码相关
let currentCaptcha = '';
let captchaAnswer = '';

/**
 * 生成验证码
 */
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    let displayText;
    
    switch (operator) {
        case '+':
            answer = num1 + num2;
            displayText = `${num1} + ${num2} = ?`;
            break;
        case '-':
            // 确保结果为正数
            const maxNum = Math.max(num1, num2);
            const minNum = Math.min(num1, num2);
            answer = maxNum - minNum;
            displayText = `${maxNum} - ${minNum} = ?`;
            break;
        case '×':
            // 使用较小的数字避免结果过大
            const small1 = Math.min(num1, 5);
            const small2 = Math.min(num2, 5);
            answer = small1 * small2;
            displayText = `${small1} × ${small2} = ?`;
            break;
    }
    
    currentCaptcha = displayText;
    captchaAnswer = answer.toString();
    
    const captchaText = document.getElementById('captcha-text');
    if (captchaText) {
        captchaText.textContent = displayText;
    }
}

/**
 * 验证Minecraft用户名格式
 * @param {string} username - 用户名
 * @returns {boolean} - 是否有效
 */
function validateMinecraftUsername(username) {
    if (!username) return false;
    // 1-16个字符，仅支持字母、数字、下划线
    const pattern = /^[a-zA-Z0-9_]{1,16}$/;
    return pattern.test(username);
}

/**
 * 验证QQ号格式（可选）
 * @param {string} qq - QQ号
 * @returns {boolean} - 是否有效
 */
function validateQQNumber(qq) {
    if (!qq) return true; // QQ号为可选
    // QQ号通常是5-15位数字
    const pattern = /^\d{5,15}$/;
    return pattern.test(qq);
}

/**
 * 显示表单错误
 * @param {string} fieldId - 字段ID
 * @param {string} message - 错误消息
 */
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

/**
 * 清除表单错误
 * @param {string} fieldId - 字段ID
 */
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

/**
 * 验证表单
 * @returns {boolean} - 是否通过验证
 */
function validateForm() {
    let isValid = true;
    
    // 验证游戏账号名称
    const username = document.getElementById('minecraft-username').value.trim();
    if (!username) {
        showFieldError('username', '请输入游戏账号名称');
        isValid = false;
    } else if (!validateMinecraftUsername(username)) {
        showFieldError('username', '游戏账号名称格式不正确（1-16个字符，仅支持字母、数字、下划线）');
        isValid = false;
    } else {
        clearFieldError('username');
    }
    
    // 验证QQ号（可选）
    const qq = document.getElementById('qq-number').value.trim();
    if (qq && !validateQQNumber(qq)) {
        showFieldError('qq', 'QQ号格式不正确（5-15位数字）');
        isValid = false;
    } else {
        clearFieldError('qq');
    }
    
    // 验证验证码
    const captcha = document.getElementById('captcha').value.trim();
    if (!captcha) {
        showFieldError('captcha', '请输入验证码');
        isValid = false;
    } else if (captcha !== captchaAnswer) {
        showFieldError('captcha', '验证码错误，请重新输入');
        generateCaptcha(); // 重新生成验证码
        document.getElementById('captcha').value = '';
        isValid = false;
    } else {
        clearFieldError('captcha');
    }
    
    return isValid;
}

/**
 * 显示提交结果
 * @param {string} type - 结果类型（success/error/info）
 * @param {string} message - 消息内容
 */
function showSubmitResult(type, message) {
    const resultElement = document.getElementById('submit-result');
    if (!resultElement) return;
    
    resultElement.className = `submit-result ${type}`;
    resultElement.textContent = message;
    resultElement.style.display = 'block';
    
    // 如果是成功，3秒后隐藏
    if (type === 'success') {
        setTimeout(() => {
            resultElement.style.display = 'none';
        }, 5000);
    }
}

/**
 * 提交申请
 * @param {Event} event - 表单提交事件
 */
async function submitApplication(event) {
    event.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
        return;
    }
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // 禁用提交按钮
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // 收集表单数据
    const formData = {
        minecraft_username: document.getElementById('minecraft-username').value.trim(),
        qq_number: document.getElementById('qq-number').value.trim() || null,
        reason: document.getElementById('reason').value.trim() || null,
        captcha: document.getElementById('captcha').value.trim()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.apply}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSubmitResult('success', `申请提交成功！申请ID：${result.request_id || result.data?.id || 'N/A'}。管理员会在1-3个工作日内审核。`);
            // 重置表单
            document.getElementById('permission-form').reset();
            generateCaptcha();
        } else {
            showSubmitResult('error', result.message || '申请提交失败，请稍后重试');
            // 重新生成验证码
            generateCaptcha();
            document.getElementById('captcha').value = '';
        }
    } catch (error) {
        console.error('提交申请失败:', error);
        showSubmitResult('error', '网络错误，请检查网络连接后重试');
        // 重新生成验证码
        generateCaptcha();
        document.getElementById('captcha').value = '';
    } finally {
        // 恢复提交按钮
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

/**
 * 查询申请状态
 */
async function queryStatus() {
    const username = document.getElementById('query-username').value.trim();
    const queryBtn = document.getElementById('query-btn');
    const queryResult = document.getElementById('query-result');
    
    if (!username) {
        queryResult.className = 'query-result error show';
        queryResult.innerHTML = '<p>请输入游戏账号名称</p>';
        return;
    }
    
    if (!validateMinecraftUsername(username)) {
        queryResult.className = 'query-result error show';
        queryResult.innerHTML = '<p>游戏账号名称格式不正确</p>';
        return;
    }
    
    // 禁用查询按钮
    queryBtn.disabled = true;
    queryBtn.textContent = '查询中...';
    queryResult.className = 'query-result show';
    queryResult.innerHTML = '<p>正在查询...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.status}?username=${encodeURIComponent(username)}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const data = result.data;
            const statusMap = {
                'pending': { text: '待审核', class: 'pending' },
                'approved': { text: '已通过', class: 'approved' },
                'rejected': { text: '已拒绝', class: 'rejected' },
                'processed': { text: '已处理', class: 'processed' }
            };
            
            const statusInfo = statusMap[data.status] || { text: data.status, class: 'pending' };
            
            let html = '<div class="status-info">';
            html += `<div><span class="status-label">游戏账号：</span><span class="status-value">${escapeHtml(data.minecraft_username)}</span></div>`;
            html += `<div><span class="status-label">申请状态：</span><span class="status-value">${statusInfo.text}</span><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></div>`;
            html += `<div><span class="status-label">申请时间：</span><span class="status-value">${formatDateTime(data.created_at)}</span></div>`;
            
            if (data.processed_at) {
                html += `<div><span class="status-label">处理时间：</span><span class="status-value">${formatDateTime(data.processed_at)}</span></div>`;
            }
            
            if (data.reject_reason) {
                html += `<div><span class="status-label">拒绝原因：</span><span class="status-value">${escapeHtml(data.reject_reason)}</span></div>`;
            }
            
            if (data.qq_number) {
                html += `<div><span class="status-label">QQ号：</span><span class="status-value">${escapeHtml(data.qq_number)}</span></div>`;
            }
            
            html += '</div>';
            
            queryResult.className = 'query-result success show';
            queryResult.innerHTML = html;
        } else {
            queryResult.className = 'query-result error show';
            queryResult.innerHTML = `<p>${result.message || '未找到申请记录'}</p>`;
        }
    } catch (error) {
        console.error('查询状态失败:', error);
        queryResult.className = 'query-result error show';
        queryResult.innerHTML = '<p>网络错误，请检查网络连接后重试</p>';
    } finally {
        // 恢复查询按钮
        queryBtn.disabled = false;
        queryBtn.textContent = '查询';
    }
}

/**
 * 转义HTML
 * @param {string} text - 文本
 * @returns {string} - 转义后的文本
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 格式化日期时间
 * @param {string} dateTime - 日期时间字符串
 * @returns {string} - 格式化后的日期时间
 */
function formatDateTime(dateTime) {
    if (!dateTime) return 'N/A';
    try {
        const date = new Date(dateTime);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateTime;
    }
}

/**
 * 切换标签页
 * @param {string} tabName - 标签页名称
 */
function switchTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有标签按钮的active状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 激活选中的标签按钮
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // 如果切换到查询标签页，清空查询结果
    if (tabName === 'query') {
        const queryResult = document.getElementById('query-result');
        if (queryResult) {
            queryResult.className = 'query-result';
            queryResult.innerHTML = '';
        }
    }
}

/**
 * 初始化权限申请页面
 */
export function initPermissionPage() {
    // 生成初始验证码
    generateCaptcha();
    
    // 绑定验证码刷新按钮
    const refreshCaptchaBtn = document.getElementById('refresh-captcha');
    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', () => {
            generateCaptcha();
            document.getElementById('captcha').value = '';
            clearFieldError('captcha');
        });
    }
    
    // 绑定表单提交
    const form = document.getElementById('permission-form');
    if (form) {
        form.addEventListener('submit', submitApplication);
        
        // 实时验证游戏账号名称
        const usernameInput = document.getElementById('minecraft-username');
        if (usernameInput) {
            usernameInput.addEventListener('input', debounce(() => {
                const username = usernameInput.value.trim();
                if (username && !validateMinecraftUsername(username)) {
                    showFieldError('username', '格式不正确（1-16个字符，仅支持字母、数字、下划线）');
                } else {
                    clearFieldError('username');
                }
            }, 300));
        }
        
        // 实时验证QQ号
        const qqInput = document.getElementById('qq-number');
        if (qqInput) {
            qqInput.addEventListener('input', debounce(() => {
                const qq = qqInput.value.trim();
                if (qq && !validateQQNumber(qq)) {
                    showFieldError('qq', '格式不正确（5-15位数字）');
                } else {
                    clearFieldError('qq');
                }
            }, 300));
        }
        
        // 重置表单时重新生成验证码
        form.addEventListener('reset', () => {
            generateCaptcha();
            // 清除所有错误
            document.querySelectorAll('.form-error').forEach(el => {
                el.textContent = '';
            });
            document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
                el.classList.remove('error');
            });
        });
    }
    
    // 绑定标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // 绑定查询按钮
    const queryBtn = document.getElementById('query-btn');
    if (queryBtn) {
        queryBtn.addEventListener('click', queryStatus);
    }
    
    // 绑定查询输入框回车键
    const queryInput = document.getElementById('query-username');
    if (queryInput) {
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                queryStatus();
            }
        });
    }
}

