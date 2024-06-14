import { stringify } from 'qs'

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
  return request<User.LoginResult>(`/api/blade-auth/oauth/token?${stringify(body)}`, {
    method: 'POST',
    ...(options || {})
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

// 发送邮箱验证码(输入邮箱)
export async function sendCustomEmailCode(body: { email: string }) {
  return request<API.Response<any>>(`/api/trade-crm/crmClient/validateCode/customEmail?${stringify(body)}`, {
    method: 'POST',
    data: body
  })
}

// 发送邮箱验证码（不需要输入邮箱）
export async function sendEmailCode() {
  return request<API.Response<any>>('/api/trade-crm/crmClient/validateCode/email', {
    method: 'POST'
  })
}

// 发送手机验证码(输入手机)
export async function sendCustomPhoneCode(body: { phone: string }) {
  return request<API.Response<any>>(`/api/trade-crm/crmClient/validateCode/customPhone?${stringify(body)}`, {
    method: 'POST',
    data: body
  })
}

// 发送手机验证码(不需要输入手机)
export async function sendPhoneCode() {
  return request<API.Response<any>>('/api/trade-crm/crmClient/validateCode/userPhone', {
    method: 'POST'
  })
}

// 客户用户-注册
export async function register(body: User.RegisterParams) {
  return request<API.Response<any>>('/api/trade-crm/crmClient/register/submit', {
    method: 'POST',
    data: body
  })
}

// 忘记密码
export async function forgetPassword(body: User.ForgetPasswordParams) {
  return request<API.Response<any>>('/api/trade-crm/crmClient/register/forgetPassword', {
    method: 'POST',
    data: body
  })
}
