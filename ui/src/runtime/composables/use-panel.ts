import { type Ref, reactive, ref } from "vue";

export type Pos = "left" | "top" | "right" | "bottom";

export type PanelDirection = "horizontal" | "vertical";

export type InsertPos = "before" | "after";

let count = 0;

export const panelGroupMap = new Map<string, Group>();

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
  id: string;
  parentId?: string;
  __isPanel = true;

  constructor({ parent }: { parent?: string }) {
    this.id = "window-ui-panel-group-panel-" + count++;
    this.parentId = parent;
  }

  get isPanel() {
    return true;
  }

  add(pos: Pos) {
    if (!this.parentId) return;
    const parent = panelGroupMap.get(this.parentId);

    parent?.add(pos, this);
  }
}

export class Group {
  id: string;
  panels: Ref<Array<Panel | Group>>;
  direction: Ref<PanelDirection>;
  __isGroup = true;

  constructor(dir?: PanelDirection) {
    this.id = "window-ui-panel-group-" + count++;
    panelGroupMap.set(this.id, this);
    this.panels = ref([] as Panel[]);
    this.direction = ref(dir || "vertical");
  }

  get isGroup() {
    return true;
  }

  get length() {
    return this.panels.value.length;
  }

  insert(pos: InsertPos) {
    const added = reactive(
      new Panel({
        parent: this.id,
      })
    );
    pos === "after"
      ? this.panels.value.push(added)
      : this.panels.value.unshift(added);
  }

  add(pos: Pos, toPanel?: Panel) {
    const dir = posToDirection(pos);
    const insertTo = insertPos(pos);

    if (dir === this.direction.value) {
      this.insert(insertTo);
      return;
    }

    if (this.panels.value.length === 1) {
      this.direction.value = dir
      this.insert(insertTo)
      return
    }

    if (toPanel) {
      console.log(toPanel)
      this.panelToGroup(dir, insertTo, toPanel)
      return;
    }

    this.insert(insertTo);
  }

  panelToGroup(dir: PanelDirection, insertTo: InsertPos, panel: Panel) {
      const added = shallowReactive(new Group(dir));
      const index = this.panels.value.findIndex((p) => p.id === panel.id);
      if (index > -1) {
        added.panels.value =
          insertTo === "after"
            ? [panel, new Panel({ parent: added.id })]
            : [new Panel({ parent: added.id }), panel];
        panel.parentId = added.id;
        this.panels.value.splice(index, 1, added);
      }
  }

  wrap(pos: Pos, dir: PanelDirection) {
    const old = this.panels.value;
    const insertTo = insertPos(pos);
    const wrapper = shallowReactive(new Group());
    const added = reactive(
      new Panel({
        parent: this.id,
      })
    );
    wrapper.panels.value = [...old.map(p => { (p as Panel).parentId = wrapper.id; return p;})];
    wrapper.direction.value = this.direction.value
    this.direction.value = dir;
    this.panels.value =
      insertTo == "after" ? [wrapper, added] : [added, wrapper];
  }
}

export const usePanel = () => {
  const group = new Group();
  const addPanel = (pos: Pos) => {
    const rootDir = group.direction;
    const newDir = posToDirection(pos);

    if (group.panels.value.length === 0) {
      group.add(pos);
      return;
    }

    if (rootDir.value === newDir) {
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
