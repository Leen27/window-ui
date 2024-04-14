<script setup lang="ts">
import PanelHader from './Header.vue'
import { Panel, injectPanelContext} from '../../composables/use-panel'

type Props = {
  panel: Panel
}
const props = defineProps<Props>()
const { onHover } =injectPanelContext()
</script>
<template>
  <div
    :id="panel.id.value"
    class="relative w-full h-full"
    @mouseenter="onHover(panel as Panel)"
  >
    <PanelHader :panel="panel as Panel" />
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