<script setup lang="ts">
import { usePanel } from '../../composables/use-panel';
import PanelItem from './Item.vue'
const { group, addPanel } = usePanel()
</script>
<template>
  <ClientOnly>
    <pre class="text-[12px]">
      {{ group }}
    </pre>
    
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
      <PanelItem :group="group" /> 
    </div>
  </ClientOnly>
</template>