import { observer, useLocalObservable } from 'mobx-react'
import { useCallback, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { onLogout } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import Button from '../../components/Base/Button'
import Header from '../../components/Base/Header'
import ListItem, { IlistItemProps } from '../../components/Base/List/ListItem'
import { SheetRef } from '../../components/Base/SheetModal'
import Switch from '../../components/Base/Switch'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import useFocusEffect from '../../hooks/useFocusEffect'
import { useI18n } from '../../hooks/useI18n'
import BasicLayout from '../../layouts/BasicLayout'
import { navigateTo } from '../../utils/navigator'
import KycStatus from './KycV1.5/KycStatus'
import MessageStore from './Message/MessageStore'
import Account from './comp/Account'
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
  const popupRef = useRef<SheetRef>(null)
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const messageStore = useLocalObservable(() => MessageStore)
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  useFocusEffect(
    useCallback(() => {
      // 获取未读消息数量
      MessageStore.getUnreadMessageCount()
    }, [])
  )

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
      subTitle: t('pages.userCenter.Order Confirmation tips'),
      renderExtraElement: () => {
        // switch
        return <OrderConfirmSwitch />
      }
    },
    {
      icon: 'geren-pingcangqueren',
      title: t('pages.userCenter.Close Position Confirmation'),
      subTitle: t('pages.userCenter.Close Position Confirmation tips'),
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

  return (
    <BasicLayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header
        // sideMinWidth={130}
        back
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

        <KycStatus />

        {renderList(preferenceSetting, t('pages.userCenter.Trading Preferences'))}
        <View style={{ height: 8 }} />
        {renderList(commonSetting, t('pages.userCenter.System Settings'), false)}

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
