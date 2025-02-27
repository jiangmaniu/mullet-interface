import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { onBack, push } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'
import { useModel } from '@umijs/max'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import VerifyDoc from '../KycV2/VerifyDoc'
export default function KycVerifyDocPage() {
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
      bgColor="primary"
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      headerStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
      header={<Header title={i18n.t('pages.userCenter.gaojirenzheng')} />}
      fixedHeight
      footer={
        <View className={cn('grid grid-cols-2 gap-5 w-full mb-2.5')}>
          <Button
            type="primary"
            loading={submitting}
            height={48}
            className={cn(' flex-1 w-full')}
            onClick={() => {
              push(appendHideParamIfNeeded('/app/deposit'))
            }}
          >
            {i18n.t('pages.userCenter.qurujin')}
          </Button>
          <Button type="primary" loading={submitting} height={48} className={cn('w-full flex-1')} onClick={onSubmit} disabled={disabled}>
            {i18n.t('pages.userCenter.tijiaoshenhe')}
          </Button>
        </View>
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
      <View
        className={classNames('rounded-t-[24px] w-full pt-[14px]')}
        style={{
          backgroundColor: '#ededed'
        }}
      >
        <View className="mb-3 mx-[22px] flex items-center justify-center gap-2">
          <Iconfont name="danchuang-xuanzhong" size={20} className="bg-blue rounded-full flex-shrink-0" color="white" />
          <Text size="sm" weight="light" className="text-start flex-shrink ">
            {i18n.t('pages.userCenter.yichujirenzheng')}
          </Text>
        </View>
        <View className=" rounded-t-[24px] bg-white w-full px-[14px] pt-[38px]">
          <VerifyDoc
            ref={ref}
            onSuccess={async () => {
              // 刷新用户信息
              await user.fetchUserInfo()
              onBack()
            }}
            onDisabledChange={onDisabledChange}
          />
        </View>
      </View>
    </BasicLayout>
  )
}
