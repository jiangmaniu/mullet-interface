import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import Body from './comp/Body'

function Deposit() {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态
  const isBaseAuth = currentUser?.isBaseAuth || false

  const { theme } = useTheme()
  const i18n = useI18n()

  return (
    <BasicLayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header onBack={() => navigateTo('/app/user-center')} />
      <div className="px-[14px]">
        <Body />
      </div>
    </BasicLayout>
  )
}

export default observer(Deposit)
