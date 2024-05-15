import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'

export default function AddAccount() {
  return (
    <PageContainer pageBgColorMode="gray" backTitle={<FormattedMessage id="uc.chuangjianxinzhanghu" />}>
      创建新账户
    </PageContainer>
  )
}
