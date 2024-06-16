import { ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Col, Row } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import useCurrentDepth from '@/hooks/useCurrentDepth'
import useCurrentQuote from '@/hooks/useCurrentQuote'
import { formatNum } from '@/utils'

import Liquidation from '../Liquidation'

function generateRandomProgressArray() {
  const progressArray = []
  for (let i = 0; i < 30; i++) {
    const randomValue = Math.floor(Math.random() * 101)
    progressArray.push(randomValue)
  }
  return progressArray
}

type ModeType = 'BUY_SELL' | 'BUY' | 'SELL'

// 盘口深度报价
function DeepPrice() {
  const [mode, setMode] = useState<ModeType>('BUY_SELL')
  const [list, setList] = useState<any>([])
  const timerRef = useRef<any>()
  const depth = useCurrentDepth()
  const quote = useCurrentQuote()
  const asks = depth?.asks || []
  const bids = depth?.bids || []

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

  // 列表滚动区域高度
  // @TODO 如果Liquidation存在情况，否则高度默认
  const isLiquidation = false
  const height = isLiquidation ? 512 : 600
  const showAll = mode === 'BUY_SELL'

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setList(generateRandomProgressArray())
    }, 800)
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

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

  const BuyHeaderDom = (
    <div className="border-t border-b border-gray-60 py-2 px-3">
      <div className="flex items-center justify-between">
        <div>
          {/* 当前行情卖价 */}
          <span className="text-lg text-green font-dingpro-medium pr-[10px]">{formatNum(quote.bid)}</span>
        </div>
        {/* 更多打开一个页面交互没有 */}
        {/* <span className="text-xs text-gray-secondary cursor-pointer">
          <FormattedMessage id="common.more" />
        </span> */}
      </div>
    </div>
  )

  // 渲染买列表
  const renderBuyList = () => {
    return asks
      .slice(0, showAll ? 11 : 20)
      .filter((v) => v)
      .map((item, idx: number) => {
        const total = item.price * item.amount
        const pencent = (item.price / total) * 100
        const digits = quote.digits
        return (
          <div key={idx} className="relative overflow-hidden" style={{ animation: '0.3s ease-out 0s 1 normal none running none' }}>
            <Row className="flex items-center h-6 px-3 relative z-[2]">
              <Col span={8} className="text-xs text-green font-dingpro-regular text-left">
                {formatNum(item.price, { precision: digits })}
              </Col>
              <Col span={8} className="font-dingpro-regular text-xs text-gray text-left">
                {formatNum(item.amount, { precision: digits })}
              </Col>
              <Col span={8} className="font-dingpro-regular text-xs text-gray text-right">
                {formatNum(total, { precision: digits })}
              </Col>
            </Row>
            {/* 进度条 */}
            <div
              className="absolute r-0 z-[1] w-full bg-[#D6FFF4] h-6 opacity-50 left-[100%] right-0 top-0"
              style={{
                transform: `translateX(-${pencent >= 100 ? 0 : pencent}%)`
              }}
            ></div>
          </div>
        )
      })
  }

  const renderBuy = () => {
    return (
      <>
        {BuyHeaderDom}
        {renderBuyList()}
      </>
    )
  }

  // 渲染卖列表
  const renderSell = () => {
    return (
      <>
        {bids
          .slice(0, showAll ? 11 : 20)
          .filter((v) => v)
          .map((item: any, idx: number) => {
            const total = item.price * item.amount
            const pencent = (item.price / total) * 100
            const digits = quote.digits
            return (
              <div key={idx} className="relative overflow-hidden" style={{ animation: '0.3s ease-out 0s 1 normal none running none' }}>
                <Row className="flex items-center h-6 px-3 relative z-[2]">
                  <Col span={8} className="text-xs text-red font-dingpro-regular text-left">
                    {formatNum(item.price, { precision: digits })}
                  </Col>
                  <Col span={8} className="font-dingpro-regular text-xs text-gray text-left">
                    {formatNum(item.amount, { precision: digits })}
                  </Col>
                  <Col span={8} className="font-dingpro-regular text-xs text-gray text-right">
                    {formatNum(total, { precision: digits })}
                  </Col>
                </Row>
                {/* 进度条 */}
                <div
                  className="absolute r-0 z-[1] w-full bg-[#FFDDE2] h-6 opacity-50 left-[100%] right-0 top-0"
                  style={{
                    transform: `translateX(-${pencent >= 100 ? 0 : pencent}%)`
                  }}
                ></div>
              </div>
            )
          })}
      </>
    )
  }

  if (!asks.length && !bids.length) return

  return (
    <div className={classNames('w-[300px] h-[690px] overflow-hidden bg-white relative', className)}>
      <div className="flex items-center justify-between pl-3 pr-1 pt-[5px] pb-1 border-b border-gray-130">
        <div className="flex items-center gap-x-4">
          {modeList.map((item, idx) => (
            <Iconfont
              name={item.icon}
              width={24}
              height={24}
              className={classNames('cursor-pointer', item.key === mode ? 'opacity-100' : 'opacity-30')}
              key={idx}
              onClick={() => {
                setMode(item.key)
              }}
            />
          ))}
        </div>
        <div>
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
        </div>
      </div>
      <div className="py-3">
        <Row className="pb-2 px-3">
          <Col span={8}>
            <FormattedMessage id="mt.jiage" />
          </Col>
          <Col span={8}>
            <FormattedMessage id="mt.shuliang" />
          </Col>
          <Col span={8} className="text-right">
            <FormattedMessage id="mt.chengjiaoe" />
          </Col>
        </Row>
        <div className="overflow-y-auto" style={{ height }}>
          {mode === 'BUY_SELL' && (
            <>
              {renderSell()}
              {renderBuy()}
            </>
          )}
          {mode === 'BUY' && (
            <div>
              {BuyHeaderDom}
              <div className="overflow-y-auto h-[600px]">{renderBuyList()}</div>
            </div>
          )}
          {mode === 'SELL' && renderSell()}
        </div>
        <div>
          {/* 爆仓仓位展示 @TODO 只有开了杠杆才展示 */}
          {/* 这里判断数字货币类型才展示，这里展示和侧边栏sidebar展示一个即可 @TODO */}
          <Liquidation />
        </div>
      </div>
    </div>
  )
}

export default observer(DeepPrice)
