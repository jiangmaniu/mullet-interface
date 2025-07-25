// @ts-nocheck
import { ProFormText } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { FormInstance } from 'antd/lib'
import { debounce } from 'lodash-es'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { formatNum, isTruthy, regInput } from '@/utils'
import { cn } from '@/utils/cn'

type IProps = {
  name?: string
  form?: FormInstance
  label?: React.ReactNode
  rootClassName?: string
  unit?: React.ReactNode
  direction?: 'row' | 'column'
  step?: number
  onChange?: (value: any) => void
  value?: any
  max?: number
  min?: number
  tips?: React.ReactNode
  disabled?: boolean
  className?: string
  classNames?: { add?: string; minus?: string; label?: string; input?: string; tips?: string }
  height?: number
  /**精度小数位 */
  precision?: number
  onAdd?: () => void
  onMinus?: () => void
  placeholder?: string
  /**文本对齐方式 */
  textAlign?: 'center' | 'left' | 'right'
  /**是否展示加减号 */
  showAddMinus?: boolean
  addonBefore?: React.ReactNode
  width?: number
  /**自动聚焦表单 */
  autoFocus?: boolean
  /**提示是否浮动在输入框展示 */
  showFloatTips?: boolean
  hiddenPrecision?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export const FloatTips = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        'absolute top-[32px] z-10 flex w-full overflow-hidden items-end justify-center rounded-b-lg border border-primary dark:bg-gray-560 bg-gray-50 dark:border-gray-572 px-1 pb-2 pt-3 text-center text-xs text-weak dark:text-gray-125',
        className
      )}
    >
      {children}
    </div>
  )
}

