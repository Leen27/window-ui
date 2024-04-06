<script setup lang="ts">
export interface ResizerHadleProps {
  direction: Direction;
  className?: string;
  replaceStyles?: CSSProperties;
}
import type { CSSProperties } from "vue";
import { computed, ref } from "vue";
import type { Direction } from "../../types/resizer";
import { injectResizerContext } from '#window-ui/ui.config'

// Props
const props = defineProps<ResizerHadleProps>();

// context
const { onResizeStart, state } = injectResizerContext();

// data
const rowSizeBase = {
  width: "100%",
  height: "10px",
  top: "0px",
  left: "0px",
  cursor: "row-resize",
} as const;

const colSizeBase = {
  width: "10px",
  height: "100%",
  top: "0px",
  left: "0px",
  cursor: "col-resize",
} as const;

const edgeBase = {
  width: "20px",
  height: "20px",
  position: "absolute",
} as const;

const styles: { [key: string]: CSSProperties } = {
  top: {
    ...rowSizeBase,
    top: "-5px",
  },
  right: {
    ...colSizeBase,
    left: undefined,
    right: "-5px",
  },
  bottom: {
    ...rowSizeBase,
    top: undefined,
    bottom: "-5px",
  },
  left: {
    ...colSizeBase,
    left: "-5px",
  },
  topRight: {
    ...edgeBase,
    right: "-10px",
    top: "-10px",
    cursor: "ne-resize",
  },
  bottomRight: {
    ...edgeBase,
    right: "-10px",
    bottom: "-10px",
    cursor: "se-resize",
  },
  bottomLeft: {
    ...edgeBase,
    left: "-10px",
    bottom: "-10px",
    cursor: "sw-resize",
  },
  topLeft: {
    ...edgeBase,
    left: "-10px",
    top: "-10px",
    cursor: "nw-resize",
  },
} as const;

// Refs

const handleRef = ref<HTMLElement>();

// Computed

const handleStyles = computed(() => styles[props.direction]);

// methods

const onMouseDown = (e: MouseEvent) => {
  if (!handleRef.value) return;
  onResizeStart(e, props.direction, handleRef.value);
};

const onTouchStart = (e: TouchEvent) => {
  if (!handleRef.value) return;
  onResizeStart(e, props.direction, handleRef.value);
};
</script>
<template>
  <div
    ref="handleRef"
    class="bg-gray-500 select-none absolute"
    :style="handleStyles"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  />
</template>
