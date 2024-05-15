import { request } from '@/utils/request'

// 获取活动列表
export async function getBanners(params?: { BannerType: number }) {
  return request<API.Result<Activity.BannerItem[]>>('/api/services/app/Banner/GetBanners', {
    method: 'GET',
    params
  })
}

/**
 * 获取我的活动列表
 * @param params 1 进行中
 * @param params 2 已结束
 * @returns
 */
export async function getMyActivityList(params?: { userActivityStatus: number }) {
  return request<API.Result<{ activityuserinfos: Activity.MyActivityItem[]; count: number; status: number }>>(
    '/api/services/app/Activity/GetMyActivityList',
    {
      method: 'GET',
      params
    }
  )
}

// 获取老带新信息列表
export async function getLaoDaiXinActivityList() {
  return request<API.Result<{ status: number; content: Activity.LaoDaiXinActivityItem[]; message: string }>>(
    '/api/services/app/Activity/GetLaoDaiXinActivityList',
    {
      method: 'GET'
    }
  )
}

// 获取老带新详情
export async function getLaoDaiXinActivityDetail() {
  return request<API.Result<{ status: number; content: Activity.LaoDaiXinActivityItem; message: string }>>(
    '/api/services/app/Activity/GetLaoDaiXinActivityDetail',
    {
      method: 'GET'
    }
  )
}
