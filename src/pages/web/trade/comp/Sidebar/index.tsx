import { SwapRightOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Col, Input, Row, Skeleton } from 'antd'
import { observer } from 'mobx-react'
import VirtualList from 'rc-virtual-list'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import Popup from '@/components/Base/Popup'
import SymbolIcon from '@/components/Base/SymbolIcon'
import Tabs from '@/components/Base/Tabs'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { gray } from '@/theme/theme.config'
import { cn } from '@/utils/cn'

import CategoryTabs from './comp/CategoryTab'
import QuoteItem from './comp/QuoteItem'

type IProps = {
  style?: React.CSSProperties
  /**控制是否显示在侧边栏模式 */
  showFixSidebar?: boolean
}

const Sidebar = forwardRef(({ style, showFixSidebar = true }: IProps, ref) => {
  const { global, trade } = useStores()
  const { isMobileOrIpad, breakPoint, screenSize } = useEnv()
  const intl = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const popupRef = useRef()
  const [activeKey, setActiveKey] = useState<'FAVORITE' | 'CATEGORY'>('CATEGORY') // 自选、品类 FAVORITE CATEGORY
  const [categoryTabKey, setCategoryTabKey] = useState(0) // 品种分类
  const [list, setList] = useState([] as Account.TradeSymbolListItem[])
  const { openTradeSidebar, setOpenTradeSidebar } = useModel('global')
  const { isDark } = useTheme()
  const searchInputRef = useRef<any>()
  const symbolList = trade.symbolList // 全部品种列表
  const loading = trade.symbolListLoading

  useEffect(() => {
    // 1200px-1600px收起侧边栏
    if (screenSize?.width > 1200 && screenSize?.width < 1600) {
      setOpenTradeSidebar(false)
    } else {
      setOpenTradeSidebar(true)
    }
  }, [screenSize])

  useEffect(() => {
    if (activeKey === 'CATEGORY') {
      trade.getSymbolList({ classify: '0' })
    }
  }, [activeKey])

  useEffect(() => {
    setSearchValue('')
  }, [trade.currentAccountInfo])

  // 对外暴露接口
  useImperativeHandle(ref, () => {
    return popupRef.current
  })

  // 搜索
  const handleSearchChange = (e: any) => {
    const value = e.target.value
    const filterList = symbolList.filter((v) => v.symbol.toLowerCase().indexOf(String(value).toLowerCase()) !== -1)

    setSearchValue(value)
    setList(filterList)
  }

  const TabItems: any = [
    { key: 'FAVORITE', label: <FormattedMessage id="mt.zixuan" /> },
    { key: 'CATEGORY', label: <FormattedMessage id="mt.pinlei" /> }
  ]

  const getList = () => {
    // 搜索列表
    if (searchValue) return list

    // 自选列表
    if (activeKey === 'FAVORITE') {
      return trade.favoriteList
    }

    // 列表
    return symbolList
  }

  const SearchIcon = <Iconfont name="sousuo" width={24} height={24} color={isDark ? '#fff' : gray['600']} />

  const renderSearch = () => (
    <div className="px-3 max-xl:pt-[5px]">
      <Input
        value={searchValue}
        onChange={handleSearchChange}
        placeholder={intl.formatMessage({ id: 'common.sousuo' })}
        suffix={SearchIcon}
        allowClear
        style={{
          background: 'var(--input-bg)',
          borderColor: 'var(--divider-line-color)',
          height: 36,
          transition: 'background 0s ease-in-out',
          color: 'var(--color-text-primary)'
        }}
        styles={{ input: { background: 'transparent' } }}
        ref={searchInputRef}
        classNames={{ input: 'dark:placeholder:!text-gray-570' }}
      />
    </div>
  )

  const renderContent = () => {
    const list: any = getList()
    const ContainerHeight = !showFixSidebar ? 340 : 531

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
      // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
      if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
        // appendData();
        console.log('onScroll')
      }
    }

    return (
      <>
        <div className="pt-2">
          <Row className="px-3 pb-2">
            <Col span={8} className="!text-xs text-weak">
              <FormattedMessage id="mt.pinzhong" />
            </Col>
            <Col span={6} className="!text-xs text-weak pl-3">
              <FormattedMessage id="mt.bid" />
            </Col>
            <Col span={6} className="!text-xs text-weak pl-3">
              <FormattedMessage id="mt.ask" />
            </Col>
            <Col span={4} className="text-right !text-xs text-weak">
              <FormattedMessage id="mt.zhangdiefu" />
            </Col>
          </Row>
          <div>
            {loading && (
              <div className="mx-5 mt-8">
                <Skeleton loading={loading} />
              </div>
            )}
            {!list.length && !loading && (
              <div className="pt-10 pb-5 flex items-center flex-col">
                <Empty
                  description={
                    <>
                      {activeKey === 'FAVORITE' ? (
                        <div
                          className="flex justify-center gap-x-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveKey('CATEGORY')
                          }}
                        >
                          <div className="text-xs text-secondary hover:text-primary">
                            <FormattedMessage id="mt.tianjiazixuan" />
                          </div>
                          <SwapRightOutlined />
                        </div>
                      ) : (
                        <FormattedMessage id="common.noData" />
                      )}
                    </>
                  }
                />
              </div>
            )}

            {!loading && list.length > 0 && (
              <VirtualList
                data={list}
                height={ContainerHeight}
                styles={{
                  verticalScrollBarThumb: {
                    width: 6,
                    borderRadius: 4,
                    background: isDark ? gray[578] : 'rgba(0, 0, 0, 0.05)'
                  },
                  verticalScrollBar: {
                    background: `${isDark ? gray[675] : '#fff'}`
                  }
                }}
                itemHeight={41}
                itemKey="id"
                onScroll={onScroll}
              >
                {(item: Account.TradeSymbolListItem) => <QuoteItem item={item} />}
              </VirtualList>
            )}
          </div>
        </div>
      </>
    )
  }

  const openSidebar = () => {
    setOpenTradeSidebar(!openTradeSidebar)
  }

  const renderTabs = useMemo(() => {
    return (
      <Tabs
        items={TabItems}
        onChange={(key: any) => {
          setActiveKey(key)
        }}
        activeKey={activeKey}
        tabBarGutter={28}
        tabBarStyle={{ paddingLeft: 22, paddingRight: 12 }}
        size="small"
        marginBottom={16}
        tabBarExtraContent={
          showFixSidebar ? (
            <div className="cursor-pointer" onClick={openSidebar}>
              <Iconfont name="shouqi" height={24} width={24} color={isDark ? '#fff' : gray['900']} />
            </div>
          ) : undefined
        }
      />
    )
  }, [openSidebar, showFixSidebar, isDark])

  const renderCategoryTabs = () => {
    // 搜索时隐藏分类
    if (searchValue) return null
    if (activeKey === 'FAVORITE') return null
    return (
      <CategoryTabs
        onChange={(key: any) => {
          console.log('key: ' + key)
          setCategoryTabKey(key)
        }}
        activeKey={categoryTabKey}
      />
    )
  }

  const borderClassName = useEmotionCss(({ token }) => {
    return {
      '&::after': {
        content: "''",
        background: 'var(--divider-line-color)',
        width: 1,
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 10
      }
    }
  })

  const activeClassName = useEmotionCss(({ token }) => {
    return {
      '&:before': {
        content: '""',
        position: 'absolute',
        border: '1px solid #E1E1E1',
        borderRadius: '50%',
        height: '38px',
        width: '38px'
      },
      '&:after': {
        position: 'absolute',
        left: 0,
        width: 4,
        height: 19,
        background: '#000000',
        borderRadius: '0px 4px 4px 0px',
        content: '""'
      }
    }
  })

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <>
          {/* 展开侧边栏视图 */}
          {(openTradeSidebar || !showFixSidebar) && (
            <div
              className={cn('w-[364px] flex-shrink-0 relative bg-primary', !showFixSidebar ? 'max-h-[600px]' : 'h-[700px]', {
                [borderClassName]: showFixSidebar
              })}
              style={style}
            >
              {renderTabs}
              {renderSearch()}
              {renderCategoryTabs()}
              <div className="flex justify-between flex-col">{renderContent()}</div>
            </div>
          )}
          {/* 收起侧边栏视图 */}
          {!openTradeSidebar && showFixSidebar && (
            <div className={cn('h-[700px] w-[60px] bg-primary flex flex-col items-center relative', borderClassName)}>
              <div
                className="border-b border-gray-60 dark:border-[var(--border-primary-color)] pb-[2px] pt-[11px] text-center w-full cursor-pointer"
                onClick={openSidebar}
              >
                <Iconfont
                  name="shouqi"
                  height={24}
                  width={24}
                  color={isDark ? '#fff' : gray['900']}
                  style={{ transform: 'rotate(180deg)' }}
                />
              </div>
              <div
                className="py-4 cursor-pointer"
                onClick={() => {
                  openSidebar()
                  setTimeout(() => {
                    searchInputRef.current?.focus()
                  }, 300)
                }}
              >
                {SearchIcon}
              </div>
              <div
                className="flex flex-col items-center w-full relative overflow-y-auto pt-3"
                style={{
                  scrollbarColor: 'var(--scrollbar-hover-color)',
                  scrollbarWidth: 'thin'
                }}
              >
                {symbolList.map((item, idx) => {
                  const symbol = item.symbol
                  const isActive = trade.activeSymbolName === symbol
                  return (
                    <div
                      key={idx}
                      className={cn('mb-4 cursor-pointer w-[38px] h-[38px] flex items-center justify-center', {
                        [activeClassName]: isActive
                      })}
                      onClick={() => {
                        // 切换品种
                        trade.switchSymbol(symbol)
                      }}
                    >
                      <SymbolIcon src={item?.imgUrl} width={28} height={28} symbol={symbol} showMarketCloseIcon />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      }
      wapComponent={
        <Popup
          title={activeKey === 'CATEGORY' ? <FormattedMessage id="mt.zixuan" /> : <FormattedMessage id="mt.pinlei" />}
          ref={popupRef}
          position="bottom"
          height="80vh"
        >
          <div>
            {renderSearch()}
            {!searchValue && <div className="pt-2">{renderTabs}</div>}
            {activeKey === 'CATEGORY' && renderCategoryTabs()}
            {renderContent()}
          </div>
        </Popup>
      }
    />
  )
})

export default observer(Sidebar)
