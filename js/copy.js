/**
 * 复制功能模块
 */

import { copyToClipboard } from './utils.js';
import { showSuccess, showError } from './toast.js';

/**
 * 初始化QQ群号复制功能
 * @param {string} qqNumber - QQ群号
 * @param {string} buttonId - 按钮元素ID
 * @param {string} hintId - 提示元素ID（保留兼容性，但使用Toast）
 */
export function initQQCopy(qqNumber, buttonId = 'qq-number', hintId = 'copy-hint') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener('click', async function() {
        const success = await copyToClipboard(qqNumber);
        if (success) {
            showSuccess('群号已复制到剪贴板！');
            // 兼容旧的提示方式
            const hint = document.getElementById(hintId);
            if (hint) {
                hint.textContent = '群号已复制到剪贴板！';
                hint.style.display = 'block';
                setTimeout(() => {
                    hint.style.display = 'none';
                }, 2000);
            }
        } else {
            showError('复制失败，请手动复制');
        }
    });
}

