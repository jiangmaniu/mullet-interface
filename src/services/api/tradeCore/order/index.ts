import { request } from '@/utils/request'

// 追加保证金
export async function addMargin(body: Order.addMargin) {
  return request<API.Response>('/api/trade-core/coreApi/orders/addMargin', {
    method: 'POST',
    data: body
  })
}

// 下单
export async function createOrder(body: Order.CreateOrder) {
  return request<API.Response>('/api/trade-core/coreApi/orders/createOrder', {
    method: 'POST',
    data: body
  })
}

// 订单修改
export async function updateOrder(body: Order.UpdateOrder) {
  return request<API.Response>('/api/trade-core/coreApi/orders/updateOrder', {
    method: 'POST',
    data: body
  })
}

// 订单-分页
export async function getOrderPage(params?: Order.OrderPageListParams) {
  return request<API.Response<Order.OrderPageListItem>>('/api/trade-core/coreApi/orders/orderPage', {
    method: 'GET',
    params
  })
}

// 订单-详情
export async function getOrderDetail(params?: API.IdParam) {
  return request<API.Response<Order.OrderDetailListItem>>('/api/trade-core/coreApi/orders/detail', {
    method: 'GET',
    params
  })
}

// 持仓订单-分页
export async function getBgaOrderPage(params?: Order.BgaOrderPageListParams) {
  return request<API.Response<API.PageResult<Order.BgaOrderPageListItem>>>('/api/trade-core/coreApi/orders/bgaOrderPage', {
    method: 'GET',
    params
  })
}

// 成交记录-分页
export async function getTradeRecordsPage(params?: Order.TradeRecordsPageListParams) {
  return request<API.Response<API.PageResult<Order.TradeRecordsPageListItem>>>('/api/trade-core/coreApi/orders/tradeRecordsPage', {
    method: 'GET',
    params
  })
}
