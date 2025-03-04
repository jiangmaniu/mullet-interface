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
  /* ------------------------------- PageViewer ------------------------------- */
  {
    path: '/:lng/viewer/markdown',
    layout: false,
    component: './webapp/pages/Viewer/MarkdownPageViewer',
    access: 'canAdmin' // 权限配置
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
  {
    path: '/:lng/deposit',
    name: 'deposit',
    icon: 'icon-geren-rujin',
    access: 'canAdmin', // 权限配置
    component: './admin/deposit'
  },
  {
    path: '/:lng/deposit/process/:method',
    name: 'depositProcess',
    icon: 'icon-geren-rujin',
    access: 'canAdmin', // 权限配置
    component: './admin/deposit/process',
    hideInMenu: true
  },
  {
    path: '/:lng/deposit/otc/:id',
    name: 'depositOtc',
    icon: 'icon-geren-rujin',
    access: 'canAdmin', // 权限配置
    component: './admin/deposit/otc',
    hideInMenu: true
  },
  {
    path: '/:lng/deposit/wait',
    name: 'depositWait',
    icon: 'icon-geren-rujin',
    access: 'canAdmin', // 权限配置
    component: './admin/deposit/wait',
    hideInMenu: true
  },
  {
    path: '/:lng/withdrawal',
    name: 'withdrawal',
    icon: 'icon-geren-chujin',
    access: 'canAdmin', // 权限配置
    component: './admin/withdrawal'
  },
  {
    path: '/:lng/withdrawal/process/:method',
    name: 'withdrawalProcess',
    access: 'canAdmin', // 权限配置
    component: './admin/withdrawal/process',
    hideInMenu: true
  },
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
    component: './webapp/layouts/WebAppLayout',
    routes: [
      /* ------------------------------- 主tabbar ------------------------------- */
      // 行情
      {
        path: '/:lng/app/quote',
        component: './webapp/pages/Quote',
        access: 'canAdmin' // 权限配置
      },
      // 交易
      {
        path: '/:lng/app/trade',
        component: './webapp/pages/Trade',
        access: 'canAdmin' // 权限配置
      },
      // 仓位
      {
        path: '/:lng/app/position',
        component: './webapp/pages/Position',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心
      {
        path: '/:lng/app/user-center',
        component: './webapp/pages/UserCenter',
        access: 'canAdmin' // 权限配置
      },
      /* ------------------------------- 登录/注册/忘记密码 ------------------------------- */
      {
        path: '/:lng/app/login',
        component: './webapp/pages/Welcome'
      },
      {
        path: '/:lng/app/forget-pwd',
        component: './webapp/pages/User/ForgetPwd'
      },
      {
        path: '/:lng/app/reset-success',
        component: './webapp/pages/Welcome/ResetSuccess'
      },
      /* ------------------------------- 行情 ------------------------------- */
      // 行情-k线
      {
        path: '/:lng/app/quote/kline',
        component: './webapp/pages/Quote/KLine',
        access: 'canAdmin' // 权限配置
      },
      // 行情-品种搜索
      {
        path: '/:lng/app/quote/search',
        component: './webapp/pages/Quote/SymbolSearch',
        access: 'canAdmin' // 权限配置
      },
      /* ------------------------------- 仓位 ------------------------------- */
      // 仓位-历史记录
      {
        path: '/:lng/app/position/record',
        component: './webapp/pages/Position/HistoryRecord',
        access: 'canAdmin' // 权限配置
      },
      // 仓位-历史记录-详情
      {
        path: '/:lng/app/position/record/detail',
        component: './webapp/pages/Position/HistoryRecord/HistoryOrderDetail',
        access: 'canAdmin' // 权限配置
      },
      /* ------------------------------- 账号相关 ------------------------------- */
      // 账号选择
      {
        path: '/:lng/app/account/select',
        component: './webapp/pages/Account/AccountSelect',
        access: 'canAdmin' // 权限配置
      },
      // 创建账号
      {
        path: '/:lng/app/account/create',
        component: './webapp/pages/Account/AccountNew',
        access: 'canAdmin' // 权限配置
      },
      // 账号详情
      {
        path: '/:lng/app/account/info',
        component: './webapp/pages/Account/AccountDetail',
        access: 'canAdmin' // 权限配置
      },
      // 转账-划转页面
      {
        path: '/:lng/app/account/transfer',
        component: './webapp/pages/Account/Transfer',
        access: 'canAdmin' // 权限配置
      },
      // 转账-划转详情
      {
        path: '/:lng/app/account/transfer/detail',
        component: './webapp/pages/Account/Transfer/TransferDetailScreen',
        access: 'canAdmin' // 权限配置
      },
      /* ------------------------------- 个人中心 ------------------------------- */
      // 个人中心-语言选择
      {
        path: '/:lng/app/user-center/language',
        component: './webapp/pages/UserCenter/Language',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-消息列表
      {
        path: '/:lng/app/user-center/message',
        component: './webapp/pages/UserCenter/Message',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-消息列表-详情
      {
        path: '/:lng/app/user-center/message/:id',
        component: './webapp/pages/UserCenter/Message/Detail',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-实名认证状态
      // {
      //   path: '/:lng/app/user-center/verify-status',
      //   component: './webapp/pages/UserCenter/Kyc/VerifyStatus',
      //   access: 'canAdmin' // 权限配置
      // },
      // 个人中心-绑定邮箱
      {
        path: '/:lng/app/user-center/bind-email',
        component: './webapp/pages/UserCenter/Kyc/BindEmail',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-绑定手机
      {
        path: '/:lng/app/user-center/bind-phone',
        component: './webapp/pages/UserCenter/Kyc/BindPhone',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-验证消息
      {
        path: '/:lng/app/user-center/verify-msg',
        component: './webapp/pages/UserCenter/KycV2/KycVerifyMsgPage',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-验证证件照
      {
        path: '/:lng/app/user-center/verify-document',
        component: './webapp/pages/UserCenter/KycV2/KycVerifyDocPage',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-验证状态
      {
        path: '/:lng/app/user-center/verify-status',
        component: './webapp/pages/UserCenter/KycV2/KycVerifyStatusPage',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-验证状态
      {
        path: '/:lng/app/user-center/verify-information',
        component: './webapp/pages/UserCenter/KycV2/KycVerifyInformationPage',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心-认证信息
      {
        path: '/:lng/app/user-center/certification-information',
        component: './webapp/pages/UserCenter/Certification',
        access: 'canAdmin' // 权限配置
      },
      // 个人中心- kyc 认证（webview）
      {
        path: '/:lng/app/user-center/kyc-webview-page',
        component: './webapp/pages/UserCenter/KycV2/KycWebviewPage'
      },
      // 入金 （h5 & webview）
      {
        path: '/:lng/app/deposit',
        name: 'deposit',
        component: './webapp/pages/Deposit'
      },
      // 出金 （h5 & webview）
      {
        path: '/:lng/app/withdraw',
        name: 'withdraw',
        component: './webapp/pages/Withdraw'
      },
      // 出金過程 （h5 & webview）
      {
        path: '/:lng/app/withdraw/process/:method',
        name: 'withdrawProcess',
        component: './webapp/pages/Withdraw/Process'
      },
      // 出金預覽 （h5 & webview）
      {
        path: '/:lng/app/withdraw/preview',
        name: 'withdrawPreview',
        component: './webapp/pages/Withdraw/Preview'
      },
      // 出金等待 （h5 & webview）
      {
        path: '/:lng/app/withdraw/wait/:id',
        name: 'withdrawWait',
        component: './webapp/pages/Withdraw/Wait'
      },
      // 出入金记录 （h5 & webview）
      {
        path: '/:lng/app/record/payment',
        name: 'recordPayment',
        component: './webapp/pages/Record/Payment'
      },
      // 入金过程 （h5 & webview）
      {
        path: '/:lng/app/deposit/process/:method',
        name: 'depositProcess',
        component: './webapp/pages/Deposit/Process'
      },
      // 入金 OTC （h5 & webview）
      {
        path: '/:lng/app/deposit/otc/:id',
        name: 'depositOtc',
        component: './webapp/pages/Deposit/Otc'
      },
      // 入金等待 （h5 & webview）
      {
        path: '/:lng/app/deposit/wait/:id',
        name: 'depositWait',
        component: './webapp/pages/Deposit/Wait'
      },
      // 个人信息
      {
        path: '/:lng/app/person-info',
        component: './webapp/pages/UserCenter/PersonInfo'
      },
      // 修改密码
      {
        path: '/:lng/app/modify-password',
        component: './webapp/pages/UserCenter/ModifyPassword'
      },
      // 银行卡地址
      {
        path: '/:lng/app/bankcard-address',
        component: './webapp/pages/UserCenter/BankCardAddress'
      },
      // 数字钱包地址
      {
        path: '/:lng/app/wallet-address',
        component: './webapp/pages/UserCenter/WalletAddress'
      },
      // salesmartly客服
      {
        path: '/:lng/app/smart-kefu',
        access: 'canAdmin', // 权限配置
        component: './webapp/pages/SalesmartKefu',
        hideInMenu: true
      },
      {
        path: '/:lng/app/test',
        component: './webapp/pages/Test'
      },
      /* ------------------------------- PageViewer ------------------------------- */
      {
        path: '/:lng/app/viewer/markdown',
        component: './webapp/pages/Viewer/MarkdownPageViewer'
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
