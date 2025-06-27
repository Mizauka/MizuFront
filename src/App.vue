<template>
  <div>    
    <!-- 使用动态取色功能，使用v-bind保证响应性 -->
    <div mizu-color-dynamic="blue,red,green,yellow">
      <!-- 使用新的属性语法 -->
      <mizu-button mizu-ripple="a-900">按钮带彩色涟漪</mizu-button>
      <mizu-button mizu-ripple="a-50" filled>实心按钮带涟漪</mizu-button>
      <mizu-button mizu-ripple="a-900" fluid>流体按钮带涟漪</mizu-button>
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