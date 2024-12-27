import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import Search from '@/pages/webapp/components/Base/Search'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { formatSymbolList } from '@/utils/business'
import { debounce, throttle } from 'lodash'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const SearchList = observer(({ keyword }: { keyword: string }) => {
  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const { symbolListAll } = trade
  const sectionRef = useRef<any>(null)
  const [currentLetterIndex, setCurrentLetterIndex] = useState<any>('')

  const getGroupData = (data: any) => {
    return formatSymbolList(data)
  }
  const list = useMemo(() => {
    const data = !keyword
      ? symbolListAll
      : symbolListAll.filter((v) => v.symbol.toLowerCase().indexOf(String(keyword).toLowerCase()) !== -1)
    return getGroupData(data)
  }, [symbolListAll.length, keyword])

  const letterData = useMemo(() => {
    return getGroupData(symbolListAll)
  }, [symbolListAll.length])

  const getSymbolIcon = (symbol: string) => {
    return symbolListAll.find((item: Account.TradeSymbolListItem) => item.symbol === symbol)?.imgUrl
  }

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstVisibleSection = viewableItems[0].section
      const sectionIndex = list.findIndex((section) => section.title === firstVisibleSection.title)
      setTimeout(() => {
        setCurrentLetterIndex(sectionIndex)
      }, 300)
    }
  }).current

  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (index: number) => {
    const container = containerRef.current
    if (!container) return

    const sections = container.getElementsByClassName('section-header')
    if (sections[index]) {
      const sectionEl = sections[index] as HTMLElement
      const elementPosition = sectionEl.offsetTop
      const offsetPosition = elementPosition
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // 添加滚动监听
  useEffect(() => {
    const handleScroll = throttle(() => {
      const container = containerRef.current
      if (!container) return

      const sections = Array.from(container.getElementsByClassName('section-header'))
      const headerOffset = 70 // 根据实际顶部导航栏高度调整

      // 找到当前可见的section
      const current = sections.findIndex((section) => {
        const rect = (section as HTMLElement).getBoundingClientRect()
        return rect.top <= headerOffset && rect.bottom > headerOffset
      })

      if (current !== -1) {
        setCurrentLetterIndex(current)
      } else if (window.scrollY === 0) {
        // 处理滚动到顶部的情况
        setCurrentLetterIndex(0)
      } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        // 处理滚动到底部的情况
        setCurrentLetterIndex(sections.length - 1)
      }
    }, 100)

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll)
    // 初始化时执行一次
    handleScroll()

    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [list.length]) // 依赖list长度变化重新添加监听

  return (
    <div ref={containerRef} className={cn('flex-1 relative mt-[70px]')}>
      {/* <View style={cn('my-3 ml-2')}>
        <Text size="base" color="primary" weight="medium">
          {t('pages.quote.Symbol List')}
        </Text>
      </View> */}
      {list.map((item, idx) => {
        return (
          <View key={idx}>
            {/* 标题 */}
            <View className={cn('py-1 px-4 flex items-end section-header')} bgColor="secondary">
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
            </View>
            {/* 内容 */}
            <View>
              {item.data.map((child: any) => (
                <View key={child} className="py-2">
                  <View
                    className={cn('flex-row gap-x-3 items-center pl-4 pr-[60px]')}
                    onClick={() =>
                      navigateTo('/app/quote/kline', {
                        redirect: '/app/quote/search'
                      })
                    }
                  >
                    <SymbolIcon src={getSymbolIcon(child)} />
                    <Text size="sm" weight="medium" leading="xl">
                      {child}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )
      })}
      <View className={cn('fixed right-3 top-[100px] overflow-y-auto')}>
        {letterData.map((item, idx) => {
          const isActive = currentLetterIndex === idx
          return (
            <View
              onClick={(e) => {
                e.stopPropagation()
                scrollToSection(idx)
                // setCurrentLetterIndex(idx)
              }}
              key={idx}
            >
              <View className={cn('mb-2 flex-row items-center gap-x-1')}>
                <View
                  style={{
                    backgroundColor: isActive ? theme.colors.brand.DEFAULT : 'transparent',
                    width: 4,
                    height: 4,
                    borderRadius: 100
                  }}
                />
                <Text
                  size="xxs"
                  weight={isActive ? 'medium' : 'light'}
                  style={{ color: isActive ? theme.colors.textColor.brand : theme.colors.textColor.secondary }}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    </div>
  )
})

function SymbolSearch() {
  const i18n = useI18n()
  const t = i18n.t
  const { cn, theme } = useTheme()
  const [keyword, setKeyword] = useState('')
  const { trade } = useStores()
  const { symbolListAll } = trade

  const handleSearchChange = debounce((value: string) => {
    console.log('handleSearchChange', value)
    setKeyword(value)
    // 设置缓存
    // if (value) {
    //   setHistorySearch(value)
    // }
  }, 500)

  return (
    <Basiclayout bgColor="primary" headerColor={theme.colors.backgroundColor.primary} scrollY>
      <View className={cn('flex-row items-center gap-x-4 px-4 fixed top-0 w-full bg-white z-10')}>
        <View className={cn('flex-1 py-[10px]')}>
          <Search
            iconPosition="left"
            inputWrapperStyle={{ backgroundColor: theme.colors.gray[50] }}
            style={{ height: 40, borderWidth: 0, borderRadius: 8 }}
            onChange={handleSearchChange}
          />
        </View>
        <View
          onPress={() => {
            navigateTo('/app/quote')
          }}
        >
          <Text size="sm" color="secondary">
            {t('common.operate.Cancel')}
          </Text>
        </View>
      </View>
      {/* @TODO 暂时不做 切换不同账户组 搜索的品种可能不存在 导致点击品种导航有问题 */}
      {/* <View className={cn('mx-4')}>
        {historySearchList.length > 0 && (
          <>
            <View className={cn('flex-row mt-7 items-center justify-between')}>
              <Text weight="medium" size="base">
                {t('pages.quote.History Search')}
              </Text>
              <LinkPressable onPress={removeHistorySearch}>
                <img src={'/images/clear-search-history.png'} style={{ width: 20, height: 20 }} />
              </LinkPressable>
            </View>
            <View className={cn('mb-7 mt-5 items-start flex-row gap-3 flex-wrap')}>
              {historySearchList.slice(0, 10).map((item, idx) => {
                return (
                  <LinkPressable
                    key={idx}
                    onPress={() => {
                      // 点击搜索tag 存在品种列表才能跳转
                      if (symbolListAll.some((v) => v.symbol === item)) {
                        navigation.navigate('KLine')
                      }
                    }}
                  >
                    <View
                      className={cn('rounded min-w-[60px] px-3 py-1 items-center justify-center', )}
                      style={{ backgroundColor: theme.colors.gray[50] }}
                    >
                      <Text size="base" color="primary">
                        {item}
                      </Text>
                    </View>
                  </LinkPressable>
                )
              })}
            </View>
          </>
        )}
      </View> */}
      {/* 搜索列表 */}
      <SearchList keyword={keyword} />
    </Basiclayout>
  )
}
export default observer(SymbolSearch)
