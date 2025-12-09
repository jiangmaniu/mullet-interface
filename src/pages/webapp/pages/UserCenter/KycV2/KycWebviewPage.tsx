import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import Button from '@/pages/webapp/components/Base/Button'
import { View } from '@/pages/webapp/components/Base/View'
import useWebviewPageSearchParams from '@/pages/webapp/hooks/useWebviewPageSearchParams'
import { STORAGE_SET_TOKEN, STORAGE_SET_USER_INFO } from '@/utils/storage'
import { useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { isAndroid, isIOS } from 'react-device-detect'
import VerifyDoc from './VerifyDoc'
import VerifyMsg from './VerifyMsg'
import VerifyStatus2 from './VerifyStatus2'
import VerifyStatus3 from './VerifyStatus3'
import VerifyStatus4 from './VerifyStatus4'

/** rn 版本所有逻辑，webview 版本所有逻辑 */
const Children = observer(
  forwardRef(
    (
      { status, file = {}, injectUpload, KYC_FACE }: { status: string; file: any; injectUpload?: () => Promise<void>; KYC_FACE: boolean },
      ref: any
    ) => {
      const onSuccess = (data?: any) => {
        if (status === '1' && KYC_FACE) {
          // 人臉核身
          // @ts-ignore
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: 'faceAuth',
              url: data?.url
            })
          )
        } else {
          // 证件审核
          // @ts-ignore
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: 'success',
              status
            })
          )
        }
      }

      const ref1 = useRef<any>(null)
      const ref0 = useRef<any>(null)

      const [retry, setRetry] = useState(false)

      useImperativeHandle(ref, () => ({
        onSubmit: () => {
          if (status === '0') {
            // ref0.current?.onSubmit()
          } else if (status === '1') {
            ref1.current?.onSubmit()
          }
        },
        onRetry: () => {
          setRetry(true)
        }
      }))

      const [disabled, setDisabled] = useState(false)

      const onDisabledChange = (disabled: boolean) => {
        setDisabled(disabled)
        // @ts-ignore
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: 'disabled',
            disabled
          })
        )
      }

      const intl = useIntl()
      const { cn } = useTheme()

      return (
        <div className="px-[14px]">
          {status === '1' || retry ? (
            <>
              <VerifyDoc ref={ref1} onSuccess={onSuccess} onDisabledChange={onDisabledChange} file={file} injectUpload={injectUpload} />

              <View className={cn('grid grid-cols-2 gap-5 w-full pb-2.5 px-[14px]')}>
                <Button
                  type="primary"
                  height={48}
                  className={cn(' flex-1 w-full')}
                  onClick={() => {
                    window.ReactNativeWebView?.postMessage(
                      JSON.stringify({
                        type: 'deposit'
                      })
                    )
                  }}
                >
                  {intl.formatMessage({ id: 'pages.userCenter.qurujin' })}
                </Button>

                {KYC_FACE ? (
                  <Button
                    type="danger"
                    height={48}
                    className={cn('w-full flex-1')}
                    onClick={() => {
                      ref1.current?.onSubmit()
                    }}
                  >
                    {intl.formatMessage({ id: 'pages.userCenter.kaishirenlianshibie' })}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    height={48}
                    className={cn('w-full flex-1')}
                    onClick={() => {
                      ref1.current?.onSubmit()
                    }}
                    disabled={disabled}
                  >
                    {intl.formatMessage({ id: 'pages.userCenter.tijiaoshenhe' })}
                  </Button>
                )}
              </View>
            </>
          ) : status === '2' ? (
            <>
              <VerifyStatus2 />

              <Button disabled={false} className="mb-2.5 mt-16 w-full  px-2 " height={48} onClick={onSuccess}>
                {intl.formatMessage({ id: 'common.operate.Confirm' })}
              </Button>
            </>
          ) : status === '3' ? (
            <>
              <VerifyStatus3 />

              <Button
                type="danger"
                disabled={false}
                className="mb-2.5 mt-16 w-full"
                height={48}
                onClick={() => {
                  window.ReactNativeWebView?.postMessage(
                    JSON.stringify({
                      type: 'retry'
                    })
                  )
                }}
              >
                {intl.formatMessage({ id: 'pages.userCenter.chongxinrenzheng' })}
              </Button>
            </>
          ) : status === '4' ? (
            <>
              <VerifyStatus4 />

              <Button type="primary" disabled={false} className="mb-2.5 mt-16 w-full" height={48} onClick={onSuccess}>
                {intl.formatMessage({ id: 'common.operate.Confirm' })}
              </Button>
            </>
          ) : (
            <>
              <VerifyMsg ref={ref0} onSuccess={onSuccess} onDisabledChange={onDisabledChange} />

              <Button
                type="primary"
                className="mb-2.5 mt-10 flex-1 mx-2"
                loading={false}
                height={48}
                onClick={() => {
                  ref0.current?.onSubmit()
                }}
                disabled={disabled}
              >
                {intl.formatMessage({ id: 'common.operate.Confirm' })}
              </Button>
            </>
          )}
        </div>
      )
    }
  )
)

