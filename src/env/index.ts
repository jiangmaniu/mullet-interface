import { IPlatformConfig } from '@/mobx/global'
import { STORAGE_GET_PLATFORM_CONFIG } from '@/utils/storage'

// 在页面中使用的变量

// 服务端配置，从public/platform/config.json中动态获取
const serverConf = STORAGE_GET_PLATFORM_CONFIG() || {}

// 开发环境配置，本地接口调试使用
const devConf = {
  ...serverConf,
  ws: process.env.WS_URL,
  imgDomain: process.env.IMG_DOMAIN,
  BASE_URL: process.env.BASE_URL
}

// 针对平台做seo打包配置，暂时不需要
const seoConf =
  process.env.PLATFORM_SEO === '1'
    ? {
        name: process.env.SEO_PLATFORM_NAME,
        desc: process.env.SEO_PLATFORM_DESC
      }
    : {}

const conf =
  process.env.NODE_ENV === 'production'
    ? {
        ...seoConf,
        ...serverConf
      }
    : devConf

const ENV = {
  ...conf
} as IPlatformConfig

export default ENV
