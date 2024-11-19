import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo, useRef, useState } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import FavoriteIcon from '@/components/Web/FavoriteIcon'
import { useStores } from '@/context/mobxProvider'
import useClickOutside from '@/hooks/useOnClickOutside'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

import Sidebar from '../Sidebar'

type IProps = {
  sidebarRef?: any
}

function HeaderStatisInfo({ sidebarRef }: IProps) {
  const { ws, trade } = useStores()
  const symbol = trade.activeSymbolName
  const [showSidebar, setShowSidebar] = useState(false)
  const { openTradeSidebar } = useModel('global')
  const symbolInfo = (trade.openSymbolNameList || []).find((item) => item?.symbol === symbol)
  const isMarketOpen = trade.isMarketOpen(symbol)

  const res: any = getCurrentQuote()
  const color = res.percent > 0 ? 'text-green' : 'text-red'

  const openSidebarRef = useRef<any>()
  useClickOutside([openSidebarRef], () => {
    setShowSidebar(false)
  })

  const renderFavorite = useMemo(() => {
    return (
      <div
        onClick={() => {
          trade.toggleSymbolFavorite()
        }}
        className="cursor-pointer"
      >
        <FavoriteIcon
          width={34}
          height={34}
          symbol={symbol}
          onClick={(e) => {
            e.stopPropagation()
            trade.toggleSymbolFavorite(symbol)
          }}
        />
      </div>
    )
  }, [symbol])

  return (
    <>
      <div className="flex items-center justify-between px-[10px] py-2 border-b border-[var(--divider-line-color)]">
        <div className="flex items-center w-full gap-x-[6px]">
          <div className="flex items-end xxl:w-[380px] xxl:flex-row xl:w-[300px] xl:items-start xl:flex-col">
            <div
              className={cn('flex items-center relative xxl:top-1', {
                'cursor-pointer': !openTradeSidebar
              })}
              onClick={() => {
                setShowSidebar(true)
              }}
              ref={openSidebarRef}
            >
              <SymbolIcon
                width={28}
                height={28}
                src={symbolInfo?.imgUrl}
                showMarketCloseIcon
                className="relative xl:top-[9px] xxl:top-0"
                closeIconStyle={{
                  width: 18,
                  height: 18
                }}
              />
              <div
                className="flex items-center xl:relative xl:left-[5px] xxl:left-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSidebar(!showSidebar)
                }}
              >
                <span className="pl-[6px] pr-[5px] text-base font-semibold text-primary">{symbolInfo?.alias}</span>
                {/* 收起侧边栏才展示箭头 */}
                {!openTradeSidebar && (
                  <img
                    src="/img/down.png"
                    height={24}
                    width={24}
                    style={{ transform: showSidebar ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.4s ease-in-out' }}
                  />
                )}
              </div>

              <div
                className="absolute z-[100] left-0 top-[50px] rounded-b-xl rounded-br-xl border-x border-b border-[#f3f3f3] dark:border-[var(--border-primary-color)] dark:overflow-hidden bg-white dark:!shadow-none"
                style={{
                  boxShadow: '0px 2px 10px 10px rgba(227, 227, 227, 0.1)',
                  display: showSidebar && !openTradeSidebar ? 'block' : 'none'
                }}
              >
                <Sidebar style={{ minWidth: 400 }} showFixSidebar={false} />
              </div>
            </div>
            <div className="flex items-center xxl:pl-3 xl:pl-7 !pt-[2px] xl:relative xl:top-[-6px] xl:left-[10px] xxl:top-0 xxl:left-0">
              {res.hasQuote && (
                <>
                  <span className={cn('!font-dingpro-medium text-xl', res.percent > 0 ? 'text-green' : 'text-red')}>
                    {formatNum(res.bid)}
                  </span>
                  {isMarketOpen && (
                    <span className={cn('pl-2 text-base !font-dingpro-medium', color)}>
                      {res.percent > 0 ? `+${res.percent}%` : `${res.percent}%`}
                    </span>
                  )}
                  {!isMarketOpen && (
                    <span className="text-sm leading-6 px-[6px] rounded-[6px] text-red-600 bg-red-600/10 dark:text-red-650 dark:bg-red-650/10 ml-2">
                      <FormattedMessage id="mt.xiushizhong" />
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-4 xxl:gap-x-10 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-weak">
                <FormattedMessage id="mt.kaipanjiage" />
              </span>
              <span className="!font-dingpro-medium text-sm text-primary">{formatNum(res.open)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-weak">
                <FormattedMessage id="mt.shoupanjiage" />
              </span>
              <span className="!font-dingpro-medium text-sm text-primary">{formatNum(res.close)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-weak">
                <FormattedMessage id="mt.24xiaoshizuigao" />
              </span>
              <span className="!font-dingpro-medium text-sm text-primary">{formatNum(res.high)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-weak">
                <FormattedMessage id="mt.24xiaoshizuidi" />
              </span>
              <span className="!font-dingpro-medium text-sm text-primary">{formatNum(res.low)}</span>
            </div>
          </div>
        </div>
        {renderFavorite}
      </div>
    </>
  )
}

export default observer(HeaderStatisInfo)
