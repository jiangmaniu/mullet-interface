import Button from '@/components/Base/Button'
import JumpingLoader from '@/components/Base/JumpingLoader'
import { WEB_HOME_PAGE } from '@/constants'
import { login } from '@/services/api/user'
import { onLogout, push } from '@/utils/navigator'
import { setLocalUserInfo } from '@/utils/storage'
import { PageLoading } from '@ant-design/pro-components'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import { FormattedMessage, useModel } from '@umijs/max'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export default function Login() {
  const { ready, authenticated, logout, user, getAccessToken } = usePrivy()
  const { initialState, setInitialState } = useModel('@@initialState')
  const [showJumpingLoader, setShowJumpingLoader] = useState(false)

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo
        }))
      })
    }
    return userInfo
  }

  // 登录成功回调
  const handleLoginSuccess = async (params: any) => {
    if (params?.user) {
      const result = await login({
        grant_type: 'privy_token'
      })
      if (result?.success) {
        // 缓存用户信息
        setLocalUserInfo(result)

        // 重新获取用户信息
        const currentUser = await fetchUserInfo()
        // @ts-ignore
        // const hasAccount = currentUser?.accountList?.filter((item) => !item.isSimulate)?.length > 0
        // const jumpPath = hasAccount ? WEB_HOME_PAGE : ADMIN_HOME_PAGE
        setTimeout(() => {
          push(WEB_HOME_PAGE)
        }, 100)
        // 直接跳转到账户选择页面
        // push(ADMIN_HOME_PAGE)
      } else {
        // 退出privy登录
        logout()
        setShowJumpingLoader(false)
      }
    }
  }

  const handleLogout = () => {
    // 退出privy登录session等信息
    logout()
    // 清除stellux登录的缓存
    onLogout()
    setShowJumpingLoader(false)
  }

  const { login: onPrivyLogin } = useLogin({
    onComplete: (params) => {
      setShowJumpingLoader(true)
      console.log('登录成功', params)
      handleLoginSuccess(params)
    }
  })

  useEffect(() => {
    if (ready && !authenticated) {
      onPrivyLogin()
    }
  }, [ready, authenticated])

  return (
    <div className="flex flex-col h-full items-center justify-center">
      {!ready && <PageLoading />}
      {ready && !showJumpingLoader && (
        <>
          {!authenticated ? (
            <Button onClick={onPrivyLogin} type="primary">
              Connect
            </Button>
          ) : (
            <Button onClick={handleLogout} type="primary">
              DisConnect
            </Button>
          )}
        </>
      )}
      {showJumpingLoader && (
        <div className="flex flex-col items-center gap-x-1">
          <JumpingLoader />
          <span>
            <FormattedMessage id="mt.tiaozhuanzhong" />
            ...
          </span>
        </div>
      )}
    </div>
  )
}
