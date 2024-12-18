import { observer } from 'mobx-react'
import { useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { onLogout } from '@/utils/navigator'
import Icon from '@ant-design/icons/lib/components/Icon'
import { useModel } from '@umijs/max'
import { Switch } from 'antd-mobile'
import Button from '../../components/Base/Button'
import Header from '../../components/Base/Header'
import ListItem, { IlistItemProps } from '../../components/Base/List/ListItem'
import { SheetRef } from '../../components/Base/SheetModal'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import BasicLayout from '../../layouts/BasicLayout'
import { navigateTo } from '../../utils/navigator'
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

const Kyc = observer(() => {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const userInfo = currentUser?.userInfo
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态
  const remark = kycAuthInfo?.remark as string
  const phone = userInfo?.phone
  return (
    <View style={cn('mb-5')}>
      <View style={cn('flex flex-row items-center justify-between bg-white rounded-lg p-3 gap-10 mt-2')}>
        <View style={cn('flex flex-row items-center flex-shrink ')}>
          <Icon name="caidan-zhanghu" size={32} color={theme.colors.textColor.weak} />
          {kycStatus === 'TODO' ? (
            <Text style={cn('text-sm')}>{t('pages.userCenter.shenfenrenzhengshenhezhongnaixindengdai')}</Text>
          ) : (
            <Text style={cn('text-sm')}>{t('pages.userCenter.qingwanshanziliao')}</Text>
          )}
        </View>
        {kycStatus === 'TODO' ? (
          <Button
            type="warnning"
            style={{ minWidth: 60 }}
            size="small"
            onClick={() => {
              navigateTo('VerifyStatus')
            }}
          >
            <Text color="reverse">{t('pages.userCenter.shenhezhong')}</Text>
          </Button>
        ) : (
          <Button
            type="success"
            style={{ minWidth: 60 }}
            size="small"
            onClick={() => {
              if (userInfo?.phone && userInfo?.email) {
                navigateTo('VerifyMsg')
              } else if (userInfo?.phone && !userInfo?.email) {
                navigateTo('BindEmail')
              } else if (!userInfo?.phone && userInfo?.email) {
                navigateTo('BindPhone')
              }
            }}
          >
            <Text color="reverse">{t('pages.userCenter.wanshan')}</Text>
          </Button>
        )}
      </View>
      {kycStatus === 'DISALLOW' && (
        <View style={cn(' border border-gray-300 rounded-lg px-3 py-1 gap-10 mt-2')}>
          <Text style={cn('text-sm text-red')}>
            {t('pages.userCenter.shenhebutongguo')}: {remark}
          </Text>
        </View>
      )}
    </View>
  )
})

function UserCenter() {
  const popupRef = useRef<SheetRef>(null)
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const renderList = (listData: IlistItemProps[], title?: string, margin = true) => {
    return (
      <View>
        {title && (
          <Text size="sm" color="weak" style={cn('font-semibold mb-3')}>
            {title}
          </Text>
        )}
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
                  fontSize: 15,
                  maxWidth: 230
                },
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
      href: 'Language'
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
    <BasicLayout bgColor="secondary" scrollY style={{ paddingLeft: 14, paddingRight: 14 }}>
      <Header
      // sideMinWidth={130}
      // left={
      //   <Text size="xl" weight="medium" color="primary">
      //     {i18n.t('app.pageTitle.Personal Center')}
      //   </Text>
      // }
      // right={
      //   <LinkPressable href="Message">
      //     <View>
      //       <Icon name="gerenzhongxin-xiaoxi" size={30} />
      //       {messageStore.unReadCount > 0 && <View style={cn('absolute right-0 top-0 bg-red size-2 rounded-full')} />}
      //     </View>
      //   </LinkPressable>
      // }
      />

      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 60 }}>
        <Account />

        {!currentUser?.isKycAuth && <Kyc />}

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
            <Text style={cn('text-gray-500')}> {t('common.operate.Logout')}</Text>
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
