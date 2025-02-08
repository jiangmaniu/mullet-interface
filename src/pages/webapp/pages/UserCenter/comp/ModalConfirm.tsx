import Modal from '@/components/Base/Modal'
import { APP_MODAL_WIDTH } from '@/constants'
import { View } from '@/pages/webapp/components/Base/View'

import { getIntl } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export const ModalConfirm = forwardRef(
  (
    {
      title,
      tips,
      open,
      width,
      action
    }: {
      width?: number
      title?: React.ReactNode
      tips?: React.ReactNode
      open?: boolean
      action?: { text?: string; onPress?: () => void }[]
    },
    ref: any
  ) => {
    const [isOpen, setIsOpen] = useState<any>(false)

    const confirmText = action?.[0]?.text || getIntl().formatMessage({ id: 'common.operate.Confirm' })
    const onConfirm =
      action?.[0]?.onPress ||
      (() => {
        setIsOpen(false)
      })
    const cancelText = action?.[1]?.text || getIntl().formatMessage({ id: 'common.operate.Cancel' })
    const onCancel =
      action?.[1]?.onPress ||
      (() => {
        setIsOpen(false)
      })

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => {
      return {
        show: () => {
          setIsOpen(true)
        },
        close: () => {
          setIsOpen(false)
        }
      }
    })

    useEffect(() => {
      setIsOpen(open)
    }, [open])

    return (
      <Modal
        open={isOpen}
        width={APP_MODAL_WIDTH}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        // title={title}
        styles={{ content: { padding: 0 }, header: { paddingInline: 20, paddingTop: 20 } }}
      >
        <div className="flex items-center justify-center px-2 py-4">
          <span className="text-primary text-base font-medium">{title}</span>
        </div>
        <div className="flex flex-row w-full border-t border-gray-180 ">
          <View onClick={onCancel} className="flex-1 border-r border-gray-180 text-center py-2">
            <span className="!text-brand text-xs">{cancelText}</span>
          </View>
          <View onClick={onConfirm} className="flex-1 text-center py-2">
            <span className="!text-brand text-xs">{confirmText}</span>
          </View>
        </div>
      </Modal>
    )
  }
)
