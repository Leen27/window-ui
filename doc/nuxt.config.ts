// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: [
    // '~/assets/css/main.css',
    // '~/assets/css/scrollbars.css',
    // '~/assets/css/tailwind.css',
  ],
  modules: [
    'window-ui-module',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    "@vueuse/nuxt",
    "nuxt-lodash",
    "nuxt-headlessui",
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: 'vitesse-dark'
    }
  },
  headlessui: { prefix: "H" },

  app: {
    head: {
      title: "WINDOW-UI",
      titleTemplate: "%s - WINDOW-UI",
      link: [
        // //Inter font
        // { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        // { rel: "preconnect", href: "https://rsms.me/" },
        // // Mono font
        // {
        //   rel: "stylesheet",
        //   href: "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
        // },
      ],
    },
  },
    
  // This will ensure that when we go to the / page, we get redirected to the /getting-started page
  routeRules: {
    "/": { redirect: "/getting-started" },
  },
})
