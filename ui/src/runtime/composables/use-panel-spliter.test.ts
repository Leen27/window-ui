import { Group, Panel, usePanelSpliter } from "./use-panel-spliter";
import { describe, it, expect } from "vitest";

describe('Ui: Panel', () => {
  
 
  it('横向添加', () => {
  const { group } = usePanelSpliter()
    expect(group.panels.value.length).toBe(0)
    const p1 = group.add({pos: 'left'})
    expect(group.panels.value.length).toBe(1)
    const p2 = group.add({pos: 'left'})
    expect(group.panels.value[0].id.value).toBe(p2.id.value)
    expect(group.panels.value[1].id.value).toBe(p1.id.value)
  })

  it('纵向添加', () => {
  const { group } = usePanelSpliter()
   expect(group.panels.value.length).toBe(0)
    const p1 = group.add({ pos: 'top' })
    expect(group.panels.value.length).toBe(1)
    const p2 = group.add({ pos: 'top' })
    expect(group.panels.value[0].id.value).toBe(p2.id.value)
    expect(group.panels.value[1].id.value).toBe(p1.id.value)
  })

  /**
   * | |2|
   * |1|-|
   * | |3|
   */
  it('嵌套', () => {
  const { group } = usePanelSpliter()
    const p1 = group.add({ pos: 'left' })
    const p2 = group.add({ pos: 'right' })
    const p3 = p2.add('bottom')
    expect(group.panels.value[0].id.value).toBe(p1.id.value)
    const right = group.panels.value[1]
    expect((right as Group).isGroup).toBe(true)
    expect((right as Group).panels.value[0].id.value).toBe(p2.id.value)
    expect((right as Group).panels.value[1].id.value).toBe(p3?.id.value)
  })

  it('删除', () => {
  const { group } = usePanelSpliter()
    const p1 = group.add({ pos: 'left' })
    const p2 = group.add({ pos: 'right' })

    expect(group.panels.value.length).toBe(2)
    p1.remove()
    expect(group.panels.value.length).toBe(1)
  })

  it('如果容器元素数组为空, 则删除容器', async () => {
  const { group } = usePanelSpliter()
    const p1 = group.add({ pos: 'left' })
    const p2 = group.add({ pos: 'left' })
    const p3 = p2.add('bottom')
    expect(group.panels.value.length).toBe(2)
    const container = p3.getParent() as Group
    expect(container).toBeTruthy()
    expect(container.panels.value.length).toBe(2)
    p2.remove()
    expect(container.panels.value.length).toBe(1)
    p3.remove()
    expect(group.panels.value.length).toBe(1)
  })


  it('跟元素无法删除', () => {
  const { group } = usePanelSpliter()
    const p1 = group.add({ pos: 'left' })
    const p2 = group.add({ pos: 'left' })
    const p3 = p2.add('bottom')
    p1.remove()
    p2.remove()
    p3.remove()
    expect(group).toBeTruthy()
    expect(group.panels.value.length).toBe(0)
  })

  // it('元素移动后, ')

  it('移动', async () => {
  const { group } = usePanelSpliter()
    /**
     * |1|2| -> |2|1|
     */
    const p1 = group.add({ pos: 'left' })
    const p2 = group.add({ pos: 'right' })
    const panels = group.panels.value
    expect(panels[0].id.value).toBe(p1.id.value)
    expect(panels[1].id.value).toBe(p2.id.value)

    await p1.moveTo(p2, 'right')

    expect(panels[0].id.value).toBe(p2.id.value)
    expect(panels[1].id.value).toBe(p1.id.value)

    
    /**
     * |4|3|2|1| -> |3|2|4|1|
     */

    const p3 = group.add({ pos: 'left' })
    const p4 = group.add({ pos: 'left' })
    expect(panels[0].id.value).toBe(p4.id.value)
    expect(panels[1].id.value).toBe(p3.id.value)
    expect(panels[2].id.value).toBe(p2.id.value)
    expect(panels[3].id.value).toBe(p1.id.value)

    await p4.moveTo(p2, 'right')

    expect(panels[0].id.value).toBe(p3.id.value)
    expect(panels[1].id.value).toBe(p2.id.value)
    expect(panels[2].id.value).toBe(p4.id.value)
    expect(panels[3].id.value).toBe(p1.id.value)

    /**
     * |3|2|4|1|    |3|2|4| 
     * | |5| | | -> |1|5| |
     */
    const p5 = p2.add('bottom')
    expect(panels[0] instanceof Panel).toBe(true)
    expect(panels[3] instanceof Panel).toBe(true)

    await p1.moveTo(p3, 'bottom')
    expect(panels[0] instanceof Group).toBe(true)
    expect((panels[0] as Group).panels.value[0].id.value).toBe(p3.id.value)
    expect((panels[0] as Group).panels.value[1].id.value).toBe(p1.id.value)
    expect(panels[3]).toBeUndefined()
  })

  it('移动到其他group后, panel的parent id 要指向新 group', async () => {
    const { group } = usePanelSpliter()
    /**
     * |1|2|
     * | |3|
     */
    const p1 = group.add({ pos: 'right' })
    const p2 = group.add({ pos: 'right' })
    const p3 = p2.add('bottom')
    const panels = group.panels.value
    expect(p3.parentId.value).toBe(panels[1].id.value)
    await p3.moveTo(p1, 'bottom')
    expect(p3.parentId.value).toBe(panels[0].id.value)
  })
})