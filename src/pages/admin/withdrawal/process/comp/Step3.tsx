import { FormattedMessage } from '@umijs/max'

import Button from '@/components/Base/Button'
import { CardContainer } from '@/pages/admin/copyTrading/comp/CardContainer'

export const Step3 = ({ handleSubmit }: { handleSubmit: () => void }) => {
  return (
    <div className="flex items-center justify-center w-full h-full mt-10">
      <CardContainer title={<FormattedMessage id="mt.chujinjieguo" />} onChange={() => {}} defaultValue={undefined}>
        <div className="flex flex-col items-center justify-center gap-20 w-[340px] md:w-[552px] max-w-full md:h-[552px] mt-6">
          <div className="flex flex-col gap-[14px] items-center justify-center">
            <img src="/img/chujinjieguo.svg" alt="success" width={56} height={56} />
            <div className="text-primary font-semibold text-[24px]">
              <FormattedMessage id="mt.ningdejiaoyiyizaichulizhong" />
            </div>
            <div className="text-secondary text-base">
              <FormattedMessage id="mt.chujinshenqingchenggong" />
            </div>
          </div>
          <Button type="primary" size="large" onClick={handleSubmit} style={{ width: '223px' }}>
            <FormattedMessage id="mt.chakanlishi" />
          </Button>
        </div>
      </CardContainer>
    </div>
  )
}
