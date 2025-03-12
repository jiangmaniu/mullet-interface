// @ts-nocheck
import { FormattedMessage } from '@umijs/max'
import { useNetwork, useScroll } from 'ahooks'
import { Button, Tooltip } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'
import Marquee from 'react-fast-marquee'

import SignalIcon from '@/components/Base/Svg/SignalIcon'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { cn } from '@/utils/cn'
import { goKefu } from '@/utils/navigator'
import { useGetCurrentQuoteCallback } from '@/utils/wsUtil'

// 底部浮动条
function Footer() {
  const { theme } = useTheme()
  const { isDark } = theme
  const networkState = useNetwork()
  const { ws, trade, kline } = useStores()
  const readyState = ws.socket?.readyState || ws.readyState || 0
  const isOnline = networkState.online
  const [openTips, setOpenTips] = useState<any>(false)
  const disConnected = !isOnline || readyState === 3
  const scroll = useScroll(document)
  const isRefreshRef = useRef(false)

  const getCurrentQuote = useGetCurrentQuoteCallback()

  const handleRefresh = () => {
    // 行情重新建立新的连接
    ws.reconnect()
    // 重置tradingview实例
    kline.destroyed()
  }

  useEffect(() => {
    setOpenTips(!isOnline || readyState === 3)
  }, [isOnline, readyState])

  useEffect(() => {
    if (scroll?.top > 100) {
      setOpenTips(false)
    }
  }, [scroll])

  useEffect(() => {
    if (openTips) {
      setTimeout(() => {
        setOpenTips(false)
      }, 5000)
    }
  }, [openTips])

  useEffect(() => {
    if (disConnected && !isRefreshRef.current) {
      isRefreshRef.current = true
      // 自动刷新连接状态
      handleRefresh()
    }
  }, [disConnected])

  const CLOSED: any = {
    title: <FormattedMessage id="mt.duankailianjie" />,
    desc: <FormattedMessage id="mt.hangqingyiduankaitips" />,
    color: '--color-red-600',
    status: 3
  }

  let connectedStatusMap = isOnline
    ? {
        0: {
          title: <FormattedMessage id="mt.lianjiezhong" />,
          desc: <FormattedMessage id="mt.hangqinglianjiezhongtips" />,
          color: '--color-yellow-500',
          status: 0
        },
        1: {
          title: <FormattedMessage id="mt.lianjiezhengchang" />,
          desc: <FormattedMessage id="mt.hangqinglianjiezhengchengtips" />,
          color: '--color-green-700',
          status: 1
        },
        2: {
          title: <FormattedMessage id="mt.lianjieguanbizhong" />,
          desc: <FormattedMessage id="mt.hangqinglianjieguanbizhong" />,
          color: '--color-red-600',
          status: 2
        },
        3: CLOSED
      }[readyState]
    : CLOSED

  return (
    <div className="fixed bottom-0 left-0 flex h-[26px] w-full items-center bg-primary px-5 pb-2 pt-2 border-t border-gray-60 dark:border-[var(--border-primary-color)] z-40">
      <Tooltip
        placement="topLeft"
        title={
          <span>
            {connectedStatusMap?.desc}
            {disConnected && (
              <Button type="link" onClick={handleRefresh}>
                <FormattedMessage id="common.shuaxin" />
              </Button>
            )}
          </span>
        }
        open={openTips}
        onOpenChange={(value) => {
          setOpenTips(value)
        }}
      >
        <div className="flex items-center border-r border-r-gray-200 dark:border-r-gray-700 pr-3">
          <div className="flex items-center">
            {disConnected ? (
              <img src="/img/duankailianjie.png" width={16} height={14} />
            ) : (
              <SignalIcon color={`var(${connectedStatusMap?.color})`} />
            )}
            <span className="pl-1 text-xs font-normal text-weak">{connectedStatusMap?.title}</span>
          </div>
          {/* 没有行情数据推送 */}
          {/* {!isQuotePushing && (
            <div className="flex items-center">
              <SignalIcon color={`var(--color-yellow-500)`} />
              <span className="pl-1 text-xs font-normal text-weak">
                <FormattedMessage id="mt.lianjiezhengchang" />
              </span>
            </div>
          )} */}
        </div>
      </Tooltip>
      <div className="flex h-full flex-1 items-center overflow-x-auto overflow-y-hidden">
        <Marquee pauseOnHover speed={30} gradient={isDark ? false : true}>
          {trade.symbolListAll.map((item, idx) => {
            const res = getCurrentQuote(item.symbol)
            const per: any = res.percent
            const bid = res.bid

            return (
              <div key={idx} className="h-full w-[160px] flex items-center justify-center border-r border-r-gray-200 dark:border-gray-700">
                <div
                  className="flex cursor-pointer items-center"
                  onClick={() => {
                    // 切换品种
                    trade.switchSymbol(item.symbol)
                  }}
                >
                  <div className="text-wrap text-xs font-medium text-primary py-1">{item.alias}</div>
                  <div className={cn('px-[3px] text-xs font-medium', per > 0 ? 'text-green' : 'text-red')}>
                    {res.bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
                  </div>
                  <div className="px-[3px] text-xs font-medium text-weak">{bid}</div>
                </div>
              </div>
            )
          })}
        </Marquee>
      </div>
      {/* <div className="flex items-center pl-3">
        <div className="flex items-center">
          <img src="/img/download-icon.png" width={22} height={22} alt="" />
          <span className="text-xs font-normal text-weak">
            <FormattedMessage id="mt.xiazai" />
          </span>
        </div>
      </div> */}
      <div className="flex cursor-pointer items-center pl-3 " onClick={goKefu}>
        <img src="/img/kefu-icon.png" width={22} height={22} alt="" />
        <span className="text-xs font-normal text-weak">
          <FormattedMessage id="mt.zaixiankefu" />
        </span>
      </div>
    </div>
  )
}

export default observer(Footer)
