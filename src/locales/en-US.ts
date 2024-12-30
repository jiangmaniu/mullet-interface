import common from './en-US/common'
import menu from './en-US/menu'
import mt from './en-US/mt'
import pwa from './en-US/pwa'
import webapp from './en-US/webapp.json'

export default {
  // app和h5公用的翻译文件
  ...webapp,
  ...menu,
  ...pwa,
  ...common,
  ...mt
}
