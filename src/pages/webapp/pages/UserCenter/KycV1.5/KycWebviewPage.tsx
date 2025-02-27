import { STORAGE_SET_TOKEN, STORAGE_SET_USER_INFO } from '@/utils/storage'
import { useModel, useSearchParams } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { isAndroid, isIOS } from 'react-device-detect'
import VerifyDoc from '../KycV2/VerifyDoc'
import VerifyMsg from '../KycV2/VerifyMsg'
import VerifyStatus2 from '../KycV2/VerifyStatus2'
import VerifyStatus3 from '../KycV2/VerifyStatus3'
import VerifyStatus4 from '../KycV2/VerifyStatus4'

const Children = observer(
  forwardRef(({ status, file = {} }: { status: string; file: any }, ref: any) => {
    const onSuccess = () => {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'success',
          status
        })
      )
    }

    const ref1 = useRef<any>(null)
    const ref0 = useRef<any>(null)

    const [retry, setRetry] = useState(false)

    useImperativeHandle(ref, () => ({
      onSubmit: () => {
        if (status === '0') {
          ref0.current?.onSubmit()
        } else if (status === '1') {
          ref1.current?.onSubmit()
        }
      },
      onRetry: () => {
        setRetry(true)
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
        {status === '1' || retry ? (
          <VerifyDoc ref={ref1} onSuccess={onSuccess} onDisabledChange={onDisabledChange} file={file} />
        ) : status === '2' ? (
          <VerifyStatus2 />
        ) : status === '3' ? (
          <VerifyStatus3 />
        ) : status === '4' ? (
          <VerifyStatus4 />
        ) : (
          <VerifyMsg ref={ref0} onSuccess={onSuccess} onDisabledChange={onDisabledChange} />
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

  const ref = useRef<any>(null)
  const [file, setFile] = useState<any>({})
  const [stop, setStop] = useState(false)
  useEffect(() => {
    const messageHandler = (e: any) => {
      try {
        const data = e?.data ? JSON.parse(e?.data) : undefined

        if (data?.action === 'submit') {
          ref.current?.onSubmit()
        }

        if (data?.action === 'retry') {
          ref.current?.onRetry()
        }

        if (data?.action === 'upload' && !stop) {
          setStop(true)
          setFile(data?.value)
        }
      } catch (error) {
        // message.info(`监听消息错误: ${JSON.stringify(error)}`)
      }
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

  return <Children status={status} ref={ref} file={file} />
}
