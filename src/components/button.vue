<template>
  <button class="mizu-button">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'mizuButton'
})
</script>

<style lang="stylus" scoped>
.mizu-button
  margin: 2px
  position relative
  display inline-flex
  align-items center
  justify-content center
  height 50px
  line-height 50px
  min-width 80px
  padding 0 15px
  font-size 15px
  font-weight 500
  color var(--mizu-color-a-500,#009688)
  background-color transparent
  border 2px solid var(--mizu-color-a-500,#009688)
  border-radius 15px
  outline 0
  transition all ease 0.2s
:active
  border-radius 25px
[filled]
  background-color var(--mizu-color-a-500,#009688)
  color #fff
[fluid]
  background-color var(--mizu-color-a-50,#009688)
  border-color var(--mizu-color-a-50,#009688)
  color var(--mizu-color-a-800,#004D40)
  font-weight 600
</style>