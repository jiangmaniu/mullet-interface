import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'
import { WebviewComponentRef } from '../WebviewPage'
import Body from './comp/Body'

function Deposit() {
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
    // if (params?.methodId === 'OTC') {
    //   push(`/app/deposit/otc/${params?.id}?backUrl=/app/deposit/process/${params?.methodId}`)
    // }
  }

  return (
    <BasicLayout
      bgColor="primary"
      headerColor={theme.colors.backgroundColor.primary}
      fixedHeight
      header={<Header onBack={() => navigateTo('/app/user-center')} />}
      footer={
        <Button type="primary" size="large" className="mt-2 mb-2.5" onClick={handleSubmit} disabled={disabled}>
          <div className="flex flex-row items-center gap-2 text-reverse text-base">
            <FormattedMessage id="mt.jixu" />
            <Iconfont name="anniu-gengduo" color="white" width={18} height={18} />
          </div>
        </Button>
      }
    >
      <Body ref={ref} onDisabledChange={onDisabledChange} onSuccess={onSuccess} />
    </BasicLayout>
  )
}

export default observer(Deposit)
