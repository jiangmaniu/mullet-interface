import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import type { UploadProps } from 'antd'
import { Upload } from 'antd'
import { FormInstance } from 'antd/lib'
import { useState } from 'react'

import { message } from '@/utils/message'
import { STORAGE_GET_USER_INFO } from '@/utils/storage'

const { Dragger } = Upload

type IProps = {
  form: FormInstance
}

export default function ({ form }: IProps) {
  const [fileName, setFileName] = useState('') // 文件名路径
  const [url, setUrl] = useState('') // 完整地址
  const intl = useIntl()

  const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: '/api/blade-resource/oss/endpoint/put-file',
    headers: {
      'Blade-Auth': `${userInfo.token_type} ${userInfo.access_token}`
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
        // message.success(`${info.file.name} file uploaded successfully.`)
        setFileName(data.name)
        setUrl(data.link)
        form.setFieldValue('authImgsUrl', data.name)
      } else if (status === 'error') {
        message.info(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.info(intl.formatMessage({ id: 'mt.bunengdayuxxm' }, { size: 5 }))
      }
      // // 若返回 false 则停止上传
      // // beforeUpload 返回 false 时，阻止了发送请求，但还是会加到列表中去，如果要在列表中也忽略，返回 Upload.LIST_IGNORE
      return isLt5M || Upload.LIST_IGNORE
    }
  }
  return (
    <>
      <div className="relative">
        <Dragger {...props}>
          {url ? (
            <div className="flex items-center justify-center">
              <img src={url} width={488} height={236} />
            </div>
          ) : (
            <div className="flex items-center flex-col justify-center">
              <div className="flex flex-col items-center justify-center bg-cover w-[390px] h-[176px]">
                <img src="/img/upload-01.png" width={80} height={80} />
                <span className="text-primary text-sm font-semibold">
                  <FormattedMessage id="mt.dianjishangchuantupian" />
                </span>
              </div>
            </div>
          )}
        </Dragger>

        {url && (
          <div
            onClick={() => {
              setUrl('')
              setFileName('')
            }}
            className="absolute -top-2.5 -right-2.5 bg-secondary h-[24px] w-[24px] z-100 rounded-full cursor-pointer guanbi"
          >
            <img src="/img/shanchu.png" className="w-full h-full" />
          </div>
        )}
      </div>
      {/* <div className="text-secondary text-xs mt-2">
        <FormattedMessage id="mt.kycUploadTips" />
      </div> */}
      {/* 隐藏表单项提交 */}
      <ProFormText name="authImgsUrl" hidden />
    </>
  )
}
