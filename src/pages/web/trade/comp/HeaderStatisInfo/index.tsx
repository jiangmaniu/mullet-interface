import { CaretDownOutlined, InfoCircleOutlined, MenuUnfoldOutlined, RightOutlined } from '@ant-design/icons'
import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import FavoriteIcon from '@/components/Web/FavoriteIcon'
import { useStores } from '@/context/mobxProvider'
import useClickOutside from '@/hooks/useOnClickOutside'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

import Futures from '../Futures'
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

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <>
          <div className="flex items-center justify-between px-[10px] py-2 border-b border-[var(--divider-line-color)]">
            <div className="flex items-center w-full gap-x-[92px]">
              <div className="flex items-end xxl:w-[300px] xxl:flex-row xl:w-[180px] xl:items-start xl:flex-col">
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
              <div className="flex items-center gap-x-4 flex-1">
                {/* @TODO 只有数字货币才展示 */}
                {/* <div className="flex flex-col">
                  <span className="text-xs text-weak">
                    <FormattedMessage id="mt.zijinhuilvdaojishi" />
                  </span>
                  <span className="pt-1 !font-dingpro-medium text-sm text-primary">0.0100% / 5:31:23</span>
                </div> */}
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
          </div>
        </>
      }
      wapComponent={
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div
              className="flex cursor-pointer items-center"
              onClick={() => {
                sidebarRef?.current?.show()
              }}
            >
              <MenuUnfoldOutlined className="mr-3 text-xl" />
              <img width={26} height={26} alt="" src={`/img/coin-icon/${symbol}.png`} className="rounded-full" />
              <span className="pl-[6px] pr-1 text-base font-semibold text-primary">{symbol}</span>
              <CaretDownOutlined className="text-weak" />
            </div>
            <div
              className="flex items-center"
              onClick={() => {
                trade.toggleSymbolFavorite()
              }}
            >
              <img width={34} height={34} alt="" src={`/img/${trade.isFavoriteSymbol ? 'star-active' : 'star'}.png`} />
            </div>
          </div>
          <div className="flex items-end justify-between pt-3">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className={cn('text-[26px] font-bold', color)}>{res.close}</span>
                <span className={cn('pl-2 text-xs font-semibold', color)}>{res.percent > 0 ? '+' + res.percent : res.percent}%</span>
              </div>
              <div className="mt-1 flex">
                <Futures
                  trigger={
                    <div className="flex cursor-pointer items-center rounded-[4px] bg-brand/20 px-2 py-1">
                      <InfoCircleOutlined className="text-brand" />
                      <span className="px-1 text-xs text-brand">
                        <FormattedMessage id="mt.heyueshuxing" />
                      </span>
                      <RightOutlined className="text-brand" />
                    </div>
                  }
                />
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col">
                <div className="flex">
                  <div className="text-xs text-weak">
                    <FormattedMessage id="mt.kai" />
                  </div>
                  <div className="pl-2 text-xs text-weak">{res.open}</div>
                </div>
                <div className="flex pt-1">
                  <div className="text-xs text-weak">
                    <FormattedMessage id="mt.shou" />
                  </div>
                  <div className="pl-2 text-xs text-weak">{res.close}</div>
                </div>
              </div>
              <div className="flex flex-col pl-3">
                <div className="flex">
                  <div className="text-xs text-weak">
                    <FormattedMessage id="mt.gao" />{' '}
                  </div>
                  <div className="pl-2 text-xs text-weak">{res.high}</div>
                </div>
                <div className="flex pt-1">
                  <div className="text-xs text-weak">
                    <FormattedMessage id="mt.di" />
                  </div>
                  <div className="pl-2 text-xs text-weak">{res.low}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}

export default observer(HeaderStatisInfo)
