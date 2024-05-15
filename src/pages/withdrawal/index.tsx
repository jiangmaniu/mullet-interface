import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'

export default function Withdrawal() {
  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-gray font-bold text-[24px]">
        <FormattedMessage id="uc.chujin" />
      </div>
      出金列表页面
      <Button href="/withdrawal/add">出金编辑表单页面</Button>
    </PageContainer>
  )
}
