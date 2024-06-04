import qs from 'qs'

import { request } from '@/utils/request'

// 交易账户-新增
export async function AddAccount(body: Account.SubmitAccount) {
  return request<API.Response>('/api/trade-core/coreApi/account/save', {
    method: 'POST',
    data: body
  })
}

// 交易账户-修改
export async function UpdateAccount(body: Account.SubmitAccount) {
  return request<API.Response>('/api/trade-core/coreApi/account/update', {
    method: 'POST',
    data: body
  })
}

// 交易账户-充值
export async function rechargeAccount(body: Account.RechargeParams) {
  return request<API.Response>('/api/trade-core/coreApi/account/recharge', {
    method: 'POST',
    data: body
  })
}

// 交易账户-删除
export async function removeAccount(body: API.IdParam) {
  return request<API.Response>(`/api/trade-core/coreApi/account/remove?${qs.stringify(body)}`, {
    method: 'POST'
  })
}

// 资金变更记录-分页
export async function getMoneyRecordsPageList(params: Account.MoneyRecordsPageListParams) {
  return request<API.Response<API.PageResult<Account.MoneyRecordsPageListItem>>>('/api/trade-core/coreApi/account/moneyRecords', {
    method: 'GET',
    params
  })
}

// 交易账户-分页
export async function getAccountPageList(params: Account.AccountPageListParams) {
  return request<API.Response<API.PageResult<Account.AccountPageListItem>>>('/api/trade-core/coreApi/account/list', {
    method: 'GET',
    params
  })
}

// 交易账户-详情
export async function getAccountDetail(params: API.IdParam) {
  return request<API.Response<Account.AccountPageListItem>>('/api/trade-core/coreApi/account/detail', {
    method: 'GET',
    params
  })
}
