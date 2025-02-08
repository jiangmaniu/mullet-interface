import Iconfont from '@/components/Base/Iconfont'
import { useEnv } from '@/context/envProvider'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { onBack } from '@/utils/navigator'
import { useLocation, useModel } from '@umijs/max'
import { useEffect } from 'react'

export default function VerifyStatus() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()

  const { screenSize } = useEnv()

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const back = params?.get('back')

  /** 拦截系统返回操作 */
  const gobackHandler = () => {
    if (back === 'UserCenter') {
      navigateTo('/app/user-center')
      // navigateTo('Main', { screen: 'UserCenter' })
    } else {
      onBack()
    }
    return true
  }

  useEffect(() => {
    window.addEventListener('popstate', gobackHandler)
    return () => window.removeEventListener('popstate', gobackHandler)
  }, [])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态

  const statusList: Record<API.ApproveStatus, { title: string; desc: string }> = {
    TODO: {
      title: i18n.t('pages.userCenter.shenfenrenzhengshenhezhong'),

      desc: `${i18n.t('pages.userCenter.shenfenrenzhengshenhezhongnaixindengdai')}${i18n.t('pages.userCenter.fangxinguanbi')}`
    },
    SUCCESS: {
      title: i18n.t('pages.userCenter.shunliwancheng'),
      desc: `${i18n.t('pages.userCenter.ningxianzaikeyirujinbingkaishijiaoyi')}`
    },
    DISALLOW: {
      title: i18n.t('pages.userCenter.shenfenrenzhengshenheweitongguo'),
      desc: `${i18n.t('pages.userCenter.qingchongxinjinxingrenzheng')}`
    },
    CANCEL: {
      title: i18n.t('pages.userCenter.shenfenrenzhengshenheweitongguo'),
      desc: `${i18n.t('pages.userCenter.qingchongxinjinxingrenzheng')}`
    }
  }

  const reVerify = () => {
    navigateTo('/app/user-center/verify-msg')
  }

  const kefu = () => {
    // TODO: 客服
  }

  return (
    <BasicLayout
      bgColor="primary"
      style={{ paddingLeft: 14, paddingRight: 14 }}
      header={
        <Header
          // title={i18n.t('pages.userCenter.shenhezhong')}
          back
          left={
            <View onPress={gobackHandler}>
              <Iconfont name="fanhui" size={36} />
            </View>
          }
        />
      }
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      footer={
        <div className=" mb-4">
          {kycStatus === 'DISALLOW' ? (
            <Button type="primary" loading={false} height={48} onClick={reVerify}>
              {i18n.t('pages.userCenter.chongxinrenzheng')}
            </Button>
          ) : (
            <Button type="primary" loading={false} height={48} onClick={gobackHandler}>
              {i18n.t('common.operate.Close')}
            </Button>
          )}
        </div>
      }
    >
      <View className={cn('flex-1 flex flex-col justify-between mb-12')}>
        <View className={cn('px-2 flex items-center justify-center')}>
          <View className={cn('flex items-center justify-center flex-col gap-2.5 w-[300px] mt-[100px] ')}>
            {kycStatus === 'TODO' ? (
              <img src={'/img/shenhezhong-1.png'} className={cn('w-[184px] h-[184px]')} />
            ) : kycStatus === 'SUCCESS' ? (
              <img src={'/img/shunliwancheng.png'} className={cn('w-[184px] h-[184px]')} />
            ) : (
              <img src={'/img/shenheweitongguo.png'} className={cn('w-[184px] h-[184px]')} />
            )}
            <Text className={cn('text-xl text-primary font-medium text-center')}>{statusList[kycStatus]?.title}</Text>
            <Text className={cn('text-sm text-gray-500 text-center')}>{statusList[kycStatus]?.desc}</Text>
          </View>
        </View>
      </View>
      {/* <View className={cn('mt-[150px] px-2 flex items-center justify-center')}>
        <View className={cn('flex items-center justify-center flex-col gap-2.5 w-[300px] ')}>
          <View className={cn('bg-yellow-500 w-[120px] h-[120px] flex items-center justify-center rounded-[30px]')}>
            <Iconfont name="gaizhang" size={100} color={theme.colors.textColor.reverse} />
          </View>
          <Text className={cn('text-xl text-primary font-medium text-center')}>
            {i18n.t('pages.userCenter.shenfenrenzhengshenhezhong')}
          </Text>
          <Text className={cn('text-sm !text-gray-500 text-center')}>
            {i18n.t('pages.userCenter.shenfenrenzhengshenhezhongnaixindengdai')}
            {i18n.t('pages.userCenter.fangxinguanbi')}
          </Text>
          <Button
            type="primary"
            style={{ width: '100%', height: 42, display: 'flex', justifyContent: 'center', marginTop: 40 }}
            onClick={() => {
              replace('/app/user-center')
            }}
          >
            <View className={cn('flex flex-row items-center justify-center gap-2')}>
              <Text className={cn('!text-reverse text-lg font-bold text-center')}>{i18n.t('app.pageTitle.Personal Center')}</Text>
              <Iconfont name="jinru" size={28} color={theme.colors.textColor.reverse} />
            </View>
          </Button>
        </View>
      </View> */}
    </BasicLayout>
  )
}
