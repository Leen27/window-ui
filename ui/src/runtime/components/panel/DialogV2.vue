<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMainPanel, type Panel } from '../../composables/useMainPanel';
import PanelHeader from './Header.vue'
import { SplitterPanel, SplitterGroup, SplitterResizeHandle } from 'radix-vue'
import { cva } from 'class-variance-authority';
import {cn } from '../../utils'
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

const getRole = (panelId: string) => telportPos.value === panelId ? 'dialog' : 'layer'

const handleClickPanel = (id: string) => {
  if(id !== telportPos.value) {
    closePanel(props.panel)
  }
}

const panelVariants = cva(
  '',
  {
    variants: {
      role: {
        layer: 'opacity-0',
        dialog: 'bg-background'
      }
    }
  }
)
</script>
<template>
  <div class="border border-black absolute z-[999] left-0 top-0 w-full h-full">
    <splitter-group :direction="splitDirection">
      <splitter-panel
        id="--splitter-main-dialog-panel-1"
        ref="panel1"
        :data-role="getRole('#--splitter-main-dialog-panel-1')"
        :class="panelVariants({ role:getRole('#--splitter-main-dialog-panel-1') })"
        @click="handleClickPanel('#--splitter-main-dialog-panel-1')"
      >
      <!-- 第一个panel -->
      </splitter-panel>
      <splitter-resize-handle :class="resizeHandleStyle({direction: splitDirection })" />
      <splitter-panel
        id="--splitter-main-dialog-panel-2"
        ref="panel2"
        :data-role="getRole('#--splitter-main-dialog-panel-2')"
        :class="panelVariants({ role:getRole('#--splitter-main-dialog-panel-2') })"
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