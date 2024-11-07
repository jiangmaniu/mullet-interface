import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Col, Row, Tooltip } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useTransition } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import FavoriteIcon from '@/components/Web/FavoriteIcon'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { cn } from '@/utils/cn'

import PricePercent from './PricePercent'

type IProps = {
  item: Account.TradeSymbolListItem
  popupRef?: any
}
/**
 * 行情list item
 * @returns
 */
function QuoteItem({ item, popupRef }: IProps, ref: any) {
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
  const { isMobileOrIpad } = useEnv()
  const { upColor, downColor, isDark } = useTheme()
  const { trade, ws, kline } = useStores()
  const symbol = item.symbol
  const isActive = trade.activeSymbolName === symbol

  const activeClassName = useEmotionCss(({ token }) => {
    return {
      '&:after': {
        position: 'absolute',
        left: 0,
        width: 4,
        height: 19,
        background: isDark ? gray[95] : '#000000',
        borderRadius: '0px 4px 4px 0px',
        content: '""'
      }
    }
  })

  return (
    <>
      <div
        className={cn('relative pl-1 border-b border-gray-100 dark:border-gray-630')}
        onClick={() => {
          startTransition(() => {
            // 切换品种
            trade.switchSymbol(symbol)

            if (isMobileOrIpad) {
              popupRef.current?.close()
            }
          })
        }}
      >
        <Row
          className={cn('flex cursor-pointer items-center rounded pl-2 py-[5px] hover:bg-[var(--list-hover-primary-bg)] relative', {
            'bg-[var(--list-hover-primary-bg)]': isActive,
            [activeClassName]: isActive
          })}
        >
          <Col span={8} className="!flex items-center">
            <FavoriteIcon
              symbol={symbol}
              width={28}
              height={28}
              onClick={(e) => {
                e.stopPropagation()
                trade.toggleSymbolFavorite(symbol)
              }}
            />
            <SymbolIcon src={item?.imgUrl} width={20} height={20} symbol={symbol} showMarketCloseIcon />
            {/* 品种别名 */}
            <Tooltip placement="bottom" title={item.remark}>
              <span className="pl-[6px] text-sm font-pf-bold text-gray tracking-[0.5px]">{(item.alias || '').slice(0, 7)}</span>
            </Tooltip>
          </Col>
          {/* 买卖价格、涨跌幅 */}
          <PricePercent symbol={symbol} />
        </Row>
      </div>
    </>
  )
}

export default observer(forwardRef(QuoteItem))
