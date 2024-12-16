/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 *
 * 路由配置完成后，访问页面即可看到效果，如果需要在菜单中显示，需要配置 name，icon，hideChildrenInMenu等来辅助生成菜单。

    具体值如下：

    name:string 配置菜单的 name，如果配置了国际化，name 为国际化的 key。
    icon:string 配置菜单的图标，默认使用 antd 的 icon 名，默认不适用二级菜单的 icon。
    access:string 权限配置，需要预先配置权限
    hideChildrenInMenu:true 不需要展示 children 时
    hideInMenu:true 可以在菜单中不展示这个路由，包括子路由。
    hideInBreadcrumb:true 可以在面包屑中不展示这个路由，包括子路由。
    headerRender:false 当前路由不展示顶栏
    footerRender:false 当前路由不展示页脚
    menuRender: false 当前路由不展示菜单
    menuHeaderRender: false 当前路由不展示菜单顶栏
    parentKeys: string[] 当此节点被选中的时候也会选中 parentKeys 的节点
    flatMenu 子项往上提，只是不展示父菜单
 */

/**
 * export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        // path 支持为一个 url，必须要以 http 开头
        path: 'https://pro.ant.design/docs/getting-started-cn',
        target: '_blank', // 点击新窗口打开
        name: '文档',
      },
      {
        // 访问路由，以 / 开头为绝对路径
        path: '/user/login',
        // ./Page ->src/pages/Login
        component: './NewPage',
      },
      {
        // 访问路由，如果不是以 / 开头会拼接父路由
        // reg -> /user/reg
        path: 'reg',
        // ./Page ->src/pages/Reg
        component: '../layouts/NewPage2',
      },
    ],
  },
];
*/

