'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { startTransition, useState } from 'react'

import { GeneralTooltip } from '@/components/tooltip/general'
import { Button } from '@/libs/ui/components/button'
import { Input } from '@/libs/ui/components/input'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { SliderTooltip } from '@/libs/ui/components/slider-tooltip'
import { Switch } from '@/libs/ui/components/switch'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number'
import { TradeActionPanelOrderPrice } from './order-price'
import { MarginModeModal } from '../modal/margin-mode-modal'

// import { AdjustMarginModal } from '../adjust-margin-modal'
// import { ClosePositionModal } from '../close-position-modal'
// import { OrderConfirmModal } from '../order-confirm-modal'
// import { PositionPnlModal } from '../position-pnl-modal'
import { SettingLeverageModal } from '../modal/setting-leverage-modal'
import { useStores } from '@/context/mobxProvider'
import { observer } from 'mobx-react'
import { MarginModeSetting } from './margin-mode-setting'
import { TradingLeverage } from './trading-leverage'
import { TRADE_ORDER_TYPE_OPTIONS } from '../../_options/order'
import { TradeActionPanelTpAndSl } from './tp-and-sl'
import { TradeActionPanelOrderDirection } from './order-direction'

export const TradeActionPanel = observer(() => {
  const [leverage, setLeverage] = useState(1)
  const [tradeType, setTradeType] = useState<'market' | 'limit'>('market')
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy')
  const [stopLimit, setStopLimit] = useState(false)
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false)
  const { trade } = useStores()

  const [selectedOrderType, setSelectedOrderType] = useState(trade.orderType)

  const [accountPercent, setAccountPercent] = useState('')

  return (
    <div className="rounded-large bg-primary flex h-full flex-col gap-3 p-3">
      <div className="flex flex-col gap-2">
        <div className="gap-xl flex flex-wrap">
          <MarginModeSetting />
          <TradingLeverage />
          {/* <AdjustMarginModal>
            <Button className="flex-1" variant={'primary'} size={'md'} color="default">
              <Trans>调整保证金</Trans>
            </Button>
          </AdjustMarginModal> */}
          {/* <ClosePositionModal>
            <Button className="flex-1" variant={'primary'} size={'md'} color="default">
              <Trans>平仓</Trans>
            </Button>
          </ClosePositionModal> */}
          {/* <PositionPnlModal>
            <Button className="flex-1" variant={'primary'} size={'md'} color="default">
              <Trans>平仓</Trans>
            </Button>
          </PositionPnlModal> */}
        </div>

        <Tabs
          value={selectedOrderType}
          onValueChange={(value) => {
            startTransition(() => {
              trade.setOrderType(value)
              // 重置买卖类型
              trade.setBuySell('BUY')
              setSelectedOrderType(value)
            })
          }}
        >
          <TabsList className="gap-medium">
            {TRADE_ORDER_TYPE_OPTIONS.map((option, i) => {
              return (
                <TabsTrigger className="flex-1" key={i} value={option.value}>
                  {option.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* 交易表单 */}
      <div className="gap-xl flex flex-col">
        <TradeActionPanelOrderDirection />

        <TradeActionPanelOrderPrice />

        {/* 保证金 */}
        <div className={'gap-medium flex flex-col'}>
          <Input placeholder="0.00" />

          <div className={'flex items-center justify-between gap-2'}>
            <div>
              <GeneralTooltip content={<Trans>可用保证金</Trans>}>
                <TooltipTriggerDottedText>
                  <Trans>可用保证金</Trans>
                </TooltipTriggerDottedText>
              </GeneralTooltip>
            </div>
            <div className={'text-content-1 text-paragraph-p3'}>{BNumber.toFormatNumber(1000, { unit: 'USDC', volScale: 2 })}</div>
          </div>
        </div>

        <div className={'gap-xl flex items-center'}>
          <SliderTooltip
            className="flex-1"
            min={0}
            step={1}
            max={100}
            tooltipFormat={([value]) => {
              return <div className="text-white">{value}%</div>
            }}
            // isShowMarkLabels
            isShowMarks
            interval={100 / 4}
            value={[BNumber.from(accountPercent).toNumber()]}
            onValueChange={(val) => {
              setAccountPercent(val[0]!.toString())
            }}
          />

          <NumberInput
            className={'w-[80px]'}
            value={accountPercent}
            onValueChange={({ value }, { source }) => {
              if (source === NumberInputSourceType.EVENT) {
                setAccountPercent(value)
              }
            }}
            size={'sm'}
            placeholder={({ isFocused }) => {
              return <>{isFocused || accountPercent ? '数量' : '0 '}</>
            }}
            RightContent={'%'}
          />
        </div>

        <TradeActionPanelTpAndSl />

        {/* 下单按钮 */}
        <Button
          block
          variant="primary"
          color="primary"
          size="md"
          onClick={() => {
            setIsOrderConfirmModalOpen(true)
          }}
        >
          下单
        </Button>
        {/* <OrderConfirmModal
          isOpen={isOrderConfirmModalOpen}
          onClose={() => {
            setIsOrderConfirmModalOpen(false)
          }}
          onConfirm={() => {
            console.log('onConfirm')
          }}
        /> */}

        <OrderOverview />
      </div>
    </div>
  )
})

const OrderOverview = () => {
  const list = [
    {
      label: (
        <GeneralTooltip content={<Trans>合约价值</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>合约价值</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(1230, { unit: 'USDC', volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>平均价差</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>平均价差</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(1)}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>强平价格</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>强平价格</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(3312, { volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>基础保证金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>基础保证金</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(231, { volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>费用</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>费用</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatPercent(0.1)}</>
    }
  ]

  return (
    <div className="flex flex-col gap-3">
      {list.map((item, i) => {
        return (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="text-content-4">{item.label}</div>
            <div className="text-content-1 text-paragraph-p3">{item.value}</div>
          </div>
        )
      })}
    </div>
  )
}
