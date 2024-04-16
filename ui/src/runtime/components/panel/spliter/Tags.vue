<script setup lang="ts">
import { Panel, TagsGroup} from '../../../composables/use-panel-spliter'
import PanelContent from './Content.vue'

type Props = {
  group: TagsGroup
}

const props = defineProps<Props>()
</script>
<template>
  <div class="relative w-full h-full">
    <div
      v-for="p in toValue(group.panels)"
      :key="toValue(p.id)"
    >
      {{ p.id }}
      <PanelContent :panel="p as Panel" />
    </div>
  </div>
</template>