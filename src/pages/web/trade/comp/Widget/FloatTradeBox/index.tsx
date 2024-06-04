import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { InputNumber } from 'antd'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useEnv } from '@/context/envProvider'
import { goLogin } from '@/utils/navigator'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

export default function FloatTradeBox() {
  const { isMobileOrIpad } = useEnv()
  const [open, setOpen] = useState(true)
  const [inputValue, setInputValue] = useState<any>('0.01')
  const [widgetRight, setWidgetRight] = useState(400)
  const [widgetTop, setWidgetTop] = useState(260)
  const startPosition = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const token = STORAGE_GET_TOKEN()

  const startDrag = (event: any) => {
    event.preventDefault()
    isDragging.current = true
    startPosition.current = {
      x: event.clientX || event.touches[0].clientX,
      y: event.clientY || event.touches[0].clientY
    }
    document.addEventListener('mousemove', drag)
    document.addEventListener('touchmove', drag)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchend', stopDrag)
  }

  const drag = (event: any) => {
    if (!isDragging.current) return
    const currentPosition = {
      x: event.clientX || event.touches[0].clientX,
      y: event.clientY || event.touches[0].clientY
    }
    const deltaX = currentPosition.x - startPosition.current.x
    const deltaY = currentPosition.y - startPosition.current.y
    setWidgetRight((prev) => prev - deltaX)
    setWidgetTop((prev) => prev + deltaY)
    startPosition.current = currentPosition
  }

  const stopDrag = () => {
    isDragging.current = false
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('touchmove', drag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchend', stopDrag)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('touchmove', drag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchend', stopDrag)
    }
  }, [])

  // @ts-ignore
  const className = useEmotionCss(({ token }) => {
    return {
      position: 'fixed',
      transform: 'translateY(-45%)',
      zIndex: 9999,
      input: {
        border: 'none !important',
        boxShadow: 'none !important',
        textAlign: 'center !important',
        padding: '0 !important'
      },
      '.ant-input-number': {
        border: 'none !important',
        boxShadow: 'none !important'
      }
    }
  })

  if (!open || isMobileOrIpad) return

  return (
    <div
      className={classNames('border border-gray-185 rounded-lg bg-white fixed', className)}
      style={{
        right: widgetRight,
        top: widgetTop
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-185">
          <div className="px-[2px] py-3 cursor-move" onMouseDown={startDrag} onTouchStart={startDrag}>
            <div className="bg-[url(/img/handle-drop.png)] bg-[size:14px_28px] bg-no-repeat w-[14px] h-[28px]"></div>
          </div>
          <div
            className="bg-red flex flex-col h-[56px] px-3 items-center justify-center cursor-pointer"
            onClick={() => {
              if (!token) {
                return goLogin()
              }
            }}
          >
            <div className="select-none text-white text-xs">
              <FormattedMessage id="mt.maichuzuokong" />
            </div>
            <div className="text-white font-dingpro-medium text-base select-none">46,604.1</div>
          </div>
          <div className="flex flex-col h-[56px] px-3 items-center justify-center w-[105px]">
            <div className="text-gray text-xs select-none">
              <FormattedMessage id="mt.shoushu" />
            </div>
            <InputNumber
              min={'0.01'}
              controls={false}
              max={'10000'}
              value={inputValue}
              onChange={(val) => {
                setInputValue(val)
              }}
            />
          </div>
          <div
            className="bg-green h-[56px] px-3 flex flex-col  items-center justify-center cursor-pointer"
            onClick={() => {
              if (!token) {
                return goLogin()
              }
            }}
          >
            <div className="select-none text-white text-xs">
              <FormattedMessage id="mt.mairuzuoduo" />
            </div>
            <div className="text-white font-dingpro-medium text-base select-none">28,604.1</div>
          </div>
          <div className="px-[2px] cursor-pointer" onClick={() => setOpen(false)}>
            <img width="14" height="28" src="/img/close.png" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-[6px] py-1 mt-[2px]">
          {['0.01', '0.1', '0.5', '1.0'].map((item, idx) => {
            return (
              <span
                key={idx}
                className="text-gray text-xs px-[6px] py-[1px] bg-gray-50 rounded cursor-pointer"
                onClick={() => {
                  setInputValue(item)
                }}
              >
                {item}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
