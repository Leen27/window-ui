import { createContext } from "radix-vue";
import { Pane } from "splitpanes";
import { type Ref, markRaw, ref, type ShallowRef, nextTick, toValue } from "vue";
import {isDefined} from '../utils'

export type Pos = "left" | "top" | "right" | "bottom" | "tags";

export type PanelDirection = "horizontal" | "vertical";

export type InsertPos = "before" | "after";

let count = 0;

const panelMap = markRaw(new Map<string, Group | Panel | TagsGroup>());

export const posToDirection = (pos: Pos): PanelDirection => {
  return {
    top: "horizontal",
    bottom: "horizontal",
    right: "vertical",
    left: "vertical",
    tags: "tags",
  }[pos] as PanelDirection;
};

export const insertPos = (pos: Pos): InsertPos => {
  return {
    top: "before",
    left: "before",
    bottom: "after",
    right: "after",
    tags: "after",
  }[pos] as InsertPos;
};

export class Panel {
  id: Ref<string> = ref("window-ui-panel-group-panel-" + count++);
  parentId: Ref<string | undefined> = ref();
  title: Ref<string> = ref("");
  hasHeader?: boolean = true
  tagEnable?: boolean = true
  __isPanel = true;

  constructor({ parent, title, hasHeader, id, tagEnable }: { parent?: string; title?: string, hasHeader?: boolean, id?: string, tagEnable?: boolean }) {
    if(id) {
      this.id.value = id 
    }
    panelMap.set(this.id.value, this);
    this.parentId.value = parent;
    this.title.value = title || toValue(this.id);
    this.hasHeader = isDefined(hasHeader) ? hasHeader : true
    this.tagEnable= isDefined(tagEnable) ? tagEnable : true
  }

  get isPanel() {
    return true;
  }

  getParent() {
    if (!toValue(this.parentId)) return;
    return panelMap.get(toValue(this.parentId)!) as Group | TagsGroup;
  }

  add(pos: Pos) {
    const parent = this.getParent() as Group;
    return parent?.add({ pos, toPanel: this });
  }

  moveTo(toPanel: Panel, pos: Pos) {
    if (pos === 'tags' && !toPanel.tagEnable) {
      return;
    }
    const parent = this.getParent() as Group;
    return parent?.move({ fromPanel: this, toPanel, pos});
  }

  remove() {
    const parent = this.getParent();
    parent?.remove({ panel: this, needUnwrap: true });
  }
}

export interface IPanelGroup {
  length: number;
  getParent(): Group | TagsGroup | undefined;
  add({
    pos,
    toPanel,
    addPanel,
  }: {
    pos: Pos;
    toPanel?: Panel;
    addPanel: Panel;
  }): Panel;
  remove({panel, clearCache}: {
    panel: Panel
    clearCache?: boolean
    needUnwrap?: boolean
}): void;
  move({fromPanel, toPanel, pos}: {fromPanel: Panel, toPanel: Panel, pos?: Pos }): Promise<any> 
}

export class TagsGroup implements IPanelGroup {
  id: Ref<string> = ref("window-ui-panel-tags-group-" + count++);
  panels: Ref<Array<Panel>> = ref([]);
  parentId: Ref<string | undefined> = ref();
  __isTagsGroup = true;

  constructor({ parent }: { parent?: string } = {}) {
    panelMap.set(toValue(this.id), this);
    this.panels.value = [] as Panel[];
    this.parentId.value = parent;
  }

  get isTagsGroup() {
    return true;
  }

  get length() {
    return this.panels.value.length;
  }

  getParent() {
    if (!this.parentId.value) return;
    return panelMap.get(this.parentId.value) as Group;
  }

  add({ addPanel, pos }: { addPanel?: Panel, pos: Pos }) {
    const added = markRaw(addPanel || new Panel({ parent: toValue(this.id) }))
    if (pos === 'tags') {
      this.panels.value.push(added);
      added.parentId.value = toValue(this.id)
    } else {
      this.getParent()?.add({
        pos,
        toPanel: this,
        addPanel
      })
    }
    
    return added;
  }

  remove({panel}: {panel: Panel}) {
    const index = this.panels.value.findIndex(
      (p) => toValue(p.id) === toValue(panel.id)
    );
    if (index > -1) {
      this.panels.value.splice(index, 1);

      if (this.panels.value.length === 0) {
        this.destroy();
      }
    }
  }

