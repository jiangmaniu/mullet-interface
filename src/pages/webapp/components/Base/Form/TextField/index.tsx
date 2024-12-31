import type { ComponentType, Ref } from 'react'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { mergeCss } from '@/pages/webapp/utils'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Input, InputProps, InputRef } from 'antd-mobile'
import { View } from '../../View'

export interface TextFieldAccessoryProps {
  style: React.CSSProperties
  className: string
  status: TextFieldProps['status']
  multiline: boolean
  editable: boolean
}

export type InputTextAlign = 'center' | 'left' | 'right' | undefined

export interface TextFieldProps extends Omit<InputProps, 'ref' | 'style' | 'onEndEditing'> {
  /**
   * A style modifier for different input states.
   */
  status?: 'error' | 'disabled'
  /**
   * 禁用输入框
   */
  disabled?: boolean
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: React.ReactNode
  /**
   * Optional input style override.
   * 輸入框內文字樣式
   */
  style?: React.CSSProperties
  /**
   * 输入框高度
   */
  height?: number
  /**
   * Style overrides for the container
   * 整個容器的樣式
   */
  containerStyle?: React.CSSProperties
  containerClassName?: string
  /**
   * Style overrides for the input wrapper
   * 輸入框的樣式
   */
  inputWrapperStyle?: React.CSSProperties
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<any>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<any>

  // 重写 onEndEditing 事件
  onEndEditing?: (value: string | undefined) => void

  // 聚焦的时候自动全选
  autoSelectAll?: boolean

  /**
   * 右側的標籤
   */
  RightLabel?: ComponentType<any>
  /**输入框文本对齐方式 */
  textAlign?: InputTextAlign
  /**输入框文字大小 */
  fontSize?: number
  /**输入框文字颜色 */
  textColor?: string
  /**输入框占位符文字颜色 */
  pleacholderTextColor?: string
  /**输入框占位符文字大小 */
  placeholderTextSize?: number
}

/**
 * A component that allows for the entering and editing of text.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-TextField.md)
 */
export const TextField = forwardRef((props: TextFieldProps, ref: Ref<InputRef | null>) => {
  const { t } = useI18n()
  const { cn, theme } = useTheme()
  const {
    label,
    RightLabel,
    placeholder = t('components.input.Placeholder'),
    status,
    disabled,
    RightAccessory,
    LeftAccessory,
    style: $textStyleOverride,
    className: $inputClassName,
    containerStyle: $containerStyleOverride,
    containerClassName,
    inputWrapperStyle: $inputWrapperStyleOverride,
    height = 42,
    onFocus,
    onBlur,
    value,
    onChange,
    onEndEditing, // 单独处理输入完成响应
    autoSelectAll = false,
    textAlign = 'left',
    fontSize = 14,
    textColor,
    pleacholderTextColor = theme.colors.Input.placeholderTextColor,
    placeholderTextSize = 14,
    maxLength,
    ...TextInputProps
  } = props
  const input = useRef<InputRef>(null)
  const [inputValue, setInputValue] = useState<any>('')

  const [isFocus, setFocus] = useState(false)
  const innerDisabled = disabled || status === 'disabled'

  const readOnly = TextInputProps.readOnly || innerDisabled

  // 添加防抖定时器引用
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Web 端需要特殊处理：限制输入框最大长度
  const checkMaxLength = useCallback(
    (value?: string) => {
      if (maxLength && value?.length && value.length > maxLength) {
        return value.slice(0, maxLength)
      }
      return value
    },
    [maxLength]
  )

  useEffect(() => {
    setInputValue(checkMaxLength(value))
  }, [value])

  const handleOnEndEditing = (value: any) => {
    // 设置新的定时器，500ms 后触发 onEndEditing
    if (onEndEditing) {
      // 清除之前的定时器
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => {
        onEndEditing(value)
      }, 300)
    }
  }

  const handleChange = (value: string) => {
    const val = checkMaxLength(value)

    onChange?.(val || '')

    setInputValue(val)

    handleOnEndEditing(value)
  }

  useImperativeHandle(ref, () => input.current)

  const innerInputClassName = useEmotionCss(({ token }) => {
    return {
      '&': {
        input: {
          height,
          '&::placeholder': {
            fontSize: `${placeholderTextSize}px`
          },
          '&::selection': {
            backgroundColor: 'transparent'
          }
        }
      }
    }
  })

  return (
    <View className={cn('mb-[22px]', containerClassName)} style={{ height, ...$containerStyleOverride }}>
      {!!label && (
        <View className={cn('flex flex-row items-center justify-between')}>
          <View className={cn('mb-1 w-full')}>{label}</View>
          {!!RightLabel && <RightLabel />}
        </View>
      )}

      <View
        className={cn('flex flex-row items-center overflow-hidden h-full w-full border rounded-[6px]')}
        style={mergeCss(
          {
            borderColor: isFocus ? theme.colors.Input.activeBorderColor : theme.colors.Input.borderColor,
            backgroundColor: theme.colors.Input.bgColor
          },
          status === 'error' ? { borderColor: theme.colors.red.DEFAULT } : {},
          // { paddingInlineStart: LeftAccessory ? 0 : 20 },
          // { paddingInlineEnd: RightAccessory ? 0 : 20 },
          { backgroundColor: innerDisabled ? theme.colors.Input.disabledBg : theme.colors.Input.bgColor },
          innerDisabled ? { borderWidth: 0 } : {},
          { ...($inputWrapperStyleOverride || {}) }
        )}
      >
        {!!LeftAccessory && (
          <LeftAccessory
            className={cn('h-10 justify-center items-center flex')}
            style={{
              display: 'flex',
              height: '40px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            status={status}
            editable={!readOnly}
          />
        )}

        <Input
          ref={input}
          placeholder={placeholder}
          onFocus={(e) => {
            setFocus(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocus(false)
            onBlur?.(e)
          }}
          clearable
          value={value}
          maxLength={maxLength}
          {...TextInputProps}
          readOnly={readOnly}
          onChange={handleChange}
          className={cn('flex-1 text-sm px-3 flex align-middle', innerInputClassName, $inputClassName)}
          style={{
            '--text-align': textAlign, // 输入框文字对齐方式
            '--placeholder-color': theme.colors.Input.placeholderTextColor,
            '--font-size': `${fontSize}px`, // 输入框字体大小
            '--color': textColor || theme.colors.textColor.primary,
            ...mergeCss(
              { color: theme.colors.textColor.primary },
              innerDisabled ? { color: theme.colors.Input.placeholderTextColor } : {},
              status === 'error' ? { color: theme.colors.red.DEFAULT } : {},
              {
                height,
                ...($textStyleOverride || {})
              }
            )
          }}
          autoFocus={false}
        />

        {!!RightAccessory && (
          <RightAccessory
            className={cn('mr-4 h-10 justify-center items-center flex')}
            style={{
              display: 'flex',
              marginRight: '20px',
              height: '40px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            status={status}
            editable={!readOnly}
          />
        )}
      </View>
    </View>
  )
})
