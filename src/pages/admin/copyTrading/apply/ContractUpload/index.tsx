import { LoadingOutlined } from '@ant-design/icons'
import { FormattedMessage, getIntl } from '@umijs/max'
import { useHover } from 'ahooks'
import { GetProp, message, Upload, UploadFile, UploadProps } from 'antd'
import { useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { upload } from '@/components/Base/IconUpload/upload'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Image must smaller than 10MB!')
  }
  return isJpgOrPng && isLt10M
}
export default ({ onChange, maxCount = 3 }: { onChange: (p: any) => void; maxCount?: number }) => {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  // const handleChange: UploadProps['onChange'] = (info) => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true)
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     uploadAction(info.file.originFileObj as File)
  //   }
  // }

  const handleChange: UploadProps['onChange'] = async (info) => {
    let newFileList = [...info.fileList]
    newFileList = newFileList.slice(-maxCount)

    const uploadActions = newFileList.map(async (file) => {
      if (file.status === 'uploading') {
        // file.url = file.response.url
        const res = await uploadAction(info.file.originFileObj as File)
        if (res.status === 'done') {
          file.url = res.url
          file.thumbUrl = res.thumbUrl
          file.status = 'done'
        }
      }
      return file
    })

    newFileList = await Promise.all(uploadActions)
    // 保留上傳成功的文件
    newFileList = newFileList.filter((file) => file.status === 'done')

    setFileList(newFileList)
    onChange?.(newFileList)
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
  const uploadAction = async (file: File): Promise<UploadFile> => {
    try {
      //   // 调用上传接口
      const res: any = await upload({ file })

      if (res && res.data) {
        return {
          uid: String(Math.random()),
          name: res.data.originalName,
          status: 'done',
          url: res.data.link,
          thumbUrl: res.data.link
        }
      }
      message.info(getIntl().formatMessage({ id: 'common.shangchuanshibai' }))

      return {
        uid: String(Math.random()),
        name: '',
        status: 'error',
        url: ''
      }
    } catch (error: any) {
      message.info(error?.message)

      return {
        uid: String(Math.random()),
        name: '',
        status: 'error',
        url: ''
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Upload listType="picture" fileList={fileList} maxCount={maxCount} beforeUpload={beforeUpload} onChange={handleChange}>
      <div className="flex items-center justify-center w-[532px] max-w-full cursor-pointer ">
        <div className="flex flex-col items-center gap-2 justify-center  bg-cover w-full h-[114px] rounded-xl bg-white border border-gray-250 border-dashed hover:bg-gray-600 hover:bg-opacity-10">
          <Iconfont name="geren-chujin" width={32} height={32} color="#030000" />
          <FormattedMessage id="mt.shangchuantupianhuotuozhuaifangru" />
        </div>
      </div>
    </Upload>
  )
}
