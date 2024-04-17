import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addComponentsDir,
  addImportsDir,
  // addTemplate,
} from "@nuxt/kit";
// @ts-ignore
import { createRequire } from "node:module";
import { fontFamily } from "tailwindcss/defaultTheme";

const _require = createRequire(import.meta.url);
const defaultColors = _require("tailwindcss/colors.js");
delete defaultColors.lightBlue;
delete defaultColors.warmGray;
delete defaultColors.trueGray;
delete defaultColors.coolGray;
delete defaultColors.blueGray;

type UI = {
  primary?: string;
  colors?: string[];
  strategy?: string;
  [key: string]: any;
};

// @ts-ignore
declare module "nuxt/schema" {
  interface AppConfigInput {
    // @ts-ignore
    windowUi?: UI;
  }
}
declare module "@nuxt/schema" {
  interface AppConfigInput {
    // @ts-ignore
    windowUi?: UI;
  }
}

export interface ModuleOptions {
  /**
   * @default 'w'
   */
  prefix?: string;
  components: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "window-ui",
    configKey: "windowUi",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    prefix: "",
    components: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve("./runtime/plugin"));

    const runtimeDir = resolve("./runtime");

    // 使用 bable 转移特定的依赖项
    nuxt.options.build.transpile.push(runtimeDir);

    // ui runtime 路径别名
    nuxt.options.alias["#window-ui"] = runtimeDir;

    nuxt.options.css.push(resolve(runtimeDir, "ui.css"));
    nuxt.options.css.push('splitpanes/dist/splitpanes.css');
    
    // Hooks

    // @nuxtjs/tailwindcss support
    // @ts-ignore - Module might not exist
    nuxt.hook("tailwindcss:config", async (tailwindConfig) => {
      tailwindConfig.theme = tailwindConfig.theme || {};
      tailwindConfig.theme.extend = tailwindConfig.theme.extend || {
        container: {
          center: true,
          padding: {
            DEFAULT: "1rem",
            sm: "2rem",
            lg: "4rem",
            xl: "5rem",
            "2xl": "6rem",
          },
        },
        fontFamily: {
          sans: ["Inter var", ...fontFamily.sans],
          mono: ["'Space Mono'", ...fontFamily.mono],
        },  
      };
      tailwindConfig.theme.extend.colors =
        tailwindConfig.theme.extend.colors || {};
      tailwindConfig.theme.extend.colors = {
        ...tailwindConfig.theme.extend.colors,
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        background: "rgb(var(--color-background) / <alpha-value>)",
        resizer: {
          "shadow-border":
            "rgb(var(--window-ui-resizer-border) / <alpha-value>)",
        },
        borderRadius: {
          xl: 'calc(var(--radius) + 4px)',
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
      };
    });

    // Modules

    await installModule("@nuxtjs/tailwindcss", {
      exposeConfig: true,
      config: {
        darkMode: "class",
        plugins: [
          require("@tailwindcss/forms")({ strategy: "class" }),
          require("@tailwindcss/aspect-ratio"),
          require("@tailwindcss/typography"),
          require("@tailwindcss/container-queries"),
        ],
        content: {
          files: [
            resolve(runtimeDir, "components/**/*.{vue,mjs,ts}"),
            resolve(runtimeDir, "ui.config/**/*.{vue,mjs,ts}"),
          ],
        },
      },
    });

    // Plugins

    // addPlugin({
    //   src: resolve(runtimeDir, 'plugins', 'xxx')
    // })

    // Components

    addComponentsDir({
      path: resolve(runtimeDir, "components"),
      prefix: options.prefix || "W",
      global: true,
      watch: false,
    });

    // Composables

    addImportsDir(resolve(runtimeDir, "composables"));

    // Template
    // const typetemplate = addTemplate({
    //   filename: 'window-ui.d.ts',
    //   getContents: () => `declare module '#window-ui' {  const cn: typeof import('${resolve('./runtime/utils/cn')}').cn; }`,
    // }).dst

    // nuxt.hook('prepare:types', (options) => {
    //   options.references.push({ path: typetemplate })
    // })
  },
});
