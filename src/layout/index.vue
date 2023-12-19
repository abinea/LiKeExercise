<script setup lang="ts">
import HeadBar from './HeadBar.vue'
import Profile from './Profile.vue'
import Logo from '@/assets/logo.png'
import { fixedHeader, transitions } from '@/store/appConfig'
import type { Layout } from '@/types/layout'

const SideBar = defineAsyncComponent(
  () => import('./SideBar.vue'),
) as ReturnType<typeof defineComponent>
const useSharedIsMobile = createSharedComposable(isMobile)
const _isMobile = useSharedIsMobile(setSidebarCollapsed)

const sidebarRelated = reactive<Layout.SidebarRelated>({
  collapsed: false,
  shadowCollapsed: false,
  width: '15rem',
  collapsedWidth: '3rem',
})
const loading = reactive<Layout.Loading>({
  logout: false,
})
const keepAlivePages = ref<Layout.keepAlivePages>(new Set())

onBeforeMount(() => {
  setSidebarCollapsed()
})

function setSidebarCollapsed() {
  sidebarRelated.collapsed = _isMobile.value
  sidebarRelated.shadowCollapsed = sidebarRelated.collapsed
}

// 为子组件提供布局的相关状态信息
provide('sidebarRelated', sidebarRelated)
provide('keepAlivePages', keepAlivePages.value)
provide('loading', loading)
</script>

<template>
  <ALayout>
    <ALayoutSider
      v-if="!_isMobile" v-model:collapsed="sidebarRelated.collapsed" collapsible :trigger="null"
      :width="sidebarRelated.width" :collapsed-width="sidebarRelated.collapsedWidth" breakpoint="md"
    >
      <div style="relative; z-index: 999; display: flex; flex-direction: column; width: 100%; height: 100%;">
        <RouterLink to="/">
          <div v-if="sidebarRelated.shadowCollapsed || sidebarRelated.collapsed" class="flex-center logo-collapsed">
            <img :src="Logo" alt="Logo" class="logo">
          </div>
          <div v-else class="flex-center" style="display: flex; align-items: center; margin-top: 14px">
            <img :src="Logo" alt="Logo" class="logo">
            <span
              style="
                line-height: 32px;
                font-size: 24px;
                color: black;
                margin-left: 14px;
              "
            >
              荔课网练
            </span>
          </div>
        </RouterLink>
        <Profile v-if="!sidebarRelated?.collapsed" />
        <SideBar />
      </div>
      <div
        v-if="!_isMobile" class="sidebar-shadow" :style="{
          transform: `translate3d(${sidebarRelated.shadowCollapsed ? '-10rem' : '0'
          }, 0, 0)`,
        }"
      />
    </ALayoutSider>
    <ALayout>
      <ALayoutHeader v-if="fixedHeader">
        <HeadBar />
      </ALayoutHeader>
      <ALayoutContent id="content-window">
        <div v-if="!fixedHeader" style="padding: 0 1rem">
          <HeadBar />
        </div>
        <RouterView v-slot="{ Component, route }" class="content-view">
          <Transition :name="transitions.fadeScale" mode="out-in" appear>
            <!--
              vite的hmr和keepalive组件冲突会导致路由失效，
              https://github.com/vuejs/core/pull/5165
              不影响生产环境
            -->
            <KeepAlive :include="Array.from(keepAlivePages)" :max="10">
              <component :is="Component" :key="route.name" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </ALayoutContent>
    </ALayout>
  </ALayout>
  <Teleport to="body">
    <Transition name="slide-right" mode="out-in" appear>
      <Shadow v-if="_isMobile && !sidebarRelated.collapsed" @shadow-click="sidebarRelated.collapsed = true">
        <div class="block sidebar-mobile">
          <RouterLink to="/">
            <img :src="Logo" alt="Logo" class="logo">
          </RouterLink>
          <SideBar />
        </div>
      </Shadow>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
.sidebar-mobile {
  width: 15rem;
  height: 96vh;
  position: absolute;
  top: 2vh;
  left: 2vw;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.content-view {
  padding: 1rem;
}

.sidebar-shadow {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  height: 100%;
  background-color: var(--sidebar-background-color);
  transition: transform ease 0.2s;
}

.logo {
  height: 32px;
  object-fit: contain;
  image-rendering: optimizeQuality;
  animation: fadeIn 1s ease;
}

.logo-collapsed {
  color: @sidebar-font-color;
  font-size: 0.8rem;
  width: 100%;
  height: 3rem;
  text-align: center;
  overflow: hidden;
  animation: fadeIn 1s ease;
}
</style>
