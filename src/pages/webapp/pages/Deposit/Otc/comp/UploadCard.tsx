// import './index.less'

import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import type { UploadProps } from 'antd'
import { Image, Upload } from 'antd'

import { useEnv } from '@/context/envProvider'
import { useLoading } from '@/context/loadingProvider'
import { getEnv } from '@/env'
import { message } from '@/utils/message'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isAndroid, isIOS } from 'react-device-detect'

const { Dragger } = Upload

type IProps = {
  setImgs: (imgs: string[]) => void
  imgs: string[]
}

export default function ({ setImgs, imgs }: IProps) {
  // const [fileName, setFileName] = useState('') // 文件名路径
  // const [url, setUrl] = useState('') // 完整地址

  const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
  const token = STORAGE_GET_TOKEN() || ''

  const onDone = (data: any) => {
    const newImgs = [...imgs, data.name].slice(-3)
    setImgs(newImgs)
  }

  const { showLoading, hideLoading } = useLoading()

  // TODO: 上传图片 可能要适配 rn 端
  const props: UploadProps = {
    // 如果 rn 端在拍照，则禁止 瀏覽器上传功能
    disabled: imgs.length >= 3 || !!window?.ReactNativeWebView,
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: '/api/blade-resource/oss/endpoint/put-file',
    headers: {
      'Blade-Auth': `${userInfo?.token_type || 'Bearer'} ${token}`
    },
    accept: 'image/png, image/jpeg, image/jpg',

    beforeUpload: (file) => {
      console.log('beforeUpload', file)
      showLoading()
      // if (window?.ReactNativeWebView) {
      //   window.ReactNativeWebView?.postMessage(
      //     JSON.stringify({
      //       type: 'takePhoto'
      //     })
      //   )
      //   return false
      // }
      // return true
    },
    onChange(info) {
      console.log('info', info)
      const data = info?.file?.response?.data || {}
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        console.log('data', data)
        onDone(data)
      } else if (status === 'error') {
        console.log('error', info)
        message.info(`${info.file.name} file upload failed.`)
      }
      hideLoading()
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  const [times, setTimes] = useState(0)

  // Stabilize the messageHandler function by using useRef for mutable values
  const onDoneRef = useRef(onDone)
  const timesRef = useRef(times)

  // 当依赖项变化时更新引用
  useEffect(() => {
    onDoneRef.current = onDone
    timesRef.current = times
  }, [onDone, times])

  // 定义messageHandler，不添加依赖项因为它使用引用
  const messageHandler = useCallback(async (event: Event) => {
    try {
      // 使用守卫条件安全地解析消息数据
      // 将事件转换为any类型以安全访问data属性
      const eventData = (event as any)?.data
      if (!eventData) return

      let parsedData
      try {
        parsedData = JSON.parse(eventData)
      } catch (error) {
        // 如果第一次解析失败，可能不是JSON或已经被解析过
        parsedData = eventData
      }

      const data = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData

      // 只有在有有效数据且times匹配时才继续处理
      if (data && data.value && data.times === timesRef.current) {
        setTimes((prev) => prev + 1)
        onDoneRef.current(data.value)

        // 发送消息回React Native
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(JSON.stringify({ data, times: timesRef.current })))
        }
      }
    } catch (error) {
      // 如果需要，将错误发送回React Native
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(JSON.stringify(error)))
      }
      // 考虑正确记录错误而不是使用被注释掉的message
      console.error('处理消息时出错:', error)
    }
  }, []) // 这里没有依赖项，因为我们使用引用

  useEffect(() => {
    // 根据平台添加事件监听器
    if (isIOS) {
      window.addEventListener('message', messageHandler)
    } else if (isAndroid) {
      document.addEventListener('message', messageHandler)
    }

    // 清理函数
    return () => {
      if (isIOS) {
        window.removeEventListener('message', messageHandler)
      } else if (isAndroid) {
        document.removeEventListener('message', messageHandler)
      }
    }
  }, [messageHandler]) // 只有messageHandler作为依赖项，现在它是稳定的

  const { isMobileOrIpad } = useEnv()

  return (
    <>
      <Dragger
        {...props}
        style={{
          backgroundColor: 'white'
        }}
      >
        <div
          className="flex items-center justify-center "
          onClick={(e) => {
            // e.preventDefault()
            if (window?.ReactNativeWebView) {
              e.stopPropagation()
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                  type: 'takePhoto',
                  times
                })
              )
            }
          }}
        >
          <div className="flex flex-col items-center justify-center bg-cover  h-[200px]">
            <img src="/img/upload-01.png" width={72} height={72} />
            <span className="text-primary text-sm font-medium">
              <FormattedMessage id="mt.dianjicichujinxinshangchuan" />
            </span>
          </div>
        </div>
        {/* )} */}
      </Dragger>

      <span className="text-xs text-weak">
        <InfoCircleOutlined style={{ fontSize: 12, marginRight: 4 }} />
        <FormattedMessage id="mt.shangchuanzhaopianbuyaochaoguo" values={{ value: '5MB' }} />
      </span>
      <div className="flex flex-row gap-[14px] mt-[15px]">
        {imgs.map((img, index) => (
          <div className=" w-[102px] h-[102px] md:w-[86px] md:h-[86px] bg-gray-120 relative img-preview" key={index}>
            <div className="w-full h-full overflow-hidden rounded-lg">
              <Image src={`${getEnv().imgDomain}${img}`} width={isMobileOrIpad ? 102 : 86} height={isMobileOrIpad ? 102 : 86} />
            </div>
            <div
              onClick={() => {
                setImgs(imgs.filter((_, i) => i !== index))
              }}
              className="absolute -top-2.5 -right-2.5 bg-secondary h-[24px] w-[24px] rounded-full cursor-pointer guanbi z-10"
            >
              <img src="/img/shanchu.png" className="w-[24px] h-[24px]" />
            </div>
          </div>
        ))}
      </div>
      {/* <div className="text-secondary text-xs mt-2">
        <FormattedMessage id="mt.kycUploadTips" />
      </div> */}
      {/* 隐藏表单项提交 */}
      <ProFormText name="authImgsUrl" hidden />
    </>
  )
}
