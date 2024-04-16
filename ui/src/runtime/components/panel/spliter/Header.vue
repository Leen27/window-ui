<script setup lang="ts">
import { injectPanelSpliterContext, type Panel } from '../../../composables/use-panel-spliter'
import { injectPanelContext } from '../../../composables/use-panel'
type Props = {
  panel: Panel
}

const props = defineProps<Props>()

const {unPinById} = injectPanelContext()

const { startDrag, isDrag } = injectPanelSpliterContext()

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
      @mousedown.stop="panel.remove"
    >X</span>
    <span
      class="text-white"
      @mousedown.stop="() => unPinById(toValue(panel.id))"
    >⬇️</span>
  </div>
</template>