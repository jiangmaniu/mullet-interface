import { useTheme } from '@/context/themeProvider'
import { add } from '@/utils/float'
import clsx from 'clsx'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { View } from '../../View'
import type { TextFieldProps } from '../TextField'
import { TextField } from '../TextField'

export type InputNumberProps = TextFieldProps & {
  /** 禁用 */
  disabled?: boolean
  placeholder?: string
  /** 右侧文字 */
  rightText?: React.ReactNode
  onPressRightText?: () => void
  textAlign?: 'center' | 'left' | 'right' | undefined
  /** 高度 */
  height?: number
  value?: any
  /** 是否展示加减按钮 */
  controls?: boolean
  /** 最小 */
  min?: any
  /** 最大 */
  max?: any
  /** 点击增加 */
  onAdd?: () => void
  /** 点击减少 */
  onMinus?: () => void
  /** change事件 */
  onChange?: (val: any) => void
  /** 步长 */
  step?: number
  /** 精度 */
  precision?: number
  /** 隐藏精度，只能输入整数 */
  hiddenPrecision?: boolean
  style?: clsx.ClassValue[]
  status?: 'error' | 'disabled'
  /** 自动全选 */
  autoSelectAll?: boolean
}

const InputNumber = forwardRef(
  (
    {
      min = 0,
      max = 10000000,
      step = 1,
      precision = 0,
      controls = true,
      value,
      height,
      disabled,
      placeholder,
      rightText,
      onPressRightText,
      textAlign,
      onAdd,
      onMinus,
      hiddenPrecision,
      style,
      onFocus,
      autoSelectAll = false,
      onChange,
      onEndEditing,
      ...res
    }: InputNumberProps,
    ref
  ) => {
    const { cn, theme } = useTheme()

    /**
     * --- 组件内部 inputValue 维护状态变化，在 onEndEditing 时候使用 inputValue 当前值响应外部传入的 onEndEditing 事件 ---
     */
    const [inputValue, setInputValue] = useState(value)
    const newValue = useMemo(() => Number(inputValue || 0), [inputValue])

    useEffect(() => {
      setInputValue(value)
    }, [value])

    const disabledAdd = useMemo(() => (newValue && max && newValue >= Number(max)) || disabled, [newValue, max, disabled])
    const disabledMinus = useMemo(() => newValue <= 0 || (min && newValue <= min) || disabled, [newValue, min, disabled])

    const inputRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
      blur: () => {
        inputRef.current?.blur()
      },
      focus: () => {
        inputRef.current?.focus()
      }
    }))

    const handleChangeText = (text: string) => {
      setInputValue(text)
      onChange?.(text)
    }

    // const handleFocus = () => {
    //   if (autoSelectAll) {
    //     inputRef.current?.setSelection(0, String(newValue)?.length || 0)
    //   }
    //   onFocus?.(null as any)
    // }

    return (
      <TextField
        ref={inputRef}
        autoSelectAll={autoSelectAll}
        LeftAccessory={() => (
          <>
            {controls && (
              <>
                {/* <LinkPressable
                  disabled={disabledMinus}
                  onPress={() => {
                    onFocus?.(null as any)
                    if (disabledMinus) return
                    if (onMinus) {
                      onMinus()
                    } else {
                      const retValue = String(newValue - step)
                      onChangeText?.(retValue)
                      onEndEditing?.(retValue)
                    }
                  }}
                  style={{ paddingLeft: 4 }}
                  isDebounce
                >
                  <Icon
                    name="shurukuang-jian"
                    color={disabledMinus ? theme.colors.gray['100'] : theme.colors.textColor.primary}
                    size={34}
                  />
                </LinkPressable> */}
                <View
                  borderColor="weak"
                  style={cn('h-[40%]', {
                    // borderWidth: StyleSheet.hairlineWidth
                  })}
                />
              </>
            )}
          </>
        )}
        height={height}
        placeholder={placeholder}
        // textAlign={textAlign || 'center'}
        disabled={disabled}
        value={inputValue}
        onBlur={() => {
          let newValue = Number(inputValue)

          // 处理输入的最小值
          if (newValue && newValue < min) {
            newValue = min
            onEndEditing?.(String(newValue))
            return
          }

          // 处理输入的最大值
          if (newValue && newValue > max) {
            newValue = max
            onEndEditing?.(String(newValue))
          }
        }}
        onChange={handleChangeText}
        onEndEditing={onEndEditing}
        onFocus={onFocus}
        // keyboardType="numbers-and-punctuation" // 最基础的数字键盘
        // returnKeyType="done"
        containerStyle={[{ marginBottom: 10 }]}
        RightAccessory={() => (
          <>
            {controls && (
              <>
                {/* {rightText && !disabled && (
                  <LinkPressable
                    disabled={disabled}
                    onPress={() => {
                      onFocus?.(null as any)
                      onPressRightText?.()
                      onChangeText?.(String(max))
                      onEndEditing?.(String(max))
                    }}
                    style={cn('mr-2')}
                    isDebounce
                  >
                    <Text size="sm" weight="medium" color="primary">
                      {rightText}
                    </Text>
                  </LinkPressable>
                )} */}
                <View
                  borderColor="weak"
                  style={cn('h-[40%]', {
                    // borderWidth: StyleSheet.hairlineWidth
                  })}
                />
                <View
                  // disabled={disabledAdd}
                  onClick={() => {
                    onFocus?.(null as any)
                    if (disabledAdd) return
                    if (onAdd) {
                      onAdd()
                    } else {
                      // 浮点数相加精度问题
                      const retValue = add(newValue, step)
                      // 最大值限制
                      const val = Math.min(Number(retValue), max)
                      onChange?.(String(val))
                      onEndEditing?.(String(val))
                    }
                  }}
                  style={{ paddingRight: 4 }}
                >
                  {/* <Icon name="shurukuang-jia" color={disabledAdd ? theme.colors.gray['100'] : theme.colors.textColor.primary} size={34} /> */}
                </View>
              </>
            )}
          </>
        )}
        className={cn(inputValue ? 'font-dingpro-medium' : 'font-normal')}
        style={style}
        {...res}
      />
    )
  }
)

export default InputNumber
