import type { ShallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoute, routes } from '@/router'

class Sidebar {
  private sidebar: ShallowRef<RouteRecordRaw[]>

  constructor(routes?: RouteRecordRaw[]) {
    this.sidebar = shallowRef(routes || [])
  }

  refreshSidebar(newRoutes?: RouteRecordRaw[]) {
    this.sidebar.value = newRoutes
      ? [...newRoutes]
      : [...dashboardRoute?.children, ...routes]
  }

  getSidebar() {
    return this.sidebar.value
  }
}

const sidebar = new Sidebar()
export default sidebar
