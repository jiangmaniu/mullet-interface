import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { Form, FormInstance, Input } from 'antd'

import AreaCodeSelect from '@/components/Form/AreaCodeSelect'
import { regMobile } from '@/utils'

type IProps = {
  name: string[]
  form: FormInstance
}

export default function PhoneSelectFormItem({ form, name = [] }: IProps) {
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

  return (
    <Form.Item
      name={name[0]}
      rootClassName={className}
      rules={[
        {
          required: true,
          validateTrigger: 'onBlur',
          validator(rule, value, callback) {
            if (!value) {
              callback(intl.formatMessage({ id: 'mt.shurudianhua' }))
            } else if (!regMobile.test(value)) {
              callback(intl.formatMessage({ id: 'mt.shoujihaobuzhengque' }))
            } else if (!form.getFieldValue('areaCode')) {
              callback(intl.formatMessage({ id: 'mt.xuanzequhao' }))
            } else {
              callback()
            }
          }
        }
      ]}
      className="phoneSelect"
    >
      <Input
        size="large"
        addonBefore={
          <AreaCodeSelect
            name={name[1]}
            form={form}
            valueKey="areaCode"
            onChange={(value, option = {}) => {
              form.setFieldsValue({ countryName: option.label, country: option.areaId })
            }}
            selectProps={{
              fieldProps: {
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
