import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Layout from "@/layout/index.vue"
import {
  TeamOutlined,
  FormOutlined,
  ScheduleOutlined,
  MessageOutlined,
  UserOutlined,
  StarOutlined,
} from "@ant-design/icons-vue"

export const dashboardRoute: RouteRecordRaw = {
  path: "/",
  component: Layout,
  redirect: "/login",
  meta: { breadcrumb: false },
  children: [
    {
      path: "/home",
      component: () => import("@/views/Home.vue"),
      meta: {
        title: "我的班级",
        icon: TeamOutlined,
      },
    },
    {
      path: "/problem",
      component: () => import("@/views/problemset/index.vue"),
      meta: { title: "查看题库", icon: ScheduleOutlined },
    },
    {
      path: "/edit",
      component: () => import("@/views/edit/index.vue"),
      meta: { title: "编辑题目", icon: FormOutlined },
    },
    {
      path: "/notice",
      component: () => import("@/views/notice/index.vue"),
      meta: { title: "消息通知", icon: MessageOutlined },
    },
    {
      path: "/profile",
      component: () => import("@/views/profile/index.vue"),
      meta: { title: "个人信息", icon: UserOutlined },
    },
    {
      path: "/favor",
      component: () => import("@/views/favor/index.vue"),
      meta: {
        hidden: true,
        title: "收藏夹",
        icon: StarOutlined,
      },
    },
  ],
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/problem/:id",
    component: () => import("@/views/problemset/problem.vue"),
    meta: { hidden: true, title: "题目详情", keepAlive: true },
  },
]

const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    meta: {
      hidden: true, title: "登陆页面"
    },
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/forget",
    meta: {
      hidden: true, title: "重置密码"
    },
    component: () => import("@/views/Forget.vue"),
  },
  {
    path: "/register",
    meta: {
      hidden: true, title: "注册页面"
    },
    component: () => import("@/views/Register.vue"),
  },
  // 404必须放在最后兜底
  {
    path: "/404",
    meta: {
      hidden: true, title: "不存在"
    },
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes: [dashboardRoute, ...routes, ...baseRoutes],
})
