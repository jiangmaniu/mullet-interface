import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { push } from '@/utils/navigator'
import { FormattedMessage, getIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'
import { WebviewComponentRef } from '../WebviewPage'
import Body from './comp/Body'

function WithdrawPreview() {
  const { theme } = useTheme()

  const [disabled, setDisabled] = useState(false)
  const onDisabledChange = (disabled: boolean) => {
    setDisabled(disabled)
  }

  const ref = useRef<WebviewComponentRef>(null)
  const handleSubmit = () => {
    ref.current?.onSubmit()
  }

  const onSuccess = (values?: any) => {
    push('/app/withdraw/preview', values)
  }

  return (
    <BasicLayout
      bgColor="primary"
      headerColor={theme.colors.backgroundColor.secondary}
      fixedHeight
      footer={
        <Button type="primary" size="large" className="mt-2 mb-2.5" onClick={handleSubmit} disabled={disabled}>
          {getIntl().formatMessage({ id: 'mt.tixian' })}
        </Button>
      }
    >
      <Header
        className="bg-secondary"
        onBack={() => navigateTo('/app/user-center')}
        right={
          <div className="flex flex-row items-end gap-1.5 pr-[2px]">
            <Iconfont name="anniu-gengduo" color="white" width={20} height={20} />
            <span className="flex-1 text-sm">
              <FormattedMessage id="mt.lianxikefu" />
            </span>
          </div>
        }
      />
      <Body ref={ref} onDisabledChange={onDisabledChange} onSuccess={onSuccess} />
    </BasicLayout>
  )
}

export default observer(WithdrawPreview)
