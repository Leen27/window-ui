// build.config.ts

import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // entries:[
  //   { builder: 'mkdist', input: './src/runtime', pattern: ['**/*.vue'], loaders: ['vue'] },
  // ],
  failOnWarn: false,
  declaration: true,
  clean: true,
  externals: [
    '@nuxt/schema',
  ],
  rollup: {
    emitCJS: true,
  },
});