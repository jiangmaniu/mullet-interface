import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import ENV from '@/env'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'

const Account = () => {
  const { t } = useI18n()
  const { cn, theme } = useTheme()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  return (
    <View onPress={() => navigateTo('/app/account/select', { back: true })}>
      <View style={cn('flex flex-row justify-between items-center w-full mt-6 mb-5')}>
        {/* 展示 currentUser.userInfo 的 avatar & account & role_name */}
        <View style={cn('flex flex-row items-center gap-[10px]')}>
          {currentUser?.userInfo?.avatar ? (
            <img
              src={currentUser?.userInfo?.avatar}
              style={{ width: 54, height: 54, backgroundColor: theme.colors.backgroundColor.primary, borderRadius: 100 }}
            />
          ) : (
            <img
              src={ENV.webapp.smallLogo}
              style={{ width: 54, height: 54, backgroundColor: theme.colors.backgroundColor.primary, borderRadius: 100 }}
            />
          )}
          <View style={cn('flex flex-col')}>
            <View style={cn('flex flex-row items-center')}>
              <Text size="lg" style={cn('font-semibold')}>
                {currentUser?.userInfo?.account}
              </Text>
              <View style={cn(' mx-2 px-1 py-[2px] rounded', currentUser?.isKycAuth ? 'bg-green-100' : 'bg-red-100')}>
                <Text style={cn('text-xs ', currentUser?.isKycAuth ? 'text-green' : 'text-red')}>
                  {currentUser?.isKycAuth ? t('pages.userCenter.yirenzheng') : t('pages.userCenter.weirenzheng')}
                </Text>
              </View>
            </View>
            {/* @ts-ignore */}
            <Text>{currentUser?.client_id}</Text>
          </View>
        </View>
        <Iconfont name="danchuang-gengduo" size={30} color={theme.colors.textColor.weak} />
      </View>
    </View>
  )
}

export default observer(Account)
