import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import ENV from '@/env'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useModel } from '@umijs/max'

function CertificationInformation() {
  const i18n = useI18n()
  const { t } = i18n
  const { theme, cn } = useTheme()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const auth = currentUser?.kycAuth?.[0] || ({} as KycAuth.ListItem)
  const userInfo = currentUser?.userInfo || ({} as User.ClientUserInfo)

  const registerWay = stores.global.registerWay
  const onSubmit = () => {
    if (registerWay === 'EMAIL') {
      navigateTo('/app/user-center/bind-phone')
    } else {
      navigateTo('/app/user-center/bind-email')
    }
  }

  return (
    <BasicLayout style={{ paddingLeft: 14, paddingRight: 14 }}>
      <Header title={i18n.t('pages.userCenter.Certified information')} />
      <View className={cn('px-3 pt-16')}>
        <View
          style={{
            height: 190,
            padding: '20px 27px',
            borderRadius: 8,
            margin: 'auto',
            width: '100%',
            backgroundColor: theme.colors.backgroundColor.secondary,
            position: 'relative'
          }}
        >
          <img src={ENV.webapp.grayLogo} style={{ width: 70, height: 80, position: 'absolute', bottom: 16, right: 23 }} />

          {/* <Text className={cn('text-xs top-1 right-1 absolute ')}>{NAMESPACE}</Text> */}
          <View className={cn('flex flex-col items-start justify-start gap-2.5 ')}>
            {/* 头像 姓名 国籍 */}
            <View className={cn('flex flex-row items-center justify-start')}>
              <View className={cn('flex flex-col items-start justify-center')}>
                <View className={cn('flex flex-row items-end justify-start gap-2')}>
                  <View>
                    <Text className={cn('text-lg font-bold text-start w-full')}>
                      {auth?.firstName ?? t('pages.userCenter.firstname')}&nbsp;·&nbsp;{auth?.lastName ?? t('pages.userCenter.lastname')}
                    </Text>
                  </View>
                  {!currentUser?.isKycAuth && (
                    <View>
                      <View
                        className={cn('px-1 mb-[1px] py-[2px] rounded', currentUser?.isKycAuth ? 'bg-green-100' : 'bg-red-100')}
                        onPress={() => {
                          navigateTo('/app/user-center/verify-status')
                        }}
                      >
                        <Text className={cn('text-xs ', currentUser?.isKycAuth ? 'text-green' : 'text-red')}>
                          {currentUser?.isKycAuth ? t('pages.userCenter.yirenzheng') : t('pages.userCenter.weirenzheng')}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <Text className={cn('text-sm text-start w-full text-gray-500')}>
                  {t('pages.login.Residence Country')}:&nbsp;{auth?.country ?? t('common.unset')}
                </Text>
              </View>
            </View>
            <View className={cn('flex flex-col items-start justify-start mt-4')}>
              <Text className={cn('text-sm font-semibold text-start w-full ')}>{t('pages.userCenter.zhengjianleixing')}</Text>
              <Text className={cn('text-xs text-start w-full text-gray-500')}>{auth?.identificationType ?? t('common.unset')}</Text>
            </View>

            <View className={cn('flex flex-col items-start justify-start')}>
              <Text className={cn('text-sm font-semibold text-start w-full ')}>{t('pages.userCenter.zhengjianhao')}</Text>
              <Text className={cn('text-xs text-start w-full text-gray-500')}>{auth?.identificationCode ?? t('common.unset')}</Text>
            </View>
          </View>

          <View className={cn('flex flex-col items-start justify-start mt-10 gap-5')}>
            <View className={cn('flex flex-col items-start justify-start')}>
              <Text className={cn('text-sm font-semibold text-start w-full ')}>{t('pages.userCenter.shoujihaoma')}</Text>
              <Text className={cn('text-xs text-start w-full text-gray-500')}>
                {userInfo?.phoneAreaCode ? `+${userInfo?.phoneAreaCode}` : ''}&nbsp;
                {userInfo?.phone ?? t('common.unset')}
              </Text>
            </View>
            <View className={cn('flex flex-col items-start justify-start')}>
              <Text className={cn('text-sm font-semibold text-start w-full ')}>{t('pages.userCenter.youxiang')}</Text>
              <Text className={cn('text-xs text-start w-full text-gray-500')}>{userInfo?.email ?? t('common.unset')}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* <View className={cn(' absolute bottom-10 left-[14px] right-[14px] flex flex-col gap-5')}>
        <Button type="primary" loading={false} height={48} onPress={onSubmit}>
          {registerWay === 'EMAIL'
            ? userInfo?.phone
              ? t('pages.userCenter.genggaishoujihaoma')
              : t('pages.userCenter.bangdingshouji')
            : userInfo?.email
              ? t('pages.userCenter.genggaishoujihaoma')
              : t('pages.userCenter.bangdingshouji')}
        </Button>
      </View> */}
    </BasicLayout>
  )
}

export default CertificationInformation
