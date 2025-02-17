import { STORAGE_SET_TOKEN, STORAGE_SET_USER_INFO } from '@/utils/storage'
import { useModel, useSearchParams } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { isAndroid, isIOS } from 'react-device-detect'
import VerifyDoc from '../KycV2/VerifyDoc'
import VerifyStatus2 from '../KycV2/VerifyStatus2'
import VerifyStatus3 from '../KycV2/VerifyStatus3'
import VerifyStatus4 from '../KycV2/VerifyStatus4'
import VerifyMsg from './VerifyMsg'

const Children = observer(
  forwardRef(({ status }: { status: string }, ref: any) => {
    const onSuccess = () => {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'success'
        })
      )
    }

    const onDeposit = () => {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'deposit'
        })
      )
    }

    const onRetry = () => {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'retry'
        })
      )
    }

    const ref1 = useRef<any>(null)
    const ref2 = useRef<any>(null)
    const ref3 = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      onSubmit: () => {
        if (status === '1') {
          ref1.current?.onSubmit()
        } else if (status === '2') {
          ref2.current?.onSubmit()
        } else if (status === '3') {
          ref3.current?.onSubmit()
        }
      }
    }))

    const [disabled, setDisabled] = useState(true)

    const onDisabledChange = (disabled: boolean) => {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'disabled',
          disabled
        })
      )
    }

    return (
      <div className="px-[14px]">
        {status === '1' ? (
          <VerifyDoc ref={ref1} onSuccess={onSuccess} onDisabledChange={onDisabledChange} />
        ) : status === '2' ? (
          <VerifyStatus2 />
        ) : status === '3' ? (
          <VerifyStatus3 />
        ) : status === '4' ? (
          <VerifyStatus4 />
        ) : (
          <VerifyMsg onSuccess={onSuccess} onDisabledChange={onDisabledChange} />
        )}
      </div>
    )
  })
)

export default function KycWebviewPage() {
  const user = useModel('user')
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''
  const user_id = (searchParams.get('user_id') as string) || ''
  const status = searchParams.get('status') || ''

  useLayoutEffect(() => {
    const setTokenToStorage = async () => {
      try {
        STORAGE_SET_TOKEN(token)
        STORAGE_SET_USER_INFO({ user_id })

        await user.fetchUserInfo()
      } catch (error) {
        // @ts-ignore
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            error: JSON.stringify(error)
          })
        )
      }
    }

    if (token && user_id && status) {
      setTokenToStorage()
    }
  }, [token, user_id, status])

  useEffect(() => {
    const messageHandler = (e: any) => {
      const data = e?.data ? JSON.parse(e?.data) : undefined
      console.log('监听消息', data)
    }

    if (isIOS) {
      window.addEventListener('message', messageHandler)
    } else if (isAndroid) {
      document.addEventListener('message', messageHandler)
    }

    return () => {
      if (isIOS) {
        window.removeEventListener('message', messageHandler)
      } else if (isAndroid) {
        document.removeEventListener('message', messageHandler)
      }
    }
  }, [])

  return <Children status={status} />
}
