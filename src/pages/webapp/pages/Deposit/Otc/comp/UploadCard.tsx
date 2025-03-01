// import './index.less'

import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import type { UploadProps } from 'antd'
import { Image, Upload } from 'antd'

import { getEnv } from '@/env'
import { message } from '@/utils/message'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import { useCallback, useEffect, useState } from 'react'
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
      if (window?.ReactNativeWebView) {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: 'takePhoto'
          })
        )
        return false
      }
      return true
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
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  const [times, setTimes] = useState(0)
  const messageHandler = useCallback(
    (e: any) => {
      try {
        const data = e?.data ? JSON.parse(e?.data) : undefined
        console.log('======data====', data)
        if (data?.action === 'upload' && data.times === times) {
          setTimes((prev) => prev + 1)
          onDone(data?.value)
          window.ReactNativeWebView?.postMessage(
            // 給 rn 端发送消息，停止接收照片
            JSON.stringify({
              type: 'stopReceivePhoto'
            })
          )
        }
      } catch (error) {
        // message.info(`监听消息错误: ${JSON.stringify(error)}`)
      }
    },
    [onDone]
  )

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
  }, [messageHandler])

  return (
    <>
      <Dragger {...props}>
        <div
          className="flex items-center justify-center"
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
          <div className="flex flex-col items-center justify-center bg-cover  h-[235px]">
            <img src="/img/upload-01.png" width={72} height={72} />
            <span className="text-primary text-sm font-semibold">
              <FormattedMessage id="mt.dianjicichujinxinshangchuan" />
            </span>
          </div>
        </div>
        {/* )} */}
      </Dragger>
      <div className="flex flex-row gap-[14px] mt-[15px]">
        {imgs.map((img, index) => (
          <div className="w-[86px] h-[86px] bg-gray-120 rounded-lg relative img-preview" key={index}>
            <Image src={`${getEnv().imgDomain}${img}`} width={86} height={86} />
            <div
              onClick={() => {
                setImgs(imgs.filter((_, i) => i !== index))
              }}
              className="absolute -top-2.5 -right-2.5 bg-secondary h-[24px] w-[24px] rounded-full cursor-pointer guanbi"
            >
              <img src="/img/shanchu.png" className="w-[24px] h-[24px]" />
            </div>
            {/* <Iconfont name="danchuang-guanbi" className="text-secondary" size={18} /> */}
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
