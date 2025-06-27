<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
interface HTMLElement {
    _rippleCleanup?: () => void;
}

const createRippleEffect = (el: HTMLElement): void => {
    (el as HTMLDivElement).style.position = 'relative';
    (el as HTMLDivElement).style.overflow = 'hidden';
    
    const handleRipple = (event: MouseEvent | TouchEvent) => {
        const rect = (el as HTMLDivElement).getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        
        const ripple = document.createElement('div');
        ripple.className = 'mizu-ripple';
        
        // 获取自定义颜色
        const colorValue = (el as Element).getAttribute('mizu-ripple');
        if (colorValue) {
            ripple.style.backgroundColor = `var(--mizu-color-${colorValue})`;
        }
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${clientX - rect.left - radius}px`;
        ripple.style.top = `${clientY - rect.top - radius}px`;
        
        (el as HTMLDivElement).appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    };

    (el as HTMLDivElement).addEventListener('mousedown', handleRipple);
    (el as HTMLDivElement).addEventListener('touchstart', handleRipple);
    
    // Store cleanup function
    el._rippleCleanup = () => {
        (el as HTMLDivElement).removeEventListener('mousedown', handleRipple);
        (el as HTMLDivElement).removeEventListener('touchstart', handleRipple);
    };
};

const mizuRipple = (): void => {
    const elements = document.querySelectorAll('[mizu-ripple]');
    elements.forEach((el) => {
        createRippleEffect(el as HTMLElement);
    });

    // 观察新添加的元素
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement && node.hasAttribute('mizu-ripple')) {
                    createRippleEffect(node as HTMLElement);
                }
            });
        });
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
};

export default {
    name: 'MizuRipple',
    mounted() {
        setTimeout(mizuRipple);
    },
    updated() {
        mizuRipple();
    }
};

export { createRippleEffect, mizuRipple };
</script>

<style lang="stylus">
@import url('style/ripple.styl');
</style>
