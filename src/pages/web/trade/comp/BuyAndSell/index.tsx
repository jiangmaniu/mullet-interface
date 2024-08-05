import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useRef, useState, useTransition } from 'react'

import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'

import LimitOrder from './comp/LimitOrder'
import MarketOrder from './comp/MarketOrder'
import StopLimitOrder from './comp/StopLimitOrder'

export const OP_BUY = 1 // 买
export const OP_SELL = 2 // 卖
const OP_MARKET_ORDER = 1 // 市价单
const OP_LIMIT_ORDER = 2 // 限价单
const OP_STOP_LIMIT_ORDER = 3 // 停损单

export default observer(
  forwardRef((props, ref) => {
    const { isPc, isMobileOrIpad } = useEnv()
    const { lng } = useLang()
    const { trade } = useStores()
    const intl = useIntl()
    const [isPending, startTransition] = useTransition() // 提高优先级，避免页面阻塞事件

    const [orderType, setOrderType] = useState<any>(OP_MARKET_ORDER) // 订单类类型
    const [tradeType, setTradeType] = useState(OP_BUY) // 交易方向：1买入 2卖出

    const popupRef = useRef<any>()

    const OrderTypeItems: any = [
      { key: OP_MARKET_ORDER, label: intl.formatMessage({ id: 'mt.shijiadan' }) },
      { key: OP_LIMIT_ORDER, label: intl.formatMessage({ id: 'mt.xianjiadan' }) },
      { key: OP_STOP_LIMIT_ORDER, label: intl.formatMessage({ id: 'mt.tingsundan' }) }
    ]

    // 重写方法
    const show = (current: any) => {
      popupRef.current.show()
      setTradeType(current)
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
          background: '#EEEEEE',
          width: 1,
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0
        }
      }
    })

    const renderContent = () => {
      return (
        <div
          className={classNames({
            'h-[700px] w-[300px] bg-white relative dark:bg-dark-page': isPc,
            [className]: isPc,
            'pointer-events-none': trade.disabledTrade
          })}
        >
          <Tabs
            items={OrderTypeItems}
            centered
            activeKey={orderType}
            tabBarGutter={lng === 'zh-TW' ? 50 : 70}
            className="max-xl:pl-3"
            onChange={(key) => {
              startTransition(() => {
                setOrderType(key)
              })
            }}
            size="small"
            marginBottom={0}
          />
          {/* 市价单 */}
          <div style={{ display: orderType === OP_MARKET_ORDER ? 'block' : 'none' }}>
            <MarketOrder popupRef={popupRef} type={tradeType} orderType={orderType} />
          </div>
          {/* 限价单 */}
          <div style={{ display: orderType === OP_LIMIT_ORDER ? 'block' : 'none' }}>
            <LimitOrder popupRef={popupRef} orderType={orderType} />
          </div>
          {/* 停损单 */}
          <div style={{ display: orderType === OP_STOP_LIMIT_ORDER ? 'block' : 'none' }}>
            <StopLimitOrder popupRef={popupRef} orderType={orderType} />
          </div>
        </div>
      )
    }

    return (
      <SwitchPcOrWapLayout
        pcComponent={<>{renderContent()}</>}
        wapComponent={
          <Popup
            headerStyle={{ padding: 0 }}
            contentStyle={{ paddingBottom: 30 }}
            ref={popupRef}
            title={
              <div>
                {tradeType === OP_BUY ? intl.formatMessage({ id: 'mt.mairuzuoduo' }) : intl.formatMessage({ id: 'mt.maichuzuokong' })}
                <span className="pl-1">{trade.activeSymbolName}</span>
              </div>
            }
            position="bottom"
          >
            {renderContent()}
          </Popup>
        }
      />
    )
  })
)
