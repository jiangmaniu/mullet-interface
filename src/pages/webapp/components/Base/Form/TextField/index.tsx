import type { ComponentType, Ref } from 'react'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { mergeCss } from '@/pages/webapp/utils'
import { Input, InputProps, InputRef } from 'antd-mobile'
import clsx from 'clsx'
import { Text } from '../../Text'
import { View } from '../../View'

export interface TextFieldAccessoryProps {
  // style: clsx.ClassValue[]
  style: React.CSSProperties
  className: string
  status: TextFieldProps['status']
  multiline: boolean
  editable: boolean
}

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
  style?: clsx.ClassValue[]
  /**
   * 输入框高度
   */
  height?: number
  /**
   * Style overrides for the container
   * 整個容器的樣式
   */
  containerStyle?: clsx.ClassValue[]
  /**
   * Style overrides for the input wrapper
   * 輸入框的樣式
   */
  inputWrapperStyle?: React.CSSProperties[]
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
}

/**
 * A component that allows for the entering and editing of text.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-TextField.md)
 */
export const TextField = forwardRef((props: TextFieldProps, ref: Ref<InputRef | null>) => {
  const { t } = useI18n()
  const {
    label,
    RightLabel,
    placeholder = t('components.input.Placeholder'),
    status,
    disabled,
    RightAccessory,
    LeftAccessory,
    style: $textStyleOverride,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    height = 42,
    onFocus,
    onBlur,
    value,
    onChange: onChangeText,
    onChange, // 将 onChagne 分离出来，不对 onChagne 响应，统一使用 onChagneText
    onEndEditing, // 单独处理输入完成响应
    autoSelectAll = false,
    ...TextInputProps
  } = props
  const input = useRef<InputRef>(null)
  const { cn, theme } = useTheme()
  const [isFocus, setFocus] = useState(false)
  const innerDisabled = disabled || status === 'disabled'

  const readOnly = TextInputProps.readOnly || innerDisabled

  function focusInput() {
    if (innerDisabled) return

    if (isFocus) {
      input.current?.blur()
    } else {
      input.current?.focus()
    }
  }

  useImperativeHandle(ref, () => input.current)

  return (
    <View
      // activeOpacity={1}
      className={cn({ height }, 'mb-[22px]', ...($containerStyleOverride ?? []))}
      onPress={focusInput}
      // accessibilityState={{ disabled: innerDisabled }}
    >
      {!!label && (
        <View className={cn('flex flex-row items-center justify-between')}>
          <Text className={cn('mb-1')}>{label} </Text>
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
          { paddingInlineStart: LeftAccessory ? 0 : 20 },
          { paddingInlineEnd: RightAccessory ? 0 : 20 },
          { backgroundColor: innerDisabled ? theme.colors.Input.disabledBg : theme.colors.Input.bgColor },
          innerDisabled ? { border: 0 } : {},
          ...($inputWrapperStyleOverride ?? [])
        )}
      >
        {!!LeftAccessory && <LeftAccessory className={cn('h-10 justify-center items-center ')} status={status} editable={!readOnly} />}

        <Input
          ref={input}
          // underlineColorAndroid="transparent"
          // textAlignVertical="top"
          placeholder={placeholder}
          // onFocus={(e) => {
          //   setFocus(true)
          //   onFocus?.(e)
          // }}
          // onBlur={(e) => {
          //   setFocus(false)
          //   onBlur?.(e)
          // }}
          clearable
          value={value}
          {...TextInputProps}
          readOnly={readOnly}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn('flex-1 text-sm px-3 flex align-middle', ...($textStyleOverride ?? []))}
          style={mergeCss(
            { color: theme.colors.textColor.primary },
            innerDisabled ? { color: theme.colors.Input.placeholderTextColor } : {},
            status === 'error' ? { color: theme.colors.red.DEFAULT } : {},
            // TextInputProps.multiline && { height: 'auto' },
            {
              height
            }
          )}
        />

        {!!RightAccessory && (
          <RightAccessory className={cn('mr-4 h-10 justify-center items-center')} status={status} editable={!readOnly} />
        )}
      </View>
    </View>
  )
})
