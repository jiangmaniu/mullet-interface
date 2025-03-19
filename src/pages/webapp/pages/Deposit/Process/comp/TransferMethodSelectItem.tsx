import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { useLayoutEffect, useState } from 'react'

import ProFormSelect from '@/components/Admin/Form/ProFormSelect'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import classNames from 'classnames'
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
      <ProFormSelect
        label={
          <span className="text-sm text-primary font-medium">
            <FormattedMessage id="mt.zhifufangshi" />
          </span>
        }
        name="methodId"
        placeholder={intl.formatMessage({ id: 'mt.xuanzezhifufangshi' })}
        allowClear={false}
        fieldProps={{
          open,
          onDropdownVisibleChange: (visible) => setOpen(visible),
          suffixIcon: (
            <>
              <SelectSuffixIcon opacity={0.5} />
              {/* <div className="bg-gray-250 h-3 w-[1px] mr-3"></div>
            <div className="text-primary text-sm py-3 !font-dingpro-medium">
              {formatNum(availableMoney, { precision: toAccountInfo?.currencyDecimal })} USD
            </div> */}
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
                className={classNames('cursor-pointer rounded-lg border  border-gray-250 pb-[6px] pt-[11px] hover:bg-[#f5f5f5]', {
                  'bg-[#f5f5f5]': item.channelId === methodId
                })}
              >
                <div className="flex w-full py-2 ml-[10px]">{item.label}</div>
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
              <img src={`${getEnv().imgDomain}${item.channelIcon}`} alt="" className="w-5 h-5 rounded-full overflow-hidden bg-gray" />
              <div className="flex-1 text-sm font-bold text-primary truncate">
                {item.channelRevealName}&nbsp;({item.channelNo})
              </div>
            </div>
          )
        }))}
      />
      {tips && (
        <div className="text-xs bg-gray-120 rounded-lg py-2 px-2.5 mt-2.5">
          <div dangerouslySetInnerHTML={{ __html: tips || '' }} />
        </div>
      )}
    </div>
  )
}

export default observer(TransferMethodSelectItem)
