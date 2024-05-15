/**代理人接口相关：代理机构客户专区 */
declare namespace Agent {
  // 响应结果
  type Result<T = any> = {
    IsSuccess: boolean
    /** 0 */
    Status: string
    /**兼容返回错误的状态码 */
    status: number
    Data: T
    error?: any
    message?: any
    path?: any
    timestamp?: any
  }
  type PageParams = {
    pageSize?: number
    pageNo?: number
  }
  type commonParams = {
    account: number
    platform: number
  }
  type TimeRange = {
    beginCloseTime?: string
    endCloseTime?: string
  }
}
