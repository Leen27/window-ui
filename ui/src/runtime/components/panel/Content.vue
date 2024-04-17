<script setup lang="ts">
import { type Panel, usePanel } from '../../composables/use-panel'
import { watchEffect, ref, computed } from 'vue'

type Props = {
  panel: Panel
}

const props = defineProps<Props>()
const panelId = computed(() => props.panel.id)
const transId = ref()
const containerRef = ref()
const { closePanel, unPin, pinPanel } = usePanel()

watchEffect(() => {
  containerRef.value = null

  if (!panelId.value)  return
  if (!props.panel.open && !props.panel.pined) return

  const id = (props.panel.open && props.panel.pined) ? '#'+ panelId.value : '#' + panelId.value + '-dialog'
  const dom = document.body.querySelector(id)
  transId.value = id

  if (!dom) return

  nextTick(() => {
    containerRef.value = dom
  })
})
</script>
<template>
  <Teleport
    v-if="containerRef && transId"
    :to="transId"
  >
    <div
      class="bg-primary w-full h-[40px] select-none gap-3"
    >
      {{ panel.title }}
      <span
        class="text-white"
        @mousedown.stop="() => closePanel(panel)"
      >X</span>
      <span
        class="text-white"
        @mousedown.stop="() => panel.pined ? unPin(panel) : pinPanel(panel)"
      >{{ panel.pined ? '⬇️' : '⬅️' }}</span>
    </div>
    <div class="w-full h-full overflow-scroll">
      <component
        :is="panel.render"
        v-if="panel?.render"
      />
    </div>
  </Teleport>
</template>