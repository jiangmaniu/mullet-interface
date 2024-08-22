import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Col, Row } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useTransition } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
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
    bidColor = res?.bidDiff > 0 ? upColor : downColor
    askColor = res?.askDiff > 0 ? upColor : downColor
    // 涨跌额涨跌幅是0显示灰色
    if (per === 0) {
      bidColor = 'var(--color-gray-50)'
      askColor = 'var(--color-gray-50)'
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

  return (
    <>
      <div
        className="relative pl-1 border-b border-gray-100"
        onClick={() => {
          startTransition(() => {
            // 记录打开的symbol
            trade.setOpenSymbolNameList(symbol)
            // 设置当前当前的symbol
            trade.setActiveSymbolName(symbol)

            if (isMobileOrIpad) {
              popupRef.current?.close()
            }
          })
        }}
      >
        {/* {isActive && <CaretRightOutlined className="absolute -left-1 top-4" />} */}
        <Row
          className={classNames('flex cursor-pointer items-center rounded pl-2 py-[11px] hover:bg-sub-hover relative', {
            'bg-sub-hover': isActive,
            [activeClassName]: isActive
          })}
        >
          <Col span={7} className="!flex items-center">
            <SymbolIcon src={item?.imgUrl} width={20} height={20} />
            {/* 品种别名 */}
            <span className="pl-[6px] text-sm font-pf-bold text-gray tracking-[0.5px]">{item.symbol}</span>
          </Col>
          <Col span={7} className="flex">
            {bid ? (
              <div
                className="text-gray rounded text-[13px] leading-4 px-[6px] py-[2px]"
                style={{ background: bidColor, color: bidColor ? '#fff' : '' }}
              >
                {bid}
              </div>
            ) : (
              '--'
            )}
          </Col>
          <Col span={7} className="flex">
            {ask ? (
              <div
                className="text-gray rounded text-[13px] leading-4 px-[6px] py-[2px]"
                style={{ background: askColor, color: bidColor ? '#fff' : '' }}
              >
                {ask}
              </div>
            ) : (
              '--'
            )}
          </Col>
          <Col span={3} className="flex flex-col items-end pr-2">
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
