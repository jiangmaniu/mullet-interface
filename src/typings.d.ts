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
}

declare enum APP_ENV {
  'test' = 'test',
  'dev' = 'dev',
  'prod' = 'prod'
}

declare enum PLATFORM {
  'stellux' = 'stellux',
  'lynfoo' = 'lynfoo'
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    /**平台类型 */
    PLATFORM: keyof typeof PLATFORM
    /**环境类型 */
    APP_ENV: keyof typeof APP_ENV_ENUM
  }
}
