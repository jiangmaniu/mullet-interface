import { RequestConfig } from '@umijs/max'
import { Base64 } from 'js-base64'

import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import type { RequestOptions } from '@@/plugin-request/request'

import { clientId, clientSecret } from './constants'
import { message } from './utils/message'
import { goLogin, onLogout } from './utils/navigator'

type IErrorInfo = {
  code: number
  message: string
}

type IRequestOptions = RequestOptions & {
  /**该请求是否需要token */
  needToken?: boolean
  /**接口是否需要客户端鉴权 */
  authorization?: boolean
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
      // console.log('==errorHandler==', JSON.stringify(error))
      if (opts?.skipErrorHandler) throw error
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
            errorMessage && message.info(errorMessage)
          }
        }
      } else if (error.response) {
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
        statusText && message.info(statusText)
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
    (config: IRequestOptions) => {
      // 请求之前添加token
      const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
      const token = config.token || STORAGE_GET_TOKEN() || ''
      const headers: any = {
        'Content-Type': 'x-www-form-urlencoded',
        // 'Accept-Language': getLocaleForBackend(),
        'Tenant-Id': '000000', // 默认的租户ID
        ...config.headers
      }

      if (config.authorization !== false) {
        // 客户端认证
        headers['Authorization'] = `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`
      }

      if (token) {
        headers['Blade-Auth'] = `${userInfo.token_type} ${token}`
      }

      if (config?.params?.pageSize) {
        // 传给后台分页大小是size
        config.params.size = config.params.pageSize
        delete config.params.pageSize
      }

      // token不存在并且该请求需要token，则不发送请求
      if (!token && config.needToken !== false) {
        goLogin()
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

      return response
    }
  ]
}
