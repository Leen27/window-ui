<script setup lang="ts"></script>
<template>
  <ClientOnly>
 <content-navigation v-slot="{ navigation }">
      <ul class="bg-primary/80 w-[300px] h-screen text-white pl-2">
        <li v-for="link of navigation" :key="link._path">
          <nuxt-link :to="link._path">
            {{ link.title }}
            <ul class="pl-5" v-if="link.children?.length">
              <li v-for="child of link.children" :key="child._path">
                <nuxt-link :to="child._path">
                  {{ child.title }}
                </nuxt-link>
              </li>
            </ul>
          </nuxt-link>
        </li>
      </ul>
    </content-navigation>
  </ClientOnly>

</template>