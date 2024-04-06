import { type Ref } from "vue";

import type { Direction } from "#window-ui/types/resizer";
import { useElementBounding } from "@vueuse/core";


type ResizerState = {
  isPointerDown: boolean;
  direction?: Direction;
  width: number
  height: number
  x: number
  y: number
};

export type ResizerContext = {
  resizerElementRef: Ref<HTMLElement>;
  shadowRef: Ref<HTMLElement>;
  handleRef?: Ref<HTMLElement>;
  elementBounding: ReturnType<typeof useElementBounding>;
  state: ResizerState;
  readonly readmaxWidth?: number;
  readonly maxHeight?: number;
  readonly minWidth?: number;
  readonly minHeight?: number;
  onResizeStart: (
    e: MouseEvent | TouchEvent,
    direction: Direction,
    handleEl: HTMLElement
  ) => void;
};
export type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';
export type ResizeEvent = MouseEvent | TouchEvent