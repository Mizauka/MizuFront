<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
interface RGB {
    r: number;
    g: number;
    b: number;
}

// Removed unused HSL interface

interface ColorMap {
    [key: string]: string[];
}

// 应用动态取色功能
const mizuDynamicColors = (): void => {
    const elements = document.querySelectorAll('[mizu-color-dynamic]');
    elements.forEach((el) => {
        const colors = (el as HTMLElement).getAttribute('mizu-color-dynamic')?.split(',') || [];
        if (colors.length > 0) {
            const dynamicStyles = generateDynamicStyles(colors);
            injectStyles(dynamicStyles);
        }
    });
}

// 生成动态样式
const generateDynamicStyles = (colors: string[]): Record<string, string> => {
    const baseColors: ColorMap = {
        "red": ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C"],
        "pink": ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457", "#880E4F"],
        "purple": ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C"],
        "deep-purple": ["#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0", "#311B92"],
        "indigo": ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593", "#1A237E"],
        "blue": ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1"],
        "light-blue": ["#E1F5FE", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD", "#01579B"],
        "cyan": ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F", "#006064"],
        "teal": ["#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B", "#00695C", "#004D40"],
        "green": ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20"],
        "light-green": ["#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F", "#33691E"],
        "lime": ["#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24", "#827717"],
        "yellow": ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17"],
        "amber": ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00", "#FF6F00"],
        "orange": ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00", "#E65100"],
        "deep-orange": ["#FBE9E7", "#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043", "#FF5722", "#F4511E", "#E64A19", "#D84315", "#BF360C"],
        "brown": ["#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63", "#795548", "#6D4C41", "#5D4037", "#4E342E", "#3E2723"],
        "gray": ["#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#212121"],
        "blue-grey": ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"],
    };

    const dynamicColors: Record<string, string> = {};
    const shadeValues: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (let i = 0; i < shadeValues.length; i++) {
        const currentShadeColors = colors
            .map(color => baseColors[color]?.[i])
            .filter((color): color is string => !!color);

        if (currentShadeColors.length > 0) {
            const blendedColor = blendColors(currentShadeColors);
            dynamicColors[`--mizu-color-a-${shadeValues[i]}`] = blendedColor;
        }
    }

    return dynamicColors;
}

// 混合颜色
const blendColors = (colors: string[]): string => {
    if (!colors.length) return '#FFFFFF';

    const rgbColors = colors.map(hexToRgb).filter((color): color is RGB => !!color);
    if (!rgbColors.length) return '#FFFFFF';

    const blended: RGB = {
        r: Math.round(rgbColors.reduce((sum, { r }) => sum + r, 0) / rgbColors.length),
        g: Math.round(rgbColors.reduce((sum, { g }) => sum + g, 0) / rgbColors.length),
        b: Math.round(rgbColors.reduce((sum, { b }) => sum + b, 0) / rgbColors.length)
    };

    return rgbToHex(blended);
}

// 将 HEX 转换为 RGB
const hexToRgb = (hex: string): RGB | null => {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return null;
    return {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
    };
}

// 将 RGB 转换为 HEX
const rgbToHex = ({ r, g, b }: RGB): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// 注入动态样式到页面
const injectStyles = (styles: Record<string, string>): void => {
    let styleTag = document.getElementById('mizu-color-dynamic');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'mizu-color-dynamic';
        document.head.appendChild(styleTag);
    }

    const cssVariables = Object.entries(styles)
        .map(([key, value]) => `${key}: ${value} !important;`)
        .join('\n');

    styleTag.innerHTML = `:root {\n${cssVariables}\n}`;
}

// 修改设置背景颜色方法
const mizuBackgroundColors = (): void => {
    const elements = document.querySelectorAll('[mizu-color]');
    elements.forEach((el) => {
        const colorValue = (el as HTMLElement).getAttribute('mizu-color');
        if (colorValue) {
            (el as HTMLElement).style.backgroundColor = `var(--mizu-color-${colorValue})`;
        }
    });
}

