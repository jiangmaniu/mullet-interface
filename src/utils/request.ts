import type { RequestOptions } from '@umijs/max'
import { request as umiRequest } from '@umijs/max'

// 单独封装处理错误抛出，否则每个请求都需要catch，不这样做导致在页面上报异常
export const request: typeof umiRequest = <T>(url: string, opts: RequestOptions = { method: 'GET' }) => {
  return umiRequest<T>(url, opts).catch((error) => {
    // 统一处理错误不继续抛出
    return {
      success: false,
      ...(error.info || {})
    }
  })
}
