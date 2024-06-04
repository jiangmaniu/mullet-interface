import type { RequestOptions } from '@umijs/max'
import { request as umiRequest } from '@umijs/max'

// 单独封装处理错误抛出，否则每个请求都需要catch，不这样做导致在页面上报异常
export const request: typeof umiRequest = <T>(url: string, opts: RequestOptions = { method: 'GET' }) => {
  return umiRequest<T>(url, opts)
    .then((res) => {
      return { success: true, ...res }
    })
    .catch((error) => {
      // 统一处理错误不继续抛出
      const errorInfo = error?.response?.data
      const message = error.info?.message || errorInfo?.error_description
      return {
        success: false, // 失败统一加上，方便表格消费
        errorInfo, // 业务代码返回的错误信息对象
        message,
        ...(error.info || {})
      }
    })
}
