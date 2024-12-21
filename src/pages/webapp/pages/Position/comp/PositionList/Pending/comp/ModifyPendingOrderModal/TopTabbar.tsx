import { useTheme } from '@/context/themeProvider'
import Tabs from '@/pages/webapp/components/Base/Tabs'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { useEffect, useState } from 'react'
import { OnValueChange, RenderPendingTab, RenderSpSlTab } from './TabItem'

export type Params = {
  tabKey: 'SPSL' | 'PENDING'
}

type IProps = {
  tabKey?: Params['tabKey']
  item: Order.OrderPageListItem
  // spslInfo: IModifyPending
  /** 监听输入框值变化 */
  onValueChange?: OnValueChange
  onChangeTab?: (tabKey: Params['tabKey']) => void
}

// 持仓列表Tabs
export default function ModifyPendingTopTabbar({ tabKey, onChangeTab, onValueChange, item }: IProps) {
  const i18n = useI18n()
  const { t } = i18n
  const { theme, cn } = useTheme()
  const [activeKey, setActiveKey] = useState<Params['tabKey']>('SPSL')

  useEffect(() => {
    if (tabKey) {
      setActiveKey(tabKey)
    }
  }, [tabKey])

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
        {activeKey === 'PENDING' && <RenderPendingTab onValueChange={onValueChange} item={item} />}
        {activeKey === 'SPSL' && <RenderSpSlTab />}
      </View>
    </>
  )
}
