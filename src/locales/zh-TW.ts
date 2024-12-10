import h5 from './zh-TW/app-h5.json'
import common from './zh-TW/common'
import menu from './zh-TW/menu'
import mt from './zh-TW/mt'
import pwa from './zh-TW/pwa'

export default {
  // app和h5公用的翻译文件
  ...h5,
  ...menu,
  ...pwa,
  ...common,
  ...mt
}
