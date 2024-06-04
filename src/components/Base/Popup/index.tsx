import { CloseOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import { Button, Divider } from 'antd'
import { Popup } from 'antd-mobile'
import { PopupBaseProps } from 'antd-mobile/es/components/popup/popup-base-props'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

import Theme from '@/theme/theme.antd'

type IProps = {
  children: React.ReactNode
  bodyStyle?: React.CSSProperties
  headerStyle?: React.CSSProperties
  footerStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
  height?: number | string
  position?: 'left' | 'right' | 'bottom' | 'top' | undefined
  title?: string | React.ReactNode
  visible?: boolean
  /** @name 用于触发抽屉打开的 dom */
  trigger?: JSX.Element
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
  showFooter?: boolean
  renderFooter?: React.ReactNode
  renderHeader?: React.ReactNode
  cancelText?: React.ReactNode | string
  confirmText?: React.ReactNode | string
  open?: boolean
} & PopupBaseProps

export default forwardRef(
  (
    {
      children,
      bodyStyle,
      headerStyle,
      height,
      title,
      open,
      trigger,
      showFooter,
      renderFooter,
      renderHeader,
      onConfirm,
      onCancel,
      onClose,
      cancelText,
      confirmText,
      footerStyle,
      contentStyle,
      ...res
    }: IProps,
    ref: any
  ) => {
    const [isOpen, setIsOpen] = useState<undefined | boolean>(false)
    const [loading, setLoading] = useState(false)

    const close = () => {
      onClose?.()
      setIsOpen(false)
    }
    const show = () => {
      setIsOpen(true)
    }

    useEffect(() => {
      // if (open) {
      //   document.documentElement.style.overflowY = 'hidden'
      // } else {
      //   document.documentElement.style.overflowY = 'auto'
      // }
      setIsOpen(open as boolean)
    }, [open])

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

    const renderDefaultHeader = () => {
      if (renderHeader) {
        return renderHeader
      }
      return (
        <>
          <div className="flex justify-between items-center" style={headerStyle}>
            <h1 className="flex items-center justify-center p-3 text-base font-bold">{title || <FormattedMessage id="common.tips" />}</h1>
            <CloseOutlined style={{ color: Theme.colorPrimary, fontSize: 18, paddingRight: 12 }} onClick={close} />
          </div>
          <Divider style={{ marginBottom: 10, marginTop: 0 }} />
        </>
      )
    }

    return (
      <>
        <Popup
          visible={isOpen}
          onMaskClick={close}
          onClose={close}
          destroyOnClose={false}
          afterClose={close}
          bodyStyle={{ height: height || 'auto', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', ...bodyStyle }}
          {...res}
        >
          {renderDefaultHeader()}
          <div className="pb-[80px]" style={{ ...contentStyle }}>
            {children}
          </div>
          {showFooter && !renderFooter && (
            <div className="flex justify-around items-center fixed bottom-0 w-full h-[60px] bg-white" style={footerStyle}>
              <Button
                style={{ width: '45%', height: 38 }}
                onClick={() => {
                  close()
                  onCancel?.()
                }}
              >
                {cancelText || <FormattedMessage id="common.cancel" />}
              </Button>
              <Button
                type="primary"
                style={{ width: '45%', height: 38 }}
                loading={loading}
                onClick={async () => {
                  try {
                    setLoading(true)
                    // 如果有错误抛出  throw {} 则不关闭弹窗
                    await onConfirm?.()
                    close()
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                {confirmText || <FormattedMessage id="common.confirm" />}
              </Button>
            </div>
          )}
          {renderFooter && (
            <div className="flex justify-around items-center pt-2" style={footerStyle}>
              {renderFooter}
            </div>
          )}
        </Popup>
        {triggerDom}
      </>
    )
  }
)
