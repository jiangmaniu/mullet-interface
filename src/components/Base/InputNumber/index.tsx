import { ProFormDigit } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { FormInstance } from 'antd/lib'
import classnames from 'classnames'
import { debounce } from 'lodash-es'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'
import { isTruthy, toFixed } from '@/utils'

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
    precision = 2,
    onAdd,
    onMinus,
    showAddMinus = true,
    placeholder = intl.formatMessage({ id: 'common.pleaseInput2' }),
    addonBefore,
    width,
    autoFocus = true,
    showFloatTips = true,
    hiddenPrecision = true
  } = props
  const inputRef = useRef<any>()
  const [inputValue, setInputValue] = useState<any>('')
  const [isFocus, setFocus] = useState(false)
  const newValue = Number(inputValue || 0)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
    setInputValue(value ? toFixed(value, precision) : value)
  }

  const AddIcon = (
    <div
      className={classnames(
        'flex h-full w-[43px] cursor-pointer select-none items-center justify-center rounded-r-lg border-l border-primary dark:bg-gray-750 text-xl text-weak',
        isColumn && '!rounded-r-[0px] border-b border-l-0',
        { '!cursor-not-allowed !text-weak/50': disabled || (max && newValue >= max) },
        classNames?.add
      )}
      onClick={debounce(handleAdd, 100)}
    >
      +
    </div>
  )
  const MinusIcon = (
    <div
      className={classnames(
        'relative flex h-full w-[43px] cursor-pointer select-none items-center justify-center rounded-l-lg border-r border-primary dark:bg-gray-750 text-xl text-weak',
        isColumn && 'border-none',
        { '!cursor-not-allowed !text-weak/50': (min && newValue <= min) || disabled },
        classNames?.minus
      )}
      onClick={debounce(handleMinus, 100)}
    >
      -
    </div>
  )

  const innerRootClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-input-number-disabled': {
        background: '#f8f8f8 !important'
      },
      input: {
        height,
        // paddingLeft: 12,
        textAlign: textAlign || 'center',
        width: width || 'auto',
        background: isDark ? gray[750] : '#fff'
      },
      '.ant-input-number-group-addon': {
        background: `${disabled ? '#f8f8f8' : '#fff'} !important`,
        border: 'none !important'
      },
      '.ant-input-number-input-wrap input::placeholder': {
        fontSize: '14px !important'
      },
      '.ant-input-number-group .ant-input-number:hover': {
        border: 'none !important'
      },
      '.ant-input-number-input': {
        background: disabled ? 'transparent' : isDark ? gray[750] : '#fff'
      },
      '.input-wrapper:hover': {
        border: `1px solid ${disabled ? '#E1E1E1' : '#9c9c9c'}`
      },
      '.ant-form-item-control-input-content': {
        background: disabled ? '#f8f8f8' : '#fff'
      }
    }
  })

  return (
    <div className={classnames('relative w-full', rootClassName, innerRootClassName)}>
      {label && <div className={classnames('text-sm pb-[4px] text-left font-normal text-primary', classNames?.label)}>{label}</div>}
      <div
        className={classnames(
          'relative z-20 flex h-[40px] items-center justify-between overflow-hidden rounded-lg border border-primary bg-white input-wrapper',
          className
        )}
        style={{ height }}
      >
        {showAddMinus && direction === 'row' && MinusIcon}
        <ProFormDigit
          placeholder={placeholder}
          className={classnames(
            'h-full w-full flex-1 px-4 text-center text-sm font-bold text-primary placeholder:text-secondary disabled:bg-gray-50/60',
            classNames?.input,
            disabled && 'cursor-not-allowed'
          )}
          onChange={(val: any) => {
            if (!isTruthy(val)) {
              setFocus(false)
            } else {
              setFocus(true)
            }
            if (onChange) {
              onChange(val)
            } else {
              // 不能超过最大值
              if (max && val > max) {
                onSetInputValue(max)
                return
              }
              onSetInputValue(val)
            }
          }}
          name={name}
          disabled={disabled}
          filedConfig={{
            style: { marginBottom: 0, flex: 1, lineHeight: `${height}px` },
            className: disabled ? 'bg-[--input-disabled-bg] cursor-not-allowed' : ''
          }}
          addonBefore={inputValue && addonBefore ? <span className="text-xs text-secondary pl-3">{addonBefore}</span> : undefined}
          fieldProps={{
            ref: inputRef,
            controls: false,
            maxLength: 12,
            autoFocus: false,
            max,
            min,
            value: inputValue,
            precision: hiddenPrecision ? undefined : 0,
            onFocus: () => setFocus(true),
            onBlur: () => setFocus(false),
            autoComplete: 'off',
            addonAfter: unit && <span className="text-xs font-normal text-weak">{unit}</span>,
            // @ts-ignore
            styles: { border: 'none', input: { height } },
            className: `custom-inputnumber ${classNames?.input}`, // @hack处理 样式在globals.scss中添加
            // classNames: { input: classNames?.input, wrapper: 'flex items-center justify-between px-[10px]' }
            // class: classNames?.input, // 设置input-number组件input输入框样式
            // classes: { affixWrapper: '!border-none focus:!shadow-none focus-within:!shadow-none' },
            classNames: { input: classNames?.input, wrapper: 'flex items-center justify-between px-[10px]' }
          }}
        />
        {showAddMinus && direction === 'row' && AddIcon}
        {isColumn && (
          <div className="flex h-full items-center">
            <div className="flex h-full flex-col items-center justify-center border-l border-primary">
              {AddIcon}
              {MinusIcon}
            </div>
          </div>
        )}
      </div>
      {isFocus && tips && showFloatTips && (
        <div
          className={classnames(
            'absolute top-[35px] z-10 flex w-full items-end justify-center rounded-b-lg border border-primary bg-gray-50 px-1 py-2 text-center text-xs text-weak',
            classNames?.tips
          )}
        >
          {tips}
        </div>
      )}
      {tips && !showFloatTips && <div className="text-xs text-secondary pt-[7px]">{tips}</div>}
    </div>
  )
}

export default observer(InputNumber)