// 添加正确的ref类型定义
interface RefType {
  onSubmit: () => void
  onRetry: () => void
}

export default function KycWebviewPage() {
  const user = useModel('user')
  const searchParams = useWebviewPageSearchParams()
  const token = searchParams.get('token') || ''
  const user_id = (searchParams.get('user_id') as string) || ''
  const status = searchParams.get('status') || ''
  const KYC_FACE = !!searchParams.get('KYC_FACE') || !!getEnv()?.KYC_FACE || false

  useLayoutEffect(() => {
    const setTokenToStorage = async () => {
      try {
        STORAGE_SET_TOKEN(token)
        STORAGE_SET_USER_INFO({ user_id })

        await user.fetchUserInfo()
      } catch (error) {
        // @ts-ignore
        window.ReactNativeWebView?.postMessage(
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
  const [times, setTImes] = useState(0)

  const injectUpload = async () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'takePhoto',
        times
      })
    )
  }

  // 使用useRef存储可变值，保持messageHandler的稳定性
  const refRef = useRef<React.RefObject<RefType>>(ref)
  const setFileRef = useRef(setFile)
  const timesRef = useRef(times)
  const setTimesRef = useRef(setTImes)

  // 当依赖项变化时更新引用
  useEffect(() => {
    refRef.current = ref
    setFileRef.current = setFile
    timesRef.current = times
    setTimesRef.current = setTImes
  }, [ref, setFile, times, setTImes])

  // 优化的messageHandler函数，使用稳定的引用而非闭包值
  const messageHandler = useCallback(async (event: Event) => {
    try {
      // 使用守卫条件安全地解析消息数据
      const eventData = (event as any)?.data
      if (!eventData) return

      // 安全地解析数据，处理各种格式
      let parsedData
      try {
        parsedData = JSON.parse(eventData)
      } catch (error) {
        // 如果第一次解析失败，可能不是JSON或已经被解析过
        parsedData = eventData
      }

      // 确保处理字符串格式的JSON数据
      const data = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData

      console.log('data===', data)
      // 根据消息类型分发到对应的处理函数
      if (data) {
        if (data.action === 'submit') {
          refRef.current?.current?.onSubmit()
        } else if (data.action === 'retry') {
          refRef.current?.current?.onRetry()
        } else if (data.action === 'upload' && data.times === timesRef.current) {
          setTimesRef.current((prev) => prev + 1)
          setFileRef.current(data.value)
        }

        // 可能需要回复消息
        if (window.ReactNativeWebView && data.requireResponse) {
          window.ReactNativeWebView?.postMessage(JSON.stringify(JSON.stringify({ success: true, action: data.action })))
        }
      }
    } catch (error) {
      // 记录错误并可能发送到React Native
      console.error('处理消息时出错:', error)
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView?.postMessage(JSON.stringify(JSON.stringify({ error: true, message: (error as Error).message })))
      }
    }
  }, []) // 空依赖数组，因为我们使用refs访问最新值

  useEffect(() => {
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
  }, [messageHandler]) // 只依赖稳定的messageHandler

  return <Children status={status} ref={ref} file={file} injectUpload={injectUpload} KYC_FACE={KYC_FACE} /> // 使用设备上传功能
  // return <Children status={status} ref={ref} file={file} />  // 使用网页上传功能
}
