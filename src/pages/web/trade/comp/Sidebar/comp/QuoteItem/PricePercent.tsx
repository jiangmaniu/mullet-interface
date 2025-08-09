import { useTheme } from '@/context/themeProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { gray } from '@/theme/theme.config'
import { formatNum } from '@/utils'
import { Col } from 'antd'
import { observer } from 'mobx-react'
import { Fragment, useEffect, useRef } from 'react'

type IProps = {
  symbol: string
}

function OptimizedPricePercent({ symbol }: IProps) {
  const { theme } = useTheme()
  const { isDark, up: upColor, down: downColor } = theme
  const res = useCurrentQuote(symbol)

  // 使用ref来控制动画，而不是重创建DOM
  const bidRef = useRef<HTMLDivElement>(null)
  const askRef = useRef<HTMLDivElement>(null)

  // 计算状态
  let bidColor: 'up' | 'down' | 'same' = 'same'
  let askColor: 'up' | 'down' | 'same' = 'same'

  if (res?.hasQuote && res?.quotes?.size > 0) {
    bidColor = res?.bidDiff === 0 ? 'same' : res?.bidDiff > 0 ? 'up' : 'down'
    askColor = res?.askDiff === 0 ? 'same' : res?.askDiff > 0 ? 'up' : 'down'
  }

  // 使用effect来触发动画，而不是通过重创建组件
  useEffect(() => {
    if (bidRef.current && bidColor !== 'same') {
      bidRef.current.style.animation = 'none'
      // 强制重排
      bidRef.current.offsetHeight
      bidRef.current.style.animation = `flash${bidColor === 'up' ? 'Up' : 'Down'} 800ms ease-out`
    }
  }, [res?.bidDiff, bidColor])

  useEffect(() => {
    if (askRef.current && askColor !== 'same') {
      askRef.current.style.animation = 'none'
      askRef.current.offsetHeight
      askRef.current.style.animation = `flash${askColor === 'up' ? 'Up' : 'Down'} 800ms ease-out`
    }
  }, [res?.askDiff, askColor])

  const getBoxStyle = (colorType: 'up' | 'down' | 'same') => {
    const baseStyle = {
      borderRadius: '4px',
      overflow: 'hidden',
      fontSize: '13px',
      lineHeight: '16px',
      padding: '2px 6px',
      width: '74px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500
    }

    switch (colorType) {
      case 'up':
        return {
          ...baseStyle,
          backgroundColor: upColor,
          color: 'white'
        }
      case 'down':
        return {
          ...baseStyle,
          backgroundColor: downColor,
          color: 'white'
        }
      default:
        return {
          ...baseStyle,
          backgroundColor: isDark ? gray[720] : gray[50],
          color: 'var(--color-text-primary)',
          border: `1px solid ${isDark ? gray[575] : gray[130]}`
        }
    }
  }

  return (
    <Fragment>
      <Col className="flex pl-2" span={6}>
        <div ref={bidRef} style={getBoxStyle(bidColor)}>
          {res?.bid ? formatNum(res.bid) : '--'}
        </div>
      </Col>
      <Col className="flex" span={6}>
        <div ref={askRef} style={getBoxStyle(askColor)}>
          {res?.ask ? formatNum(res.ask) : '--'}
        </div>
      </Col>
      <Col span={4} className="flex flex-col items-end pr-2">
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            textAlign: 'right',
            color: res?.percent && Number(res.percent) > 0 ? upColor : downColor
          }}
        >
          {res?.bid && res?.percent !== null ? (res.percent && Number(res.percent) > 0 ? `+${res.percent}%` : `${res.percent}%`) : '--'}
        </div>
      </Col>
    </Fragment>
  )
}

export default observer(OptimizedPricePercent)
