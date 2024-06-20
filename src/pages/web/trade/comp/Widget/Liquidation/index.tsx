import { ProFormSelect } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { formatNum, uniqueObjectArray } from '@/utils'
import { getSymbolIcon } from '@/utils/business'
import { getCurrentQuote } from '@/utils/wsUtil'

import Gauge from './Gauge'

/**提示爆仓、仓位展示组件，开了杠杆才展示 */
function Liquidation() {
  const intl = useIntl()
  const { trade } = useStores()
  const activeSymbolName = trade.activeSymbolName
  const quoteInfo = getCurrentQuote() // 保留，取值触发更新
  const marginRateInfo = trade.getMarginRateInfo()

  // 筛选逐仓列表
  const positionList = trade.positionList.filter((item) => item.marginType === 'ISOLATED_MARGIN')
  const list = uniqueObjectArray(positionList, 'symbol').map((item: any) => ({
    ...item,
    label: `${item.symbol} ${intl.formatMessage({ id: 'mt.zhucang' })}`,
    value: item.symbol
  }))

  const options = [
    {
      label: `${activeSymbolName} ${intl.formatMessage({ id: 'mt.quancang' })}`,
      value: 'CROSS_MARGIN',
      imgUrl: trade.getActiveSymbolInfo().imgUrl
    },
    ...list
  ]

  return (
    <div>
      <div className="px-4">
        <div className="flex items-center pb-2 pt-2">
          {trade.positionList.length > 0 && activeSymbolName && (
            <ProFormSelect
              fieldProps={{
                size: 'middle',
                value: trade.currentLiquidationSelect,
                onChange: (value: any) => {
                  trade.setCurrentLiquidationSelect(value)
                },
                optionItemRender: (item: any) => {
                  return (
                    <div className="flex items-center truncate w-full">
                      <img src={getSymbolIcon(item.imgUrl)} alt="" className="w-[20px] h-[20px] rounded-full" />
                      <span className="text-gray !text-xs pl-1">{item.label}</span>
                    </div>
                  )
                },
                style: { minWidth: 120 },
                suffixIcon: <img src="/img/down2.png" width={14} height={14} style={{ opacity: 0.4 }} />
              }}
              allowClear={false}
              options={options}
            />
          )}

          {!trade.positionList.length && (
            <span className="text-xs text-gray-weak pl-2">
              <FormattedMessage id="mt.weicangwei" />
            </span>
          )}
        </div>
        <div className="flex items-center flex-col">
          <div className="flex items-center justify-center flex-col relative">
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
