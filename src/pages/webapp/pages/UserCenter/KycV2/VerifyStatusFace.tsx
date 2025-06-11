import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { submitFaceAuthSuccess } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'
import { useSearchParams } from '@umijs/max'
import { useTitle } from 'ahooks'
import { useEffect } from 'react'

const VerifyStatusFace = () => {
  const { cn } = useTheme()
  const i18n = useI18n()
  const { t, locale } = i18n

  const [searchParams] = useSearchParams()
  const bizToken = searchParams.get('BizToken') || ''

  useTitle(t('pages.userCenter.fanhuiyonghuzhongxin'))

  useEffect(() => {
    if (bizToken) {
      submitFaceAuthSuccess({ bizToken })
        .then((res) => {
          setTimeout(() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                  type: 'fetchUserInfo'
                })
              )
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                  type: 'back'
                })
              )
            } else {
              push('/app/user-center')
            }
          }, 1200)
        })
        .catch((err) => {
          message.info(t('pages.userCenter.canshuyichang'))
        })
    } else {
      message.info(t('pages.userCenter.canshuyichang'))
    }
  }, [bizToken])

  return (
    <>
      {/* <View className={cn('flex-1 flex flex-col justify-between')}> */}
      <View className="flex-1 flex flex-col gap-[35px] items-center mt-[80px] px-2 ">
        <img src={'/img/shunliwancheng.png'} className={cn('w-[184px] h-[184px]')} />
        <View className="flex flex-col gap-2.5 items-center">
          <Text size="lg" weight="bold">
            {t('pages.userCenter.fanhuiyonghuzhongxin')}
          </Text>
          {/* <Text className={cn('text-sm text-gray-500 text-center')}>{t('pages.userCenter.ningxianzaikeyirujinbingkaishijiaoyi')}</Text> */}
          <Text className={cn('text-sm text-gray-500 text-center')}>{t('pages.userCenter.yemianjianghuizidongtiaozhuan')}</Text>
        </View>
      </View>

      {/* <Button disabled={false} className="mb-2.5 mt-40 w-full  px-2 " height={48} onClick={handleSubmit(onSubmit)}>
        {t('common.operate.Confirm')}
      </Button> */}
      {/* </View> */}
    </>
  )
}

export default VerifyStatusFace
