import 'react-spring-bottom-sheet/dist/style.css'

import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import type { ForwardedRef } from 'react'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import { Props } from 'react-spring-bottom-sheet/dist/types'

import { cn } from '@/utils/cn'

import { stores } from '@/context/mobxProvider'
import Button, { ButtonProps, ButtonType } from '../Button'
import ActivityIndicator from '../Loading/ActivityIndicator'

export type ModalRef = {
  show: () => void
  close: () => void
}

export interface SheetRef {
  sheet: {
    present: (afterOpen?: () => void) => void
    dismiss: (beforeClose?: () => void) => void
  }
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
  confirmButtonType?: ButtonType['type']
  /** 取消按钮类型 */
  cancelButtonType?: ButtonType['type']
  /** 底部区域样式 */
  footerStyle?: React.CSSProperties
  /** 单个按钮 */
  buttonBlock?: boolean
  /** 确认事件 */
  onConfirm?: () => Promise<any>
  /** 取消事件 */
  onCancel?: () => void
  /** 弹窗最大高度 百分比或者指定数值 */
  height?: number | string
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
  backgroundStyle?: React.CSSProperties
  draggable?: boolean
  /** 是否开启内容拖拽 */
  dragOnContent?: boolean
  confirmButtonProps?: ButtonProps
  /**隐藏内容器滚动条 */
  hiddenContentScroll?: boolean
  /**控制弹窗是否打开 */
  open?: boolean
  /** 确认后是否关闭弹窗 */
  closeOnConfirm?: boolean
  /**是否展示首次loading */
  showLoading?: boolean
  /**跟随内容自适应高度和height互斥 */
  autoHeight?: boolean

  emotionClassName?: any
  /**自定义头部 */
  header?: React.ReactNode
  /**头部样式 */
  headerStyle?: React.CSSProperties
}

const TransparentBackdrop = ({ onClick }: { onClick: () => void }) => (
  <div
    className="bottom-sheet-backdrop"
    onClick={onClick}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 3
    }}
  >
    {/* 占位 */}
  </div>
)

const SheetModal = (props: IProps, ref: ForwardedRef<SheetRef>) => {
  let {
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
    autoHeight,
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
    hiddenContentScroll,
    open,
    closeOnConfirm = true,
    showLoading = false,
    emotionClassName: _className = {},
    headerStyle,
    header,
    ...res
  } = props
  const [submitLoading, setSubmitLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const intl = useIntl()
  const [loading, setLoading] = useState(true)

  const sheetRef = useRef<BottomSheetRef>(null)

  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    onOpenChange?.(visible)
    stores.global.setSheetModalOpen(visible)
  }, [visible])

  useEffect(() => {
    setVisible(!!open)
  }, [open])

  useEffect(() => {
    if (showLoading) {
      if (visible) {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } else {
        setLoading(true)
      }
    } else {
      setLoading(false)
    }
  }, [visible, showLoading])

  const show = (afterOpen?: () => void) => {
    console.log('showshowshow')
    setVisible(true)

    afterOpen?.()
  }
  const close = (beforeClose?: () => void) => {
    console.log('closeclosecloseclose')
    beforeClose?.()
    onDismiss?.()
    setLoading(false)

    setTimeout(() => {
      setVisible(false)
    }, 100)
  }

  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({
    sheet: {
      present: show,
      dismiss: close
    }
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
      if (closeOnConfirm) {
        close()
      }
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
            <div style={footerStyle}>
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
                        containerClassName={cn('flex-1')}
                      >
                        {cancelText || intl.formatMessage({ id: 'common.operate.Cancel' })}
                      </Button>
                      <Button
                        size="large"
                        loading={submitLoading}
                        onClick={handleConfirm}
                        type={confirmButtonType || 'primary'}
                        containerClassName={cn('flex-1')}
                        disabled={disabled}
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

  // @ts-ignore
  const className = useEmotionCss((token) => {
    return {
      'div[data-rsbs-header]': {
        boxShadow: 'none !important',
        paddingInline: '0 !important',
        ...headerStyle
      },
      'div[data-rsbs-footer]': {
        boxShadow: 'none !important',
        display: hiddenFooter ? 'none' : 'block'
      },
      'div[data-rsbs-header]:before': {
        width: '57px !important'
      },
      'div[data-rsbs-overlay]': {
        borderTopLeftRadius: '20px !important',
        borderTopRightRadius: '20px !important'
      },
      'div[aria-modal]': backgroundStyle,
      'div[data-rsbs-backdrop]': {},
      'div[data-rsbs-scroll]': hiddenContentScroll
        ? {
            overflow: 'hidden !important'
          }
        : undefined,
      ..._className
    }
  })

  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <>
      {visible && (
        <TransparentBackdrop
          onClick={() => {
            close()
          }}
        />
      )}
      <BottomSheet
        ref={sheetRef}
        onDismiss={() => {
          onDismiss?.()
          close()
        }}
        // @ts-ignore
        open={visible}
        // @ts-ignore
        snapPoints={({ minHeight, headerHeight, footerHeight, maxHeight }) => {
          if (autoHeight) return minHeight
          return height
            ? // 如果传入的高度是百分比形式，则最大高度*百分比
              typeof height === 'string' && height.endsWith('%')
              ? [maxHeight * (parseInt(height) / 100)]
              : [height]
            : [maxHeight / 4, maxHeight * 0.9] // 最小高度, 最大高度
        }}
        defaultSnap={({ lastSnap, snapPoints }) => lastSnap ?? Math.max(...snapPoints)}
        footer={!loading && renderFooter()}
        header={
          <>{header ? header : title && <div className={cn('leading-7 text-center font-pf-bold text-lg text-primary')}>{title}</div>}</>
        }
        scrollLocking
        expandOnContentDrag={dragOnContent}
        className={className}
        blocking={false}
        {...res}
      >
        {/* 加loading避免安卓端键盘首次弹起 ，延迟渲染*/}
        {loading && showLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <ActivityIndicator size={28} />
          </div>
        ) : (
          children
        )}
      </BottomSheet>
      {triggerDom}
    </>
  )
}

export default forwardRef(SheetModal)
