<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMainPanel, type Panel } from '../../hooks/useMainPanel';
import PanelHeader from './Header.vue'
import { SplitterPanel, SplitterGroup, SplitterResizeHandle } from 'radix-vue'
import { cva } from 'class-variance-authority';
type Props = {
  panel: Panel
}

const props = defineProps<Props>()
const pos = computed(() => props.panel.pos)
const splitDirection = computed<'vertical' | 'horizontal'>(() => ({
  'top': 'vertical',
  'bottom': 'vertical',
  'left': 'horizontal',
  'right': 'horizontal'
}[pos.value] as 'vertical' | 'horizontal'))
const telportPos = computed(() => ({
  'top': '#--splitter-main-dialog-panel-1',
  'bottom': '#--splitter-main-dialog-panel-2',
  'left': '#--splitter-main-dialog-panel-1',
  'right': '#--splitter-main-dialog-panel-2'
}[pos.value]))

const { closePanel } = useMainPanel()

const resizeHandleStyle = cva(
  'bg-red-700',
  {
    variants: {
      direction: {
        vertical: 'h-1',
        horizontal: 'w-1'
      }
    }
  }
)

const panel1 = ref()
const panel2 = ref()

const handleClickPanel = (id: string) => {
  if(id !== telportPos.value) {
    closePanel(props.panel)
  }
}
</script>
<template>
  <div class="border border-black bg-green-700/50 absolute z-[999] left-0 top-0 w-full h-full">
    <splitter-group :direction="splitDirection">
      <splitter-panel
        id="--splitter-main-dialog-panel-1"
        ref="panel1"
        @click="handleClickPanel('#--splitter-main-dialog-panel-1')"
      >
      <!-- 第一个panel -->
      </splitter-panel>
      <splitter-resize-handle :class="resizeHandleStyle({direction: splitDirection })" />
      <splitter-panel
        id="--splitter-main-dialog-panel-2"
        ref="panel2"
        @click="handleClickPanel('#--splitter-main-dialog-panel-2')"
      >
        <!-- 第二个 panel -->
      </splitter-panel>
    </splitter-group>

    <Teleport
      v-if="panel1 && panel2"
      :to="telportPos"
    >
      <panel-header :panel="panel" />
      <div class="w-full h-full overflow-scroll">
        dialog##
        <component
          :is="panel.render"
          v-if="panel?.render"
        />
      </div>
    </Teleport>
  </div>  
</template>