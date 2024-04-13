<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import { type Group} from '../../composables/use-panel'
import { computed } from 'vue';

type Props = {
  group: Group
}

const props = defineProps<Props>()
const horizontal = computed(() => props.group.direction.value === 'horizontal')
</script>
<template>
  <splitpanes
    class="default-theme"
    :horizontal="horizontal"
    style="height: 100%;"
  >
    <Pane
      v-for="panel in group.panels.value"
      :key="panel.id"
    >
      <Item
        v-if="(panel as Group).isGroup && (panel as Group).length > 1"
        :group="panel as Group"
      />
      <div v-else>
        {{ panel.id }} - {{ panel.parentId }}
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
    </Pane>
  </splitpanes>
</template>