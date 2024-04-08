<template>
  <div>
    Nuxt module playground!
    <div>
      <w-button>
        a123123
      </w-button>

      <w-resizer class="bg-primary w-[100px] h-[100px] absolute left-[30%] top-50">
        <div class="w-[100px] h-[100px]">
          resize me
        </div>
      </w-resizer>

      <w-resizer
        class="bg-primary w-[100px] h-[100px] absolute"
        :init-x="40"
        :init-y="40"
      >
        <template #drag-trigger>
          ddddd
        </template>
        <div class="w-[100px] h-[100px]">
          resize me
        </div>
      </w-resizer>

      <w-resizer
        class="bg-primary w-[100px] h-[100px]"
        pos="center"
      >
        <template #drag-trigger>
          ddddd
        </template>
        <div class="w-[100px] h-[100px]">
          resize me
        </div>
      </w-resizer>

      <div
        ref="containerRef"
        class="absolute w-[400px] h-[400px] border border-black l-1 t-0"
      >
        <w-resizer
          v-if="containerRef"
          class="bg-primary w-[100px] h-[100px]"
          pos="center"
          :container="containerRef"
        >
          <template #drag-trigger>
            dddddxxxx
          </template>
          <div class="w-[100px] h-[100px]">
            resize me
          </div>
        </w-resizer>
      </div>
      <!-- <w-drag-trigger>
        <w-drag-trigger-handle>+++</w-drag-trigger-handle>
        <w-resizer class="bg-primary w-[100px] h-[100px]">
          <div class="w-[100px] h-[100px]">
            resize me
          </div>
        </w-resizer>
      </w-drag-trigger> -->
    </div>
  </div>
</template>

<script setup>
const containerRef = ref()
</script>
