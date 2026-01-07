import { useStores } from '@/context/mobxProvider'
import { t, Trans } from '@/libs/lingui/react/macro'
import { BNumber } from '@/libs/utils/number'
import { observer } from 'mobx-react'
import Gauge from './Gauge'
import { useEffect, useMemo } from 'react'
import { groupBy } from 'lodash-es'
import { uniqueObjectArray } from '@/utils'
import { Select } from '@/libs/ui/components/select'
import { SelectTrigger } from '@/libs/ui/components/select'
import { SelectValue } from '@/libs/ui/components/select'
import { SelectContent } from '@/libs/ui/components/select'
import { SelectItem } from '@/libs/ui/components/select'
import { getSymbolIcon } from '@/utils/business'
import { Chip } from '@/libs/ui/components/chip'

export const PositionDashboard = observer(() => {
  return (
    <div className="mt-3 rounded-large py-3 px-xl bg-primary flex flex-col gap-2.5">
      <PositionSelector />
      <PositionMargin />
      <PositionMarginRate />
    </div>
  )
})

const PositionSelector = observer(() => {
  const { trade } = useStores()

  const currentAccountInfo = trade.currentAccountInfo
  const isolatedMarginList = trade.positionList.filter((item) => item.marginType === 'ISOLATED_MARGIN')
  const crossMarginList = trade.positionList.filter((item) => item.marginType === 'CROSS_MARGIN')
  const isHasCrossMarginPosition = crossMarginList.length > 0
  const isLockedMode = currentAccountInfo.orderMode === 'LOCKED_POSITION' // 锁仓模式

  useEffect(() => {
    // 仓位列表变化，重置选择到全仓
    trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
  }, [trade.positionList.length])

  const options = useMemo(() => {
    let list: Partial<{ label: string; value: string; key: string; imgUrl?: string } & Order.BgaOrderPageListItem>[] = []
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
              label: `${item.alias || item.symbol} ${t`逐仓`}${idx + 1}`
            }))
          )
        }
      })
      list = tempArr
    } else {
      // 合并多笔相同的逐仓单
      list = uniqueObjectArray(isolatedMarginList, 'symbol').map((item: any) => ({
        ...item,
        label: `${item.alias || item.symbol} ${t`逐仓`}`,
        value: item.id, // 持仓单号
        key: item.id
      }))
    }

    if (isHasCrossMarginPosition) {
      list.unshift({
        label: t`全仓`,
        value: 'CROSS_MARGIN',
        key: 'CROSS_MARGIN',
        imgUrl: trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll).imgUrl
      })
    }

    return list
  }, [isolatedMarginList.length])

  useEffect(() => {
    if (!!options[0]?.value) {
      trade.setCurrentLiquidationSelectBgaId(options[0].value)
    }
  }, [options[0]])

  return (
    <div>
      {isolatedMarginList.length > 0 ? (
        <div>
          <Select
            value={trade.currentLiquidationSelectBgaId}
            onValueChange={(value) => {
              trade.setCurrentLiquidationSelectBgaId(value)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => {
                const isBuy = option.buySell === 'BUY'
                const isLockedPosition = option.mode === 'LOCKED_POSITION'

                return (
                  <SelectItem key={option.value} value={option.value!}>
                    <div className="flex items-center gap-3">
                      <img
                        src={option.value === 'CROSS_MARGIN' ? '/img/all.png' : getSymbolIcon(option.imgUrl)}
                        alt=""
                        className="w-[20px] h-[20px] rounded-full border border-gray-90"
                      />

                      {option.label}
                      {isLockedPosition && <Chip color={isBuy ? 'rise' : 'fall'}>{isBuy ? <Trans>买</Trans> : <Trans>麦</Trans>}</Chip>}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      ) : isHasCrossMarginPosition ? (
        <div className="text-important-2 text-content-1">
          <Trans>全仓</Trans>
        </div>
      ) : (
        <div className="text-important-2 text-content-4">
          <Trans>无仓位</Trans>
        </div>
      )}
    </div>
  )
})

const PositionMargin = observer(() => {
  const { trade } = useStores()

  const marginRateInfo = trade.rightWidgetSelectMarginInfo

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <Gauge marginRate={marginRateInfo.marginRate} />
      <div className="text-important-2 text-content-1">
        {BNumber.toFormatNumber(marginRateInfo.margin, {
          unit: trade.currentAccountInfo.currencyUnit,
          volScale: trade.currentAccountInfo.currencyDecimal
        })}
      </div>
    </div>
  )
})

const PositionMarginRate = observer(() => {
  const { trade } = useStores()

  const marginRateInfo = trade.rightWidgetSelectMarginInfo
  const options = [
    {
      label: <Trans>保证金率</Trans>,
      value: <>{BNumber.toFormatPercent(marginRateInfo.marginRate, { isRaw: false })}</>
    },
    {
      label: <Trans>维持保证金</Trans>,
      value: (
        <>
          {BNumber.toFormatNumber(marginRateInfo.margin, {
            unit: trade.currentAccountInfo.currencyUnit,
            volScale: trade.currentAccountInfo.currencyDecimal
          })}
        </>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-xl">
      {options.map((option, index) => {
        return (
          <div className="flex items-center justify-between gap-2 text-paragraph-p3" key={index}>
            <div className="text-content-4">{option.label}</div>
            <div className="text-content-1">{option.value}</div>
          </div>
        )
      })}
    </div>
  )
})
