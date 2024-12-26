import { useLoading } from '@/context/loadingProvider'
import { useTheme } from '@/context/themeProvider'
import { fileUpload } from '@/services/api/common'
import { message } from '@/utils/message'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useI18n } from '../../hooks/useI18n'
import ListItem from '../Base/List/ListItem'
import SheetModal, { SheetRef } from '../Base/SheetModal'
import { View } from '../Base/View'

interface IProps {
  onChange?: (p: any) => void // 监听图片变化
  count?: number // 限制最多能上传几张图片
  multiple?: boolean
  labelText?: string
}

export type UploadSheetModalRef = {
  show: () => void
  close: () => void
}

const UploadSheetModal = ({ onChange, multiple = false, count = 0 }: IProps, ref: ForwardedRef<UploadSheetModalRef>) => {
  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { showLoading, hideLoading } = useLoading()

  // 点击拍照
  const handleMakePhoto = async (event: any) => {
    const file = event.target.files[0]
    if (file) {
      onUploadImage(file)
    }
  }

  const handlePickupImage = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      onUploadImage(file)
    }
  }

  const onUploadImage = async (file: any) => {
    showLoading({ backgroundColor: 'transparent', color: theme.colors.textColor.weak })
    // if (file.size / 1024 / 1024 >= 1) {
    //   message.info(i18n.t('pages.userCenter.uploadImageTips'))
    //   hideLoading()
    //   return
    // }

    const formData = new FormData()
    formData.append('file', file)

    fileUpload(formData)
      .then((res) => {
        if (res.success && res.data) {
          onChange?.(res.data)
          bottomSheetModalRef.current?.sheet?.dismiss()
          return
        }

        message.info(res.msg || i18n.t('msg.error.Upload Failed'))
      })
      .catch((err) => {
        message.info(err?.Message || i18n.t('msg.error.Upload Failed'))
      })
      .finally(() => {
        hideLoading()
      })
  }

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const pickupInputRef = useRef<HTMLInputElement>(null)

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={200}
      hiddenFooter
      dragOnContent={false}
      children={
        <View className={cn('flex flex-col justify-between px-[22px] gap-2')}>
          <ListItem
            styles={{
              container: {
                borderWidth: 1,
                borderColor: theme.colors.borderColor.weak,
                borderRadius: 10
              }
            }}
            title={i18n.t('common.operate.takePhoto')}
            onPress={() => {
              cameraInputRef.current?.click()
            }}
          />
          <ListItem
            styles={{
              container: {
                borderWidth: 1,
                borderColor: theme.colors.borderColor.weak,
                borderRadius: 10
              }
            }}
            title={i18n.t('common.operate.selectPhoto')}
            onPress={() => {
              pickupInputRef.current?.click()
            }}
          />
          <input ref={cameraInputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={handleMakePhoto} />
          <input ref={pickupInputRef} className="hidden" type="file" id="fileInput" accept="image/*" onChange={handlePickupImage} />
        </View>
      }
    />
  )
}

export default forwardRef(UploadSheetModal)
