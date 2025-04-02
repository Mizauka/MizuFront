<template>
  <div>    
    <!-- 使用动态取色功能，使用v-bind保证响应性 -->
    <div mizu-color-dynamic="blue,red,green,yellow">
      <!-- 使用新的属性语法 -->
      <mizu-button mizu-ripple="a-900">按钮带彩色涟漪</mizu-button>
      <mizu-button mizu-ripple="a-50" filled>实心按钮带涟漪</mizu-button>
      <mizu-button mizu-ripple="a-900" fluid>流体按钮带涟漪</mizu-button>
      <div style="display: flex; flex-wrap: wrap; gap: 0;">
        <!-- 显示动态颜色的示例块 -->
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-50" mizu-ripple="a-900"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-100" mizu-ripple="a-800"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-200" mizu-ripple="a-700"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-300" mizu-ripple="a-600"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-400" mizu-ripple="a-500"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-500" mizu-ripple="a-400"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-600" mizu-ripple="a-300"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-700" mizu-ripple="a-200"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-800" mizu-ripple="a-100"></div>
        <div style="width: 100px; height: 100px; margin: 0;" mizu-color="a-900" mizu-ripple="a-50"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mizuDynamicColors, mizuBackgroundColors, mizuTextColors } from './components/color.vue';
import { mizuRipple } from './components/ripple.vue';
import { mizuButton } from './components/button.vue';
import { onMounted } from 'vue';

onMounted(() => {
  mizuDynamicColors();
  mizuBackgroundColors();
  mizuTextColors();
  mizuRipple();
});
</script>