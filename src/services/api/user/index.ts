import qs, { stringify } from 'qs'

import { request } from '@/utils/request'
import { setLocalUserInfo, STORAGE_GET_USER_INFO } from '@/utils/storage'

// 获取图形验证码
export async function getCaptcha() {
  return request<User.Captcha>('/api/blade-auth/oauth/captcha', {
    method: 'GET',
    authorization: false
  })
}

// 登录接口
export async function login(body: User.LoginParams, options?: { [key: string]: any }) {
  return request<API.Response<User.LoginResult>>(`/api/blade-auth/oauth/token?${qs.stringify(body)}`, {
    method: 'POST',
    ...(options || {})
  })
}

// 退出登录接口
export async function outLogin() {
  return request<API.Response>('/api/blade-auth/oauth/logout', {
    method: 'GET'
  })
}

// 刷新token
export async function refreshToken() {
  const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
  const body = {
    grant_type: 'refresh_token',
    scope: 'all',
    refresh_token: userInfo?.refresh_token
  }
  return request<User.UserInfo>(`/api/blade-auth/oauth/token?${stringify(body)}`, {
    method: 'POST'
  }).then((res) => {
    if (res?.access_token) {
      setLocalUserInfo(res)
    }
    return res
  })
}

// 退出登录
export async function logout() {
  return request('/api/blade-auth/oauth/logout', {
    method: 'GET',
    authorization: false
  })
}

// 获取当前的用户信息 @TODO 接口暂时没有提供
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<User.UserInfo>('/api/GetUserInfo', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取国家地区列表
export async function getAreaDataList() {
  return request<API.Response<any>>('/api/services/app/AreaData/GetAreaDataList', {
    method: 'GET'
  })
}
