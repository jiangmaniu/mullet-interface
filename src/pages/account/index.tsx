import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'

import Header from './comp/Header'

export default function Account() {
  return (
    <PageContainer pageBgColorMode="white" renderHeader={() => <Header />}>
      <img src="/img/rujin-banner.png" className="w-full h-[108px]" />
      <Button href="/account/type">账户类型选择</Button>
      <Button href="/account/transfer">账户划转</Button>
      我的账户页面
    </PageContainer>
  )
}
