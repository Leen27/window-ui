<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePanel, type Panel } from '../../composables/use-panel';
import {Splitpanes, Pane} from 'splitpanes'
import { cva } from 'class-variance-authority';
type Props = {
  panel: Panel
}

const props = defineProps<Props>()
const pos = computed(() => props.panel.pos)
const isHorizontal = computed<boolean>(() => ({
  'left': false,
  'right': false,
  'top': true,
  'bottom': true,
}[pos.value]))

const telportPos = computed(() => ({
  'top': '#--splitter-main-dialog-panel-1',
  'bottom': '#--splitter-main-dialog-panel-2',
  'left': '#--splitter-main-dialog-panel-1',
  'right': '#--splitter-main-dialog-panel-2'
}[pos.value]))

const { closePanel } = usePanel()

const panel1 = ref()
const PANEL_ID_1 = '--splitter-main-dialog-panel-1'
const PANEL_ID_2 = '--splitter-main-dialog-panel-2'
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
    <splitpanes
      class="default-theme"
      :horizontal="isHorizontal"
      style="height: 100%;"
    >
      <pane
        :id="PANEL_ID_1"
        ref="panel1"
        max-size="90"
        :class="panelVariants({ role: getRole('#' + PANEL_ID_1) })"
        @click="handleClickPanel('#' + PANEL_ID_1)"
      >
        <div
          v-if="'dialog' === getRole('#' + PANEL_ID_1)"
          :id="panel.id + '-dialog'"
          class="w-full h-full"
        /> 
      </pane>
      <pane
        :id="PANEL_ID_2"
        ref="panel2"
        :class="panelVariants({ role:getRole('#'+PANEL_ID_2) })"
        @click="handleClickPanel('#'+PANEL_ID_2)"
      >
        <div
          v-if="'dialog' === getRole('#'+PANEL_ID_2)"
          :id="panel.id+'-dialog'"
          class="w-full h-full"
        />
      </pane>
    </splitpanes>
  </div>
</template>