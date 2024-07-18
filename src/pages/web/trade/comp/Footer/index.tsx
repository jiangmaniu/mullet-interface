import { FormattedMessage } from '@umijs/max'
import { useNetwork } from 'ahooks'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import Marquee from 'react-fast-marquee'

import SignalIcon from '@/components/Base/Svg/SignalIcon'
import { useStores } from '@/context/mobxProvider'
import { goToService } from '@/utils/navigator'
import { getCurrentQuote } from '@/utils/wsUtil'

// 底部浮动条
function Footer() {
  const networkState = useNetwork()
  const { ws, trade } = useStores()
  const connectStatus = ws.connectStatus
  const isConnected = connectStatus === 'CONNECTED' && networkState.online

  const DISCONNECTING = {
    title: <FormattedMessage id="mt.duankailianjie" />,
    desc: <FormattedMessage id="mt.hangqingyiduankaitips" />,
    color: '--color-red-600',
    status: 'DISCONNECTING'
  }
  let connectedStatusMap = networkState.online
    ? {
        NOCONNECT: {
          title: <FormattedMessage id="mt.lianjiezhong" />,
          desc: <FormattedMessage id="mt.hangqinglianjiezhongtips" />,
          color: '--color-yellow-500',
          status: 'NOCONNECT'
        },
        DISCONNECTING,
        CONNECTED: {
          title: <FormattedMessage id="mt.lianjiezhengchang" />,
          desc: <FormattedMessage id="mt.hangqinglianjiezhengchengtips" />,
          color: '--color-green-700',
          status: 'CONNECTED'
        }
      }[connectStatus]
    : DISCONNECTING

  return (
    <div className="fixed bottom-0 left-0 flex h-[26px] w-full items-center bg-white px-5 pb-2 pt-2 border-t border-gray-100 z-40">
      <Tooltip placement="topLeft" title={connectedStatusMap.desc}>
        <div className="flex items-center border-r border-r-gray-200 pr-3">
          <div className="flex items-center">
            {connectedStatusMap.status === 'DISCONNECTING' ? (
              <img src="/img/duankailianjie.png" width={16} height={14} />
            ) : (
              <SignalIcon color={`var(${connectedStatusMap.color})`} />
            )}
            <span className="pl-1 text-xs font-normal text-gray-weak">{connectedStatusMap.title}</span>
          </div>
        </div>
      </Tooltip>
      <div className="flex h-full flex-1 items-center overflow-x-auto">
        <Marquee pauseOnHover speed={30} gradient>
          {trade.symbolList.map((item, idx) => {
            const res = getCurrentQuote(item.symbol)
            const per: any = res.percent
            const bid = res.bid

            return (
              <div key={idx} className="h-full border-r border-r-gray-200 px-4">
                <div
                  className="flex cursor-pointer items-center"
                  onClick={() => {
                    // 记录打开的symbol
                    trade.setOpenSymbolNameList(item.symbol)
                  }}
                >
                  <div className="text-wrap text-xs font-medium text-gray">{item.symbol}</div>
                  <div className={classNames('px-[3px] text-xs font-medium', per > 0 ? 'text-green' : 'text-red')}>
                    {res.bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
                  </div>
                  <div className="px-[3px] text-xs font-medium text-gray-weak">{bid}</div>
                </div>
              </div>
            )
          })}
        </Marquee>
      </div>
      {/* <div className="flex items-center pl-3">
        <div className="flex items-center">
          <img src="/img/download-icon.png" width={22} height={22} alt="" />
          <span className="text-xs font-normal text-gray-weak">
            <FormattedMessage id="mt.xiazai" />
          </span>
        </div>
      </div> */}
      <div className="flex cursor-pointer items-center pl-3 " onClick={goToService}>
        <img src="/img/kefu-icon.png" width={22} height={22} alt="" />
        <span className="text-xs font-normal text-gray-weak">
          <FormattedMessage id="mt.zaixiankefu" />
        </span>
      </div>
    </div>
  )
}

export default observer(Footer)
