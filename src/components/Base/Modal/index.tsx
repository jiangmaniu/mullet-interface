import { Modal as AntdModal, ModalProps } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

type IProps = {
  children?: React.ReactNode
  open?: boolean
  onClose?: () => void
  trigger?: JSX.Element
  /** 当modal打开状态发生变化时触发 */
  onOpenChange?: (open: boolean) => void
} & ModalProps

export default forwardRef(({ children, open, onClose, trigger, onOpenChange, ...res }: IProps, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const close = () => {
    setIsOpen(false)
    onClose?.()
  }
  const show = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    setIsOpen(!!open)
    onOpenChange?.(!!open)
  }, [open])

  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = 'hidden'
  //   } else {
  //     document.body.style.overflow = 'auto'
  //   }

  //   return () => {
  //     document.body.style.overflow = 'auto'
  //   }
  // }, [isOpen])

  // 对外暴露接口
  useImperativeHandle(ref, () => ({
    close,
    show,
    open: isOpen
  }))

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
      {isOpen && (
        <AntdModal destroyOnClose open={isOpen} onCancel={close} onClose={close} wrapClassName="custom-modal" maskClosable={false} {...res}>
          {children}
        </AntdModal>
      )}
      {triggerDom}
    </>
  )
})
