import './style.less'

import { LeftOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl } from '@umijs/max'
import { Form, message, Radio } from 'antd'
import { Key, useEffect, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import SelectRounded from '@/components/Base/SelectRounded'
import { tradeFollowLeadProfitSharing, tradeFollowLeadProfitSharingDetail } from '@/services/api/tradeFollow/lead'

import { orders } from './mock'
import ModalItem from './ModalItem'
import ModalItemDetail from './ModalItemDetail'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export default ({ info, trigger, onSuccess }: { info: Record<string, any>; trigger: JSX.Element; onSuccess?: () => void }) => {
  const [form] = Form.useForm<{ name: string; company: string }>()
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'mt.fenrunmingxi' })

  const timeRange = [
    {
      value: 'liangzhou',
      label: intl.formatMessage({ id: 'mt.liangzhou' })
    },
    {
      value: 'yiyue',
      label: intl.formatMessage({ id: 'mt.yigeyue' })
    }
  ]

  const [state, setState] = useState({
    time: timeRange[0].value
  })

  const handleChange = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value
    })
  }

  const [filter, setFilter] = useState<number | undefined>(1)

  const onClickRadio = () => {
    filter === 1 ? setFilter(undefined) : setFilter(1)
  }

  // const datas = orders
  const [datas, setDatas] = useState<TradeFollowLead.TradeFollowLeadProfitSharingItem>(orders)

  // 分页
  // const [total, setTotal] = useState(0)
  // const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  // const [current, setCurrent] = useState(1)

  useEffect(() => {
    tradeFollowLeadProfitSharing({
      leadId: info.id
    })
      .then((res) => {
        if (res.success) {
          if (res.data?.records && res.data.records.length > 0) {
            setDatas(res.data.records)
          }
        }
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
  }, [info])

  const [details, setDetails] = useState<TradeFollowLead.TradeFollowLeadProfitSharingDetailItem>([])
  const [showDetail, setShowDetail] = useState(false)
  const toShowDetail = (item: any) => {
    toSetDetail(item)
    setShowDetail(true)
  }

  const toSetDetail = (item: any) => {
    tradeFollowLeadProfitSharingDetail({
      leadId: info.id
    })
      .then((res) => {
        if (res.success) {
          if (res.data?.records && res.data.records.length > 0) {
            setDetails(res.data.records)
            return
          }
        }

        setDetails(item.details)
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
  }

  return (
    <ModalForm<{
      name: string
      company: string
    }>
      title={title}
      trigger={trigger}
      form={form}
      width={620}
      autoFocusFirstInput
      modalProps={{
        className: 'custom',
        destroyOnClose: true,
        onCancel: () => console.log('run')
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await waitTime(2000)
        console.log(values.name)
        message.success('提交成功')
        return true
      }}
      submitter={{
        render: (props, defaultDoms) => {
          return []
        }
      }}
    >
      <div className="relative h-full max-h-[550px]">
        <div className=" h-40">{/* 占位用 */}</div>
        <div className=" self-end mr-2 w-[165px] h-[142px] bg-[url('/img/modal-bg.png')] bg-[length:100%_100%] absolute right-2 -top-8">
          <Iconfont name="fenrunmingxi" width={80} color="black" height={80} className=" absolute top-3 right-10" />
        </div>
        {showDetail ? (
          <>
            <div className="flex flex-col  gap-3 mt-1 w-full absolute top-0 bottom-0 items-start ">
              <div className=" flex flex-row gap-3 items-center mb-1 ">
                <div
                  className=" h-[2.375rem] flex items-center justify-center rounded-2xl bg-gray-150 opacity-60 px-3 cursor-pointer hover:shadow-[2px_2px_4px_rgba(100,100,100,0.25)]"
                  onClick={() => {
                    setShowDetail(false)
                  }}
                >
                  <LeftOutlined /> <FormattedMessage id="mt.fanhui" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2.5 w-full overflow-scroll no-scrollbar">
                {details.map((item: any, idx: Key | null | undefined) => (
                  <ModalItemDetail item={item} key={idx} />
                ))}
                <span className=" text-sx font-normal text-gray-500 mt-1.5">
                  <FormattedMessage id="mt.meiyougengduojilu" />
                </span>
              </div>
            </div>
            {details.map((item: any, idx: Key | null | undefined) => (
              <div className=" h-16" key={idx}>
                {/* 占位用 */}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex flex-col items-start gap-3 mt-1 w-full absolute top-0 bottom-0 ">
              <div className=" flex flex-row gap-3 items-center mb-1 ">
                <div className=" h-[2.375rem] flex items-center justify-center rounded-2xl bg-gray-150 opacity-60 px-3 cursor-pointer">
                  <Radio.Group value={filter}>
                    <Radio onClick={onClickRadio} value={1}>
                      <FormattedMessage id="mt.yincangfenrunwei0deriqi" />
                    </Radio>
                  </Radio.Group>
                </div>
                <SelectRounded
                  variant="filled"
                  labelRender={(item) => (
                    <span className=" text-primary text-sm font-normal">
                      <FormattedMessage id="mt.jin" />
                      {item.label}
                    </span>
                  )}
                  value={state.time}
                  onChange={(i) => handleChange('time', i.value)}
                  options={timeRange}
                />
              </div>

              <div className="flex flex-col items-center gap-2.5 w-full overflow-scroll no-scrollbar">
                {datas.map((item: any, idx: Key | null | undefined) => (
                  <ModalItem onClick={toShowDetail} item={item} key={idx} />
                ))}
                <span className=" text-sx font-normal text-gray-500 mt-1.5">
                  <FormattedMessage id="mt.meiyougengduojilu" />
                </span>
              </div>
            </div>
            {datas.map((item: any, idx: Key | null | undefined) => (
              <div className=" h-20" key={idx}>
                {/* 占位用 */}
              </div>
            ))}
          </>
        )}
      </div>
    </ModalForm>
  )
}
