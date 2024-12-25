import { MOBILE_HOME_PAGE, MOBILE_LOGIN_PAGE, WEB_HOME_PAGE, WEB_LOGIN_PAGE } from '@/constants'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { STORAGE_GET_DEVICE_TYPE, STORAGE_GET_TOKEN, STORAGE_SET_DEVICE_TYPE } from '@/utils/storage'
import { useBreakpoint } from '@ant-design/pro-components'
import { useEffect } from 'react'

export const useDeviceChange = () => {
  const breakPoint = useBreakpoint() || ''

  const exposed = {
    breakPoint,
    isMobile: ['xs', 'sm'].includes(breakPoint), // 手机端，不包含ipad
    isIpad: ['md', 'lg'].includes(breakPoint), // 是否是ipad端
    isMobileOrIpad: ['xs', 'sm', 'md', 'lg'].includes(breakPoint), // 手机端，包含ipad
    isPc: ['xl', 'xxl'].includes(breakPoint) // pc端 >= 1200px
  }

  const setDeviceType = (type: 'PC' | 'MOBILE') => {
    STORAGE_SET_DEVICE_TYPE(type)
  }

  const jumpUrl = exposed.isPc ? WEB_HOME_PAGE : MOBILE_HOME_PAGE
  const loginUrl = exposed.isPc ? WEB_LOGIN_PAGE : MOBILE_LOGIN_PAGE

  const getHomePage = async () => {
    const token = await STORAGE_GET_TOKEN()
    return token ? jumpUrl : loginUrl
  }

  const changeDeviceType = async (currentDeviceType: 'PC' | 'MOBILE') => {
    const page = await getHomePage()
    setDeviceType(currentDeviceType)

    navigateTo(page)
  }

  /** 检查设备类型，如果设备类型发生变化，则跳转到对应的页面 */
  const checkDeviceType = async () => {
    const currentDeviceType = exposed.isPc ? 'PC' : 'MOBILE'

    const deviceType = await STORAGE_GET_DEVICE_TYPE()
    if (deviceType !== currentDeviceType) {
      changeDeviceType(currentDeviceType)
    }
  }

  useEffect(() => {
    checkDeviceType()
  }, [breakPoint])

  //初始化设备类型。不要监听，只执行一次即可
  useEffect(() => {
    setDeviceType(exposed.isPc ? 'PC' : 'MOBILE')
  }, [])

  return {
    setDeviceType,
    getHomePage,
    checkDeviceType,
    changeDeviceType,
    breakPoint,
    exposed,
    jumpUrl,
    loginUrl
  }
}
