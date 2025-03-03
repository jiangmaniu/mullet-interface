import { useTheme } from '@/context/themeProvider'
import UploadSheetModal, { UploadSheetModalRef } from '@/pages/webapp/components/Account/UploadSheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { submitSeniorAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useModel } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const VerifyDoc = forwardRef(
  (
    {
      onSuccess,
      onDisabledChange,
      file: defaultFile,
      injectUpload
    }: { onSuccess: () => void; onDisabledChange: (disabled: boolean) => void; file?: any; injectUpload?: () => Promise<void> },
    ref: any
  ) => {
    const { cn, theme } = useTheme()
    const i18n = useI18n()

    const location = useLocation()
    // 获取 URL 中的查询参数（searchParams）
    const [file, setFile] = useState<any>(defaultFile)

    const uploadSheetModalRef = useRef<UploadSheetModalRef>(null)
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = () => {
      // message.info(i18n.t('common.operate.Op Success'))
      // onSuccess()
      setSubmitting(true)
      submitSeniorAuth({
        authImgsUrl: file?.name
      })
        .then(async (res) => {
          if (res.success) {
            message.info(i18n.t('common.operate.Op Success'))
            onSuccess()
            return
          }
        })
        .catch((err) => {
          message.info(err.message)
        })
        .finally(() => {
          setSubmitting(false)
        })
    }

    /** 表单控制 */
    const schema = z.object({
      name: z.string().min(1, { message: i18n.t('pages.userCenter.qingshangchuanzhengjian') })
    })

    const {
      handleSubmit,
      setValue,
      formState: { errors }
    } = useForm<{ name: string }>({
      defaultValues: {
        name: ''
      },
      mode: 'all',
      resolver: zodResolver(schema)
    })

    const onChange = (val: any) => {
      setFile(val)
      val?.name && setValue('name', val.name)
    }

    useEffect(() => {
      onChange(defaultFile)
    }, [defaultFile])

    useImperativeHandle(ref, () => ({
      onSubmit: handleSubmit(onSubmit)
    }))

    const { initialState } = useModel('@@initialState')
    const currentUser = initialState?.currentUser

    const disabled = !file?.link

    useEffect(() => {
      onDisabledChange(disabled)
    }, [disabled])

    const onUpload = async () => {
      injectUpload ? injectUpload() : uploadSheetModalRef.current?.show()
    }

    return (
      <View className={cn('px-2 flex flex-col gap-2 ')}>
        <Text className={cn('text-xl font-bold text-primary')} weight="bold">
          {i18n.t('pages.userCenter.pinzhengrenzheng')}
        </Text>
        <Text className={cn('text-xs text-weak')} color="weak">
          {i18n.t('pages.userCenter.shagnchuanzhaopianbixuqingxi')}
        </Text>
        <View className={cn('flex flex-col mt-3 gap-[11px] mb-[50px]')}>
          <View className={cn('flex flex-row gap-2')}>
            <Text size="base" weight="medium">
              {i18n.t('pages.userCenter.renzhengxingming')}:&nbsp;
              {i18n.locale === 'zh-TW'
                ? `${currentUser?.lastName || 'lastName'}${currentUser?.firstName || 'firstName'}`
                : `${currentUser?.firstName || 'firstName'} ${currentUser?.lastName || 'lastName'}`}
            </Text>
          </View>
          <Text className={cn('text-sm font-medium text-primary mt-2.5')} weight="medium">
            {i18n.t('pages.userCenter.shagnchuanzhengjian')}
          </Text>
          {file?.link ? (
            <View className="relative">
              <View onPress={onUpload} className={cn('border border-dashed border-[#6A7073] rounded-lg overflow-hidden ')}>
                <img src={file.link} style={{ width: '100%', height: 188 }} />
              </View>

              <div
                onClick={() => {
                  setFile({})
                }}
                className="absolute -top-2.5 -right-2.5 bg-secondary h-[24px] w-[24px] z-100 rounded-full cursor-pointer guanbi"
              >
                <img src="/img/shanchu.png" className="w-full h-full" />
              </div>
            </View>
          ) : (
            <View
              onPress={onUpload}
              className={cn(' border border-dashed border-[#6A7073]  rounded-lg overflow-hidden h-[188px] px-[27px] py-[37px]')}
            >
              <View className="flex flex-col items-center justify-start -mt-2  ">
                <img src="/img/idcard-bg2.png" width={100} height={100} />
                <Text style={{ fontWeight: '500', color: theme.colors.textColor.primary }} size="sm">
                  {i18n.t('pages.userCenter.clickUploadIDCard')}
                </Text>
              </View>
            </View>
          )}
        </View>

        <UploadSheetModal ref={uploadSheetModalRef} onChange={onChange} />
        {/* <View className={cn('grid grid-cols-2 gap-5 w-full mt-12')}>
        <Button type="primary" loading={submitting} height={48} className={cn(' flex-1 w-full')} onClick={onDeposit}>
          {i18n.t('pages.userCenter.qurujin')}
        </Button>
        <Button
          type="primary"
          loading={submitting}
          height={48}
          className={cn('w-full flex-1')}
          onClick={handleSubmit(onSubmit)}
          disabled={!file?.link}
        >
          {i18n.t('pages.userCenter.tijiaoshenhe')}
        </Button>
      </View> */}
      </View>
    )
  }
)

export default VerifyDoc
