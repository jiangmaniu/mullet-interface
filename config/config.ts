// https://umijs.org/config/
import { defineConfig } from '@umijs/max'
import { join } from 'path'
import { GenerateSW } from 'workbox-webpack-plugin'
import { DEFAULT_LOCALE } from '../src/constants/index'
import ENV from '../src/env'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import routes from './routes'

const { REACT_APP_ENV = 'dev' } = process.env

export default defineConfig({
  base: '/',
  /**
   * @name 开启 hash 模式
   * @description 让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  // 只设置 dev 阶段的 sourcemap
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : false,

  /**
   * @name 兼容性设置
   * @description 设置 ie11 不一定完美兼容，需要检查自己使用的所有依赖
   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @name 路由的配置，不在路由中引入的文件不会编译
   * @description 只支持 path，component，routes，redirect，wrappers，title 的配置
   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @name moment 的国际化配置
   * @description 如果对国际化没有要求，打开之后能减少js的包大小
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @name 代理配置
   * @description 可以让你的本地服务器代理到你的服务器上，这样你就可以访问服务器的数据了
   * @see 要注意以下 代理只能在本地开发时使用，build 之后就无法使用了。
   * @doc 代理介绍 https://umijs.org/docs/guides/proxy
   * @doc 代理配置 https://umijs.org/docs/api/config#proxy
   */
  proxy: process.env.MOCK !== '1' ? proxy[REACT_APP_ENV as keyof typeof proxy] : undefined,
  /**
   * @name 快速热更新配置
   * @description 一个不错的热更新组件，更新时可以保留 state
   */
  fastRefresh: true,
  //============== 以下都是max的插件配置 ===============
  /**
   * @name 数据流插件
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * 一个全局的初始数据流，可以用它在插件之间共享数据
   * @description 可以用来存放一些全局的数据，比如用户信息，或者一些全局的状态，全局初始状态在整个 Umi 项目的最开始创建。
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name layout 插件
   * @doc https://umijs.org/docs/max/layout-menu
   */
  title: ENV.name,
  layout: {
    locale: true,
    ...defaultSettings
  },
  /**
   * @name moment2dayjs 插件
   * @description 将项目中的 moment 替换为 dayjs
   * @doc https://umijs.org/docs/max/moment2dayjs
   */
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration']
  },
  /**
   * @name 国际化插件
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    default: DEFAULT_LOCALE,
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true
  },
  /**
   * @name 主题的配置
   * @description 虽然叫主题，但是其实只是 less 的变量设置
   * @doc antd的主题设置 https://ant.design/docs/react/customize-theme-cn
   * @doc umi 的theme 配置 https://umijs.org/docs/api/config#theme
   */
  theme: {},
  /**
   * @name antd 插件
   * @description 内置了 babel import 插件
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {
    // 配置 antd 的 configProvider
    configProvider: {},
    // themes
    dark: false,
    compact: false, // 开启紧凑主题
    // babel-plugin-import
    import: false,
    // less or css, default less
    style: 'less',
    // shortcut of `configProvider.theme`
    // use to configure theme token, antd v5 only
    // 配置 antd@5 的 theme token，等同于配置 configProvider.theme，且该配置项拥有更高的优先级
    // theme: {
    //   token: {
    //     ...themeColor
    //   }
    // },
    // antd <App /> valid for version 5.1.0 or higher, default: undefined
    appConfig: {},
    // 配置 antd 的 DatePicker、TimePicker、Calendar 组件是否使用 moment 作为日期处理库，默认为 false
    momentPicker: true,
    // Add StyleProvider for legacy browsers
    styleProvider: {
      hashPriority: 'high',
      legacyTransformer: true
    }
  },
  /**
   * @name 网络请求配置
   * @description 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
   * @doc https://umijs.org/docs/max/request
   */
  request: {
    // 构建时配置可以为 useRequest 配置 dataField ，该配置的默认值是 data。该配置的主要目的是方便 useRequest 直接消费数据。如果你想要在消费数据时拿到后端的原始数据，需要在这里配置 dataField 为 ''
    dataField: ''
  },
  /**
   * @name 权限插件
   * @description 基于 initialState 的权限插件，必须先打开 initialState
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name <head> 中额外的 script
   * @description 配置 <head> 中额外的 script
   */
  headScripts: [
    // 解决首次加载时白屏的问题
    { src: '/scripts/loading.js', async: true },
    { src: '/scripts/sw.js', async: true }
  ],

  links: [{ rel: 'manifest', href: '/manifest.json' }],

  metas: [
    { name: 'application-name', content: ENV.name },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: ENV.name },
    { name: 'description', content: `${ENV.name} Trading Platform` },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    // { name: 'msapplication-config', content: '/icons/browserconfig.xml' },
    // { name: 'msapplication-TileColor', content: '#183EFC' }, // 使用你的主题色
    { name: 'msapplication-tap-highlight', content: 'no' },
    // <meta name="viewport" content="width=device-width, initial-scale=1">
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    // { name: 'theme-color', content: '#183EFC' } // 使用你的主题色
  ],
  favicons: [
    // 完整地址
    // 'https://domain.com/favicon.ico'
    // 此时将指向 `/favicon.png` ，确保你的项目含有 `public/favicon.png`
    // '/favicon.png'
    ENV.favicon || ''
  ],

  //================ pro 插件配置 =================
  presets: ['umi-presets-pro'],
  /**
   * @name openAPI 插件的配置
   * @description 基于 openapi 的规范生成serve 和mock，能减少很多样板代码
   * @doc https://pro.ant.design/zh-cn/docs/openapi/
   */
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false
    },
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger'
    }
  ],

  // mfsu: {
  //   strategy: 'normal'
  // },
  mfsu: false, // 不使用mfsu，否则引入tradingview组件会有兼容问题
  requestRecord: {},
  tailwindcss: {},
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
  // 将 node 的环境变量注入 define 配置中，可以在浏览器window.xx获取
  define: {
    BASE_URL: process.env.BASE_URL,
    'process.env.APP_ENV': process.env.APP_ENV,
    'process.env.PLATFORM': process.env.PLATFORM
  },
  // 使用本地字体
  chainWebpack(config) {
    config.module
      .rule('otf') //自己取的名字
      .test(/\.(otf|ttf|TTF)(\?.*)?$/) //匹配规则
      .use('url-loader') //使用的loader不是file-loader
      .loader(require.resolve('url-loader')) //	倒入loader
      .tap((options) => ({
        // 定义打包的一些规则
        ...options,
        name: 'public/fonts/[name].[hash:8].[ext]'
      }))

    // workbox 配置
    if (process.env.NODE_ENV === 'production') {
      config.plugin('workbox').use(GenerateSW, [
        {
          cacheId: ENV.name, // 设置前缀
          skipWaiting: true, // 强制等待中的 Service Worker 被激活
          clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
          cleanupOutdatedCaches: true, //删除过时、老版本的缓存
          swDest: 'service-wroker.js', // 输出 Service worker 文件
          include: ['**/*.{html,js,css,png.jpg}'], // 匹配的文件
          exclude: ['service-wroker.js', 'scripts/sw.js', 'manifest.json', 'umi.js', 'umi.css'], // 忽略的文件
          disableDevLogs: true,
          runtimeCaching: [
            {
              urlPattern: /.*\.js.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'seed-js',
                expiration: {
                  maxEntries: 30, //最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 5 * 60 // 5 min
                }
              }
            },
            {
              urlPattern: /.*css.*/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'seed-css',
                expiration: {
                  maxEntries: 100, //最多缓存100个，超过的按照LRU原则删除
                  maxAgeSeconds: 5 * 60 // 5 min
                }
              }
            },
            {
              urlPattern: /.*(png|svga).*/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'seed-image',
                expiration: {
                  maxEntries: 300, //最多缓存300个，超过的按照LRU原则删除
                  maxAgeSeconds: 1 * 24 * 60 * 60 // 3 days
                }
              }
            },
            {
              urlPattern: /.*(otf|ttf|woff|woff2).*/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'seed-font',
                expiration: {
                  maxEntries: 30, //最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 3 * 24 * 60 * 60 // 3 days
                }
              }
            }
          ]
        }
      ])
    }
  }
})
