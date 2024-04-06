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
import { defaultExtractor as createDefaultExtractor } from "tailwindcss/lib/lib/defaultExtractor.js";

const defaultExtractor = createDefaultExtractor({
  tailwindConfig: { separator: ":" },
});

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

    nuxt.options.css.push(resolve(runtimeDir, 'ui.css'))

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
        theme: {
          extend: {
            colors: {
              primary: 'rgb(var(--color-primary) / <alpha-value>)',
            }
          }
        }
      },
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
