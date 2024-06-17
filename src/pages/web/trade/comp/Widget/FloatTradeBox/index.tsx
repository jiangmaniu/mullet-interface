import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { InputNumber } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useCurrentQuote from '@/hooks/useCurrentQuote'
import { formatNum } from '@/utils'
import { goLogin } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

function FloatTradeBox() {
  const { isMobileOrIpad } = useEnv()
  const [open, setOpen] = useState(true)
  const [count, setCount] = useState<any>('0.1')
  const [widgetRight, setWidgetRight] = useState(620)
  const [widgetTop, setWidgetTop] = useState(200)
  const startPosition = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const token = STORAGE_GET_TOKEN()
  const { trade } = useStores()
  const quoteInfo = useCurrentQuote()
  const symbolConf = quoteInfo?.symbolConf
  const vmin = symbolConf?.minTrade || 0.1
  const vmax = symbolConf?.maxTrade || 20

  useEffect(() => {
    setCount(vmin)
  }, [vmin])

  const startDrag = (event: any) => {
    event.preventDefault()
    isDragging.current = true
    startPosition.current = {
      x: event?.clientX || event?.touches?.[0]?.clientX,
      y: event?.clientY || event?.touches?.[0]?.clientY
    }
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseleave', stopDrag)
    document.addEventListener('touchmove', drag)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchend', stopDrag)
  }

  const drag = (event: any) => {
    if (!isDragging.current) return
    const currentPosition = {
      x: event?.clientX || event.touches?.[0]?.clientX,
      y: event?.clientY || event.touches?.[0]?.clientY
    }
    const deltaX = currentPosition.x - startPosition.current.x
    const deltaY = currentPosition.y - startPosition.current.y
    // setWidgetRight((prev) => prev - deltaX)
    // setWidgetTop((prev) => prev + deltaY)

    // @TODO 限制左边范围拖动
    setWidgetRight((prev) => {
      const right = window.innerWidth - 300 // 右边界
      const newRight = isNaN(prev) ? right : prev - deltaX
      const left = 300 // 左边界
      if (newRight < left) return left
      if (newRight > right) return right
      return newRight
    })

    setWidgetTop((prev) => {
      const bottom = window.innerHeight - 100 // 底部边界
      const newTop = isNaN(prev) ? bottom : prev + deltaY
      const top = 150 // 底部边界
      if (newTop < top) return top
      if (newTop > bottom) return bottom
      return newTop
    })

    startPosition.current = currentPosition
  }

  const stopDrag = () => {
    isDragging.current = false
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('touchmove', drag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('mouseleave', stopDrag)
    document.removeEventListener('touchend', stopDrag)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('touchmove', drag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchend', stopDrag)
    }
  }, [])

  // @ts-ignore
  const className = useEmotionCss(({ token }) => {
    return {
      position: 'absolute',
      transform: 'translateY(-45%)',
      zIndex: 99,
      input: {
        border: 'none !important',
        boxShadow: 'none !important',
        textAlign: 'center !important',
        padding: '0 !important'
      },
      '.ant-input-number': {
        border: 'none !important',
        boxShadow: 'none !important'
      }
    }
  })

  if (!open || isMobileOrIpad) return

  const handleTrade = async (type: API.TradeBuySell) => {
    if (!token) {
      return goLogin()
    }
    const isBuy = type === TRADE_BUY_SELL.BUY
    // 下单
    let params = {
      symbol: quoteInfo.symbol,
      buySell: isBuy ? TRADE_BUY_SELL.BUY : TRADE_BUY_SELL.SELL, // 订单方向
      orderVolume: count,
      tradeAccountId: trade.currentAccountInfo?.id,
      marginType: trade.marginType, // 保证金类型
      type: ORDER_TYPE.MARKET_ORDER // 订单类型
    } as Order.CreateOrder

    console.log('参数', params)
    // ws.socket.send(JSON.stringify(res))
    // ws.setNewOrderFn(res)

    const res = await trade.createOrder(params)

    if (!res.success) {
      return
    }
    setCount('0.01')
  }

  return (
    <div
      className={classNames('border border-gray-185 rounded-lg bg-white fixed', className)}
      style={{
        right: widgetRight,
        top: widgetTop
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-185">
          <div className="px-[2px] py-3 cursor-move" onMouseDown={startDrag} onTouchStart={startDrag}>
            <div className="bg-[url(/img/handle-drop.png)] bg-[size:14px_28px] bg-no-repeat w-[14px] h-[28px]"></div>
          </div>
          <div
            className="bg-red flex flex-col h-[56px] px-3 items-center justify-center cursor-pointer"
            onClick={() => {
              handleTrade('SELL')
            }}
          >
            <div className="select-none text-white text-xs">
              <FormattedMessage id="mt.maichuzuokong" />
            </div>
            <div className="text-white font-dingpro-medium text-base select-none">{formatNum(quoteInfo.bid)}</div>
          </div>
          <div className="flex flex-col h-[56px] px-3 items-center justify-center w-[105px]">
            <div className="text-gray text-xs select-none">
              <FormattedMessage id="mt.shoushu" />
            </div>
            <InputNumber
              min={vmin}
              controls={false}
              max={vmax}
              value={count}
              onChange={(val) => {
                setCount(val)
              }}
            />
          </div>
          <div
            className="bg-green h-[56px] px-3 flex flex-col  items-center justify-center cursor-pointer"
            onClick={() => {
              handleTrade('BUY')
            }}
          >
            <div className="select-none text-white text-xs">
              <FormattedMessage id="mt.mairuzuoduo" />
            </div>
            <div className="text-white font-dingpro-medium text-base select-none">{formatNum(quoteInfo.ask)}</div>
          </div>
          <div className="px-[2px] cursor-pointer" onClick={() => setOpen(false)}>
            <img width="14" height="28" src="/img/close.png" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-[6px] py-1 mt-[2px]">
          {['0.1', '0.5', '1.0', '10.0'].map((item, idx) => {
            return (
              <span
                key={idx}
                className="text-gray text-xs px-[6px] py-[1px] bg-gray-50 rounded cursor-pointer"
                onClick={() => {
                  setCount(item)
                }}
              >
                {item}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default observer(FloatTradeBox)
