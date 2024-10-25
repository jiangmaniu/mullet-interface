import { ProFormSelectProps } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

import LevelAgeModal from './LevelAgeModal'
import MarginTypeModal from './MarginTypeModal'

type IProps = ProFormSelectProps

// 全仓、逐仓、杠杆选择
export default function SelectMarginTypeOrLevelAge({ fieldProps, onChange, ...res }: IProps) {
  const { trade } = useStores()
  const { prepaymentConf } = getCurrentQuote()
  const mode = prepaymentConf?.mode
  const isFixedMargin = mode === 'fixed_margin' // 固定预付款
  const isFixedLeverage = mode === 'fixed_leverage' // 固定杠杆
  const isFloatLeverage = mode === 'float_leverage' // 浮动杠杆
  const marginOptions = [
    {
      label: <FormattedMessage id="mt.quancang" />,
      value: 'CROSS_MARGIN'
    },
    {
      label: <FormattedMessage id="mt.zhucang" />,
      value: 'ISOLATED_MARGIN'
    }
  ]
  const marginLabel = marginOptions.find((item) => item.value === trade.marginType)?.label
  let leverage: any
  if (isFixedMargin) {
    leverage = <FormattedMessage id="mt.gudingyufukuan" />
  } else if (isFixedLeverage) {
    leverage = `${prepaymentConf?.fixed_leverage?.leverage_multiple}X`
  } else if (isFloatLeverage) {
    leverage = `${trade.leverageMultiple || 1}X`
  }

  const disabledMarginBtn = !trade.currentAccountInfo.enableIsolated || trade.disabledTradeAction()

  return (
    <div className="flex items-center justify-between gap-x-3">
      <MarginTypeModal
        trigger={
          <div
            className={cn(
              'mb-3 flex flex-1 items-center border border-gray-200 hover:border-gray-380 dark:border-gray-580 rounded-lg cursor-pointer p-[6.8px]',
              {
                'bg-[--input-disabled-bg] pointer-events-none': disabledMarginBtn
              }
            )}
          >
            <img src="/img/margin-1.png" width={24} height={24} />
            <div className="text-primary text-sm font-semibold flex-1 text-center">{marginLabel}</div>
            <Iconfont name="gengduo-caozuo" width={24} height={24} color="var(--color-text-primary)" />
          </div>
        }
      />
      <LevelAgeModal
        trigger={
          <div
            className={cn(
              'mb-3 flex flex-1 items-center border border-gray-200 hover:border-gray-380 dark:border-gray-580 rounded-lg cursor-pointer p-[6.8px]',
              {
                'pointer-events-none': !isFloatLeverage,
                'bg-[--input-disabled-bg]': trade.disabledTradeAction()
              }
            )}
          >
            <img src={isFixedMargin ? '/img/margin-3.png' : '/img/margin-2.png'} width={24} height={24} />
            <div className="text-primary text-sm flex-1 text-center font-semibold">{leverage}</div>
            {isFloatLeverage && <Iconfont name="gengduo-caozuo" width={24} height={24} color="var(--color-text-primary)" />}
          </div>
        }
      />
    </div>
  )
}
