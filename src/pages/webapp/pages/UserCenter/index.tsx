import { observer, useLocalObservable } from 'mobx-react'
import { useCallback, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import useKycAuth from '@/hooks/useKycAuth'
import { goKefu, onLogout } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import { useTitle } from 'ahooks'
import Button from '../../components/Base/Button'
import Header from '../../components/Base/Header'
import ListItem, { IlistItemProps } from '../../components/Base/List/ListItem'
import Switch from '../../components/Base/Switch'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import useFocusEffect from '../../hooks/useFocusEffect'
import { useI18n } from '../../hooks/useI18n'
import useKycJumpLink from '../../hooks/useKycJumpLink'
import BasicLayout from '../../layouts/BasicLayout'
import { navigateTo } from '../../utils/navigator'
import BindEmailModal from './Kyc/modal/BindEmailModal'
import BindPhoneModal from './Kyc/modal/BindPhoneModal'
import KycStatus from './KycV2/KycStatus'
import MessageStore from './Message/MessageStore'
import Account from './comp/Account'
import KycTipsModal from './comp/KycTipsModal'
import { ModalConfirm } from './comp/ModalConfirm'

const QuickPlaceOrderSwitch = observer(() => {
  const { trade } = useStores()

  return (
    <Switch
      onChange={(checked) => {
        trade.setOrderQuickPlaceOrderChecked(checked)
      }}
      checked={trade.orderQuickPlaceOrderChecked}
    />
  )
})

const OrderConfirmSwitch = observer(() => {
  const { trade } = useStores()
  return (
    <Switch
      checked={trade.orderConfirmChecked}
      onChange={(checked) => {
        trade.setOrderConfirmChecked(checked)
      }}
    />
  )
})

const PositionConfirmSwitch = observer(() => {
  const { trade } = useStores()
  return (
    <Switch
      checked={trade.positionConfirmChecked}
      onChange={(checked) => {
        trade.setPositionConfirmChecked(checked)
      }}
    />
  )
})

function UserCenter() {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const messageStore = useLocalObservable(() => MessageStore)
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false
  const phone = currentUser?.userInfo?.phone || ''
  const email = currentUser?.userInfo?.email || ''
  const ENV = getEnv()
  const { notKycAuth, kycAuthType } = useKycAuth()

  const bindPhoneRef = useRef<any>(null)
  const bindEmailRef = useRef<any>(null)

  useTitle(t('app.pageTitle.Personal Center'))

  const renderList = (listData: IlistItemProps[], title?: string, margin = true) => {
    return (
      <View>
        {title && <View className={cn('mb-3 text-weak text-sm')}>{title}</View>}
        {/* style={{ backgroundColor: '#fff', marginTop: margin ? 8 : 0 }}> */}
        {listData.map((item: IlistItemProps, index: number) => {
          return (
            <ListItem
              key={index}
              {...item}
              first={!index}
              styles={{
                container: { borderRadius: 12, marginBottom: 12, height: 62 },
                titleStyle: {
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '15px',
                  maxWidth: 250
                },
                iconStyle: { marginRight: 12 },
                subTextStyle: {
                  fontSize: 14
                }
              }}
            />
          )
        })}
      </View>
    )
  }

  // 偏好设置
  const preferenceSetting: IlistItemProps[] = [
    {
      icon: 'geren-kuaisuxiadan',
      title: t('pages.userCenter.Quick Trading'),
      renderExtraElement: () => {
        // switch
        return <QuickPlaceOrderSwitch />
      }
    },
    {
      icon: 'geren-xiadanqueren',
      title: t('pages.userCenter.Order Confirmation'),
      subTitle: t('mt.xiadanquerentips'),
      renderExtraElement: () => {
        // switch
        return <OrderConfirmSwitch />
      }
    },
    {
      icon: 'geren-pingcangqueren',
      title: t('pages.userCenter.Close Position Confirmation'),
      subTitle: t('mt.pingcangquerentips'),
      renderExtraElement: () => {
        // switch
        return <PositionConfirmSwitch />
      }
    }
  ]

  /** 系統設置 */
  const commonSetting: IlistItemProps[] = [
    {
      icon: 'geren-yuyan',
      title: t('common.Language'),
      subText: t(`common.language.${locale}`),
      href: '/app/user-center/language'
    }
  ]

  const logoutContent = () => {
    return (
      <div>
        <Button type="gray">{t('common.operate.Cancel')}</Button>
        <Button type="primary">{t('common.operate.Confirm')}</Button>
      </div>
    )
  }

  const modalConfirmRef = useRef<any>(null)

  // 退出登录
  const handleLoginOut = () => {
    modalConfirmRef.current?.show()
  }

  const updateGap = 10 * 1000 // 打開該頁面的時候主動刷新用戶信息，間隔：10秒
  const user = useModel('user')
  useFocusEffect(
    useCallback(() => {
      // 如果最后一次刷新时间是 updateGap 之前，在后台主动刷新一次用户信息
      if (user.lastUpdateTime && Date.now().valueOf() - user.lastUpdateTime > updateGap) {
        console.log('=====主动刷新')
        user.fetchUserInfo(false)
      }

      // 获取未读消息数量
      messageStore.getUnreadMessageCount()
    }, [])
  )

  const kycTipsModalRef = useRef<any>(null)

  const { jumpLink } = useKycJumpLink()

  const checkAuth = (key: 'deposit' | 'withdraw') => {
    if (!phone) {
      // navigateTo('/app/person-info?back=true&bindPhone=true')
      // 绑定手机号弹窗
      bindPhoneRef.current.show()
      return
    }
    if (!email) {
      // 绑定邮箱弹窗
      bindEmailRef.current.show()
      return
    }
    // 不需要认证
    if (notKycAuth) {
      navigateTo(key === 'deposit' ? '/app/deposit' : '/app/withdraw')
      return
    }
    // 未完成基础认证
    if (!isBaseAuth) {
      navigateTo(jumpLink)
      return
    }
    // 基础认证通过或者
    if (isBaseAuth && key === 'deposit') {
      navigateTo('/app/deposit')
      return
    }
    if (key === 'withdraw') {
      if (!isKycAuth) {
        navigateTo(jumpLink)
      } else {
        // 全部认证完成 去出金
        navigateTo('/app/withdraw')
      }
    }
  }

  // 快捷入口
  const quickEntry = [
    {
      icon: 'rujin1',
      title: t('mt.rujin'),
      href: '/app/deposit',
      onClick: () => {
        checkAuth('deposit')
      }
    },
    {
      icon: 'chujin1',
      title: t('mt.chujin'),
      href: '/app/withdraw',
      onClick: () => {
        checkAuth('withdraw')
      }
    },
    {
      icon: 'zhuanzhang',
      title: t('mt.zijinjilu'),
      href: '/app/record/payment'
    },
    {
      icon: 'msg',
      title: t('mt.kefu'),
      onClick: () => {
        goKefu()
      }
    }
  ]

  return (
    <BasicLayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header
        // sideMinWidth={130}
        back
        style={{
          backgroundColor: theme.colors.backgroundColor.secondary
        }}
        left={
          <Text size="xl" font="pf-bold" color="primary">
            {t('app.pageTitle.Personal Center')}
          </Text>
        }
        right={
          <View
            className="relative"
            onClick={() => {
              navigateTo('/app/user-center/message')
            }}
          >
            <Iconfont name="gerenzhongxin-xiaoxi" size={30} />
            {messageStore.unReadCount > 0 && <View className={cn('absolute right-0 top-0 bg-red size-2 rounded-full')} />}
          </View>
        }
      />

      <View style={{ paddingInline: 14, flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 60 }}>
        <Account />

        {!notKycAuth && <KycStatus />}

        <View className={cn('grid grid-cols-4 items-start w-full px-[12px] mt-2.5 mb-7 gap-8 ')}>
          {quickEntry.map((item) => {
            return (
              <View
                className={cn('flex flex-col items-center text-center gap-2 w-full')}
                key={item.title}
                onClick={() => {
                  if (item?.onClick) {
                    item.onClick()
                  } else {
                    navigateTo(item.href)
                  }
                }}
              >
                <Iconfont name={item.icon} size={28} />
                <Text size="sm">{item.title}</Text>
              </View>
            )
          })}
        </View>

        {renderList(preferenceSetting, t('pages.userCenter.Trading Preferences'))}
        <View style={{ height: 8 }} />
        {!ENV.HIDE_SWITCH_LANGUAGE && renderList(commonSetting, t('pages.userCenter.System Settings'), false)}

        <Button
          type="gray"
          style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 48, width: '100%' }}
          onClick={() => handleLoginOut()}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Iconfont name="geren-tuichuzhanghu" size={20} color={theme.colors.gray[500]} />
            <Text className={cn('!text-gray-500')}> {t('common.operate.Logout')}</Text>
          </View>
        </Button>
      </View>
      <KycTipsModal ref={kycTipsModalRef} />

      {/* 绑定手机号弹窗 */}
      <BindPhoneModal ref={bindPhoneRef} />
      {/* 绑定邮箱弹窗 */}
      <BindEmailModal ref={bindEmailRef} />

      <ModalConfirm
        ref={modalConfirmRef}
        title={t('common.operate.Logout')}
        action={[
          {
            text: t('common.operate.Confirm'),
            onPress: onLogout
          },
          {
            text: t('common.operate.Cancel')
          }
        ]}
      />
    </BasicLayout>
  )
}

export default observer(UserCenter)
