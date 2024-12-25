import { useLoading } from '@/context/loadingProvider'
import { useTheme } from '@/context/themeProvider'
import { message } from '@/utils/message'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
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
  const [files, setFiles] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [file, setFile] = useState<any>({})

  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { showLoading, hideLoading } = useLoading()

  // 选择照片
  const handlerSelectLibrary = async () => {
    // const result: ImagePickerResponse = await launchImageLibrary({
    //   mediaType: 'photo',
    //   includeExtra: true,
    //   ...(multiple && { selectionLimit: count - files.length }) // selectionLimit：0 默认多选 photos
    // })
    // console.log('result', result)
    // onUploadImage(result)
  }

  // 点击拍照
  const handleMakePhoto = async () => {
    // console.log('handleMakePhoto')
    // const result: ImagePickerResponse = await launchCamera({
    //   mediaType: 'photo',
    //   cameraType: 'back',
    //   quality: 0.8,
    //   maxWidth: 500,
    //   maxHeight: 500,
    //   includeExtra: true
    // })
    // if (result.errorCode) {
    //   if (result.errorCode === 'camera_unavailable') {
    //     message.info(i18n.t('common.operate.cameraUnavailable'))
    //   }
    //   return
    // }
    // console.log('result', result.errorCode)
    // onUploadImage(result)
  }

  const requestCameraPermission = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     // console.log('Camera permission given')
    //     handleMakePhoto()
    //   } else {
    //     // toast.info('如需使用，可以前往系统设置开启权限')
    //     message.info(i18n.t('pages.userCenter.cameraPermissionTips'))
    //     // console.log('Camera permission denied')
    //   }
    // } catch (err) {
    //   console.warn(err)
    // }
  }

  const onUploadImage = async (result: any) => {
    //  ImagePickerResponse) => {
    const assets = result.assets
    console.log(assets, '-----8')
    if (assets) {
      showLoading({ backgroundColor: 'transparent', color: theme.colors.textColor.weak })
      const imgInfo: any = assets[0] || {}
      if (imgInfo.fileSize / 1024 / 1024 >= 1) {
        message.info(i18n.t('pages.userCenter.uploadImageTips'))
        hideLoading()
        return
      }
      setFiles([...files, ...assets])
      // const uploadPromises = assets.map((asset) => {
      //   return new Promise((resolve, reject) => {
      //     let source
      //     if (Platform.OS === 'android') {
      //       source = asset.uri
      //     } else {
      //       source = asset.uri?.replace('file://', '')
      //     }
      //     const formData = new FormData()

      //     formData.append('file', {
      //       uri: source,
      //       type: asset.type,
      //       name: asset.fileName
      //     })
      //     fileUpload(formData)
      //       .then((res) => {
      //         if (res.success && res.data) {
      //           onChange(res.data)
      //           bottomSheetModalRef.current?.sheet?.dismiss()
      //           return
      //         }

      //         message.info(res.msg || i18n.t('msg.error.Upload Failed'))
      //       })
      //       .catch((err) => {
      //         console.log('err', err)
      //         message.fail(err?.Message || i18n.t('msg.error.Upload Failed'))
      //       })
      //       .finally(() => {
      //         hideLoading()
      //       })
      //   })
      // })

      // let toastKey: any = message.info(i18n.t('msg.Loading'))
      // const uploadResults = await Promise.all(uploadPromises)
      //   .catch((err) => {
      //     // 清空已选图片
      //     setFiles([])
      //     setFile({})
      //     message.info(err?.Message || i18n.t('msg.error.Upload Failed'))
      //     throw err
      //   })
      //   .finally(() => {
      //     Portal.remove(toastKey)
      //   })
      // if (uploadResults?.length) {
      //   uploadResults.map((v: any) => {
      //     const updateIdx = assets.findIndex((item) => item.fileName === v.fileName)
      //     if (updateIdx !== -1) {
      //       assets[updateIdx].uri = v.url || assets[updateIdx].uri
      //     }
      //   })
      //   setFiles([...files, ...assets])
      // }
    }
  }

  const bottomSheetModalRef = useRef<SheetRef>(null)

  const handlerMakePhoto = async () => {
    // if (Platform.OS === 'android') {
    //   await requestCameraPermission()
    // } else {
    //   handleMakePhoto()
    // }
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={300}
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
            onPress={() => handlerMakePhoto()}
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
            onPress={() => handlerSelectLibrary()}
          />
        </View>
      }
    />
  )
}

export default forwardRef(UploadSheetModal)
