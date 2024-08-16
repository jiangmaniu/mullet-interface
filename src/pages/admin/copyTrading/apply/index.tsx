import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Input, Radio, Select, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useState } from 'react'

import Header from '@/components/Admin/Header'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { SYSTEM_NAME } from '@/constants'
import { hiddenCenterPartStr } from '@/utils'

import AccountSelect from '../comp/AccountSelect'
import { AvatarUpload } from './AvatarUpload'

// 申请成为带单员
export default function Apply() {
  const intl = useIntl()
  const placeholderName = intl.formatMessage({
    id: 'mt.mingcheng'
  })

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  const [read, setRead] = useState<number | undefined>(1)

  const onClickRadio = () => {
    read === 1 ? setRead(undefined) : setRead(1)
  }

  return (
    <div
      style={{
        backgroundImage: 'url(/img/apply_bg.png)',
        backgroundSize: '100% 100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <Header classes=" bg-opacity-0 " theme="white" />
      <div className="h-[57px]"></div>

      <div className="flex items-center absolute top-[82px] lg:left-[310px] md:left-[250px]">
        {/* <Button
          height={40}
          type="primary"
          className="hover:shadow-[2px_2px_4px_rgba(100,100,100,0.25)]"
          style={{
            width: 40,
            borderRadius: 40,
            color: 'white',
            fontWeight: 600
          }}
          onClick={() => history.back()}
        >

        </Button> */}
        <div
          onClick={() => history.back()}
          className=" w-14 h-10 text-white font-semibold rounded-full hover:drop-shadow-[2px_2px_4px_rgba(155,155,255,0.3)] cursor-pointer bg-[url(/img/apply_back.png)]  bg-[length:100%_100%]"
        ></div>
        <div className="flex items-center w-full gap-x-5">
          <div className="ml-2 flex items-center">
            <span className=" text-base font-medium pl-2 text-white">
              <FormattedMessage id="mt.fanhuigendan" />
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 overflow-y-scroll no-scrollbar left-0 right-0 top-[92px] w-[623px] mx-auto max-w-full max-h-[1020px] rounded-t-3xl">
        <div
          className="flex flex-col gap-32 justify-between items-center p-6 min-h-full"
          style={{
            background: 'linear-gradient( 180deg, rgba(218,234,255,0.9) 0%, #FFFFFF 25%, #FFFFFF 100%)'
          }}
        >
          <div className=" flex flex-col gap-4.5">
            <div className="flex flex-row items-center gap-4 w-full">
              <img src="/img/shenqingdaidan.svg" width={121} height={121} />
              <div className="flex flex-col gap-2 flex-grow flex-1">
                <span className=" font-bold text-primary text-2xl ">
                  <FormattedMessage id="mt.daidanjiaoyiyuanshenqing" />
                </span>
                <span className=" font-normal text-sm text-gray-600">
                  <FormattedMessage id="mt.liangbuwancheng" />
                </span>
              </div>
            </div>
            {/* 头像 & 名称 */}
            <div className=" flex flex-row items-start gap-6">
              <AvatarUpload />
              <div className="flex flex-col gap-2.5 justify-start">
                <span className=" text-sm font-normal text-primary">
                  <FormattedMessage id="mt.mingcheng" />
                </span>
                <Input
                  size="large"
                  style={{
                    width: '24.5625rem',
                    height: '2.8125rem',
                    lineHeight: '2.8125rem'
                  }}
                  count={{
                    show: true,
                    max: 10
                  }}
                  placeholder={placeholderName}
                />
                <span className=" text-xs font-normal text-gray-500 mt-1">
                  <FormattedMessage id="mt.touxiangdaxiao" />
                </span>
              </div>
            </div>
            {/* 带单账户 */}
            <div className="flex items-center justify-between gap-3 w-[532px] max-w-full">
              <div className="flex flex-col gap-2.5 justify-start w-[198px]">
                <span className=" text-sm font-normal text-primary">
                  <FormattedMessage id="mt.daidanzhanghuleixing" />
                </span>
                <AccountSelect
                  onClick={(item) => console.log(item)}
                  style={{
                    width: 198,
                    minWidth: 198
                  }}
                />
              </div>
              <div className="flex flex-col gap-2.5 justify-start flex-1">
                <span className=" text-sm font-normal text-primary">
                  <FormattedMessage id="mt.daidanzhanghu" />
                </span>
                <Select
                  suffixIcon={null}
                  size="large"
                  labelRender={(item) => (
                    <span className=" flex flex-row gap-2.5 items-center justify-center">
                      <span className="flex flex-row justify-between items-center flex-1">
                        <span>{item.value}</span>

                        <Iconfont name="down" width={20} height={20} color={'var(--color-text-primary)'} />
                      </span>
                      <span className=" w-[1px] h-[11px] bg-gray-260"></span>
                      {/* <span className=" text-sm !font-dingpro-regular"> {item.jine} USD</span> */}
                      <span className=" text-sm !font-dingpro-medium"> 231.3 USD</span>
                    </span>
                  )}
                  placeholder={`${intl.formatMessage({ id: 'mt.qingxuanze' })}${intl.formatMessage({ id: 'mt.daidanzhanghu' })}`}
                  options={accountList.map((item) => ({
                    ...item,
                    value: item.id,
                    label: `${item.name} #${hiddenCenterPartStr(item?.id, 4)}`
                  }))}
                />
              </div>
            </div>
            {/* 介绍 */}
            <div className="flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full">
              <span className=" text-sm font-normal text-primary">
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
            {/* 合约交易证明 */}
            <div className="flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full">
              <span className=" text-sm font-normal text-primary">
                <FormattedMessage id="mt.heyuejiaoyizhengming" />
                <FormattedMessage id="mt.kexuan" />
              </span>
              <Upload>
                <div className="flex items-center justify-center w-[532px] max-w-full">
                  <div className="flex flex-col items-center gap-2 justify-center  bg-cover w-full h-[114px] rounded-xl bg-white border border-gray-250 border-dashed">
                    <Iconfont name="geren-chujin" width={32} height={32} color="#030000" />
                    <FormattedMessage id="mt.shangchuantupianhuotuozhuaifangru" />
                  </div>
                </div>
              </Upload>
              <span className="text-xs font-normal text-gray-500 mt-1">
                <FormattedMessage id="mt.heyuejiaoyizhengmingtishi" />
              </span>
            </div>
          </div>

          <div className="h-20"></div>

          {/* 提交申请 */}
          <div className=" justify-self-end flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full fixed bottom-0 pb-8 pt-2 drop-shadow-sm bg-white">
            <Radio.Group value={read}>
              <Radio onClick={onClickRadio} value={1}>
                <FormattedMessage
                  id="mt.yuedubingtingyu"
                  values={{
                    fuwu: (
                      <span
                        className=" underline underline-offset-1 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('fuwutiaokuan')
                        }}
                      >
                        <FormattedMessage id="mt.fuwutiaokuan" />
                      </span>
                    ),
                    yinsi: (
                      <span
                        className=" underline underline-offset-1 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('zhengceshengming')
                        }}
                      >
                        {SYSTEM_NAME}
                        <FormattedMessage id="mt.yinsizhengceshengming" />
                      </span>
                    )
                  }}
                />
              </Radio>
            </Radio.Group>
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
                <span className=" font-semibold text-base ">
                  <FormattedMessage id="mt.tijiaoshenqing" />
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
