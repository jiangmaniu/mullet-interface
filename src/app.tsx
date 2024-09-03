import { Settings as LayoutSettings } from '@ant-design/pro-components'
import { history, Link, Navigate, RunTimeLayoutConfig, useModel } from '@umijs/max'
import { ClickToComponent } from 'click-to-react-component'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { Provider } from '@/context'
import { cssVars } from '@/theme/theme.config'

import defaultSettings from '../config/defaultSettings'
import Logo from './components/Admin/Header/Logo'
import { HeaderRightContent } from './components/Admin/RightContent'
import SwitchLanguage from './components/SwitchLanguage'
import { ICONFONT_URL, WEB_HOME_PAGE } from './constants'
import { useEnv } from './context/envProvider'
import { useLang } from './context/languageProvider'
import { stores } from './context/mobxProvider'
import { errorConfig } from './requestErrorConfig'
import { getBrowerLng, getPathname, getPathnameLng, push, replacePathnameLng } from './utils/navigator'
import { STORAGE_GET_TOKEN } from './utils/storage'

const isDev = process.env.NODE_ENV === 'development'
const loginPath = '/user/login'

if (process.env.NODE_ENV === 'development') {
  // https://github.com/Tencent/vConsole
  // const vConsole = new VConsole()
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>
  currentUser?: User.UserInfo
  loading?: boolean
  fetchUserInfo?: (token?: any) => Promise<User.UserInfo | undefined>
}> {
  // 未登录初始化全局配置
  await stores.global.init()

  // 如果不是登录页面，执行
  const { location } = history
  const fetchUserInfo = stores.global.fetchUserInfo
  // 登录页进不来
  if (getPathname(location.pathname) !== loginPath && STORAGE_GET_TOKEN()) {
    // 获取全局用户信息
    const currentUser = (await fetchUserInfo()) as User.UserInfo

    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>
    }
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  // const [collapsed, setCollapsed] = useState<boolean>(false) // 默认展开侧边栏
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useModel('global')
  const { breakPoint, isMobileOrIpad, isMobile, isIpad } = useEnv()
  const { lng, count } = useLang()
  const [showMenuExtra, setShowMenuExtra] = useState(false)
  const { pageBgColor } = useModel('global')

  return {
    ...initialState?.settings,
    // title: '测试',// layout 的左上角 的 title
    // logo: '', // layout 的左上角 logo 的 url，可以动态修改
    // loading: false, // layout 的加载态
    // 渲染 logo 和 title, 优先级比 headerTitleRender 更高
    // headerTitleRender: () => <div>headerTitleRender</div>,
    // 在 layout 底部渲染一个块
    // menuFooterRender: () => <div>菜单底部区域</div>,
    logo: <Logo />,
    // layout 的内容区 style
    contentStyle: {
      background: pageBgColor,
      minHeight: '100vh',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0
    },
    // actionsRender: () => [],
    actionsRender: () => [<HeaderRightContent key="content" isAdmin />],
    // avatarProps: {
    //   src: initialState?.currentUser?.avatar || '/img/logo.png',
    //   title: <AvatarName />,
    //   render: (_, avatarChildren) => {
    //     return <AvatarDropdown>{avatarChildren}</AvatarDropdown>
    //   }
    // },
    // 是否固定 header 到顶部
    // fixedHeader: true,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name
    // },
    // onMenuHeaderClick: () => {
    //   history.push('/')
    // }, // 点击跳转到首页，移动端不支持点击
    // headerRender: () => <p>123</p>, // 自定义顶部头
    // footerRender: () => <Footer />, // 自定义页脚的 render 方法
    siderWidth: 286, // 侧边菜单宽度默认	208
    collapsed,
    // 自定义展开收起按钮的渲染
    collapsedButtonRender: false,
    // collapsedButtonRender: (collapsed: boolean | undefined, defaultDom: React.ReactNode) => (isMobileOrIpad ? undefined : defaultDom),
    // 侧边菜单底部的配置，可以增加一些底部操作
    menuFooterRender: (props) => {
      if (isMobileOrIpad && !props?.collapsed) {
        return (
          <div className="flex justify-center" style={{ paddingBottom: 100 }}>
            <SwitchLanguage isAdmin />
          </div>
        )
      }
    },
    onCollapse: (collapsed: boolean) => {
      setCollapsed(collapsed)
    },
    // 一些时候我们会发现 collapsed 和 onCollapse 设置默认收起并不生效，这是因为 ProLayout 中内置了 breakpoint 来触发收起的机制，我们可以设置 breakpoint={false} 来关掉这个机制
    breakpoint: false,
    onPageChange: () => {
      const { location } = history
      // 如果没有登录，重定向到 login
      // @TODO
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath)
      // }
    },
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>
    //     ]
    //   : [],
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>
    },
    menuHeaderRender: () => {
      return <div></div>
    },
    menu: {
      // https://beta-pro.ant.design/docs/advanced-menu-cn
      // actionRef: layoutActionRef, // 如果你希望可以手动的控制菜单刷新，可以使用 actionRef 功能。
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: {
        // userId: initialState?.currentUser?.userid,
        count
      },
      // @TODO 动态菜单
      // config.ts/routes.ts文件里的路由还是要添加,和静态路由是一样
      request: async (params, defaultMenuData) => {
        // initialState.currentUser 中包含了所有用户信息
        // const menuData = await fetchMenuData();
        // return menuData;
        // await new Promise((resolve) => setTimeout(() => resolve(''), 2000))
        // return [
        //   ...defaultMenuData,
        //   {
        //     path: '/system-manage',
        //     name: 'systemManage',
        //     icon: '/img/menu-icon/system@2x.png',
        //     access: 'canAdmin', // 权限配置
        //     routes: [
        //       {
        //         path: '/system-manage/:account',
        //         component: './admin/systemManage/list',
        //         name: 'account'
        //       }
        //     ]
        //   }
        // ]

        const formatMenuPath = (data: any) => {
          data.forEach((item: any) => {
            // 首次
            if (item.path.indexOf(':lng') > -1) {
              item.path = item.path?.replace(/:lng/, lng)
            } else {
              // 更新后替换当前路径
              item.path = replacePathnameLng(item.path, lng)
            }

            // 递归
            if (item.children?.length) {
              formatMenuPath(item.children)
            }
            if (item.routes?.length) {
              formatMenuPath(item.routes)
            }
          })
        }

        formatMenuPath(defaultMenuData)

        // console.log('defaultMenuData', defaultMenuData)

        return defaultMenuData
      }
    },

    menuItemRender: (menuItemProps, defaultDom) => {
      // console.log('menuItemProps', menuItemProps)
      if (menuItemProps.isUrl || !menuItemProps.path) {
        return defaultDom
      }
      // 支持二级菜单显示icon
      const src = menuItemProps.pro_layout_parentKeys && menuItemProps.pro_layout_parentKeys.length > 0 && menuItemProps.icon
      return (
        <Link to={menuItemProps.path} className="flex items-center">
          {src && <img src={src} width={22} height={22} />}
          {defaultDom}
        </Link>
      )
    }
    // logout: () => {
    //   alert('退出登录成功')
    // },
    // headerContentRender: (props: ProLayoutProps) => <div>自定义头内容的方法</div>,
    // menuRender: (props: HeaderViewProps) => <div>自定义菜单的 render 方法</div>,
    // menuItemRender: (itemProps: MenuDataItem, defaultDom: React.ReactNode, props: BaseMenuProps) => <div>自定义菜单项的 render 方法</div>,
    // subMenuItemRender: (itemProps: MenuDataItem) => <div>自定义拥有子菜单菜单项的 render 方法</div>,
    // menuDataRender: (menuData: MenuDataItem[]) => MenuDataItem[], // menuData 的 render 方法，用来自定义 menuData
  }
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig
}

