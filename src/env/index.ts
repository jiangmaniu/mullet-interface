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

const conf = process.env.NODE_ENV === 'production' ? serverConf : devConf

const ENV = {
  ...conf
} as IPlatformConfig

export default ENV
