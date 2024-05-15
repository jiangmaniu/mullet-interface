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
  initGeetest4: any
}
