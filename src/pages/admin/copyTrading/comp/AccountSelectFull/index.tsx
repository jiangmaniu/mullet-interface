import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl, useModel } from '@umijs/max'
import { Dropdown, MenuProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { gray } from 'tailwindcss/colors'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { tradeFollowListLeads } from '@/services/api/tradeFollow/lead'
import { hiddenCenterPartStr } from '@/utils'
import { message } from '@/utils/message'

export default function AccountSelect({
  leadId,
  onClick,
  style
}: {
  leadId: string
  onClick?: (item: any) => void
  style?: React.CSSProperties | undefined
}) {
  const { initialState } = useModel('@@initialState')
  const intl = useIntl()
  // const [accountId, setAccountId] = useState<any>('')
  const [curr, setCurr] = useState<any>()
  // const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表
  const [open, setOpen] = useState(false)

  const [accountList, setAccountList] = useState<any[]>([])

  useEffect(() => {
    tradeFollowListLeads({
      leadId
    }).then((res) => {
      if (res.success) {
        setAccountList(res.data as any[])
      }
    })
  }, [initialState])

  useEffect(() => {
    // 默认选择第一个
    accountList.length > 0 && setCurr(accountList[0])
  }, [accountList])

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
    const item = accountList.find((item) => item.leadId === key)

    if (!item) {
      message.info('error')
      return
    }
    setCurr(item)

    if (onClick) {
      onClick(item)
    }
  }

  const items: MenuProps['items'] = useMemo(() => {
    return accountList.map((item) => ({
      ...item,
      key: item.leadId,
      label: `${item.projectName} #${hiddenCenterPartStr(item?.tradeAccountId, 4)}`
    }))
  }, [accountList])

  const menu = {
    items,
    onClick: (e: any) => {
      clickHandler(e.key)
    }
  }

  return (
    <Dropdown.Button
      style={{
        height: 56
      }}
      trigger={['click']}
      buttonsRender={(btns) => [
        <Button
          key={0}
          type="default"
          style={{
            height: '100%',
            borderRadius: '12 0 0 12'
          }}
          onClick={() => {
            console.log(curr)
            // message.info('点击按钮左侧')
          }}
        >
          <div className="flex flex-row justify-start items-center gap-3">
            <Iconfont name="zhanghu" width={28} height={28} color={gray['600']} />
            <div className="flex flex-col items-start justify-center">
              <span className=" text-primary font-semibold text-base !font-dingpro-medium">
                {curr?.projectName}#{curr?.tradeAccountId}
              </span>
              <span className=" text-gray-600 text-xs ">{curr?.groupName}</span>
            </div>
          </div>
        </Button>,
        <Button
          key={1}
          type="default"
          style={{
            height: '100%',
            borderRadius: '12 0 0 12'
          }}
        >
          <Iconfont name="down" width={20} height={20} color={gray['600']} />
        </Button>
      ]}
      rootClassName="min-w-[312px] h-[56px]"
      menu={menu}
    ></Dropdown.Button>

    // <ProFormSelect
    //   options={accountList.map((item) => ({
    //     ...item,
    //     value: item.id,
    //     label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
    //   }))}
    //   fieldProps={{
    //     open,
    //     // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
    //     // optionLabelProp: 'label',
    //     onDropdownVisibleChange: (visible) => setOpen(visible),
    //     showSearch: false,
    //     allowClear: false,
    //     listHeight: 300,
    //     value: accountId,
    //     popupClassName: popupClassName,
    //     className: popupClassName,
    //     style: { minWidth: 312, height: 56, ...style },
    //     optionRender: (option) => {
    //       const item = option?.data || {}

    //       return (
    //         <div
    //           onClick={() => {
    //             clickHandler(item)
    //           }}
    //           className={classNames('cursor-pointer rounded-lg border border-gray-250 px-2 py-1  hover:bg-[#fbfbfb]', {
    //             'bg-[#fbfbfb]': item.id === accountId
    //           })}
    //         >
    //           <div className="flex justify-between w-full p-2">
    //             <div className="flex justify-between w-full">
    //               <div className="flex-1 text-sm font-bold text-primary truncate">
    //                 {item.name} #{hiddenCenterPartStr(item?.id, 4)}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )
    //     },
    //     size: 'large',
    //     suffixIcon: <img src="/img/select-down.png" width={24} height={24} style={{ opacity: 0.5 }} />
    //   }}
    // />
  )
}
