import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { QRCodeCanvas } from 'qrcode.react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Button from '@/components/Base/Button'
import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

import { PAYMENT_ORDER_TIMEOUT } from '@/constants'
import { copyToClipboard } from '@/utils'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

type IProps = {
  form: FormInstance
  handleTimeout: () => void
}

function TransferCrypto({ form, handleTimeout }: IProps, ref: any) {
  const intl = useIntl()

  const address = Form.useWatch('address', form) ?? ''
  const createTime = Form.useWatch('createTime', form) ?? ''
  const canncelOrderTime = Form.useWatch('canncelOrderTime', form) ?? ''

  const createDate = useMemo(() => {
    try {
      return dayjs(createTime)
    } catch (error) {
      return dayjs()
    }
  }, [createTime])

  // const [time, setTime] = useState(0)

  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png') // 生成 Base64 图片
      const a = document.createElement('a')
      a.href = url
      a.download = 'qrcode.png' // 设置下载文件名
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  useImperativeHandle(ref, () => {
    return {
      download: downloadQRCode
    }
  })

  const [duration, setDuration] = useState(-1)

  const getDuration = useCallback(() => {
    if (!canncelOrderTime || !Number.isFinite(Number(canncelOrderTime))) return PAYMENT_ORDER_TIMEOUT - dayjs().diff(createDate)
    return Number(canncelOrderTime) * 60 * 1000 - dayjs().diff(createDate)
  }, [createDate, canncelOrderTime])

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
    if (address) {
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
  }, [address])

  return (
    <div>
      <div className="flex flex-row items-end gap-8">
        {/* <canvas id="canvas" className="w-[135px] h-[135px] bg-gray-150 rounded-lg flex items-center justify-center flex-shrink-0"></canvas> */}
        <div>
          <div className="text-sm text-primary font-medium mb-3">
            <FormattedMessage id="mt.chongbidizhierweima" />
          </div>
          <div className={cn('opacity-10 cursor-not-allowed', address && 'opacity-100 cursor-pointer')}>
            <div ref={qrRef}>
              <QRCodeCanvas
                value={address}
                size={180}
                fgColor="#000000"
                bgColor="#ffffff"
                level="H"
                imageSettings={{
                  src: '/img/saomiao.svg',
                  height: 30,
                  width: 30,
                  excavate: true,
                  x: undefined,
                  y: undefined
                }}
                style={{
                  margin: '10px auto',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between h-full flex-1 gap-4 min-h-[132px]">
          <div>
            <img src="/img/saomiao.svg" width={20} height={20} />
            <div className="text-xs text-secondary font-normal mt-4">
              <FormattedMessage id="mt.rujinzhuanzhanghoutishi" />
            </div>
          </div>
          <div className={cn('text-2xl text-primary font-semibold hidden', address && 'block')}>
            <FormattedMessage id="mt.qingzaishijianzhineiwanchengzhuanzhang" values={{ value: dayjs.duration(duration).format('mm:ss') }} />
          </div>
        </div>
      </div>
      <div className="text-sm text-primary font-medium mt-9 mb-3">
        <FormattedMessage id="mt.chongbidizhi" />
      </div>
      <div className=" h-[38px] bg-gray-50 py-1 px-[7px] rounded-[9px] flex-shrink flex flex-row items-center gap-2">
        <div className="flex-1">
          <ProFormText
            name="address"
            disabled
            placeholder="--"
            fieldProps={{
              size: 'small',
              style: {
                border: 'none',
                height: '28px'
              }
            }}
          />
        </div>
        {address && (
          <Button
            type="default"
            size="small"
            style={{ height: '28px' }}
            onClick={() => {
              copyToClipboard(address || '')
            }}
          >
            <FormattedMessage id="mt.fuzhi" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default forwardRef(TransferCrypto)
