import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { colorToRGBA } from '@/utils/color'
import { onBack } from '@/utils/navigator'
import classNames from 'classnames'
import VerifyStatus4 from './VerifyStatus4'
export default function KycVerifyDocPage() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()
  const onSubmit = onBack

  return (
    <BasicLayout
      bgColor="primary"
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      headerStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
      header={<Header className="bg-secondary" title={i18n.t('mt.shenfenxinxi')} />}
      fixedHeight
      footer={
        <Button type="primary" disabled={false} className="mb-2.5 w-full" height={48} onClick={onSubmit}>
          {i18n.t('common.operate.Confirm')}
        </Button>
      }
    >
      <View className="flex flex-col items-center bg-secondary">
        <img src={'/img/webapp/kyc-bg-0.png'} alt="kyc-verify-information" width="146" height="146" className="my-[44px] mx-auto" />
      </View>
      <View
        className={classNames('rounded-t-[24px] w-full pt-[14px] flex-1')}
        style={{
          backgroundColor: colorToRGBA('#45A48A', 0.1)
        }}
      >
        <View className="mb-3 mx-[22px]">
          <Text size="sm" weight="medium" className="text-center " color="green">
            {i18n.t('pages.userCenter.yigaojirenzheng')}
          </Text>
        </View>
        <View className=" rounded-t-[24px] bg-white w-full px-[14px] pt-[38px]">
          <VerifyStatus4 />
        </View>
      </View>
    </BasicLayout>
  )
}
