import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import Tabs from '@/pages/webapp/components/Base/Tabs'
import { Text } from '@/pages/webapp/components/Base/Text'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { useMemo, useState } from 'react'
import FundRecord from './comp/FundRecord'
import HistoryClose from './comp/HistoryClose'
import HistoryPending from './comp/HistoryPending'
import HistoryPosition from './comp/HistoryPosition'

/**
 * 导航
 */
export type HistoryRecordTabParamList = {
  HistoryPending: undefined
  HistoryClose: undefined
  HistoryPosition: undefined
  FundRecord: undefined
}

// const Tab = createMaterialTopTabNavigator<HistoryRecordTabParamList>()

// export type HistoryRecordNavigationProp<T extends keyof HistoryRecordTabParamList> = MaterialTopTabScreenProps<HistoryRecordTabParamList, T>
// export type HistoryRecordRouteProp<T extends keyof HistoryRecordTabParamList> = RouteProp<HistoryRecordTabParamList, T>

// 历史记录Tabs
export default function HistoryRecordTopTabbar() {
  const i18n = useI18n()
  const { t, locale } = i18n
  const { theme, cn } = useTheme()

  const tabbarMinWidth = useMemo(() => (locale === 'zh-TW' ? 70 : 120), [locale])
  const indicatorWidth = 40

  const tabBarLabel = (props: any) => (
    <Text
      style={{
        color: props.color,
        textAlign: 'center',
        minWidth: tabbarMinWidth,
        // backgroundColor: 'red',
        fontWeight: props.focused ? '500' : '400',
        fontSize: 16
      }}
    >
      {props.children}
    </Text>
  )

  const items = [
    {
      key: 'HistoryPending',
      title: t('pages.position.HistoryPendingOrder'),
      component: () => <HistoryPending />
    },
    {
      key: 'HistoryClose',
      title: t('pages.position.HistoryCloseOrder'),
      // component: HistoryClose
      component: () => <HistoryClose />
    },
    {
      key: 'HistoryPosition',
      title: t('pages.position.HistoryPosition'),
      component: () => <HistoryPosition />
    },
    {
      key: 'FundRecord',
      title: t('pages.position.FundRecord'),
      component: () => <FundRecord />
    }
  ]

  const [tabKey, setTabKey] = useState<'HistoryPending' | 'HistoryClose' | 'HistoryPosition' | 'FundRecord'>('HistoryPending')

  const onChange = (key: string) => {
    setTabKey(key as 'HistoryPending' | 'HistoryClose' | 'HistoryPosition' | 'FundRecord')
  }

  return (
    <Basiclayout
      // edges={['top']}
      fixedHeight
      bgColor="secondary"
      headerColor={theme.colors.backgroundColor.secondary}
      header={
        <div style={{ backgroundColor: theme.colors.backgroundColor.secondary }}>
          <Header
            style={{ paddingLeft: 14, paddingRight: 14, backgroundColor: theme.colors.backgroundColor.secondary }}
            title={i18n.t('app.pageTitle.HistoryRecord')}
            back={true}
          />
          <Tabs stretch style={{ backgroundColor: theme.colors.backgroundColor.secondary }} items={items} onChange={onChange} />
        </div>
      }
    >
      {items.find((item) => item.key === tabKey)?.component && items.find((item) => item.key === tabKey)?.component()}
    </Basiclayout>
  )
}
