<script setup lang="ts">
import { SplitterPanel } from 'radix-vue'
import {useMainPanel } from '../../composables/useMainPanel'
import { computed, ref, watch } from 'vue';
import PanelHeader from './Header.vue'
type Props = {
  direction: 'top' | 'left' | 'right' | 'bottom'
}

const props = defineProps<Props>()

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
  <SplitterPanel
    :id="`splitter-group-main-panel-${direction}`"
    ref="panelRef"
    :default-size="0"
    class="w-full h-full bg-white flex flex-col items-center justify-center"
  >
    <panel-header
      v-if="pined"
      :panel="pined"
    />
    <div
      v-if="pined"
      class="w-full h-full overflow-auto"
    >
      <component
        :is="pined.render"
        v-if="pined?.render"
      />
    </div>
  </SplitterPanel> 
</template>