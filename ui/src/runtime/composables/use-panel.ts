import { createContext } from "radix-vue";
import { type Ref, markRaw, ref, type ShallowRef } from "vue";

export type Pos = "left" | "top" | "right" | "bottom";

export type PanelDirection = "horizontal" | "vertical";

export type InsertPos = "before" | "after";

let count = 0;

const panelMap = new Map<string, Group | Panel>();

export const posToDirection = (pos: Pos): PanelDirection => {
  return {
    top: "horizontal",
    bottom: "horizontal",
    right: "vertical",
    left: "vertical",
  }[pos] as PanelDirection;
};

export const insertPos = (pos: Pos): InsertPos => {
  return {
    top: "before",
    left: "before",
    bottom: "after",
    right: "after",
  }[pos] as InsertPos;
};

export class Panel {
  id: Ref<string> = ref("window-ui-panel-group-panel-" + count++)
  parentId: Ref<string | undefined> = ref()
  title: Ref<string> = ref('')
  __isPanel = true;

  constructor({ parent, title }: { parent?: string, title?: string }) {
    panelMap.set(this.id.value, this)
    this.parentId.value = parent;
    this.title.value = title || this.id.value
  }

  get isPanel() {
    return true;
  }

  getParent() {
    if (!this.parentId.value) return;
    return panelMap.get(this.parentId.value) as Group;
  }

  add(pos: Pos) {
    const parent = this.getParent() as Group
    return parent?.add(pos, this);
  }

  moveTo(toPanel: Panel, pos: Pos) {
    const parent = this.getParent() as Group
    parent?.move(this, toPanel, pos);
  }

  remove() {
    const parent = this.getParent()
    parent?.remove(this);
  }
}

export class Group {
  id: Ref<string> = ref("window-ui-panel-group-" + count++);
  panels: Ref<Array<Panel | Group>> = ref([]);
  direction: Ref<PanelDirection>;
  parentId: Ref<string | undefined> = ref()
  __isGroup = true;
  __isRoot?: boolean

  constructor({ direction, parent, isRoot }: { direction?: PanelDirection, parent?: string, isRoot?: boolean } = {}) {
    panelMap.set(this.id.value, this);
    this.panels.value = [] as Panel[];
    this.parentId.value = parent
    this.direction = ref(direction || "vertical");
    this.__isRoot = isRoot
  }

  get isRoot() {
    return this.__isRoot
  }

  get isGroup() {
    return true;
  }

  get length() {
    return this.panels.value.length;
  }

  getParent() {
    if (!this.parentId.value) return
    return panelMap.get(this.parentId.value) as Group
  }

  insert(pos: InsertPos, toPanel?: Panel, addPanel?: Panel) {
    const added = addPanel || 
      markRaw(new Panel({
        parent: this.id.value,
      }))
    
    added.parentId.value = this.id.value
      
    if(!toPanel) {
      pos === "after"
        ? this.panels.value.push(added)
        : this.panels.value.unshift(added);
      return added
    }

    const index = this.panels.value.findIndex((p) => p.id.value === toPanel.id.value);
    if(index > -1) {
      pos === 'after' ?
      this.panels.value.splice(index + 1, 0, added) :
      this.panels.value.splice(index, 0, added) 
    }

    return added
  }

  add(pos: Pos, toPanel?: Panel, addPanel?: Panel) {
    const dir = posToDirection(pos);
    const insertTo = insertPos(pos);

    if (dir === this.direction.value) {
      return this.insert(insertTo, toPanel, addPanel)
    }

    if (this.panels.value.length === 1) {
      this.direction.value = dir
      return this.insert(insertTo, toPanel, addPanel)
    }

    if (toPanel) {
      return this.panelToGroup(dir, insertTo, toPanel, addPanel)
    }

    return this.insert(insertTo, undefined, addPanel)
  }

  remove(panel: Panel | Group, clearCache?: boolean) {
    // 跟容器无法删除
    if ((panel as Group).isRoot) return

    const parent = panel.getParent()

    if (!parent) return

    const index = parent.panels.value.findIndex(p => panel.id.value === p.id.value)
    if(index > -1) {
      parent.panels.value.splice(index, 1)
      clearCache && panelMap.delete(panel.id.value)

      // 如果无panel, 则删除自己
      if(parent.panels.value.length === 0) {
        parent.getParent()?.remove(this)
        panelMap.delete(this.id.value)
      }
    }
  }

  move(fromPanel: Panel, toPanel: Panel, pos: Pos) {    
      fromPanel.remove()
        const toGroup = toPanel.getParent() as Group
        toGroup.add(pos, toPanel, fromPanel)
  }

  panelToGroup(direction: PanelDirection, insertTo: InsertPos, panel: Panel, addPanel?: Panel) {
    console.log(1)
      const addedGroup = markRaw(new Group({ direction, parent: this.id.value }));
      const addedPanel = addPanel || markRaw(new Panel({ parent: addedGroup.id.value }))
      addedPanel.parentId.value = addedGroup.id.value
      const index = this.panels.value.findIndex((p) => p.id.value === panel.id.value);
      if (index > -1) {
        addedGroup.panels.value =
          insertTo === "after"
            ? [panel, addedPanel]
            : [addedPanel, panel];
        panel.parentId.value = addedGroup.id.value;
        this.panels.value.splice(index, 1, addedGroup);
      }

      return addedPanel
  }

  wrap(pos: Pos, dir: PanelDirection) {
    const old = this.panels.value;
    const insertTo = insertPos(pos);
    const wrapper = markRaw(new Group({ parent: this.id.value }));
    const added = 
      markRaw(new Panel({
        parent: this.id.value,
      }))
    wrapper.panels.value = [...old.map(p => { (p as Panel).parentId.value = wrapper.id.value; return p;})];
    wrapper.direction.value = this.direction.value
    this.direction.value = dir;
    this.panels.value =
      insertTo == "after" ? [wrapper, added] : [added, wrapper];

    return wrapper
  }
}

export type PanelContext = {
  isDrag: Ref<boolean>
  dragPanel: ShallowRef<Panel | undefined>
  hoverPanel: ShallowRef<Panel | undefined>
  startDrag: (panel: Panel) => void
  onHover: (panel: Panel) => void
}

export const [injectPanelContext, providePanelContext] = createContext<PanelContext>('Panel')

export const usePanel = () => {
  /**初始化全局参数 */
  count = 0
  panelMap.clear()

  const group = markRaw(new Group({ isRoot: true }));
  const addPanel = (pos: Pos) => {
    const rootDir = group.direction.value;
    const newDir = posToDirection(pos);

    if (group.panels.value.length === 0) {
      group.add(pos);
      return;
    }

    if (rootDir === newDir) {
      group.add(pos);
      return;
    }

    if (group.panels.value.length == 1) {
      group.direction.value = newDir
      group.add(pos)
      return
    }

    group.wrap(pos, newDir);
  };

  return {
    group,
    addPanel,
  };
};