// 设置文字颜色
const mizuTextColors = (): void => {
    const elements = document.querySelectorAll('[mizu-color-text]');
    elements.forEach((el) => {
        const colorValue = (el as HTMLElement).getAttribute('mizu-color-text');
        if (colorValue) {
            (el as HTMLElement).style.color = `var(--mizu-color-${colorValue})`;
        }
    });
}

// 导出配置
export default {
    name: 'MizuColor',
    created() {
        const styleTag = document.createElement('style');
        styleTag.id = 'mizu-color-base';
        document.head.appendChild(styleTag);
    },
    mounted() {
        setTimeout(() => {
            mizuDynamicColors();
            mizuBackgroundColors();
            mizuTextColors();
        });
    },
    updated() {
        mizuDynamicColors();
        mizuBackgroundColors();
        mizuTextColors();
    },
    methods: {
        mizuDynamicColors,
        mizuBackgroundColors,
        mizuTextColors
    }
};

export {
    mizuDynamicColors,
    mizuBackgroundColors,
    mizuTextColors
};
</script>

<style lang="stylus">
// 定义全局颜色变量
:root
  // 主色调
  --mizu-color-a-50 #E0F2F1
  --mizu-color-a-100 #B2DFDB
  --mizu-color-a-200 #80CBC4
  --mizu-color-a-300 #4DB6AC
  --mizu-color-a-400 #26A69A
  --mizu-color-a-500 #009688
  --mizu-color-a-600 #00897B
  --mizu-color-a-700 #00796B
  --mizu-color-a-800 #00695C
  --mizu-color-a-900 #004D40

  // White 白色
  --mizu-color-white #FFFFFF

  // Black 黑色
  --mizu-color-black #22222222

  // Red 色调
  --mizu-color-red-50 #FFEBEE
  --mizu-color-red-100 #FFCDD2
  --mizu-color-red-200 #EF9A9A
  --mizu-color-red-300 #E57373
  --mizu-color-red-400 #EF5350
  --mizu-color-red-500 #F44336
  --mizu-color-red-600 #E53935
  --mizu-color-red-700 #D32F2F
  --mizu-color-red-800 #C62828
  --mizu-color-red-900 #B71C1C

  // Pink 色调
  --mizu-color-pink-50 #FCE4EC
  --mizu-color-pink-100 #F8BBD0
  --mizu-color-pink-200 #F48FB1
  --mizu-color-pink-300 #F06292
  --mizu-color-pink-400 #EC407A
  --mizu-color-pink-500 #E91E63
  --mizu-color-pink-600 #D81B60
  --mizu-color-pink-700 #C2185B
  --mizu-color-pink-800 #AD1457
  --mizu-color-pink-900 #880E4F

  // Purple 色调
  --mizu-color-purple-50 #F3E5F5
  --mizu-color-purple-100 #E1BEE7
  --mizu-color-purple-200 #CE93D8
  --mizu-color-purple-300 #BA68C8
  --mizu-color-purple-400 #AB47BC
  --mizu-color-purple-500 #9C27B0
  --mizu-color-purple-600 #8E24AA
  --mizu-color-purple-700 #7B1FA2
  --mizu-color-purple-800 #6A1B9A
  --mizu-color-purple-900 #4A148C

  // Deep Purple 色调
  --mizu-color-deep-purple-50 #EDE7F6
  --mizu-color-deep-purple-100 #D1C4E9
  --mizu-color-deep-purple-200 #B39DDB
  --mizu-color-deep-purple-300 #9575CD
  --mizu-color-deep-purple-400 #7E57C2
  --mizu-color-deep-purple-500 #673AB7
  --mizu-color-deep-purple-600 #5E35B1
  --mizu-color-deep-purple-700 #512DA8
  --mizu-color-deep-purple-800 #4527A0
  --mizu-color-deep-purple-900 #311B92

  // Indigo 色调
  --mizu-color-indigo-50 #E8EAF6
  --mizu-color-indigo-100 #C5CAE9
  --mizu-color-indigo-200 #9FA8DA
  --mizu-color-indigo-300 #7986CB
  --mizu-color-indigo-400 #5C6BC0
  --mizu-color-indigo-500 #3F51B5
  --mizu-color-indigo-600 #3949AB
  --mizu-color-indigo-700 #303F9F
  --mizu-color-indigo-800 #283593
  --mizu-color-indigo-900 #1A237E

  // Blue 色调
  --mizu-color-blue-50 #E3F2FD
  --mizu-color-blue-100 #BBDEFB
  --mizu-color-blue-200 #90CAF9
  --mizu-color-blue-300 #64B5F6
  --mizu-color-blue-400 #42A5F5
  --mizu-color-blue-500 #2196F3
  --mizu-color-blue-600 #1E88E5
  --mizu-color-blue-700 #1976D2
  --mizu-color-blue-800 #1565C0
  --mizu-color-blue-900 #0D47A1

  // Cyan 色调
  --mizu-color-cyan-50 #E0F7FA
  --mizu-color-cyan-100 #B2EBF2
  --mizu-color-cyan-200 #80DEEA
  --mizu-color-cyan-300 #4DD0E1
  --mizu-color-cyan-400 #26C6DA
  --mizu-color-cyan-500 #00BCD4
  --mizu-color-cyan-600 #00ACC1
  --mizu-color-cyan-700 #0097A7
  --mizu-color-cyan-800 #00838F
  --mizu-color-cyan-900 #006064

  // Green 色调
  --mizu-color-green-50 #E8F5E9
  --mizu-color-green-100 #C8E6C9
  --mizu-color-green-200 #A5D6A7
  --mizu-color-green-300 #81C784
  --mizu-color-green-400 #66BB6A
  --mizu-color-green-500 #4CAF50
  --mizu-color-green-600 #43A047
  --mizu-color-green-700 #388E3C
  --mizu-color-green-800 #2E7D32
  --mizu-color-green-900 #1B5E20

  // Yellow 色调
  --mizu-color-yellow-50 #FFFDE7
  --mizu-color-yellow-100 #FFF9C4
  --mizu-color-yellow-200 #FFF59D
  --mizu-color-yellow-300 #FFF176
  --mizu-color-yellow-400 #FFEE58
  --mizu-color-yellow-500 #FFEB3B
  --mizu-color-yellow-600 #FDD835
  --mizu-color-yellow-700 #FBC02D
  --mizu-color-yellow-800 #F9A825
  --mizu-color-yellow-900 #F57F17

  // Orange 色调
  --mizu-color-orange-50 #FFF3E0
  --mizu-color-orange-100 #FFE0B2
  --mizu-color-orange-200 #FFCC80
  --mizu-color-orange-300 #FFB74D
  --mizu-color-orange-400 #FFA726
  --mizu-color-orange-500 #FF9800
  --mizu-color-orange-600 #FB8C00
  --mizu-color-orange-700 #F57C00
  --mizu-color-orange-800 #EF6C00
  --mizu-color-orange-900 #E65100

  // Gray 色调
  --mizu-color-gray-50 #FAFAFA
  --mizu-color-gray-100 #F5F5F5
  --mizu-color-gray-200 #EEEEEE
  --mizu-color-gray-300 #E0E0E0
  --mizu-color-gray-400 #BDBDBD
  --mizu-color-gray-500 #9E9E9E
  --mizu-color-gray-600 #757575
  --mizu-color-gray-700 #616161
  --mizu-color-gray-800 #424242
  --mizu-color-gray-900 #212121

  // Amber 色调
  --mizu-color-amber-50 #FFF8E1
  --mizu-color-amber-100 #FFECB3
  --mizu-color-amber-200 #FFE082
  --mizu-color-amber-300 #FFD54F
  --mizu-color-amber-400 #FFCA28
  --mizu-color-amber-500 #FFC107
  --mizu-color-amber-600 #FFB300
  --mizu-color-amber-700 #FFA000
  --mizu-color-amber-800 #FF8F00
  --mizu-color-amber-900 #FF6F00

  // Lime 色调
  --mizu-color-lime-50 #F9FBE7
  --mizu-color-lime-100 #F0F4C3
  --mizu-color-lime-200 #E6EE9C
  --mizu-color-lime-300 #DCE775
  --mizu-color-lime-400 #D4E157
  --mizu-color-lime-500 #CDDC39
  --mizu-color-lime-600 #C0CA33
  --mizu-color-lime-700 #AFB42B
  --mizu-color-lime-800 #9E9D24
  --mizu-color-lime-900 #827717

  // Teal 色调
  --mizu-color-teal-50 #E0F2F1
  --mizu-color-teal-100 #B2DFDB
  --mizu-color-teal-200 #80CBC4
  --mizu-color-teal-300 #4DB6AC
  --mizu-color-teal-400 #26A69A
  --mizu-color-teal-500 #009688
  --mizu-color-teal-600 #00897B
  --mizu-color-teal-700 #00796B
  --mizu-color-teal-800 #00695C
  --mizu-color-teal-900 #004D40

  // Light Blue 色调
  --mizu-color-light-blue-50 #E1F5FE
  --mizu-color-light-blue-100 #B3E5FC
  --mizu-color-light-blue-200 #81D4FA
  --mizu-color-light-blue-300 #4FC3F7
  --mizu-color-light-blue-400 #29B6F6
  --mizu-color-light-blue-500 #03A9F4
  --mizu-color-light-blue-600 #039BE5
  --mizu-color-light-blue-700 #0288D1
  --mizu-color-light-blue-800 #0277BD
  --mizu-color-light-blue-900 #01579B

  // Light Green 色调
  --mizu-color-light-green-50 #F1F8E9
  --mizu-color-light-green-100 #DCEDC8
  --mizu-color-light-green-200 #C5E1A5
  --mizu-color-light-green-300 #AED581
  --mizu-color-light-green-400 #9CCC65
  --mizu-color-light-green-500 #8BC34A
  --mizu-color-light-green-600 #7CB342
  --mizu-color-light-green-700 #689F38
  --mizu-color-light-green-800 #558B2F
  --mizu-color-light-green-900 #33691E

  // Deep Orange 色调
  --mizu-color-deep-orange-50 #FBE9E7
  --mizu-color-deep-orange-100 #FFCCBC
  --mizu-color-deep-orange-200 #FFAB91
  --mizu-color-deep-orange-300 #FF8A65
  --mizu-color-deep-orange-400 #FF7043
  --mizu-color-deep-orange-500 #FF5722
  --mizu-color-deep-orange-600 #F4511E
  --mizu-color-deep-orange-700 #E64A19
  --mizu-color-deep-orange-800 #D84315
  --mizu-color-deep-orange-900 #BF360C

  // Brown 色调
  --mizu-color-brown-50 #EFEBE9
  --mizu-color-brown-100 #D7CCC8
  --mizu-color-brown-200 #BCAAA4
  --mizu-color-brown-300 #A1887F
  --mizu-color-brown-400 #8D6E63
  --mizu-color-brown-500 #795548
  --mizu-color-brown-600 #6D4C41
  --mizu-color-brown-700 #5D4037
  --mizu-color-brown-800 #4E342E
  --mizu-color-brown-900 #3E2723

  // Blue Grey 色调
  --mizu-color-blue-grey-50 #ECEFF1
  --mizu-color-blue-grey-100 #CFD8DC
  --mizu-color-blue-grey-200 #B0BEC5
  --mizu-color-blue-grey-300 #90A4AE
  --mizu-color-blue-grey-400 #78909C
  --mizu-color-blue-grey-500 #607D8B
  --mizu-color-blue-grey-600 #546E7A
  --mizu-color-blue-grey-700 #455A64
  --mizu-color-blue-grey-800 #37474F
  --mizu-color-blue-grey-900 #263238

</style>