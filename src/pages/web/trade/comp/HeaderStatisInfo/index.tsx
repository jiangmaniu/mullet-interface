import { CaretDownOutlined, InfoCircleOutlined, MenuUnfoldOutlined, RightOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import useCurrentQuote from '@/hooks/useCurrentQuote'
import useClickOutside from '@/hooks/useOnClickOutside'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { formatNum } from '@/utils'

import Futures from '../Futures'
import Sidebar from '../Sidebar'

type IProps = {
  sidebarRef?: any
}

function HeaderStatisInfo({ sidebarRef }: IProps) {
  const { ws, trade } = useStores()
  const symbol = trade.activeSymbolName
  const [showSidebar, setShowSidebar] = useState(false)

  const res: any = useCurrentQuote()
  const color = res.percent > 0 ? 'text-green' : 'text-red'

  const openSidebarRef = useRef<any>()
  useClickOutside([openSidebarRef], () => {
    setShowSidebar(false)
  })

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <>
          <div className="flex items-center justify-between px-[10px] py-2">
            <div className="flex items-center">
              <div className="w-[300px] flex items-center">
                <div
                  className="flex cursor-pointer items-center relative"
                  onClick={() => {
                    setShowSidebar(true)
                  }}
                  ref={openSidebarRef}
                >
                  <img src="/img/menu-icon2.png" height={24} width={24} />
                  <span className="pl-[6px] pr-[5px] text-base font-semibold text-gray">{symbol}</span>
                  <img
                    src="/img/down.png"
                    height={24}
                    width={24}
                    style={{ transform: showSidebar ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.4s ease-in-out' }}
                  />

                  <div
                    className="absolute z-[100] left-0 top-[50px] rounded-b-xl rounded-tr-xl border-x border-b border-[#f3f3f3] bg-white"
                    style={{
                      boxShadow: '0px 2px 10px 10px rgba(227, 227, 227, 0.1)',
                      display: showSidebar ? 'block' : 'none'
                    }}
                  >
                    <Sidebar style={{ minWidth: 400 }} showFixSidebar={false} />
                  </div>
                </div>
                <div className="flex items-center pl-6">
                  <span className={classNames('font-dingpro-medium text-xl', color)}>{formatNum(res.close)}</span>
                  {!!res.bid && (
                    <span className={classNames('pl-2 text-base', color)}>{res.percent > 0 ? `+${res.percent}%` : `${res.percent}%`}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center pl-12 gap-x-12">
                {/* @TODO 只有数字货币才展示 */}
                {/* <div className="flex flex-col">
                  <span className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.zijinhuilvdaojishi" />
                  </span>
                  <span className="pt-1 font-dingpro-medium text-sm text-gray">0.0100% / 5:31:23</span>
                </div> */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.kai" />
                  </span>
                  <span className="pt-1 font-dingpro-medium text-sm text-gray">{formatNum(res.open)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.gao" />
                  </span>
                  <span className="pt-1 font-dingpro-medium text-xs text-gray">{formatNum(res.high)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.di" />
                  </span>
                  <span className="pt-1 font-dingpro-medium text-sm text-gray">{formatNum(res.low)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.shou" />
                  </span>
                  <span className="pt-1 font-dingpro-medium text-sm text-gray">{formatNum(res.close)}</span>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                trade.toggleSymbolFavorite()
              }}
              className="cursor-pointer"
            >
              <img width={32} height={32} alt="" src={`/img/${trade.isFavoriteSymbol ? 'star-active' : 'star'}.png`} />
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
              <span className="pl-[6px] pr-1 text-base font-semibold text-gray">{symbol}</span>
              <CaretDownOutlined className="text-gray-weak" />
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
                <span className={classNames('text-[26px] font-bold', color)}>{res.close}</span>
                <span className={classNames('pl-2 text-xs font-semibold', color)}>
                  {res.percent > 0 ? '+' + res.percent : res.percent}%
                </span>
              </div>
              <div className="mt-1 flex">
                <Futures
                  trigger={
                    <div className="flex cursor-pointer items-center rounded-[4px] bg-primary-secondary/20 px-2 py-1">
                      <InfoCircleOutlined className="text-primary" />
                      <span className="px-1 text-xs text-primary">
                        <FormattedMessage id="mt.heyueshuxing" />
                      </span>
                      <RightOutlined className="text-primary" />
                    </div>
                  }
                />
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col">
                <div className="flex">
                  <div className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.kai" />
                  </div>
                  <div className="pl-2 text-xs text-gray-weak">{res.open}</div>
                </div>
                <div className="flex pt-1">
                  <div className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.shou" />
                  </div>
                  <div className="pl-2 text-xs text-gray-weak">{res.close}</div>
                </div>
              </div>
              <div className="flex flex-col pl-3">
                <div className="flex">
                  <div className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.gao" />{' '}
                  </div>
                  <div className="pl-2 text-xs text-gray-weak">{res.high}</div>
                </div>
                <div className="flex pt-1">
                  <div className="text-xs text-gray-weak">
                    <FormattedMessage id="mt.di" />
                  </div>
                  <div className="pl-2 text-xs text-gray-weak">{res.low}</div>
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
