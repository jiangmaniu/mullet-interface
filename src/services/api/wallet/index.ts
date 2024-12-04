import { request } from '@/utils/request'

// （p0）获取充值方式列表
export async function getDepositMethodList(params?: API.PageParam & { clientId: any }) {
  return request<API.Response<API.PageResult<Wallet.DepositMethod>>>('/api/blade-wallet/wallet/deposit/list', {
    method: 'GET',
    params
  })
}

// （p0）获取提现方式列表
export async function getWithdrawMethodList(params?: API.PageParam & { clientId: any }) {
  return request<API.Response<API.PageResult<Wallet.WithdrawMethod>>>('/api/blade-wallet/wallet/withdraw/list', {
    method: 'GET',
    params
  })
}

// （p0）生成充值订单
export async function generateDepositOrder(body: Wallet.GenerateDepositOrderParams) {
  return request<API.Response<any>>('/api/blade-wallet/wallet/deposit/create', {
    method: 'POST',
    data: body
  })
}

// （p0）生成提现订单（预览）
export async function generateWithdrawOrder(body: Wallet.GenerateWithdrawOrderParams) {
  return request<API.Response<any>>('/api/blade-wallet/wallet/withdraw/create', {
    method: 'POST',
    data: body
  })
}

// （p0）生成提交订单（确认）
export async function confirmWithdrawOrder(body: Wallet.ConfirmWithdrawOrderParams) {
  return request<API.Response<any>>('/api/blade-wallet/wallet/withdraw/confirm', {
    method: 'POST',
    data: body
  })
}

// (p1)TODO: 获取订单确认验证码接口
// (p1)TODO: 读取（区块链）地址管理列表接口 (p2 及增删改接口)
// (p1)TODO: 读取（银行）账户管理列表接口 (p2 及增删改接口)