  destroy() {
    const parent = this.getParent();
    if (!parent?.isGroup) {
      return;
    }
    parent.remove({panel: this});
    panelMap.delete(toValue(this.id));
  }

  move({fromPanel, toPanel, pos}: {fromPanel: Panel, toPanel: Panel, pos: Pos}) {
    toPanel.getParent()?.add({ pos, addPanel: fromPanel });
    this.remove({panel: fromPanel});

    return Promise.resolve()
  }
}

export class Group implements IPanelGroup {
  id: Ref<string> = ref("window-ui-panel-group-" + count++);
  panels: Ref<Array<Panel | Group | TagsGroup>> = ref([]);
  direction: Ref<PanelDirection>;
  parentId: Ref<string | undefined> = ref();
  __isGroup = true;
  __isRoot?: boolean;

  constructor({
    direction,
    parent,
    isRoot,
  }: { direction?: PanelDirection; parent?: string; isRoot?: boolean } = {}) {
    panelMap.set(this.id.value, this);
    this.panels.value = [] as Panel[];
    this.parentId.value = parent;
    this.direction = ref(direction || "vertical");
    this.__isRoot = isRoot;
  }

  get isRoot() {
    return this.__isRoot;
  }

  get isGroup() {
    return true;
  }

  get length() {
    return toValue(this.panels).length;
  }

  getParent() {
    if (!this.parentId.value) return;
    return panelMap.get(this.parentId.value) as Group;
  }

  insert(pos: InsertPos, toPanel?: Panel | TagsGroup, addPanel?: Panel) {
    const added =markRaw(
      addPanel ||
        new Panel({
          parent: toValue(this.id),
        })
      );

    added.parentId.value = toValue(this.id);

    if (!toPanel) {
      pos === "after"
        ? this.panels.value.push(added)
        : this.panels.value.unshift(added);
      return added;
    }

    const index = this.panels.value.findIndex(
      (p) => toValue(p.id) === toValue(toPanel.id)
    );
    if (index > -1) {
      pos === "after"
        ? this.panels.value.splice(index + 1, 0, added)
        : this.panels.value.splice(index, 0, added);
    }

    return added;
  }

  toTags(toPanel?: Panel | TagsGroup, addPanel?: Panel): Panel {
    const added = markRaw(addPanel || new Panel({}));

    if ((toPanel as TagsGroup)?.isTagsGroup) {
      (toPanel as TagsGroup).add({
        addPanel: added,
        pos: 'tags'
      })
      return added;
    }

    const tagsGroup = markRaw(new TagsGroup({ parent: toPanel?.parentId.value }));
    tagsGroup.panels.value.push(added);
    added.parentId.value = toValue(tagsGroup.id);
    if(toPanel && (toPanel as Panel)?.isPanel) {
      tagsGroup.add({
        addPanel: toPanel as Panel,
        pos: 'tags'
      })
    }
    
    const index = this.panels.value.findIndex(
      (p) => toValue(p.id) === toValue(toPanel?.id)
    );
    if (index > -1) {
      this.panels.value.splice(index, 1, tagsGroup);
    }
    // toPanel && this.remove(toPanel)

    return added;
  }

  add({
    pos,
    toPanel,
    addPanel,
  }: {
    pos: Pos;
    toPanel?: Panel | TagsGroup;
    addPanel?: Panel;
  }) {
    // Tags
    if (pos === "tags") {
      return this.toTags(toPanel, addPanel);
    }

    // Split
    const dir = posToDirection(pos);
    const insertTo = insertPos(pos);

    if (dir === toValue(this.direction)) {
      return this.insert(insertTo, toPanel, addPanel);
    }

    if (this.panels.value.length === 1) {
      this.direction.value = dir;
      return this.insert(insertTo, toPanel, addPanel);
    }

    if (toPanel) {
      return this.panelToGroup(dir, insertTo, toPanel, addPanel);
    }

    return this.insert(insertTo, undefined, addPanel);
  }

  removeById(panelId: string) {
    const panel = panelMap.get(panelId)
    if(!panel) return

    this.remove({
      panel,
      clearCache: true,
    })
  }

