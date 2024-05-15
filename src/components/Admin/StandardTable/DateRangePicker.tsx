import { ProFormDateRangePicker } from '@ant-design/pro-components'
import { getIntl } from '@umijs/max'
import { useState } from 'react'

import { get3MonBeforeRange } from '@/utils'

/**方便统一设置禁用日期范围，proTable不支持传入disabledDate */
export default function DateRangePicker() {
  const [dates, setDates] = useState<any>(null)
  const [value, setValue] = useState<any>(null)
  const intl = getIntl()

  const disabledDate = (current: any) => {
    if (!dates) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') >= 90
    const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 90
    return !!tooEarly || !!tooLate
  }

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null])
    } else {
      setDates(null)
    }
  }

  return (
    <ProFormDateRangePicker
      fieldProps={{
        allowClear: false,
        disabledDate,
        // @ts-ignore
        defaultValue: get3MonBeforeRange(),
        onCalendarChange: (val: any) => {
          setDates(val)
        },
        onChange: (val: any) => {
          setValue(val)
        },
        onOpenChange,
        changeOnBlur: true,
        placeholder: [intl.formatMessage({ id: 'common.startDate' }), intl.formatMessage({ id: 'common.endDate' })]
      }}
    />
  )
}
