import { CloseCircleFilled } from '@ant-design/icons'
import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { FormInstance } from 'antd'
import { DatePicker, DatePickerProps, Toast } from 'antd-mobile'
import { PickerDate } from 'antd-mobile/es/components/date-picker/util'
import lodash from 'lodash'
import moment from 'moment'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { DATE } from '@/constants/date'
import { colorTextPrimary } from '@/theme/theme.config'

interface IProps extends DatePickerProps {
  onChange?: ({ startDate, endDate }: { startDate: string; endDate: string }) => void
  style?: React.CSSProperties
  onClose?: () => void
  /**@name 允许清空 */
  allowClear?: boolean
  /**@name Form实例 */
  form?: FormInstance
  /**@name 表单的name字段 */
  name?: string[] | string
  disabled?: boolean
  /**@name 初始值 */
  initialValue?: any[]
  /**@name 默认展示内置时间 */
  showDefaultValue?: boolean
  /**是否限制时间选择 */
  showLimit?: boolean
}
// 默认展示最近三个月的时间
const initValue = { startDate: DATE.DATE_3_MONTHS_BEFORE, endDate: DATE.DATE_TODAY }
export default forwardRef(
  (
    {
      onChange,
      style,
      onClose,
      allowClear = false,
      name,
      form,
      disabled,
      initialValue,
      showDefaultValue = true,
      showLimit = true,
      ...res
    }: IProps,
    ref
  ) => {
    const intl = useIntl()
    const [dates, setDates] = useState(lodash.cloneDeep(showDefaultValue ? initValue : { startDate: '', endDate: '' }))
    const [visible, setVisible] = useState(false)
    const [selectedKey, setSelectedKey] = useState('')

    const reset = () => {
      setDates(initValue)
      onChange?.(initValue)

      if (name && name?.length > 0) {
        const [startName, endName] = name as string[]
        form?.resetFields([startName, endName])
      }
      // name是字符串情况
      if (name && typeof name === 'string') {
        form?.resetFields([name])
      }
    }

    // 对外暴露接口
    useImperativeHandle(ref, () => {
      return {
        reset
      }
    })

    const onSelect = (key: string) => {
      setSelectedKey(key)
      setVisible(true)
    }

    const handleDateChange = (val: PickerDate) => {
      const formattedDate = moment(val).format('YYYY-MM-DD')
      if (selectedKey === 'start') {
        if (dates.endDate && moment(dates.endDate).isBefore(val)) {
          return Toast.show(intl.formatMessage({ id: 'admin.timeTips1' }))
        }
        const diffDay = Math.abs(moment(val).diff(moment(dates.endDate), 'days'))

        if (diffDay > 90 && showLimit) {
          return Toast.show(intl.formatMessage({ id: 'admin.shijianbunengdayusangeyue' }))
        }

        setDates({ ...dates, startDate: formattedDate })
      } else if (selectedKey === 'end') {
        if (dates.startDate && moment(dates.startDate).isAfter(val)) {
          return Toast.show(intl.formatMessage({ id: 'admin.timeTips2' }))
        }

        const diffDay = Math.abs(moment(val).diff(moment(dates.startDate), 'days'))

        if (diffDay > 90 && showLimit) {
          return Toast.show(intl.formatMessage({ id: 'admin.shijianbunengdayusangeyue' }))
        }

        setDates({ ...dates, endDate: formattedDate })
      }

      setVisible(false)
    }

    useEffect(() => {
      if (dates.startDate && dates.endDate) {
        // name是数组情况
        if (name && name?.length > 0) {
          const [startName, endName] = name as string[]
          form?.setFieldsValue({ [startName]: dates.startDate, [endName]: dates.endDate })
        }
        // name是字符串情况
        if (name && typeof name === 'string') {
          form?.setFieldValue(name, dates)
        }

        onChange?.(dates)
      }
    }, [dates, name])

    useEffect(() => {
      if (initialValue?.length) {
        setDates({ startDate: initialValue[0], endDate: initialValue[1] })
      }
    }, [initialValue])

    return (
      <>
        <div
          className="flex justify-around items-center border border-[#d9d9d9] rounded-[6px] py-[4px] px-2 mb-3"
          style={{
            ...style,
            ...(disabled
              ? {
                  background: '#FAFBFC',
                  cursor: 'not-allowed',
                  pointerEvents: 'none'
                }
              : {})
          }}
        >
          <span
            className="text-main/30 text-sm cursor-pointer w-[48%] text-center"
            style={!disabled ? { color: dates.startDate ? colorTextPrimary : '' } : { color: 'rgba(0, 0, 0, 0.25)' }}
            onClick={() => {
              onSelect('start')
            }}
          >
            {dates.startDate || <FormattedMessage id="common.startDate" />}
          </span>
          <span className="text-main/30 text-sm w-[80px] text-center">
            <FormattedMessage id="common.zhi" />
          </span>
          <span
            className="text-main/30 text-sm cursor-pointer w-[48%] text-center"
            onClick={() => {
              onSelect('end')
            }}
            style={!disabled ? { color: dates.endDate ? colorTextPrimary : '' } : { color: 'rgba(0, 0, 0, 0.25)' }}
          >
            {dates.endDate || <FormattedMessage id="common.endDate" />}
          </span>
          {(dates.startDate || dates.endDate) && allowClear && !disabled && (
            <CloseCircleFilled className="cursor-pointer w-[16px] h-[16px] text-main/30" onClick={reset} />
          )}
        </div>
        <DatePicker
          visible={visible}
          onClose={() => {
            onClose?.()
            setVisible(false)
          }}
          max={new Date()}
          // @ts-ignore
          onConfirm={handleDateChange}
          {...res}
        />
        {/* 隐藏表单项，赋值，方便表单提交 */}
        {name && name?.length > 0 && (
          <>
            <ProFormText hidden name={name[0]} />
            <ProFormText hidden name={name[1]} />
          </>
        )}
        {name && typeof name === 'string' && (
          <>
            <ProFormText hidden name={name} />
          </>
        )}
      </>
    )
  }
)
