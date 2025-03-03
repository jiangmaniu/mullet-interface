import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import dayjs from 'dayjs'
import SheetModal, { ModalRef, SheetRef } from '../SheetModal'
import { View } from '../View'

import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import './index.less'

type IProps = {
  initialStartDate?: string
  initialEndDate?: string
  onConfirm: (selectedStartDate: Date, selectedEndDate: Date) => void
}

const DateRangePickerSheetModal = ({ initialStartDate, initialEndDate, onConfirm }: IProps, ref: React.ForwardedRef<ModalRef>) => {
  const { theme, cn } = useTheme()
  const { t } = useI18n()
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    initialStartDate ? dayjs(initialStartDate).toDate() : undefined
  )
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(initialEndDate ? dayjs(initialEndDate).toDate() : undefined)
  // Keep track of previous selection to handle reverse selection properly
  const previousSelectionRef = useRef<{ start?: Date; end?: Date }>({
    start: selectedStartDate,
    end: selectedEndDate
  })

  useImperativeHandle(ref, () => ({
    show: () => {
      if (!selectedStartDate) {
        setSelectedStartDate(initialStartDate ? dayjs(initialStartDate).toDate() : undefined)
      }
      if (!selectedEndDate) {
        setSelectedEndDate(initialEndDate ? dayjs(initialEndDate).toDate() : undefined)
      }
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

  const onChange = (dates: [Date | null, Date | null] | null) => {
    // Format and log selected dates
    const formattedDates = dates?.map((date) => (date ? dayjs(date).format('YYYY-MM-DD') : null)) || [null, null]
    console.log('Selected dates:', formattedDates)

    let [start, end] = dates || [null, null]

    // Handle the case when selecting a date earlier than the first selected date
    if (start && !end) {
      const prevStart = previousSelectionRef.current.start
      const prevEnd = previousSelectionRef.current.end

      // If we previously had a selection and now we're getting a single date
      if (prevStart && !prevEnd) {
        // We have a previous start date and now selected another date
        if (dayjs(start).isBefore(prevStart)) {
          // If new date is before previous start, use previous start as end
          end = prevStart
        } else {
          // If new date is after previous start, use previous start and make new date the end
          end = start
          start = prevStart
        }
      } else if (prevStart && prevEnd) {
        // If we had a complete range before, treat this as a new selection
        // No changes needed
      }
    }

    // Update our reference to the current selection
    previousSelectionRef.current = { start: start || undefined, end: end || undefined }

    // Ensure start date is always before end date
    if (start && end) {
      // If dates are selected in reverse order (end date before start date)
      if (dayjs(start).isAfter(dayjs(end))) {
        // Swap the dates to maintain correct order
        const temp = start
        start = end
        end = temp
      }
    }

    setSelectedStartDate(start || undefined)
    setSelectedEndDate(end || undefined)
  }

  // Define min date (3 months ago) and max date (today)
  const min = useMemo(() => dayjs().subtract(3, 'month').toDate(), [])
  const max = useMemo(() => dayjs().toDate(), [])

  const children = (
    <View style={cn('px-[14px] py-5 w-full flex-1')}>
      <DatePicker
        className="custom-datepicker"
        onChange={onChange}
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        minDate={min}
        maxDate={max}
        selectsRange
        inline
        monthsShown={1}
        showPopperArrow={false}
        calendarClassName="date-range-calendar"
        // @ts-ignore
        dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'weekend-day' : '')}
      />
    </View>
  )

  return (
    <SheetModal
      title={t('Position.Please Select Date')}
      ref={bottomSheetModalRef}
      dragOnContent={false}
      height={550}
      onConfirm={handleConfirm}
      confirmText={t('Position.Select Date')}
      children={children}
    />
  )
}

export default forwardRef(DateRangePickerSheetModal)
