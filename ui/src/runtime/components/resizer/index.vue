<script setup lang="ts">
/**
 * https://github.com/bokuweb/re-resizable/blob/master/src/index.tsx
 */
import { ref, reactive, computed } from "vue";
import {
  Primitive,
  type PrimitiveProps,
  useForwardExpose} from "radix-vue";
import { cn, isTouchEvent } from "#window-ui/utils";
import type { Direction, ResizeEvent, ResizerState } from "#window-ui/types/resizer";
import type { HTMLAttributes } from "vue";
import { toReactive, useDraggable, useElementBounding } from "@vueuse/core";
import Handle from "./Handle.vue";
import { provideResizerContext } from "../../ui.config/resizer";
import { onMounted } from "vue";

interface NewSize {
  newHeight: number | string;
  newWidth: number | string;
}

export interface ResizerProps extends PrimitiveProps {
  class?: HTMLAttributes["class"];
  readmaxWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
  minWidth?: number;
  minHeight?: number;
  initX?: number
  initY?: number
  pos?: 'center'
  container?: HTMLElement
  draggble?: boolean
  enable?: Direction[]
}

const props = defineProps<ResizerProps>();
const allDirection = ["top", "right", "bottom", "left", "topRight", "bottomRight" , "bottomLeft" , "topLeft"]
const enableDirection = computed(() => props.enable ? props.enable : allDirection)
// Refs
const { forwardRef, currentElement: resizerElementRef } = useForwardExpose();
const shadowRef = ref();
const handleRef = ref();
const elementBounding = useElementBounding(resizerElementRef);

// Data
const state = reactive<ResizerState>({
  isPointerDown: false,
  width: 0,
  height: 0,
  x: 0,
  y: 0
});

// computed

const shadowVisable = computed(() => !!state.isPointerDown)

// Methods

const onResizeStart = (
  e: MouseEvent | TouchEvent,
  direction: Direction,
  handleEl: HTMLElement
) => {
  if (!handleEl) return;

  handleRef.value = handleEl;
  state.isPointerDown = true;
  state.direction = direction;

  if(elementBounding) {
    state.width = elementBounding.width.value
    state.height = elementBounding.height.value
    state.y = 0
    state.x = 0
  }

  bindEvents();
  return;
};

const onMouseUp = () => {
  if (!state.isPointerDown) return;
  unbindEvents();
  state.isPointerDown = false;

  // update container size
  resizerElementRef.value.style.width = state.width + 'px'
  resizerElementRef.value.style.height = state.height + 'px'
  resizerElementRef.value.style.left = state.x + elementBounding.x.value + 'px'
  resizerElementRef.value.style.top = state.y + elementBounding.y.value + 'px'
};

const onMouseMove = (e: ResizeEvent) => {
  const { ownerDocument } = handleRef.value!;

  if (!state.isPointerDown || !ownerDocument || !state.direction) {
    return;
  }

  if (window.TouchEvent && isTouchEvent(e)) {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (e) {
      // Ignore on fail
    }
  }
  const clientX = isTouchEvent(e) ? e.touches[0].clientX : e.clientX;
  const clientY = isTouchEvent(e) ? e.touches[0].clientY : e.clientY;

  // Calculate new size
  const { newHeight, newWidth }: NewSize = calculateNewSizeFromDirection(
    clientX,
    clientY
  )!

  if (props.maxHeight && newHeight > props.maxHeight) return
  if (props.maxWidth && newHeight > props.maxWidth) return
  if (props.minHeight && newHeight < props.minHeight) return
  if (props.minWidth && newHeight < props.minWidth) return
  if (newHeight < 1) return
  if (newWidth < 1) return

  state.width = newWidth
  state.height = newHeight
  
  if (hasDirection('left', state.direction)) {
    state.x = elementBounding.width.value - newWidth
  }

  if (hasDirection('top', state.direction)) {
    state.y = elementBounding.height.value - newHeight
  }
};

const hasDirection = (
  dir: "top" | "right" | "bottom" | "left",
  target: string
): boolean => new RegExp(dir, "i").test(target);

