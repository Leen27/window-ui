<script setup lang="ts">
import { SplitterPanel, SplitterResizeHandle } from 'radix-vue'
import {type Panel, useMainPanel } from '../../hooks/useMainPanel'
import { computed, ref, watch } from 'vue';
import PanelHeader from './Header.vue'
import {cva} from 'class-variance-authority'
type Props = {
  direction: 'top' | 'left' | 'right' | 'bottom'
}

const props = defineProps<Props>()
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

const { panelQueue } = useMainPanel()
const pinedArr = computed(() => panelQueue.filter(p => p.pined && p.pos === props.direction))
const pined = computed(() => pinedArr.value?.[0])
const panelRef = ref<InstanceType<typeof SplitterPanel>>()

watch(() => pined.value, () => {
  if(pined.value) {
    panelRef.value?.resize(30)
  } else {
    panelRef.value?.resize(0)
  }
})
</script>
<template>
  <SplitterResizeHandle
    v-if="pined && ['bottom', 'right'].includes(direction)"
    :id="`splitter-group-main-resize-handle-${direction}`"
    :class="handleVariantsClass({ direction })"
  />
  <SplitterPanel
    :id="`splitter-group-main-panel-${direction}`"
    ref="panelRef"
    :default-size="0"
    class="bg-white flex items-center justify-center"
  >
    <div v-if="pined">
      <panel-header :panel="pined" />
      {{ pined.title }}
    </div>
  </SplitterPanel> 
  <SplitterResizeHandle
    v-if="pined && ['left', 'top'].includes(direction)"
    :id="`splitter-group-main-resize-handle-${direction}`"
    :class="handleVariantsClass({ direction })"
  />
</template>
