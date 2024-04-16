<script setup lang="ts">
import PanelHader from './Header.vue'
import { Panel, injectPanelSpliterContext} from '../../../composables/use-panel-spliter'

type Props = {
  panel: Panel
}
const props = defineProps<Props>()
const { onHover } =injectPanelSpliterContext()
</script>
<template>
  <div
    :id="panel.id.value"
    class="relative w-full h-full"
    @mouseenter="onHover(panel as Panel)"
  >
    {{ panel }}
    <PanelHader
      v-if="panel.hasHeader"
      :panel="panel as Panel"
    />
    <div class="">
      <w-button @click="(panel as Panel).add('left')">
        left
      </w-button>
      <w-button @click="(panel as Panel).add('top')">
        top
      </w-button>
      <w-button @click="(panel as Panel).add('right')">
        center
      </w-button>
      <w-button @click="(panel as Panel).add('right')">
        right
      </w-button>
      <w-button @click="(panel as Panel).add('bottom')">
        bottom
      </w-button>
    </div>
  </div>
</template>