import { getIntl, useIntl, useLocation } from '@umijs/max'
import { observer } from 'mobx-react'
import qs from 'qs'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'

import { cn } from '@/utils/cn'
import { Swiper, SwiperRef } from 'antd-mobile'
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
  tabIndex?: number
  visible?: boolean
  position?: 'PAGE' | 'MODAL'
  height?: number
  onSwiperChange?: ({ activeKey, index }: { activeKey: TabKey; index: number }) => void
}

type ITabbarProps = {
  tabKey?: TabKey
  onChange: ({ tabKey, tabValue }: { tabKey: TabKey; tabValue: any; index?: number }) => void
  onChangeIndex?: (index: number) => void
  position?: 'PAGE' | 'MODAL'
  className?: string
}

const getTabList = () => [
  { key: 'FAVORITE', value: 'FAVORITE', title: getIntl().formatMessage({ id: 'common.operate.Favorite' }) },
  { key: 'ALL', value: '0', title: getIntl().formatMessage({ id: 'common.All' }) },
  { key: 'CRYPTO', value: '10', title: getIntl().formatMessage({ id: 'common.SymbolCategory.Crypto' }) },
  { key: 'COMMODITIES', value: '20', title: getIntl().formatMessage({ id: 'common.SymbolCategory.Commodities' }) },
  { key: 'FOREX', value: '30', title: getIntl().formatMessage({ id: 'common.SymbolCategory.Forex' }) },
  { key: 'INDICES', value: '40', title: getIntl().formatMessage({ id: 'common.SymbolCategory.Indices' }) },
  { key: 'STOCK', value: '50', title: getIntl().formatMessage({ id: 'common.SymbolCategory.Stock' }) }
]

export const SymbolTabbar = observer(
  forwardRef(({ tabKey, onChange, onChangeIndex, position, className }: ITabbarProps, ref: any) => {
    const intl = useIntl()
    const { pathname } = useLocation()
    const [activeKey, setActiveKey] = useState<TabKey>('ALL')
    const { trade } = useStores()
    const favoriteList = trade.favoriteList
    const isPageMode = position === 'PAGE'

    const tabList = getTabList()
    const tabValue = tabList.find((item) => item.key === activeKey)?.value

    useEffect(() => {
      // 根据路由参数设置activeKey
      const tabKey = qs.parse(location.search, { ignoreQueryPrefix: true }).tabKey as TabKey
      if (tabKey && isPageMode) {
        setTimeout(() => {
          setActiveKey(tabKey)
        }, 200)
      }
    }, [pathname, isPageMode])

    useEffect(() => {
      if (tabKey) {
        setActiveKey(tabKey)
      }
    }, [tabKey, favoriteList.length])

    useEffect(() => {
      setTimeout(() => {
        if (favoriteList.length > 5) {
          setActiveKey('FAVORITE')
        }
      }, 100)
    }, [favoriteList.length])

    useEffect(() => {
      onChange?.({ tabKey: activeKey, tabValue, index: tabList.findIndex((item) => item.key === activeKey) })
    }, [activeKey, tabValue])

    useImperativeHandle(ref, () => {
      return {
        tabList
      }
    })

    return (
      <div className={cn('mb-3', className)}>
        <Tabs
          items={tabList}
          activeKey={activeKey}
          onChange={(key: any) => {
            setActiveKey(key)
            // 同步参数到地址栏
            isPageMode && window.history.replaceState('', '', `${location.pathname}?tabKey=${key}`)

            const index = tabList.findIndex((item) => item.key === key)
            onChangeIndex?.(index)
          }}
        />
      </div>
    )
  })
)

// 行情Tabs
function QuoteTopTabbar({ height, position = 'PAGE', searchValue, onItem, tabKey, tabValue, tabIndex, onSwiperChange }: IProps, ref: any) {
  const [activeKey, setActiveKey] = useState<TabKey>('ALL')
  const [activeTabValue, setActiveTabValue] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const swiperRef = useRef<SwiperRef>(null)

  const tabList = getTabList()

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

  useEffect(() => {
    setActiveIndex(tabIndex || 0)
  }, [tabIndex])

  useImperativeHandle(ref, () => {
    return {
      swiper: swiperRef.current
    }
  })

  return (
    <div className="pb-[50px]">
      {position === 'PAGE' && (
        <SymbolTabbar
          tabKey={activeKey}
          onChange={({ tabValue, tabKey, index }) => {
            setActiveKey(tabKey)
            setActiveTabValue(tabValue)
            setActiveIndex(index as number)
            swiperRef.current?.swipeTo(index as number)
          }}
          position="PAGE"
          className="sticky top-[48px] z-[1] bg-secondary border-t border-weak"
        />
      )}
      {/* <QuoteFlashList height={height} onItem={onItem} tabKey={activeKey} tabValue={activeTabValue} searchValue={searchValue} /> */}

      <Swiper
        direction="horizontal"
        loop={false}
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={(index) => {
          setActiveIndex(index)

          const key = tabList.find((item: any, idx: number) => idx === index)?.key as TabKey
          setActiveKey(key)

          onSwiperChange?.({ activeKey: key, index })
        }}
      >
        {tabList.map((item: any, idx: number) => (
          <Swiper.Item key={idx}>
            {/* 只渲染当前激活的 */}
            {item.key === activeKey ? (
              <QuoteFlashList
                position={position}
                height={height}
                onItem={onItem}
                tabKey={activeKey}
                tabValue={activeTabValue}
                searchValue={searchValue}
              />
            ) : (
              <></>
            )}
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  )
}

export default observer(forwardRef(QuoteTopTabbar))
