import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { useModel } from '@umijs/max'

type FormData = {
  areaCode: string
  country: string
  firstName: string
  lastName: string
  identificationCode: string
  identificationType: string
}

const VerifyStatus3 = () => {
  const { cn } = useTheme()
  const i18n = useI18n()
  const { t } = i18n

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const remark = kycAuthInfo?.remark

  return (
    <>
      <View className={cn('mt-[80px] px-2 flex-1')}>
        <View className="flex-1 flex flex-col gap-[35px] items-center">
          <img src={'/img/webapp/kyc-shenheshibai.png'} alt="kyc_status3" style={{ width: '176px', height: '176px' }} />
          <View className="flex flex-col gap-2.5 items-center">
            <Text size="lg" weight="bold">
              {t('mt.shenheshibai')}
            </Text>
            <Text size="sm" color="secondary">
              {remark ? remark : t('mt.nintijiaodeziliaobuquanqieyoucuowu')}
            </Text>
          </View>
        </View>

        {/* <Button type="danger" disabled={false} className="mb-2.5 mt-40 w-full" height={48} onClick={handleSubmit(onSubmit)}>
          {t('pages.userCenter.chongxinrenzheng')}
        </Button> */}
      </View>
    </>
  )
}

export default VerifyStatus3
