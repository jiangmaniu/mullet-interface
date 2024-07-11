import { FormattedMessage, useIntl } from '@umijs/max'
import { cloneDeep, groupBy } from 'lodash'
import { observer } from 'mobx-react'

import Dropdown from '@/components/Base/Dropdown'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { useStores } from '@/context/mobxProvider'
import { formatNum, uniqueObjectArray } from '@/utils'
import { getCurrentQuote } from '@/utils/wsUtil'

import Gauge from './Gauge'

/**提示爆仓、仓位展示组件，开了杠杆才展示 */
function Liquidation() {
  const intl = useIntl()
  const { trade } = useStores()
  const activeSymbolName = trade.activeSymbolName
  const quoteInfo = getCurrentQuote() // 保留，取值触发更新
  const marginRateInfo = trade.getMarginRateInfo()
  const currentAccountInfo = trade.currentAccountInfo
  const isLockedMode = currentAccountInfo.orderMode === 'LOCKED_POSITION' // 锁仓模式

  // 筛选逐仓列表
  const isolatedMarginList = cloneDeep(trade.positionList.filter((item) => item.marginType === 'ISOLATED_MARGIN'))

  let list = []
  // 逐仓单 + 订单锁仓模式 分开多笔订单筛选，不做合并展示
  if (isLockedMode) {
    // 按品种进行分组
    const tempGroupMap = groupBy(isolatedMarginList, 'symbol')
    let tempArr: any = []
    Object.keys(tempGroupMap).forEach((key) => {
      if (tempGroupMap[key]?.length) {
        // 分组在按顺序展开合并
        tempArr.push(
          ...tempGroupMap[key].map((item: any, idx: number) => ({
            ...item,
            value: item.id, // 持仓单号
            key: item.id,
            label: `${item.symbol} ${intl.formatMessage({ id: 'mt.zhucang' })}${idx + 1}`
          }))
        )
      }
    })
    list = tempArr
  } else {
    // 合并多笔相同的逐仓单
    list = uniqueObjectArray(isolatedMarginList, 'symbol').map((item: any) => ({
      ...item,
      label: `${item.symbol} ${intl.formatMessage({ id: 'mt.zhucang' })}`,
      value: item.id, // 持仓单号
      key: item.id
    }))
  }

  const options = [
    {
      label: intl.formatMessage({ id: 'mt.quancang' }),
      value: 'CROSS_MARGIN',
      key: 'CROSS_MARGIN'
      // imgUrl: trade.getActiveSymbolInfo().imgUrl
    },
    ...list
  ]
  const selectInfo = options.find((item) => item?.value === trade.currentLiquidationSelectBgaId)

  return (
    <div>
      <div className="px-4">
        <div className="flex items-center pb-2 pt-2">
          <div className="pt-3 flex items-center">
            {!isolatedMarginList.length && (
              <div className="text-gray text-xs">
                <FormattedMessage id="mt.quancang" />
              </div>
            )}
            {!trade.positionList.length && (
              <span className="text-xs text-gray-weak pl-2">
                <FormattedMessage id="mt.weicangwei" />
              </span>
            )}
          </div>
          {isolatedMarginList.length > 0 && (
            <Dropdown
              menu={{
                items: options,
                onClick: (item) => {
                  trade.setCurrentLiquidationSelectBgaId(item.key)
                }
              }}
            >
              <div className="cursor-pointer flex items-center mt-2">
                <span className="text-xs text-gray select-none">
                  {selectInfo?.label}
                  {trade.currentLiquidationSelectBgaId !== 'CROSS_MARGIN' && (
                    <span className="text-gray bg-gray-150/60 px-[6px] py-[1px] text-[11px] rounded ml-[5px]">
                      {selectInfo.buySell === 'BUY' ? <FormattedMessage id="mt.duo" /> : <FormattedMessage id="mt.kong" />}
                    </span>
                  )}
                </span>
                <SelectSuffixIcon opacity={0.4} />
              </div>
            </Dropdown>
          )}
        </div>
        <div className="flex items-center flex-col">
          <div className="flex items-center justify-center flex-col relative w-full">
            <Gauge />
            <span className="text-base !font-dingpro-medium absolute -bottom-8">
              {formatNum(marginRateInfo.balance, { precision: 2 })} USD
            </span>
          </div>
          <div className="flex flex-col w-full mt-[45px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-weak text-xs">
                <FormattedMessage id="mt.baozhengjinlv" />：
              </span>
              <span className="text-green font-semibold text-xs">
                {marginRateInfo.marginRate ? `${marginRateInfo.marginRate}%` : '0.00%'}
              </span>
            </div>
            <div className="flex items-center pt-[10px] justify-between">
              <span className="text-gray-weak text-xs">
                <FormattedMessage id="mt.weichibaozhengjin" />：
              </span>
              <span className="text-green !font-dingpro-medium font-medium text-xs">{formatNum(marginRateInfo.margin)}USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(Liquidation)
