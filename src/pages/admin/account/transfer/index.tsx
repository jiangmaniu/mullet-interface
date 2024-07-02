import { ArrowRightOutlined } from '@ant-design/icons'
import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel, useSearchParams } from '@umijs/max'
import { Button, Form } from 'antd'
import { observer } from 'mobx-react'
import { useState } from 'react'

import ProFormDigit from '@/components/Admin/Form/ProFormDigit'
import PageContainer from '@/components/Admin/PageContainer'
import Hidden from '@/components/Base/Hidden'
import { useStores } from '@/context/mobxProvider'
import { transferAccount } from '@/services/api/tradeCore/account'
import { formatNum, hiddenCenterPartStr } from '@/utils'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import TransferFromFormSelectItem from './comp/TransferFromFormSelectItem'
import TransferToFormSelectItem from './comp/TransferToFormSelectItem'

function TransferAccount() {
  let [searchParams, setSearchParams] = useSearchParams()
  const fromAccount = searchParams.get('from') // 转出账号
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')
  const { fetchUserInfo } = useModel('user')
  const { trade } = useStores()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'ONE' | 'TWO' | 'THREE'>('ONE') // 步骤

  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const fromAccountId = Form.useWatch('fromAccountId', form) // 转出
  const toAccountId = Form.useWatch('toAccountId', form) // 转入
  const money = Form.useWatch('money', form) // 金额
  const fromAccountInfo = accountList.find((item) => item.id === fromAccountId) // 转出账号信息
  const toAccountInfo = accountList.find((item) => item.id === toAccountId) // 转入账号信息

  const handleSubmit = async () => {
    const values = form.getFieldsValue()
    setLoading(true)
    const res = await transferAccount(values)
    setLoading(false)

    if (res.success) {
      setStep('THREE')
      message.info(intl.formatMessage({ id: 'common.opSuccess' }))

      // 刷新用户信息
      fetchUserInfo()
    }
  }

  const listData = [
    {
      leftLabel: <FormattedMessage id="mt.zhifufangshi" />,
      rightText: (
        <div className="flex items-center">
          <img src="/img/zhuanzhang-icon.png" width={18} height={18} />
          <span className="text-gray text-sm font-semibold pl-[6px]">
            <FormattedMessage id="mt.zichizhanghujianzhuanzhang" />
          </span>
        </div>
      )
    },
    {
      leftLabel: <FormattedMessage id="mt.zhuanruzhanghao" />,
      rightText: (
        <div className="flex items-center">
          <div className="flex items-center justify-center rounded bg-gray text-white text-xs py-[2px] px-2">SX</div>
          <div className="pl-[10px] text-sm text-gray font-semibold">{hiddenCenterPartStr(toAccountId, 4)}</div>
        </div>
      )
    },
    {
      leftLabel: <FormattedMessage id="mt.zhuanchuzhanghao" />,
      rightText: (
        <div className="flex items-center">
          <div className="flex items-center justify-center rounded bg-gray text-white text-xs py-[2px] px-2">SX</div>
          <div className="pl-[10px] text-sm text-gray font-semibold">{hiddenCenterPartStr(fromAccountId, 4)}</div>
        </div>
      )
    },
    {
      leftLabel: <FormattedMessage id="mt.jine" />,
      rightText: <div className="text-sm text-gray !font-dingpro-medium">{formatNum(money)} USD</div>
    },
    {
      leftLabel: <FormattedMessage id="mt.shouxufei" />,
      rightText: (
        <div className="text-sm text-gray font-semibold">
          <FormattedMessage id="mt.mianshouxufei" />
        </div>
      )
    }
  ]

  return (
    <PageContainer
      pageBgColorMode="gray"
      backTitle={<FormattedMessage id="mt.gerenzhongxin" />}
      backStyle={{ justifyContent: 'flex-start' }}
    >
      <div className="flex justify-center">
        <div className="w-[552px] bg-white rounded-xl border border-gray-180">
          <div className="px-8 py-6">
            <div className="text-gray text-[22px] font-bold pb-5">
              {['ONE', 'TWO'].includes(step) && <FormattedMessage id="mt.zhuanzhang" />}
              {['THREE'].includes(step) && <FormattedMessage id="mt.zhuanzhangjieguo" />}
            </div>
            <Hidden show={step === 'ONE'}>
              <ProForm
                onFinish={async (values: Account.TransferAccountParams) => {
                  console.log('values', values)
                  setStep('TWO')

                  return
                }}
                submitter={false}
                layout="vertical"
                form={form}
              >
                <div>
                  {/* 转出 */}
                  <div className="mb-6">
                    <TransferFromFormSelectItem form={form} />
                  </div>
                  <div className="flex items-center justify-center">
                    <img src="/img/transfer-arrow-down.png" width={29} height={29} />
                  </div>
                  {/* 转入 */}
                  <div className="mb-6 mt-1">
                    <TransferToFormSelectItem form={form} />
                  </div>
                </div>
                <ProFormDigit
                  name="money"
                  label={
                    <span className="text-sm text-gray font-medium">
                      <FormattedMessage id="mt.jine" />
                    </span>
                  }
                  placeholder={intl.formatMessage({ id: 'mt.qingshuruyue' })}
                  fieldProps={{
                    size: 'large',
                    style: { height: 42 },
                    maxLength: 8,
                    autoFocus: false,
                    precision: 2,
                    suffix: 'USD',
                    controls: false
                  }}
                  rules={[
                    {
                      required: true,
                      validator(rule, value, callback) {
                        if (!value) {
                          return Promise.reject(intl.formatMessage({ id: 'mt.qingshuruyue' }))
                        } else if (value && value > Number(fromAccountInfo?.money || 0)) {
                          return Promise.reject(intl.formatMessage({ id: 'mt.yuebuzu' }))
                        } else {
                          return Promise.resolve()
                        }
                      }
                    }
                  ]}
                  colProps={{ span: 12 }}
                />
                <Button type="primary" style={{ height: 46, marginTop: 38 }} block htmlType="submit">
                  <FormattedMessage id="mt.huazhuan" />
                  <ArrowRightOutlined />
                </Button>
              </ProForm>
            </Hidden>
            <Hidden show={step === 'TWO'}>
              <div>
                {listData.map((item, idx) => (
                  <div className="mb-6 flex flex-wrap items-center justify-between text-gray-weak" key={idx}>
                    <span className="text-gray">{item.leftLabel}</span>
                    <span className="my-0 ml-[18px] mr-[23px] h-[1px] flex-1 border-t-[1px] border-dashed border-gray-250"></span>
                    <div className="flex max-w-[240px] break-all text-right">{item.rightText}</div>
                  </div>
                ))}
                <div className="mt-10">
                  <div className="bg-gray-50 rounded-[10px] py-[22px] px-4 flex items-center justify-between">
                    <span className="text-sm text-gray-secondary">
                      <FormattedMessage id="mt.daichujinjine" />
                    </span>
                    <span className="text-xl text-gray !font-dingpro-medium">{formatNum(money)} USD</span>
                  </div>
                  <Button
                    type="primary"
                    style={{ height: 46, marginTop: 34 }}
                    block
                    onClick={() => {
                      handleSubmit()
                    }}
                    loading={loading}
                  >
                    <FormattedMessage id="common.queren" />
                  </Button>
                </div>
              </div>
            </Hidden>
            <Hidden show={step === 'THREE'}>
              <div>
                <div className="mt-3 flex items-center flex-col justify-center">
                  <img src="/img/transfer-success.png" width={56} height={56} />
                  <div className="text-[22px] text-gray font-semibold my-[14px]">
                    <FormattedMessage id="mt.nindezijinjijiangdaozhang" />
                  </div>
                  <div className="text-base text-gray-secondary">
                    <FormattedMessage id="mt.jiaoyiyichuliwancheng" />
                  </div>
                </div>
                <Button
                  type="primary"
                  style={{ height: 46, marginTop: 70 }}
                  block
                  onClick={() => {
                    push('/account')

                    setTimeout(() => {
                      setStep('ONE')
                    }, 200)
                  }}
                >
                  <FormattedMessage id="mt.lijichakan" />
                </Button>
              </div>
            </Hidden>
          </div>
        </div>
      </div>
      <div className="mt-[70px]">
        <div className="text-gray text-sm pb-4 font-semibold">
          <FormattedMessage id="mt.zhuanzhangxuzhi" />
        </div>
        <div className="text-xs text-gray-secondary leading-6">
          <div>
            <FormattedMessage id="mt.zhuanzhangtip1" />
          </div>
          <div>
            <FormattedMessage id="mt.zhuanzhangtip2" />
          </div>
          <div>
            <FormattedMessage id="mt.zhuanzhangtip3" />
          </div>
          <div>
            <FormattedMessage id="mt.zhuanzhangtip4" />
          </div>
          <div>
            <FormattedMessage id="mt.zhuanzhangtip5" />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default observer(TransferAccount)
