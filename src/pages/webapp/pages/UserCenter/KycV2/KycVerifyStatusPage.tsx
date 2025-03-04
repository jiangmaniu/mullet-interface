import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getKycStatus } from '@/pages/webapp/hooks/useKycStatusInfo'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { onBack } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'
import VerifyStatus2 from '../KycV2/VerifyStatus2'
import VerifyStatus3 from '../KycV2/VerifyStatus3'
function KycVerifyDocPage() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()

  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false

  const status = useMemo(() => {
    return getKycStatus(kycStatus, isBaseAuth, isKycAuth)
  }, [kycStatus, isBaseAuth, isKycAuth])

  const onSuccess = () => {
    onBack()
  }

  const onRetry = () => {
    navigateTo('/app/user-center/verify-document')
  }

  return (
    <BasicLayout
      bgColor="secondary"
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      className="flex-1 relative"
      headerStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
      header={<Header className="bg-secondary" title={status === 2 ? i18n.t('mt.shenhezhong') : i18n.t('mt.shenheshibai')} />}
      fixedHeight
      footer={
        <>
          {status === 2 ? (
            <Button disabled={false} className="mb-2.5 mt-40 w-full  px-2 " height={48} onClick={onSuccess}>
              {i18n.t('common.operate.Confirm')}
            </Button>
          ) : (
            <Button type="danger" disabled={false} className="mb-2.5 mt-40 w-full" height={48} onClick={onRetry}>
              {i18n.t('pages.userCenter.chongxinrenzheng')}
            </Button>
          )}
        </>
      }
    >
      {status === 2 ? <VerifyStatus2 /> : <VerifyStatus3 />}
    </BasicLayout>
  )
}

export default observer(KycVerifyDocPage)
