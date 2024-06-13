import { ProFormSelect } from '@ant-design/pro-components'
import { ProFormSelectProps } from '@ant-design/pro-form/es/components/Select'
import { FormattedMessage, useIntl } from '@umijs/max'
import { useRequest } from 'ahooks'
import { FormInstance } from 'antd/lib'
import { useState } from 'react'

import Picker, { PickerIProps } from '@/components/Base/MobilePicker'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import useLangChange from '@/hooks/useLangChange'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { getAreaCode } from '@/services/api/common'

type AreaCodeItem = API.KEYVALUE & {
  /**英文label */
  areaName: string
  /**中文label */
  areaNameZh: string
  areaCode: string
}
type valueKey = keyof AreaCodeItem
/**
 * 手机区号选择
 * @returns
 */
interface IProps {
  disabled?: boolean
  /** value的key */
  valueKey?: valueKey
  selectProps?: ProFormSelectProps
  pickerProps?: Omit<PickerIProps, 'options'>
  /**@name 表单实例 */
  form?: FormInstance
  /**@name 表单项名称 */
  name: string
  label?: React.ReactNode
  initialValue?: any
  onChange?: (value: any, option: any) => void
  /**@name 1 手机区号 2选择国籍 */
  type?: number
}

export default function AreaCodeSelect({
  valueKey,
  selectProps,
  pickerProps,
  form,
  name,
  disabled,
  label,
  initialValue,
  onChange,
  type = 1
}: IProps) {
  const { isMobileOrIpad } = useEnv()
  const intl = useIntl()
  const { lng } = useLang()
  const [langKey, setLangKey] = useState(0) // 用于触发重新渲染的 key

  const { loading, data, run } = useRequest(getAreaCode)
  const tempList = data?.data || []
  const list = tempList as AreaCodeItem[]

  const options = list?.map((v: AreaCodeItem) => {
    const [areaNameZh, areaName] = v.value?.split(',')
    const label = lng === 'zh-TW' ? areaNameZh : areaName || areaNameZh
    return {
      key: v.key,
      label,
      areaNameZh,
      areaName,
      value: v.key,
      areaCode: `+${v.key}`
    }
  })

  let fieldOptions = {}

  // 手机区号选择
  if (type === 1) {
    fieldOptions = {
      optionItemRender: (option: any) => {
        return (
          <div className="flex justify-between">
            <span>{option.label}</span>
            <span>{option?.areaCode}</span>
          </div>
        )
      },
      // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
      optionLabelProp: valueKey || 'value'
    }
  }

  useLangChange(() => {
    setLangKey((prevKey) => prevKey + 1) // 切换语言时更新 key
  }, [])

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <ProFormSelect
          showSearch
          placeholder={intl.formatMessage({ id: 'mt.xuanzequhao' })}
          options={options}
          // 表单属性name
          name={name}
          disabled={disabled}
          label={label}
          initialValue={initialValue}
          onChange={(value, option = {}) => {
            // @ts-ignore
            const val = valueKey === 'areaName' ? value : option[valueKey] || value

            console.log('val', val)
            console.log('option', option)
            // 重新赋值，否则数据不准
            option.label = option['data-item']?.label

            // @ts-ignore
            form.setFieldsValue({ [name]: val }) // 表单重新正确的赋值，避免option中value值影响

            onChange?.(val, option)
          }}
          {...selectProps}
          fieldProps={{
            // @ts-ignore
            ...(selectProps.fieldProps || {}),
            ...fieldOptions,
            // 处理搜索
            filterOption: (initialValue, option) => {
              // @ts-ignore
              return option?.key?.indexOf(initialValue) !== -1 || (option?.label || '').indexOf(initialValue) !== -1
            },
            suffixIcon: <SelectSuffixIcon disabled={disabled} />
          }}
        />
      }
      wapComponent={
        // @ts-ignore
        <Picker
          name={name}
          form={form}
          valueKey={valueKey}
          required={!disabled}
          allowClear={false}
          placeholder={<FormattedMessage id="mt.quhao" />}
          options={options}
          style={{ paddingLeft: 10, paddingRight: 10 }}
          disabled={disabled}
          value={[initialValue]}
          key={langKey}
          onConfirm={(value, option) => {
            // @ts-ignore
            const val = option[valueKey] || value?.[0]

            console.log('value', value)
            console.log('option', option)

            // 重新再次赋值一次，针对areaName，表单需要设置value即aredId的唯一值
            if (valueKey === 'areaName') {
              setTimeout(() => {
                form?.setFieldsValue({ [name]: value?.[0] })
              }, 100)
            }

            onChange?.(val, option)
          }}
          // 自定义option列表项
          renderLabel={(item) => {
            const areaCode = options?.find((v: any) => v.areaId === item.value)?.areaCode
            return (
              <div className="flex items-center justify-between">
                <span className="text-main pr-3">{areaCode}</span>
                <span className="text-main">{item.label}</span>
              </div>
            )
          }}
          // 自定义选择后展示在输入框上的项
          renderSelectItem={({ items, selectedLabel }) => {
            const item = options?.find((v: AreaCodeItem) => {
              const label = lng === 'zh-TW' ? v.areaNameZh : v.areaName
              return label === selectedLabel
            }) as AreaCodeItem

            const label = lng === 'zh-TW' ? item?.areaNameZh : item?.areaName
            return <span className="text-main">{valueKey === 'areaName' ? label : item[valueKey as valueKey] || item.areaCode}</span>
          }}
          showSearch
          label={label}
          {...pickerProps}
        />
      }
    />
  )
}
