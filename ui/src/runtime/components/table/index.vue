<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '#window-ui/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table :class="cn('border-collapse border border-table-border w-full caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>
