'use client'

import { Trans } from '@/libs/lingui/react/macro'

import { GeneralTooltip } from '@/components/tooltip/general'
import { Button } from '@/libs/ui/components/button'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number'
import { useStores } from '@/context/mobxProvider'
import { observer } from 'mobx-react'
import { useState, useEffect } from 'react'
import { getCurrentQuote } from '@/utils/wsUtil'

export const AccountDetails = observer(() => {
  const { trade } = useStores()
  const totalProfit = trade.accountBalanceInfo.totalProfit
  const currentAccountInfo = trade.currentAccountInfo
  const currencyDecimal = currentAccountInfo.currencyDecimal || 2 // 账户组小数位

  const { occupyMargin } = trade.getAccountBalance()
  const { hasQuote } = getCurrentQuote()
  // 没有行情取当前账号余额展示
  const balance = hasQuote ? trade.accountBalanceInfo.balance : trade.currentAccountInfo.money

  const { availableMargin } = trade.getAccountBalance()
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 设置一个定时器强制更新availableMargin的值
    const timer = setInterval(() => {
      if (count > 5) {
        clearInterval(timer)
      }
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [count])

  const options = [
    {
      label: (
        <GeneralTooltip content={<Trans>未计入当前未结算头寸的金额</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>账户余额</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: BNumber.toFormatNumber(balance, {
        unit: 'USDC',
        volScale: currencyDecimal
      })
    },
    {
      label: (
        <GeneralTooltip content={<Trans>我们为维持您当前持仓持有的资金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>占用保证金</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),

      value: BNumber.toFormatNumber(occupyMargin, {
        unit: 'USDC',
        volScale: currencyDecimal
      })
    },
    {
      label: (
        <GeneralTooltip content={<Trans>当前仓位的浮动盈亏已包含相应的手续费和库存费</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>未结盈亏</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: BNumber.toFormatNumber(totalProfit, {
        unit: 'USDC',
        volScale: currencyDecimal
      })
    },
    {
      label: (
        <GeneralTooltip content={<Trans>可用于开创建仓位的资金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>可用保证金</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: (
        <div key={count}>
          {BNumber.toFormatNumber(availableMargin, {
            unit: 'USDC',
            volScale: currencyDecimal
          })}
        </div>
      )
    }
  ]

  return (
    <div className="rounded-large bg-primary flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-important-1">
          <Trans>账户详情</Trans>
        </div>

        <div className="flex gap-3">
          <div>
            <Button variant="outline" size="sm" color="default">
              取现
            </Button>
          </div>
          <div>
            <Button variant="primary" size="sm" color="primary">
              存款
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((item, i) => (
          <div key={i} className="text-paragraph-p3 flex items-center justify-between gap-2">
            <div className="text-content-4">{item.label}</div>
            <div className="text-content-1">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
})
