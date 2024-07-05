import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'
import { FormInstance } from 'antd/lib'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import { STORAGE_GET_USER_INFO } from '@/utils/storage'

const { Dragger } = Upload

type IProps = {
  form: FormInstance
}

export default function ({ form }: IProps) {
  const [fileName, setFileName] = useState('') // 文件名路径
  const [url, setUrl] = useState('') // 完整地址

  const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: '/api/blade-resource/oss/endpoint/put-file',
    headers: {
      'Blade-Auth': `${userInfo.token_type} ${userInfo.access_token}`
    },
    accept: 'image/png, image/jpeg, image/jpg, image/gif,image/svg+xml,image/webp',
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
        message.error(`${info.file.name} file upload failed.`)
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
          <div className="flex items-center justify-center">
            <img src={url} width={230} height={114} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="bg-[url(/img/idcard-bg.png)] bg-cover w-[230px] h-[114px] px-8 py-7">
              <span className="text-gray text-sm font-semibold">
                <FormattedMessage id="mt.dianjishangchuantupian" />
              </span>
              <Button className="!h-[30px] px-5 text-sm mt-5 !rounded-[22px]" type="primary">
                <FormattedMessage id="mt.shangchuan" />
              </Button>
            </div>
          </div>
        )}
      </Dragger>
      {/* 隐藏表单项提交 */}
      <ProFormText name="authImgsUrl" hidden />
    </>
  )
}
