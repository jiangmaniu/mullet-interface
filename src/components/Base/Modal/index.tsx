import { Modal as AntdModal, ModalProps } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

type IProps = {
  children?: React.ReactNode
  open?: boolean
  onClose?: () => void
  trigger?: JSX.Element
} & ModalProps

export default forwardRef(({ children, open, onClose, trigger, ...res }: IProps, ref) => {
  const [isOpen, setIsOpen] = useState<any>(false)

  const close = () => {
    setIsOpen(false)
    onClose?.()
  }
  const show = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  // useEffect(() => {
  //   if (isOpen) {
  //     document.documentElement.style.overflowY = 'hidden'
  //   } else {
  //     document.documentElement.style.overflowY = 'auto'
  //   }
  // }, [isOpen])

  // 对外暴露接口
  useImperativeHandle(ref, () => {
    return {
      close,
      show,
      open: isOpen
    }
  })

  const triggerDom = useMemo(() => {
    if (!trigger) {
      return null
    }

    return React.cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        setIsOpen(!isOpen)
        trigger.props?.onClick?.(e)
      }
    })
  }, [setIsOpen, trigger, isOpen])

  return (
    <>
      <AntdModal destroyOnClose open={isOpen} onCancel={close} {...res}>
        {children}
      </AntdModal>
      {triggerDom}
    </>
  )
})
