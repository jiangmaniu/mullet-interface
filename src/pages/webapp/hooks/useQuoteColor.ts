import { useMemo } from 'react'

import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { useGetCurrentQuoteCallback } from '@/utils/wsUtil'
import { useEmotionCss } from '@ant-design/use-emotion-css'

type IProps = {
  /** 交易品种item */
  item?: Account.TradeSymbolListItem
}
export default function useQuoteColor(props?: IProps) {
  const { item } = props || {}
  const { trade } = useStores()
  const { cn, theme } = useTheme()
  const { isPc } = useEnv()
  const { up: upColor, down: downColor, isDark } = theme
  const symbol = item?.symbol || trade.activeSymbolName
  const getCurrentQuote = useGetCurrentQuoteCallback()
  const res = getCurrentQuote(symbol)

  const { bid, ask, percent: per } = useMemo(() => res, [res])

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

  const quoteWrapperClassName = useEmotionCss((token) => {
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
          border: `1px solid ${isDark ? gray[575] : theme.colors.borderColor.weak}`
        },
        background: `${isDark ? gray[720] : theme.colors.gray[80]}`,
        color: 'var(--color-text-primary)'
      }
    }
  })

  return {
    bidColor,
    askColor,
    quoteWrapperClassName,
    bid,
    ask,
    per,
    low: res.low,
    high: res.high,
    spread: res.spread
  }
}
