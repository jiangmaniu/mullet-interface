import { IApi } from 'umi'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'

// 插件模块默认接收一个参数api 里面有各种hook可供调用
export default function (api: IApi) {
  // build完成之后写入version.json
  api.onBuildHtmlComplete(()=>{
    // html内追加版本号
    const htmlPath = path.join(__dirname,'../../dist/index.html')
    let htmlStr = readFileSync(htmlPath).toString()
    const time = Date.now()
    htmlStr  = htmlStr.replace(/<\/head>/,`<meta name="version" content="${time}" /></head>`)
    writeFileSync(htmlPath, htmlStr)
    // public内追加版本号
    const versionJsonPath = path.join(__dirname,'../../dist/version.json')
    // 打包完成后写个时间戳作为版本号，再适当的时机请求接口数据，判断是否更新。nginx不缓存html
    writeFileSync(versionJsonPath, JSON.stringify({version: time}))
  })
}
