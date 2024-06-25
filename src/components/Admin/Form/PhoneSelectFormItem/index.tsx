import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { Form, FormInstance, Input } from 'antd'
import { useEffect } from 'react'

import AreaCodeSelect from '@/components/Form/AreaCodeSelect'
import { regMobile } from '@/utils'

type IProps = {
  names: string[]
  form: FormInstance
  label?: React.ReactNode
  required?: boolean
}

export default function PhoneSelectFormItem({ form, label, required, names = [] }: IProps) {
  const intl = useIntl()

  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-input-wrapper': {
        height: 49,
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        '&:hover': {
          borderColor: '#9C9C9C'
        },
        '.ant-input': {
          height: 49,
          border: 'none !important',
          '&:focus-within': {
            boxShadow: 'none !important'
          }
        }
      },
      '.ant-input-group .ant-input-group-addon': {
        backgroundColor: '#fff !important',
        border: 'none !important'
      }
    }
  })

  useEffect(() => {
    // 默认显示香港区号
    form.setFieldValue(names[1], '+852')
  }, [])

  return (
    <Form.Item
      name={names[0]}
      rootClassName={className}
      required={required}
      rules={
        required
          ? [
              {
                required: true,
                validateTrigger: 'onBlur',
                validator(rule, value, callback) {
                  if (!value) {
                    callback(intl.formatMessage({ id: 'mt.shurushoujihaoma' }))
                  } else if (!regMobile.test(value)) {
                    callback(intl.formatMessage({ id: 'mt.shoujihaobuzhengque' }))
                  } else if (!form.getFieldValue('areaCode')) {
                    callback(intl.formatMessage({ id: 'mt.xuanzequhao' }))
                  } else {
                    callback()
                  }
                }
              }
            ]
          : []
      }
      className="phoneSelect"
      label={label}
    >
      <Input
        size="large"
        addonBefore={
          <AreaCodeSelect
            name={names[1]}
            form={form}
            // valueKey="areaCode"
            onChange={(value, option = {}) => {
              // 重新验证input表单错误提示
              form.validateFields([names[0]])
            }}
            selectProps={{
              fieldProps: {
                allowClear: false,
                bordered: false,
                style: { height: 30, width: 'auto', textAlign: 'left', paddingRight: 10, backgroundColor: '#fff', borderRadius: 12 },
                dropdownStyle: { width: 410 }
              },
              showSearch: true,
              filedConfig: { style: { marginBottom: 0 }, noStyle: true }
            }}
            pickerProps={{
              wrapperStyle: { padding: 0, margin: 0, border: 'none', width: 80 }
            }}
          />
        }
        placeholder={intl.formatMessage({ id: 'mt.shurudianhua' })}
        style={{ width: '100%' }}
        autoComplete="off"
      />
    </Form.Item>
  )
}
