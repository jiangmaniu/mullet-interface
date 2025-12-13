import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useMemo, useRef, useTransition } from 'react'

import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { ITradeTabsOrderType } from '@/mobx/trade'
import { cn } from '@/utils/cn'

import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import OrderItem from './comp/OrderItem'

const DisabledTradeView = observer(() => {
  const { trade } = useStores()
  const quote = useCurrentQuote(trade.activeSymbolName)

  return <>{trade.disabledTradeAction() && <div className="absolute top-0 left-0 w-full h-full z-[30] cursor-not-allowed"></div>}</>
})

export default observer(
  forwardRef((props, ref) => {
    const { isPc, isMobileOrIpad } = useEnv()
    const { lng } = useLang()
    const { trade } = useStores()
    const intl = useIntl()
    const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性

    const popupRef = useRef<any>()
    const orderType = trade.orderType

    const OrderTypeItems: Array<{ key: ITradeTabsOrderType; label: string }> = [
      { key: 'MARKET_ORDER', label: intl.formatMessage({ id: 'mt.shijiadan' }) },
      { key: 'LIMIT_ORDER', label: intl.formatMessage({ id: 'mt.xianjiadan' }) },
      { key: 'STOP_LIMIT_ORDER', label: intl.formatMessage({ id: 'mt.tingsundan' }) }
    ]

    // 重写方法
    const show = (current: any) => {
      popupRef.current.show()
      trade.setBuySell(current)
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        ...popupRef.current,
        show
      }
    })

    const className = useEmotionCss(({ token }) => {
      return {
        '&::after': {
          content: "''",
          background: 'var(--divider-line-color)',
          width: 1,
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0
        }
      }
    })

    const renderContent = useMemo(() => {
      return (
        <div
          className={cn({
            'h-[700px] relative bg-primary flex-shrink-0': isPc,
            [className]: isPc
          })}
        >
          <Tabs
            items={OrderTypeItems}
            centered
            activeKey={orderType}
            tabBarGutter={lng === 'zh-TW' ? 50 : 45}
            className="max-xl:pl-3"
            onChange={(key) => {
              startTransition(() => {
                trade.setOrderType(key as ITradeTabsOrderType)
                // 重置买卖类型
                trade.setBuySell('BUY')
              })
            }}
            size="small"
            marginBottom={0}
          />
          {/* 市价单/限价单/停损单 */}
          {/* <div style={{ display: orderType === 'MARKET_ORDER' ? 'block' : 'none' }}>
            <MarketOrder popupRef={popupRef} />
          </div>
          <div style={{ display: orderType === 'LIMIT_ORDER' ? 'block' : 'none' }}>
            <LimitOrder popupRef={popupRef} />
          </div>
          <div style={{ display: orderType === 'STOP_LIMIT_ORDER' ? 'block' : 'none' }}>
            <StopLimitOrder popupRef={popupRef} />
          </div> */}
          <OrderItem />

          {/* 禁用交易区操作 */}
          <DisabledTradeView />
        </div>
      )
    }, [orderType, isPc, intl.locale])

    return (
      <SwitchPcOrWapLayout
        pcComponent={<>{renderContent}</>}
        wapComponent={
          <Popup
            headerStyle={{ padding: 0 }}
            contentStyle={{ paddingBottom: 30 }}
            ref={popupRef}
            title={
              <div>
                {trade.buySell === 'BUY' ? intl.formatMessage({ id: 'mt.mairuzuoduo' }) : intl.formatMessage({ id: 'mt.maichuzuokong' })}
                <span className="pl-1">{trade.activeSymbolName}</span>
              </div>
            }
            position="bottom"
          >
            {renderContent}
          </Popup>
        }
      />
    )
  })
)
