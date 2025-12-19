import JumpingLoader from '@/components/Base/JumpingLoader'
import { WEB_HOME_PAGE } from '@/constants'
import { login } from '@/services/api/user'
import { onLogout, push } from '@/utils/navigator'
import { setLocalUserInfo } from '@/utils/storage'
import { PageLoading } from '@ant-design/pro-components'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import { FormattedMessage, useModel, useIntl } from '@umijs/max'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useTronWallet } from '@/hooks/useTronWallet'
import { Button } from '@/libs/ui/components/button'
import { message } from 'antd'

export default function Login() {
  const { ready, authenticated, logout, user, getAccessToken } = usePrivy()
  const { initialState, setInitialState } = useModel('@@initialState')
  const [showJumpingLoader, setShowJumpingLoader] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const intl = useIntl()

  // 自动创建 TRON 钱包（在登录后触发）
  // autoCreate=true 会在 authenticated 时自动检测并创建
  useTronWallet(true)

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
      setLoginError(null)
      try {
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
          // 登录失败，显示错误信息
          const errorMsg = result?.msg || intl.formatMessage({ id: 'mt.denglushibai' })
          setLoginError(errorMsg)
          message.error(errorMsg)
          // 退出privy登录
          logout()
          setShowJumpingLoader(false)
        }
      } catch (error: any) {
        // 请求异常，显示错误信息
        const errorMsg = error?.message || intl.formatMessage({ id: 'mt.denglushibai' })
        setLoginError(errorMsg)
        message.error(errorMsg)
        // 退出privy登录
        logout()
        setShowJumpingLoader(false)
      }
    }
  }

  const handleLogout = () => {
    // 退出privy登录session等信息
    logout()
    // 清除mullet登录的缓存
    onLogout()
    setShowJumpingLoader(false)
    setLoginError(null)
  }

  // 重试登录
  const handleRetryLogin = () => {
    setLoginError(null)
    onPrivyLogin()
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
    <div className="flex flex-col h-full items-center justify-center px-4">
      {!ready && <PageLoading />}
      {ready && !showJumpingLoader && (
        <div className="flex flex-col items-center max-w-md w-full">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/platform/img/pc-logo-dark.png" 
              alt="Mullet" 
              className="h-16 w-auto" 
            />
          </div>

          {/* 欢迎文字 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              <FormattedMessage id="mt.huanyinghuila" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              <FormattedMessage id="mt.lianjiequanbaodenglu" />
            </p>
          </div>

          {/* 登录失败错误提示 */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center w-full">
              <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
                <FormattedMessage id="mt.denglushibai" />
              </div>
              <div className="text-red-500 dark:text-red-300 text-xs">{loginError}</div>
            </div>
          )}

          {/* 登录按钮 */}
          {!authenticated ? (
            <Button 
              variant={'primary'} 
              color="primary" 
              onClick={handleRetryLogin}
              className="w-full h-12 text-base font-medium"
            >
              {loginError ? <FormattedMessage id="mt.chongxindenglu" /> : <FormattedMessage id="mt.lianjiequanbao" />}
            </Button>
          ) : (
            <div className="w-full space-y-3">
              {/* 已连接钱包提示 */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <FormattedMessage id="mt.yilianjiequanbao" />
              </div>
              <Button 
                onClick={handleRetryLogin} 
                variant={'primary'} 
                color="primary"
                className="w-full h-12 text-base font-medium"
              >
                <FormattedMessage id="mt.chongxindenglu" />
              </Button>
              <Button 
                onClick={handleLogout} 
                variant={'outline'} 
                className="w-full h-12 text-base font-medium"
              >
                <FormattedMessage id="mt.duankailianjie" />
              </Button>
            </div>
          )}

          {/* 底部提示 */}
          <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
            <FormattedMessage id="mt.dengludiyitishi" />
          </p>
        </div>
      )}
      {showJumpingLoader && (
        <div className="flex flex-col items-center gap-y-4">
          <JumpingLoader />
          <span className="text-gray-600 dark:text-gray-300">
            <FormattedMessage id="mt.tiaozhuanzhong" />
            ...
          </span>
        </div>
      )}
    </div>
  )
}
