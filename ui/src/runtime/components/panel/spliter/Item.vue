<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import { Panel, type Group, TagsGroup} from '../../../composables/use-panel-spliter'
import { computed } from 'vue';
import PanelTags from './Tags.vue'
import PanelContent from './Content.vue'

type Props = {
  group: Group
}

const props = defineProps<Props>()
const horizontal = computed(() => props.group.direction.value === 'horizontal')
const panels = computed(() => props.group.panels.value.filter(p => (p as Panel).isPanel || ((p as Group).panels.value?.length > 0) || (p as TagsGroup).isTagsGroup))

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
      <Item
        v-if="(panel as Group).isGroup && ((panel as Group).panels.value?.length > 0)"
        :group="panel as Group"
      />
      <PanelTags
        v-else-if="(panel as TagsGroup).isTagsGroup"
        :group="panel as TagsGroup"
      />
      <PanelContent 
        v-else-if="(panel as Panel).isPanel"
        :panel="panel as Panel"
      />
    </Pane>
  </splitpanes>
</template>