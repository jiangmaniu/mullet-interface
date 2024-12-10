import 'react-spring-bottom-sheet/dist/style.css'

import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { ButtonProps } from 'antd'
import type { ForwardedRef } from 'react'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { ViewStyle } from 'react-native'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import { Props } from 'react-spring-bottom-sheet/dist/types'

import Button from '@/components/Base/Button'
import { cn } from '@/utils/cn'

export type ModalRef = {
  show: () => void
  close: () => void
}

export interface SheetRef {
  sheet: {
    present: (afterOpen?: () => void) => void
    dismiss: (beforeClose?: () => void) => void
  }
  visible: boolean
}

type IProps = Partial<Props> & {
  children?: React.ReactNode
  /** 底部footer */
  footer?: React.ReactNode
  /** 确认按钮文字 */
  confirmText?: React.ReactNode
  /** 取消按钮文字 */
  cancelText?: React.ReactNode
  /** 确认按钮类型 */
  confirmButtonType?: ButtonProps['type']
  /** 取消按钮类型 */
  cancelButtonType?: ButtonProps['type']
  /** 底部区域样式 */
  footerStyle?: React.CSSProperties
  /** 单个按钮 */
  buttonBlock?: boolean
  /** 确认事件 */
  onConfirm?: () => Promise<any>
  /** 取消事件 */
  onCancel?: () => void
  /** 弹窗高度 */
  height?: number
  /** 隐藏footer按钮 */
  hiddenFooter?: boolean
  /** 控制打开弹窗的按钮 优先使用trigger方式打开弹窗，避免多写一些状态控制 */
  trigger?: JSX.Element
  /** 弹窗标题 */
  title?: React.ReactNode
  /** 禁用确认按钮 */
  disabled?: boolean
  /** 监听弹窗打开关闭状态 */
  onOpenChange?: (open: boolean) => void
  onDismiss?: () => void
  /** 背景颜色 */
  backgroundStyle?: ViewStyle
  draggable?: boolean
  /** 是否开启内容拖拽 */
  dragOnContent?: boolean
  confirmButtonProps?: ButtonProps
}

const SheetModal = (
  {
    buttonBlock = true,
    footerStyle,
    confirmButtonType,
    cancelButtonType,
    confirmText,
    cancelText,
    children,
    footer,
    onConfirm,
    onCancel,
    height,
    hiddenFooter,
    trigger,
    title,
    disabled,
    onOpenChange,
    onDismiss,
    backgroundStyle,
    draggable = true,
    dragOnContent = true,
    confirmButtonProps,
    ...res
  }: IProps,
  ref: ForwardedRef<SheetRef>
) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const intl = useIntl()

  const sheetRef = useRef<BottomSheetRef>(null)

  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    onOpenChange?.(visible)
  }, [visible])

  const show = (afterOpen?: () => void) => {
    setVisible(true)

    afterOpen?.()
  }
  const close = (beforeClose?: () => void) => {
    beforeClose?.()
    onDismiss?.()
    setVisible(false)
  }

  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({
    sheet: {
      present: show,
      dismiss: close
    },
    visible
  }))

  const triggerDom = useMemo(() => {
    if (!trigger) {
      return null
    }

    return cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        trigger.props?.onClick?.(e)
        show()
      }
    })
  }, [trigger])

  const handleConfirm = async () => {
    try {
      setSubmitLoading(true)
      await onConfirm?.()
      close()
    } catch (e) {
      console.log('handleConfirm error', e)
    } finally {
      setSubmitLoading(false)
    }
  }

  const renderFooter = () => {
    return (
      <>
        {!hiddenFooter && (
          <>
            <div
              className={cn(
                {
                  backgroundColor: '#fff'
                },
                footerStyle
              )}
            >
              {footer ? (
                footer
              ) : (
                <>
                  {buttonBlock && (
                    <Button
                      size="large"
                      disabled={disabled}
                      loading={submitLoading}
                      onClick={handleConfirm}
                      type={confirmButtonType || 'primary'}
                      block
                      {...confirmButtonProps}
                    >
                      {confirmText || intl.formatMessage({ id: 'common.operate.Confirm' })}
                    </Button>
                  )}
                  {!buttonBlock && (
                    <div className={cn('items-center gap-x-3 flex-1 flex flex-row justify-between')}>
                      <Button
                        size="large"
                        onClick={() => {
                          onCancel?.()
                          handleClose()
                        }}
                        type={cancelButtonType || 'default'}
                        className="flex-1"
                      >
                        {cancelText || intl.formatMessage({ id: 'common.operate.Cancel' })}
                      </Button>
                      <Button
                        size="large"
                        loading={submitLoading}
                        onClick={handleConfirm}
                        type={confirmButtonType || 'primary'}
                        disabled={disabled}
                        className="flex-1"
                        {...confirmButtonProps}
                      >
                        {confirmText || intl.formatMessage({ id: 'common.operate.Confirm' })}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </>
    )
  }

  const className = useEmotionCss((token) => {
    return {
      'div[data-rsbs-header]': {
        boxShadow: 'none !important'
      },
      'div[data-rsbs-footer]': {
        boxShadow: 'none !important'
      },
      'div[data-rsbs-header]:before': {
        width: '57px !important'
      },
      'div[data-rsbs-overlay]': {
        borderTopLeftRadius: '20px !important',
        borderTopRightRadius: '20px !important'
      }
    }
  })

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        onDismiss={() => {
          onDismiss?.()
          close()
        }}
        // @ts-ignore
        open={visible}
        // @ts-ignore
        snapPoints={({ minHeight, headerHeight, footerHeight, maxHeight }) => (height ? [height] : [maxHeight / 4, maxHeight * 0.9])}
        defaultSnap={({ lastSnap, snapPoints }) => lastSnap ?? Math.max(...snapPoints)}
        footer={renderFooter()}
        header={<>{title && <div className={cn('leading-7 text-center')}>{title}</div>}</>}
        scrollLocking
        expandOnContentDrag={dragOnContent}
        className={className}
        {...res}
      >
        <div className="mx-3">{children}</div>
      </BottomSheet>
      {triggerDom}
    </>
  )
}

export default forwardRef(SheetModal)
