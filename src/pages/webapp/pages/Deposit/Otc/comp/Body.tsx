import { FormattedMessage, useIntl, useParams, useSearchParams } from '@umijs/max'
import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { stores } from '@/context/mobxProvider'

import { DEFAULT_CURRENCY_DECIMAL } from '@/constants'
import { getDepositOrderDetail } from '@/services/api/wallet'
import { formatNum } from '@/utils'
import { depositExchangeRate } from '@/utils/deposit'
import { replace } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { observer } from 'mobx-react'
import { WebviewComponentProps } from '../../WebviewPage'
import CancelModal from './CancelModal'
import ConfirmModal from './ConfirmModal'
import Step2 from './Step2'
import { Timer } from './Timer'
import UploadModal from './UploadModal'

const Notice = observer(({ methodId }: { methodId: string }) => {
  const methodInfo = stores.wallet.depositMethods.find((item) => item.id === methodId)
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

const DepositOtc = forwardRef(({ onDisabledChange }: WebviewComponentProps, ref) => {
  const [paymentInfo, setPaymentInfo] = useState<Wallet.GenerateDepositOrderDetailResult>({})

  const methods = stores.wallet.depositMethods
  const intl = useIntl()

  const depositMethodInitialized = stores.wallet.depositMethodInitialized
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

  useLayoutEffect(() => {
    const now = Date.now().valueOf()
    if (prevIntl !== intl.locale || now - depositMethodInitialized > 1000 * 30) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getDepositMethods({ language })

      setPrevIntl(intl.locale)
      return
    }
  }, [depositMethodInitialized, intl.locale])

  const methodInfo = useMemo(() => methods.find((item) => item.id === paymentInfo?.channelId), [paymentInfo, methods])

  const params = useParams()
  const id = params?.id as string

  useLayoutEffect(() => {
    if (id) {
      // 请求接口得到 paymentInfo
      getDepositOrderDetail({ id }).then((res) => {
        if (res.success) {
          setPaymentInfo(res.data || {})
        }
      })
    }
  }, [id])

  const confirmModalRef = useRef<any>()
  const handleTimeout = () => {
    confirmModalRef.current?.show()
  }

  const uploadModalRef = useRef<any>()

  const onUpload = async () => {
    uploadModalRef.current?.show()
  }

  const cancelModalRef = useRef<any>()

  const onCancel = async () => {
    cancelModalRef.current?.show()
  }

  const [query] = useSearchParams()

  const backUrl = query.get('backUrl') as string

  const handleReset = () => {
    if (backUrl) {
      replace(appendHideParamIfNeeded(backUrl))
    } else {
      replace(appendHideParamIfNeeded('/app/deposit'))
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit: () => {},
    onUpload,
    onCancel
  }))

  return (
    <div className="bg-gray-55 overflow-y-auto h-full">
      <div className="flex flex-col gap-1 items-center pt-9">
        <span className=" text-sm font-normal">
          <FormattedMessage id="mt.daizhifujine" />
        </span>
        <span className=" text-[42px] leading-[46px] font-dingpro-medium">
          {formatNum(paymentInfo?.receiptAmount, { precision: DEFAULT_CURRENCY_DECIMAL })}&nbsp;
          {paymentInfo?.symbol}
        </span>
        <span className=" text-sm font-medium mt-1">
          {/* <FormattedMessage id="mt.shijidaozhang" /> */}
          &nbsp;{formatNum(paymentInfo?.baseOrderAmount, { precision: DEFAULT_CURRENCY_DECIMAL })}&nbsp;{paymentInfo?.baseCurrency}
        </span>
      </div>
      <div className="flex flex-col gap-1 items-center pt-10 pb-7">
        <Timer paymentInfo={paymentInfo} handleTimeout={handleTimeout} address={paymentInfo?.address || ''} />
        <div className="text-sm mt-3">
          <span className=" text-secondary">
            <FormattedMessage id="mt.cankaohuilv" />
          </span>
          &nbsp;
          <span className="text-primary">
            {`1 ${paymentInfo?.baseCurrency} ≈ ${formatNum(depositExchangeRate(methodInfo), {
              precision: DEFAULT_CURRENCY_DECIMAL
            })} ${paymentInfo?.symbol}`}
          </span>
        </div>
        {!!paymentInfo?.baseHandlingFee && (
          <div className="text-sm">
            <span className=" text-secondary">
              <FormattedMessage id="mt.shouxufei" />
            </span>
            &nbsp;
            <span className="text-primary">
              {`${formatNum(paymentInfo?.baseHandlingFee, { precision: DEFAULT_CURRENCY_DECIMAL })} ${paymentInfo?.baseCurrency}`}
            </span>
          </div>
        )}
      </div>

      <Step2 paymentInfo={paymentInfo} />

      <div className="flex flex-col justify-start items-start gap-4 flex-1 pt-2.5 px-[14px] mt-1.5 border-t border-[#f0f0f0] bg-white">
        <div className="text-primary text-base font-semibold">
          <FormattedMessage id="mt.rujinxuzhi" />
        </div>
        <div className="text-secondary text-xs">
          {methodInfo?.notice ? (
            <p className="leading-6" dangerouslySetInnerHTML={{ __html: methodInfo?.notice?.replace(/\n/g, '<br>') }} />
          ) : (
            <div className="text-xs text-gray-400">
              <FormattedMessage id="mt.zanwuneirong" />
            </div>
          )}
        </div>
      </div>
      <UploadModal ref={uploadModalRef} id={id} certificateUrl={paymentInfo?.certificateUrl || ''} />
      <CancelModal ref={cancelModalRef} id={id} backUrl={backUrl} />

      <ConfirmModal ref={confirmModalRef} handleReset={handleReset} />
    </div>
  )
})

export default observer(DepositOtc)
