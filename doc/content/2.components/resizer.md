# Resizer

```vue
      <w-resizer
        class="bg-primary w-[300px] h-[300px]"
        pos="center"
      >
        <template #drag-trigger>
          <div class="w-full h-[30px] bg-green-400">Header</div>
        </template>
        <div class="w-[100px] h-[100px] bg-blue-300 text-white absolute left-[50%] translate-x-[-50%]">
          resize me
        </div>
      </w-resizer>
```

<template>
      <w-resizer
        class="bg-primary w-[300px] h-[300px]"
        pos="center"
      >
        <template #drag-trigger>
          <div class="w-full h-[30px] bg-green-400">Header</div>
        </template>
        <div class="w-[100px] h-[100px] bg-blue-300 text-white absolute left-[50%] translate-x-[-50%]">
          resize me
        </div>
      </w-resizer>
</template>