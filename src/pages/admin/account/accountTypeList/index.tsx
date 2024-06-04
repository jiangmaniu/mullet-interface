import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'

import Header from '../comp/Header'

export default function AccountList() {
  return (
    <PageContainer pageBgColorMode="gray" renderHeader={() => <Header />} backTitle={<FormattedMessage id="mt.chuangjianzhanghu" />}>
      <Button href="/account/type/add">去创建新账户</Button>
      这里是账户列表
    </PageContainer>
  )
}
