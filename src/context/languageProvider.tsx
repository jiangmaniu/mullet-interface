import { getLocale, history, setLocale } from '@umijs/max'
import { ConfigProvider, setDefaultConfig } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import zhTW from 'antd-mobile/es/locales/zh-TW'
import { createContext, useContext, useEffect, useState } from 'react'

import { ILanguage } from '@/constants/enum'
import { DEFAULT_LOCALE, KEY_TEMP_LNG } from '@/constants/index'
import { getBrowerLng, getPathname, getPathnameLng, replacePathnameLng } from '@/utils/navigator'

interface ILanguageContextProps {
  lng: ILanguage
  count: number
  /**是否是繁体中文 */
  isTW: boolean
  setLng: (language: ILanguage) => void
}

interface IProps {
  children: JSX.Element
}

export const LanguageContext = createContext<ILanguageContextProps>({} as ILanguageContextProps)

export const LanguageProvider = ({ children }: IProps): JSX.Element => {
  // const [lng, setLng] = useState<ILanguage>(DEFAULT_LOCALE)
  const { locationLng } = getBrowerLng() // 使用浏览器自带的检测功能
  // @ts-ignore
  const [lng, setLng] = useState<ILanguage>(locationLng)
  const [count, setCount] = useState<number>(0) // 监听语言是否切换了

  // mobile antd国际化
  const getAntdMobileLocale = (lng: ILanguage) => {
    return {
      'zh-TW': zhTW,
      'en-US': enUS,
      'vi-VN': enUS
    }[lng]
  }

  // 修改地址栏pathname地址
  const updatePathname = (lng: ILanguage) => {
    window.history.replaceState(null, '', `/${lng}${getPathname()}${window.location.hash}${window.location.search}`)
  }

  // @ts-ignore
  useEffect(() => {
    // const locationInfo = await getIpInfo()
    // const country_code = locationInfo?.country_code
    const tempLng = sessionStorage.getItem(KEY_TEMP_LNG)
    let searchParams = new URLSearchParams(location.search)
    const searchLng = searchParams.get('lng')
    const { pathnameLng, hasPathnameLng } = getPathnameLng()

    // 处理路径上的语言 => /zh-TW/symbol 保存到本地
    if (hasPathnameLng) {
      localStorage.setItem('umi_locale', pathnameLng)
    } else if (!tempLng) {
      // 首次加载后，再次切换语言，不在使用ip定位
      // 使用浏览器自带的检测功能
      console.log('locationLng', locationLng)
      localStorage.setItem('umi_locale', locationLng)
    }
    // @hack 兼容首次加载没有设置默认语言，兼容umi设置默认语言
    if (!localStorage.getItem('umi_locale')) {
      localStorage.setItem('umi_locale', DEFAULT_LOCALE)
    }
    const locale = getLocale()
    setLng(locale)

    // 更新地址栏地址
    setTimeout(() => {
      updatePathname(locale)
    }, 1000)

    // if (!tempLng) {
    //   setTimeout(() => {
    //     setLocale(locale, false)
    //   }, 300)
    // }

    // 设置antd-mobile
    setDefaultConfig({ locale: getAntdMobileLocale(locale) })
  }, [])

  const changeLanguages = (currentLanguage: ILanguage) => {
    // 临时缓存，根据ip定位切换语言使用
    sessionStorage.setItem(KEY_TEMP_LNG, currentLanguage)

    // 更新地址栏地址
    updatePathname(currentLanguage)

    // 语言有变化
    setCount(() => count + 1)
    // 设置语言
    setLng(currentLanguage)
    // 切换时不刷新页面
    // setLocale(currentLanguage, false)
    setLocale(currentLanguage, true) // 刷新页面，避免很多兼容问题

    // 重新刷新路由
    setTimeout(() => {
      history.replace(`${replacePathnameLng(location.pathname, currentLanguage)}`)
    })

    // 设置antd-mobile
    setDefaultConfig({ locale: getAntdMobileLocale(currentLanguage) as any })
  }

  return (
    <LanguageContext.Provider
      value={{
        lng,
        count,
        isTW: lng === 'zh-TW',
        setLng: changeLanguages
      }}
    >
      <ConfigProvider locale={getAntdMobileLocale(lng)}>{children}</ConfigProvider>
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
