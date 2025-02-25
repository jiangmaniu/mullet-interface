import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { goKefu, push, replace } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
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

  return (
    <BasicLayout
      bgColor="primary"
      headerColor={theme.colors.backgroundColor.secondary}
      fixedHeight
      footer={
        <div className="flex flex-row  justify-between gap-2.5 mt-2 mb-2.5 w-full ">
          <div className="flex-1 flex-grow">
            <Button
              type="primary"
              size="large"
              className="w-full"
              onClick={() => {
                // @ts-ignore
                if (window.ReactNativeWebView) {
                  // @ts-ignore
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                      type: 'trade'
                    })
                  )
                } else {
                  push('/app/trade')
                }
              }}
            >
              {getIntl().formatMessage({ id: 'mt.qujiaoyi' })}
            </Button>
          </div>
          <Button
            size="large"
            className=" w-[88px]"
            onClick={() => {
              replace(appendHideParamIfNeeded(`/app/record/payment?type=RUJIN`))
            }}
          >
            {getIntl().formatMessage({ id: 'mt.chakandingdan' })}
          </Button>
        </div>
      }
    >
      <Header
        className="bg-secondary"
        onBack={() => navigateTo('/app/deposit')}
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
