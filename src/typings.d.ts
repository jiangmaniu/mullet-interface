declare module 'slash2'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'omit.js'
declare module 'numeral'
declare module '@antv/data-set'
declare module 'mockjs'
declare module 'react-fittext'
declare module 'bizcharts-plugin-slider'
declare module 'react-reveal/Fade'
declare module 'react-reveal/Jump'
declare module 'react-reveal/Flip'
declare module 'react-reveal/Zoom'
declare module 'react-reveal/Stepper'
declare module 'react-reveal/Slide'
declare module 'rc-bullets'

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false
declare const BASE_URL: string

// 为 Window 增加参数
interface Window {
  tvWidget: any
  // salesmartly客服
  ssq: {
    // 参考 https://help.salesmartly.com/docs/707UF1#2.1%20%E8%AE%BE%E7%BD%AE%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF
    push: (
      name:
        | 'chatOpen'
        | 'chatClose'
        | 'setLoginInfo'
        | 'onUnRead'
        | 'onSendMessage'
        | 'onOpenChat'
        | 'onCloseChat'
        | 'onOpenCollection'
        | 'onReady'
        | 'hideCloseIcon'
        | 'hideUpload',
      opts?: any
    ) => void
  }
  __ssc: {
    setting: any
  }
  /**react-native webview对象 */
  ReactNativeWebView: {
    postMessage: (message: string) => void
    injectedObjectJson: (message: any) => void
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    /**ws地址 */
    WS_URL: string
    /**baseurl */
    BASE_URL: string
    /**图片域名 */
    IMG_DOMAIN: string
  }
}
