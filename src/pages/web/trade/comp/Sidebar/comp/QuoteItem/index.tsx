import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Col, Row, Tooltip } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useTransition } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum } from '@/utils'
import mitt from '@/utils/mitt'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  item: Account.TradeSymbolListItem
  isActive?: boolean
  popupRef?: any
}
/**
 * 行情list item
 * @returns
 */
function QuoteItem({ item, isActive, popupRef }: IProps) {
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
  const { isMobileOrIpad } = useEnv()
  const { upColor, downColor } = useTheme()
  const { trade, ws } = useStores()
  const symbol = item.symbol
  const res = getCurrentQuote(symbol)
  const bid = res.bid // 卖价
  const ask = res.ask // 买价
  const per: any = res.percent

  let bidColor = ''
  let askColor = ''

  if (res.hasQuote && Object.keys(res.quotes).length) {
    askColor = res?.askDiff > 0 ? 'up' : 'down'
    bidColor = res?.bidDiff > 0 ? 'up' : 'down'
    // 涨跌额涨跌幅是0显示灰色
    if (res?.askDiff === 0) {
      askColor = 'same'
    }
    if (res?.bidDiff === 0) {
      bidColor = 'same'
    }
  }

  const activeClassName = useEmotionCss(({ token }) => {
    return {
      '&:after': {
        position: 'absolute',
        left: 0,
        width: 4,
        height: 19,
        background: '#000000',
        borderRadius: '0px 4px 4px 0px',
        content: '""'
      }
    }
  })

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
      '.up': {
        animationName: 'bgUp',
        animationDuration: '1000ms',
        animationIterationCount: 'initial',
        animationDirection: 'alternate'
      },
      '.down': {
        animationName: 'bgDown',
        animationDuration: '1000ms',
        animationIterationCount: 'initial',
        span: {
          color: 'var(--color-white)'
        }
      },
      '.same': {
        // animationName: 'bgSame',
        // animationDuration: '500ms',
        // animationIterationCount: 'initial',
        background: 'var(--color-gray-50)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-gray-130)'
      }
    }
  })

  return (
    <>
      <div
        className={classNames('relative pl-1 border-b border-gray-100', className)}
        onClick={() => {
          startTransition(() => {
            // 记录打开的symbol
            trade.setOpenSymbolNameList(symbol)
            // 设置当前当前的symbol
            trade.setActiveSymbolName(symbol)

            // 切换品种事件
            mitt.emit('symbol_change')

            if (isMobileOrIpad) {
              popupRef.current?.close()
            }
          })
        }}
      >
        {/* {isActive && <CaretRightOutlined className="absolute -left-1 top-4" />} */}
        <Row
          className={classNames(
            'flex cursor-pointer items-center rounded pl-2 py-[11px] hover:bg-[var(--list-hover-primary-bg)] relative',
            {
              'dark:bg-gray-660 bg-[var(--list-hover-primary-bg)]': isActive,
              [activeClassName]: isActive
            }
          )}
        >
          <Col span={8} className="!flex items-center">
            <SymbolIcon src={item?.imgUrl} width={20} height={20} />
            {/* 品种别名 */}
            <Tooltip placement="bottom" title={item.remark}>
              <span className="pl-[6px] text-sm font-pf-bold text-gray tracking-[0.5px]">{item.alias}</span>
            </Tooltip>
          </Col>
          <Col span={6} className="flex">
            {bid ? (
              <div
                className={classNames('rounded text-[13px] leading-4 px-[6px] py-[2px] w-[74px] h-[22px] flex items-center', bidColor)}
                // style={{ background: upColor }}
              >
                {formatNum(bid)}
              </div>
            ) : (
              '--'
            )}
          </Col>
          <Col span={6} className="flex">
            {ask ? (
              <div
                className={classNames(
                  'text-gray rounded text-[13px] leading-4 px-[6px] py-[2px] w-[74px] h-[22px] flex items-center',
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
              <div className={classNames('text-right !font-dingpro-medium text-xs', per > 0 ? 'text-green' : 'text-red')}>
                {bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
              </div>
            ) : (
              '--'
            )}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default observer(QuoteItem)
