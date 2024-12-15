import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum } from '@/utils'

import { Text } from '../Base/Text'
import { View } from '../Base/View'
import SelectAccountModal, { SelectAccountModalRef } from './SelectAccountModal'

type IProps = {
  showRightSearchIcon?: boolean
  onSearch?: () => void
}
function SwitchAccount({ onSearch, showRightSearchIcon }: IProps) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const selectAccountModalRef = useRef<SelectAccountModalRef>(null)
  const { trade } = useStores()

  return (
    <>
      <View className={cn('flex items-center mx-[14px] flex-row justify-between ')}>
        <View className={cn('flex items-center flex-row')}>
          <View className={cn('rounded leading-4 px-[6px] py-[2px] mr-1 bg-gray')}>
            <Text className={cn('text-xs')} color="white">
              {trade.currentAccountInfo.synopsis?.abbr}
            </Text>
          </View>
          <View
            className={cn('flex-row items-center')}
            onClick={() => {
              selectAccountModalRef.current?.show()
            }}
          >
            <Text size="base" color="primary" weight="semibold" className={cn('max-w-[210px] mr-1 truncate')}>
              {trade.currentAccountInfo.name}
            </Text>
            <Iconfont name="qiehuanzhanghu-xiala" size={20} />
          </View>
        </View>
        {showRightSearchIcon ? (
          <div onClick={onSearch}>
            <Iconfont name="hangqing-sousuo" size={28} />
          </div>
        ) : (
          <Text size="lg" weight="bold" color="primary" font="dingpro-medium">
            {formatNum(trade.currentAccountInfo.money, { precision: trade.currentAccountInfo.currencyDecimal })}
          </Text>
        )}
      </View>
      <SelectAccountModal ref={selectAccountModalRef} />
    </>
  )
}

export default observer(SwitchAccount)
