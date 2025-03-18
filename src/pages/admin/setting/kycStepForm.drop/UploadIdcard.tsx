import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import type { UploadProps } from 'antd'
import { Upload } from 'antd'
import { FormInstance } from 'antd/lib'
import { useState } from 'react'

import Button from '@/components/Base/Button'
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
    beforeUpload: (file) => {
      const isLt1MB = file.size / 1024 / 1024 <= 1
      if (!isLt1MB) {
        message.info(`${intl.formatMessage({ id: 'mt.kycUploadImgSizeTips' }, { size: 1 })}MB`)
      }
      return isLt1MB
    },
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
              <span className="text-primary text-sm font-semibold">
                <FormattedMessage id="mt.dianjishangchuantupian" />
              </span>
              <Button className="!h-[30px] px-5 text-sm mt-5 !rounded-[22px]" type="primary">
                <FormattedMessage id="common.shangchuan" />
              </Button>
            </div>
          </div>
        )}
      </Dragger>
      <div className="text-secondary text-xs mt-2">
        <FormattedMessage id="mt.kycUploadTips" />
      </div>
      {/* 隐藏表单项提交 */}
      <ProFormText name="authImgsUrl" hidden />
    </>
  )
}
