// import './index.less'

import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useParams, useSearchParams } from '@umijs/max'
import { Form } from 'antd'
import { useLayoutEffect, useRef, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { push } from '@/utils/navigator'

import { getDepositOrderDetail } from '@/services/api/wallet'
import ConfirmModal from '../process/comp/ConfirmModal'
import Detail from './comp/Detail'
import UploadModal from './comp/UploadModal'

export default function DepositOtc() {
  const [form] = Form.useForm()

  const params = useParams()
  const id = params?.id as string

  const [query] = useSearchParams()

  const backUrl = query.get('backUrl') as string

  const [paymentInfo, setPaymentInfo] = useState<any>({})

  useLayoutEffect(() => {
    if (id) {
      // 请求接口得到 paymentInfo
      getDepositOrderDetail({ id }).then((res) => {
        if (res.success) {
          setPaymentInfo(res.data)
        }
      })
    }
  }, [id])

  const [step, setStep] = useState(0)

  const uploadModalRef = useRef<any>()

  const handleSubmit1 = async () => {
    uploadModalRef.current?.show()
  }

  const handleSubmit2 = async () => {
    push('/record?key=withdrawal')
    // setStep(3)
  }

  const [loading, setLoading] = useState(false)

  const confirmModalRef = useRef<any>()
  const handleTimeout = () => {
    confirmModalRef.current?.show()
  }

  const handleReset = () => {
    if (backUrl) {
      push(backUrl)
    } else {
      push('/deposit')
    }
  }

  return (
    <PageContainer pageBgColorMode={'gray'} fluidWidth backUrl={backUrl || '/deposit'} backTitle={<FormattedMessage id="mt.rujin" />}>
      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
          <PageLoading />
        </div>
      )}
      <Detail paymentInfo={paymentInfo} loading={loading} setStep={setStep} handleSubmit={handleSubmit1} handleTimeout={handleTimeout} />
      <UploadModal ref={uploadModalRef} id={id} certificateUrl={paymentInfo?.certificateUrl} />

      <ConfirmModal ref={confirmModalRef} handleReset={handleReset} />
    </PageContainer>
  )
}
