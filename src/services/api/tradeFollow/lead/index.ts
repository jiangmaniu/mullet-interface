import { request } from '@/utils/request'

// 带单人-跟单广场
export async function getTradeFollowLeadPlaza(params?: TradeFollowLead.LeadPlazaParams) {
  return request<API.Response<TradeFollowLead.LeadPlazaItem[]>>('/api/trade-follow/followApi/lead/lead_plaza', {
    method: 'GET',
    params
  })
}

// 带单人-新增
export async function addTraadeFollowLead(body: TradeFollowLead.LeadSaveParams) {
  return request<API.Response>('/api/trade-follow/followApi/lead/save', {
    method: 'POST',
    data: body
  })
}

// /trade-follow/followApi/lead/lead_managements
// 带单人-带单管理
export async function getTradeFollowLeadManagements(params: { clientId: string | number }) {
  return request<API.Response<TradeFollowLead.LeadManagementsItem[]>>('/api/trade-follow/followApi/lead/lead_managements', {
    method: 'GET',
    params
  })
}

// /trade-follow/followApi/lead/settings
// 带单人 - 设置
export async function setTradeFollowLeadSettings(body: TradeFollowLead.LeadSettingsParams) {
  return request<API.Response>('/api/trade-follow/followApi/lead/settings', {
    method: 'POST',
    data: body
  })
}

// /trade-follow/followApi/lead/detail
// 带单人 - 详情
export async function getTradeFollowLeadDetail(params: { leadId: string | number }) {
  return request<API.Response<TradeFollowLead.LeadDetailItem>>('/api/trade-follow/followApi/lead/detail', {
    method: 'GET',
    params
  })
}

// /trade-follow/followApi/lead/statistics
// 带单人 - 带单表现
export async function tradeFollowStatistics(params: { id: string; startDatetime: string; endDatetime: string }) {
  return request<API.Response<TradeFollowLead.TradeFollowLeadStatisticsItem>>('/api/trade-follow/followApi/lead/statistics', {
    method: 'GET',
    params
  })
}

// /trade-follow/followApi/lead/profit_statistics
// 带单人 - 累计盈亏
export async function tradeFollowProfitStatistics(params: { id: string; startDatetime: string; endDatetime: string }) {
  return request<API.Response<TradeFollowLead.TradeFollowLeadProfitStatisticsItem>>('/api/trade-follow/followApi/lead/profit_statistics', {
    method: 'GET',
    params
  })
}

// /trade-follow/followApi/lead/symbol_statistics
// 带单人 - 交易偏好
export async function tradeFollowSymbolStatistics(params: { id: string; startDatetime: string; endDatetime: string }) {
  return request<API.Response<TradeFollowLead.TradeFollowLeadSymbolStatisticsItem[]>>(
    '/api/trade-follow/followApi/lead/symbol_statistics',
    {
      method: 'GET',
      params
    }
  )
}
