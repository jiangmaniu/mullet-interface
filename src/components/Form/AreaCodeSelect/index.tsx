import { ProFormSelect } from '@ant-design/pro-components'
import { ProFormSelectProps } from '@ant-design/pro-form/es/components/Select'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { FormInstance } from 'antd/lib'
import { useEffect, useState } from 'react'

import Picker, { PickerIProps } from '@/components/Base/MobilePicker'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import useLangChange from '@/hooks/useLangChange'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'

export type AreaCodeItem = Common.AreaCodeItem
/**
 * 手机区号选择
 * @returns
 */
interface IProps {
  disabled?: boolean
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
  const { list, run } = useModel('areaList')
  const [langKey, setLangKey] = useState(0) // 用于触发重新渲染的 key

  useEffect(() => {
    run?.()
  }, [])

  const options = list
    ?.filter((item) => item.areaCode !== '0')
    ?.map((v: AreaCodeItem) => {
      const areaNameZh = v.nameCn
      const areaName = v.nameEn
      const label = lng === 'zh-TW' ? areaNameZh : areaName || areaNameZh
      return {
        ...v,
        label,
        value: v.id,
        areaCode: `+${v.areaCode}`
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
      optionLabelProp: 'value'
    }
  }

  useLangChange(() => {
    setLangKey((prevKey) => prevKey + 1) // 切换语言时更新 key
  }, [])

  const [option, setOption] = useState<any>(null)
  const handleChange = (option = {}) => {
    // @ts-ignore
    const val = option.areaCode

    // console.log('val', val)
    // console.log('option', option)

    // @ts-ignore
    form.setFieldsValue({ [name]: val }) // 表单重新正确的赋值，避免option中value值影响

    onChange?.(val, option)
  }

  useEffect(() => {
    option && handleChange(option)
  }, [intl.locale, option])

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
          // @ts-ignore
          onChange={(value, option = {}) => {
            setOption(option)
            // @ts-ignore
            // const val = option.areaCode

            // console.log('val', val)
            // console.log('option', option)

            // // @ts-ignore
            // form.setFieldsValue({ [name]: val }) // 表单重新正确的赋值，避免option中value值影响

            // onChange?.(val, option)
          }}
          {...selectProps}
          // @ts-ignore
          fieldProps={{
            // @ts-ignore
            ...(selectProps?.fieldProps || {}),
            ...fieldOptions,
            // 处理搜索
            filterOption: (initialValue, option) => {
              // @ts-ignore
              return option?.areaCode?.indexOf(initialValue) !== -1 || (option?.label || '').indexOf(initialValue) !== -1
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
            const val = option?.areaCode

            // console.log('value', value)
            // console.log('option', option)

            onChange?.(val, option)
          }}
          // 自定义option列表项
          renderLabel={(item) => {
            const phoneAreaCode = options?.find((v: any) => v.id === item.value)?.areaCode
            return (
              <div className="flex items-center justify-between">
                <span className="text-main pr-3">{phoneAreaCode}</span>
                <span className="text-main">{item.label}</span>
              </div>
            )
          }}
          // 自定义选择后展示在输入框上的项
          renderSelectItem={({ items, selectedLabel }) => {
            // @ts-ignore
            const item = options?.find((v: AreaCodeItem) => {
              const label = lng === 'zh-TW' ? v.nameCn : v.nameEn
              return label === selectedLabel
            }) as AreaCodeItem

            const label = lng === 'zh-TW' ? item?.nameCn : item?.nameEn
            return <span className="text-main">{item.areaCode}</span>
          }}
          showSearch
          label={label}
          {...pickerProps}
        />
      }
    />
  )
}
