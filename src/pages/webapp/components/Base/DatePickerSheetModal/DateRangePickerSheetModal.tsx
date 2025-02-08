import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { CalendarPickerView } from 'antd-mobile'
import SheetModal, { ModalRef, SheetRef } from '../SheetModal'
import { View } from '../View'

type IProps = {
  initialStartDate?: string
  initialEndDate?: string
  onConfirm: (selectedStartDate: Date, selectedEndDate: Date) => void
}

const DateRangePickerSheetModal = ({ initialStartDate, initialEndDate, onConfirm }: IProps, ref: React.ForwardedRef<ModalRef>) => {
  const { theme, cn } = useTheme()
  const { t } = useI18n()
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined)
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true)
  const [markedDates, setMarkedDates] = useState({})

  useImperativeHandle(ref, () => ({
    show: () => {
      // setIsSelectingStartDate(true)
      // const startDate = initialStartDate ?? dayjs().format('YYYY-MM-DD')
      // const endDate = initialEndDate ?? dayjs().format('YYYY-MM-DD')
      // setSelectedStartDate(startDate)
      // setSelectedEndDate(endDate)
      // const newPeriod = getPeriod(startDate, endDate)
      // setMarkedDates(newPeriod)
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const handleConfirm = async () => {
    if (selectedStartDate && selectedEndDate) {
      await onConfirm(selectedStartDate, selectedEndDate)
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }

  const onChange = (val: [Date, Date] | null) => {
    setSelectedStartDate(val?.[0])
    setSelectedEndDate(val?.[1])
  }

  const children = (
    <View style={cn('px-[14px] py-5 w-full flex-1 ')}>
      {/* <Calendar markingType="period" markedDates={markedDates} onDayPress={handleDayPress} /> */}
      {/* <CalendarPicker
          visible={visible2}
          defaultValue={defaultRange}
          selectionMode='range'
          onClose={() => setVisible2(false)}
          onMaskClick={() => setVisible2(false)}
          onChange={val => {
            console.log(val)
          }}
        /> */}

      <CalendarPickerView title="" selectionMode="range" onChange={onChange} />
    </View>
  )

  return (
    <SheetModal
      title={t('Position.Please Select Date')}
      ref={bottomSheetModalRef}
      height={600}
      onConfirm={handleConfirm}
      confirmText={t('Position.Select Date')}
      children={children}
    />
  )
}

export default forwardRef(DateRangePickerSheetModal)
