function initTabs() {
    // Tab 组件实现
    document.querySelectorAll('[mizu-tab]').forEach(tabContainer => {
        const tabs = Array.from(tabContainer.querySelectorAll('a'));
        const panels = tabs.map(tab => document.querySelector(tab.getAttribute('href')));
        // 新增：包裹所有panel的父容器
        const panelParent = panels[0]?.parentElement;
        let lastActiveIdx = null;

        // 查找初始选中项
        function getInitialActiveIdx() {
            if (panelParent && panelParent.hasAttribute('indeterminate')) {
                return null;
            }
            for (let i = 0; i < panels.length; i++) {
                if (panels[i].hasAttribute('checked')) {
                    return i;
                }
            }
            return 0;
        }

        function setPanelHeightForTransition(targetPanel) {
            if (!panelParent) return;
            // 先获取当前高度（已渲染的高度）
            const prevHeight = panelParent.getBoundingClientRect().height;
            // 目标panel必须可见才能测量高度，但不能提前隐藏其它panel，否则动画会丢失
            // 强制reflow
            void panelParent.offsetHeight;
            const targetHeight = targetPanel.scrollHeight;
            // 先把父元素高度锁定为当前高度
            panelParent.style.height = prevHeight + 'px';
            // 触发 reflow
            void panelParent.offsetHeight;
            // 再过渡到目标高度
            panelParent.style.height = targetHeight + 'px';
            // 动画结束后清除高度
            setTimeout(() => {
                panelParent.style.height = '';
            }, 300); // 与CSS动画时长一致
        }

        function activateTab(idx) {
            // 动画进行中允许打断：先移除所有动画相关class和事件
            tabs.forEach((tab, i) => {
                panels[i].classList.remove(
                    'mizu-panel-enter-left',
                    'mizu-panel-enter-right',
                    'mizu-panel-exit-left',
                    'mizu-panel-exit-right'
                );
                // 移除所有 animationend 事件
                // 重新获取引用
                panels[i] = document.querySelector(tab.getAttribute('href'));
            });

            if (idx === null) {
                // 没有选中项，全部 inactive
                tabs.forEach((tab, i) => {
                    tab.classList.remove('mizu-tab-active');
                    panels[i].classList.remove('mizu-panel-active', 'mizu-panel-enter-left', 'mizu-panel-enter-right', 'mizu-panel-exit-left', 'mizu-panel-exit-right');
                    panels[i].classList.add('mizu-panel-inactive');
                });
                lastActiveIdx = null;
                if (panelParent) panelParent.style.height = '';
                return;
            }
            if (lastActiveIdx === null && idx !== null) {
                // 首次初始化，全部设为 inactive，仅选中项 active
                tabs.forEach((tab, i) => {
                    if (i === idx) {
                        tab.classList.add('mizu-tab-active');
                        panels[i].classList.add('mizu-panel-active');
                        panels[i].classList.remove('mizu-panel-inactive');
                    } else {
                        tab.classList.remove('mizu-tab-active');
                        panels[i].classList.remove('mizu-panel-active');
                        panels[i].classList.add('mizu-panel-inactive');
                    }
                });
                setPanelHeightForTransition(panels[idx]);
                lastActiveIdx = idx;
                return;
            }
            if (idx === lastActiveIdx) return; // 如果是同一个选项则不做任何操作
            const isRight = idx > lastActiveIdx;
            const enterClass = isRight ? 'mizu-panel-enter-left' : 'mizu-panel-enter-right';
            const exitClass = isRight ? 'mizu-panel-exit-left' : 'mizu-panel-exit-right';
            let animations = 0;
            let finished = 0;
            // 先设置高度动画（目标panel已display:block，其它panel保持原状态，动画正常）
            setPanelHeightForTransition(panels[idx]);
            tabs.forEach((tab, i) => {
                if (i === idx) {
                    tab.classList.add('mizu-tab-active');
                    panels[i].classList.remove('mizu-panel-inactive');
                    panels[i].classList.add(enterClass);
                    panelParent.classList.add('mizu-panel-animated'); // 添加动画类
                    animations++;
                    panels[i].addEventListener('animationend', function handler() {
                        panels[i].classList.remove(enterClass);
                        panelParent.classList.remove('mizu-panel-animated');
                        panels[i].classList.add('mizu-panel-active');
                        panels[i].removeEventListener('animationend', handler);
                        finished++;
                        if (finished === animations) activateTab.animating = false;
                    });
                } else {
                    tab.classList.remove('mizu-tab-active');
                    if (panels[i].classList.contains('mizu-panel-active')) {
                        panels[i].classList.add(exitClass);
                        animations++;
                        panels[i].addEventListener('animationend', function handler() {
                            panels[i].classList.remove(exitClass);
                            panels[i].classList.remove('mizu-panel-active');
                            panels[i].classList.add('mizu-panel-inactive');
                            panels[i].removeEventListener('animationend', handler);
                            finished++;
                            if (finished === animations) activateTab.animating = false;
                        });
                    } else {
                        panels[i].classList.remove('mizu-panel-active');
                        panels[i].classList.add('mizu-panel-inactive');
                    }
                }
            });
            if (animations === 0) activateTab.animating = false;
            lastActiveIdx = idx;
        }
        // 绑定点击事件
        tabs.forEach((tab, idx) => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                activateTab(idx);
            });
        });
        // 默认激活项
        activateTab(getInitialActiveIdx());
    });
}


// 页面加载后初始化
document.addEventListener('DOMContentLoaded', function () {
    initTabs();
});

export { initTabs };