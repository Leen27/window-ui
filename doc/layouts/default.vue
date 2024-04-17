<template>
  <div>
    <!-- Mobile drawer -->
    <MobileDrawer v-model="isOpen" />
    <!-- Header -->
    <header class="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div class="container flex h-16 items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Button used to show menu on mobile -->
          <button
            @click="isOpen = true"
            class="flex h-9 w-9 items-center justify-center rounded-full border bg-background lg:hidden"
          >
            <svg class="h-5 w-5"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 9h16.5m-16.5 6.75h16.5"/></svg>
          </button>
          <NuxtLink
            class="flex items-center gap-2 text-xl font-bold text-primary"
            to="/getting-started"
            ><img src="/icon.png" class="hidden h-6 w-6 rounded object-contain lg:block" />
            window-ui</NuxtLink
          >
        </div>
        <!-- Button used to switch color mode -->
        <div class="felx items-center">
          <button
            @click="toggleTheme()"
            class="flex h-9 w-9 items-center justify-center rounded-full border bg-background"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0"/></svg>
          </button>
        </div>
      </div>
    </header>
    <div class="container gap-7 lg:grid lg:grid-cols-12">
      <!-- Sidebar -->
      <aside
        class="hidden overflow-y-auto border-r pb-8 pt-5 lg:sticky lg:top-[65px] lg:col-span-2 lg:block lg:h-[calc(100vh-65px)]"
      >
        <MainNav />
      </aside>
      <!-- Main content -->
      <main class="lg:col-span-10 lg:grid lg:grid-cols-12 lg:gap-5">
        <div
          class="prose prose-slate max-w-none px-3 dark:prose-invert prose-headings:scroll-mt-20 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-muted lg:col-span-9 lg:px-5"
        >
          <!-- Show info about the page at the top -->
          <PageIntro />
          <slot />
          <!-- Show next/prev links at the bottom -->
          <NextPrev />
        </div>
        <!-- Table of contents -->
        <div v-if="toc && toc.links && toc.links.length" class="hidden lg:col-span-3 lg:block">
          <div class="sticky top-16 overflow-y-auto pb-8 pt-5 lg:h-[calc(100vh-65px)]">
            <p class="text-sm font-semibold">Table of contents</p>

            <nav class="mt-3 flex flex-col pl-2 text-sm">
              <NuxtLink
                class="p-1.5 text-muted-foreground transition hover:text-primary hover:underline hover:underline-offset-4"
                :to="`#${l.id}`"
                v-for="(l, i) in toc.links"
                :key="i"
              >
                {{ l.text }}
              </NuxtLink>
            </nav>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { toc } = useContent();
  // Color mode
  const mode = useColorMode();
  // Toggle color mode
  const toggleTheme = () => {
    mode.value = mode.value === "light" ? "dark" : "light";
  };
  // Mobile drawer state
  const isOpen = ref(false);
</script>
