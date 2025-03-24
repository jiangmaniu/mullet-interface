import { FormattedMessage } from '@umijs/max'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { CardContainer } from '@/pages/admin/copyTrading/comp/CardContainer'
import { goKefu } from '@/utils/navigator'

export const Step3 = ({ handleSubmit }: { handleSubmit: () => void }) => {
  return (
    <div className="flex items-center justify-center w-full h-full mt-10">
      <CardContainer title={<FormattedMessage id="mt.chujinjieguo" />} onChange={() => {}} defaultValue={undefined}>
        <div className="flex flex-col items-center justify-center gap-20 w-[480px] h-[400px] mt-6">
          <div className="flex flex-col gap-[14px] items-center justify-center">
            <img src="/img/chujinjieguo.svg" alt="success" width={56} height={56} />
            <div className="text-primary font-semibold text-[24px]">
              <FormattedMessage id="mt.ningdejiaoyiyizaichulizhong" />
            </div>
            <div className="text-secondary text-base">
              <FormattedMessage id="mt.chujinshenqingchenggong" />
            </div>
          </div>
          <div className="flex items-center justify-center flex-col">
            <Button height={46} type="primary" size="large" onClick={handleSubmit} style={{ width: '223px' }}>
              <FormattedMessage id="mt.chakandingdan" />
            </Button>
            <span className="flex flex-row items-center gap-1 cursor-pointer mt-5" onClick={goKefu}>
              <Iconfont name="kefu" size={24} />
              <span className="font-extrabold">
                <FormattedMessage id="mt.chujinshiyudaowenti" />
              </span>
            </span>
          </div>
        </div>
      </CardContainer>
    </div>
  )
}
