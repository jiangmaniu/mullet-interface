// import './index.less'

import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import type { UploadProps } from 'antd'
import { Image, Upload } from 'antd'
import { useState } from 'react'

import { getEnv } from '@/env'
import { message } from '@/utils/message'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'

const { Dragger } = Upload

type IProps = {
  setImgs: (imgs: string[]) => void
  imgs: string[]
}

export default function ({ setImgs, imgs }: IProps) {
  const [fileName, setFileName] = useState('') // 文件名路径
  const [url, setUrl] = useState('') // 完整地址
  const intl = useIntl()

  const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
  const token = STORAGE_GET_TOKEN() || ''

  // TODO: 上传图片 可能要适配 rn 端
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: '/api/blade-resource/oss/endpoint/put-file',
    headers: {
      'Blade-Auth': `${userInfo?.token_type || 'Bearer'} ${token}`
    },
    accept: 'image/png, image/jpeg, image/jpg',
    // beforeUpload: (file) => {
    //   const isLt1MB = file.size / 1024 / 1024 <= 1
    //   if (!isLt1MB) {
    //     message.info(`${intl.formatMessage({ id: 'mt.kycUploadImgSizeTips' }, { size: 1 })}MB`)
    //   }
    //   return isLt1MB
    // },
    onChange(info) {
      console.log('info', info)
      const data = info?.file?.response?.data || {}
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        console.log('data', data)
        // message.success(`${info.file.name} file uploaded successfully.`)
        setFileName(data.name)
        setUrl(data.link)

        setImgs([...imgs.slice(-2), data.name])
      } else if (status === 'error') {
        message.info(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }
  return (
    <>
      <Dragger {...props}>
        {url ? (
          <div className="flex items-center justify-center flex-1">
            <img src={url} width={347} height={235} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center bg-cover w-[347px] h-[235px]">
              <img src="/img/upload-01.png" width={72} height={72} />
              <span className="text-primary text-sm font-semibold">
                <FormattedMessage id="mt.dianjishangchuantupian" />
              </span>
            </div>
          </div>
        )}
      </Dragger>
      <div className="flex flex-row gap-[14px] mt-[15px]">
        {imgs.map((img, index) => (
          <div className="w-[86px] h-[86px] bg-gray-120 rounded-lg relative img-preview" key={index}>
            <Image src={`${getEnv().imgDomain}${img}`} width={86} height={86} />
            <img
              onClick={() => {
                setImgs(imgs.filter((_, i) => i !== index))
              }}
              src="/img/shanchu.png"
              className="absolute -top-2.5 -right-2.5 bg-secondary h-[24px] w-[24px] rounded-full cursor-pointer guanbi"
            />
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
