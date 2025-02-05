import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import { FormInstance, Modal } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { cn } from '@/utils/cn'
import { message } from '@/utils/message'

import { getEnv } from '@/env'
import { upload } from './upload'

interface IProps {
  value?: string
  /**文件大小限制 */
  fileSize?: number
  /**上传提示信息 */
  helpTips?: string
  showHelp?: boolean
  /**图片宽度 */
  width?: number
  /**图片高度 */
  height?: number
  /**类名 */
  className?: string
  /**支持图片类型 */
  accept?: string
  /**操作按钮 */
  showAction?: boolean
  style?: React.CSSProperties
  /**表单的name字段 */
  name?: string
  /**表单实例 */
  form?: FormInstance | null
  onSuccess?: (data: { fileName: string; url: string }) => void
  /**内容区样式 */
  contentStyle?: React.CSSProperties
  /**形状 */
  shape?: 'circle' | 'square'
  helpTitle?: React.ReactNode
}

/**
 * 单文件图标上传，多个请用antd upload
 * @param param0
 * @returns
 */

export default forwardRef(
  (
    {
      value = '',
      fileSize = 0.3,
      helpTips,
      showHelp = true,
      width = 125,
      height = 125,
      className,
      accept = 'image/png, image/jpeg, image/jpg, image/gif,image/svg+xml,image/webp',
      form,
      name,
      onSuccess,
      showAction = false,
      contentStyle,
      helpTitle,
      shape = 'circle'
    }: IProps,
    ref: any
  ) => {
    const [fileUrl, setFileUrl] = useState<any>('') // 完整图片地址
    const [fileName, setFileName] = useState<any>('') // 图片名称
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImageUrl, setPreviewImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorTip, setErrorTip] = useState('')
    const intl = useIntl()
    const ENV = getEnv()

    // 图片展示域名
    const imgDomain = ENV.imgDomain

    useEffect(() => {
      if (value) {
        setFileUrl(`${imgDomain}${value}`)
        setFileName(fileName)
      }
    }, [value])

    useImperativeHandle(ref, () => {
      return {
        errorTip,
        fileUrl,
        fileName,
        checkField: () => {
          if (fileUrl) return ''
          if (errorTip) return errorTip
          if (!fileUrl) {
            setErrorTip(intl.formatMessage({ id: 'common.qingshangchuantupian' }))
            return intl.formatMessage({ id: 'common.qingshangchuantupian' })
          }
        }
      }
    })

    // 选择上传文件
    const handleChoose = () => {
      let fileCancle = true
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = accept
      fileInput.multiple = false

      window.addEventListener(
        'focus',
        () => {
          setTimeout(() => {
            if (fileCancle) {
              console.log('cancle')
            }
          }, 400)
        },
        { once: true }
      )

      fileInput.onchange = (e) => {
        // @ts-ignore
        const files = e.target?.files
        if (files) {
          uploadAction(Array.from(files))
        }
      }

      fileInput.onerror = (e) => {
        console.log('fileInput onerror', e)
      }

      // 触发点击事件
      fileInput.click()
    }

    // 上传前校验
    const handleBeforeUpload = async (file: File) => {
      const isLt = file.size / 1024 / 1024 < fileSize
      if (!isImg(file)) {
        return Promise.resolve(intl.formatMessage({ id: 'mt.uploadFileTypeTips' }))
      }

      if (!isLt && fileSize) {
        form?.validateFields([name])
        return Promise.resolve(intl.formatMessage({ id: 'mt.wenjiandaxiaobunengchaoguo' }, { limit: fileSize }))
      }

      return Promise.resolve(file)
    }

    // 处理上传到服务器
    const uploadAction = async (files: File[]): Promise<void> => {
      const file = files[0]
      try {
        // @ts-ignore
        const beforeRes = await handleBeforeUpload(file).catch((e) => e)
        if (typeof beforeRes === 'string') {
          // message.info(beforeRes)
          setErrorTip(beforeRes)
          return
        }

        setErrorTip('')
        setLoading(true)
        setFileUrl(getFileURL(file))

        // 调用上传接口
        const res = await upload({ file })

        // @ts-ignore
        if (res?.data) {
          // @ts-ignore
          const fileName = res?.data?.name
          const url = `${imgDomain}${fileName}`
          setFileUrl(url)
          setFileName(fileName)
          form?.setFieldValue?.(name, fileName)
          onSuccess?.({ fileName, url })
        } else {
          message.info(intl.formatMessage({ id: 'common.shangchuanshibai' }))
        }
      } catch (error: any) {
        message.info(error?.message)
        setFileUrl('')
        setFileName('')
      } finally {
        setLoading(false)
      }
    }

    const getFileURL = (file: File): string | null => {
      let url = null
      if (window.URL) {
        url = window.URL.createObjectURL(file)
      }
      return url
    }

    const handleDelete = () => {
      setFileUrl('')
    }

    const handlePreview = () => {
      setPreviewImageUrl(fileUrl)
      setPreviewOpen(true)
    }

    const isImg = (file: File): boolean => {
      const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml']
      return acceptedImageTypes.includes(file.type)
    }

    const borderRadius = shape === 'circle' ? '50%' : 12

    const uploadClassName = useEmotionCss(({ token }) => {
      return {
        '.img-item:hover .op': {
          visibility: 'visible'
        },
        '.img-item': {
          width,
          height,
          position: 'relative',
          cursor: 'pointer',
          background: '#f5f5f5',
          borderRadius,
          '&:after': {
            width: 52,
            height: 52,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(/img/${fileUrl ? '' : 'no-upload'}.png)`,
            content: "''",
            zIndex: 12,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          },
          '&:hover::after':
            (showAction && fileUrl) || loading
              ? undefined
              : {
                  backgroundImage: 'url(/img/upload.png)'
                },
          '&:hover::before': loading
            ? undefined
            : {
                background: 'rgba(0,0,0,0.4)',
                content: "''",
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                borderRadius
              },
          '.loading': {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            fontSize: 14,
            borderRadius
          }
        }
      }
    })

    return (
      <div className={cn('image-upload-container', className, uploadClassName)}>
        <div className={cn('flex items-center justify-center flex-col')} style={contentStyle}>
          <div
            className="img-item"
            onClick={() => {
              if (showAction || loading) return
              handleChoose()
            }}
          >
            {fileUrl && <img className="w-full h-full rounded-full" src={fileUrl} style={{ width, height }} />}
            {!fileUrl && <div className="w-full h-full rounded-full" style={{ width, height }} />}
            {loading && (
              <div className="loading">
                <FormattedMessage id="common.shangchuanzhong" />
                ...
              </div>
            )}
            {showAction && !loading && (
              <div className="absolute left-0 top-0 bottom-0 right-0 items-center justify-center brounded-full z-[100] invisible flex op">
                <span className="text-xs text-white" onClick={handlePreview}>
                  <FormattedMessage id="common.yulan" />
                </span>
                <span className="text-xs text-white pl-3" onClick={handleDelete}>
                  <FormattedMessage id="common.shanchu" />
                </span>
              </div>
            )}
          </div>

          {errorTip && <div className="text-red text-xs pt-3">{errorTip}</div>}

          {showHelp && (
            <div>
              {helpTitle}
              <div className="text-xs text-secondary leading-5 pt-3" style={{ maxWidth: width }}>
                {helpTips || <FormattedMessage id="mt.uploadHelpTips" />}
              </div>
            </div>
          )}
        </div>

        {helpTips && <div className="text-xs text-secondary">{helpTips}</div>}

        <Modal centered open={previewOpen} maskClosable onCancel={() => setPreviewOpen(false)} footer={null}>
          <img src={previewImageUrl} className="w-full h-full" />
        </Modal>
      </div>
    )
  }
)
