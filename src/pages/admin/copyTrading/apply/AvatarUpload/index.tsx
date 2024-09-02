import { LoadingOutlined } from '@ant-design/icons'
import { getIntl } from '@umijs/max'
import { useHover } from 'ahooks'
import { GetProp, message, Upload, UploadProps } from 'antd'
import classNames from 'classnames'
import { useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { upload } from '@/components/Base/IconUpload/upload'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}
export const AvatarUpload = ({
  defaultImageUrl,
  onChange,
  width = 112,
  height = 113
}: {
  defaultImageUrl?: string
  onChange: (p: any) => void
  width?: number
  height?: number
}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl || '')
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      uploadAction(info.file.originFileObj as File)
    }
  }

  const hoverRef = useRef(null)
  const isHovering = useHover(hoverRef)

  const uploadButton = (
    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      {loading && <LoadingOutlined />}
      {isHovering && <Iconfont name="shangchuan" style={{ zIndex: 100 }} width={42} height={42} color="#7b7b7b" />}
    </div>
  )

  // 处理上传到服务器
  const uploadAction = async (file: File): Promise<void> => {
    try {
      //   // 调用上传接口
      const res: any = await upload({ file })

      if (res && res.data) {
        setImageUrl(res.data.link)
        onChange?.(res.data)
      } else {
        message.info(getIntl().formatMessage({ id: 'common.shangchuanshibai' }))
      }
    } catch (error: any) {
      message.info(error?.message)

      // setFileUrl('')
      // setFileName('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Upload showUploadList={false} beforeUpload={beforeUpload} onChange={handleChange}>
      <div className="flex relative items-center justify-center cursor-pointer" ref={hoverRef}>
        <div
          className={classNames(
            'flex items-center justify-center bg-[url(/img/logo-only.png)] bg-cover rounded-xl bg-gray-120 border border-gray-340 overflow-hidden',
            isHovering && ' bg-gray-600 bg-opacity-10'
          )}
          style={{
            width,
            height
          }}
        >
          {imageUrl && <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />}
          {uploadButton}
        </div>
      </div>
    </Upload>
  )
}
