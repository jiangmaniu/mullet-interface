import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'
import UploadSheetModal, { UploadSheetModalRef } from '@/pages/webapp/components/Account/UploadSheetModal'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { submitSeniorAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation } from '@umijs/max'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
export default function VerifyDoc({ onSuccess }: { onSuccess: () => void }) {
  const { cn, theme } = useTheme()
  const i18n = useI18n()

  const location = useLocation()
  // 获取 URL 中的查询参数（searchParams）
  const params = new URLSearchParams(location.search)

  const [file, setFile] = useState<any>({})

  const uploadSheetModalRef = useRef<UploadSheetModalRef>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = () => {
    setSubmitting(true)
    submitSeniorAuth({
      authImgsUrl: file.name
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
    <BasicLayout
      bgColor="primary"
      style={{ paddingLeft: 14, paddingRight: 14 }}
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      footer={
        <Button
          type="primary"
          loading={submitting}
          height={48}
          className={cn('mb-2.5 w-full')}
          onPress={handleSubmit(onSubmit)}
          disabled={!file?.link}
        >
          {i18n.t('common.operate.Submit')}
        </Button>
      }
      headerStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
      header={<Header title={i18n.t('pages.userCenter.gaojirenzheng')} />}
      fixedHeight
    >
      <View className={cn('mt-9 px-2 flex flex-col gap-2')}>
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
              className={cn(' border border-dashed border-[#6A7073] bg-gray-50 rounded-lg overflow-hidden px-[27px] py-[37px]')}
            >
              <View
                style={{
                  width: '100%',
                  height: 114,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundSize: 'cover',
                  backgroundImage: `url('/img/webapp/uploadImg.png')`
                }}
              >
                <Text style={{ fontWeight: '500', color: theme.colors.textColor.primary }}>
                  {i18n.t('pages.userCenter.clickUploadIDCard')}
                </Text>
              </View>
            </View>
          )}
        </View>

        <UploadSheetModal ref={uploadSheetModalRef} onChange={onChange} />
      </View>
    </BasicLayout>
  )
}
