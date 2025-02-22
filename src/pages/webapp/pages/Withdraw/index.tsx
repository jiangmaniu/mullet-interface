import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { observer } from 'mobx-react'
import { MethodList } from './comp/MethodList'

function Withdraw() {
  const { theme } = useTheme()
  const i18n = useI18n()

  return (
    <BasicLayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header onBack={() => navigateTo('/app/user-center')} />
      <div className="px-[14px] pt-2">
        {/* <Kyc onClick={() => navigateTo('/app/user-center/kyc-webview-page')} /> */}
        <MethodList />
      </div>
    </BasicLayout>
  )
}

export default observer(Withdraw)
