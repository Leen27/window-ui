<script setup lang="ts">
import type { Panel } from '../../hooks/useMainPanel';
import { cva } from 'class-variance-authority';
import {cn} from '../../utils'
import { computed } from 'vue';
import PanelHeader from './Header.vue'

const dialogVariants = cva(
  'w-[200px] h-full border border-black',
  {
    variants: {
      direction: {
        'left': 'left-[40px] top-0 h-full',
        'right': 'right-[40px] top-0 h-full',
        'top': 'left-0 top-[40px] w-full h-[20%]',
        'bottom': 'left-0 bottom-[40px] w-full h-[20%]',
      }
    },
    defaultVariants: {
      direction: 'left'
    }
  }
)

type Props = {
  panel: Panel
}

const props = defineProps<Props>()
const pos = computed(() => props.panel.pos)
const enableResizeDirection = computed(() => {
  return {
    'left': ['right'],
    'top': ['bottom'],
    'right': ['left'],
    'bottom': ['top']
  }[pos.value] || []
})

</script>
<template>
  <div
    ref="supRef"
    class="w-[1px] h-0"
  />
  <w-resizer
    :enable="enableResizeDirection as any"
    :class="cn(dialogVariants({ direction: panel.pos}))"
  >
    dialog - {{ panel }}
    <panel-header :panel="panel" />
    <component
      :is="panel.render"
      v-if="panel?.render"
    />
  </w-resizer>
</template>