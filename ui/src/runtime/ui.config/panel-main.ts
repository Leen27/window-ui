import { createContext } from "radix-vue"
import type { Ref } from "vue"

export type PanelMainContext = {
  barRefs: {
    top: Ref<any>
    left: Ref<any>
    right: Ref<any>
    bottom: Ref<any>
  }
}
export const [injectPanelMain, providePanelMain] = createContext<PanelMainContext>('Panel-Main')