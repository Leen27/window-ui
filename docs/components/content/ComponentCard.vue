<script setup lang="ts">
import { upperFirst, camelCase, kebabCase } from 'scule'

// eslint-disable-next-line vue/no-dupe-keys
const props = defineProps({
  slug: {
    type: String,
    default: null
  },
  padding: {
    type: Boolean,
    default: true
  },
  props: {
    type: Object,
    default: () => ({})
  },
  code: {
    type: String,
    default: null
  },
  slots: {
    type: Object,
    default: null
  },
  baseProps: {
    type: Object,
    default: () => ({})
  },
  ui: {
    type: Object,
    default: () => ({})
  },
  excludedProps: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array as PropType<{ name: string; values: string[]; restriction: 'expected' | 'included' | 'excluded' | 'only' }[]>,
    default: () => []
  },
  backgroundClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  },
  extraClass: {
    type: String,
    default: ''
  },
  previewOnly: {
    type: Boolean,
    default: false
  },
  componentClass: {
    type: String,
    default: ''
  },
  ignoreVModel: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

let name = props.slug || `W${upperFirst(camelCase(route.params.slug[route.params.slug.length - 1]))}`

const meta = await fetchComponentMeta(name)

// const { data: ast } = await useAsyncData(
//   `${name}-ast-${JSON.stringify({ props: componentProps, slots: props.slots, code: props.code })}`,
//   async () => {
//     let formatted = ''
//     try {
//       formatted = await $prettier.format(code.value) || code.value
//     } catch (error) {
//       formatted = code.value
//     }

//     return transformContent('content:_markdown.md', formatted, {
//       markdown: {
//         highlight: {
//           highlighter,
//           theme: {
//             light: 'material-theme-lighter',
//             default: 'material-theme',
//             dark: 'material-theme-palenight'
//           }
//         }
//       }
//     })
//   }, { watch: [code] })
</script>
<template>
  <div>{{ name }}</div>
  <div>{{ meta }}</div>
  <!-- <div class="flex border border-b-0 border-gray-200 dark:border-gray-700 relative not-prose" :class="[{ 'p-4': padding }, propsToSelect.length ? 'border-t-0' : 'rounded-t-md', backgroundClass, extraClass]">
      <component :is="name" v-model="vModel" v-bind="fullProps" :class="componentClass">
        <ContentSlot v-if="$slots.default" :use="$slots.default" />

        <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
          <ContentSlot :name="slot" unwrap="p" />
        </template>
      </component>
    </div> -->
</template>
