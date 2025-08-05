import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Col, Row } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useMemo, useState, useTransition } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { formatNum, getPrecisionByNumber } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentDepth } from '@/utils/wsUtil'

type ModeType = 'BUY_SELL' | 'BUY' | 'SELL'

// 盘口深度报价
function DeepPrice() {
  const { trade } = useStores()
  const [mode, setMode] = useState<ModeType>('BUY_SELL')
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
  const depth = getCurrentDepth(trade.activeSymbolName)
  const quote = useCurrentQuote(trade.activeSymbolName)
  // asks 从下往上对应（倒数第一个 是买一） 作为卖盘展示在上面， 倒过来 从大到小（倒过来后，从后往前截取12条）(买价 卖盘)
  const asks = toJS(depth?.asks || []).reverse()
  //  bids 从上往下对应（第一个 是卖一） 作为买盘展示在下面（卖价 买盘）
  const bids = toJS(depth?.bids || [])

  const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName)

  const modeList: Array<{ key: ModeType; icon: string }> = [
    {
      key: 'BUY_SELL',
      icon: 'pankou-maimai'
    },
    {
      key: 'BUY',
      icon: 'pankou-mai'
    },
    {
      key: 'SELL',
      icon: 'pankou-mai1'
    }
  ]

  const showAll = mode !== 'BUY_SELL'

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

  const BidPriceDom = (
    <div className="border-t border-b border-gray-60 dark:dark:border-[var(--border-primary-color)] py-2 px-3">
      <div className="flex items-center justify-between">
        <div>
          {/* 当前行情卖价 */}
          <span className={cn('text-lg pr-[10px] font-pf-bold', quote?.bidDiff && quote?.bidDiff > 0 ? 'text-green' : 'text-red')}>
            {formatNum(quote?.bid)}
          </span>
        </div>
        {/* 更多打开一个页面交互没有 */}
        {/* <span className="!text-xs text-secondary cursor-pointer">
          <FormattedMessage id="common.more" />
        </span> */}
      </div>
    </div>
  )

  // 渲染买列表
  const renderBuyList = () => {
    const list = showAll ? bids : bids.slice(0, 12)
    const maxAmount = Math.max(...list.map((item) => item.amount))
    return list
      .filter((v) => v)
      .map((item, idx: number) => {
        const total = item.price * item.amount
        const pencent = (item.amount / maxAmount) * 100
        const digits = quote?.digits
        const amountDigits = getPrecisionByNumber(item.amount)
        return (
          <div key={idx} className="relative overflow-hidden" style={{ animation: '0.2s ease-out 0s 1 normal none running none' }}>
            <Row className="flex items-center h-6 px-3 relative z-[2]">
              <Col span={8} className="!text-xs text-green text-left font-dingpro-medium">
                {formatNum(item.price, { precision: digits })}
              </Col>
              <Col span={8} className="!text-xs text-primary text-left font-dingpro-medium">
                {amountDigits >= 8 ? formatNum(item.amount, { precision: 8 }) : formatNum(item.amount)}
              </Col>
              <Col span={8} className="!text-xs text-primary text-right font-dingpro-medium">
                {formatNum(total, { precision: digits })}
              </Col>
            </Row>
            {/* 进度条 */}
            <div
              className="absolute r-0 z-[1] w-full bg-[var(--depth-buy-bg)] h-6 opacity-50 left-[100%] right-0 top-0"
              style={{
                transform: `translateX(-${pencent >= 100 ? 100 : pencent}%)`,
                transition: 'transform .2s ease-in-out'
              }}
            ></div>
          </div>
        )
      })
  }

  const renderBuy = () => {
    return (
      <>
        {BidPriceDom}
        {renderBuyList()}
      </>
    )
  }

  const renderSell = () => {
    return (
      <>
        {BidPriceDom}
        {renderSellList()}
      </>
    )
  }

  // 渲染卖列表
  const renderSellList = () => {
    const list = showAll ? asks : asks.slice(-12) // 获取倒数12条数据
    const maxAmount = Math.max(...list.map((item) => item.amount))
    return (
      <>
        {list
          .filter((v) => v)
          .map((item: any, idx: number) => {
            const total = item.price * item.amount
            const pencent = (item.amount / maxAmount) * 100
            const digits = quote?.digits
            const amountDigits = getPrecisionByNumber(item.amount)
            return (
              <div key={idx} className="relative overflow-hidden" style={{ animation: '0.2s ease-out 0s 1 normal none running none' }}>
                <Row className="flex items-center h-6 px-3 relative z-[2]">
                  <Col span={8} className="!text-xs text-red text-left font-dingpro-medium">
                    {formatNum(item.price, { precision: digits })}
                  </Col>
                  <Col span={8} className="!text-xs text-primary text-left font-dingpro-medium">
                    {amountDigits >= 8 ? formatNum(item.amount, { precision: 8 }) : formatNum(item.amount)}
                  </Col>
                  <Col span={8} className="!text-xs text-primary text-right font-dingpro-medium">
                    {formatNum(total, { precision: digits })}
                  </Col>
                </Row>
                {/* 进度条 */}
                <div
                  className="absolute r-0 z-[1] w-full bg-[var(--depth-sell-bg)] h-6 opacity-50 left-[100%] right-0 top-0"
                  style={{
                    transform: `translateX(-${pencent >= 100 ? 100 : pencent}%)`,
                    transition: 'transform .2s ease-in-out'
                  }}
                ></div>
              </div>
            )
          })}
      </>
    )
  }

  const renderMode = useMemo(() => {
    return (
      <div className="flex items-center gap-x-4">
        {modeList.map((item, idx) => (
          <Iconfont
            name={item.icon}
            width={24}
            height={24}
            className={cn('cursor-pointer', item.key === mode ? 'opacity-100' : 'opacity-30')}
            key={idx}
            onClick={() => {
              startTransition(() => {
                setMode(item.key)
              })
            }}
          />
        ))}
      </div>
    )
  }, [mode])

  if ((!asks.length && !bids.length) || symbolInfo.symbolConf?.depthOfMarket === 0) return

  return (
    <div className={cn('w-[260px] h-[700px] overflow-hidden relative bg-primary', className)}>
      <div className="flex items-center pl-3 pr-1 h-[42px] border-b border-gray-130 dark:border-[var(--border-primary-color)]">
        {renderMode}
        {/* <div>
          <ProFormSelect
            fieldProps={{
              size: 'small',
              defaultValue: '0.1',
              style: { minWidth: 60 },
              suffixIcon: <img src="/img/down2.png" width={14} height={14} />
            }}
            allowClear={false}
            options={[
              {
                label: '0.01',
                value: '0.01'
              },
              {
                label: '0.1',
                value: '0.1'
              },
              {
                label: '1',
                value: '1'
              },
              {
                label: '10',
                value: '10'
              },
              {
                label: '50',
                value: '50'
              }
            ]}
          />
        </div> */}
      </div>
      <div className="py-3">
        <Row className="pb-2 px-3">
          <Col span={8} className="text-weak !text-xs">
            <FormattedMessage id="mt.jiage" />
          </Col>
          <Col span={8} className="text-weak !text-xs">
            <FormattedMessage id="mt.shuliang" />
          </Col>
          <Col span={8} className="text-right text-weak !text-xs">
            <FormattedMessage id="mt.zonge" />
          </Col>
        </Row>
        <div style={{ height: 622 }}>
          {mode === 'BUY_SELL' && (
            <>
              {renderSellList()}
              {renderBuy()}
            </>
          )}
          {mode === 'BUY' && (
            <div>
              {BidPriceDom}
              <div className="overflow-y-auto h-[600px]">{renderBuyList()}</div>
            </div>
          )}
          {mode === 'SELL' && (
            <div>
              {BidPriceDom}
              <div className="overflow-y-auto h-[600px]">{renderSellList()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default observer(DeepPrice)
