<script setup lang="ts">
import { SplitterPanel, SplitterGroup } from 'radix-vue'
import PanelSplitter from './Splitter.vue'
import { useMainPanel } from '../../hooks/useMainPanel'

useMainPanel()

</script>
<template>
  <SplitterPanel
    id="splitter-group-main-panel-center"
    :min-size="20"
  >
    <SplitterGroup
      id="splitter-group-main"
      direction="vertical"
    >
      <panel-splitter direction="top" />
      <SplitterPanel
        id="splitter-group-center-panel-viwer"
        :min-size="20"
        class="bg-white relative flex items-center justify-center"
      >
        editor
      </SplitterPanel>
      <panel-splitter direction="bottom" />
    </SplitterGroup>
  </SplitterPanel>
</template>