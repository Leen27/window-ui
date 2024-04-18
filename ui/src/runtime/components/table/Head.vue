<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '#window-ui/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <th
    v-bind="$attrs"
    :class="cn('h-12 px-4 border border-table-border text-left align-middle font-medium text-muted-foreground', props.class)"
  >
    <slot />
  </th>
</template>
