import type { NavItem } from "@nuxt/content/types"


export function mapContentNavigation (navigation: NavItem[], rootNavigation?: NavItem[]): NavItem[] {
  return navigation.map((navLink) => {
    const link = {} as NavItem 
    for (const key in navLink) {
      if (key === 'children') {
        link.children = navLink.children?.length ? mapContentNavigation(navLink.children, rootNavigation) : undefined
        continue
      }
      if (navLink[key]) {
        // @ts-ignore
        link[navMap[key] || key] = navLink[key]
      }
    }
    return link
  })
}