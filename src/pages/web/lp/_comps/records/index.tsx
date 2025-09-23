import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export default function VaultDetailRecords() {
  enum TabEnum {
    Balances,
    Positions,
    TransactionHistory,
    FundingFeeHistory,
    DepositsAndWithdrawals,
    Depositor
  }
  const [tab, setTab] = useState<TabEnum>(TabEnum.Balances)

  const options = [
    {
      label: 'Balances',
      value: TabEnum.Balances,
      content: <div>Balance</div>
    },
    {
      label: 'Position',
      value: TabEnum.Positions,
      content: <div>Position</div>
    },
    {
      label: 'Transaction History',
      value: TabEnum.TransactionHistory,
      content: <div>Transaction History</div>
    },
    {
      label: 'Funding Fee History',
      value: TabEnum.FundingFeeHistory,
      content: <div>Funding Fee History</div>
    },
    {
      label: 'Deposits And Withdrawals',
      value: TabEnum.DepositsAndWithdrawals,
      content: <div>Deposits And Withdrawals</div>
    },
    {
      label: 'Depositor',
      value: TabEnum.Depositor,
      content: <div>Depositor</div>
    }
  ]

  return (
    <div className={'rounded-[10px] h-full bg-[#0A0C27]'}>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {options.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-2.5 min-h-[250px]">
          {options.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              {item.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
