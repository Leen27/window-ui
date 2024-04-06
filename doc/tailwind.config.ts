import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  content: [
    './app.vue',
    './pages/**/*.{vue,ts,js,jsx,tsx,md}',
  ],
  theme: {
    extend: {
      colors: {
        text: {
          foreground: '#333'
        },
        background: '#FFF'
      }
    }
  }
}
