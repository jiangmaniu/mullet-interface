import { SwapRightOutlined } from '@ant-design/icons'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Col, Input, Row } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Empty from '@/components/Base/Empty'
import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { getSymbolIcon } from '@/utils/business'

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
  const searchInputRef = useRef<any>()
  const symbolList = trade.symbolList // 全部品种列表

  useEffect(() => {
    // 1200px-1600px收起侧边栏
    if (screenSize.width > 1200 && screenSize.width < 1600) {
      setOpenTradeSidebar(false)
    } else {
      setOpenTradeSidebar(true)
    }
  }, [screenSize])

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

  const renderSearch = () => (
    <div className="px-3 max-xl:pt-[5px]">
      <Input
        value={searchValue}
        onChange={handleSearchChange}
        placeholder={intl.formatMessage({ id: 'mt.sousuo' })}
        suffix={<img alt="" width={24} height={24} src="/img/search-icon.png" />}
        allowClear
        style={{ background: 'var(--placeholder-bg)', height: 36 }}
        styles={{ input: { background: 'transparent' } }}
        ref={searchInputRef}
      />
    </div>
  )

  const renderContent = () => {
    const list: any = getList()
    return (
      <>
        <div className="pt-2">
          <Row className="px-5 pb-2">
            <Col span={12} className="!text-xs text-gray-weak">
              <FormattedMessage id="mt.pinpai" />
            </Col>
            <Col span={12} className="text-right !text-xs text-gray-weak">
              <FormattedMessage id="mt.zuixinjiage" />/<FormattedMessage id="mt.zhangdiefu" />
            </Col>
          </Row>
          <div className="overflow-y-auto" style={{ height: 500 }}>
            {list.length > 0 &&
              list.map((item: Account.TradeSymbolListItem, idx: number) => {
                const isActive = trade.activeSymbolName === item.symbol
                return <QuoteItem item={item} isActive={isActive} popupRef={popupRef} key={idx} />
              })}
            {!list.length && (
              <div className="pt-10 flex items-center flex-col">
                <Empty
                  description={
                    <>
                      {activeKey === 'FAVORITE' ? (
                        <div
                          className="flex justify-center gap-x-2 cursor-pointer"
                          onClick={() => {
                            setActiveKey('CATEGORY')
                          }}
                        >
                          <div className="text-xs text-gray-secondary hover:text-gray">
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
          </div>
        </div>
      </>
    )
  }

  const openSidebar = () => {
    setOpenTradeSidebar(!openTradeSidebar)
  }

  const renderTabs = () => {
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
        tabBarExtraContent={
          showFixSidebar ? (
            <div className="cursor-pointer" onClick={openSidebar}>
              <img src="/img/menu-icon.png" height={24} width={24} />
            </div>
          ) : undefined
        }
      />
    )
  }

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
        background: '#E8E8E8',
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
            <div className={classNames('h-[700px] w-[300px] bg-white relative', { [borderClassName]: showFixSidebar })} style={style}>
              {renderTabs()}
              {renderSearch()}
              {renderCategoryTabs()}
              <div className="flex justify-between flex-col">
                {renderContent()}
                {/* 爆仓仓位展示 @TODO 只有开了杠杆才展示 */}
                {/* 这里判断数字货币类型才展示 @TODO */}
                {/* {openTradeSidebar && <Liquidation />} */}
              </div>
            </div>
          )}
          {/* 收起侧边栏视图 */}
          {!openTradeSidebar && (
            <div className={classNames('h-[700px] w-[60px] bg-white flex flex-col items-center relative', borderClassName)}>
              <div className="border-b border-gray-100 pb-2 pt-[11px] text-center w-full cursor-pointer" onClick={openSidebar}>
                <img src="/img/menu-icon.png" height={24} width={24} style={{ transform: 'rotate(180deg)' }} />
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
                <img alt="" width={24} height={24} src="/img/search-icon.png" />
              </div>
              <div className="flex flex-col items-center w-full relative overflow-y-auto">
                {symbolList.map((item, idx) => {
                  const symbol = item.symbol
                  const isActive = trade.activeSymbolName === symbol
                  return (
                    <div
                      key={idx}
                      className={classNames('mb-4 cursor-pointer w-[38px] h-[38px] flex items-center justify-center', {
                        [activeClassName]: isActive
                      })}
                      onClick={() => {
                        // 记录打开的symbol
                        trade.setOpenSymbolNameList(symbol)
                      }}
                    >
                      <img width={28} height={28} alt="" src={getSymbolIcon(item.imgUrl)} className="rounded-full" />
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
            {!searchValue && <div className="pt-2">{renderTabs()}</div>}
            {activeKey === 'CATEGORY' && renderCategoryTabs()}
            {renderContent()}
          </div>
        </Popup>
      }
    />
  )
})

export default observer(Sidebar)
