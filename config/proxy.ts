/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */

// const zlib = require('zlib')
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      // 要代理的地址
      target: process.env.BASE_URL,
      // target: 'https://www.cd-ex.com/apis',
      // target: 'https://awapis.cd-ex.com',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/api/': '/api/' },
      onProxyReq: (proxyReq: any, req: any, res: any) => {
        console.log('[请求拦截]', req.method, req.url, proxyReq.getHeaders())
      },
      onProxyRes: (proxyRes: any, req: any, res: any) => {
        console.log('[响应拦截]', req.method, req.url)

        // let body: any = []

        // proxyRes.on('data', (chunk: any) => {
        //   body.push(chunk)
        // })

        // proxyRes.on('end', () => {
        //   body = Buffer.concat(body)

        //   // 检查是否是 Gzip 或 Deflate 压缩
        //   const encoding = proxyRes.headers['content-encoding']
        //   if (encoding === 'gzip') {
        //     zlib.gunzip(body, (err: any, decoded: any) => {
        //       if (!err) {
        //         console.log(decoded.toString('utf8')) // 解码后打印
        //       } else {
        //         console.error('Gzip 解压失败:', err)
        //       }
        //     })
        //   } else if (encoding === 'deflate') {
        //     zlib.inflate(body, (err: any, decoded: any) => {
        //       if (!err) {
        //         console.log(decoded.toString('utf8'))
        //       } else {
        //         console.error('Deflate 解压失败:', err)
        //       }
        //     })
        //   } else {
        //     // 直接转换为字符串
        //     console.log(body.toString('utf8'))
        //   }
        // })
      }
    }
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' }
    }
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' }
    }
  }
}
