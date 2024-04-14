// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/scrollbars.css',
  ],
  modules: [
    '@nuxt/content',
    'window-ui-module',
    '@nuxtjs/tailwindcss',
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: 'vitesse-dark'
    }
  }
})
