import { MOBILE_HOME_PAGE } from '@/constants'
import { isPC } from '@/utils'
import { getPathname, push } from '@/utils/navigator'

export const MAIN_PAGES = ['/app/quote', '/app/trade', '/app/position', '/app/user-center']

export const navigateTo = (path: string) => {
  push(path)
}

// 是否是主页面
export const isMainTabbar = (pathname: string) => MAIN_PAGES.includes(getPathname(pathname))

// 如果在移动端模式下 地址栏输入的是pc端路由，则跳转到移动端页面
export const handleJumpMobile = () => {
  // 在移动端存在pc的路由，则跳转到移动端对应路由激活Tabbar
  const purePathname = getPathname(location.pathname)
  let activeTabbarPath = ''
  if (!isPC()) {
    if (purePathname.startsWith('/trade')) {
      // 移动端存在PC端交易页面的路由，则跳转到移动端交易页面激活Tabbar
      activeTabbarPath = MOBILE_HOME_PAGE
    } else if (['/account', '/record', '/setting', '/copy-trading'].some((path) => purePathname.startsWith(path))) {
      // 移动端存在PC端个人中心页面的路由，则跳转到移动端个人中心页面激活Tabbar
      activeTabbarPath = '/app/user-center'
    } else {
      // 其他情况404，跳转到移动端首页激活Tabbar
      activeTabbarPath = MOBILE_HOME_PAGE
    }
  }
  if (activeTabbarPath) {
    push(activeTabbarPath)
  }
}
