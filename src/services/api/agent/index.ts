import { getIntl, getLocale } from '@umijs/max'
import { message } from 'antd'

import { onLogout } from '@/utils/navigator'
import { request } from '@/utils/request'
import { STORAGE_GET_USER_INFO } from '@/utils/storage'

interface IRequestProps {
  /**请求参数 */
  params?: Record<string, any>
  /**是否需要传入account */
  isNeedAccount?: boolean
  /**是否展示错误消息 */
  showErrorMessage?: boolean
}

// 请求CRM代理API
export function requestCrmAgentApi<T = any>(requestUrl: string) {
  return ({ params, isNeedAccount = true, showErrorMessage = false }: IRequestProps) => {
    const requestData = params || {}
    requestData.platform = 60
    // 是否需要传入账号
    if (isNeedAccount) {
      requestData.account = requestData.account || STORAGE_GET_USER_INFO('realStandardAccount')
    }

    // 目前接口支持 en_US  英文   zh_CN  中文   zh_TW  繁体
    const locale = getLocale() as string
    const lang = {
      'en-US': 'en_US',
      'id-ID': 'en_US',
      'zh-TW': 'zh_TW'
    }[locale]

    return request<API.Result<{ content: Agent.Result<T>; statusCode: number; responseStatus: number; errorMessage: any }>>(
      '/api/services/app/CrmAgent/RequestCrmAgentApi',
      {
        method: 'POST',
        data: {
          requestUrl,
          requestData,
          lang
        }
      }
    ).then((res) => {
      // 解析请求代理系统返回的数据格式
      if (typeof res.result?.content === 'string') {
        res.result.content = JSON.parse(res.result.content)
      }
      const statusCode = res.result?.statusCode
      const isSuccess = res?.result?.content?.IsSuccess
      const errMsg = res?.result?.content?.Data as string

      if (statusCode !== 200) {
        let statusText = res.result?.content?.Data as string
        const error = res.result?.content?.error
        const errorMsg = res.result?.content?.message
        const errorPath = res.result?.content?.path
        if (res.result?.content?.error) {
          statusText = `[${statusCode}] ${error} ${errorMsg} ${errorPath}`
        } else {
          switch (statusCode) {
            case 400:
              statusText = '[400] Bad Request'
              break
            case 401:
              // statusText = 'Unauthorized'
              onLogout()
              break
            case 413:
              statusText = '[413] Payload Too Large'
              break
            case 500:
              statusText = '[500] Internal Server Error'
              break
            case 502:
              statusText = '[502] Bad Gateway'
              break
            case 504:
              statusText = '[504] Gateway Timeout'
              break
          }
        }
        statusText && message.error(statusText)
      } else if (!isSuccess && showErrorMessage) {
        const noData = getIntl().formatMessage({ id: 'common.noData' })
        // @hack fix
        const errName = {
          无数据可导出: noData,
          未查到相关数据: noData
        }[errMsg]
        message.error(errName || errMsg || getIntl().formatMessage({ id: 'common.opFailed' }))
      }

      console.log('agent请求', params)
      console.log('agent响应', res)

      const result = res.result?.content

      return res
    })
  }
}

/**
 * /\*\*

- 新增 CRM 接口转发
  RequestCrmAgentApi 调用 CRM 代理 API

转发接口参数传入方式以 getSubordinateUserList 接口为例：
传入参数
{
"requestUrl": 'agent/getSubordinateUserList',//通过代理系统接口文档获取
"requestData": //参数为 crm 代理接口参数，详情请看庞雪娇接口http://192.168.0.232:10393/shareDoc?issue=1c2280cdb6b7d5566657cc25441c9121
{
"account": 80000005,
"platform": 53
}
}
返回值

{ "result": { "content": "{"Status":"0","IsSuccess":true,"Data":[],"Level":"1"}", "statusCode": 200, "responseStatus": 1, "errorMessage": null }, "targetUrl": null, "success": true, "error": null, "unAuthorizedRequest": false, "\_\_abp": true }
HTTP 状态码：
statusCode http 请求码 200 标识成功

responseStatus http 请求状态 1 标识完成
content 转发接口返回内容

开户接口 CustomerRegister 新增参数：
Promotionnumber 推广码

代理接口详细列表:
https://console-docs.apipost.cn/preview/36f4104a78948c5f/57a9a789996094b9
CRM 测试转发接口地址
http://api.cdex.lan/api/services/app/CrmAgent/RequestCrmAgentApi

* * */
