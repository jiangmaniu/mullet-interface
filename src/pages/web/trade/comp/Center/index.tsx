import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'
import { useState, useTransition } from 'react'

import Tabs from '@/components/Base/Tabs'

import Futures from '../Futures'
import HeaderStatisInfo from '../HeaderStatisInfo'
import TradingView from '../TradingView'

// pc端中间区域部分
const Center = () => {
  const [tabKey, setTabKey] = useState(1)
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性

  const TabsItems: any = [
    { key: 1, label: <FormattedMessage id="mt.chart" /> },
    { key: 2, label: <FormattedMessage id="mt.heyueshuxing" /> }
  ]

  return (
    <div className="flex h-[700px] flex-1 flex-col bg-primary pb-1 min-w-[400px]">
      <Tabs
        items={TabsItems}
        onChange={(key: any) => {
          startTransition(() => {
            setTabKey(key)
          })
        }}
        tabBarGutter={44}
        tabBarStyle={{ paddingLeft: 26 }}
        size="small"
        marginBottom={0}
      />
      <HeaderStatisInfo />
      {tabKey === 1 && <TradingView />}
      {tabKey === 2 && <Futures />}
    </div>
  )
}

export default observer(Center)
