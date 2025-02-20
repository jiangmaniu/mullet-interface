import { useIntl } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { stores } from '@/context/mobxProvider'

import { useTheme } from '@/context/themeProvider'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { generateWithdrawOrder } from '@/services/api/wallet'
import { message } from '@/utils/message'
import { md5 } from 'js-md5'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'

const WithdrawalWait = forwardRef(({ onSuccess, onDisabledChange }: WebviewComponentProps, ref) => {
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
      message.info('请输入密码和验证码')
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
            } else {
              message.info(res.message)
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

  return <div className="bg-white"></div>
})

export default observer(WithdrawalWait)
