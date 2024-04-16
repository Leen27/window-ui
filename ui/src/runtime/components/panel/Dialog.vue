<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePanel, type Panel } from '../../composables/use-panel';
import PanelHeader from './spliter/Header.vue'
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

const { closePanel, pinPanel, unPin } = usePanel()

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
    <splitpanes
      class="default-theme"
      :horizontal="isHorizontal"
      style="height: 100%;"
    >
      <pane
        id="--splitter-main-dialog-panel-1"
        ref="panel1"
        max-size="90"
        :class="panelVariants({ role:getRole('#--splitter-main-dialog-panel-1') })"
        @click="handleClickPanel('#--splitter-main-dialog-panel-1')"
      />
      <pane
        id="--splitter-main-dialog-panel-2"
        ref="panel2"
        :class="panelVariants({ role:getRole('#--splitter-main-dialog-panel-2') })"
        @click="handleClickPanel('#--splitter-main-dialog-panel-2')"
      />
    </splitpanes>
    <!-- 
    <splitter-group :direction="splitDirection">
      <splitter-panel
        id="--splitter-main-dialog-panel-1"
        ref="panel1"
        :data-role="getRole('#--splitter-main-dialog-panel-1')"
        :class="panelVariants({ role:getRole('#--splitter-main-dialog-panel-1') })"
        @click="handleClickPanel('#--splitter-main-dialog-panel-1')"
      >
      
      </splitter-panel>
      <splitter-resize-handle :class="resizeHandleStyle({direction: splitDirection })" />
      <splitter-panel
        id="--splitter-main-dialog-panel-2"
        ref="panel2"
        :data-role="getRole('#--splitter-main-dialog-panel-2')"
        :class="panelVariants({ role:getRole('#--splitter-main-dialog-panel-2') })"
        @click="handleClickPanel('#--splitter-main-dialog-panel-2')"
      >
      
      </splitter-panel>
    </splitter-group> -->

    <Teleport
      v-if="panel1 && panel2"
      :to="telportPos"
    >
      <div
        class="bg-primary w-full h-[40px] select-none gap-3"
      >
        {{ panel.title }}
        <span
          class="text-white"
          @mousedown.stop="() => closePanel(panel)"
        >X</span>
        <span
          class="text-white"
          @mousedown.stop="() => panel.pined ? unPin(panel) : pinPanel(panel)"
        >{{ panel.pined ? '⬇️' : '⬅️' }}</span>
      </div>
      <div class="w-full h-full overflow-scroll">
        <component
          :is="panel.render"
          v-if="panel?.render"
        />
      </div>
    </Teleport>
  </div>
</template>