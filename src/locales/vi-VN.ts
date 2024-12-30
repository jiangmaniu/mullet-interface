import common from './vi-VN/common'
import menu from './vi-VN/menu'
import mt from './vi-VN/mt'
import pwa from './vi-VN/pwa'
import webapp from './vi-VN/webapp.json'

export default {
  // app和h5公用的翻译文件
  ...webapp,
  ...menu,
  ...pwa,
  ...common,
  ...mt
}
