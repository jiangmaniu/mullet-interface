import { ModalForm as ProModalForm,ModalFormProps } from '@ant-design/pro-components'
import { Form } from 'antd'
import { TabBarExtraContent } from 'rc-tabs/lib/interface'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

import { SaveButton } from '@/components/Base/Button'

import Tabs, { ITabItem } from '../Tabs'

interface IProps<T, U> extends ModalFormProps<T, U> {
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
  onFinish?: (formData: T) => Promise<boolean | void>
  afterClose?: () => void
  onCancel?: () => void
  tabActiveKey?: string
  /**展示头部背景 */
  showHeaderBg?: boolean
  /**隐藏底部提交按钮 */
  hiddenSubmitter?: boolean
  open?: boolean
}

function ModalForm<T = Record<string, any>, U = Record<string, any>>(
  {
    children,
    modalProps,
    afterClose,
    onCancel,
    submitter,
    hiddenSubmitter,
    onChangeTab,
    tabList = [],
    tabBarStyle,
    tabBarExtraContent,
    hiddenTabbarLine,
    onFinish,
    renderTitle,
    title,
    subTitle,
    contentStyle,
    tabActiveKey,
    showHeaderBg,
    trigger,
    open,
    ...res
  }: IProps<T, U>,
  ref: any
) {
  let tabItems = tabList as ITabItem[]
  const [tabKey, setTabKey] = useState(tabItems[0]?.key || '')
  const [tabLabel, setTabLabel] = useState(tabItems[0]?.label || '')
  const [form] = Form.useForm<T>()
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<undefined | boolean>(false)

  const isLastTab = tabKey === tabItems[tabItems.length - 1]?.key
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
      {isOpen && (
        <ProModalForm<T, U>
          title={
            <div>
              <div className="flex items-center pb-3 px-7">
                {!renderTitle && (
                  <>
                    {title && <span className="text-lg text-primary font-semibold">{title}</span>}
                    {subTitle && <span className="text-sm text-primary pl-[14px]">{subTitle}</span>}
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
          form={form}
          width={870}
          open={isOpen}
          modalProps={{
            destroyOnClose: true,
            centered: true,
            // closable: !loading,
            maskClosable: false,
            onCancel: () => {
              console.log('run')
              onCancel && onCancel()
              setIsOpen(false)
            },
            afterClose: () => {
              setTabKey(tabItems[0]?.key)
              afterClose?.()
              setIsOpen(false)
            },
            wrapClassName: 'modal-no-padding',
            styles: {
              header: {
                background: isTabList || showHeaderBg ? 'var(--modal-header-bg)' : '#fff',
                paddingTop: 24,
                paddingLeft: 0,
                paddingRight: 0
              },
              footer: {
                paddingTop: 5,
                paddingLeft: 28,
                paddingRight: 28
              }
            },
            ...modalProps
          }}
          submitter={
            hiddenSubmitter
              ? false
              : {
                  // resetButtonProps: {
                  //   style: {
                  //     // 隐藏重置按钮
                  //     display: 'none'
                  //   }
                  // },
                  // searchConfig: {
                  //   submitText: "保存"
                  // },
                  submitButtonProps: {
                    style: { width: 96, height: 38 }
                  },
                  resetButtonProps: {
                    style: { width: 96, height: 38 }
                  },
                  // onSubmit: (value) => {
                  //   form.submit()
                  //   onConfirm?.()
                  // },
                  render: (props, dom) => [
                    <div key="footer" className="flex justify-end items-center w-full">
                      {isTabList ? (
                        <SaveButton
                          style={{ height: 38, paddingLeft: 28, paddingRight: 28 }}
                          onClick={() => {
                            form?.submit?.()
                          }}
                          loading={loading}
                        />
                      ) : (
                        <div className="flex items-center gap-[10px]">{dom}</div>
                      )}
                    </div>
                  ],
                  ...submitter
                }
          }
          // 提交数据时，禁用取消按钮的超时时间（毫秒）。
          submitTimeout={2000}
          // 提交数据时触发，如果返回一个 true。会关掉抽屉,如果配置了 destroyOnClose 还会重置表单
          layout="vertical"
          onFinish={async (values) => {
            // console.log('values', values)
            setLoading(true)
            let success: any = false
            try {
              success = await onFinish?.(values)
            } catch (e) {
              console.log('onFinish error', e)
            } finally {
              setLoading(false)
            }
            setIsOpen(false)
            return success
          }}
          {...res}
        >
          <div className="px-7 pb-7" style={{ paddingTop: isTabList ? 28 : 16, ...contentStyle }}>
            {children}
          </div>
        </ProModalForm>
      )}
      {triggerDom}
    </>
  )
}

export default forwardRef(ModalForm)
