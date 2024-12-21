import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import { navigateTo } from '../../utils/navigator'
import Search from '../Base/Search'
import SheetModal, { SheetRef } from '../Base/SheetModal'
import { View } from '../Base/View'
import QuoteTopTabbar, { SymbolTabbar, TabKey } from './QuoteTopTabbar'

type IProps = {
  trigger?: JSX.Element
  from?: 'Quote'
  beforeClose?: () => void
}

export type SelectSymbolModalRef = {
  show: (tabkey?: TabKey) => void
  close: () => void
  visible: boolean
}

/** 选择品种列表弹窗 */
function SelectSymbolModal({ trigger, from, beforeClose }: IProps, ref: ForwardedRef<SelectSymbolModalRef>) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const [tabKey, setTabKey] = useState<TabKey>('ALL')
  const [tabValue, setTabValue] = useState('')
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [searchValue, setSearchValue] = useState('')

  const bottomSheetModalRef = useRef<SheetRef>(null)
  const topTabbarRef = useRef<any>(null)

  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show: (tabKey: any) => {
      bottomSheetModalRef.current?.sheet?.present()
      setTabKey(tabKey)
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    },
    visible
  }))

  const { ws, trade } = useStores()
  const symbolList = trade.symbolListAll
  const activeSymbolName = trade.activeSymbolName

  // 当打开行情弹窗时，打开行情订阅
  useEffect(() => {
    // 使用 useFocusEffect 來確保頁面聚焦時顯示, 離開頁面時隱藏,
    // 优化卡顿问题

    if (visible && symbolList.length) {
      setTimeout(() => {
        console.log('selectSymbolselectSymbolselectSymbol 订阅行情')
        //  检查socket是否连接，如果未连接，则重新连接
        ws.checkSocketReady(() => {
          // 打开行情订阅
          ws.openSymbol(
            // 构建参数
            ws.makeWsSymbolBySemi(symbolList)
          )
        })
      })
    }

    return () => {
      // 离开弹窗时，取消行情订阅
      ws.debounceBatchSubscribeSymbol()
    }
  }, [visible, symbolList, activeSymbolName])

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height="90%"
      hiddenFooter
      trigger={trigger}
      onOpenChange={(v) => {
        setVisible(v)
      }}
      onDismiss={() => {
        // 关闭弹窗重置
        setVisible(false)
        setSearchValue('')
        setTabKey('ALL')
        beforeClose?.()
      }}
      dragOnContent={false}
      hiddenContentScroll
      header={
        <View>
          <View className="mx-3">
            <Search
              inputWrapperStyle={{
                backgroundColor: theme.colors.backgroundColor.secondary
              }}
              onChange={(value) => {
                setSearchValue(value)
              }}
              value={searchValue}
            />
          </View>
          <SymbolTabbar
            tabKey={tabKey}
            onChange={({ tabValue, tabKey, index }) => {
              setTabKey(tabKey)
              setTabValue(tabValue)
              // setTabIndex(index as number)
              topTabbarRef.current.swiper?.swipeTo?.(index)
            }}
          />
        </View>
      }
      children={
        <View style={cn('flex-1')}>
          <QuoteTopTabbar
            searchValue={searchValue}
            onItem={(item) => {
              bottomSheetModalRef.current?.sheet?.dismiss()

              // 来自行情页点击搜索，点击行情跳转K线页
              if (from === 'Quote') {
                navigateTo('/app/quote/kline')
              }
            }}
            tabKey={tabKey}
            tabValue={tabValue}
            // tabIndex={tabIndex}
            position="MODAL"
            height={document.body.clientHeight - 220}
            onSwiperChange={({ activeKey, index }) => {
              setTabKey(activeKey)
              // setTabIndex(index)
              // console.log('activeKey', activeKey, index)
            }}
            ref={topTabbarRef}
          />
        </View>
      }
      backgroundStyle={{ backgroundColor: theme.colors.backgroundColor.secondary }}
    />
  )
}

export default observer(forwardRef(SelectSymbolModal))
