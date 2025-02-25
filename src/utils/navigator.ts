import { history } from '@umijs/max'
import { stringify } from 'qs'

import { DEFAULT_LOCALE, MOBILE_HOME_PAGE, MOBILE_LOGIN_PAGE, WEB_HOME_PAGE, WEB_LOGIN_PAGE } from '@/constants'
import { stores } from '@/context/mobxProvider'

import { SUPPORTED_LANGUAGES } from '@/constants/enum'
import { isPCByWidth } from '.'
import {
  STORAGE_GET_TOKEN,
  STORAGE_REMOVE_TOKEN,
  STORAGE_REMOVE_USER_INFO,
  STORAGE_SET_CONF_INFO,
  STORAGE_SET_THEME,
  STORAGE_SET_TRADE_THEME
} from './storage'

/**
 * 退出登录
 * @param requestLogout 不请求退出接口
 */
export const onLogout = async (noRequestLogout?: boolean) => {
  // if (!noRequestLogout) {
  //   await logout().catch((e) => e)
  // }

  STORAGE_REMOVE_TOKEN()
  STORAGE_REMOVE_USER_INFO()
  STORAGE_SET_CONF_INFO('', 'currentAccountInfo') // 重置当前选择的账户
  // 退出登录重置主题
  STORAGE_SET_TRADE_THEME('light')
  STORAGE_SET_THEME('light')

  // 关闭行情
  stores.ws.close()

  const isPc = isPCByWidth()
  const loginUrl = isPc ? WEB_LOGIN_PAGE : MOBILE_LOGIN_PAGE

  // 退出登录，并且将当前的 url 保存
  const { search, pathname } = window.location
  const urlParams = new URL(window.location.href).searchParams
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect')
  // Note: There may be security issues, please note
  if (window.location.pathname !== loginUrl && !redirect) {
    history.replace({
      pathname: loginUrl,
      search: stringify({
        redirect: pathname + search
      })
    })
  }
}

// 跳转登页
export const goLogin = () => {
  const loginUrl = isPCByWidth() ? WEB_LOGIN_PAGE : MOBILE_LOGIN_PAGE
  push(loginUrl)
}

export const goKefu = () => {
  if (isPCByWidth()) {
    window.ssq?.push?.('chatOpen')
  } else {
    push('/app/smart-kefu')
  }
}

/**
 * 获取多语言路径信息
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
    hasPathnameLng: pathnameLng && SUPPORTED_LANGUAGES.includes(pathnameLng)
  }
}

/**
 * 格式化跳转路径，添加多语言
 * @param pathname 跳转的路径
 * @returns
 */
export const formatPathname = (pathname: string) => {
  const lng = localStorage.getItem('umi_locale') || DEFAULT_LOCALE

  return `/${lng}${pathname}`
}

/**
 * 获取当前路径，不包含/zh-TW多语言路径
 */
export const getPathname = (path?: string) => {
  const pathname = path || location.pathname

  return pathname.replace(new RegExp(`^/(${SUPPORTED_LANGUAGES.join('|')})`), '').replace(/\/$/, '')
}

/**
 * 替换地址中的语言
 * @param path 页面路径
 * @returns
 */
export const replacePathnameLng = (path: string, lang?: string) => {
  const lng = lang || localStorage.getItem('umi_locale') || DEFAULT_LOCALE
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
export const push = (path: string, state?: any) => {
  history.push(formatPathname(path), state)
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

// 跳转首页
export const goHome = () => {
  const homeUrl = isPCByWidth() ? WEB_HOME_PAGE : MOBILE_HOME_PAGE
  if (STORAGE_GET_TOKEN()) {
    push(homeUrl)
  } else {
    goLogin()
  }
}
