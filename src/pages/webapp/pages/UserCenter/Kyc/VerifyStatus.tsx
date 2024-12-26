import Iconfont from '@/components/Base/Iconfont'
import { useEnv } from '@/context/envProvider'
import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { onBack } from '@/utils/navigator'
import { useLocation } from '@umijs/max'
import { useEffect } from 'react'

export default function VerifyStatus() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()

  const { screenSize } = useEnv()

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const back = params?.get('back')

  /** 拦截系统返回操作 */
  const gobackHandler = () => {
    if (back === 'UserCenter') {
      navigateTo('/app/user-center')
      // navigateTo('Main', { screen: 'UserCenter' })
    } else {
      onBack()
    }
    return true
  }

  useEffect(() => {
    window.addEventListener('popstate', gobackHandler)
    return () => window.removeEventListener('popstate', gobackHandler)
  }, [])

  return (
    <BasicLayout bgColor="secondary" style={{ paddingLeft: 14, paddingRight: 14 }}>
      <Header
        title={i18n.t('pages.userCenter.shenhezhong')}
        back={false}
        left={
          <View onPress={gobackHandler}>
            <Iconfont name="fanhui" size={36} />
          </View>
        }
      />
      <View
        className={cn('mt-6 px-2 flex items-center justify-center')}
        style={{
          height: screenSize.height
        }}
      >
        <View className={cn('flex items-center justify-center flex-col gap-2.5 w-[300px] ')}>
          <View className={cn('bg-yellow-500 w-[120px] h-[120px] flex items-center justify-center rounded-[30px]')}>
            <Iconfont name="gaizhang" size={100} color={theme.colors.textColor.reverse} />
          </View>
          <Text className={cn('text-xl text-primary font-medium text-center')}>
            {i18n.t('pages.userCenter.shenfenrenzhengshenhezhong')}
          </Text>
          <Text className={cn('text-sm text-gray-500 text-center')}>
            {i18n.t('pages.userCenter.shenfenrenzhengshenhezhongnaixindengdai')}
            {i18n.t('pages.userCenter.fangxinguanbi')}
          </Text>
        </View>
      </View>
    </BasicLayout>
  )
}
