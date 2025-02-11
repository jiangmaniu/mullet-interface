import { useStores } from '@/context/mobxProvider'
import { RecordModalItem } from '@/mobx/trade'
import Tabs from '@/pages/webapp/components/Base/Tabs'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { useEffect, useState } from 'react'
import { RenderPendingTab, RenderSpSlTab } from './TabItem'

export type Params = {
  tabKey: 'SPSL' | 'PENDING'
}

type IProps = {
  tabKey?: Params['tabKey']
  item: Order.OrderPageListItem
}

// 持仓列表Tabs
export default function ModifyPendingTopTabbar({ tabKey, item }: IProps) {
  const i18n = useI18n()
  const { t } = i18n
  const [activeKey, setActiveKey] = useState<Params['tabKey']>('SPSL')

  useEffect(() => {
    if (tabKey) {
      setActiveKey(tabKey)
    }
  }, [tabKey])

  const { trade } = useStores()
  useEffect(() => {
    if (item) {
      trade.resetTradeAction({
        orderVolume: String(item.orderVolume)
      }) // 重置
      trade.resetSpSl() // 重置
      // 持仓列表核心赋值操作 ！！！
      if (!item.symbol) return
      console.log('====== 取【当前查看】挂单数据与行情，计算止盈止损 ======')
      trade.setActiveSymbolName(item.symbol)
      trade.setRecordModalItem(item)
      trade.setSp(item?.takeProfit)
      trade.setSl(item?.stopLoss)
    }

    return () => {
      trade.resetSpSl()
      trade.setRecordModalItem({} as RecordModalItem)
      console.log('【当前查看】挂单设为空')
    }
  }, [item])

  return (
    <>
      <Tabs
        activeKey={activeKey}
        items={[
          {
            title: t('pages.position.Order'),
            key: 'PENDING'
          },
          {
            title: t('pages.trade.Spsl'),
            key: 'SPSL'
          }
        ]}
        onChange={(key: any) => {
          setActiveKey(key)
        }}
        fixedActiveLineWidth={64}
        contentPadding={24}
      />
      <View className="px-4">
        {activeKey === 'PENDING' && <RenderPendingTab item={item} />}
        {activeKey === 'SPSL' && <RenderSpSlTab />}
      </View>
    </>
  )
}
