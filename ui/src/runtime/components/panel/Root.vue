<script setup lang="ts">
import Spliter from './spliter/index.vue'
import {usePanel, providePanelContext } from '../../composables/use-panel'
import PanelBar from './Bar.vue'
import PanelDialog from './Dialog.vue'
import { computed, ref } from 'vue'

const { panelQueue, spliterRef, unPinById } = usePanel()
const openedPanel = computed(() => panelQueue.filter(i => i.open && !i.pined))

// onMounted(() => {
//   watch(() => panelQueue, () => {
//     panelQueue
//   }, {
//     deep: true,
//     immediate: true
//   })
// })

providePanelContext({
  unPinById
})
</script>
<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="flex items-center justify-start">
      <div
        v-for="p in panelQueue"
        :key="p.title"
        class="flex items-center"
      >
        <w-checkbox v-model:checked="p.pined" /> {{ p.title }}
      </div>
    </div>
   
    <panel-bar direction="top" />
    <div class="flex justify-between select-none w-full h-full !p-0 !m-0 text-green-700 font-medium text-sm bg-green-300 relative">
      <panel-bar direction="left" />
      <div class="flex-1 flex flex-col relative">
        <panel-dialog
          v-for="panel in openedPanel"
          :key="panel.title"
          :panel
        />
        <Spliter ref="spliterRef" />
      </div>
      <panel-bar direction="right" />
    </div>
    <panel-bar direction="bottom" />
  </div>
</template>