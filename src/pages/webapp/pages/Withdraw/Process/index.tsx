import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { push } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { FormattedMessage, getIntl, useModel } from '@umijs/max'
import { useTitle } from 'ahooks'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'
import { WebviewComponentRef } from '../WebviewPage'
import Body from './comp/Body'

function Deposit() {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态
  const isBaseAuth = currentUser?.isBaseAuth || false

  useTitle(getIntl().formatMessage({ id: 'menu.withdrawalProcess' }))

  const { theme } = useTheme()
  const i18n = useI18n()

  const [disabled, setDisabled] = useState(false)
  const onDisabledChange = (disabled: boolean) => {
    setDisabled(disabled)
  }

  const ref = useRef<WebviewComponentRef>(null)
  const handleSubmit = () => {
    ref.current?.onSubmit()
  }

  const onSuccess = (params?: any) => {
    push(appendHideParamIfNeeded(`/app/withdraw/preview?backUrl=/app/withdraw/process/${params?.methodId}`), params)
    // console.log(appendHideParamIfNeeded(`/app/withdraw/preview?backUrl=/app/withdraw/process/${params?.methodId}`), params)
    // push(appendHideParamIfNeeded(`/app/withdraw/preview?backUrl=/app/withdraw/process/${params?.methodId}`), params)
  }

  return (
    <BasicLayout
      bgColor="primary"
      headerColor={theme.colors.backgroundColor.primary}
      fixedHeight
      footer={
        <Button type="primary" size="large" className="mt-2 mb-2.5" onClick={handleSubmit} disabled={disabled}>
          <div className="flex flex-row items-center gap-2 text-reverse text-base">
            <FormattedMessage id="mt.tixian" />
            <Iconfont name="anniu-gengduo" color="white" width={18} height={18} />
          </div>
        </Button>
      }
    >
      <Header onBack={() => navigateTo('/app/user-center')} />
      <Body ref={ref} onDisabledChange={onDisabledChange} onSuccess={onSuccess} />
    </BasicLayout>
  )
}

export default observer(Deposit)
