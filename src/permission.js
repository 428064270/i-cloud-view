import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout/index'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

setTimeout(() => {
  router.beforeEach(async(to, from, next) => {
    NProgress.start()

    document.title = getPageTitle(to.meta.title)

    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        if (hasGetUserInfo) {
          next()
        } else {
          try {
            const info = await store.dispatch('user/info')
            const infoRouters = await getRouters(info.menus)
            await router.addRoutes(infoRouters)
            store.commit('user/SET_ROUTERS', infoRouters)
            next()
          } catch (error) {
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
})

async function getRouters(menus) {
  // 创建路由
  const routers = []
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    const router = {
      path: menu.path,
      component: Layout,
      redirect: '',
      name: menu.name,
      meta: { title: menu.name, icon: menu.icon },
      children: []
    }
    menu.children.forEach((item, index) => {
      if (index === 0) {
        router.redirect = menu.path + item.path
      }
      router.children.push({
        path: item.path,
        name: item.name,
        component: () => import(item.componentPath),
        meta: { title: item.name, icon: item.icon }
      })
    })
    routers.push(router)
  }
  routers.push({
    path: '*',
    redirect: '/404',
    hidden: true
  })
  return routers
}
