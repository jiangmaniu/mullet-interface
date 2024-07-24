import { LoadingOutlined } from '@ant-design/icons'
import { GetProp, message, Upload, UploadProps } from 'antd'
import { useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback?: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback?.(reader.result as string))
  reader.readAsDataURL(img)
}

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
export const AvatarUpload = () => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <Iconfont name="shangchuan" width={42} height={42} color="#7b7b7b" />}
    </button>
  )

  return (
    <Upload listType="picture-card" showUploadList={false} beforeUpload={beforeUpload} onChange={handleChange}>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center bg-[url(/img/logo-only.png)] bg-cover w-[112px] h-[113px] rounded-xl bg-gray-120 border border-gray-340">
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </div>
      </div>
    </Upload>
  )
}
