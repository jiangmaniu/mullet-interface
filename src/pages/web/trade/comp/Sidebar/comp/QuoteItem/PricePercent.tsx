import { useTheme } from '@/context/themeProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { gray } from '@/theme/theme.config'
import { formatNum } from '@/utils'
import { Col } from 'antd'
import { observer } from 'mobx-react'
import { Fragment } from 'react'

type IProps = {
  symbol: string
}

// 使用key强制React重新创建组件，减少渲染次数
function KeyBasedPricePercent({ symbol }: IProps) {
  const { theme } = useTheme()
  const { isDark, up: upColor, down: downColor } = theme
  const res = useCurrentQuote(symbol)

  // 使用数据变化作为key，强制React重新创建
  const componentKey = `${res?.bid}-${res?.ask}-${res?.percent}-${res?.bidDiff}-${res?.askDiff}`

  // 计算状态
  let bidColor: 'up' | 'down' | 'same' = 'same'
  let askColor: 'up' | 'down' | 'same' = 'same'

  if (res?.hasQuote && res?.quotes?.size > 0) {
    bidColor = res?.bidDiff === 0 ? 'same' : res?.bidDiff > 0 ? 'up' : 'down'
    askColor = res?.askDiff === 0 ? 'same' : res?.askDiff > 0 ? 'up' : 'down'
  }

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
          color: 'white',
          animation: 'flashUp 800ms ease-out'
        }
      case 'down':
        return {
          ...baseStyle,
          backgroundColor: downColor,
          color: 'white',
          animation: 'flashDown 800ms ease-out'
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
    <Fragment key={componentKey}>
      <Col className="flex pl-2" span={6}>
        <div style={getBoxStyle(bidColor)}>{res?.bid ? formatNum(res.bid) : '--'}</div>
      </Col>
      <Col className="flex" span={6}>
        <div style={getBoxStyle(askColor)}>{res?.ask ? formatNum(res.ask) : '--'}</div>
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

export default observer(KeyBasedPricePercent)
