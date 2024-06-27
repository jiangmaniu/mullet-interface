import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
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

  // 筛选逐仓列表
  const isolatedMarginList = trade.positionList.filter((item) => item.marginType === 'ISOLATED_MARGIN')
  const list = uniqueObjectArray(isolatedMarginList, 'symbol').map((item: any) => ({
    ...item,
    label: `${item.symbol} ${intl.formatMessage({ id: 'mt.zhucang' })}`,
    value: item.symbol,
    key: item.symbol
  }))

  const options = [
    {
      label: intl.formatMessage({ id: 'mt.quancang' }),
      value: 'CROSS_MARGIN',
      key: 'CROSS_MARGIN',
      imgUrl: trade.getActiveSymbolInfo().imgUrl
    },
    ...list
  ]
  const currentLiquidationSelectLabel = options.find((item) => item?.value === trade.currentLiquidationSelect)?.label

  const selectClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-item-option-content': {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px !important'
      },
      '.ant-select-selection-item': {
        fontSize: '12px !important'
      }
    }
  })

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
          {/* <ProFormSelect
              bordered={false}
              fieldProps={{
                size: 'middle',
                popupClassName: selectClassName,
                className: selectClassName,
                value: trade.currentLiquidationSelect,
                onChange: (value: any) => {
                  trade.setCurrentLiquidationSelect(value)
                },
                style: { minWidth: 0 },
                suffixIcon: <img src="/img/down2.png" width={14} height={14} style={{ opacity: 0.4 }} />
              }}
              allowClear={false}
              options={options}
            /> */}
          {isolatedMarginList.length > 0 && (
            <Dropdown
              menu={{
                items: options,
                onClick: (item) => {
                  trade.setCurrentLiquidationSelect(item.key)
                }
              }}
            >
              <div className="cursor-pointer flex items-center mt-2">
                <span className="text-xs text-gray select-none">{currentLiquidationSelectLabel}</span>
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
