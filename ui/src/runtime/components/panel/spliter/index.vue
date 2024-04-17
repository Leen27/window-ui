<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { type Panel, usePanelSpliter, providePanelSpliterContext } from '../../../composables/use-panel-spliter';
import { type Panel as GPanel } from '../../../composables/use-panel';
import PanelNav from './Nav.vue'
import PanelItem from './Item.vue'

const { group, addPanel } = usePanelSpliter()

const isDrag = ref(false)
const dragPanel = shallowRef<Panel | undefined>()
const hoverPanel = shallowRef<Panel | undefined>()
const startDrag = (panel: Panel) => {
  isDrag.value = true
  dragPanel.value = panel

  bindEvents()
}

const bindEvents = () => {
  document.addEventListener("mouseup", onDragPanelEnd);
  document.addEventListener("mousemove", onDragPanelMove);
  document.addEventListener("mouseleave", onDragPanelEnd);
  document.addEventListener("touchmove", onDragPanelMove, {
    capture: true,
    passive: false,
  });
  document.addEventListener("touchend", onDragPanelEnd);
};

const unbindEvents = () => {
  document.removeEventListener("mouseup", onDragPanelEnd);
  document.removeEventListener("mousemove", onDragPanelMove);
  document.removeEventListener("mouseleave", onDragPanelEnd);
  document.removeEventListener("touchmove", onDragPanelMove);
  document.removeEventListener("touchend", onDragPanelEnd);
};

const onDragPanelMove = () => {
  console.log(11)
}

const onDragPanelEnd = () => {
  isDrag.value = false
  dragPanel.value && (dragPanel.value = undefined)
  unbindEvents()
}

const onHover = (panel: Panel) => {
  hoverPanel.value = panel
}

providePanelSpliterContext({
  isDrag,
  dragPanel,
  startDrag,
  hoverPanel,
  onHover
})

defineExpose({
  spliter: group,
  addPanel
})
</script>
<template>
  <ClientOnly>
    <!--<w-button @click="addPanel({pos: 'left'})">
      left
    </w-button>
    <w-button @click="addPanel({pos: 'right'})">
      right 
    </w-button>
    <w-button @click="addPanel({pos: 'top'})">
      top
    </w-button>
    <w-button @click="addPanel({ pos: 'bottom' })">
      bottom 
    </w-button>-->
    <div class="h-full">
      <PanelNav /> 
      <PanelItem :group="group" /> 
    </div>

    <!-- <pre
      class="text-[12px]"
    >
      {{ group }}
    </pre> -->
  </ClientOnly>
</template>