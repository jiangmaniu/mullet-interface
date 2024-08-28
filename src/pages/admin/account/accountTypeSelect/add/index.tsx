import { ArrowRightOutlined } from '@ant-design/icons'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel, useParams, useSearchParams } from '@umijs/max'
import { Button, Form } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { useStores } from '@/context/mobxProvider'
import { AddAccount } from '@/services/api/tradeCore/account'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

function AddAccountComp() {
  const { global, trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')
  const pwdTipsRef = useRef<any>()
  const loadingRef = useRef<any>()
  const [form] = Form.useForm()

  const currentUser = initialState?.currentUser

  const accountList = trade.accountGroupList
  const params = useParams()
  const accountGroupId = params?.accountId as string
  const currentAccount = (accountList.find((item) => item?.id === accountGroupId) || {}) as AccountGroup.AccountGroupItem
  const password = Form.useWatch('password', form)

  const [searchParams] = useSearchParams()
  const searchKey = searchParams.get('key') || ''

  useEffect(() => {
    if (!accountList.length) {
      trade.getAccountGroupList()
    }
  }, [])

  return (
    <PageContainer
      pageBgColorMode="gray"
      backTitle={<FormattedMessage id="mt.chuangjianxinzhanghu" />}
      backUrl="/account/type"
      backStyle={{ justifyContent: 'flex-start' }}
    >
      <div className="flex justify-center">
        <div className="w-[552px] bg-white rounded-xl border border-gray-180">
          <div className="border-[0.5px] border-gray-250 rounded-lg m-7">
            <div
              className="border-b border-gray-180 rounded-lg"
              style={{ background: 'linear-gradient(180deg, #DCECFF 0%, #FFFFFF 100%)' }}
            >
              <div className="px-7 py-3">
                <div className="text-primary font-semibold text-[20px] pb-2 truncate">
                  {currentAccount.synopsis?.name || currentAccount?.groupName}
                </div>
                <div className="text-secondary text-sm line-clamp-3">{currentAccount.synopsis?.remark}</div>
              </div>
            </div>
            <div className="h-[90px] px-7 py-3">
              <div className="flex items-center justify-between">
                {(currentAccount.synopsis?.list || []).slice(0, 3).map((v, index) => (
                  <div className="flex flex-col" key={index}>
                    <div className="text-primary text-lg font-semibold pb-[7px]">{v.content}</div>
                    <div className="text-primary text-sm">{v.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mx-8 mb-8">
            <ProForm
              onFinish={async (values: Account.SubmitAccount) => {
                // console.log('values', values)

                loadingRef?.current?.show()
                const res = await AddAccount({ accountGroupId, clientId: currentUser?.user_id, ...values })
                // 刷新用户信息
                fetchUserInfo(false)

                if (res.success) {
                  setTimeout(() => {
                    loadingRef?.current?.close()
                    message.info(intl.formatMessage({ id: 'mt.chuangjianchanghuchenggong' }))
                    push(`/account?key=${searchKey}`)
                  }, 5000)
                } else {
                  loadingRef?.current?.close()
                }
                return
              }}
              submitter={false}
              layout="vertical"
            >
              <ProFormText
                name="name"
                label={intl.formatMessage({ id: 'mt.shezhizhanghumingcheng' })}
                placeholder={intl.formatMessage({ id: 'mt.shuruzhanghumingcheng' })}
                required
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'mt.shuruzhanghumingcheng' })
                  }
                ]}
                fieldProps={{
                  size: 'large',
                  style: { height: 42 },
                  maxLength: 20,
                  showCount: true
                }}
              />
              {/* @TODO 接口暂时不支持 */}
              {/* <ProFormText.Password
                name="password"
                required
                label={intl.formatMessage({ id: 'mt.shezhizhanghumima' })}
                placeholder={intl.formatMessage({ id: 'mt.shuruzhanghumima' })}
                fieldProps={{
                  size: 'large',
                  style: { height: 42 },
                  onFocus: () => {
                    pwdTipsRef?.current?.show()
                  },
                  onBlur: () => {
                    pwdTipsRef?.current?.hide()
                  }
                }}
                formItemProps={{
                  className: '!mt-5'
                }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' }),
                    pattern: regPassword
                  }
                ]}
              />
              <div className="mt-5">
                <PwdTips pwd={password} ref={pwdTipsRef} />
              </div> */}

              <Button type="primary" style={{ height: 46, marginTop: 38 }} block htmlType="submit">
                <FormattedMessage id="mt.kailixinzhanghu" />
                <ArrowRightOutlined />
              </Button>
            </ProForm>
          </div>
        </div>
      </div>
      <ModalLoading ref={loadingRef} />
    </PageContainer>
  )
}

export default observer(AddAccountComp)
