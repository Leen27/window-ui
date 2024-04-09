<script setup lang="ts">
import {useMainPanel} from '#window-ui/composables/useMainPanel'
const { panelQueue } = useMainPanel()
const count = ref(0)
const handleAddPanel = (direction: 'left' | 'top' | 'right' | 'bottom') => {
  panelQueue.push({
    title: `${direction}-test-${count.value++}`,
    pos: direction,
    render: () => h('div', {
      style: {
        width: '400px',
        height: '400px',
        backgroundColor: '#333'
      }
    },'text')
  })
}
</script>
<template>
  <div>
    <div class="flex gap-2 mb-5">
      <w-button @click="handleAddPanel('left')">
        +left
      </w-button>
      <w-button @click="handleAddPanel('right')">
        +right
      </w-button>
      <w-button @click="handleAddPanel('top')">
        +top
      </w-button>
      <w-button @click="handleAddPanel('bottom')">
        +bottom
      </w-button>
    </div>

    <w-panel-main />
  </div>
</template>