import admin from './en-US/admin'
import adminTable from './en-US/admin.table'
import common from './en-US/common'
import component from './en-US/component'
import globalHeader from './en-US/globalHeader'
import menu from './en-US/menu'
import pages from './en-US/pages'
import pc from './en-US/pc'
import pwa from './en-US/pwa'
import settingDrawer from './en-US/settingDrawer'
import settings from './en-US/settings'
import uc from './en-US/uc'
import ws from './en-US/ws'

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...ws,
  ...pwa,
  ...component,
  ...pages,
  ...common,
  ...pc,
  ...admin,
  ...adminTable,
  ...uc
}
