import { useEffect } from 'react'
import { browserName } from 'react-device-detect'
import VConsole from 'vconsole'

export default function Test() {
  useEffect(() => {
    const vConsole = new VConsole()
  }, [])

  useEffect(() => {
    console.log('====display-mode: standalone====', window.matchMedia('(display-mode: standalone)').matches)
    // @ts-ignore
    console.log('====window.navigator?.standalone====', window.navigator?.standalone)
  }, [browserName])

  return <div>Test browserDeviceType: {browserName}</div>
}
