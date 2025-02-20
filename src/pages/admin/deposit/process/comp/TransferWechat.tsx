import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'

import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

import { PAYMENT_ORDER_TIMEOUT } from '@/constants'
import { getEnv } from '@/env'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

type IProps = {
  form: FormInstance
  handleTimeout: () => void
}

function TransferWechat({ form, handleTimeout }: IProps, ref: any) {
  const intl = useIntl()

  const qrcode = Form.useWatch('qrCode', form) ?? ''
  const createTime = Form.useWatch('createTime', form) ?? ''

  const createDate = useMemo(() => {
    try {
      return dayjs(createTime)
    } catch (error) {
      return dayjs()
    }
  }, [createTime])

  // const [time, setTime] = useState(0)

  const downloadQRCode = () => {
    window.open(`${getEnv().imgDomain}${qrcode}`, '_blank')
  }

  useImperativeHandle(ref, () => {
    return {
      download: downloadQRCode
    }
  })

  const [duration, setDuration] = useState(-1)
  const getDuration = () => {
    return PAYMENT_ORDER_TIMEOUT - dayjs().diff(createDate)
  }

  const timer = useRef<NodeJS.Timeout | null>(null)
  const setTimer = () => {
    timer.current = setInterval(() => {
      const duration = getDuration()
      setDuration(duration)
      if (duration <= 0) {
        handleTimeout()
        setDuration(-1)
        clearInterval(timer.current as NodeJS.Timeout)
        timer.current = null
      }
    }, 1000)
  }

  useEffect(() => {
    if (qrcode) {
      // setTime(60 * 30)
      // setTime(5) // 测试
      setTimer()
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current as NodeJS.Timeout)
        timer.current = null
      }
    }
  }, [qrcode])

  return (
    <div>
      <div className="flex flex-row items-end gap-8 font-normal ">
        {/* <canvas id="canvas" className="w-[135px] h-[135px] bg-gray-150 rounded-lg flex items-center justify-center flex-shrink-0"></canvas> */}
        <div>
          <div className="text-sm text-primary font-medium my-[22px]">
            <FormattedMessage id="mt.fukuanxinxi" />
          </div>
          <div className="text-sm text-primary font-medium mb-3">
            <FormattedMessage id="mt.shoukuanerweima" />
          </div>
          <div className={cn('opacity-10 cursor-not-allowed', qrcode && 'opacity-100 cursor-pointer')}>
            {/* <div ref={qrRef}> */}
            <div className="w-[135px] h-[135px]">
              <img src={`${getEnv().imgDomain}${qrcode}`} alt="qrcode" style={{ width: '100%', height: '100%' }} />
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between h-full flex-1 gap-4 min-h-[132px]">
          <div>
            <img src="/img/saomiao.svg" width={20} height={20} />
            <div className="text-xs text-secondary font-normal mt-4">
              <FormattedMessage id="mt.qingzhuanzhangzhixiafangqukuailiandizhi" />
            </div>
          </div>
          <div className={cn('text-2xl text-primary font-semibold hidden', qrcode && 'block')}>
            <FormattedMessage id="mt.qingzaishijianzhineiwanchengzhuanzhang" values={{ value: dayjs.duration(duration).format('mm:ss') }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(TransferWechat)
