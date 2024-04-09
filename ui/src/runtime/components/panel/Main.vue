<script setup lang="ts">
import { SplitterGroup } from 'radix-vue'
import {useMainPanel} from '../../hooks/useMainPanel'
import CenterPanel from './Center.vue'
import PanelSplitter from './Splitter.vue'
import PanelBar from './Bar.vue'
import PanelDialog from './DialogV2.vue'
import { computed, ref } from 'vue'
import { providePanelMain } from '../../ui.config/panel-main'
import PanelSplitterHandle from './SplitterHandle.vue'

const { panelQueue } = useMainPanel()
const openedPanel = computed(() => panelQueue.filter(i => i.open && !i.pined))

providePanelMain({
  barRefs: {
    left: ref(),
    right: ref(),
    top: ref(),
    bottom: ref()
  }
})
</script>
<template>
  <div class="flex flex-col overflow-hidden">
    <panel-bar direction="top" />
    <div class="flex justify-between select-none w-full h-64 !p-0 !m-0 text-green-700 font-medium text-sm bg-green-300 relative">
      <panel-bar direction="left" />
      <div class="flex-1 flex flex-col relative">
        <panel-dialog
          v-for="panel in openedPanel"
          :key="panel.title"
          :panel
        />
        <SplitterGroup
          id="splitter-group-center"
          direction="horizontal"
        >
          <panel-splitter direction="left" />
          <panel-splitter-handle direction="left" />
          <CenterPanel />
          <panel-splitter-handle direction="right" />
          <panel-splitter direction="right" />
        </SplitterGroup>
      </div>
      <panel-bar direction="right" />
    </div>
    <panel-bar direction="bottom" />
  </div>
</template>