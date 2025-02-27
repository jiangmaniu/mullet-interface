import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, getIntl, useIntl } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { stores } from '@/context/mobxProvider'

import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { useTheme } from '@/context/themeProvider'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { generateWithdrawOrder } from '@/services/api/wallet'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'
import { replace } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { md5 } from 'js-md5'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'
import SecurityCertificationModal from './SecurityCertificationModal'
import Step2 from './Step2'

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

const WithdrawalPreview = forwardRef(({ onDisabledChange }: WebviewComponentProps, ref) => {
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
  const symbol = Form.useWatch('symbol', form)
  const currency = Form.useWatch('currency', form)
  const exchangeRate = Form.useWatch('exchangeRate', form)

  const [step, setStep] = useState(0)

  const securityCertificationModalRef = useRef<ModalRef>(null)
  const handleSubmit0 = async () => {
    // 1. 打開安全驗證
    securityCertificationModalRef.current?.show()

    // form
    //   .validateFields()
    //   .then((values) => {
    //     onSuccess?.(values)
    //   })
    //   .catch((err) => {
    //     console.log('err', err)
    //   })
  }

  const [loading, setLoading] = useState(false)

  const methodInfo = useMemo(() => methods.find((item) => item.id === methodId), [methodId, methods])

  useImperativeHandle(ref, () => ({
    onSubmit: handleSubmit0
  }))

  const disabled = !amount || !actualAmount || Number(actualAmount) <= 0 || loading

  useEffect(() => {
    if (disabled) {
      onDisabledChange?.(true)
    } else {
      onDisabledChange?.(false)
    }
  }, [disabled])

  const handleSubmit1 = async (params: any) => {
    console.log('params', params)

    if (!params.password || !params.code) {
      message.info(getIntl().formatMessage({ id: 'mt.qingshuruzhanghaomimayanzhengma' }))
      return
    }

    form
      .validateFields()
      .then((values) => {
        setLoading(true)

        generateWithdrawOrder({
          address: values.toAccountId,
          bankName: values.bankName,
          bankCard: values.bankCard,
          baseOrderAmount: values.amount,
          channelId: values.methodId,
          password: md5(params.password),
          phoneCode: params.code,
          tradeAccountId: values.fromAccountId
        })
          .then((res) => {
            if (res.success) {
              replace(appendHideParamIfNeeded(`/app/withdraw/wait/${res.data.id}`))
            } else {
              message.info(res.data.msg)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  return (
    <div className="bg-gray-55">
      <div className="flex flex-col gap-1 items-center pt-9">
        <span className=" text-sm font-normal">
          <FormattedMessage id="mt.shijidaozhang" />
        </span>
        <span className=" text-[42px] leading-[46px] font-dingpro-medium">
          {formatNum(actualAmount, { precision: DEFAULT_CURRENCY_DECIMAL })}&nbsp;{symbol}
        </span>
        <span className=" text-sm font-medium mt-1">
          <FormattedMessage id="mt.tixianjine" />
          &nbsp;{formatNum(amount, { precision: DEFAULT_CURRENCY_DECIMAL })}&nbsp;{currency}
        </span>
      </div>
      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
          <PageLoading />
        </div>
      )}

      <Step2 form={form} loading={loading} methodInfo={methodInfo} />

      <div className="flex flex-col justify-start items-start gap-4 flex-1 pt-2.5 px-[14px] mt-1.5 border-t border-[#f0f0f0] bg-white">
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
      <SecurityCertificationModal ref={securityCertificationModalRef} onSubmit={handleSubmit1} />
    </div>
  )
})

export default observer(WithdrawalPreview)
