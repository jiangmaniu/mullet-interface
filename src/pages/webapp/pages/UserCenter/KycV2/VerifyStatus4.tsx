import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { useIntl, useModel } from '@umijs/max'

type FormData = {
  areaCode: string
  country: string
  firstName: string
  lastName: string
  identificationCode: string
  identificationType: string
}

export default function VerifyStatus4() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()
  const { t, locale } = i18n

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const intl = useIntl()

  const country = intl.locale === 'zh-TW' ? currentUser?.countryInfo?.nameCn : currentUser?.countryInfo?.nameEn
  return (
    <>
      <View className={cn('px-2 flex-1')}>
        <View className="flex-1 flex flex-col gap-[35px] items-start">
          <View className="flex flex-col gap-2.5 items-start">
            <Text size="lg" weight="bold">
              {intl.locale === 'zh-TW'
                ? `${currentUser?.lastName || 'lastName'}${currentUser?.firstName || 'firstName'}`
                : `${currentUser?.firstName || 'firstName'} ${currentUser?.lastName || 'lastName'}`}
            </Text>
            <Text size="sm" color="secondary" className=" text-gray-500">
              {t('pages.login.Residence Country')}: {country || 'country'}
            </Text>
          </View>
          <View className="flex flex-col gap-2.5 items-start">
            <Text size="sm" color="secondary" className=" text-gray-500">
              {t('pages.userCenter.zhengjianleixing')}
            </Text>
            <Text size="base" weight="medium" className=" text-gray-500">
              {currentUser?.identificationType === 'ID_CARD'
                ? t('pages.userCenter.shenfenzheng')
                : t('pages.userCenter.hukoubenjuzhuzheng')}
            </Text>
          </View>

          <View className="flex flex-col gap-2.5 items-start">
            <Text size="sm" color="secondary" className=" text-gray-500">
              {t('pages.userCenter.zhengjianhao')}
            </Text>
            <Text size="base" weight="medium" className=" text-gray-500">
              {currentUser?.identificationCode || 'identificationCode'}
            </Text>
          </View>
        </View>
      </View>
    </>
  )
}
