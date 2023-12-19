import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from 'ant-design-vue'
import router from './index'
import { appTitle } from '@/store/appConfig'
import userApi from '@/api/user'
import { userStore } from '@/store'

NProgress.configure({ showSpinner: false })

const whitelist: string[] = ['/login', '/404', '/register', '/forget', '/problem', '/edit']
let scrollTimeout: NodeJS.Timeout | null = null
let contentWindowDom: HTMLElement | null = null
let doneInfo = false

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 设置页面标题
  document.title = `${to.meta.title}-${appTitle}`
  // 路径命中白名单，放行通过
  if (whitelist.includes(to.path)) {
    next()
  }
  else {
    // 判断是否有token
    const token = getCookie('token')
    if (!token) {
      message.error('token失效，请重新登录')
      removeCookie('token') // 清除cookie
      next('/login')
    }
    else {
      if (doneInfo) {
        next()
      }
      else {
        const store = userStore()
        const info = await userApi.info()
        store.setUserInfo(info)
        doneInfo = true
        next()
      }
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
  scrollTimeout && clearTimeout(scrollTimeout)
  if (from.path === '/')
    return
  scrollTimeout = setTimeout(() => {
    if (contentWindowDom) {
      contentWindowDom.scrollTo({ top: 0, left: 0 })
      return
    }
    contentWindowDom = document.querySelector('#content-window')
    if (contentWindowDom)
      contentWindowDom.scrollTo({ top: 0, left: 0 })
  }, 350)
})
