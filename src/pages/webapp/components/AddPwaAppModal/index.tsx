import { memo, useEffect, useState } from 'react'

import { useEnv } from '@/context/envProvider'
import ENV from '@/env'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { cn } from '@/utils/cn'
import { getPathname } from '@/utils/navigator'
import { STORAGE_GET_TOKEN, STORAGE_SET_SHOW_PWA_ADD_MODAL } from '@/utils/storage'
import { FormattedMessage, useLocation } from '@umijs/max'
import { isAndroid, isChrome, isChromium, isEdge, isFirefox, isIOS, isSafari } from 'react-device-detect'
import SheetModal from '../Base/SheetModal'

const AddPwaAppModal = () => {
  const { t } = useI18n()
  const [isAddSreenModal, setIsAddSreenModal] = useState(false)
  const { isPc } = useEnv()
  const { pathname } = useLocation()
  const { isPwaApp } = useEnv()
  const isPopularBrowser = isSafari || isChrome || isChromium || isFirefox || isEdge // 主流浏览器

  const addScreenList = [
    {
      key: 1,
      img: '/img/addScreen/iphoneSafari.png',
      stepText1: t('addScreen.iphoneSafariTips1'),
      stepText2: t('addScreen.iphoneChromeTips2'),
      type: 'iphoneSafari',
      imgHeight: 240
    },
    {
      key: 2,
      img: '/img/addScreen/iphoneChrome.png',
      stepText1: t('addScreen.iphoneChromeTips1'),
      stepText2: t('addScreen.iphoneChromeTips2'),
      type: 'iphoneChrome',
      imgHeight: 200
    },
    {
      key: 3,
      img: '/img/addScreen/androidChrome.png',
      stepText1: t('addScreen.androidChromeTips1'),
      stepText2: t('addScreen.androidChromeTips2'),
      type: 'androidChrome',
      imgHeight: 170
    }
  ]

  const [addSreenData, setAddSreenData] = useState(addScreenList[0])

  const init = async () => {
    // let isFirst = STORAGE_GET_SHOW_PWA_ADD_MODAL() === true ? false : true
    let showModal = isPopularBrowser && process.env.NODE_ENV === 'production' // 每次刷新页面都需要弹一次
    // let showModal = isPopularBrowser // 每次刷新页面都需要弹一次
    let type = 'iphoneChrome'
    if (isIOS) {
      type = isSafari ? 'iphoneSafari' : 'iphoneChrome'
    } else if (isAndroid) {
      //TODO 根据浏览器不同添加其他类型
      //   type = browser === 'Chrome' ? 'androidChrome' : 'other'
      type = 'androidChrome'
    } else {
      type = 'androidChrome'
    }
    let addScreenDataNew = addScreenList.find((f) => f.type === type)
    if (addScreenDataNew) {
      setAddSreenData(addScreenDataNew)
    }

    // 判断是否为pwa独立应用，PWA独立应用内不要弹窗
    if (isPwaApp) {
      showModal = false
    }

    STORAGE_SET_SHOW_PWA_ADD_MODAL(false)

    setTimeout(() => {
      setIsAddSreenModal(showModal)
    }, 2000)
    // window.addEventListener('beforeinstallprompt', (e) => {
    //   e.preventDefault()
    //   setIsAddSreenModal(true)
    // })
    // if ('getInstalledRelatedApps' in window.navigator) {
    //   const relatedApps = await navigator.getInstalledRelatedApps()
    //   relatedApps.forEach((app) => {
    //     //if your PWA exists in the array it is installed
    //     console.log(app.platform, app.url)
    //   })
    // }
  }

  useEffect(() => {
    init()
  }, [isPwaApp, isPopularBrowser])

  const purePathname = getPathname(location.pathname)
  const token = STORAGE_GET_TOKEN()
  const showModal = purePathname.startsWith('/app/') && !!token

  return (
    <SheetModal
      open={!!isAddSreenModal && showModal}
      onDismiss={() => {
        setIsAddSreenModal(false)
      }}
      hiddenFooter
      height={'62%'}
      autoHeight
      header={<div className="text-center text-base font-bold">{t('addScreen.headerTitle')}</div>}
      children={
        <div className="px-4">
          <div className="mb-10 mt-5">
            <div className="relative">
              <img src={addSreenData.img} className="w-full" style={{ height: addSreenData.imgHeight }} />
              <div
                className={cn('absolute -top-[2px] left-4 border border-gray-50 rounded-xl w-[58px] h-[58px] overflow-hidden', {
                  '!-top-5': addSreenData.type === 'androidChrome'
                })}
              >
                <img src={'/platform/img/webapp-logo.png'} className="w-[58px] h-[58px]" />
              </div>
              <span
                className={cn('absolute left-[87px] top-[27px] text-primary text-base font-medium', {
                  '!top-[9px]': addSreenData.type === 'androidChrome'
                })}
              >
                <FormattedMessage id="addScreen.install" /> {ENV.name}
              </span>
              <span
                className={cn('absolute left-[90px] top-[90px] text-primary text-sm', {
                  '!top-[65px]': addSreenData.type === 'androidChrome',
                  '!top-[90px]': addSreenData.type === 'iphoneChrome'
                })}
              >
                {location.host}
              </span>
            </div>
            <p className="mt-5">
              <span className="inline-block h-5 w-5 rounded-[10px] bg-primary-secondary text-center leading-5">1.</span>
              <span className="text-sm leading-6">{addSreenData.stepText1}</span>
            </p>
            <p className="mt-[10px]">
              <span className="inline-block h-5 w-5 rounded-[10px] bg-primary-secondary text-center leading-5">2.</span>
              <span className="text-sm leading-6">{addSreenData.stepText2}</span>
            </p>
          </div>
        </div>
      }
    />
  )
}

export default memo(AddPwaAppModal)
