import { IPlatformConfig } from '@/mobx/global'

// 编译时变量，参与打包到代码中，需要做SEO时需要用到的变量

// 针对平台做seo打包配置，暂时不需要
const seoConf =
  process.env.PLATFORM_SEO === '1'
    ? {
        name: process.env.SEO_PLATFORM_NAME,
        desc: process.env.SEO_PLATFORM_DESC
      }
    : {}

// 开发环境配置，本地接口调试使用
const devConf = {
  ...seoConf,
  ws: process.env.WS_URL,
  imgDomain: process.env.IMG_DOMAIN,
  BASE_URL: process.env.BASE_URL
}

const conf = process.env.NODE_ENV === 'production' ? seoConf : devConf

let ENV = {
  ...conf
} as IPlatformConfig

export default ENV
