import { RequestConfig } from '@umijs/max'
import { message, notification } from 'antd'

import { STORAGE_GET_TOKEN } from '@/utils/storage'
import type { RequestOptions } from '@@/plugin-request/request'

import { getLocaleForBackend } from './constants/enum'

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9
}
// 与后端约定的响应数据格式
interface IErrorInfo {
  code: number
  details?: string
  message: string
  validationErrors?: string
  showType?: ErrorShowType
}
interface ResponseStructure {
  success: boolean
  data: any
  error?: IErrorInfo
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
      const { success, error = {} } = res as unknown as ResponseStructure
      // 根据后端返回抛出错误
      if (!success) {
        let message = res?.error?.message
        let code = res?.error?.code
        let details = res?.error?.details

        const error: any = new Error(message)
        error.name = 'CdexServiceError'
        error.info = { code, message, details }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    // 第一个参数是 catch 到的 error，第二个参数则是 request 的 opts
    errorHandler: (error: any, opts: any) => {
      console.log('==errorHandler==', JSON.stringify(error))
      if (opts?.skipErrorHandler) throw error
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'CdexServiceError') {
        const errorInfo: IErrorInfo | undefined = error.info
        if (errorInfo) {
          const { message: errorMessage, code } = errorInfo
          // 登录失效，重新去登录
          if (code === -1) {
            // onLogout() // @TODO
            return
          }
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage)
              break
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage)
              break
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: code
              })
              break
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break
            default:
              message.error(errorMessage)
              break
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        // message.error(`Response status:${error.response.status}`)
        const { status } = error.response
        let statusText = ''
        switch (status) {
          case 400:
            statusText = 'Bad Request'
            break
          case 401:
            // statusText = 'Unauthorized'
            // onLogout(true) // @TODO
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
        statusText && message.error(statusText)
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.')
      } else if (error.message?.startsWith('timeout')) {
        message.error('Request Timeout')
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.')
      }
    }
  },

  // 请求拦截器
  // https://github.com/umijs/umi-request#interceptor
  requestInterceptors: [
    (config: RequestOptions) => {
      // 请求之前添加token
      const token = config.token || STORAGE_GET_TOKEN() || ''
      // 语言传给后台
      const headers: any = {
        'Accept-Language': getLocaleForBackend(),
        ...config.headers
      }

      // 转化分页-post
      if (config.data?.pageSize) {
        config.data.SkipCount = (Number(config.data.current) - 1) * Number(config.data.pageSize)
        config.data.MaxResultCount = config.data.pageSize || 10
        delete config.data.current
        delete config.data.pageSize
      }
      // // 转化分页-get
      if (config.params?.pageSize) {
        config.params.SkipCount = (Number(config.params.current) - 1) * Number(config.params.pageSize)
        config.params.MaxResultCount = config.params.pageSize || 10
        delete config.params.current
        delete config.params.pageSize
      }
      if (token) {
        headers['Authorization'] = 'Bearer ' + token
      }
      return { ...config, interceptors: true, headers }
    }
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure
      return response
    }
  ]
}
