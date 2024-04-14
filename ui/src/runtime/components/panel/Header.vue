<script setup lang="ts">
import { injectPanelContext, type Panel } from '../../composables/use-panel'
type Props = {
  panel: Panel
}

const props = defineProps<Props>()
const { startDrag, isDrag } = injectPanelContext()

const handleMouseDown = () => {
  startDrag(props.panel)
}
</script>
<template>
  <div
    class="bg-primary w-full h-[40px] select-none"
    @mousedown="handleMouseDown"
  >
    {{ panel.title }} - {{ isDrag }}
    <span
      class="text-white"
      @click="panel.remove"
    >X</span>
  </div>
</template>