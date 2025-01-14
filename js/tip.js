let currentTop = 70; // 用于跟踪当前提示框的顶部位置
const promptBoxes = []; // 用于存储所有提示框的引用

function showPrompt(message, isSuccess) {
    const promptBox = document.createElement('div');
    promptBox.className = 'prompt-box' + (isSuccess ? '' : ' error');
    promptBox.style.top = currentTop + 'px'; // 设置当前提示框的顶部位置
    promptBox.innerHTML = `
        <span>${message}</span>
    `;
    document.body.appendChild(promptBox);
    promptBoxes.push(promptBox); // 添加到数组中

    // 更新当前顶部位置，为下一个提示框预留空间
    currentTop += 70; // 每个提示框之间有 40px 的间隔

    // 使用 setTimeout 来确保元素被添加到 DOM 后再触发动画
    setTimeout(() => {
        promptBox.classList.add('show');
    }, 10);

    // 自动关闭提示框
    setTimeout(() => {
        closePrompt({ currentTarget: promptBox });
    }, 3000); // 3秒后自动关闭
}

function closePrompt(event) {
    const promptBox = event.currentTarget;
    const index = promptBoxes.indexOf(promptBox);
    if (index !== -1) {
        promptBoxes.splice(index, 1); // 从数组中移除当前提示框
        currentTop -= 70; // 更新当前顶部位置

        // 使用 requestAnimationFrame 确保动画的平滑性
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                promptBox.classList.remove('show');
                promptBox.addEventListener('transitionend', () => {
                    promptBox.remove();
                    adjustPositions();
                }, { once: true });
            });
        });
    }
}

function adjustPositions() {
    promptBoxes.forEach((box, index) => {
        box.style.top = 70 + index * 70 + 'px';
    });
}