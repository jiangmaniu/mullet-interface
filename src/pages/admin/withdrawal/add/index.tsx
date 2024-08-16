import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'

export default function Withdrawal() {
  return (
    <PageContainer pageBgColorMode="white" fluidWidth backTitle={<FormattedMessage id="mt.quanbushoukuanfangshi" />}>
      <div className="text-primary font-bold text-[24px]">出金</div>
      出金编辑选择页面
    </PageContainer>
  )
}
