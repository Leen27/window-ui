import { reactive, ref, toRefs, type DefineComponent, type AsyncComponentLoader, h, type VNode } from "vue";

export type Panel = {
  title: string;
  pined?: boolean;
  open?: boolean;
  pos: Pos
  render: DefineComponent | (() => VNode)
};

export type Pos = 'left' | 'top' | 'right' | 'bottom'

export type PanelQueue = Panel[];

const panelQueue = reactive<PanelQueue>([
    {
      title: "Property",
      pined: false,
      open: false,
      pos: 'right',
      render: () => h('div', 'ssss')
    },
  ],
);

const panelDialogOpened = ref(new WeakMap())

const openPanel = (panel: Panel) => {
  panelQueue.filter(p => p.open && p.title !== panel.title).forEach(p => p.open = false)
  panel.open = true
}

const closePanel = (panel: Panel) => {
  panel.open = false
  panel.pined = false
}

const pinPanel = (panel: Panel) => {
  console.log(panel, '1')
  panel.pined = true
}

const unPin = (panel: Panel) => {
  panel.pined = false
}

export const useMainPanel = () => {
  return {
    panelQueue,
    openPanel,
    closePanel,
    pinPanel,
    unPin
  };
};
