import common from './zh-TW/common'
import deposit from './zh-TW/deposit'
import menu from './zh-TW/menu'
import mt from './zh-TW/mt'
import pwa from './zh-TW/pwa'
import webapp from './zh-TW/webapp.json'

export default {
  // app和h5公用的翻译文件
  ...webapp,
  ...menu,
  ...pwa,
  ...common,
  ...mt,
  ...deposit
}
