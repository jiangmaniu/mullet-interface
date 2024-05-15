import { getLocale, history } from '@umijs/max'
import { message } from 'antd'
import { parse, stringify } from 'qs'

import { URLS } from '@/constants'
import { formatEmail, formatMobile } from '@/utils'

import { isMobileDevice } from '.'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO, STORAGE_REMOVE_TOKEN, STORAGE_REMOVE_USER_INFO } from './storage'

/**
 * 退出登录
 * @param hiddenLogin 不跳转登录页
 */
export const onLogout = (unJumpLogin?: boolean) => {
  STORAGE_REMOVE_TOKEN()
  STORAGE_REMOVE_USER_INFO()
  if (!unJumpLogin) {
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
}

// 跳转客服页面
export const goKefu = () => {
  window.open(URLS.live800)
}
// 跳转注册页
export const goRegister = () => {
  history.push('/user/register')
}
// 跳转注册页
export const goLogin = () => {
  history.push('/user/login')
}
export const onEntryAdmin = (currentUser: any, mes: any) => {
  history.push('/admin')
  console.log(currentUser, 'currentUser')

  message.success(mes + (currentUser?.name || formatMobile(currentUser?.phone) || formatEmail(currentUser?.email)))
}

export const onJumpProtocol = () => {
  window.open('/img/mandatory.pdf', '_blank')
}

export const onJumpConditon = () => {
  window.open('/img/biao1.pdf', '_blank')
}

export function go_titok() {
  window.open('https://www.tiktok.com/@cdexofficial')
}
export function go_youtube() {
  window.open('https://www.youtube.com/@cdexofficial')
}
export function go_twitter() {
  window.open('https://twitter.com/officialCDEX')
}
export function go_telegram() {
  window.open('https://t.me/CDEX_Exchange')
}
export function go_facebook() {
  window.open('https://www.facebook.com/CDEXofficial')
}
export function go_instagram() {
  window.open('https://www.instagram.com/official_cdex')
}
export const tiktok = 'https://www.tiktok.com/@cdexofficial'
export const youtube = 'https://www.youtube.com/@cdexofficial'
export const twitter = 'https://twitter.com/officialCDEX'
export const telegram = 'https://t.me/CDEX_Exchange'
export const facebook = 'https://www.facebook.com/CDEXofficial'
export const instagram = 'https://www.instagram.com/official_cdex'

export const twitter_yinni = 'https://twitter.com/cdex_2023?s=21&t=ILrqg6i06ShK0PLqbKO2Zw'
export const telegram_yinni = 'https://t.me/Cdex_indonesia'

export const formatUrl = (url: string, params?: any) => {
  const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
  const tempUrl = new URL(url)
  // 解析url中?后面的参数
  const parseUrlParams = parse(tempUrl.search.slice(1)) || {}
  const defaultParams: any = {
    lang: getLocale(),
    account: userInfo.realStandardAccount,
    token: STORAGE_GET_TOKEN(),
    loginAccount: userInfo.email || userInfo.phone,
    ...parseUrlParams,
    ...params
  }
  const retUrl = `${tempUrl.origin}${tempUrl.pathname}?${stringify(defaultParams)}`
  return retUrl
}

/**
 * 获取入金地址
 * @param account 入金真实账户ID
 * @returns
 */
export const getUPayUrl = ({ account, url }: { account?: number; url?: string }) => {
  const token = STORAGE_GET_TOKEN()
  const realStandardAccount = account || STORAGE_GET_USER_INFO('realStandardAccount')
  const lng = getLocale() || 'en-US'
  const language = {
    'en-US': 'en-us',
    'id-ID': 'en-us',
    'zh-TW': 'zh-hk'
  }[lng as string]

  let retUrl = `${new URL(url || URLS.PAY_API).origin}/#/cPay?from=mcp&source=${
    isMobileDevice() ? 3 : 1 // 3移动端 没有返回按钮
  }&account=${realStandardAccount}&token=${token}&language=${language}`
  return retUrl
}

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
