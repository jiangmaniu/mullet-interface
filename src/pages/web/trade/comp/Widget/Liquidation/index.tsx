import { ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import { cloneDeep, groupBy } from 'lodash-es'
import { observer } from 'mobx-react'
import { useMemo, useTransition } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { formatNum, uniqueObjectArray } from '@/utils'
import { getSymbolIcon } from '@/utils/business'
import { cn } from '@/utils/cn'
import { covertProfit, getCurrentQuote } from '@/utils/wsUtil'

import Gauge from './Gauge'

/**提示爆仓、仓位展示组件 */
function Liquidation() {
  const intl = useIntl()
  const { trade } = useStores()
  const { isDark } = useTheme()
  const activeSymbolName = trade.activeSymbolName
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
  const quoteInfo = getCurrentQuote() // 保留，取值触发更新
  const currentAccountInfo = trade.currentAccountInfo

  // 筛选逐仓列表
  const isolatedMarginList = cloneDeep(trade.positionList.filter((item) => item.marginType === 'ISOLATED_MARGIN'))

  // 当前筛选的逐仓单订单信息
  const currentLiquidationSelectItem = trade.positionList.find((item) => item.id === trade.currentLiquidationSelectBgaId)
  const currentLiquidationSelectSymbol = currentLiquidationSelectItem?.symbol // 当前选择的品种
  const isLockedMode = currentAccountInfo.orderMode === 'LOCKED_POSITION' // 锁仓模式

  let filterPositionList: any = []
  // 逐仓单，订单是锁仓模式下，有多个相同品种，单独筛选展示，不需要合并同名品种
  if (isLockedMode) {
    filterPositionList = [currentLiquidationSelectItem]
  } else {
    // 合并同名品种展示
    filterPositionList = trade.positionList.filter((item) => item.symbol === currentLiquidationSelectSymbol)
  }
  if (filterPositionList.length) {
    filterPositionList.forEach((item: any) => {
      const profit = covertProfit(item) as number // 浮动盈亏
      item.profit = profit
    })
  }

  const marginRateInfo = trade.calcIsolatedMarginRateInfo(filterPositionList)

  const options = useMemo(() => {
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
              label: `${item.alias || item.symbol} ${intl.formatMessage({ id: 'mt.zhucang' })}${idx + 1}`
            }))
          )
        }
      })
      list = tempArr
    } else {
      // 合并多笔相同的逐仓单
      list = uniqueObjectArray(isolatedMarginList, 'symbol').map((item: any) => ({
        ...item,
        label: `${item.alias || item.symbol} ${intl.formatMessage({ id: 'mt.zhucang' })}`,
        value: item.id, // 持仓单号
        key: item.id
      }))
    }
    return [
      {
        label: intl.formatMessage({ id: 'mt.quancang' }),
        value: 'CROSS_MARGIN',
        key: 'CROSS_MARGIN',
        imgUrl: trade.getActiveSymbolInfo().imgUrl
      },
      ...list
    ]
  }, [isolatedMarginList.length])

  const selectClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-item-option-content': {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px !important'
      },
      '.ant-select-selection-item': {
        fontSize: '12px !important'
      },
      '.ant-select-selector': {
        border: `1px solid var(--input-border) !important`
      }
    }
  })

  const renderSelect = useMemo(() => {
    return (
      <>
        {isolatedMarginList.length > 0 && (
          <ProFormSelect
            fieldProps={{
              size: 'large',
              popupClassName: selectClassName,
              className: selectClassName,
              value: trade.currentLiquidationSelectBgaId,
              onChange: (value: any) => {
                startTransition(() => {
                  trade.setCurrentLiquidationSelectBgaId(value)
                })
              },
              optionRender: (item: any) => {
                return <>{item.label}</>
              },
              style: { width: 282, height: 40, marginTop: 10, position: 'relative', left: -7 },
              suffixIcon: <Iconfont name="down" width={24} height={24} color={isDark ? '#fff' : gray[400]} />,
              // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
              optionLabelProp: 'label'
            }}
            allowClear={false}
            options={options.map((item) => {
              const isBuy = item.buySell === 'BUY'
              const isLockedPosition = item.mode === 'LOCKED_POSITION'
              return {
                ...item,
                label: (
                  <div className="flex items-center truncate w-full h-[26px]">
                    {/* 全仓 使用默认icon*/}
                    <img
                      src={item.value === 'CROSS_MARGIN' ? '/img/all.png' : getSymbolIcon(item.imgUrl)}
                      alt=""
                      className="w-[20px] h-[20px] rounded-full border border-gray-90"
                    />
                    <span className="text-primary !text-xs pl-1">{item.label}</span>
                    {/* 逐仓-锁仓模式展示 */}
                    {isLockedPosition && (
                      <span className={cn('text-white px-[2px] py-[1px] text-xs rounded ml-[5px]', isBuy ? 'bg-green' : 'bg-red')}>
                        {isBuy ? <FormattedMessage id="mt.duo" /> : <FormattedMessage id="mt.kong" />}
                      </span>
                    )}
                  </div>
                )
              }
            })}
          />
        )}
      </>
    )
  }, [isolatedMarginList.length, options, trade.currentLiquidationSelectBgaId])

  return (
    <div>
      <div className="px-4">
        <div className="flex items-center pb-2 pt-2">
          <div className="pt-2 flex items-center">
            {!isolatedMarginList.length && (
              <div className="text-primary text-sm font-pf-bold">
                <FormattedMessage id="mt.quancang" />
              </div>
            )}
            {!trade.positionList.length && (
              <span className="text-xs text-weak pl-2">
                <FormattedMessage id="mt.weicangwei" />
              </span>
            )}
          </div>
          {renderSelect}
        </div>
        <div className="flex items-center flex-col">
          <div className="flex items-center justify-center flex-col relative w-full">
            <Gauge marginRate={marginRateInfo.marginRate} />
            <span className="text-base !font-dingpro-medium text-primary absolute -bottom-8">
              {formatNum(marginRateInfo.balance, { precision: 2 })} USD
            </span>
          </div>
          <div className="flex flex-col w-full mt-[40px]">
            <div className="flex items-center justify-between">
              <span className="text-secondary text-xs">
                <FormattedMessage id="mt.baozhengjinlv" />：
              </span>
              {marginRateInfo.marginRate ? (
                <span className="text-green font-semibold text-xs">{`${marginRateInfo.marginRate}%`}</span>
              ) : (
                <span className="text-weak font-medium text-xs">-</span>
              )}
            </div>
            <div className="flex items-center pt-[10px] justify-between">
              <span className="text-secondary text-xs">
                <FormattedMessage id="mt.weichibaozhengjin" />：
              </span>
              {marginRateInfo.margin ? (
                <span className="text-green !font-dingpro-medium font-medium text-xs">
                  {formatNum(marginRateInfo.margin, { precision: 2 })}USD
                </span>
              ) : (
                <span className="text-weak font-medium text-xs">-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(Liquidation)
