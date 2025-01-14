// API 端点
const apiUrl = 'https://api.mcsrvstat.us/2/play.pamc.top';

// 获取 JSON 数据并渲染
async function fetchAndDisplayJSON() {
    const container = document.getElementById('jsonContainer');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    try {
        // 显示加载中...
        loading.style.display = 'block';
        container.style.display = 'none';
        error.textContent = '';

        // 发起 API 请求
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        // 渲染 JSON 数据
        container.innerHTML = renderJSON(data);
        container.style.display = 'block';
        loading.style.display = 'none';

        // 显示刷新提示
        showPrompt('数据已更新！', true);
        setTimeout(() => {
            document.querySelector('.prompt-box').remove(); // 自动移除提示框
        }, 3000); // 3秒后自动消失
    } catch (err) {
        // 显示错误消息
        console.error('Fetch error:', err);
        showPrompt('加载失败，请检查网络连接或API链接的有效性。', false);
        loading.style.display = 'none';
        container.style.display = 'none';
        error.textContent = '加载失败，请稍后再试。';
    }
}

function renderJSON(obj, indent = 0) {
    let html = '';
    const space = '  '.repeat(indent);

    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            html += '[\n';
            obj.forEach((item, index) => {
                html += `${space}  ${renderJSON(item, indent + 1)}${index < obj.length - 1 ? ',' : ''}\n`;
            });
            html += `${space}]`;
        } else {
            html += '{\n';
            const keys = Object.keys(obj);
            keys.forEach((key, index) => {
                html += `${space}  <span class="json-key">"${key}"</span>: ${renderJSON(obj[key], indent + 1)}${index < keys.length - 1 ? ',' : ''}\n`;
            });
            html += `${space}}`;
        }
    } else if (typeof obj === 'string') {
        html += `<span class="json-string">"${obj}"</span>`;
    } else if (typeof obj === 'number') {
        html += `<span class="json-number">${obj}</span>`;
    } else if (typeof obj === 'boolean') {
        html += `<span class="json-boolean">${obj}</span>`;
    } else if (obj === null) {
        html += `<span class="json-null">null</span>`;
    } else {
        html += obj;
    }

    return html;
}

// 初始化并每30秒自动重载
fetchAndDisplayJSON();
setInterval(fetchAndDisplayJSON, 30000); // 30000毫秒（30秒）后再次调用