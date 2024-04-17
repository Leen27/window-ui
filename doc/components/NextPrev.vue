<template>
  <div class="not-prose mt-10 grid gap-7 border-t py-10 sm:grid-cols-2">
    <NuxtLink
      :to="prev ? prev._path : '#'"
      class="group rounded-lg border p-4 transition-colors hover:border-primary/50 lg:p-6"
      v-if="prev"
    >
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition group-hover:border-primary/50 group-hover:bg-primary"
      >
        <svg class="h-4 w-4 group-hover:text-background" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
      </div>
      <p class="mt-5 font-semibold">{{ prev.title }}</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ prev.description }}</p>
    </NuxtLink>
    <span v-else>{{ "" }}</span>
    <NuxtLink
      :to="next ? next._path : '#'"
      class="group rounded-lg border p-4 text-right transition-colors hover:border-primary/50 lg:p-6"
      v-if="next"
    >
      <div
        class="ml-auto flex h-10 w-10 items-center justify-center rounded-full border bg-background transition group-hover:border-primary/50 group-hover:bg-primary"
      >
        <svg  class="h-4 w-4 group-hover:text-background" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
      </div>
      <p class="mt-5 font-semibold">{{ next.title }}</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ next.description }}</p>
    </NuxtLink>
    <span v-else>{{ "" }}</span>
  </div>
</template>

<script setup lang="ts">
  const { next, prev } = useContent();
</script>
