import { observer } from 'mobx-react'

import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import { Text } from '../Text'
import { View } from '../View'

type IProps = {
  leftText: string
  rightText: string
}
function CustomArrowButton({ leftText, rightText }: IProps) {
  const { cn, theme } = useTheme()
  const colorGreen = theme.colors.green.DEFAULT
  const colorRed = theme.colors.red.DEFAULT

  const { buySell, setBuySell } = stores.trade

  const grayBg = theme.colors.gray[50]
  const isSelectLeft = buySell === 'SELL'

  const handlePressLeft = () => {
    setBuySell('SELL')
  }

  const handlePressRight = () => {
    setBuySell('BUY')
  }

  return (
    <View
      className={cn('flex-row rounded items-center gap-x-3 flex-1 justify-center')}
      style={{
        backgroundColor: grayBg
      }}
    >
      <View className={cn('flex-1')}>
        <View
          className={cn('rounded items-center justify-center flex-row')}
          onClick={handlePressLeft}
          style={{
            backgroundColor: isSelectLeft ? colorRed : grayBg,
            height: 30
          }}
        >
          <Text color={isSelectLeft ? 'white' : 'weak'} size="sm" weight="medium" className={cn('text-center')}>
            {leftText}
          </Text>

          {/* 箭头 */}
          {isSelectLeft && (
            <View className={cn('absolute -right-[15px]')}>
              <Iconfont name="jiaoyi-kaiduo" size={30} color={colorRed} />
            </View>
          )}
        </View>
      </View>

      <View className={cn('flex-1')}>
        <View
          className={cn('rounded items-center justify-center flex-row')}
          onClick={handlePressRight}
          style={{
            backgroundColor: isSelectLeft ? grayBg : colorGreen,
            height: 30
          }}
        >
          <Text color={isSelectLeft ? 'weak' : 'white'} size="sm" weight="medium">
            {rightText}
          </Text>
          {/* 箭头 */}
          {!isSelectLeft && (
            <View className={cn('absolute -left-[17px]')}>
              <Iconfont name="jiaoyi-kaikong" size={30} color={colorGreen} />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default observer(CustomArrowButton)
