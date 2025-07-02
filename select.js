function initMizuSelect() {
    document.querySelectorAll('select.mizu-select[mizu-select]').forEach(function (select) {
        // 防止重复初始化
        if (select.dataset.mizuSelectInit) return;
        select.dataset.mizuSelectInit = "1";

        // 创建自定义下拉结构
        const wrapper = document.createElement('div');
        wrapper.className = 'mizu-select-wrapper';

        const display = document.createElement('div');
        display.className = 'mizu-select-display';

        const arrow = document.createElement('span');
        arrow.className = 'mizu-select-arrow';
        arrow.innerHTML = '&#9662;'; // ▼
        display.appendChild(arrow);

        // 下拉选项及自定义滚动条
        const optionsList = document.createElement('div');
        optionsList.className = 'mizu-select-options';

        const optionsInner = document.createElement('div');
        optionsInner.className = 'mizu-select-options-inner';

        // 生成选项
        Array.from(select.options).forEach((opt, idx) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'mizu-select-option';
            optionDiv.textContent = opt.textContent;
            optionDiv.dataset.value = opt.value;
            if (opt.disabled) optionDiv.classList.add('disabled');
            if (opt.selected) optionDiv.classList.add('selected');
            optionDiv.addEventListener('click', function () {
                if (opt.disabled) return;
                select.selectedIndex = idx;
                display.childNodes[0].nodeValue = opt.textContent;
                optionsInner.querySelectorAll('.mizu-select-option').forEach(el => el.classList.remove('selected'));
                optionDiv.classList.add('selected');
                wrapper.classList.remove('open');
                select.dispatchEvent(new Event('change'));
            });
            optionsInner.appendChild(optionDiv);
        });

        // 自定义滚动条结构
        const scrollbarTrack = document.createElement('div');
        scrollbarTrack.className = 'mizu-scrollbar-track';
        const scrollbarThumb = document.createElement('div');
        scrollbarThumb.className = 'mizu-scrollbar-thumb';
        scrollbarTrack.appendChild(scrollbarThumb);

        optionsList.appendChild(optionsInner);
        optionsList.appendChild(scrollbarTrack);

        // 设置初始显示文本
        const selectedOpt = select.options[select.selectedIndex] || select.options[0];
        display.insertBefore(document.createTextNode(selectedOpt ? selectedOpt.textContent : ''), arrow);

        // 显示/隐藏下拉
        display.addEventListener('click', function (e) {
            e.stopPropagation();
            document.querySelectorAll('.mizu-select-wrapper.open').forEach(w => {
                if (w !== wrapper) w.classList.remove('open');
            });
            wrapper.classList.toggle('open');
            if (wrapper.classList.contains('open')) {
                // 强制刷新高度，确保滑块正确
                requestAnimationFrame(updateScrollbar);
            }
        });

        // 点击外部关闭（拖动滑块时不关闭）
        document.addEventListener('mousedown', function (e) {
            // 如果正在拖动滑块，不关闭
            if (e.target === scrollbarThumb) return;
            // 如果点击在当前下拉面板内，不关闭
            if (wrapper.contains(e.target)) return;
            wrapper.classList.remove('open');
        });

        // 同步原生select变化
        select.addEventListener('change', function () {
            const idx = select.selectedIndex;
            optionsInner.querySelectorAll('.mizu-select-option').forEach(el => el.classList.remove('selected'));
            const opts = optionsInner.querySelectorAll('.mizu-select-option');
            if (opts[idx]) {
                opts[idx].classList.add('selected');
                display.childNodes[0].nodeValue = select.options[idx].textContent;
            }
        });

        // 滚动条高度和位置（固定高度）
        function updateScrollbar() {
            const visibleHeight = optionsInner.clientHeight;
            const totalHeight = optionsInner.scrollHeight;
            const fixedThumbHeight = 40; // 固定滑块高度(px)
            if (totalHeight <= visibleHeight) {
                scrollbarThumb.style.display = 'none';
                return;
            }
            scrollbarThumb.style.display = 'block';
            scrollbarThumb.style.height = fixedThumbHeight + 'px';
            const trackHeight = scrollbarTrack.offsetHeight || visibleHeight;
            const maxScroll = totalHeight - visibleHeight;
            const maxThumbMove = trackHeight - fixedThumbHeight;
            const scrollRatio = maxScroll > 0 ? optionsInner.scrollTop / maxScroll : 0;
            scrollbarThumb.style.top = (maxThumbMove * scrollRatio) + 'px';
        }

        // 滚动时更新滑块
        optionsInner.addEventListener('scroll', updateScrollbar);
        window.addEventListener('resize', updateScrollbar);

        // MutationObserver监听子元素变化，动态更新滑块
        new MutationObserver(updateScrollbar).observe(optionsInner, { childList: true, subtree: true });

        // 拖拽滑块
        let dragging = false, dragStartY = 0, dragStartThumbTop = 0;
        scrollbarThumb.addEventListener('mousedown', function (e) {
            e.preventDefault();
            dragging = true;
            dragStartY = e.clientY;
            // 记录当前thumb的top值（像素）
            dragStartThumbTop = parseFloat(scrollbarThumb.style.top) || 0;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            const visibleHeight = optionsInner.clientHeight;
            const totalHeight = optionsInner.scrollHeight;
            const trackHeight = scrollbarTrack.offsetHeight || visibleHeight;
            const thumbHeight = parseFloat(scrollbarThumb.style.height) || 24;
            const maxScroll = totalHeight - visibleHeight;
            const maxThumbMove = trackHeight - thumbHeight;
            // 鼠标移动的距离
            const delta = e.clientY - dragStartY;
            // 新的thumb top
            let newThumbTop = dragStartThumbTop + delta;
            newThumbTop = Math.max(0, Math.min(maxThumbMove, newThumbTop));
            // thumb位置转为scrollTop
            const newScrollRatio = maxThumbMove > 0 ? newThumbTop / maxThumbMove : 0;
            optionsInner.scrollTop = newScrollRatio * maxScroll;
        });
        document.addEventListener('mouseup', function () {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
            }
        });

        // 鼠标悬停显示滚动条
        optionsInner.addEventListener('mouseenter', function () {
            scrollbarTrack.style.opacity = '1';
        });
        optionsInner.addEventListener('mouseleave', function () {
            scrollbarTrack.style.opacity = '';
        });

        // 插入DOM
        wrapper.appendChild(display);
        wrapper.appendChild(optionsList);
        select.parentNode.insertBefore(wrapper, select);

        // 初始化滚动条
        setTimeout(updateScrollbar, 0);
    });
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', function () {
    initMizuSelect();
});

export { initMizuSelect };