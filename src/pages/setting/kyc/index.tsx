import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'

export default function Setting() {
  return (
    <PageContainer pageBgColorMode="white" backTitle={<FormattedMessage id="uc.shezhi" />}>
      KYC流程页面
    </PageContainer>
  )
}
