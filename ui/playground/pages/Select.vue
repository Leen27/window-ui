<script setup lang="ts">

</script>

<template>
  <WSelect>
    <WSelectTrigger class="w-[180px]">
      <WSelectValue placeholder="WWSelect a fruit" />
    </WSelectTrigger>
    <WSelectContent>
      <WSelectGroup>
        <WSelectLabel>Fruits</WSelectLabel>
        <WSelectItem value="apple">
          Apple
        </WSelectItem>
        <WSelectItem value="banana">
          Banana
        </WSelectItem>
        <WSelectItem value="blueberry">
          Blueberry
        </WSelectItem>
        <WSelectItem value="grapes">
          Grapes
        </WSelectItem>
        <WSelectItem value="pineapple">
          Pineapple
        </WSelectItem>
      </WSelectGroup>
    </WSelectContent>
  </WSelect>
</template>