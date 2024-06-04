import { ProLayoutProps } from '@ant-design/pro-components'
import { gray } from '../src/theme/theme.config'

// 字体图标 @TODO 替换设计提供的地址 https://blog.csdn.net/weixin_44119268/article/details/102629409
// 注意：UI图标更新后，需要重新更新地址和本地代码
export const iconfontUrl =
  process.env.NODE_ENV === 'development' ? 'https://at.alicdn.com/t/c/font_4571567_0lfu25uk1trq.js' : '/iconfont/iconfont.js'

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean
  logo?: string
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: gray['900'], // antd的主题色设置为黑色，页面中大部分组件使用到黑色，避免修改太多
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '',
  pwa: true,
  logo: '/logo.svg',
  iconfontUrl,
  // iconfontUrl: '//at.alicdn.com/t/c/font_4182179_75iciez7rhj.js', // 字体图标 @TODO 替换设计提供的地址 https://blog.csdn.net/weixin_44119268/article/details/102629409
  // 参见ts声明，demo 见文档，通过token 修改样式
  //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  token: {
    // colorBgAppListIconHover: 'rgba(0,0,0,0.06)',
    // colorTextAppListIconHover: 'rgba(255,255,255,0.95)',
    // colorTextAppListIcon: 'rgba(255,255,255,0.85)',
    sider: {
      // colorBgCollapsedButton: '#fff', // 展开收起按钮背景颜色	#fff
      // colorTextCollapsedButtonHover: 'rgba(0,0,0,0.65)', // 展开收起按钮 hover 时字体颜色
      // colorTextCollapsedButton: 'rgba(0,0,0,0.45)', // 展开收起按钮字体颜色
      colorMenuBackground: '#fff' // menu 的背景颜色
      // // colorBgMenuItemCollapsedElevated: 'rgba(0,0,0,0.85)', // 收起 menuItem 的弹出菜单背景颜色
      // colorMenuItemDivider: 'rgba(255,255,255,0.15)' // menuItem 分割线的颜色
      // colorBgMenuItemHover: 'rgba(0,0,0,0.06)', // menuItem 的 hover 背景颜色	rgba(90, 75, 75, 0.03)
      // colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
      // colorTextMenuSelected: colorPrimary, // menuItem 的选中字体颜色	rgb(0,0,0)
      // colorTextMenuItemHover: colorPrimary, // menuItem 的 hover 字体颜色	rgba(255,255,255,0.75)
      // colorTextMenu: colorPrimary, // menuItem 的字体颜色
      // colorTextMenuSecondary: colorPrimary, // menu 的二级字体颜色，比如 footer 和 action 的 icon
      // colorTextMenuTitle: 'rgba(255,255,255,0.95)', // sider 的标题字体颜色
      // colorTextMenuActive: 'rgba(0, 0, 0, 0.85)', // menuItem hover 的选中字体颜色
      // colorTextSubMenuSelected: '#fff'
    },
    header: {
      heightLayoutHeader: 66
      // colorBgHeader: '#fff',
      // colorBgRightActionsItemHover: 'rgba(0,0,0,0.06)',
      // colorTextRightActionsItem: 'rgba(255,255,255,0.65)',
      // colorHeaderTitle: '#fff',
      // colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
      // colorBgMenuItemSelected: 'rgba(0,0,0,0.15)', // menuItem 的选中背景颜色	rgba(0, 0, 0, 0.04)
      // colorTextMenuSelected: '#fff', //
      // colorTextMenu: 'rgba(255,255,255,0.75)',
      // colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
      // colorTextMenuActive: 'rgba(255,255,255,0.95)'
    }
    // pageContainer: {
    // colorBgPageContainer: '#fff' // pageContainer 的背景颜色
    // }
  }
}

export default Settings