export default [
  // web端路由
  {
    path: '/',
    component: '@/layouts/WebLayout',
    layout: false,
    routes: [
      // {
      //   path: '/:lng/home',
      //   component: './web/home'
      // },
      // @TODO 首页暂时重定向/web/trade
      {
        path: '/',
        component: './web/trade'
      },
      {
        path: '/:lng/trade',
        component: './web/trade'
      }
    ]
  },
  // 用户
  {
    path: '/:lng/user',
    layout: false,
    component: '@/layouts/UserLayout',
    routes: [
      {
        path: '/:lng/user/login',
        component: './user/login'
      },
      {
        path: '/:lng/user/forget',
        component: './user/forgetPassword'
      }
    ]
  },
  {
    path: '/:lng/account',
    name: 'myAccount',
    icon: 'icon-geren-zhanghu',
    access: 'canAdmin', // 权限配置
    component: './admin/account'
  },
  {
    path: '/:lng/account/transfer',
    access: 'canAdmin', // 权限配置
    component: './admin/account/transfer',
    hideInMenu: true
  },
  {
    path: '/:lng/account/type',
    access: 'canAdmin', // 权限配置
    component: './admin/account/accountTypeSelect',
    hideInMenu: true
  },
  {
    path: `/:lng/account/type/add/:accountId`,
    access: 'canAdmin', // 权限配置
    component: './admin/account/accountTypeSelect/add',
    hideInMenu: true
  },
  // {
  //   path: '/:lng/deposit',
  //   name: 'deposit',
  //   icon: 'icon-geren-rujin',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/deposit'
  // },
  // {
  //   path: '/:lng/withdrawal',
  //   name: 'withdrawal',
  //   icon: 'icon-geren-chujin',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/withdrawal'
  // },
  // {
  //   path: '/:lng/withdrawal/add',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/withdrawal/add',
  //   hideInMenu: true
  // },
  {
    path: '/:lng/record',
    name: 'depositAndwithdrawalRecord',
    icon: 'icon-geren-churujinjilu',
    access: 'canAdmin', // 权限配置
    component: './admin/record'
  },
  // 跟单管理
  // {
  //   path: '/:lng/copy-trading',
  //   access: 'canAdmin', // 权限配置
  //   name: 'copyTrading',
  //   icon: 'icon-gendanguanli',
  //   component: './admin/copyTrading'
  // },
  // {
  //   path: '/:lng/copy-trading/management',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/copyTrading/copyTradingManagement'
  //   // hideInMenu: true,
  //   // menuRender: false // 当前路由不展示菜单
  // },
  // {
  //   path: '/:lng/copy-trading/detail/:id',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/copyTrading/copyTradingDetail'
  //   // hideInMenu: true,
  //   // menuRender: false // 当前路由不展示菜单
  // },
  // {
  //   path: '/:lng/copy-trading/take-detail/:id',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/copyTrading/takeDetail'
  //   // hideInMenu: true,
  //   // menuRender: false // 当前路由不展示菜单
  // },
  // {
  //   path: '/:lng/copy-trading/apply',
  //   access: 'canAdmin', // 权限配置
  //   component: './admin/copyTrading/apply',
  //   hideInMenu: true,
  //   menuRender: false, // 当前路由不展示菜单
  //   headerRender: true,
  //   layout: false // 关闭页面布局，使用自定义布局
  // },
  {
    path: '/:lng/setting',
    name: 'setting',
    icon: 'icon-geren-shezhi',
    access: 'canAdmin', // 权限配置
    component: './admin/setting'
  },
  {
    path: '/:lng/setting/kyc',
    access: 'canAdmin', // 权限配置
    component: './admin/setting/kycStepForm',
    hideInMenu: true
  },

  // ======================== 移动端页面路由 start ======================
  {
    path: '/:lng/app',
    layout: false,
    component: '@/layouts/WebAppLayout',
    access: 'canAdmin', // 权限配置
    routes: [
      /* ------------------------------- 主tabbar ------------------------------- */
      // 行情
      {
        path: '/:lng/app/quote',
        component: './webapp/pages/Quote'
      },
      // 交易
      {
        path: '/:lng/app/trade',
        component: './webapp/pages/Trade'
      },
      // 仓位
      {
        path: '/:lng/app/position',
        component: './webapp/pages/Position'
      },
      // 个人中心
      {
        path: '/:lng/app/user-center',
        component: './webapp/pages/UserCenter'
      },
      /* ------------------------------- 登录/注册/忘记密码 ------------------------------- */
      {
        path: '/:lng/app/login',
        component: './webapp/pages/User/Login'
      },
      {
        path: '/:lng/app/forget-pwd',
        component: './webapp/pages/User/ForgetPwd'
      },
      /* ------------------------------- 行情 ------------------------------- */
      // 行情-k线
      {
        path: '/:lng/app/quote/kline',
        component: './webapp/pages/Quote/KLine'
      },
      // 行情-品种搜索
      {
        path: '/:lng/app/quote/search',
        component: './webapp/pages/Quote/SymbolSearch'
      },
      /* ------------------------------- 仓位 ------------------------------- */
      // 仓位-历史记录
      {
        path: '/:lng/app/position/record',
        component: './webapp/pages/Position/HistoryRecord'
      },
      // 仓位-历史记录-详情
      {
        path: '/:lng/app/position/record/:id',
        component: './webapp/pages/Position/HistoryRecord/HistoryOrderDetail'
      },
      /* ------------------------------- 账号相关 ------------------------------- */
      // 账号选择
      {
        path: '/:lng/app/account/select',
        component: './webapp/pages/Account/AccountSelect'
      },
      // 创建账号
      {
        path: '/:lng/app/account/create',
        component: './webapp/pages/Account/AccountNew'
      },
      // 账号详情
      {
        path: '/:lng/app/account/view/:id',
        component: './webapp/pages/Account/AccountDetail'
      },
      // 转账-划转页面
      {
        path: '/:lng/app/account/transfer',
        component: './webapp/pages/Account/Transfer'
      },
      // 转账-划转详情
      {
        path: '/:lng/app/account/transfer/:id',
        component: './webapp/pages/Account/Transfer/TransferDetail'
      },
      /* ------------------------------- 个人中心 ------------------------------- */
      // 个人中心-语言选择
      {
        path: '/:lng/app/user-center/language',
        component: './webapp/pages/UserCenter/Language'
      },
      // 个人中心-消息列表
      {
        path: '/:lng/app/user-center/message',
        component: './webapp/pages/UserCenter/Message'
      },
      // 个人中心-消息列表-详情
      {
        path: '/:lng/app/user-center/message/:id',
        component: './webapp/pages/UserCenter/Message/Detail'
      },
      /* ------------------------------- 登錄註冊 ------------------------------- */
      // 登錄
      {
        path: '/:lng/app/welcome',
        component: './webapp/pages/Welcome'
      }
    ]
  },
  // ======================== 移动端页面路由 end ======================

  {
    path: '*',
    layout: false,
    component: './404'
  }
]
