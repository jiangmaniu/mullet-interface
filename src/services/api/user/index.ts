import { request } from '@/utils/request'

// 发送手机验证码
export async function sendSmsCodeCaptcha(body: User.CaptchaParams) {
  return request<API.Result>('/api/services/app/Send/SendSmsCode', {
    method: 'POST',
    data: body
  })
}

// 发送邮箱证码
export async function sendEmailMessageCode(body: User.CaptchaParams) {
  return request<API.Result>('/api/services/app/Send/SendEmailMessageCode', {
    method: 'POST',
    data: body
  })
}

// 登录接口
export async function login(body: User.LoginParams) {
  return request<API.Result<User.LoginResult>>('/api/TokenAuth/Clogin', {
    method: 'POST',
    data: body
  })
}

// 注册接口
export async function register(body: User.RegisterParams) {
  return request<API.Result>('/api/services/app/Customer/SubmitAgentData', {
    method: 'POST',
    data: body
  })
}

// 获取当前的用户信息
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.Result<User.UserInfo>>('/api/services/app/Customer/GetUserInfo', {
    method: 'GET',
    ...(options || {})
  }).then((result) => {
    const userInfo = result?.result

    // 设置真实账户和模拟账户，方便取值
    if (userInfo?.accountInfos) {
      // 真实-标准账户
      userInfo.realStandardAccount = Number(
        userInfo.accountInfos.find((v) => v.accountType === 'Real' && v.accountGroup === 'Standard')?.account
      )
      // 真实-微账户
      userInfo.realMiniAccount = Number(userInfo.accountInfos.find((v) => v.accountType === 'Real' && v.accountGroup === 'Mini')?.account)
      // 模拟账户
      userInfo.demoAccount = Number(userInfo.accountInfos.find((v) => v.accountType === 'Demo')?.account)
    }
    return userInfo
  })
}

// 获取国家地区列表
export async function getAreaDataList() {
  return request<API.Result<User.AreaCodeItem[]>>('/api/services/app/AreaData/GetAreaDataList', {
    method: 'GET'
  })
}

// 重置密码
export async function resetPassword(body: User.ResetPwdParams) {
  return request<API.Result>('/api/services/app/Customer/ResetUserPassword', {
    method: 'POST',
    data: body
  })
}

// 提交绑定手机号或邮箱
export async function bindEmailOrPhone(body: User.BindPhoneOrEmailParams) {
  return request<API.Result>('/api/services/app/Customer/BindEmailOrPhone', {
    method: 'POST',
    data: body
  })
}

// 提交修改手机号或邮箱
export async function modifyEmailOrPhone(body: User.ModifyBindPhoneOrEmailParams) {
  return request<API.Result>('/api/services/app/Customer/ModifyEmailOrPhone', {
    method: 'POST',
    data: body
  })
}

// 修改密码
export async function changeUserPassword(body: User.ModifyPwdParams) {
  return request<API.Result>('/api/services/app/Customer/changeUserPassword', {
    method: 'POST',
    data: body
  })
}

// 实名认证
export async function submitVerifiedData(body: User.VerifiedParams) {
  return request<API.Result>('/api/services/app/Customer/SubmitVerifiedData', {
    method: 'POST',
    data: body
  })
}

// 获取通知
export async function getNotice() {
  return request<API.Result<{ title: string }>>('/public/cdex-notice/list', {
    method: 'GET'
  })
}
