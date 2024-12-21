import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Tabs from '@/pages/webapp/components/Base/Tabs'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import Pending from './Pending'
import Position from './Position'

type TabType = 'POSITION' | 'PENDING'

// 持仓列表Tabs
function PositionListTopTabbar() {
  const i18n = useI18n()
  const { t } = i18n
  const { theme, cn } = useTheme()
  const [activeKey, setActiveKey] = useState<TabType>('POSITION')

  const tabs: any = [
    {
      title: t('pages.position.Position List'),
      key: 'POSITION'
    },
    {
      title: t('pages.position.Order'),
      key: 'PENDING'
    }
  ]

  return (
    <View>
      <View className="flex items-center justify-between px-3 sticky top-0 z-10 w-full" bgColor="secondary">
        <Tabs items={tabs} activeKey={activeKey} onChange={(key) => setActiveKey(key as TabType)} hiddenBottomLine hiddenTabbarLine />
        <View onClick={() => navigateTo('/app/position/record')}>
          <Iconfont name="zhanghu-jilu" size={24} color={theme.colors.textColor.weak} />
        </View>
      </View>
      {activeKey === 'POSITION' && <Position />}
      {activeKey === 'PENDING' && <Pending />}
    </View>
  )
}

export default observer(PositionListTopTabbar)
