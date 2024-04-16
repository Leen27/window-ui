<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { injectPanelSpliterContext } from '../../../composables/use-panel-spliter'
import { BookmarkIcon, ArrowUpFromLineIcon, ArrowLeftFromLineIcon, ArrowRightFromLineIcon, ArrowDownFromLineIcon  } from 'lucide-vue-next'

const { isDrag, hoverPanel, dragPanel } = injectPanelSpliterContext()
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
    <div
      class="w-6 h-6 flex items-center justify-center hover:opacity-40" 
    
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'top')"
    >
      <ArrowUpFromLineIcon
        class="w-4 h-4 hover:opacity-50"
      />
    </div>

    <div class="w-6 h-6 flex items-center justify-center hover:opacity-40" />

    <div
      class="w-6 h-6 flex items-center justify-center hover:opacity-40"
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'left')"
    >
      <ArrowLeftFromLineIcon
        class="w-4 h-4"
      />
    </div>

    <div
      class="w-6 h-6 flex items-center justify-center hover:opacity-40"
    
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'tags')"
    >
      <BookmarkIcon
        class="w-4 h-4"
      />
    </div>

    <div
      class="w-6 h-6 flex items-center justify-center hover:opacity-40"
    
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'right')"
    >
      <ArrowRightFromLineIcon
        class="w-4 h-4"
      />
    </div>

    <div class="w-6 h-6 flex items-center justify-center hover:opacity-40" />


    <div
      class="w-6 h-6 flex items-center justify-center hover:opacity-40"
    
      @mouseup="dragPanel?.moveTo(hoverPanel!, 'bottom')"
    >
      <ArrowDownFromLineIcon
    
        class="w-4 h-4"
      />
    </div>

    <div class="w-6 h-6 flex items-center justify-center hover:opacity-40" />
  </div>
</template>