import React, { useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { View } from '../View'

type IProps = {
  /** 是否默认选中 */
  checked?: boolean
  disabled?: boolean
  loading?: boolean
  onChange?: (checked: boolean) => void
  /** 选中时的内容 */
  checkedChildren?: React.ReactNode
  /** 非选中时的内容 */
  unCheckedChildren?: React.ReactNode
  style?: React.CSSProperties
  activeThumbColor?: string
}

export default function Switch({
  style,
  checked,
  disabled,
  loading,
  onChange,
  checkedChildren,
  unCheckedChildren,
  activeThumbColor
}: IProps) {
  const { cn, theme } = useTheme()
  const [isChecked, setIsChecked] = useState(checked ? 1 : 0)

  const handleToggle = () => {
    if (!disabled && !loading) {
      const newChecked = !isChecked
      setIsChecked(newChecked ? 1 : 0)
      onChange && onChange(newChecked)
    }
  }

  return (
    <View
      className={cn('px-2 min-w-[55px] py-[6px] rounded-[16px] flex-row', isChecked ? 'justify-end' : 'justify-start')}
      onClick={handleToggle}
      style={{
        backgroundColor: isChecked ? activeThumbColor || theme.colors.Switch.activeTrackColor : theme.colors.Switch.inactiveTrackColor,
        ...style
      }}
    >
      {isChecked && <>{checkedChildren ? checkedChildren : <img src="/img/icons/checkSwitch.png" style={{ width: 18, height: 18 }} />}</>}
      {!isChecked && (
        <>{unCheckedChildren ? unCheckedChildren : <img src="/img/icons/unCheckSwitch.png" style={{ width: 18, height: 18 }} />}</>
      )}
    </View>
  )
}
