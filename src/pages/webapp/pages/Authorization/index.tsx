import Loading from '@/components/Base/Lottie/Loading'
import mitt from '@/utils/mitt'
import { replace } from '@/utils/navigator'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO, STORAGE_SET_TOKEN, STORAGE_SET_USER_INFO } from '@/utils/storage'
import { useIntl, useModel, useSearchParams } from '@umijs/max'
import { useEffect, useState } from 'react'

/** webview 授权验证页面 */
export default function Authorization() {
  const intl = useIntl()
  const tips = intl.formatMessage({ id: 'mt.authorizing' })
  const { fetchUserInfo } = useModel('user')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const user_id = searchParams.get('user_id')
  const _redirect_url = searchParams.get('redirect_url')
  const redirect_url = decodeURIComponent(_redirect_url || '')

  const old_token = STORAGE_GET_TOKEN()
  const old_user_id = STORAGE_GET_USER_INFO('user_id')

  const [loading, setLoading] = useState(false)

  // token && user_id && (old_token !== token || old_user_id !== user_id) && useTitle(intl.formatMessage({ id: 'mt.authorizing' }))

  // 全局设置token
  useEffect(() => {
    if (token && user_id) {
      if (old_token === token && old_user_id === user_id) {
        if (redirect_url) {
          replace(redirect_url)
        }
        return
      }

      setLoading(true)

      STORAGE_SET_TOKEN(token)
      STORAGE_SET_USER_INFO({ user_id: user_id })

      // RN端设置token成功，触发一个事件
      mitt.emit('tokenChange', token)

      // 获取用户信息
      fetchUserInfo()
        .then(() => {
          setTimeout(() => {
            if (redirect_url) {
              replace(redirect_url)
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                  type: 'authorized'
                })
              )
            }
          }, 1000)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [token])

  return (
    <div className="w-full h-screen max-h-full flex items-center justify-center">
      {loading && (
        <div className="flex flex-col items-center justify-center -mt-10">
          <Loading />
          <div className="flex items-center justify-center text-secondary text-base relative -top-10 ">
            {tips}
            <span className="dot-ani" />
          </div>
        </div>
      )}
    </div>
  )
}
