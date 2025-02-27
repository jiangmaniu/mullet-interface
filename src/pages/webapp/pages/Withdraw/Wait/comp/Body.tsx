import { useIntl, useParams } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useLayoutEffect, useState } from 'react'

import { stores } from '@/context/mobxProvider'

import { useTheme } from '@/context/themeProvider'
import { getWithdrawalOrderDetail } from '@/services/api/wallet'
import { colorToRGBA } from '@/utils/color'
import classNames from 'classnames'
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
  const [loading, setLoading] = useState(false)

  const disabled = !amount || !actualAmount || Number(actualAmount) <= 0 || loading

  useEffect(() => {
    if (disabled) {
      onDisabledChange?.(true)
    } else {
      onDisabledChange?.(false)
    }
  }, [disabled])

  const params = useParams()
  const id = params?.id as string

  const [paymentInfo, setPaymentInfo] = useState<any>({})

  useLayoutEffect(() => {
    if (id) {
      // 请求接口得到 paymentInfo
      getWithdrawalOrderDetail({ id }).then((res) => {
        if (res.success) {
          setPaymentInfo(res.data)
        }
      })
    }
  }, [id])

  return (
    <div className="bg-secondary">
      <div className="bg-white w-full flex-1 flex flex-col items-center rounded-t-3xl px-[14px] text-center">
        <img src={`/img/chujin-usd.png`} className="w-[168px] h-[168px] mx-auto mt-[64px]" />
        {/* <div className=" text-[42px] leading-[46px] text-primary font-dingpro-medium mt-1">
          {formatNum(paymentInfo?.baseOrderAmount || 1000)}
          &nbsp; {paymentInfo?.currency || 'USD'}
        </div> */}
        <div className=" text-sm font-normal mt-1">{intl.formatMessage({ id: 'mt.chujindengdai' })}</div>
        <div className=" text-[22px] leading-[32px] text-primary  mt-4">
          {intl.formatMessage({ id: 'mt.nindejiaoyizhengzaichulizhong2' })}
        </div>
        <div className=" text-base text-secondary mt-[3px]">{intl.formatMessage({ id: 'mt.chujinshenqingchenggong' })}</div>
        <div
          className={classNames(['py-[6px] px-[7px] rounded border border-1  text-sm mt-[22px]'])}
          style={{
            backgroundColor: colorToRGBA('#183EFC', 0.1),
            borderColor: colorToRGBA('#183EFC', 0.2),
            color: '#183EFC'
          }}
        >
          {intl.formatMessage({ id: 'mt.zijinyujiliangxiaoshineidaoda' })}
        </div>
      </div>
    </div>
  )
})

export default observer(WithdrawalWait)
