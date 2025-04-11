import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl, useModel } from '@umijs/max'
import { Form, Radio, UploadFile } from 'antd'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'

import Header from '@/components/Admin/Header'
import Button from '@/components/Base/Button'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { addTraadeFollowLead } from '@/services/api/tradeFollow/lead'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'

import { getEnv } from '@/env'
import { validateNonEmptyFields } from '@/utils/form'
import { AvatarUpload } from './AvatarUpload'
import ContractUpload from './ContractUpload'

// 申请成为带单员
export default function Apply() {
  const ENV = getEnv()
  const intl = useIntl()
  const placeholderName = intl.formatMessage({
    id: 'mt.mingcheng'
  })

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  const { trade } = useStores()

  // 账户类型/交易账户组
  const accountTypes = useMemo(() => {
    const temp = [] as number[]

    return currentUser?.accountList?.reduce((acc, item) => {
      if (item.accountGroupId && !temp.includes(item.accountGroupId)) {
        temp.push(item.accountGroupId)

        acc.push({
          label: item.groupName,
          value: item.accountGroupId
        })
      }
      return acc
    }, [] as any[])
  }, [currentUser])

  // useEffect(() => {
  //   console.log(accountList)
  //   console.log(accountList.map((i) => ({ id: i.id, accountGroupId: i.accountGroupId, groupName: i.groupName, clientId: i.clientId })))
  // }, [accountList])

  const [read, setRead] = useState<number | undefined>(1)

  const onClickRadio = () => {
    read === 1 ? setRead(undefined) : setRead(1)
  }

  const [form] = Form.useForm()
  const accountGroupId = Form.useWatch('accountGroupId', form) // 转入
  const tradeAccountId = Form.useWatch('tradeAccountId', form) // 转入
  const contractProof = Form.useWatch('contractProof', form)

  // 選中賬戶的餘額
  const money = useMemo(() => {
    const item = accountList.find((item) => item.id === tradeAccountId)
    return item?.money || 0
  }, [tradeAccountId])

  // 客戶端 ID
  // const clientId = useMemo(() => {
  //   const item = accountList.find((item) => item.id === tradeAccountId)
  //   return item?.clientId || 0
  // }, [tradeAccountId])

  // 選擇賬戶組後，可選的賬戶列表
  const accounts = useMemo(() => {
    return accountList
      .filter((i) => i.accountGroupId === accountGroupId)
      .map((item) => ({
        ...item,
        money: item.money,
        value: item.id,
        label: `${item.name} #${item?.id}`
      }))
  }, [accountGroupId])

  useEffect(() => {
    if (trade.currentAccountInfo && accountGroupId === trade.currentAccountInfo?.accountGroupId) {
      // 如果分组 = 当前选择账号分组，则选中当前账号
      form.setFieldValue('clientId', trade.currentAccountInfo?.clientId)
    } else {
      // 默認選中第一個
      form.setFieldValue('clientId', accounts.find((item) => item.id)?.clientId || '')
      form.setFieldValue('tradeAccountId', accounts.find((item) => item.id)?.id || '')
    }
  }, [accounts])

  // const [money, setMoney] = useState<number | undefined>()

  const [openAccountGroup, setOpenAccountGroup] = useState(false)

  const formDefault = useMemo(
    () => ({
      accountGroupId: trade.currentAccountInfo?.accountGroupId,
      contractProof: '',
      desc: '',
      projectName: '',
      tradeAccountId: trade.currentAccountInfo?.id,
      clientId: trade.currentAccountInfo?.clientId,
      imageUrl: 'https://img.alicdn.com/imgextra/i4/O1CN01KX0dQk1vQZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0ZzZ0Zz'
    }),
    [trade.currentAccountInfo]
  )

  const onAvatarChange = (p: any) => {
    form.setFieldValue('imageUrl', p.link)
    form.validateFields(['imageUrl'])
  }

  const maxCount = 3
  const onContractChange = (list: UploadFile[]) => {
    form.setFieldValue('contractProof', list?.map((i) => i.url).join(','))
    form.validateFields(['contractProof'])
  }

  const onFinish = async (values: any) => {
    console.log('onFinish')
    addTraadeFollowLead({
      ...formDefault,
      ...values
    })
      .then((res) => {
        // form.setFieldsValue(formDefault) // 重置
        if (res.success) {
          message.info(getIntl().formatMessage({ id: 'common.opSuccess' }))
        }
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
    return false
  }

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

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
      </div>{' '}
      <ProForm onFinish={onFinish} submitter={false} form={form}>
        <div className="absolute bottom-0 overflow-y-scroll no-scrollbar left-0 right-0 top-[92px] w-[623px] mx-auto max-w-full  rounded-t-3xl">
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
                <div className="hide-form-item">
                  <AvatarUpload onChange={onAvatarChange} />
                  <ProFormText
                    name="imageUrl"
                    // TODO: 取消注释
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: intl.formatMessage({ id: 'mt.qingshangchuantouxiang' })
                    //   }
                    // ]}
                  />
                </div>
                <div className="flex flex-col gap-2.5 justify-start">
                  <span className=" text-sm font-normal text-primary">
                    <FormattedMessage id="mt.mingcheng" />
                  </span>
                  <ProFormText
                    name="projectName"
                    allowClear={false}
                    width={393}
                    fieldProps={{
                      size: 'large',
                      style: {
                        height: 42
                      },
                      count: {
                        show: true,
                        max: 10
                      },
                      placeholder: placeholderName
                    }}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'common.qingshuru' })
                      },
                      {
                        pattern: /^.{1,10}$/,
                        message: intl.formatMessage({ id: 'mt.qingxianzhizaishigezifuyinei' })
                      }
                    ]}
                  />
                  <span className=" text-xs font-normal text-gray-500 mt-1">
                    <FormattedMessage id="mt.touxiangdaxiao" />
                  </span>
                </div>
              </div>
              {/* 带单账户 */}
              <div className="flex items-start justify-between gap-3 w-[532px] max-w-full">
                <div className="flex flex-col gap-2.5 justify-start w-[198px]">
                  <span className=" text-sm font-normal text-primary">
                    <FormattedMessage id="mt.daidanzhanghuleixing" />
                  </span>
                  <ProFormSelect
                    name="accountGroupId"
                    placeholder={intl.formatMessage({ id: 'mt.xuanzezhuanruzhanghao' })}
                    // suffixIcon={null}
                    // size="large"
                    options={accountTypes}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'common.qingxuanze' })
                      }
                    ]}
                    fieldProps={{
                      style: {
                        height: 42
                      },
                      open: openAccountGroup,
                      onDropdownVisibleChange: (visible) => setOpenAccountGroup(visible),
                      suffixIcon: <SelectSuffixIcon opacity={0.5} />,
                      showSearch: false,
                      labelRender: (val) => {
                        return (
                          <span className=" flex flex-row  items-center justify-between max-w-full ">
                            <span className="flex flex-row justify-between items-center flex-1">
                              <span className="flex flex-row justify-between items-center gap-1.5 ">
                                {/* <AccountTag type="meifen" /> */}
                                <span className=" text-sm !font-dingpro-medium">{val.label}</span>
                              </span>
                            </span>
                            {/* <div className="flex items-center gap-1">
                              <Iconfont name="down" width={20} height={20} color={colorTextPrimary['900']} />
                            </div> */}
                          </span>
                        )
                      },
                      optionRender: (item) => {
                        return (
                          <span className={classNames('flex flex-row  items-center justify-between max-w-full ')}>
                            <span className="flex flex-row justify-between items-center flex-1">
                              <span className="flex flex-row justify-between items-center gap-1.5 ">
                                {/* <AccountTag type="meifen" /> */}
                                <span className=" text-sm !font-dingpro-medium">{item.label}</span>
                              </span>
                            </span>
                            {/* <div className="flex items-center gap-1">
                              <Iconfont name="down" width={20} height={20} color={colorTextPrimary['900']} />
                            </div> */}
                          </span>
                        )
                      },
                      // 回填到选择框的 Option 的属性值，默认是 Option 的子元素
                      optionLabelProp: 'label'
                    }}
                  ></ProFormSelect>
                  {/* <AccountSelect
                  onClick={(item) => console.log(item)}
                  style={{
                    width: 198,
                    minWidth: 198
                  }}
                /> */}
                </div>
                <div className="flex flex-col gap-2.5 justify-start flex-1">
                  <span className=" text-sm font-normal text-primary">
                    <FormattedMessage id="mt.daidanzhanghu" />
                  </span>
                  <ProFormSelect
                    name="tradeAccountId"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'common.qingxuanze' })
                      }
                    ]}
                    fieldProps={{
                      style: {
                        height: 42
                      },
                      suffixIcon: (
                        <div className="flex items-center gap-1">
                          <span className=" w-[1px] h-[11px] bg-gray-260"></span>
                          <span className=" text-primary text-sm !font-dingpro-medium">
                            {formatNum(money, { precision: 2 })} {SOURCE_CURRENCY}
                          </span>
                        </div>
                      ),
                      labelRender: (val) => {
                        const item = accountList.find((item) => item.id === val.value)

                        return (
                          <>
                            {item && (
                              <span className=" flex flex-row  items-center justify-between">
                                <span className="flex flex-row justify-between items-center flex-1">
                                  <span className="flex flex-row justify-between items-center gap-1.5 ">
                                    {/* <AccountTag type="meifen" /> */}
                                    <span>{item.id}</span>
                                  </span>
                                  <span className=" w-5 h-5"></span>
                                </span>
                              </span>
                            )}
                          </>
                        )
                      },
                      optionRender: (option) => {
                        const item = option?.data || {}

                        return (
                          <span className=" flex flex-row  items-center justify-between">
                            <span className="flex flex-row justify-between items-center flex-1">
                              <span className="flex flex-row justify-between items-center gap-1.5 ">
                                {/* <AccountTag type="meifen" /> */}
                                <span>{item.id}</span>
                              </span>
                              <span className=" w-5 h-5"></span>
                            </span>
                            <div className="flex items-center gap-1">
                              <span className=" w-[1px] h-[11px] bg-gray-260"></span>
                              <span className=" text-sm !font-dingpro-medium">
                                {!Number(item.money) ? '0.00' : formatNum(item.money, { precision: 2 })} {SOURCE_CURRENCY}
                              </span>
                            </div>
                          </span>
                        )
                      }
                    }}
                    placeholder={`${intl.formatMessage({ id: 'common.qingxuanze' })}${intl.formatMessage({ id: 'mt.daidanzhanghu' })}`}
                    // options={accountList}
                    options={accounts}
                  />
                </div>
              </div>
              {/* 介绍 */}
              <div className="flex flex-col  justify-between gap-2.5 w-[532px] max-w-full">
                <span className=" text-sm font-normal text-primary">
                  <FormattedMessage id="mt.jieshao" />
                </span>
                <ProFormTextArea
                  name="desc"
                  fieldProps={{
                    rows: 4,
                    maxLength: 200,
                    count: {
                      show: true,
                      max: 200
                    }
                  }}
                />
              </div>
              {/* 合约交易证明 */}
              {/* <ProFormUploadButton max={1} ></ProFormUploadButton> */}
              <div className=" hide-form-item flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full">
                <span className=" text-sm font-normal text-primary">
                  <FormattedMessage id="mt.heyuejiaoyizhengming" />
                  <FormattedMessage id="mt.kexuan" />
                </span>
                <ContractUpload onChange={(p) => onContractChange(p)} maxCount={maxCount} />
                <ProFormText name="contractProof" />
                <span className="text-xs font-normal text-gray-500 mt-1">
                  <FormattedMessage id="mt.heyuejiaoyizhengmingtishi" values={{ name: ENV.name }} />
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
                          {ENV.name}
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
                // onClick={onFinish}
                htmlType="submit"
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
      </ProForm>
    </div>
  )
}
