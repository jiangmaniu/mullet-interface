import { ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel } from '@umijs/max'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { message } from '@/utils/message'

export default function AccountSelect({ onClick, style }: { onClick?: (item: any) => void; style?: React.CSSProperties | undefined }) {
  const { initialState } = useModel('@@initialState')
  const intl = useIntl()
  const [accountId, setAccountId] = useState<any>('')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // 默认选择第一个
    setAccountId(accountList[0]?.id)
  }, [initialState])

  const popupClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-item-option-active': {
        backgroundColor: '#fff !important'
      },
      '.ant-select-item-option-selected': {
        backgroundColor: '#fff !important'
      },
      '.ant-select-selector': {
        background: '#F9FEFF !important'
      }
    }
  })

  const clickHandler = (key: string) => {
    setOpen(false)
    const item = accountList.find((item) => item.id === key)

    if (!item) {
      message.info('error')
    }

    if (onClick) {
      onClick(item)
    }
  }

  return (
    <ProFormSelect
      options={accountList.map((item) => ({
        ...item,
        value: item.id,
        label: `${item.name} #${item?.id}`
      }))}
      fieldProps={{
        open,
        // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
        // optionLabelProp: 'label',
        onDropdownVisibleChange: (visible) => setOpen(visible),
        showSearch: false,
        allowClear: false,
        listHeight: 300,
        value: accountId,
        popupClassName: popupClassName,
        className: popupClassName,
        style: { minWidth: 260, height: 38, ...style },
        optionRender: (option) => {
          const item = option?.data || {}

          return (
            <div
              onClick={() => {
                clickHandler(item.value as string)
              }}
              className={classNames('cursor-pointer rounded-lg border border-gray-250 px-2 py-1  hover:bg-[#fbfbfb]', {
                'bg-[#fbfbfb]': item.id === accountId
              })}
            >
              <div className="flex justify-between w-full p-2">
                <div className="flex justify-between w-full">
                  <div className="flex-1 text-sm font-bold text-primary truncate">
                    {item.name} #{item?.id}
                  </div>
                </div>
              </div>
            </div>
          )
        },
        size: 'large',
        suffixIcon: <img src="/img/select-down.png" width={24} height={24} style={{ opacity: 0.5 }} />
      }}
    />
  )
}
