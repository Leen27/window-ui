<script setup lang="ts">
import { computed } from 'vue';
import {type Panel, useMainPanel } from '../../hooks/useMainPanel'
type Props = {
  panel: Panel
}

const props = defineProps<Props>()
const { pinPanel, unPin, closePanel } = useMainPanel()
const ifPined = computed(() => props.panel.pined)
</script>
<template>
  <div class="bg-primary w-full h-[40px] flex justify-between items-center">
    <div>{{ panel.title }}</div>
    <div class="flex items-center gap-1">
      <div @click="ifPined ? unPin(panel) : pinPanel(panel)">
        <span v-if="ifPined">unpin</span>
        <span v-else>pin</span>
      </div>
      <div @click="closePanel(panel)">
        close
      </div>
    </div>
  </div>
</template>