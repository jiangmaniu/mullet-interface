import { CaretDownOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Input, Radio, Select } from 'antd'
import { useState } from 'react'
import { black } from 'tailwindcss/colors'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { hiddenCenterPartStr } from '@/utils'

import { AccountTag } from '../../comp/AccountTag'

type IProp = {
  onConfirm?: (values: any) => void
}

export default (props: IProp) => {
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  const tags = [
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'gray',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    }
  ]

  const [gendanjine, setGendanjine] = useState<number | undefined>()

  const [read, setRead] = useState<number | undefined>(1)

  // 折叠
  const [isCollapse, setIsCollapse] = useState(false)

  const onClickRadio = () => {
    read === 1 ? setRead(undefined) : setRead(1)
  }

  return (
    <div className="flex flex-col justify-between gap-4.5 w-full max-w-full">
      {/* 跟单账户 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.gendanzhanghu" />
        </span>

        <Select
          suffixIcon={null}
          size="large"
          labelRender={(item) => (
            <span className=" flex flex-row gap-2.5 items-center justify-center">
              <span className="flex flex-row justify-between items-center flex-1">
                <span className="flex flex-row justify-between items-center gap-1.5 ">
                  <AccountTag type="meifen" />
                  <span>{item.value}</span>
                </span>
                <Iconfont name="down" width={20} height={20} color={black['900']} />
              </span>
              <span className=" w-[1px] h-[11px] bg-gray-260"></span>
              {/* <span className=" text-sm !font-dingpro-regular"> {item.jine} USD</span> */}
              <span className=" text-sm !font-dingpro-medium"> 231.3 USD</span>
            </span>
          )}
          placeholder={`${intl.formatMessage({ id: 'mt.qingxuanze' })}${intl.formatMessage({ id: 'mt.gendanzhanghu' })}`}
          options={accountList.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
          }))}
        />
      </div>
      {/* 每笔跟单保证金 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.meibigendanbaozhengjin" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}10~999999999`}
          count={{
            show: false,
            max: 10
          }}
          suffix={<span className=" text-sm font-semibold text-black-800">USD</span>}
        />
      </div>
      {/* 跟单金额 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.gendanjine" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          value={gendanjine}
          placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}10~1000000`}
          count={{
            show: false,
            max: 10
          }}
          suffix={
            <span className=" flex flex-row gap-2 items-center">
              <span className=" text-sm text-blue cursor-pointer" onClick={() => setGendanjine(231.3)}>
                <FormattedMessage id="mt.quanbu" />
              </span>
              <span className=" text-sm font-semibold text-black-800">USD</span>
            </span>
          }
        />
      </div>
      <div className=" flex flex-row justify-between items-center">
        <span
          className=" text-sm font-normal text-black-800 flex items-center gap-1 cursor-pointer"
          onClick={() => setIsCollapse(!isCollapse)}
        >
          <FormattedMessage id="mt.gaojishezhi" />
          <CaretDownOutlined
            className="transition-all duration-300"
            style={{ color: 'black', transform: isCollapse ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </span>
        <span className=" text-sm font-normal text-black-800 flex items-center">
          <Iconfont name="huazhuan" width={18} height={18} color={black['900']} />
          <FormattedMessage id="mt.huazhuan" />
        </span>
      </div>
      {/* 止盈止损 */}
      <div
        className="grid grid-cols-2 gap-3.5 collapsible"
        style={{
          display: isCollapse ? 'none' : 'grid'
        }}
      >
        <div className="flex flex-col gap-2.5 justify-start flex-1">
          <span className=" text-sm font-normal text-black-800">
            <FormattedMessage id="mt.zhiying" />
          </span>
          <Input
            size="large"
            style={{
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            }}
            placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}`}
            count={{
              show: false,
              max: 10
            }}
            suffix={<span className=" text-sm font-semibold text-black-800">%</span>}
          />
        </div>
        <div className="flex flex-col gap-2.5 justify-start flex-1">
          <span className=" text-sm font-normal text-black-800">
            <FormattedMessage id="mt.zhisun" />
          </span>
          <Input
            size="large"
            style={{
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            }}
            placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}`}
            count={{
              show: false,
              max: 10
            }}
            suffix={<span className=" text-sm font-semibold text-black-800">%</span>}
          />
        </div>
      </div>
      {/* 确认 */}
      <div className=" justify-self-end flex flex-col items-start justify-between gap-2.5 w-full max-w-full">
        <Radio.Group value={read}>
          <Radio onClick={onClickRadio} value={1}>
            <span className=" text-black-800 font-normal text-xs">
              <FormattedMessage id="mt.woyiyuedubingtongyi" />
              <span
                className="  cursor-pointer text-blue"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('fuwutiaokuan')
                }}
              >
                <FormattedMessage id="mt.gendanyonghuxieyi" />
              </span>
            </span>
          </Radio>
        </Radio.Group>
        <Button
          height={48}
          type="primary"
          style={{
            width: '100%',
            borderRadius: 8
          }}
          onClick={props.onConfirm}
        >
          <div className=" flex items-center gap-1">
            <span className=" font-semibold text-base ">
              <FormattedMessage id="mt.queren" />
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
