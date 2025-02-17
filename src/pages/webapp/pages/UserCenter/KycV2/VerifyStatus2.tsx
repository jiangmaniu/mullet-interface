import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const VerifyStatus2 = () => {
  const { cn } = useTheme()
  const i18n = useI18n()
  const { t } = i18n

  const schema = z.object({})

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<{ name: string }>({
    defaultValues: {},
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <>
      {/* <View className={cn('flex-1 flex flex-col justify-between')}> */}
      <View className="flex-1 flex flex-col gap-[35px] items-center mt-[80px] px-2 ">
        <img src={'/img/webapp/kyc-shenhezhong.png'} alt="kyc_status2" style={{ width: '176px', height: '176px' }} />
        <View className="flex flex-col gap-2.5 items-center">
          <Text size="lg" weight="bold">
            {t('mt.shenfenrenzhengshenhezhong')}
          </Text>
          <Text size="sm" color="secondary">
            {t('mt.shenfenrenzhengshenhezhongtips')}
          </Text>
        </View>
      </View>

      {/* <Button disabled={false} className="mb-2.5 mt-40 w-full  px-2 " height={48} onClick={handleSubmit(onSubmit)}>
        {t('common.operate.Confirm')}
      </Button> */}
      {/* </View> */}
    </>
  )
}

export default VerifyStatus2
