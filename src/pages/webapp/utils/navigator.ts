import qs from 'qs'

import { MOBILE_HOME_PAGE, MOBILE_LOGIN_PAGE } from '@/constants'
import { isPCByWidth } from '@/utils'
import { getPathname, push } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

export const MAIN_PAGES = ['/app/quote', '/app/trade', '/app/position', '/app/user-center']

/**
 *移动端跳转
 * @param path 要跳转的页面
 * @param query 页面参数
 */
export const navigateTo = (path: string, query?: any) => {
  const hasQuery = query && Object.keys(query).length > 0
  const { redirect, ...searchParams } = qs.parse(location.search, { ignoreQueryPrefix: true })

  // 如果存在redirect参数，则跳转到redirect参数指定的页面
  if (redirect) {
    push(`${redirect}?${qs.stringify(searchParams)}`)
    return
  }

  push(hasQuery ? `${path}?${qs.stringify(query)}` : path)
}

// 跳转首页
export const goHome = () => navigateTo('/app/quote')

// 是否是主页面
export const isMainTabbar = (pathname: string) => MAIN_PAGES.includes(getPathname(pathname))

// 如果在移动端模式下 地址栏输入的是pc端路由，则跳转到移动端页面
export const handleJumpMobile = () => {
  const token = STORAGE_GET_TOKEN()
  const ispc = isPCByWidth()
  // 在移动端存在pc的路由，则跳转到移动端对应路由激活Tabbar
  const purePathname = getPathname(location.pathname)
  let activeTabbarPath = ''
  if (!ispc) {
    if (token) {
      if (purePathname.startsWith('/trade')) {
        // 移动端存在PC端交易页面的路由，则跳转到移动端交易页面激活Tabbar
        activeTabbarPath = MOBILE_HOME_PAGE
      } else if (['/account', '/record', '/setting', '/copy-trading'].some((path) => purePathname.startsWith(path))) {
        // 移动端存在PC端个人中心页面的路由，则跳转到移动端个人中心页面激活Tabbar
        activeTabbarPath = '/app/user-center'
      }

      // 已经登录过，进入登录页面跳转到首页
      // if (['/app/login', '/user/login'].some((path) => purePathname.startsWith(path))) {
      //   activeTabbarPath = MOBILE_HOME_PAGE
      // }
    } else {
      if (purePathname.startsWith('/user/login')) {
        activeTabbarPath = MOBILE_LOGIN_PAGE
      }
    }
  }
  if (activeTabbarPath) {
    push(activeTabbarPath)
  }

  // pc端存在移动端的路由，则跳转到PC端页面
  if (ispc && getPathname(location.pathname).startsWith('/app/')) {
    push('/trade')
  }
}
