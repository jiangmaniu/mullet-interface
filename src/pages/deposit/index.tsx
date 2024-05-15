import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'

export default function Deposit() {
  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-gray font-bold text-[24px]">
        <FormattedMessage id="uc.rujin" />
      </div>
      入金页面
    </PageContainer>
  )
}
