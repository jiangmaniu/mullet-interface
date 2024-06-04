import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Col, Input, Row } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import Empty from '@/components/Base/Empty'
import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { AllSymbols, formatQuotes } from '@/utils/wsUtil'

import Liquidation from '../Widget/Liquidation'
import CategoryTabs from './comp/CategoryTab'
import QuoteItem from './comp/QuoteItem'

const coinList = formatQuotes().quoteList1 // 数字货币
const goodsList = formatQuotes().quoteList4 // 商品
const exchangeList = formatQuotes().quoteList2 // 外汇
const indexList = formatQuotes().quoteList3 // 指数

type IProps = {
  style?: React.CSSProperties
  /**控制是否显示在侧边栏模式 */
  showFixSidebar?: boolean
}

const Sidebar = forwardRef(({ style, showFixSidebar = true }: IProps, ref) => {
  const { global } = useStores()
  const intl = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const popupRef = useRef()
  const [current, setCurrent] = useState(0) // 自选、品类
  const [categoryTabKey, setCategoryTabKey] = useState(0) // 品种分类
  const [list, setList] = useState<any>([])
  const { openTradeSidebar, setOpenTradeSidebar } = useModel('global')
  const searchInputRef = useRef<any>()

  // 对外暴露接口
  useImperativeHandle(ref, () => {
    return popupRef.current
  })

  // 搜索
  const handleSearchChange = (e: any) => {
    const value = e.target.value
    const filterList = AllSymbols.filter((v) => v.name.toLowerCase().indexOf(String(value).toLowerCase()) !== -1)

    setSearchValue(value)
    setList(filterList)
  }

  const TabItems: any = [
    { key: 0, label: <FormattedMessage id="mt.zixuan" /> },
    { key: 1, label: <FormattedMessage id="mt.pinlei" /> }
  ]

  const getList = () => {
    // 搜索列表
    if (searchValue) return list

    // 自选列表
    if (current === 0) {
      return global.favoriteList
    }

    // 永续列表
    return { 0: AllSymbols, 1: coinList, 2: goodsList, 3: exchangeList, 4: indexList }[categoryTabKey]
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
    const list = getList()
    return (
      <>
        <div className="pt-5">
          <Row className="px-5 pb-3">
            <Col span={12} className="text-xs text-gray-weak">
              <FormattedMessage id="mt.pinpai" />
            </Col>
            <Col span={12} className="text-right text-xs text-gray-weak">
              <FormattedMessage id="mt.zuixinjiage" />/<FormattedMessage id="mt.zhangdiefu" />
            </Col>
          </Row>
          {/* <div className="overflow-y-auto" style={{ height: 500 }}> */}
          {/* @TODO 这里判断数字货币类型 */}
          <div className="overflow-y-auto" style={{ height: current === 1 ? 400 : 450 }}>
            {list.length > 0 &&
              list.map((item: any, idx: number) => {
                const isActive = global.activeSymbolName === item.name
                return <QuoteItem item={item} isActive={isActive} popupRef={popupRef} key={idx} />
              })}
            {!list.length && <Empty />}
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
          setCurrent(key)
        }}
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
    if (current === 0) return null
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
        <div>
          {/* 展开侧边栏视图 */}
          {(openTradeSidebar || !showFixSidebar) && (
            <div className={classNames('h-[690px] w-[300px] bg-white relative', { [borderClassName]: showFixSidebar })} style={style}>
              {renderTabs()}
              {renderSearch()}
              {renderCategoryTabs()}
              <div className="flex justify-between flex-col">
                {renderContent()}
                {/* 爆仓仓位展示 @TODO 只有开了杠杆才展示 */}
                {/* 这里判断数字货币类型才展示 @TODO */}
                {/* {openTradeSidebar && <Liquidation />} */}
                <Liquidation />
              </div>
            </div>
          )}
          {/* 收起侧边栏视图 */}
          {!openTradeSidebar && (
            <div className={classNames('h-[690px] w-[60px] bg-white flex flex-col items-center relative', borderClassName)}>
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
                {AllSymbols.map((item, idx) => {
                  const symbol = item.name
                  const isActive = global.activeSymbolName === symbol
                  return (
                    <div
                      key={idx}
                      className={classNames('mb-4 cursor-pointer w-[38px] h-[38px] flex items-center justify-center', {
                        [activeClassName]: isActive
                      })}
                      onClick={() => {
                        // 记录打开的symbol
                        global.setOpenSymbolNameList(symbol)
                        // 设置当前当前的symbol
                        global.setActiveSymbolName(symbol)
                      }}
                    >
                      <img width={28} height={28} alt="" src={`/img/coin-icon/${item.name}.png`} className="rounded-full" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      }
      wapComponent={
        <Popup
          title={current === 1 ? <FormattedMessage id="mt.zixuan" /> : <FormattedMessage id="mt.yongxu" />}
          ref={popupRef}
          position="bottom"
          height="80vh"
        >
          <div>
            {renderSearch()}
            {!searchValue && <div className="pt-2">{renderTabs()}</div>}
            {current === 1 && renderCategoryTabs()}
            {renderContent()}
          </div>
        </Popup>
      }
    />
  )
})

export default observer(Sidebar)
