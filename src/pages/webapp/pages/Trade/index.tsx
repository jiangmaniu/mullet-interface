import { observer } from 'mobx-react'

import { useTheme } from '@/context/themeProvider'
import SwitchAccount from '../../components/Account/SwitchAccount'
import { View } from '../../components/Base/View'
import SelectSymbolBtn from '../../components/Quote/SelectSymbolBtn'
import TradeView, { BottomButton } from '../../components/Trade/TradeView'
import Basiclayout from '../../layouts/BasicLayout'

function Trade() {
  const { cn, theme } = useTheme()

  return (
    <Basiclayout
      bgColor="secondary"
      headerColor={theme.colors.backgroundColor.secondary}
      className={cn('pt-2')}
      footer={
        <div className="pb-[60px]">
          <BottomButton />
        </div>
      }
    >
      {/* 账号选择弹窗 */}
      <SwitchAccount isRemainAtCurrentPage />
      <View className={cn('flex flex-col rounded-tl-[22px] rounded-tr-[22px] flex-1 mt-2 pt-2')} bgColor="primary">
        <View className={cn('px-3')}>
          {/* 选择交易品种 */}
          <SelectSymbolBtn showQuotePercent />
        </View>
        {/* 交易视图 */}
        {/* {visible ? (
          <TradeView />
        ) : (
          <View className={cn('flex-1 justify-center items-center')}>
            <img style={{ width: 160, height: 186 }} src={'/img/webapp/logo-gray.png'} />
          </View>
        )} */}
        <TradeView />
      </View>
    </Basiclayout>
  )
}
export default observer(Trade)
