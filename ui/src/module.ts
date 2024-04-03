import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addComponentsDir,
  addImportsDir,
} from "@nuxt/kit";
import { createRequire } from "node:module";
// @ts-ignore
import { defaultExtractor as createDefaultExtractor } from "tailwindcss/lib/lib/defaultExtractor.js";
// import type { DeepPartial, Strategy } from "./runtime/types/utils";

const defaultExtractor = createDefaultExtractor({
  tailwindConfig: { separator: ":" },
});
const _require = createRequire(import.meta.url);
const defaultColors = _require("tailwindcss/colors.js");

type UI = {
  primary?: string;
  colors?: string[];
  strategy?: string
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
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "window-ui",
    configKey: "windowUi",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve("./runtime/plugin"));

    const runtimeDir = resolve("./runtime");

    // 使用 bable 转移特定的依赖项
    nuxt.options.build.transpile.push(runtimeDir);

    // ui runtime 路径别名
    nuxt.options.alias["#window-ui"] = runtimeDir;

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
          ],
          transform: {
            vue: (content: string) => {
              return content.replaceAll(/(?:\r\n|\r|\n)/g, " ");
            },
          },
          extract: {
            vue: (content: string) => {
              return [
                ...defaultExtractor(content),
              ];
            },
          },
        },
      },
    });

    // @ts-ignore
    nuxt.hook("tailwindcss:config", function (tailwindConfig) {
      tailwindConfig.theme = tailwindConfig.theme || {};
      tailwindConfig.theme.extend = tailwindConfig.theme.extend || {};
      tailwindConfig.theme.extend.colors =
        tailwindConfig.theme.extend.colors || {};

      const globalColors: any = {
        ...(tailwindConfig.theme.colors || defaultColors),
        ...tailwindConfig.theme.extend?.colors,
      };

      // @ts-ignore
      globalColors.primary = tailwindConfig.theme.extend.colors.primary = {
        50: "rgb(var(--color-primary-50) / <alpha-value>)",
        100: "rgb(var(--color-primary-100) / <alpha-value>)",
        200: "rgb(var(--color-primary-200) / <alpha-value>)",
        300: "rgb(var(--color-primary-300) / <alpha-value>)",
        400: "rgb(var(--color-primary-400) / <alpha-value>)",
        500: "rgb(var(--color-primary-500) / <alpha-value>)",
        600: "rgb(var(--color-primary-600) / <alpha-value>)",
        700: "rgb(var(--color-primary-700) / <alpha-value>)",
        800: "rgb(var(--color-primary-800) / <alpha-value>)",
        900: "rgb(var(--color-primary-900) / <alpha-value>)",
        950: "rgb(var(--color-primary-950) / <alpha-value>)",
        DEFAULT: "rgb(var(--color-primary-DEFAULT) / <alpha-value>)",
      };

      const colors = globalColors;

      // @ts-ignore
      nuxt.options.appConfig.ui = {
        primary: "green",
        colors,
      };
    });

    // Plugins

    // addPlugin({
    //   src: resolve(runtimeDir, 'plugins', 'xxx')
    // })

    // Components

    addComponentsDir({
      path: resolve(runtimeDir, "components"),
      prefix: options.prefix || 'W',
      global: true,
      watch: false,
    });

    // Composables

    addImportsDir(resolve(runtimeDir, "composables"));
  },
});
