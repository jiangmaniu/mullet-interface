import { IApi } from 'umi'

const mobilePrefetchScripts: any = []
const mobilePrefetchStyles: any = []

const mobilePrefetchRouteName = [
  // 预加载主tabbar页面
  'p__webapp__pages__Quote__index',
  'p__webapp__pages__Trade__index',
  'p__webapp__pages__Position__index',
  'p__webapp__pages__UserCenter__index',

  // k线页面
  'p__webapp__pages__Quote__KLine__index'
]

// 插件模块默认接收一个参数api 里面有各种hook可供调用
export default function (api: IApi) {
  // 使用 onBuildComplete 钩子
  api.onBuildComplete(({ stats }) => {
    const assets: any = stats.toJson().assets // 获取打包后的产物

    // 遍历产物，查找以 /p__webapp__pages/ 开头的文件
    assets.forEach((asset: any) => {
      const pureName = asset.name.split('.').filter((v: any) => v)[0]
      // if (asset.name.indexOf('p__webapp__pages') !== -1 && mobilePrefetchRouteName.includes(pureName)) {
      // 移动端还是是全部预加载
      // prefetch 资源的加载是非阻塞的。浏览器会在空闲时下载这些资源，而不会影响当前页面的渲染或用户交互。
      if (asset.name.indexOf('p__webapp__pages') !== -1) {
        if (asset.name.endsWith('.js')) {
          mobilePrefetchScripts.push({
            rel: 'prefetch',
            as: 'script',
            href: `/${asset.name}` // 根据实际路径生成
          })
        }
        if (asset.name.endsWith('.css')) {
          mobilePrefetchStyles.push({
            rel: 'prefetch',
            as: 'style',
            href: `/${asset.name}` // 根据实际路径生成
          })
        }
      }
    })
  })

  // 将生成的 prefetch 链接添加到 HTML 中，这样会导致pc端加载移动端的不合适
  // api.addHTMLLinks(() => mobilePrefetchScripts)
  // api.addHTMLLinks(() => mobilePrefetchStyles)

  // 注入到页面中 在移动端在通过动态标签加载
  api.addHTMLHeadScripts(
    () => `
    const isMobile = document.documentElement.clientWidth < 1200
    window.__mobilePrefetchStyles__ = ${JSON.stringify(mobilePrefetchStyles)}
    window.__mobilePrefetchScripts__ = ${JSON.stringify(mobilePrefetchScripts)}
    if(isMobile) {
      const mobilePrefetchStyles = window.__mobilePrefetchStyles__ || []
      const mobilePrefetchScripts = window.__mobilePrefetchScripts__ || []
      const prefetchLinks = [...mobilePrefetchStyles, ...mobilePrefetchScripts]
      prefetchLinks.forEach(link => {
        const el = document.createElement('link')
        Object.keys(link).forEach(key => {
          el[key] = link[key]
        })
        document.head.appendChild(el)
      })
    }
  `
  )
}
