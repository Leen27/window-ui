<script setup lang="ts">
import { type Ref, type ShallowRef, ref, shallowRef } from 'vue';
import { type Panel, usePanel, providePanelContext } from '../../composables/use-panel';
import PanelNav from './Nav.vue'
import PanelItem from './Item.vue'

const { group, addPanel } = usePanel()

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

providePanelContext({
  isDrag,
  dragPanel,
  startDrag,
  hoverPanel,
  onHover
})
</script>
<template>
  <ClientOnly>
    <pre class="text-[12px]">
      {{ group }}
      {{ dragPanel?.id }}
    </pre>
    {{ hoverPanel }}
    <w-button @click="addPanel('left')">
      left
    </w-button>
    <w-button @click="addPanel('right')">
      right 
    </w-button>
    <w-button @click="addPanel('top')">
      top
    </w-button>
    <w-button @click="addPanel('bottom')">
      bottom 
    </w-button>
    <div class="h-[400px]">
      <PanelNav /> 
      <PanelItem :group="group" /> 
    </div>
  </ClientOnly>
</template>