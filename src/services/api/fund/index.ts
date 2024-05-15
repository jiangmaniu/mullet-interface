import { request } from '@/utils/request'

// 获取用户MT余额等数据
export async function getMtFundsInfo(params: { account: number }) {
  if (!params?.account) return
  return request<API.Result<Fund.MTFundsInfo>>('/api/services/app/FundManage/GetMtFundsInfo', {
    method: 'GET',
    params
  })
}

// 新增提币地址
export async function addCoinsAddress(body: Fund.AddOrUpdateCoinsAddressParams) {
  return request<API.Result>('/api/services/app/FundManage/AddCoinsAddress', {
    method: 'POST',
    data: body
  })
}

// 修改提币地址
export async function updateCoinsAddress(body: Fund.AddOrUpdateCoinsAddressParams) {
  return request<API.Result>('/api/services/app/FundManage/UpdateCoinsAddress', {
    method: 'POST',
    data: body
  })
}

// 删除提币地址
export async function deleteCoinsAddress(query: { id: number }) {
  return request<API.Result>('/api/services/app/FundManage/DeleteCoinsAddress', {
    method: 'GET',
    params: query
  })
}

// 获取提币地址列表
export async function getMyCoinsManageList() {
  return request<API.Result<Fund.MyCoinsListItem[]>>('/api/services/app/FundManage/GetMyCoinsManageList', {
    method: 'GET'
  })
}

// 获取提币手续费
export async function getOutMarginFee(params: { money: number; account: number }) {
  return request<API.Result<number>>('/api/services/app/FundManage/GetOutMarginFee', {
    method: 'GET',
    params
  })
}

// 申请提币
export async function applyOutMargin(body: Fund.ApplyOutMarginParams) {
  return request<API.Result>('/api/services/app/FundManage/ApplyOutMargin', {
    method: 'POST',
    data: body
  })
}

// 获取入金金额列表，目前写死用不到
export async function getPaymentMethod(body = { ClientType: 3 }) {
  return request<API.Result<{ errorCode: number; isSuccess: boolean; message: string }>>(
    '/deposit-api/bbtc/api/services/app/FundManage/GetPaymentMethod',
    {
      method: 'POST',
      data: body
    }
  )
}

// 获取入金金额列表
export async function getAntPlatAddress(params: { plat: number; account: number }) {
  return request<API.Result<string>>('/deposit-api/glcApi/api/services/app/QuickPayManager/GetAntPlatAddress', {
    method: 'GET',
    params
  })
}
