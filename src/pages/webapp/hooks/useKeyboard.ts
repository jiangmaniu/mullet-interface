import { throttle } from 'lodash'
import { useEffect, useState } from 'react'

const getDeviceType = () => {
  const userAgent = navigator.userAgent

  // 判断是否为 Android
  if (/android/i.test(userAgent)) {
    return 'android'
  }

  // 判断是否为 iOS
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios'
  }

  return 'unknown' // 其他设备
}

export default function useKeyboard() {
  const isAndroid = getDeviceType() === 'android'
  const [isKeyboardShow, setIsKeyboardShow] = useState(false)

  useEffect(() => {
    let originHeight = document.documentElement.clientHeight || document.body.clientHeight
    const handelAndroidResize = throttle(() => {
      const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (originHeight < resizeHeight) {
        // Android 键盘收起后操作
        setIsKeyboardShow(false)
      } else {
        // Android 键盘弹起后操作
        setIsKeyboardShow(true)
      }
      originHeight = resizeHeight
    }, 300)

    if (isAndroid) {
      window.addEventListener('resize', handelAndroidResize, false)
    }

    return () => {
      if (isAndroid) {
        window.removeEventListener('resize', handelAndroidResize, false)
      }
    }
  }, [])

  return isKeyboardShow
}
