import { Group, usePanel } from "./use-panel";
import { beforeEach, describe, it, expect } from "vitest";

describe('Ui: Panel', () => {
  
 
  it('横向添加', () => {
  const { group } = usePanel()
    expect(group.panels.value.length).toBe(0)
    const p1 = group.add('left')
    expect(group.panels.value.length).toBe(1)
    const p2 = group.add('left')
    expect(group.panels.value[0].id.value).toBe(p2.id.value)
    expect(group.panels.value[1].id.value).toBe(p1.id.value)
  })

  it('纵向添加', () => {
  const { group } = usePanel()
   expect(group.panels.value.length).toBe(0)
    const p1 = group.add('top')
    expect(group.panels.value.length).toBe(1)
    const p2 = group.add('top')
    expect(group.panels.value[0].id.value).toBe(p2.id.value)
    expect(group.panels.value[1].id.value).toBe(p1.id.value)
  })

  /**
   * | |2|
   * |1|-|
   * | |3|
   */
  it('嵌套', () => {
  const { group } = usePanel()
    const p1 = group.add('left')
    const p2 = group.add('right')
    const p3 = p2.add('bottom')
    expect(group.panels.value[0].id.value).toBe(p1.id.value)
    const right = group.panels.value[1]
    expect((right as Group).isGroup).toBe(true)
    expect((right as Group).panels.value[0].id.value).toBe(p2.id.value)
    expect((right as Group).panels.value[1].id.value).toBe(p3?.id.value)
  })

  it('删除', () => {
  const { group } = usePanel()
    const p1 = group.add('left')
    const p2 = group.add('right')

    expect(group.panels.value.length).toBe(2)
    p1.remove()
    expect(group.panels.value.length).toBe(1)
  })

  it('如果容器元素数组为空, 则删除容器', () => {
  const { group } = usePanel()
    const p1 = group.add('left')
    const p2 = group.add('left')
    const p3 = p2.add('bottom')
    expect(group.panels.value.length).toBe(2)
    const container = p3.getParent() as Group
    expect(container).toBeTruthy()
    expect(container.panels.value.length).toBe(2)
    p2.remove()
    expect(container.panels.value.length).toBe(1)
    p3.remove()
    expect(container.panels.value.length).toBe(0)
    expect(group.panels.value.length).toBe(1)
  })


  it('跟元素无法删除', () => {
  const { group } = usePanel()
    const p1 = group.add('left')
    const p2 = group.add('left')
    const p3 = p2.add('bottom')
    p1.remove()
    p2.remove()
    p3.remove()
    expect(group).toBeTruthy()
    expect(group.panels.value.length).toBe(0)
  })

  // it('元素移动后, ')

  it('移动', async () => {
  const { group } = usePanel()
    /**
     * |1|2| -> |2|1|
     */
    const p1 = group.add('left')
    const p2 = group.add('right')
    const panels = group.panels.value
    expect(panels[0].id.value).toBe(p1.id.value)
    expect(panels[1].id.value).toBe(p2.id.value)
    expect(panels[0].id.value).toMatchInlineSnapshot(`"window-ui-panel-group-panel-1"`)
    expect(panels[1].id.value).toMatchInlineSnapshot(`"window-ui-panel-group-panel-2"`)

    await p1.moveTo(p2, 'right')

    expect(panels[0].id.value).toBe(p2.id.value)
    expect(panels[1].id.value).toBe(p1.id.value)

    expect(panels[0].id.value).toMatchInlineSnapshot(`"window-ui-panel-group-panel-2"`)
    expect(panels[1].id.value).toMatchInlineSnapshot(`"window-ui-panel-group-panel-1"`)
    
    // expect(panels[0].id.value).toBe(p2.id.value)
    // expect(panels[1].id.value).toBe(p1.id.value)
    // /**
    //  * |4|3|2|1| -> |3|2|4|1|
    //  */
    // const p3 = group.add('left')
    // const p4 = group.add('left')
    // p4.moveTo(p2, 'right')
    // expect(panels[0].id.value).toBe(p3.id.value)
    // expect(panels[1].id.value).toBe(p2.id.value)
    // expect(panels[2].id.value).toBe(p4.id.value)
    // expect(panels[3].id.value).toBe(p1.id.value)

    // /**
    //  * |3|2|4|1|    |3|2|4| 
    //  * | |5| | | -> |1|5| |
    //  */
    // const p5 = p2.add('bottom')
    // p1.moveTo(p3, 'bottom')
  })
})