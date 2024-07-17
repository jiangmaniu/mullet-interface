import { CloseCircleFilled, DownOutlined } from '@ant-design/icons'
import { FormInstance, ProFormText } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import { Picker as AntdPicker, PickerProps } from 'antd-mobile'
import { PickerColumn, PickerColumnItem, PickerValue } from 'antd-mobile/es/components/picker'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import { debounce } from 'lodash-es'
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react'
import { flushSync } from 'react-dom'

import { useLang } from '@/context/languageProvider'
import { colorTextSecondary } from '@/theme/theme.config'

type SelectItem = {
  items: (PickerColumnItem | null)[]
  selectedLabel?: string | number
  selectedValue?: string | number
}

// 排除columns，不继承，使用options代替
export interface PickerIProps extends Omit<PickerProps, 'columns'> {
  placeholder?: string | React.ReactNode
  wrapperStyle?: React.CSSProperties
  /**自定义渲染选择的项展示 */
  renderSelectItem?: ({ items, selectedLabel, selectedValue }: SelectItem) => React.ReactNode
  value?: any[]
  onConfirm?: (value: any, option?: any) => void
  label?: React.ReactNode
  /**自定义label节点 */
  renderLabelNode?: React.ReactNode
  /**必填标识 */
  required?: boolean
  /**@name 列表项 */
  options: any[] | undefined
  /**@name 允许清空 */
  allowClear?: boolean
  /**@name Form实例 */
  form?: FormInstance
  /**@name 表单的name字段 */
  name?: string
  /**从option中获取value的key */
  valueKey?: string
  style?: React.CSSProperties
  /**@name flex排列方式 */
  direction?: 'column' | 'row'
  className?: string
  disabled?: boolean
  /**@name 是否在顶部位置展示搜索框*/
  showSearch?: boolean
}

// 移动端使用picker，pc端使用select
// 这里picker只处理选择一列的项，多列没有考虑

const PickerComp = forwardRef(
  (
    {
      placeholder,
      wrapperStyle,
      renderSelectItem,
      value,
      onConfirm,
      label,
      renderLabelNode,
      required,
      options,
      allowClear = true,
      form,
      name,
      valueKey,
      style,
      direction = 'column',
      className,
      disabled,
      showSearch,
      ...res
    }: PickerIProps,
    ref: any
  ) => {
    const { lng, count } = useLang()
    const [selectedValue, setSelectedValue] = useState<string[]>([])
    const [columns, setColumns] = useState<PickerColumn[] | ((value: PickerValue[]) => PickerColumn[])>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      setSelectedValue(value as string[])
    }, [value])

    useEffect(() => {
      setColumns([options?.map((v) => ({ value: v.value, label: v.label })) || []])
    }, [options])

    useImperativeHandle(ref, () => {
      return {
        setValue: setSelectedValue,
        value: selectedValue[0]
      }
    })

    const defaultPlaceholder = placeholder || <FormattedMessage id="common.pleaseSelect" />

    const renderDownIcon = () => {
      if (disabled) return null
      return (
        <>
          {selectedValue?.length > 0 && allowClear ? (
            <CloseCircleFilled
              className="cursor-pointer w-[20px] h-[20px] text-sub/40 absolute right-[6px] top-[5px] flex justify-center"
              onClick={(e) => {
                if (disabled) return
                e.stopPropagation()
                setSelectedValue([])
                onConfirm?.([])
                form?.resetFields([name])
              }}
            />
          ) : (
            <DownOutlined style={{ color: colorTextSecondary, fontSize: 12 }} />
          )}
        </>
      )
    }

    let title = undefined

    if (showSearch) {
      const searchObjects = (options: any, value: any) => {
        return (
          options?.filter((option: any) =>
            Object.values(option).some((fieldValue: any) => fieldValue.toString().toLowerCase().includes(value.toLowerCase()))
          ) || []
        )
      }
      title = (
        <ProFormText
          fieldProps={{
            onChange: debounce((v) => {
              // 使用loading，重载columns dom，否则不会刷新
              setLoading(true)
              const value = v?.target?.value
              // 从options源数据源中搜索
              const filterOptions = searchObjects(options, value)
              const opts = filterOptions.map((v: any) => ({ value: v.value, label: v.label }))
              flushSync(() => {
                setColumns([opts])
              })
              setTimeout(() => {
                setLoading(false)
              }, 300)
            }, 500)
          }}
          filedConfig={{ style: { height: 15 } }}
        />
      )
    }

    return (
      <div
        className={classNames('w-full flex', [className])}
        style={{
          flexDirection: direction,
          ...style
        }}
      >
        {label && !renderLabelNode ? (
          <div className="flex pb-[5px]">
            {required && (
              <span style={{ color: '#ff4d4f' }} className="mr-1 text-sm">
                *
              </span>
            )}
            <span className="text-main text-sm">{label}</span>
          </div>
        ) : (
          renderLabelNode
        )}
        <AntdPicker
          onConfirm={(v: any) => {
            const val = v?.[0]
            const option = options?.find((v) => v.value === val)
            console.log('option', option)
            onConfirm?.(v, option)
            setSelectedValue(v)
            // 表单赋值
            if (name) {
              // 如果传valueKey，从option对象中取值设置到表单上
              form?.setFieldValue(name, valueKey ? option[valueKey] : val)
            }
          }}
          value={selectedValue}
          columns={columns}
          stopPropagation={['click']}
          title={title}
          loading={loading}
          {...res}
        >
          {(items, { open }) => {
            const unSelected = items.every((item) => item === null)
            const selectedLabel = items.map((item) => item?.label ?? '').join(',')
            const selectedValue = items.map((item) => item?.value ?? '').join(',')
            return (
              <div
                className="flex justify-between items-center cursor-pointer border border-[#d9d9d9] rounded-[6px] py-[5px] px-2 mb-3 relative w-full"
                style={{
                  ...wrapperStyle,
                  ...(disabled
                    ? {
                        background: '#FAFBFC',
                        cursor: 'no-drop',
                        pointerEvents: 'none'
                      }
                    : {})
                }}
                onClick={() => {
                  !disabled && open()
                }}
              >
                {unSelected && (
                  <>
                    <div className="text-main/30 text-sm">{defaultPlaceholder}</div>
                    {renderDownIcon()}
                  </>
                )}
                {!unSelected && (
                  <>
                    <div className="text-main text-sm truncate flex-1" style={disabled ? { color: 'rgba(0, 0, 0, 0.25)' } : {}}>
                      {disabled ? selectedLabel : renderSelectItem?.({ items, selectedLabel, selectedValue }) || selectedLabel}
                    </div>
                    <div className="w-[20px] text-right">{renderDownIcon()}</div>
                  </>
                )}
              </div>
            )
          }}
        </AntdPicker>
        {/* 隐藏表单项，赋值，方便表单提交 */}
        {name && <ProFormText hidden name={name} />}
      </div>
    )
  }
)

const Picker = memo(PickerComp, (preProps: any, nextProps: any) => {
  // 返回false重新渲染，返回true不重新渲染
  return preProps.value || nextProps.value ? isEqual(preProps.value, nextProps.value) : isEqual(preProps, nextProps)
})

export default Picker
