import { request } from '@/utils/request'

// 出金入金方式列表
export async function getFundsMethodPageList(params?: Wallet.fundsMethodPageListParams) {
  return request<API.Response<API.PageResult<Wallet.fundsMethodPageListItem>>>(
    '/api/trade-payment/paymentClient/common/fundsMethodPageList',
    {
      method: 'GET',
      params
    }
  )
}

// /trade-payment/paymentClient/deposit/create
// 生成入金订单
export async function generateDepositOrder(body: Wallet.GenerateDepositOrderParams) {
  return request<API.Response<any>>('/api/trade-payment/paymentClient/deposit/create', {
    method: 'POST',
    data: body
  })
}

// /trade-payment/paymentClient/deposit/depositOrderList
// 客戶端入金記錄
export async function getDepositOrderList(
  params?: API.PageParam & {
    startTime?: string
    endTime?: string
    tradeAccountId: string
  }
) {
  return request<API.Response<API.PageResult<Wallet.depositOrderListItem>>>('/api/trade-payment/paymentClient/deposit/depositOrderList', {
    method: 'GET',
    params
  })
}

// /trade-payment/paymentClient/withdrawl/withdrawalOrderList
// 客戶端出金記錄
export async function getWithdrawalOrderList(
  params?: API.PageParam & {
    startTime?: string
    endTime?: string
    tradeAccountId: string
  }
) {
  return request<API.Response<API.PageResult<Wallet.withdrawalOrderListItem>>>(
    '/api/trade-payment/paymentClient/withdrawl/withdrawalOrderList',
    {
      method: 'GET',
      params
    }
  )
}

// /trade-payment/paymentClient/withdrawalAddress/pageList
// 获取提现地址列表
export async function getWithdrawalAddressList(params?: API.PageParam) {
  return request<API.Response<API.PageResult<Wallet.WithdrawalAddress>>>('/api/trade-payment/paymentClient/withdrawalAddress/pageList', {
    method: 'GET',
    params
  })
}

// /trade-payment/paymentClient/withdrawl/create
// 生成出金订单
export async function generateWithdrawOrder(body: Wallet.GenerateWithdrawOrderParams) {
  return request<API.Response<any>>('/api/trade-payment/paymentClient/withdrawl/create', {
    method: 'POST',
    data: body
  })
}

/**
 * 出入金方式列表(不分页)
 * @param params
 * @returns
 */
export async function getPaymentMethodList(params?: { fundsType: 1 | 2 }) {
  return request<API.Response<Wallet.fundsMethodPageListItem>>('/api/trade-payment/paymentClient/common/paymentMethodList', {
    method: 'GET',
    params
  })
}

// 获取提现方式列表
export async function getWithdrawMethodList(params?: API.PageParam & { clientId: any }) {
  return request<API.Response<API.PageResult<Wallet.WithdrawMethod>>>('/api/blade-wallet/wallet/withdraw/list', {
    method: 'GET',
    params
  })
}

// // 生成充值订单
// export async function generateDepositOrder(body: Wallet.GenerateDepositOrderParams) {
//   return request<API.Response<any>>('/api/blade-wallet/wallet/deposit/create', {
//     method: 'POST',
//     data: body
//   })
// }

// // 生成提现订单（预览）
// export async function generateWithdrawOrder(body: Wallet.GenerateWithdrawOrderParams) {
//   return request<API.Response<any>>('/api/blade-wallet/wallet/withdraw/create', {
//     method: 'POST',
//     data: body
//   })
// }

// 生成提交订单（确认）
export async function confirmWithdrawOrder(body: Wallet.ConfirmWithdrawOrderParams) {
  return request<API.Response<any>>('/api/blade-wallet/wallet/withdraw/confirm', {
    method: 'POST',
    data: body
  })
}

// 获取入金记录
export async function getDepositRecordList(params?: API.PageParam & { clientId: any }) {
  return request<API.Response<API.PageResult<Wallet.DepositRecord>>>('/api/blade-wallet/wallet/deposit/list', {
    method: 'GET',
    params
  })
}

// 获取提现记录
export async function getWithdrawRecordList(params?: API.PageParam & { clientId: any }) {
  return request<API.Response<API.PageResult<Wallet.WithdrawRecord>>>('/api/blade-wallet/wallet/withdraw/list', {
    method: 'GET',
    params
  })
}

// TODO: 获取订单确认验证码接口
// TODO: 读取（区块链）地址管理列表接口 (及增删改接口)
// TODO: 读取（银行）账户管理列表接口 (及增删改接口)
