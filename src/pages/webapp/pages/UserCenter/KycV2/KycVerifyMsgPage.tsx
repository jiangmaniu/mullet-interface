import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { onBack } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import { useRef, useState } from 'react'
import VerifyMsg from './VerifyMsg'

export default function KycVerifyMsgPage() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()
  const user = useModel('user')

  const ref = useRef<any>(null)

  const [disabled, setDisabled] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const onDisabledChange = (disabled: boolean) => {
    setDisabled(disabled)
  }

  const onSubmit = () => {
    setSubmitting(true)
    ref.current?.onSubmit()
    setSubmitting(false)
  }

  return (
    <BasicLayout
      bgColor="secondary"
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      headerStyle={{ backgroundColor: theme.colors.backgroundColor.secondary }}
      header={
        <Header style={{ backgroundColor: theme.colors.backgroundColor.secondary }} title={i18n.t('pages.userCenter.chujirenzheng')} />
      }
      // fixedHeight
      footerClassName="bg-white"
      footer={
        <Button type="primary" className="mb-2.5 my-5 flex-1 mx-2" loading={false} height={48} onClick={onSubmit} disabled={disabled}>
          {i18n.t('common.operate.Confirm')}
        </Button>
      }
    >
      <View className="flex flex-col items-center">
        <img
          src={require('/public/img/webapp/kyc-bg-0.png')}
          alt="kyc-verify-information"
          width="146"
          height="146"
          className="my-[44px] mx-auto"
        />
      </View>
      <View className=" rounded-t-[24px] bg-white w-full px-[14px] pt-[38px] pb-[100px]">
        <VerifyMsg
          ref={ref}
          onDisabledChange={onDisabledChange}
          onSuccess={async () => {
            // 刷新用户信息
            await user.fetchUserInfo()
            onBack()
          }}
        />
      </View>
    </BasicLayout>
  )
}
