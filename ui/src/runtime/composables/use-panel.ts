import { createContext } from "radix-vue";
import { reactive, ref, type DefineComponent, h, type VNode, watchEffect } from "vue";
import Spliter from '../components/panel/spliter/index.vue'
import { Panel as SpliterPanel } from './use-panel-spliter'

export type Panel = {
  id: string
  title: string;
  pined?: boolean;
  open?: boolean;
  pos: PanelQueuePos
  render: DefineComponent | (() => VNode)
};

export type PanelQueuePos = 'left' | 'top' | 'right' | 'bottom'

export type PanelQueue = Panel[];

const panelQueue = reactive<PanelQueue>([
    {
      id: "window-ui-panel-queue-Property",
      title: "Property",
      pined: false,
      open: false,
      pos: 'right',
      render: () => h('div', 'p1')
    },
    {
      id: "window-ui-panel-queue-P2",
      title: "P2",
      pined: false,
      open: false,
      pos: 'right',
      render: () => h('div', 'p2')
    },
    {
      id: "window-ui-panel-queue-P3",
      title: "P3",
      pined: false,
      open: false,
      pos: 'bottom',
      render: () => h('div', 'p3')
    },
    {
      id: "window-ui-panel-queue-P4",
      title: "p4",
      pined: false,
      open: false,
      pos: 'left',
      render: () => h('div', 'p4')
    }
  ],
);

const spliterRef = ref<InstanceType<typeof Spliter>>()

const spliter = computed(() => spliterRef.value?.spliter)

const openPanel = (panel: Panel) => {
  panelQueue.filter(p => p.open && p.title !== panel.title).forEach(p => p.open = false)
  panel.open = true
}

const closePanel = (panel: Panel) => {
  panel.open = false
  panel.pined = false
  
}

const removePanel = (panel: Panel) => {
const index = panelQueue.findIndex(p => p.title === panel.title)
  if (index > -1) {
    panelQueue.splice(index, 1)
  }
}

const pinPanel = (panel: Panel) => {
  panel.pined = true
  spliterRef.value?.addPanel({
    pos: panel.pos,
    addPanel: new SpliterPanel({
      id: panel.id,
      title: panel.title
    })
  })
}


const unPinById = (panelId: string) => {
  const panel = panelQueue.find(p => p.id === panelId)
  panel && unPin(panel)
}

const unPin = (panel: Panel) => {
  panel.pined = false
  spliter.value?.removeById(panel.id)
}

export type PanelContext = {
  unPinById: typeof unPinById
}

export const [injectPanelContext, providePanelContext] =
  createContext<PanelContext>("Panel");

/**
 * 默认添加一个spliter 作为画布容器,
 * 无法成为 tagsgroup, 没有 header
 */
watchEffect(() => {
  if (spliter.value?.length === 0) {
    spliterRef.value?.addPanel({
      pos: 'left',
      addPanel: markRaw(new SpliterPanel({
        id: '--window-ui-splilter-flow-editor',
        hasHeader: false,
        tagEnable: false
      }))
    })
  }
})

const activePanel = computed(() => panelQueue.filter(i => i.open && !i.pined))

export const usePanel = () => {
  return {
    spliterRef,
    panelQueue,
    activePanel,
    openPanel,
    closePanel,
    removePanel,
    pinPanel,
    unPin,
    unPinById
  };
}