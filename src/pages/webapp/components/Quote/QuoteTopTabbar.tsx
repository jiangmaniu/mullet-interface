import { useIntl, useLocation } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { useStores } from '@/context/mobxProvider'

import Tabs from '../Base/Tabs'
import QuoteFlashList from './QuoteFlashList'

export type TabKey =
  /** 收藏 */
  | 'FAVORITE'
  /** 全部 */
  | 'ALL'
  /** 数字货币 */
  | 'CRYPTO'
  /** 商品 */
  | 'COMMODITIES'
  /** 外汇 */
  | 'FOREX'
  /** 指数 */
  | 'INDICES'
  /** 股票 */
  | 'STOCK'

type IProps = {
  onChangeTab?: (tabKey: TabKey) => void
  /** 搜索框输入值 */
  searchValue?: string
  onItem?: (item?: Account.TradeSymbolListItem) => void
  tabKey?: TabKey
  tabValue?: any
  visible?: boolean
  position?: 'PAGE' | 'MODAL'
  height?: number
}

type ITabbarProps = {
  tabKey?: TabKey
  onChange: ({ tabKey, tabValue }: { tabKey: TabKey; tabValue: any }) => void
}

export const SymbolTabbar = observer(({ tabKey, onChange }: ITabbarProps) => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const [activeKey, setActiveKey] = useState<TabKey>('ALL')
  const { trade } = useStores()
  const favoriteList = trade.favoriteList

  const tabList = [
    { key: 'FAVORITE', value: 'FAVORITE', title: intl.formatMessage({ id: 'common.operate.Favorite' }) },
    { key: 'ALL', value: '0', title: intl.formatMessage({ id: 'common.All' }) },
    { key: 'CRYPTO', value: '10', title: intl.formatMessage({ id: 'common.SymbolCategory.Crypto' }) },
    { key: 'COMMODITIES', value: '20', title: intl.formatMessage({ id: 'common.SymbolCategory.Commodities' }) },
    { key: 'FOREX', value: '30', title: intl.formatMessage({ id: 'common.SymbolCategory.Forex' }) },
    { key: 'INDICES', value: '40', title: intl.formatMessage({ id: 'common.SymbolCategory.Indices' }) },
    { key: 'STOCK', value: '50', title: intl.formatMessage({ id: 'common.SymbolCategory.Stock' }) }
  ]

  const tabValue = tabList.find((item) => item.key === activeKey)?.value

  useEffect(() => {
    // 根据路由参数设置activeKey
    const tabKey = location.hash.replace('#', '') as TabKey
    if (tabKey) {
      setActiveKey(tabKey)
    }
  }, [pathname])

  useEffect(() => {
    setTimeout(() => {
      if (tabKey) {
        setActiveKey(tabKey)
      } else if (favoriteList.length > 5) {
        setActiveKey('FAVORITE')
      }
    }, 100)
  }, [tabKey])

  useEffect(() => {
    onChange?.({ tabKey: activeKey, tabValue })
  }, [activeKey, tabValue])

  return (
    <div className="mb-3">
      <Tabs
        tabList={tabList}
        activeKey={activeKey}
        onChange={(key: any) => {
          setActiveKey(key)
          // 同步参数到地址栏
          window.history.replaceState('', '', `${location.pathname}#${key}`)
        }}
      />
    </div>
  )
})

// 行情Tabs
function QuoteTopTabbar({ height, position = 'PAGE', searchValue, onItem, tabKey, tabValue }: IProps) {
  const [activeKey, setActiveKey] = useState<TabKey>('ALL')
  const [activeTabValue, setActiveTabValue] = useState<string>('')

  useEffect(() => {
    if (tabKey) {
      setActiveKey(tabKey)
    }
  }, [tabKey])

  useEffect(() => {
    if (tabValue) {
      setActiveTabValue(tabValue)
    }
  }, [tabValue])

  return (
    <div className="pb-[50px]">
      {position === 'PAGE' && (
        <SymbolTabbar
          tabKey={tabKey}
          onChange={({ tabValue, tabKey }) => {
            setActiveKey(tabKey)
            setActiveTabValue(tabValue)
          }}
        />
      )}
      <QuoteFlashList height={height} onItem={onItem} tabKey={activeKey} tabValue={activeTabValue} searchValue={searchValue} />
    </div>
  )
}

export default observer(QuoteTopTabbar)
