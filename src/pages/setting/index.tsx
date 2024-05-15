import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'

export default function Setting() {
  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-[24px] font-bold text-gray">
        <FormattedMessage id="uc.shezhi" />
      </div>
      <Button href="/setting/kyc">跳转kyc流程</Button>
    </PageContainer>
  )
}
