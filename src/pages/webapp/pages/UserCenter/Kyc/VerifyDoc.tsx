import Button from '@/components/Base/Button'
import { useEnv } from '@/context/envProvider'
import { useTheme } from '@/context/themeProvider'
import UploadSheetModal, { UploadSheetModalRef } from '@/pages/webapp/components/Account/UploadSheetModal'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { submitKycAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModel, useParams } from '@umijs/max'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import StepBox from './comp/StepBox'
export default function VerifyDoc() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()
  const user = useModel('user')

  const { screenSize } = useEnv()

  const params = useParams()
  const country = params?.country
  const firstName = params?.firstName || ''
  const lastName = params?.lastName || ''
  const identificationCode = params?.identificationCode || ''
  const identificationType = params?.identificationType as API.IdentificationType

  const [file, setFile] = useState<any>({})

  const step = 2

  const uploadSheetModalRef = useRef<UploadSheetModalRef>(null)

  const onSubmit = () => {
    submitKycAuth({
      country,
      firstName,
      lastName,
      identificationCode,
      identificationType,
      authImgsUrl: file.name
    })
      .then(async (res) => {
        if (res.success) {
          message.info(i18n.t('common.operate.Op Success'))
          // 更新账户余额信息
          await user.fetchUserInfo(true)
          navigateTo('/app/user-center/verify-status', {
            back: '/app/user-center'
          })
          return
        }
      })
      .catch((err) => {
        message.info(err.message)
      })
  }

  /** 表单控制 */
  const schema = z.object({
    name: z.string().min(1, { message: i18n.t('pages.userCenter.qingshangchuanzhengjian') })
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
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
    val.name && setValue('name', val.name)
  }

  return (
    <BasicLayout bgColor="secondary" style={{ paddingLeft: 14, paddingRight: 14 }}>
      <Header title={i18n.t('pages.userCenter.pinzhengrenzheng')} />
      <StepBox step={step} />
      <View
        className={cn('mt-9 px-2')}
        style={{
          height: screenSize.height
        }}
      >
        <Text className={cn('text-xl font-bold text-primary')}>{i18n.t('pages.userCenter.pinzhengrenzheng')}</Text>
        <Text className={cn('text-xs text-weak')}>{i18n.t('pages.userCenter.shagnchuanzhaopianbixuqingxi')}</Text>
        <View className={cn('flex flex-col mt-8 gap-[11px]')}>
          <Text className={cn('text-sm font-medium text-primary')}>{i18n.t('pages.userCenter.shagnchuanzhengjian')}</Text>
          {file.link ? (
            <View
              onPress={async () => {
                uploadSheetModalRef.current?.show()
              }}
              className={cn(' border border-dashed border-[#6A7073] rounded-lg overflow-hidden ')}
            >
              <img src={file.link} style={{ width: '100%', height: 188 }} />
            </View>
          ) : (
            <View
              onPress={async () => {
                uploadSheetModalRef.current?.show()
              }}
              className={cn(' border border-dashed border-[#6A7073] rounded-lg overflow-hidden px-[27px] py-[37px]')}
            >
              <View
                style={{
                  width: '100%',
                  height: 114,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundImage: `url('public/images/uploadImg.png')`
                }}
              >
                <Text style={{ fontWeight: '500', color: theme.colors.textColor.primary }}>
                  {i18n.t('pages.userCenter.clickUploadIDCard')}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Button type="primary" loading={false} height={48} style={cn('mt-30')} onPress={handleSubmit(onSubmit)} disabled={!file?.link}>
          {i18n.t('common.operate.Submit')}
        </Button>
        <UploadSheetModal ref={uploadSheetModalRef} onChange={onChange} />
      </View>
    </BasicLayout>
  )
}
