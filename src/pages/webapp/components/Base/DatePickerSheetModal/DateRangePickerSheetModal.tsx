import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import dayjs from 'dayjs'
import SheetModal, { ModalRef, SheetRef } from '../SheetModal'
import { Text } from '../Text'
import { View } from '../View'

import DatePicker from 'react-datepicker'

import { Radio } from 'antd'
import 'react-datepicker/dist/react-datepicker.css'
import { DateField } from './DateField'
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
    if (disabled) return

    // Format and log selected dates
    const formattedDates = dates?.map((date) => (date ? dayjs(date).format('YYYY-MM-DD') : null)) || [null, null]

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
  // const min = useMemo(() => dayjs().subtract(3, 'month').toDate(), [])
  // const max = useMemo(() => dayjs().toDate(), [])

  const [timeRange, setTimeRange] = useState('1')
  const disabled = useMemo(() => timeRange !== '1', [timeRange])

  const minMinDate = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
  const maxDate = dayjs().format('YYYY-MM-DD')
  const [minDate, setMinDate] = useState<string | null>(null)
  const minDateDate = useMemo(() => (minDate ? dayjs(minDate).toDate() : undefined), [minDate])
  const maxDateDate = useMemo(() => (maxDate ? dayjs(maxDate).toDate() : undefined), [maxDate])

  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const handleStartDateChange = (date: string) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: string) => {
    setEndDate(date)
  }

  /************* useEffect start *************/
  const handleStartDateEndEditing = (text: string) => {
    if (text) {
      setStartDate(text)
      setSelectedStartDate(dayjs(text).toDate())
    }
  }

  const handleEndDateEndEditing = (text: string) => {
    if (text) {
      setEndDate(text)
      setSelectedEndDate(dayjs(text).toDate())
    }
  }

  useEffect(() => {
    // 对 value = 1 特殊处理
    if (timeRange === '1') {
      const dayAMonthBefore = dayjs().subtract(1, 'month')
      setMinDate(minMinDate)
      setSelectedStartDate(dayAMonthBefore.toDate())
    } else {
      // 计算最小值并选中
      const minDate = dayjs().subtract(Number(timeRange), 'month')
      setMinDate(minDate.format('YYYY-MM-DD'))
      setSelectedStartDate(minDate.toDate())
    }
    setSelectedEndDate(dayjs(maxDate).toDate())
  }, [timeRange])

  useEffect(() => {
    if (selectedEndDate) {
      const endDate = dayjs(selectedEndDate).format('YYYY-MM-DD')
      if (endDate !== startDate) {
        setEndDate(endDate)
      }
    }
  }, [selectedEndDate])

  useEffect(() => {
    if (selectedStartDate) {
      const startDate = dayjs(selectedStartDate).format('YYYY-MM-DD')
      if (startDate !== endDate) {
        setStartDate(startDate)
      }
    }
  }, [selectedStartDate])

  /************* useEffect end *************/

  const children = (
    <View style={cn('px-[14px] py-5 w-full flex-1 flex flex-col')}>
      <Radio.Group
        onChange={(e) => {
          setTimeRange(e.target.value as string)
          setSelectedEndDate(dayjs().toDate())
        }}
        value={timeRange}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          // width: 280,
          gap: 4
        }}
      >
        <Radio value="1">
          <Text style={cn('text-sm text-primary')}>{t('mt.zidingyi')}</Text>
        </Radio>
        <Radio value="3">
          <Text style={cn('text-sm text-primary')}>{t('mt.sangeyue')}</Text>
        </Radio>
        <Radio value="6">
          <Text style={cn('text-sm text-primary')}>{t('mt.liugeyue')}</Text>
        </Radio>
      </Radio.Group>

      <View style={cn('flex flex-row items-center justify-between mt-[18px]')}>
        <Text color="weak" size="sm" style={cn('mb-1')}>
          {t('mt.shijian')}
        </Text>
      </View>

      <View style={cn(' flex flex-row items-center w-full gap-4')}>
        <View style={cn('w-[150px]')}>
          <DateField
            value={startDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleStartDateChange}
            onEndEditing={handleStartDateEndEditing}
            height={36}
            disabled={disabled}
          />
        </View>
        <Text style={cn('text-sm text-weak')}>{t('Common.To')}</Text>
        <View style={cn('w-[150px]')}>
          <DateField
            value={endDate}
            minDate={startDate}
            maxDate={maxDate}
            onChange={handleEndDateChange}
            onEndEditing={handleEndDateEndEditing}
            height={36}
            disabled={disabled}
          />
        </View>
      </View>

      <View style={cn('flex flex-row items-center justify-between mt-[18px]')}>
        <Text color="weak" size="sm" style={cn('mb-1')}>
          {t('mt.jinzhichixuanzejinliugeyue')}
        </Text>
      </View>
      <DatePicker
        className="custom-datepicker"
        onChange={onChange}
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        minDate={minDateDate}
        maxDate={maxDateDate}
        selectsRange
        inline
        readOnly={disabled}
        disabled={disabled}
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
      height={640}
      onConfirm={handleConfirm}
      confirmText={t('Position.Select Date')}
      children={children}
    />
  )
}

export default forwardRef(DateRangePickerSheetModal)
