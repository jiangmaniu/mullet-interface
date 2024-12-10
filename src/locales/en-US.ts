import h5 from './en-US/app-h5.json'
import common from './en-US/common'
import menu from './en-US/menu'
import mt from './en-US/mt'
import pwa from './en-US/pwa'

export default {
  // app和h5公用的翻译文件
  ...h5,
  ...menu,
  ...pwa,
  ...common,
  ...mt
}
