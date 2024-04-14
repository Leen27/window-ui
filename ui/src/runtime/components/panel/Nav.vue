<script setup lang="ts">
import { injectPanelContext, type Panel } from '../../composables/use-panel'
import { BookmarkIcon, ArrowUpFromLineIcon, ArrowLeftFromLineIcon, ArrowRightFromLineIcon, ArrowDownFromLineIcon  } from 'lucide-vue-next'

// type Props = {
//   panel: Panel
// }

// const props = defineProps<Props>()
const { isDrag, hoverPanel, dragPanel } = injectPanelContext()
const center = ref({
  x: 0,
  y: 0
})

const isShow = ref(false)

watchEffect(() => {
  if(isDrag.value && hoverPanel.value?.id.value && hoverPanel.value?.id.value !== dragPanel.value?.id.value) {
    isShow.value = true
    const dom = document.body.querySelector(`#${hoverPanel.value?.id.value}`)
    if(!dom) return
    const { left, top, right, bottom } = dom.getBoundingClientRect()
    center.value.x = left + (right - left) / 2 - 50
    center.value.y = top + (bottom - top) / 2 - 50
  } else {
    isShow.value = false
  }
})
</script>
<template>
  <div
    v-if="isShow"
    class="w-[100px] h-[100px] bg-green-400 grid gap-2 grid-cols-3 grid-rows-3 fixed z-[99]"
    :style="{
      left: center.x + 'px',
      top: center.y + 'px'
    }"
  >
    <div />
    <ArrowUpFromLineIcon
      class="w-4 h-4 hover:opacity-50"
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'top')"
    />
    <div />
    <ArrowLeftFromLineIcon

      class="w-4 h-4"
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'left')"
    />
    <BookmarkIcon
      class="w-4 h-4"
    />
    <ArrowRightFromLineIcon
    
      class="w-4 h-4"
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'right')"
    />
    <div />
    <ArrowDownFromLineIcon
    
      class="w-4 h-4"
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'bottom')"
    />
    <div />
  </div>
</template>