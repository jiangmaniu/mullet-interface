import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Col, Row } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'

import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import useCurrentQuoteInfo from '@/hooks/useCurrentQuoteInfo'
import { formatNum } from '@/utils'

type IProps = {
  item?: any
  isActive?: boolean
  popupRef?: any
}
/**
 * 行情list item
 * @returns
 */
function QuoteItem({ item, isActive, popupRef }: IProps) {
  const { isMobileOrIpad } = useEnv()
  const { global, ws } = useStores()
  const symbol = item.name

  const res = useCurrentQuoteInfo(item.name)
  const bid = res.bid
  const per: any = res.per

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
        className="relative pl-1"
        onClick={() => {
          // 记录打开的symbol
          global.setOpenSymbolNameList(symbol)
          // 设置当前当前的symbol
          global.setActiveSymbolName(symbol)

          if (isMobileOrIpad) {
            popupRef.current?.close()
          }
        }}
      >
        {/*激活打开的项展示当前的箭头 */}
        {/* {isActive && <CaretRightOutlined className="absolute -left-1 top-4" />} */}
        <Row
          className={classNames('flex cursor-pointer pr-4 items-center rounded px-3 py-[10px] hover:bg-sub-hover relative', {
            'bg-sub-hover': isActive,
            [activeClassName]: isActive
          })}
        >
          <Col span={12} className="!flex items-center">
            <img
              width={32}
              height={32}
              alt=""
              src={`/img/${global.favoriteList.some((item: any) => item.name === symbol) ? 'star-active' : 'star'}.png`}
              onClick={(e) => {
                e.stopPropagation()
                global.toggleSymbolFavorite(symbol)
              }}
            />
            <img width={28} height={28} alt="" src={`/img/coin-icon/${item.name}.png`} className="rounded-full" />
            <div className="flex flex-col pl-1">
              <span className="pl-[6px] text-xs font-semibold text-gray">{item.label}</span>
              {/* 币种描述 @TODO */}
              <span className="pl-[6px] text-xs text-gray-weak pt-1">Bitcoin</span>
            </div>
          </Col>
          <Col span={12} className="flex flex-col items-end">
            <div className="font-dingpro-medium text-[15px] text-gray text-right">{formatNum(bid)}</div>
            <div className={classNames('text-right font-dingpro-medium text-xs', per > 0 ? 'text-green' : 'text-red')}>
              {bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default observer(QuoteItem)
