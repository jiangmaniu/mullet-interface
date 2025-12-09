import { RequestConfig } from '@umijs/max'
import { Base64 } from 'js-base64'

import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import type { RequestOptions } from '@@/plugin-request/request'

import { getAccessToken } from '@privy-io/react-auth'
import { getLocaleForBackend } from './constants/enum'
import { getEnv } from './env'
import { message } from './utils/message'
import { onLogout } from './utils/navigator'

type IErrorInfo = {
  code: number
  message: string
}

type IRequestOptions = RequestOptions & {
  /**该请求是否需要token */
  needToken?: boolean
  /**接口是否需要客户端鉴权 */
  authorization?: boolean
  /**接口需要防重放，针对POST请求 */
  replayProtection?: boolean
  /**接口需要加密请求参数，针对POST请求 */
  cryptoData?: boolean
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */

// 除了 errorConfig, requestInterceptors, responseInterceptors 以外其它配置都直接透传 axios 的 request 配置
export const errorConfig: RequestConfig = {
  // 统一的请求设定
  timeout: 20000,
  method: 'GET', // 默认get
  headers: { 'Content-Type': 'application/json' },

  // 错误处理
  errorConfig: {
    // 错误抛出
    // errorThrower 是利用 responseInterceptors 实现的，它的触发条件是: 当 data.success 为 false 时
    // https://umijs.org/docs/max/request#%E8%AF%B7%E6%B1%82
    errorThrower: (res) => {
      const { success, msg: message, code } = res as unknown as API.Response
      // 根据后端返回抛出错误
      if (!success) {
        const error: any = new Error(message)
        error.name = 'MtServiceError'
        error.info = { code, message }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    // 第一个参数是 catch 到的 error，第二个参数则是 request 的 opts
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) {
        if (error?.response?.data?.code === 401 || error?.response?.status === 401) {
          // 重新去登录
          onLogout()
        }
        throw error
      }
      // 我们的 errorThrower 抛出的错误。
      // 业务接口错误处理
      if (error.name === 'MtServiceError') {
        const errorInfo: IErrorInfo = error.info
        if (errorInfo) {
          const { message: errorMessage, code } = errorInfo
          if (code === 401) {
            // 登录失效，重新去登录
            return onLogout()
          } else {
            // 业务错误统一提示
            errorMessage && !opts?.noMessage && message.info(errorMessage)
          }
        }
      } else if (error.response) {
        console.log('==error.response status==', error.response?.status)
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const { status, data } = error.response
        let errorMessage = data?.msg || data?.message || data?.error_description || data?.error
        let statusText
        switch (status) {
          case 400:
            statusText = 'Bad Request'
            break
          case 401:
            // 重新去登录
            onLogout(true)
            break
          case 413:
            statusText = 'Payload Too Large'
            break
          case 500:
            statusText = 'Internal Server Error'
            break
          case 502:
            statusText = 'Bad Gateway'
            break
          case 504:
            statusText = 'Gateway Timeout'
            break
        }
        statusText = errorMessage || statusText
        if (status !== 401) {
          statusText && message.info(statusText)
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.info('None response! Please retry.')
      } else if (error.message?.startsWith('timeout')) {
        message.info('Request Timeout')
      } else {
        // 发送请求时出了点问题
        // message.info('Request error, please retry.')
      }
    }
  },

  // 请求拦截器
  // https://github.com/umijs/umi-request#interceptor
  requestInterceptors: [
    async (config: IRequestOptions) => {
      // https://docs.privy.io/authentication/user-authentication/access-tokens
      const privyAccessToken = await getAccessToken()
      // console.log('privy accessToken', privyAccessToken);
      // 请求之前添加token
      const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
      const token = config.token || STORAGE_GET_TOKEN() || ''
      const env = getEnv()
      const CLIENT_ID = env.CLIENT_ID
      const CLIENT_SECRET = env.CLIENT_SECRET
      const headers: any = {
        'Content-Type': 'x-www-form-urlencoded',
        Language: getLocaleForBackend(),
        'Tenant-Id': '000000', // 默认的租户ID
        ...config.headers
      }
      if (privyAccessToken) {
        // 使用Privy的token
        headers['privy-token'] = privyAccessToken
      }
      if (config.authorization !== false) {
        // 客户端认证
        headers['Authorization'] = `Basic ${Base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
      }

      // if (token) {
      //   headers['Blade-Auth'] = `${userInfo?.token_type || 'Bearer'} ${token}`
      // }

      // POST接口
      // if (config.method === 'post') {
      //   // 启用接口防重放
      //   if (config.replayProtection) {
      //     const timestamp = Date.now()
      //     const nonce = getUid()
      //     const stringifyBodyparams = stringify(
      //       {
      //         // 业务参数排序
      //         ...formatObjArrToStr(sortObjectByKey(deleteEmptyProperty(config.data))),
      //         timestamp,
      //         nonce,
      //         appkey: REPLAY_PROTECTION_APP_KEY // 和后台约定的接口防重放的appkey
      //       },
      //       { encode: false }
      //     )
      //     // console.log('stringifyBodyparams', stringifyBodyparams)
      //     // console.log('md5', md5(stringifyBodyparams))
      //     // md5签名
      //     headers['sign'] = md5(stringifyBodyparams)
      //     // 时间戳
      //     headers['timestamp'] = timestamp
      //     // 随机数
      //     headers['nonce'] = nonce
      //   }
      // }

      // // 启用接口加密请求参数传输
      // if (config.cryptoData) {
      //   // console.log('加密前的请求参数', config.data)
      //   // 对接口使用AES堆成加密请求参数
      //   if (config.params) {
      //     const data = crypto.encrypt(JSON.stringify(config.params))
      //     config.params = { data }
      //   }
      //   if (config.data) {
      //     // 标记text请求
      //     config.text = true
      //     config.data = crypto.encrypt(JSON.stringify(config.data))
      //   }
      //   // console.log('加密后的请求参数', config.data)
      //   // console.log('解密后的请求参数', JSON.parse(crypto.decrypt(config.data)))
      // }

      // headers中配置text请求
      if (config.text === true) {
        headers['Content-Type'] = 'text/plain'
      }

      if (config?.params?.pageSize) {
        // 传给后台分页大小是size
        config.params.size = config.params.pageSize
        delete config.params.pageSize
      }

      // token不存在并且该请求需要token，则不发送请求
      if (!token && config.needToken !== false) {
        return Promise.reject('')
      }

      return { ...config, interceptors: true, headers }
    }
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as API.Response

      // 解析加密报文
      // @ts-ignore
      // if (response.config.cryptoData) {
      //   // @ts-ignore
      //   const d = JSON.parse(crypto.decryptAES(response.data, crypto.aesKey))
      //   // @ts-ignore
      //   response.data = d
      // }

      return response
    }
  ]
}
