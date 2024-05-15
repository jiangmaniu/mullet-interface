// import { getUser } from '@/services/user'

import { getIntl, useModel } from '@umijs/max'
import { useRequest } from 'ahooks'
import { message } from 'antd'

import { getMtFundsInfo } from '@/services/api/fund'
import { sendEmailMessageCode, sendSmsCodeCaptcha } from '@/services/api/user'

export default function Page() {
  const { initialState, setInitialState } = useModel('@@initialState')

  // 重新获取用户信息赋值
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      setInitialState((s) => ({
        ...s,
        currentUser: userInfo
      }))
    }
  }

  // 发送手机验证码
  const onSendSmsCodeCaptcha = async (params: User.CaptchaParams) => {
    const res = await sendSmsCodeCaptcha(params)
    const success = res?.success
    if (success) {
      message.success(getIntl().formatMessage({ id: 'admin.table.account.codeSendSuccess' }))
    }
    return success
  }

  // 发送邮箱证码
  const onSendEmailMessageCode = async (params: User.CaptchaParams) => {
    const res = await sendEmailMessageCode(params)
    const success = res?.success
    if (success) {
      message.success(getIntl().formatMessage({ id: 'admin.table.account.codeSendSuccess' }))
    }
    return success
  }

  // 获取用户MT余额等数据
  const { data: mtFundsInfo, run: queryMtFundsInfo } = useRequest(getMtFundsInfo)

  return {
    fetchUserInfo,
    onSendSmsCodeCaptcha,
    onSendEmailMessageCode,
    mtFundsInfo,
    queryMtFundsInfo
  }
}