// 修改被 react-router 渲染前的树状路由表
// https://umijs.org/docs/api/runtime-config
export const patchClientRoutes = ({ routes }: any) => {
  const { locationLng } = getBrowerLng()
  // 获取本地缓存的语言
  const lng = localStorage.getItem('umi_locale') || locationLng
  const token = STORAGE_GET_TOKEN()
  // const HOME_PAGE = token ? ADMIN_HOME_PAGE : WEB_HOME_PAGE
  const HOME_PAGE = token ? WEB_HOME_PAGE : loginPath

  // 首次默认重定向到en-US
  routes.unshift(
    ...[
      {
        path: '/',
        element: <Navigate to={`/${lng}${HOME_PAGE}`} replace />
      },
      {
        path: `/${lng}`,
        element: <Navigate to={`/${lng}${HOME_PAGE}`} replace />
      }
    ]
  )
}

// 埋点
export function onRouteChange({ location, clientRoutes, routes, action, basename, isFirst }: any) {
  // 获取本地缓存的语言
  const lng = localStorage.getItem('umi_locale') || 'en-US'
  const { pathnameLng, hasPathnameLng, pathname } = getPathnameLng()

  // 如果地址中不存在语言路径，则添加语言路径
  if (!hasPathnameLng && pathname !== '/') {
    history.replace(`/${lng}${location.pathname}`)
  }

  // 排除以下页面，未登录需重定向到登录页
  if (!['/user/login'].includes(pathname) && !STORAGE_GET_TOKEN()) {
    push('/user/login')
  }
}

export const rootContainer = (container: JSX.Element) => {
  return React.createElement(
    () => (
      <>
        <Helmet>
          {/* 注入css变量 */}
          <style>{cssVars}</style>
          {/* 需要设置一次地址，否则不使用Layout的情况下，iconfont图标使用不显示 */}
          <script async={true} src={ICONFONT_URL}></script>
        </Helmet>
        <Provider>{container}</Provider>
        {/* 快速调试组件
          按住 option + 单击，就会直接打开它的对应的组件的源码。
          如果按住 option + 右键单击，可以看到它的所有父级组件，然后选择一个组件打
        */}
        <ClickToComponent />
      </>
    ),
    null,
    container
  )
}
