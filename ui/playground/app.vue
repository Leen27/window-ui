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

      <w-resizer class="bg-primary w-[100px] h-[100px] absolute left-[30%] top-50">
        <template #drag-trigger>
          ddddd
        </template>
        <div class="w-[100px] h-[100px]">
          resize me
        </div>
      </w-resizer>
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
</script>
