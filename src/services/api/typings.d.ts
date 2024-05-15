// 接口公共参数

declare namespace API {
  // 分页参数
  type PageParams = {
    current?: number
    pageSize?: number
  }
  type PageSkipParams = {
    /**@name 跳过的条数 pageNum * pageSize */
    SkipCount?: number
    /**@name pageSize */
    MaxResultCount?: number
  }
  type Result<T = any> = {
    error?: { code: number; details: any; message: string; validationErrors: string }
    success?: boolean
    targetUrl?: any
    unAuthorizedRequest?: boolean
    __abp?: boolean
    result?: T
  }

  // gt4公共参数
  type GeeTestParam = {
    captcha_id: string
    captcha_output: string
    gen_time: string
    lot_number: string
    pass_token: string
  }
}
