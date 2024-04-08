<script setup lang="ts">
import { computed } from 'vue';
import {useMainPanel} from '../../hooks/useMainPanel'
import {cva} from 'class-variance-authority'
import { injectPanelMain } from '../../ui.config'
import { inject } from 'vue';

type Props = {
  direction: 'top' | 'left' | 'right' | 'bottom'
}

const props = defineProps<Props>()

const { panelQueue, openPanel } = useMainPanel()
const barItems = computed(() => panelQueue.filter(p => p.pos === props.direction && !p.pined))
const { barRefs } = injectPanelMain()

const panelBarVariants = cva(
  'select-none  bg-slate-400 flex',
  {
    variants: {
      direction: {
        top: 'w-full h-[40px] overflow-x-scroll',
        bottom: 'w-full h-[40px] overflow-x-scroll',
        left: 'w-[40px] h-full flex-col overflow-y-scroll',
        right: 'w-[40px] h-full flex-col overflow-y-scroll'
      }
    }
  }
)

const panelBarItemVariants = cva(
  'text-black shrink-0  hover:cursor-pointer text-[12px] border-black border',
  {
    variants: {
      direction: {
        top: 'p-0.5 mr-1',
        bottom: 'p-0.5 mr-1',
        left: 'p-0.5 mb-1 [writing-mode:vertical-lr]',
        right: 'p-0.5 mb-1 [writing-mode:vertical-lr]'
      }
    }
  }
)

</script>
<template>
  <ul
    v-if="barItems.length > 0"
    :ref="(el) => {
      barRefs[direction].value = el
    }"
    :class="panelBarVariants({ direction })"
  >
    <li
      v-for="item in barItems"
      :key="item.title"
      :class="panelBarItemVariants({ direction })"
      @click="openPanel(item)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>