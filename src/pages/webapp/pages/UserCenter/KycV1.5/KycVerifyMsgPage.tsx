import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { onBack } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import { useRef, useState } from 'react'
import VerifyMsg from './VerifyMsg'

export default function KycVerifyMsgPage() {
  const user = useModel('user')
  const { cn, theme } = useTheme()
  const i18n = useI18n()
  const ref = useRef<any>(null)
  const { t } = i18n

  const [disabled, setDisabled] = useState(true)
  const onDisabledChange = (disabled: boolean) => {
    setDisabled(disabled)
  }

  return (
    <BasicLayout
      bgColor="primary"
      style={{ paddingLeft: 14, paddingRight: 14 }}
      headerStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
      header={<Header title={i18n.t('pages.userCenter.chujirenzheng')} />}
      fixedHeight
      footer={
        <Button
          type="primary"
          className="mb-2.5 my-5 flex-1 mx-2"
          loading={false}
          height={48}
          onClick={() => {
            ref.current?.onSubmit()
          }}
          disabled={disabled}
        >
          {t('common.operate.Confirm')}
        </Button>
      }
    >
      <VerifyMsg
        ref={ref}
        onDisabledChange={onDisabledChange}
        onSuccess={async () => {
          // 刷新用户信息
          await user.fetchUserInfo()
          onBack()
        }}
      />
    </BasicLayout>
  )
}
