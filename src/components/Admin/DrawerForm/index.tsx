import { DrawerForm as ProDrawerForm,DrawerFormProps } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Form } from 'antd'
import { TabBarExtraContent } from 'rc-tabs/lib/interface'
import { useEffect, useState } from 'react'

import { SaveButton } from '@/components/Base/Button'

import Tabs, { ITabItem } from '../Tabs'

interface IProps<T, U> extends DrawerFormProps<T, U> {
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
  /**隐藏提交栏按钮 */
  hiddenSubmitter?: boolean
  /**渲染Tabs头部区域内容 */
  renderTabHeaderExtra?: () => React.ReactNode
}

function DrawerForm<T = Record<string, any>, U = Record<string, any>>({
  children,
  drawerProps,
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
  renderTabHeaderExtra,
  ...res
}: IProps<T, U>) {
  let tabItems = tabList as ITabItem[]
  const [tabKey, setTabKey] = useState(tabItems[0]?.key || '')
  const [tabLabel, setTabLabel] = useState(tabItems[0]?.label || '')
  const [form] = Form.useForm<T>()
  const [loading, setLoading] = useState(false)

  const isLastTab = tabKey === tabItems[tabItems.length - 1]?.key
  const isTabList = tabList.length > 0

  useEffect(() => {
    if (tabActiveKey) {
      setTabKey(tabActiveKey)
    }
  }, [tabActiveKey])

  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-drawer-header': {
        borderBottom: 'none !important'
      },
      '&': {
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24
      }
    }
  })

  return (
    <ProDrawerForm<T, U>
      title={
        <div>
          <div className="flex items-center">
            {!renderTitle && (
              <>
                {title && <span className="text-lg text-primary font-semibold">{title}</span>}
                {subTitle && <span className="text-sm text-primary pl-[14px]">{subTitle}</span>}
              </>
            )}
            {renderTitle?.()}
          </div>
        </div>
      }
      form={form}
      width={560}
      drawerProps={{
        className,
        styles: { body: { padding: 0 } },
        destroyOnClose: true,
        closeIcon: <img src="/img/fold.png" width={27} height={26} />,
        onClose: () => {
          afterClose?.()
        },
        ...drawerProps
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
              //   submitText: '保存'
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
        return success
      }}
      {...res}
    >
      <div className="px-6">{renderTabHeaderExtra?.()}</div>
      <Tabs
        showMobileTabs
        tabList={tabList}
        activeKey={tabKey}
        hiddenBottomLine={false}
        tabBarGutter={52}
        tabBarStyle={{ paddingLeft: 28 }}
        tabPaddingBottom={16}
        onChangeTab={(activeKey, activeLabel) => {
          setTabKey(activeKey)
          setTabLabel(activeLabel)
          onChangeTab?.(activeKey, activeLabel)
        }}
        tabBarExtraContent={tabBarExtraContent}
      />
      <div className="px-6 pt-7" style={contentStyle}>
        {children}
      </div>
    </ProDrawerForm>
  )
}

export default DrawerForm
