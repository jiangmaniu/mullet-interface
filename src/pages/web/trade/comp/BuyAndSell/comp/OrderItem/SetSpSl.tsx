import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import useTrade from '@/hooks/useTrade'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

const SpScopeProfit = observer(() => {
  const { isBuy, sp_scope, spFlag, spValueEstimate } = useTrade()

  return (
    <div className={cn('flex items-start gap-x-2 w-full pl-[2px]', { '!text-red': spFlag })}>
      <span className="!font-dingpro-regular pb-[2px]">
        <FormattedMessage id="mt.fanwei" />
        <span className="px-[2px]">{isBuy ? '≥' : '≤'}</span>
        <span className="dark:text-primary">{formatNum(sp_scope)} USD</span>
      </span>
      <span className="!font-dingpro-regular">
        <FormattedMessage id="mt.yujiyingkui" />
        <span className="pl-[2px]">
          <span className="dark:text-primary">{spValueEstimate} USD</span>
        </span>
      </span>
    </div>
  )
})

const SlScopeProfit = observer(() => {
  const { isBuy, sl_scope, slFlag, slValueEstimate } = useTrade()

  return (
    <div className={cn('flex gap-x-2 items-start w-full pl-[2px]', { '!text-red': slFlag })}>
      <span className="!font-dingpro-regular pb-[2px]">
        <FormattedMessage id="mt.fanwei" />
        <span className="px-[2px]">{isBuy ? '≤' : '≥'}</span>
        <span className="dark:text-primary">{formatNum(sl_scope)} USD</span>
      </span>
      <span className="!font-dingpro-regular">
        <FormattedMessage id="mt.yujiyingkui" />
        <span className="pl-[2px]">
          <span className="dark:text-primary">{slValueEstimate} USD</span>
        </span>
      </span>
    </div>
  )
})

type IProps = {
  /**是否展示Label标签 */
  showLabel?: boolean
}

function SetSpsl({ showLabel }: IProps) {
  const intl = useIntl()
  let { disabledTrade, spValue, slValue, onSpAdd, onSpMinus, onSlAdd, onSlMinus, setSl, setSp } = useTrade()

  const renderContent = useMemo(() => {
    return (
      <>
        <InputNumber
          showFloatTips={false}
          label={showLabel ? intl.formatMessage({ id: 'mt.zhiying' }) : ''}
          placeholder={intl.formatMessage({ id: 'mt.zhiying' })}
          rootClassName="!z-40 mb-2"
          classNames={{ input: 'text-center' }}
          value={spValue}
          onChange={(value: any) => {
            setSp(value)
          }}
          onAdd={onSpAdd}
          onMinus={onSpMinus}
          disabled={disabledTrade}
        />
        <div className="text-xs text-secondary pb-3">
          <SpScopeProfit />
        </div>
        <InputNumber
          showFloatTips={false}
          label={showLabel ? intl.formatMessage({ id: 'mt.zhisun' }) : ''}
          placeholder={intl.formatMessage({ id: 'mt.zhisun' })}
          rootClassName="!z-30 !mb-2"
          classNames={{ input: 'text-center' }}
          value={slValue}
          onChange={(value: any) => {
            setSl(value)
          }}
          onAdd={onSlAdd}
          onMinus={onSlMinus}
          disabled={disabledTrade}
        />
        <div className="text-xs text-secondary pb-3">
          <SlScopeProfit />
        </div>
      </>
    )
  }, [disabledTrade, slValue, spValue, onSlAdd, onSpAdd, onSlMinus, onSpMinus, setSl, setSp])

  return <>{renderContent}</>
}

export default observer(SetSpsl)
