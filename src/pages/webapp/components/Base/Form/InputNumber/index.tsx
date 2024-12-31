import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { regInput } from '@/utils'
import { add, subtract } from '@/utils/float'
import { observer } from 'mobx-react'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Text } from '../../Text'
import { View } from '../../View'
import type { InputTextAlign, TextFieldProps } from '../TextField'
import { TextField } from '../TextField'

export type InputNumberProps = TextFieldProps & {
  /** 禁用 */
  disabled?: boolean
  placeholder?: string
  /** 右侧文字 */
  rightText?: React.ReactNode
  onPressRightText?: () => void
  textAlign?: InputTextAlign
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
  style?: React.CSSProperties
  status?: 'error' | 'disabled'
  /** 自动全选 */
  autoSelectAll?: boolean
  /** 在 onChange / onEndEditing 时修正数值 */
  fixedTrigger?: 'onChange' | 'onEndEditing' | 'always'
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
      className,
      fixedTrigger = 'onEndEditing',
      ...res
    }: InputNumberProps,
    ref
  ) => {
    const { global } = useStores()
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

    // const handleFocus = () => {
    //   if (autoSelectAll) {
    //     inputRef.current?.setSelection(0, String(newValue)?.length || 0)
    //   }
    //   onFocus?.(null as any)
    // }

    const fix = (text: string) => {
      let newText = String(text)
      // 处理输入整数
      if (hiddenPrecision) {
        newText = newText.replace(/[^\d]/g, '') // 只允许输入数字
        newText = newText.replace(/^0+(\d)/, '$1') // 如果以0开头，去掉前导0
      } else {
        // 处理输入小数
        newText = newText.replace(/[^-\d.]/g, '') // 允许负号、数字和小数点
        newText = newText.replace(/^(-?)0+([1-9])/, '$1$2') // 处理前导零，保留可能的负号
        newText = newText.replace(/^(-?)\./, '$10.') // 如果以小数点开始，在小数点前加0
        newText = newText.replace(/\.{2,}/g, '.') // 只保留第一个小数点
        newText = newText.replace(/^(-?[^.]*\.[^.]*)(\..*)?$/, '$1') // 只保留第一个小数点之后的部分
        newText = regInput(newText, precision)
      }

      // 处理输入的最大值
      if (newText && newText > max) {
        newText = max
      }

      return newText
    }

    const handleChangeText = (text: string) => {
      let newText = text

      // 在 onChange 时修正数值
      if (fixedTrigger === 'onChange' || fixedTrigger === 'always') {
        newText = fix(text)
      }

      setInputValue(newText)
      onChange?.(newText)
    }

    const handleEndEditing = (text: string | undefined) => {
      if (!text) {
        setTimeout(() => {
          setInputValue('')
          onEndEditing?.(text)
        }, 10)
        return
      }

      // 在 onEndEditing 时修正数值
      if (fixedTrigger === 'onEndEditing' || fixedTrigger === 'always') {
        const newText = fix(text)
        setTimeout(() => {
          setInputValue(newText)
          onEndEditing?.(newText)
        }, 10)
      }
    }

    return (
      <TextField
        ref={inputRef}
        autoSelectAll={autoSelectAll}
        LeftAccessory={() => (
          <>
            {controls && (
              <>
                <View
                  disabled={disabledMinus}
                  onClick={() => {
                    onFocus?.(null as any)
                    if (disabledMinus) return
                    if (onMinus) {
                      onMinus()
                    } else {
                      const retValue = String(subtract(newValue, step))
                      onChange?.(retValue)
                      handleEndEditing?.(retValue)
                    }
                  }}
                  style={{ paddingLeft: 4 }}
                >
                  <Iconfont
                    name="shurukuang-jian"
                    color={disabledMinus ? theme.colors.gray['100'] : theme.colors.textColor.primary}
                    size={34}
                  />
                </View>
                <View borderColor="weak" className={cn('h-[40%] border')} />
              </>
            )}
          </>
        )}
        height={height}
        placeholder={placeholder}
        textAlign={textAlign || 'center'}
        disabled={disabled}
        value={inputValue}
        clearable={false}
        onBlur={() => {
          let newValue = Number(inputValue)

          // 处理输入的最小值
          if (newValue && newValue < min) {
            newValue = min
            handleEndEditing?.(String(newValue))
            return
          }

          // 处理输入的最大值
          if (newValue && newValue > max) {
            newValue = max
            handleEndEditing?.(String(newValue))
          }
        }}
        onChange={handleChangeText}
        // onChange={(value) => {
        //   setInputValue(value)
        //   handleEndEditing?.(String(value))
        // }}
        onEndEditing={() => handleEndEditing?.(String(inputValue))}
        onFocus={onFocus}
        containerStyle={{ marginBottom: 10 }}
        RightAccessory={() => (
          <>
            {controls && (
              <>
                {rightText && !disabled && (
                  <View
                    disabled={disabled}
                    onClick={() => {
                      onFocus?.(null as any)
                      onPressRightText?.()
                      onChange?.(String(max))
                      handleEndEditing?.(String(max))
                    }}
                    className={cn('mr-2')}
                  >
                    <Text size="sm" weight="medium" color="primary">
                      {rightText}
                    </Text>
                  </View>
                )}
                <View borderColor="weak" className={cn('h-[40%] border')} />
                <View
                  disabled={disabledAdd}
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
                      handleEndEditing?.(String(val))
                    }
                  }}
                  style={{ paddingRight: 4 }}
                >
                  <Iconfont
                    name="shurukuang-jia"
                    color={disabledAdd ? theme.colors.gray['100'] : theme.colors.textColor.primary}
                    size={34}
                  />
                </View>
              </>
            )}
          </>
        )}
        className={cn(inputValue ? 'font-dingpro-medium' : 'font-normal', className)}
        style={style}
        type="number"
        {...res}
      />
    )
  }
)

export default observer(InputNumber)
