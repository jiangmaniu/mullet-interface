import React, { useEffect, useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { Text } from '../Text'
import { View } from '../View'

type IProps = {
  /** 是否选中 */
  checked?: boolean
  /** 宽高大小 */
  size?: number
  onChange?: (checked: boolean) => void
  label?: React.ReactNode
  labelStyle?: React.CSSProperties
}
export default function CheckBox({ labelStyle, label, onChange, size = 17, checked }: IProps) {
  const { cn, theme } = useTheme()
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    setIsChecked(!!checked)
  }, [checked])

  return (
    <View
      className={cn('items-center flex-row')}
      onClick={() => {
        setIsChecked(!isChecked)
        onChange?.(!isChecked)
      }}
    >
      <View
        className={cn('rounded p-1 border flex-row items-center justify-center')}
        style={{
          width: size,
          height: size,
          borderColor: isChecked ? theme.colors.CheckBox.activeBorderColor : theme.colors.CheckBox.inactiveBorderColor
        }}
      >
        <View
          className={cn('h-2 w-2 rounded-sm')}
          style={{
            backgroundColor: isChecked ? theme.colors.CheckBox.activeBlockBg : theme.colors.CheckBox.inactiveBlockBg
          }}
        />
      </View>
      {label && (
        <Text size="sm" className={cn('pl-2')} style={labelStyle}>
          {label}
        </Text>
      )}
    </View>
  )
}
