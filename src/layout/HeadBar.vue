<script setup lang="ts">
import type { Layout } from '@/types/layout'

const props = defineProps({
  isSingle: {
    type: Boolean,
    default: false,
  },
})
const sidebarRelated = inject<Layout.SidebarRelated>('sidebarRelated')
const loading = inject<Layout.Loading>('loading')
const router = useRouter()
let timeout: NodeJS.Timeout

function logout() {
  if (loading)
    loading.logout = true
  removeCookie('token')
  router.replace('/login')
}
function toggleSidebar() {
  if (!sidebarRelated)
    return
  if (!sidebarRelated.collapsed) {
    sidebarRelated.collapsed = true
    nextTick(() => {
      sidebarRelated.shadowCollapsed = true
    })
  }
  else {
    timeout && clearTimeout(timeout)
    sidebarRelated.shadowCollapsed = false
    timeout = setTimeout(() => {
      sidebarRelated.collapsed = false
    }, 120)
  }
}

function navigateBack() {
  router.back()
}
</script>

<template>
  <header>
    <section>
      <MenuFoldOutlined
        v-if="!props.isSingle"
        class="icon-sidebar-trigger"
        :class="[sidebarRelated?.collapsed && 'collapsed']"
        @click="toggleSidebar"
      />
      <span
        v-else
        style="font-size: 1.125rem; font-weight: 500; margin-left: 1rem"
        @click="navigateBack"
      >
        <LeftOutlined /> 返回题库
      </span>
    </section>
    <section style="font-size: 1.125rem">
      <ASpace size="middle" style="margin-right: 1rem">
        <BellOutlined style="margin-right: 0.5rem" />
        <SettingOutlined />
        <ADivider
          type="vertical"
          style="background-color: #e1e1e1; height: 1rem; margin: 0"
        />
      </ASpace>
      <div
        style="
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          margin-right: 1rem;
        "
      >
        <span @click="logout">
          <LogoutOutlined style="margin-right: 0.5rem" /> 登出
        </span>
      </div>
    </section>
  </header>
</template>

<style scoped lang="less">
header {
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;

  section {
    &:first-of-type {
      display: inline-flex;
      flex-wrap: nowrap;
      align-items: center;
      flex-shrink: 0;
      overflow: hidden;
      flex: 1;
    }

    &:last-of-type {
      display: inline-flex;
      flex-wrap: nowrap;
      flex-shrink: 0;
      align-items: center;
    }
  }
}

.icon-sidebar-trigger {
  cursor: pointer;
  margin-right: 1.2rem;
  font-size: 1.2rem;

  &.collapsed {
    transform: rotate(180deg);
  }
}
</style>
