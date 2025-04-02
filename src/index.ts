import type { App } from 'vue';
import mizuButton from './components/button.vue';
import { mizuDynamicColors, mizuBackgroundColors, mizuTextColors } from './components/color.vue';
import mizuRipple from './components/ripple.vue';

const components = [
    mizuButton,
    mizuRipple
];

export function install(app: App) {
    components.forEach(component => {
        if (component.install) {
            component.install(app);
        } else if (component.name) {
            app.component(component.name, component);
        } else {
            console.warn('Component is missing a name:', component);
        }
    });
}

export default { install };

export {
    mizuDynamicColors,
    mizuBackgroundColors,
    mizuTextColors,
};