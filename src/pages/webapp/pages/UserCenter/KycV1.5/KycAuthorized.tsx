import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { cn } from '@/utils/cn'
import { onBack } from '@/utils/navigator'
import KycMockSheetModal from './KycMockSheetModal'

export default function KycAuthorized() {
  const i18n = useI18n()
  const { theme } = useTheme()

  return (
    <BasicLayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary} style={{ overflow: 'hidden' }}>
      <Header
        title={i18n.t('app.pageTitle.Kyc Authorized')}
        onBack={() => onBack()}
        // left={
        //   <View onPress={goBack}>
        //     <Iconfont name="fanhui" size={36} />
        //   </View>
        // }
      />
      <View className={cn('flex items-center justify-center pt-[36px] pb-[28px] ')}>
        <img src="/img/webapp/kyc-bg-0.png" alt="kyc-authorized" style={{ width: 102, height: 102 }} />
      </View>
      <KycMockSheetModal />
    </BasicLayout>
  )
}
