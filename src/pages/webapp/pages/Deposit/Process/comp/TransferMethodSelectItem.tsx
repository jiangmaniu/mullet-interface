import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useEffect, useLayoutEffect, useState } from 'react'

import Dropdown from '@/components/Base/Dropdown'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { ProForm } from '@ant-design/pro-components'
import { observer } from 'mobx-react'

type IProps = {
  form: FormInstance
  tips?: string
}

/**转入表单项 */
function TransferMethodSelectItem({ form, tips }: IProps) {
  const [open, setOpen] = useState(false)
  const intl = useIntl()

  // const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const methodId = Form.useWatch('methodId', form) // 转入

  const method = stores.wallet.depositMethods.find((item) => item.channelId === methodId)
  const [explanation, setExplanation] = useState<Record<string, any>[]>([])
  useEffect(() => {
    try {
      if (method) {
        const parsedExplanation = JSON.parse(method.explanation || '{}')
        setExplanation(parsedExplanation)
      }
    } catch (error) {
      console.error(error)
    }
  }, [method])

  const methods = stores.wallet.depositMethods
  const depositMethodInitialized = stores.wallet.depositMethodInitialized
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

  useLayoutEffect(() => {
    const now = Date.now().valueOf()
    if (prevIntl !== intl.locale || now - depositMethodInitialized > 1000 * 30) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getDepositMethods({ language })

      setPrevIntl(intl.locale)
      return
    }
  }, [depositMethodInitialized, intl.locale])

  return (
    <div>
      <ProForm.Item
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.zhifufangshi" />
          </span>
        }
        name="methodId"
      >
        {/* <ProFormSelect
          placeholder={intl.formatMessage({ id: 'mt.xuanzezhifufangshi' })}
          allowClear={false}
          fieldProps={{
            style: {
              height: 44
            },
            open,
            onDropdownVisibleChange: (visible) => setOpen(visible),
            suffixIcon: (
              <>
                <SelectSuffixIcon opacity={0.5} />
              </>
            ),
            showSearch: false,
            listHeight: 300,
            optionRender: (option) => {
              const item = option?.data || {}
              return (
                <div
                  onClick={() => {
                    setOpen(false)
                  }}
                  className={classNames('cursor-pointer rounded-lg border  border-gray-150 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
                    'bg-[#f5f5f5]': item.channelId === methodId
                  })}
                >
                </div>
              )
            },
            // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
            optionLabelProp: 'title'
          }}
          rules={[
            {
              required: true,
              validator(rule, value, callback) {
                if (!methodId) {
                  return Promise.reject(intl.formatMessage({ id: 'mt.xuanzezhifufangshi' }))
                }
                return Promise.resolve()
              }
            }
          ]}
          options={methods.map((item) => ({
            // ...item,
            value: item.channelId,
            label: (
              <div className="flex justify-start w-full gap-2">
                <img src={`${getEnv().imgDomain}${item.channelIcon}`} alt="" className="w-5 h-5 rounded-full overflow-hidden" />
                <div className="flex-1 text-sm font-bold text-primary truncate">
                  {item.channelRevealName}&nbsp;({item.channelNo})
                </div>
              </div>
            )
          }))}
        >
          <div className="flex justify-end text-sm text-primary font-medium">{intl.formatMessage({ id: 'mt.qiehuan' })}</div>
        </ProFormSelect> */}
        <div className="  border border-[#f0f0f0] rounded-lg w-full ">
          <div className="flex justify-between items-center h-[44px] pl-2.5 pr-1.5">
            <div className="flex items-center gap-2">
              <img src={`${getEnv().imgDomain}${method?.channelIcon}`} alt="" className="w-5 h-5 rounded-full overflow-hidden" />
              <div className="flex-1 text-sm font-bold text-primary truncate">
                {method?.channelRevealName}&nbsp;({method?.channelNo})
              </div>
            </div>
            <div className="border border-[#f0f0f0] rounded-lg h-[34px] w-[72px] flex items-center justify-center">
              <Dropdown
                placement="bottomRight"
                // dropdownRender={(origin) => {
                //   console.log(origin)
                //   return <div></div>
                // }}
                menu={{
                  onClick: (e) => {
                    const { key } = e
                    form.setFieldValue('methodId', key)
                  },
                  items: methods.map((item) => ({
                    // ...item,
                    key: item.channelId,
                    label: (
                      <div className="flex justify-start items-center w-full gap-2 bg-[#f9f9f9] px-2 rounded-lg h-[32px]">
                        <img src={`${getEnv().imgDomain}${item.channelIcon}`} alt="" className="w-5 h-5 rounded-full overflow-hidden" />
                        <div className="flex-1 text-sm font-bold text-primary truncate">
                          {item.channelRevealName}&nbsp;({item.channelNo})
                        </div>
                      </div>
                    )
                  }))
                }}
              >
                <div className="flex items-center gap-1">
                  <div>{intl.formatMessage({ id: 'mt.qiehuan' })}</div>
                  <Iconfont name="xialacaidan" width={18} height={18} color="black" />
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="px-[14px] py-2 border-t border-gray-70 flex flex-col gap-1">
            {explanation &&
              Object.entries(explanation).map(([key, value]) => (
                <div className="flex flex-row items-center justify-between gap-[18px]" key={key}>
                  <div className=" text-xs text-weak font-normal min-w-20 ">{value?.title}</div>
                  <div className="text-xs font-bold text-gray-900">{value?.content}</div>
                </div>
              ))}
          </div>
        </div>
      </ProForm.Item>

      {tips && (
        <div className="text-xs bg-gray-120 rounded-lg py-2 px-2.5 mt-2.5">
          <div dangerouslySetInnerHTML={{ __html: tips || '' }} />
        </div>
      )}
    </div>
  )
}

export default observer(TransferMethodSelectItem)
