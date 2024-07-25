import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Input, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import Button from '@/components/Base/Button'
import { hiddenCenterPartStr } from '@/utils'

import { AccountTag } from '../../comp/AccountTag'

export default () => {
  const intl = useIntl()
  const placeholderName = intl.formatMessage({
    id: 'mt.mingcheng'
  })

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  return (
    <div className="flex flex-col justify-between gap-4.5 w-full max-w-full">
      {/* 带单账户 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.daidanzhanghu" />
        </span>
        <Select
          suffixIcon={null}
          size="large"
          labelRender={(item) => (
            <span className=" flex flex-row gap-2.5 items-center justify-between">
              <span className="flex flex-row justify-between items-center gap-1.5 ">
                <AccountTag type="meifen" />
                <span>{item.value}</span>
              </span>
              {/* <span className=" text-sm !font-dingpro-regular"> {item.jine} USD</span> */}
              <span className=" text-sm !font-dingpro-medium"> 231.3 USD</span>
            </span>
          )}
          options={accountList.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
          }))}
        />
      </div>
      {/* 名称 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.mingcheng" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          count={{
            show: true,
            max: 10
          }}
          placeholder={placeholderName}
        />
      </div>
      {/* 介绍 */}
      <div className="flex flex-col items-start justify-between gap-2.5 w-full max-w-full">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.jieshao" />
        </span>
        <TextArea
          rows={4}
          maxLength={200}
          count={{
            show: true,
            max: 200
          }}
        />
      </div>
      {/* 保存 */}
      <div className=" justify-self-end flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full">
        <Button
          height={48}
          type="primary"
          style={{
            width: '100%',
            borderRadius: 8
          }}
          onClick={() => {
            // todo 跳转
          }}
        >
          <div className=" flex items-center gap-1">
            <span className=" font-medium text-base ">
              <FormattedMessage id="mt.baocun" />
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
