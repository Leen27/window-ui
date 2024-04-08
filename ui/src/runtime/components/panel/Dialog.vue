<script setup lang="ts">
import type { Panel } from '../../hooks/useMainPanel';
import { cva } from 'class-variance-authority';
import {cn} from '../../utils'
import { computed, ref } from 'vue';
import PanelHeader from './Header.vue'
import { injectPanelMain } from '../../ui.config'

const dialogVariants = cva(
  'w-[200px] h-full border border-black fixed z-9 l-0 t-0',
  {
    variants: {
      direction: {
        'left': 'l-0 t-0 w-[30%] h-full',
        'right': 'r-0 t-0 w-[30%] h-full',
        'top': 'l-0 t-0 w-full h-[20%]',
        'bottom': 'l-0 b-0 w-full h-[20%]',
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
const enableResizeDirection = computed(() => {
  return {
    'left': ['right'],
    'top': ['bottom'],
    'right': ['left'],
    'bottom': ['top']
  }[props.panel.pos] || []
})

const { barRefs } = injectPanelMain()
const supRef = barRefs[props.panel.pos]
// const { x, y } = useElementBounding(supRef)
const x = ref(0)
const y = ref(0)
if (supRef.value) {
  const rect = supRef.value.getBoundingClientRect()
  x.value = rect.x
  y.value = rect.y
}
</script>
<template>
  <div
    ref="supRef"
    class="w-[1px] h-0"
  />
  <w-resizer
    v-if="x > 0 || y > 0"
    :enable="enableResizeDirection as any"
    :class="cn(dialogVariants({ direction: panel.pos}))"
    :init-x="x"
    :init-y="y"
  >
    dialog - {{ panel }}
    <panel-header :panel="panel" />
    <component
      :is="panel.render"
      v-if="panel?.render"
    />
  </w-resizer>
</template>