<script setup lang="ts">
import { SplitterResizeHandle } from 'radix-vue'
import {cva} from 'class-variance-authority'
import { computed } from 'vue';
import { useMainPanel } from '../../hooks/useMainPanel';

type Props = {
  direction: 'top' | 'left' | 'right' | 'bottom'
}

const props = defineProps<Props>()
const { panelQueue } = useMainPanel()
const pinedArr = computed(() => panelQueue.filter(p => p.pined && p.pos === props.direction))
const pined = computed(() => pinedArr.value?.[0])
const handleVariantsClass = cva(
  '',
  {
    variants: {
      direction: {
        top: 'h-1',
        bottom: 'h-1',
        left: 'w-1',
        right: 'w-1'
      }
    }
  }
)

</script>
<template>
  <SplitterResizeHandle
    v-show="!!pined"
    :id="`splitter-group-main-resize-handle-${direction}`"
    :class="handleVariantsClass({ direction })"
    :disabled="!pined"
  />
</template>