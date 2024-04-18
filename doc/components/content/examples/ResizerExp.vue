<template>
  <w-resizer
    class="bg-primary w-[100px] h-[100px]"
    :initX="500"
    :initY="100"
    draggble
  >
    <template #drag-trigger>
      <div class="w-full h-[30px] bg-green-400">Header (可以拖拽)</div>
    </template>
    <div
      class="w-[100px] h-[100px] bg-blue-300 text-white absolute left-[50%] translate-x-[-50%]"
    >
      resize me
    </div>
  </w-resizer>

  <w-resizer class="bg-primary w-[100px] h-[100px]" pos="center">
    <template #drag-trigger>
      <div class="w-full h-[30px] bg-green-400">Header2(不可以拖拽)</div>
    </template>
    <div
      class="w-[100px] h-[100px] bg-blue-300 text-white absolute left-[50%] translate-x-[-50%]"
    >
      resize me
    </div>
  </w-resizer>

  <w-resizer
    class="bg-primary w-[100px] h-[100px] fixed top-[200px] left-[400px]"
    :enable="['right']"
  >
    <template #drag-trigger>
      <div class="w-full h-[30px] bg-green-400">Header(不可以拖拽)</div>
    </template>
    <div
      class="w-[100px] h-[100px] bg-blue-300 text-white absolute left-[50%] translate-x-[-50%]"
    >
      只能改变右边
    </div>
  </w-resizer>
</template>
