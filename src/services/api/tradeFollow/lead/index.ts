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