const calculateNewSizeFromDirection = (clientX: number, clientY: number) => {
  // const scale = props.scale || 1;
  const scale = 1;
  // const resizeRatio = this.props.resizeRatio || 1;
  const resizeRatio = 1;
  const ratio = 1;
  const { direction } = state;
  if (!direction) return;
  const original = toReactive(elementBounding);
  const {
    lockAspectRatio = false,
    lockAspectRatioExtraHeight = 0,
    lockAspectRatioExtraWidth = 0,
  } = {};
  let newWidth = original.width;
  let newHeight = original.height;
  const extraHeight = lockAspectRatioExtraHeight || 0;
  const extraWidth = lockAspectRatioExtraWidth || 0;
  if (hasDirection("right", direction)) {
    newWidth =
      original.width +
      ((clientX - (original.width + original.x)) * resizeRatio) / scale;
    if (lockAspectRatio) {
      newHeight = (newWidth - extraWidth) / ratio + extraHeight;
    }
  }
  if (hasDirection("left", direction)) {
    newWidth = original.width + ((original.x - clientX) * resizeRatio) / scale;
    if (lockAspectRatio) {
      newHeight = (newWidth - extraWidth) / ratio + extraHeight;
    }
  }
  if (hasDirection("bottom", direction)) {
    newHeight =
      original.height + ((clientY -(original.height + original.y)) * resizeRatio) / scale;
    if (lockAspectRatio) {
      newWidth = (newHeight - extraHeight) * ratio + extraWidth;
    }
  }
  if (hasDirection("top", direction)) {
    newHeight =
      original.height - ((clientY - original.y) * resizeRatio) / scale;
    if (lockAspectRatio) {
      newWidth = (newHeight - extraHeight) * ratio + extraWidth;
    }
  }
  return { newWidth, newHeight };
};
const bindEvents = () => {
  const { ownerDocument } = handleRef.value!;
  ownerDocument.addEventListener("mouseup", onMouseUp);
  ownerDocument.addEventListener("mousemove", onMouseMove);
  ownerDocument.addEventListener("mouseleave", onMouseUp);
  ownerDocument.addEventListener("touchmove", onMouseMove, {
    capture: true,
    passive: false,
  });
  ownerDocument.addEventListener("touchend", onMouseUp);
};

const unbindEvents = () => {
  const { ownerDocument } = handleRef.value!;
  ownerDocument.removeEventListener("mouseup", onMouseUp);
  ownerDocument.removeEventListener("mousemove", onMouseMove);
  ownerDocument.removeEventListener("mouseleave", onMouseUp);
  ownerDocument.removeEventListener("touchmove", onMouseMove);
  ownerDocument.removeEventListener("touchend", onMouseUp);
};

const dragRef = ref()
const { x, y } = useDraggable(dragRef, {
  initialValue: {
    x: (props.initX || 0),
    y: (props.initY || 0)
  },
  containerElement: props.container,
  disabled: !props.draggble
});

onMounted(() => {
  if (props.pos === 'center') {
    resizerElementRef.value.style.left = window.innerWidth / 2 + 'px'
    resizerElementRef.value.style.top = window.innerHeight / 2 + 'px'
  }
})

provideResizerContext({
  resizerElementRef,
  shadowRef,
  elementBounding,
  state,
  onResizeStart,
});

</script>
<template>
  <Teleport to="body">
    <Primitive
      :ref="forwardRef"
      :class="cn('fixed', props.class)"
      :style="{
        left: x + 'px',
        top: y + 'px'
      }"
    >
      <div
        ref="dragRef"
        class="select-none cursor-move"
      >
        <slot 
          name="drag-trigger"
        />
      </div>
      <div
        v-if="!!forwardRef"
        v-show="shadowVisable"
        ref="shadowRef"
        class="absolute left-0 top-0 w-full h-full border-[2px] border-resizer-shadow-border/50"
        :data-resize-pointerdown="state.isPointerDown"
        :style="{
          width: state.width + 'px',
          height: state.height + 'px',
          left: state.x + 'px',
          top: state.y + 'px'
        }"
      />

      <Handle
        v-for="d in enableDirection"
        :key="d"
        :direction="d as Direction"
      />
      <slot />
    </Primitive>
  </Teleport>
</template>
