import { request } from '@/utils/request'

// 上传文件
export async function fileUpload(body: any) {
  return request<API.Response<Common.UploadResult>>('/api/blade-resource/oss/endpoint/put-file', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 查询手机区号选择
export async function getAreaCode() {
  return request<API.Response<API.KEYVALUE[]>>('/api/trade-crm/crmClient/public/dictBiz/area_code', {
    method: 'GET'
  })
}

// 查询交易品种分类列表
export async function getTradeSymbolCategory() {
  return request<API.Response<API.KEYVALUE[]>>('/api/trade-crm/crmClient/public/dictBiz/symbol_classify', {
    method: 'GET'
  }).then((res) => {
    if (res.success && res.data?.length) {
      res.data = res.data.map((item) => ({ ...item, value: item.key, label: item.value }))
    }
    return res
  })
}
