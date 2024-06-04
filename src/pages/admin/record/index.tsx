import { FormattedMessage } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'

export default function Record() {
  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-[24px] font-bold text-gray">
        <FormattedMessage id="mt.churujinjilu" />
      </div>
    </PageContainer>
  )
}
