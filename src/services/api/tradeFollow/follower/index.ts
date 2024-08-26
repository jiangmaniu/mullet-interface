import { request } from '@/utils/request'

// 跟单管理 - 进行中
export async function getTradeFollowFolloerManagementInProgress(params?: TradeFollowFollower.ManagementParams) {
  return request<API.Response<TradeFollowFollower.ManagementInProgressItem[]>>(
    '/api/trade-follow/followApi/follower/management/in_progress',
    {
      method: 'GET',
      params
    }
  )
}

// /trade-follow/followApi/follower/management/end
// 跟单管理 - 已结束
export async function getTradeFollowFolloerManagementEnd(params?: TradeFollowFollower.ManagementParams) {
  return request<API.Response<TradeFollowFollower.ManagementEndItem[]>>('/api/trade-follow/followApi/follower/management/end', {
    method: 'GET',
    params
  })
}

// /trade-follow/followApi/follower/management/history
// 跟单管理 - 历史仓位
export async function getTradeFollowFolloerManagementHistory(params?: { followerId?: string | number }) {
  return request<API.Response<TradeFollowFollower.ManagementHistoryItem[]>>('/api/trade-follow/followApi/follower/management/history', {
    method: 'GET',
    params
  })
}

// /trade-follow/followApi/follower/save
// 跟单人 - 申请跟单 （设置）
export async function postTradeFollowFolloerSave(data: TradeFollowFollower.SaveParams) {
  return request<API.Response>('/api/trade-follow/followApi/follower/save', {
    method: 'POST',
    data
  })
}

// /trade-follow/followApi/follower/history_follower_order
// 跟单人 - 历史跟单
export async function getTradeFollowFolloerHistoryFollowerOrder(params?: { followerId?: string | number; leadId?: string | number }) {
  return request<API.Response<TradeFollowFollower.HistoryFollowerOrderItem[]>>(
    '/api/trade-follow/followApi/follower/history_follower_order',
    {
      method: 'GET',
      params
    }
  )
}