function InputNumber(props: IProps) {
  const intl = useIntl()
  const {
    textAlign,
    name,
    form,
    label,
    rootClassName,
    unit,
    direction = 'row',
    step = 1,
    onChange,
    value,
    max,
    min = 0,
    tips,
    disabled,
    className,
    classNames,
    height = 38,
    precision = 0,
    onAdd,
    onMinus,
    showAddMinus = true,
    placeholder = intl.formatMessage({ id: 'common.qingshuru' }),
    addonBefore,
    width,
    autoFocus = true,
    showFloatTips = true,
    hiddenPrecision = true,
    onFocus,
    onBlur
  } = props
  const inputRef = useRef<any>()
  const [inputValue, setInputValue] = useState<any>('')
  const [isFocus, setFocus] = useState(false)
  const newValue = Number(inputValue || 0)
  const { theme } = useTheme()
  const { isDark } = theme

  const isColumn = direction === 'column'

  useEffect(() => {
    if (onChange) {
      setInputValue(value || '')
    } else {
      onSetInputValue(value)
    }
  }, [value])

  useEffect(() => {
    if (name) {
      // 设置表单值
      form?.setFieldValue?.(name, inputValue === 0 || inputValue ? Number(inputValue) : '')
    }
    // 设置表单聚焦
    // if (autoFocus && inputValue) {
    //   inputRef.current?.focus?.()
    // }
  }, [inputValue])

  const handleAdd = () => {
    if (disabled || (max && newValue >= Number(max))) return

    if (onAdd) {
      onAdd()
    } else {
      const retValue = newValue + step
      onSetInputValue(retValue)
      onChange?.(retValue)
    }
  }

  const handleMinus = () => {
    if (newValue <= 0 || disabled || (min && newValue <= Number(min))) return

    if (onMinus) {
      onMinus()
    } else {
      const retValue = newValue - step
      onSetInputValue(retValue)
      onChange?.(retValue)
    }
  }

  const onSetInputValue = (value: any) => {
    setInputValue(value ? formatNum(value, { precision }) : value)
  }

  const AddIcon = (
    <div
      className={cn(
        'flex h-full w-[43px] cursor-pointer select-none items-center z-[2] justify-center border-l border-primary dark:border-gray-585 dark:bg-gray-750 text-xl text-weak dark:text-white',
        isColumn && '!rounded-r-[0px] border-b border-l-0',
        { '!cursor-not-allowed !text-weak/50': disabled || (max && newValue >= max) },
        disabled ? 'bg-[--input-disabled-bg] !text-weak' : 'active:!text-white/80',
        classNames?.add
      )}
      onClick={debounce(handleAdd, 100)}
    >
      +
    </div>
  )
  const MinusIcon = (
    <div
      className={cn(
        'relative flex h-full w-[43px] cursor-pointer select-none items-center justify-center border-r border-primary dark:bg-gray-750 text-xl text-weak dark:text-white',
        isColumn && 'border-none',
        { '!cursor-not-allowed !text-weak/50': (min && newValue <= min) || disabled },
        disabled ? 'bg-[--input-disabled-bg] !text-weak' : 'active:!text-white/80',
        classNames?.minus
      )}
      onClick={debounce(handleMinus, 100)}
    >
      -
    </div>
  )

  const innerRootClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-input-disabled': {
        background: `${isDark ? 'var(--input-bg)' : '#f8f8f8'} !important`
      },
      input: {
        height,
        // paddingLeft: 12,
        textAlign: textAlign || 'center',
        width: width || '100%',
        background: disabled && !isDark ? '#f8f8f8' : 'var(--input-bg)',
        border: 'none',
        borderRadius: 0,
        fontWeight: '600'
      },
      'input:focus': {
        border: 'none',
        outline: 'none',
        boxShadow: 'none'
      },
      'input::placeholder': {
        fontSize: '14px !important',
        color: 'var(--input-placeholder-text-color)',
        fontWeight: '300'
      },
      '.ant-input-group-addon,.ant-input-group-wrapper': {
        background: `${disabled && !isDark ? '#f8f8f8' : 'var(--input-bg)'} !important`,
        border: 'none !important'
      },
      '.ant-input-wrap input::placeholder': {
        fontSize: '14px !important'
      },
      '.ant-input-group .ant-number:hover': {
        border: 'none !important'
      },
      '.ant-input': {
        background: disabled ? 'transparent' : isDark ? gray[750] : '#fff'
      },
      '.ant-input-wrapper,.ant-form-item-control-input': {
        input: {
          border: 'none !important'
        }
      },
      '.input-wrapper:hover':
        isDark && isFocus && showFloatTips
          ? {
              border: `1px solid ${gray[572]}`,
              borderBottomColor: gray[750]
            }
          : {
              border: disabled ? '1px solid none' : `1px solid #9c9c9c`
            },
      '.ant-form-item-control-input-content': {
        background: 'var(--input-bg)'
      }
    }
  })

  return (
    <div className={cn('relative w-full', rootClassName, innerRootClassName)}>
      {label && <div className={cn('text-sm pb-[4px] text-left font-normal text-primary', classNames?.label)}>{label}</div>}
      <div>
        <div
          className={cn(
            'relative z-20 flex h-[40px] items-center bg-white dark:bg-transparent justify-between overflow-hidden rounded-lg border dark:border-[0.5px] border-[var(--input-border)] input-wrapper',
            isFocus && showFloatTips && 'dark:border-gray-572 dark:border-b-gray-750',
            className
          )}
          style={{ height }}
        >
          {showAddMinus && direction === 'row' && MinusIcon}
          <ProFormText
            placeholder={placeholder}
            className={cn(
              'h-full w-full flex-1 px-4 text-center text-sm font-bold text-primary placeholder:text-secondary disabled:bg-gray-50/60',
              classNames?.input,
              disabled && 'cursor-not-allowed'
            )}
            onChange={(e: any) => {
              const text = e.target.value
              console.log('changed', text)
              let newText = text !== '' && text.substr(0, 1) === '.' ? '' : text
              newText = newText.replace(/^0+[0-9]+/g, '0') //不能以0开头输入
              newText = newText.replace(/[^\d.]/g, '') //清除"数字"和"."以外的字符
              newText = newText.replace(/\.{2,}/g, '.') //只保留第一个, 清除多余的
              newText = newText.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
              newText = regInput(newText, precision)

              if (!isTruthy(newText)) {
                setFocus(false)
              } else {
                setFocus(true)
              }

              if (onChange) {
                onChange(newText)
              } else {
                // 不能超过最大值
                if (max && newText > max) {
                  onSetInputValue(max)
                  return
                }
                onSetInputValue(newText)
              }
            }}
            name={name}
            disabled={disabled}
            filedConfig={{
              style: { marginBottom: 0, flex: 1, lineHeight: `${height}px` },
              className: disabled ? 'bg-[--input-disabled-bg] cursor-not-allowed' : ''
            }}
            allowClear={false}
            addonBefore={inputValue && addonBefore ? <span className="text-xs text-secondary pl-3">{addonBefore}</span> : undefined}
            fieldProps={{
              onBlurCapture: () => {
                // 失去焦点时候 如果用户输入的是1. 没有输入完整，去掉.
                if (inputValue && String(inputValue).endsWith('.')) {
                  const newValue = inputValue.slice(0, -1)
                  onChange?.(newValue)
                }
              },
              ref: inputRef,
              controls: false,
              maxLength: 12,
              autoFocus: false,
              max,
              min,
              value: inputValue,
              precision: hiddenPrecision ? undefined : precision,
              onFocus: () => {
                setFocus(true)
                onFocus?.()
              },
              onBlur: () => {
                setFocus(false)
                onBlur?.()
              },
              autoComplete: 'off',
              addonAfter: unit && <span className="text-xs font-normal text-weak">{unit}</span>,
              // @ts-ignore
              styles: { border: 'none', input: { height } },
              className: `custom-inputnumber ${classNames?.input}`, // @hack处理 样式在globals.scss中添加
              classNames: { input: classNames?.input, wrapper: 'flex items-center justify-between px-[10px]' },
              // class: classNames?.input, // 设置input-number组件input输入框样式
              classes: { affixWrapper: '!border-none focus:!shadow-none focus-within:!shadow-none' }
              // classNames: { input: classNames?.input, wrapper: 'flex items-center justify-between px-[10px]' }
            }}
          />
          {showAddMinus && direction === 'row' && AddIcon}
          {isColumn && (
            <div className="flex h-full items-center">
              <div className="flex h-full flex-col items-center justify-center border-l border-primary dark:border-gray-585 bg-[var(--input-bg)]">
                {AddIcon}
                {MinusIcon}
              </div>
            </div>
          )}
        </div>
        {isFocus && tips && showFloatTips && <FloatTips className={classNames?.tips}>{tips}</FloatTips>}
        {tips && !showFloatTips && <div className="text-xs text-secondary pt-[7px]">{tips}</div>}
      </div>
    </div>
  )
}

export default observer(InputNumber)
