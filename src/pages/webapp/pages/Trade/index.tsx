import { observer } from 'mobx-react'
import { useCallback, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import SwitchAccount from '../../components/Account/SwitchAccount'
import { View } from '../../components/Base/View'
import SelectSymbolBtn from '../../components/Quote/SelectSymbolBtn'
import TradeView from '../../components/Trade/TradeView'
import useFocusEffect from '../../hooks/useFocusEffect'
import useIsFocused from '../../hooks/useIsFocused'
import Basiclayout from '../../layouts/BasicLayout'

function Trade() {
  const { cn, theme } = useTheme()

  const [visible, setVisible] = useState(false)
  const isFocused = useIsFocused()

  useFocusEffect(
    useCallback(() => {
      // 使用 useFocusEffect 來確保頁面聚焦時顯示, 離開頁面時隱藏,
      // 优化卡顿问题
      setTimeout(() => {
        setVisible(true)
      }, 150)
      return () => {
        setVisible(false)
      }
    }, [])
  )

  return (
    <Basiclayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary} className={cn('pt-2')}>
      {/* 账号选择弹窗 */}
      <SwitchAccount isRemainAtCurrentPage />
      <View className={cn('flex flex-col rounded-tl-[22px] rounded-tr-[22px] flex-1 mt-2 pt-2')} bgColor="primary">
        <View className={cn('px-3')}>
          {/* 选择交易品种 */}
          <SelectSymbolBtn showQuotePercent />
        </View>
        {/* 交易视图 */}
        {visible ? (
          <TradeView />
        ) : (
          <View className={cn('flex-1 justify-center items-center')}>
            <img style={{ width: 160, height: 186 }} src={'/images/logo-gray.png'} />
          </View>
        )}
      </View>
    </Basiclayout>
  )
}
export default observer(Trade)
