<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import { Panel, type Group, injectPanelContext} from '../../composables/use-panel'
import { computed } from 'vue';
import PanelHader from './Header.vue'
type Props = {
  group: Group
}

const props = defineProps<Props>()
const horizontal = computed(() => props.group.direction.value === 'horizontal')
const panels = computed(() => props.group.panels.value.filter(p => (p as Panel).isPanel || ((p as Group).panels.value.length > 0)))
const { onHover } =injectPanelContext()
</script>
<template>
  <splitpanes
    v-if="group.panels.value.length > 0"
    class="default-theme"
    :horizontal="horizontal"
    style="height: 100%;"
  >
    <Pane
      v-for="panel in panels"
      :key="panel.id"
      class="w-full h-full"
    >
      {{ panel.id }} #
      <Item
        v-if="(panel as Group).isGroup && ((panel as Group).panels.value.length > 0)"
        :group="panel as Group"
      />
      <div
        v-else-if="(panel as Panel).isPanel"
        :id="panel.id.value"
        class="relative w-full h-full"
        @mouseenter="onHover(panel as Panel)"
      >
        <PanelHader :panel="panel as Panel" />
        <div class="">
          <w-button @click="panel.add('left')">
            left
          </w-button>
          <w-button @click="panel.add('top')">
            top
          </w-button>
          <w-button @click="panel.add('right')">
            right
          </w-button>
          <w-button @click="panel.add('bottom')">
            bottom
          </w-button>
        </div>
      </div>
    </Pane>
  </splitpanes>
</template>