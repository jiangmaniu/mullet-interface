import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useParams } from '@umijs/max'
import { Form } from 'antd'
import { useLayoutEffect, useRef, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import { push } from '@/utils/navigator'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { getDepositOrderDetail } from '@/services/api/wallet'
import { CardContainer } from '../../copyTrading/comp/CardContainer'

export default function DepositOtc() {
  const [form] = Form.useForm()

  const params = useParams()
  const id = params?.id as string

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
    // setStep(0)
    // confirmModalRef.current?.show()
  }

  return (
    <PageContainer pageBgColorMode={'gray'} fluidWidth backUrl="/deposit" backTitle={<FormattedMessage id="mt.rujin" />}>
      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0 z-10">
          <PageLoading />
        </div>
      )}
      <div className="flex items-center justify-center w-full h-full">
        <CardContainer
          title={<FormattedMessage id="mt.dengdairujin" />}
          subtitle={
            <span className="text-secondary text-base ">
              <FormattedMessage id="mt.nindezijinyujiliangxiaoshineidaoda" />
            </span>
          }
          style={['w-[552px] h-[552px] ']}
          onChange={() => {}}
          defaultValue={undefined}
        >
          <div className="flex flex-col gap-[14px] items-center justify-center  flex-1 ">
            <img src="/img/processing.png" alt="wait" className="w-[56px] h-[56px]" />
            <span className=" text-2xl font-medium">
              <FormattedMessage id="mt.nindejiaoyizhengzaichulizhong" />
            </span>
            <span className="text-secondary text-base font-normal">
              <FormattedMessage id="mt.rujinshenqingchenggong" />
            </span>
            <Button
              type="primary"
              size="large"
              className="w-[223px] h-[56px] mt-[54px]"
              style={{
                height: '56px',
                width: '223px'
              }}
              onClick={() => {
                push('/record?key=deposit')
              }}
            >
              <FormattedMessage id="mt.chakandingdan" />
            </Button>
            <span className="flex flex-row items-center gap-3 mt-[15px]">
              <Iconfont name="kefu" size={24} />
              <span>
                <FormattedMessage id="mt.rujinshiyudaowenti" />
              </span>
            </span>
          </div>
        </CardContainer>
      </div>
    </PageContainer>
  )
}
