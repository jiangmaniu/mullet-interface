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

  useTitle(getIntl().formatMessage({ id: 'menu.depositOtcPreview' }))

  const [disabled, setDisabled] = useState(false)
  const onDisabledChange = (disabled: boolean) => {
    setDisabled(disabled)
  }

  const ref = useRef<WebviewComponentRef>(null)
  const handleSubmit = () => {
    ref.current?.onSubmit()
  }

  // const onSuccess = (values?: any) => {
  //   // push('/app/withdraw/preview', values)
  //   replace('/app/withdraw/preview', values)
  // }

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
      header={
        <Header
          className="bg-secondary"
          onBack={() => navigateTo(backUrl || '/app/deposit')}
          right={
            <div className="flex-1 text-sm flex flex-row justify-end gap-1.5 pr-[2px]" onClick={goKefu}>
              <Iconfont name="chat" width={20} height={20} />
              <FormattedMessage id="mt.lianxikefu" />
            </div>
          }
        />
      }
      footer={
        <div className="flex flex-row  justify-between gap-2.5 mt-2 mb-2.5 w-full ">
          <div className="flex-1 flex-grow">
            <Button
              type="primary"
              size="large"
              className="w-full text-center"
              onClick={() => {
                ref.current?.onUpload()
              }}
            >
              {getIntl().formatMessage({ id: 'mt.yifukuanshagnchuanpingzheng' })}
            </Button>
          </div>
          <Button
            size="large"
            className=" w-[88px] text-center"
            onClick={() => {
              ref.current?.onCancel()
            }}
          >
            {getIntl().formatMessage({ id: 'mt.quxiaodingdan' })}
          </Button>
        </div>
      }
    >
      <Body ref={ref} onDisabledChange={onDisabledChange} />
    </BasicLayout>
  )
}

export default observer(WithdrawPreview)
