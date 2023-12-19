<script lang="ts" setup>
import { resolve } from 'pathe'

// path包es代码实现
import { RouterLink } from 'vue-router'
import { MenuItem, SubMenu } from 'ant-design-vue/es'
import type { Component, Slots } from 'vue'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import SvgIcon from '../components/SvgIcon.vue'
import type { Layout } from '@/types/layout'
import sidebar from '@/store/sidebar'

const router = useRouter()
const route = useRoute()
const selectedKeys = ref<string[]>([route.path]) // 菜单默认选中项
// 默认展开选中项所在菜单
const openKeys = ref<string[]>() // 子菜单默认展开项
const sidebarRelated = inject<Layout.SidebarRelated>('sidebarRelated')
const keepAlivePages = inject<Layout.keepAlivePages>('keepAlivePages')

sidebar.refreshSidebar()

watch(() => route.path, () => {
  selectedKeys.value = [route.meta.belongs || route.path]
  // 只在展开菜单的时候更新active菜单项
  if (!sidebarRelated?.collapsed)
    updateOpenKeys()

  // 如果该路由设置页面缓存则推进缓存组
  if (route.meta.keepAlive && !keepAlivePages?.has(route.name as string))
    keepAlivePages?.add(route.name as string)
}, { immediate: true })

// 展开菜单的时候需要更新active菜单项
watch(() => sidebarRelated?.collapsed, (collapsed) => {
  if (collapsed)
    return
  updateOpenKeys()
})

function updateOpenKeys() {
  openKeys.value = router.getRoutes()
    .filter(matchedRoute =>
      route.path.includes(matchedRoute.path),
    )
    .map(matchedRoute => matchedRoute.path)
}

function getNavIcon(item: RouteMeta | undefined) {
  if (!item || (item && !item.icon))
    return null
  if (typeof item.icon === 'string')
    return h(SvgIcon, { iconName: item.icon })

  return h(item?.icon as Component)
}

function MenuItemLink(props: { route: RouteRecordRaw, url: string }, { slots }: { slots: Slots }) {
  if (props.route.meta?.external) {
    return h('a', { href: props.route.redirect, target: '_blank' }, {
      default: () => slots.default?.(),
    })
  }
  return h(RouterLink, { to: props.url }, {
    default: () => slots.default?.(),
  })
}

function MenuItemNav(props: { route: RouteRecordRaw, basePath: string }) {
  // 子菜单模板
  const subMenuTemplate = (route: RouteRecordRaw) => {
    const slots = {
      icon: () => getNavIcon(route.meta),
      title: () => route.meta?.title,
    }
    const basePath = resolve(props.basePath, route.path)
    return h(SubMenu, { key: basePath }, {
      default: () => route.children?.map(item => h(MenuItemNav, { route: item, basePath, key: item.path })),
      ...slots,
    })
  }
  // 菜单项模板
  const menuItemTemplate = (route: RouteRecordRaw) => {
    const slots = {
      icon: () => getNavIcon(route.meta),
    }
    const url = resolve(props.basePath, route.path)
    return h(MenuItem, { key: url }, {
      default: () => {
        return h(MenuItemLink, { route, url }, () => h('span', route.meta?.title))
      },
      ...slots,
    })
  }
  return props.route.meta?.hidden
    ? h('div', { style: 'display: none' })
    : props.route.children && props.route.children.filter((route: RouteRecordRaw) => !route.meta?.hidden).length > 0
      ? props.route.children.filter((route: RouteRecordRaw) => !route.meta?.hidden).length > 1
        ? subMenuTemplate(props.route)
        : menuItemTemplate(getOnlyChildPath(props.route))
      : menuItemTemplate(props.route)
}

function getOnlyChildPath(parentRoute: RouteRecordRaw): RouteRecordRaw {
  const childRoute = parentRoute.children?.find((route: RouteRecordRaw) => !route.meta?.hidden)
  return Object.assign({}, childRoute, { path: `${parentRoute.path}/${childRoute?.path}` } as RouteRecordRaw)
}
</script>

<template>
  <Scrollbar :speed="4">
    <AMenu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" :selectable="false">
      <template v-for="(sideBarRoute, index) in sidebar.getSidebar()" :key="index">
        <MenuItemNav
          :route="sideBarRoute" :base-path="sideBarRoute.path"
          style="font-size: 16px;margin-bottom: 20px;padding-left: 10px;"
          :style="{ justifyContent: sidebarRelated?.collapsed ? 'flex-start' : 'center' }"
        />
      </template>
    </AMenu>
  </Scrollbar>
</template>
