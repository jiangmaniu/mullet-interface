import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Col } from 'antd'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  symbol: string
}

/**价格、涨跌幅 */
function PricePercent({ symbol }: IProps) {
  const { trade, ws, kline } = useStores()
  const { upColor, downColor, isDark } = useTheme()
  const res = getCurrentQuote(symbol)
  const bid = res.bid // 卖价
  const ask = res.ask // 买价
  const per: any = res.percent

  let bidColor = ''
  let askColor = ''

  if (res.hasQuote && res.quotes?.size > 0) {
    // 涨跌额涨跌幅是0显示灰色
    if (res?.askDiff === 0) {
      askColor = 'same'
    } else {
      askColor = res?.askDiff > 0 ? 'up' : 'down'
    }
    if (res?.bidDiff === 0) {
      bidColor = 'same'
    } else {
      bidColor = res?.bidDiff > 0 ? 'up' : 'down'
    }
  } else {
    // 默认展示灰色
    bidColor = 'same'
    askColor = 'same'
  }

  const className = useEmotionCss((token) => {
    return {
      '@keyframes bgUp': {
        '0%': {
          background: upColor,
          color: 'var(--color-white)'
        },
        '50%': {
          background: upColor,
          color: 'var(--color-white)'
        },
        '100%': {
          background: 'transparent',
          color: 'var(--color-text-primary)'
        }
      },
      '@keyframes bgDown': {
        '0%': {
          background: downColor,
          color: 'var(--color-white)'
        },
        '50%': {
          background: downColor,
          color: 'var(--color-white)'
        },
        '100%': {
          background: 'transparent',
          color: 'var(--color-text-primary)'
        }
      },
      '@keyframes bgSame': {
        '0%': {
          background: 'var(--color-gray-50)'
        },
        '80%': {
          background: 'var(--color-gray-50)'
        },
        '100%': {
          background: 'transparent'
        }
      },
      // '.up': {
      //   animationName: 'bgUp',
      //   animationDuration: '1000ms',
      //   animationIterationCount: 'initial',
      //   animationDirection: 'alternate',
      // },
      // '.down': {
      //   animationName: 'bgDown',
      //   animationDuration: '1000ms',
      //   animationIterationCount: 'initial',
      //   animationDirection: 'alternate'
      // },
      '.up': {
        animationName: 'bgUp',
        animationDuration: '1000ms',
        animationIterationCount: 'initial',
        animationDirection: 'alternate',
        animationTimingFunction: 'ease-in-out',
        animationFillMode: 'initial',
        background: upColor,
        color: 'var(--color-white)'
      },
      '.down': {
        animationName: 'bgDown',
        animationDuration: '1000ms',
        animationIterationCount: 'initial',
        animationDirection: 'alternate',
        animationTimingFunction: 'ease-in-out',
        animationFillMode: 'initial',
        background: downColor,
        color: 'var(--color-white)'
      },
      '.same': {
        // animationName: 'bgSame',
        // animationDuration: '500ms',
        // animationIterationCount: 'initial',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          top: 0,
          right: 0,
          border: `1px solid ${isDark ? gray[575] : gray[130]}`
        },
        background: `${isDark ? gray[720] : gray[50]}`,
        color: 'var(--color-text-primary)'
      }
    }
  })

  return (
    <>
      <Col className={cn('flex pl-2', className)} span={6}>
        {bid ? (
          <div
            className={cn('rounded overflow-hidden text-[13px] leading-4 px-[6px] py-[2px] w-[74px] h-[22px] flex items-center', bidColor)}
            // style={{ background: upColor }}
          >
            {formatNum(bid)}
          </div>
        ) : (
          '--'
        )}
      </Col>
      <Col className={cn('flex', className)} span={6}>
        {ask ? (
          <div
            className={cn(
              'text-gray rounded overflow-hidden text-[13px] leading-4 px-[6px] py-[2px] w-[74px] h-[22px] flex items-center',
              askColor
            )}
            // style={{ background: downColor }}
          >
            {formatNum(ask)}
          </div>
        ) : (
          '--'
        )}
      </Col>
      <Col span={4} className="flex flex-col items-end pr-2">
        {res.hasQuote ? (
          <div className={cn('text-right text-xs font-pf-bold', per > 0 ? 'text-green' : 'text-red')}>
            {bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
          </div>
        ) : (
          '--'
        )}
      </Col>
    </>
  )
}

export default observer(PricePercent)
