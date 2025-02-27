import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { goKefu } from '@/utils/navigator'
import { FormattedMessage, getIntl, useSearchParams } from '@umijs/max'
import { useTitle } from 'ahooks'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'
import { WebviewComponentRef } from '../WebviewPage'
import Body from './comp/Body'

function WithdrawPreview() {
  const { theme } = useTheme()

  useTitle(getIntl().formatMessage({ id: 'menu.withdrawalPreview' }))

  const [disabled, setDisabled] = useState(false)
  const onDisabledChange = (disabled: boolean) => {
    setDisabled(disabled)
  }

  const ref = useRef<WebviewComponentRef>(null)
  const handleSubmit = () => {
    ref.current?.onSubmit()
  }

  const [query] = useSearchParams()

  const backUrl = query.get('backUrl') as string

  useEffect(() => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'kefu'
      })
    )
  }, [])

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
        className="bg-primary"
        onBack={() => navigateTo(backUrl)}
        right={
          <div className="flex-1 text-sm flex flex-row justify-end gap-1.5 pr-[2px]" onClick={goKefu}>
            <Iconfont name="chat" width={20} height={20} />
            <FormattedMessage id="mt.lianxikefu" />
          </div>
        }
      />
      <Body ref={ref} onDisabledChange={onDisabledChange} />
    </BasicLayout>
  )
}

export default observer(WithdrawPreview)
