import { getPathname, push } from '@/utils/navigator'

export const MAIN_PAGES = ['/app/quote', '/app/trade', '/app/position', '/app/user-center']

export const navigateTo = (path: string) => {
  push(path)
}

// 是否是主页面
export const isMainTabbar = (pathname: string) => MAIN_PAGES.includes(getPathname(pathname))
