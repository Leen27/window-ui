<script setup lang="ts">
import { computed } from 'vue';
import * as lucideIcons from "lucide-vue-next";
import * as radixIcons from '@radix-icons/vue'
import type { HTMLAttributes } from 'vue';

type Props = {
  name: string,
  size?: number,
  color?: string,
  strokeWidth?: number,
  defaultClass?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const icon = computed(() => {
  const [namespace, icon] = props.name.split(':')

  const pkg = {
    'lucide': lucideIcons,
    'radix': radixIcons
  }[namespace as 'lucide' | 'radix']

  return (pkg as any)[icon]
});
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :default-class="defaultClass"
    :class="props.class"
  />
</template>