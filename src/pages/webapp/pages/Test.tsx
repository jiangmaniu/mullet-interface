import { useEnv } from '@/context/envProvider'
import { useEffect } from 'react'
import VConsole from 'vconsole'

export default function Test() {
  const { browserDeviceType } = useEnv()

  useEffect(() => {
    const vConsole = new VConsole()
  }, [])

  useEffect(() => {
    console.log('====browserDeviceType====', browserDeviceType)
    console.log('====display-mode: standalone====', window.matchMedia('(display-mode: standalone)').matches)
    // @ts-ignore
    console.log('====window.navigator?.standalone====', window.navigator?.standalone)
    console.log('====document?.referrer?.includes?.(android-app://)====', document?.referrer?.includes?.('android-app://'))
  }, [browserDeviceType])

  return <div>Test browserDeviceType: {browserDeviceType}</div>
}
