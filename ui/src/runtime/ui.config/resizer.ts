import {
  createContext,
} from "radix-vue";
import type { ResizerContext } from "../types/resizer";

export const [injectResizerContext, provideResizerContext] =
  createContext<ResizerContext>("Resizer");