import admin from './zh-TW/admin'
import adminTable from './zh-TW/admin.table'
import common from './zh-TW/common'
import component from './zh-TW/component'
import globalHeader from './zh-TW/globalHeader'
import menu from './zh-TW/menu'
import mt from './zh-TW/mt'
import pc from './zh-TW/pc'
import pwa from './zh-TW/pwa'
import settingDrawer from './zh-TW/settingDrawer'
import settings from './zh-TW/settings'
import ws from './zh-TW/ws'

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.preview.down.block': '下載此頁面到本地項目',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...ws,
  ...pwa,
  ...component,
  ...common,
  ...pc,
  ...admin,
  ...adminTable,
  ...mt
}
