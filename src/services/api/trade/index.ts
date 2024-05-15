import { request } from '@/utils/request'

// 获取历史平仓订单列表
export async function getCloseOrders() {
  return request<API.Result<{ data: Trade.CloseOrderItem[]; sumProfit: number; sumOrderSwaps: number }>>(
    '/api/services/app/Trade/GetCloseOrders',
    {
      method: 'GET'
    }
  )
}

// 获取交易品种列表
export async function getSymbols() {
  return request<API.Result<Trade.SymbolItem>>('/api/services/app/Trade/GetSymbols', {
    method: 'GET'
  })
}

// 获取入金明细
export async function getDepositDetails(params: Trade.DepositOrWithdrawDetailsParams) {
  return request<API.Result<{ totalCount: number; items: Trade.DepositDetailItem[] }>>('/api/services/app/FundManage/GetDepositDetails', {
    method: 'GET',
    params
  })
}

// 获取出金明细
export async function getWithdrawDetails(params: Trade.DepositOrWithdrawDetailsParams) {
  return request<API.Result<{ totalCount: number; items: Trade.WithdrawDetailItem[] }>>('/api/services/app/FundManage/GetWithdrawDetails', {
    method: 'GET',
    params
  })
}
