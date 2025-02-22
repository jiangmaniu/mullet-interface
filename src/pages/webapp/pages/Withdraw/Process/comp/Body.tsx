import './index.less'

import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react'

import { stores } from '@/context/mobxProvider'

import { useTheme } from '@/context/themeProvider'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'
import Step1 from './Step1'

const Notice = observer(({ methodId }: { methodId: string }) => {
  const methodInfo = stores.wallet.withdrawalMethods.find((item) => item.id === methodId)
  return (
    <div className="text-secondary text-xs">
      {methodInfo?.notice ? (
        <p className="leading-7" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
      ) : (
        <div className="text-xs text-gray-400">
          <FormattedMessage id="mt.zanwuneirong" />
        </div>
      )}
    </div>
  )
})

const WithdrawalProcess = forwardRef(({ onSuccess, onDisabledChange }: WebviewComponentProps, ref) => {
  const { theme } = useTheme()
  const [form] = Form.useForm()

  const methods = stores.wallet.withdrawalMethods
  const intl = useIntl()

  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求
  useLayoutEffect(() => {
    if (methods.length === 0 || prevIntl !== intl.locale) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })
      setPrevIntl(intl.locale)
      return
    }
  }, [methods, intl])

  const methodId = Form.useWatch('methodId', form)
  const fromAccountId = Form.useWatch('fromAccountId', form)
  const amount = Form.useWatch('amount', form)
  const actualAmount = Form.useWatch('actualAmount', form)

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号
  const fromAccountInfo = useMemo(() => {
    return accountList.find((item) => item.id === fromAccountId)
  }, [fromAccountId, accountList])

  const [step, setStep] = useState(0)

  // const [values, setValues] = useState<Record<string, any> | undefined>(undefined)
  const handleSubmit0 = async () => {
    form
      .validateFields()
      .then((values) => {
        onSuccess?.(values)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const [loading, setLoading] = useState(false)

  const methodInfo = useMemo(() => methods.find((item) => item.id === methodId), [methodId, methods])

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit0
  }))

  const [valid, setValid] = useState(false)
  useEffect(() => {
    amount &&
      form
        .validateFields(['amount'])
        .then((values) => {
          setValid(true)
        })
        .catch((err) => {
          setValid(false)
        })
  }, [amount])

  const disabled = !amount || !actualAmount || Number(actualAmount) <= 0 || loading || !valid

  useEffect(() => {
    if (disabled) {
      onDisabledChange?.(true)
    } else {
      onDisabledChange?.(false)
    }
  }, [disabled])

  return (
    <BasicLayout bgColor="primary" headerColor={theme.colors.backgroundColor.primary}>
      <div className="px-[14px]">
        <div className=" font-bold text-xl pl-2.5 pb-6 pt-2.5">{intl.formatMessage({ id: 'mt.chujin' })}</div>
        {loading && (
          <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
            <PageLoading />
          </div>
        )}
        <Step1
          form={form}
          loading={loading}
          currentUser={currentUser}
          fromAccountInfo={fromAccountInfo}
          handleSubmit={handleSubmit0}
          methodInfo={methodInfo}
        />
      </div>
      <div className="flex flex-col justify-start items-start gap-4 pt-2.5 px-[14px] mt-4 border-t border-[#f0f0f0]">
        <div className="text-primary text-sm font-semibold">
          <FormattedMessage id="mt.chujinxuzhi" />
        </div>
        <div className="text-secondary text-xs">
          {methodInfo?.notice ? (
            <p className="leading-7" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
          ) : (
            <div className="text-xs text-gray-400">
              <FormattedMessage id="mt.zanwuneirong" />
            </div>
          )}
        </div>
      </div>
    </BasicLayout>
  )
})

export default observer(WithdrawalProcess)
