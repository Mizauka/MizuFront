<template>
  <button class="mizu-button">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export const mizuButton = defineComponent({
  name: 'mizuButton'
})

export default mizuButton
</script>

<style lang="stylus" scoped>
@import url('style/button.styl');
</style>