import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'

export default function TransferAccount() {
  return (
    <PageContainer pageBgColorMode="gray" backTitle={<FormattedMessage id="uc.gerenzhongxin" />}>
      账户划转
    </PageContainer>
  )
}
