# Resizer

```vue
<template>
<div>
    <w-resizer class="bg-primary w-[100px] h-[100px] absolute left-[30%] top-50">
        <div class="w-[100px] h-[100px]">
          resize me
        </div>
      </w-resizer>
</div>
</template>
```
<template>
    <w-resizer class="bg-primary w-[100px] h-[100px] absolute"
    :initX="500"
    :initY="500"
    :max-width="200"
    :min-width="100"
    :max-height="200"
    >
      <template #drag-trigger>
        <div class="w-full h-[30px] bg-green-400"></div>
      </template>
        <div class="w-[100px] h-[100px]">
          resize me
        </div>
      </w-resizer>
</template>