  remove({panel, clearCache, needUnwrap = true }: {
    panel: Panel | Group | TagsGroup, clearCache?: boolean,
    needUnwrap?: boolean
  }) {
    // 跟容器无法删除
    if ((panel as Group).isRoot) return;

    const parent = panel.getParent();

    if (!parent) return;

    const index = parent.panels.value.findIndex(
      (p) => toValue(panel.id) === toValue(p.id)
    );
    if (index > -1) {
      parent.panels.value.splice(index, 1);
      clearCache && panelMap.delete(toValue(panel.id));

      // 如果无panel, 则删除自己
      if (parent.length === 0) {
        this.destroy();
      }

      // 如果只有一个panel, 则把自己unGroup到上一个group上,避免嵌套
      if (parent.length === 1 && needUnwrap) {
        this.unWrap(this)
      }
    }
  }

  unWrap(group: Group) {
    if(!group.isGroup) return
    const parent = group.getParent()
    if(!parent) return
    const index = parent.panels.value.findIndex(p => toValue(p.id) === toValue(group.id))
    if (index < 0) return
    const shiftPanels = group.panels.value
    parent.panels.value.splice(index, 1, ...shiftPanels.map(p =>{ p.parentId.value = toValue(parent.id); return p;}))

    if(!this.isRoot) {
      panelMap.delete(toValue(this.id))
    }
  }

  destroy() {
    if(this.isRoot) return
    this.getParent()?.remove({panel: this});
    panelMap.delete(toValue(this.id));
  }

  move({fromPanel, toPanel, pos = 'left'}: {fromPanel: Panel, toPanel: Panel, pos?: Pos }) {
    fromPanel.remove();
    return nextTick(() => {
      const toGroup = toPanel.getParent();
      toGroup?.add({ pos, toPanel, addPanel: fromPanel });
    })
  }

  panelToGroup(
    direction: PanelDirection,
    insertTo: InsertPos,
    panel: Panel | TagsGroup,
    addPanel?: Panel
  ) {
    const parent = panel.getParent()

    // 如果父只有1个元素,就不创建新的group,避免嵌套
    const addedGroup = parent?.length === 1 ? parent : markRaw(new Group({ direction, parent: this.id.value }));
    const addedPanel =
      addPanel || markRaw(new Panel({ parent: toValue(addedGroup.id) }));
    addedPanel.parentId.value = toValue(addedGroup.id);
    const index = this.panels.value.findIndex(
      (p) => toValue(p.id) === toValue(panel.id)
    );
    if (index > -1) {
      addedGroup.panels.value =
        insertTo === "after" ? [panel, addedPanel] : [addedPanel, panel];
      panel.parentId.value = toValue(addedGroup.id);
      this.panels.value.splice(index, 1, addedGroup);
    }

    return addedPanel;
  }

  wrap(pos: Pos, dir: PanelDirection) {
    const old = toValue(this.panels);
    const insertTo = insertPos(pos);
    const wrapper = markRaw(new Group({ parent: toValue(this.id) }));
    const added = markRaw(
      new Panel({
        parent: toValue(this.id),
      })
    );
    wrapper.panels.value = [
      ...old.map((p) => {
        (p as Panel).parentId.value = toValue(wrapper.id);
        return p;
      }),
    ];
    wrapper.direction.value = toValue(this.direction);
    this.direction.value = dir;
    this.panels.value =
      insertTo == "after" ? [wrapper, added] : [added, wrapper];

    return wrapper;
  }
}

export type PanelSpliterContext = {
  isDrag: Ref<boolean>;
  dragPanel: ShallowRef<Panel | undefined>;
  hoverPanel: ShallowRef<Panel | undefined>;
  startDrag: (panel: Panel) => void;
  onHover: (panel: Panel) => void;
};

export const [injectPanelSpliterContext, providePanelSpliterContext] =
  createContext<PanelSpliterContext>("PanelSpliter");

export const cratePanel = (...options: any) => {
  return markRaw(new Panel({...options}))
}

export const usePanelSpliter = () => {
  /**初始化全局参数 */
  count = 0;
  panelMap.clear();

  const group = markRaw(new Group({ isRoot: true }));

  const addPanel = ({pos, addPanel}: {pos: Pos, addPanel?: Panel}) => {
    const rootDir = group.direction.value;
    const newDir = posToDirection(pos);

    if (group.panels.value.length === 0) {
      group.add({ pos, addPanel });
      return;
    }

    if (rootDir === newDir) {
      group.add({ pos, addPanel });
      return;
    }

    if (group.panels.value.length == 1) {
      group.direction.value = newDir;
      group.add({ pos, addPanel });
      return;
    }

    group.wrap(pos, newDir);
  };

  return {
    group,
    addPanel,
  };
};
