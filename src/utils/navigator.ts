import { history } from '@umijs/max'
import { stringify } from 'qs'

import { logout } from '@/services/api/user'

import { STORAGE_REMOVE_TOKEN, STORAGE_REMOVE_USER_INFO } from './storage'

/**
 * 退出登录
 * @param requestLogout 不请求退出接口
 */
export const onLogout = async (noRequestLogout?: boolean) => {
  if (!noRequestLogout) {
    await logout().catch((e) => e)
  }

  STORAGE_REMOVE_TOKEN()
  STORAGE_REMOVE_USER_INFO()

  // 退出登录，并且将当前的 url 保存
  const { search, pathname } = window.location
  const urlParams = new URL(window.location.href).searchParams
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect')
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search
      })
    })
  }
}

// 跳转登页
export const goLogin = () => {
  push('/user/login')
}

export const goKefu = () => {}

/**
 * 路径中是否存在语言
 */
export const getPathnameLng = () => {
  const pathname = location.pathname
  const pathnameLng = pathname
    .split('/')
    .filter((v) => v)
    .at(0) as string

  return {
    pathname,
    pathnameLng,
    hasPathnameLng: pathnameLng && ['zh-TW', 'en-US'].includes(pathnameLng)
  }
}

/**
 * 格式化跳转路径，添加多语言
 * @param pathname 跳转的路径
 * @returns
 */
export const formatPathname = (pathname: string) => {
  const lng = localStorage.getItem('umi_locale') || 'en-US'

  return `/${lng}${pathname}`
}

/**
 * 获取当前路径，不包含/zh-TW多语言路径
 */
export const getPathname = (path?: string) => {
  const pathname = path || location.pathname

  return pathname.replace('/zh-TW', '').replace('/en-US', '')
}

/**
 * 替换地址中的语言
 * @param path 页面路径
 * @returns
 */
export const replacePathnameLng = (path: string, lang?: string) => {
  const lng = lang || localStorage.getItem('umi_locale') || 'en-US'
  const pathname = getPathname(path)

  return `/${lng}${pathname}`
}

/**
 * 获取浏览器语言
 */
export const getBrowerLng = () => {
  const browerLng = navigator.language?.toLocaleLowerCase()

  let locationLng = 'en-US'
  if (['zh-cn', 'zh-hk', 'zh-tw'].includes(browerLng)) {
    locationLng = 'zh-TW'
  }
  return {
    browerLng,
    locationLng
  }
}

/**
 * 多语言 push跳转方法
 * @param path 跳转路径
 */
export const push = (path: string) => {
  history.push(formatPathname(path))
}

/**
 * 多语言 replace跳转方法
 * @param path 跳转路径
 */
export const replace = (path: string) => {
  history.replace(formatPathname(path))
}

/**
 * 返回上一个页面
 */
export const onBack = () => {
  const path = location.pathname
    .split('/')
    .filter((v) => v)
    .slice(0, -1)
    .join('/')

  // 不能在返回了
  if (path.length === 1) return

  push(getPathname(`/${path}`))
}

// 跳转客服页面 @TODO
export const goToService = () => {}
