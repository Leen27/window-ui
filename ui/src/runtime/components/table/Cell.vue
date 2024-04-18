<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '#window-ui/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <td
    :class="
      cn(
        'p-4 align-middle [&:has([role=checkbox])]:pl-2 border border-table-border',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
