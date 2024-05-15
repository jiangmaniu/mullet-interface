import { FormattedMessage } from '@umijs/max'
import { Modal as AntdModal, ModalProps } from 'antd'
import { TabBarExtraContent } from 'rc-tabs/lib/interface'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

import Button, { SaveButton } from '@/components/Base/Button'

import Tabs, { ITabItem } from '../Tabs'

interface IProps extends ModalProps {
  children: React.ReactNode
  tabList?: ITabItem[]
  onChangeTab?: (activeKey: string, activeLabel: string) => void
  tabBarStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
  tabBarExtraContent?: TabBarExtraContent
  /**@name 隐藏tabbar下划线  */
  hiddenTabbarLine?: boolean
  title?: React.ReactNode
  subTitle?: string
  renderTitle?: () => React.ReactNode
  onFinish?: () => void
  afterClose?: () => void
  onCancel?: () => void
  tabActiveKey?: string
  /** @name 用于触发抽屉打开的 dom */
  trigger?: JSX.Element
  open?: boolean
  /**隐藏底部提交按钮 */
  hiddenSubmitter?: boolean
}

/**
 * Modal弹窗封装，不包含Form的，如需使用ModalForm，请使用ModalForm组件
 * @param param0
 * @param ref
 * @returns
 */
function Modal(
  {
    children,
    trigger,
    afterClose,
    onCancel,
    onChangeTab,
    tabList = [],
    tabBarStyle,
    tabBarExtraContent,
    hiddenTabbarLine,
    renderTitle,
    title,
    subTitle,
    contentStyle,
    tabActiveKey,
    onFinish,
    open,
    hiddenSubmitter,
    ...res
  }: IProps,
  ref: any
) {
  let tabItems = tabList as ITabItem[]
  const [tabKey, setTabKey] = useState(tabItems[0]?.key || '')
  const [tabLabel, setTabLabel] = useState(tabItems[0]?.label || '')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<undefined | boolean>(false)

  const isTabList = tabList.length > 0

  useEffect(() => {
    setTabKey(tabActiveKey || tabItems[0]?.key)
  }, [tabActiveKey])

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const close = () => {
    onCancel?.()
    setIsOpen(false)
  }
  const show = () => {
    setIsOpen(true)
  }

  // 对外暴露接口
  useImperativeHandle(ref, () => {
    return {
      close,
      show,
      isOpen
    }
  })

  // 确认弹窗
  const handleConfirm = async () => {
    setLoading(true)
    try {
      const success = await onFinish?.()
      if (success) {
        // 关闭弹窗
        close()
      }
    } catch (e) {
      console.log('handleConfirm error', e)
    } finally {
      setLoading(false)
    }
  }

  const triggerDom = useMemo(() => {
    if (!trigger) {
      return null
    }
    return cloneElement(trigger, {
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
      <AntdModal
        open={isOpen}
        title={
          <div>
            <div className="flex items-center pb-3 px-7">
              {!renderTitle && (
                <>
                  {title && <span className="text-lg text-black font-semibold">{title}</span>}
                  {subTitle && <span className="text-sm text-gray pl-[14px]">{subTitle}</span>}
                </>
              )}
              {renderTitle?.()}
            </div>
            <Tabs
              showMobileTabs
              tabList={tabList}
              activeKey={tabKey}
              tabBarGutter={56}
              tabBarStyle={{ paddingLeft: 28 }}
              onChangeTab={(activeKey, activeLabel) => {
                setTabKey(activeKey)
                setTabLabel(activeLabel)
                onChangeTab?.(activeKey, activeLabel)
              }}
              tabBarExtraContent={tabBarExtraContent}
            />
          </div>
        }
        width={870}
        destroyOnClose={true}
        centered
        maskClosable={false}
        closable={!loading}
        onCancel={close}
        afterClose={() => {
          setTabKey(tabItems[0]?.key)
          afterClose?.()
        }}
        wrapClassName="modal-no-padding"
        styles={{
          header: {
            background: isTabList ? 'var(--page-container-header-bg)' : '#fff',
            paddingTop: 24,
            paddingLeft: 0,
            paddingRight: 0
          },
          footer: {
            paddingTop: 5,
            paddingLeft: 28,
            paddingRight: 28
          }
        }}
        footer={
          hiddenSubmitter ? null : (
            <div key="footer" className="flex justify-end items-center w-full">
              {isTabList ? (
                <SaveButton style={{ height: 38, paddingLeft: 28, paddingRight: 28 }} onClick={handleConfirm} loading={loading} />
              ) : (
                <div className="flex items-center gap-[10px]">
                  <Button onClick={close} style={{ minWidth: 100, height: 40 }}>
                    <FormattedMessage id="common.cancel" />
                  </Button>
                  <Button type="primary" loading={loading} onClick={handleConfirm} style={{ minWidth: 100, height: 40 }}>
                    <FormattedMessage id="common.queren" />
                  </Button>
                </div>
              )}
            </div>
          )
        }
        {...res}
      >
        <div className="px-7 pb-7" style={{ paddingTop: isTabList ? 28 : 16, ...contentStyle }}>
          {children}
        </div>
      </AntdModal>
      {triggerDom}
    </>
  )
}

export default forwardRef(Modal)
