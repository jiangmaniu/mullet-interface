import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import { useTheme } from '@/context/themeProvider'
import { getWithdrawalAddressList, getWithdrawalBankList } from '@/services/api/wallet'
import { useLocation, useModel } from '@umijs/max'
import { useRequest, useTitle } from 'ahooks'
import Header from '../../../components/Base/Header'
import ListItem, { IlistItemProps } from '../../../components/Base/List/ListItem'
import { SheetRef } from '../../../components/Base/SheetModal'
import { View } from '../../../components/Base/View'
import { useI18n } from '../../../hooks/useI18n'
import BasicLayout from '../../../layouts/BasicLayout'
import BindEmailModal from '../Kyc/modal/BindEmailModal'
import BindPhoneModal from '../Kyc/modal/BindPhoneModal'
import HeaderInfo from './HeaderInfo'

function UserCenter() {
  const popupRef = useRef<SheetRef>(null)
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const back = params?.get('back') === 'true' ? true : false

  const { data: addrRes, run: queryAddr } = useRequest(getWithdrawalAddressList, { manual: true })
  const { data: bankRes, run: queryBank } = useRequest(getWithdrawalBankList, { manual: true })

  useTitle(t('mt.gerenxinxi'))

  useEffect(() => {
    queryAddr()
    queryBank()
  }, [])

  const renderList = (listData: IlistItemProps[], title?: string, margin = true) => {
    return (
      <View>
        {title && <View className={cn('mb-3 text-weak text-sm')}>{title}</View>}
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
                  fontSize: 14,
                  ...(item?.styles?.subTextStyle || {})
                }
              }}
            />
          )
        })}
      </View>
    )
  }

  // 信息
  const info: IlistItemProps[] = [
    {
      icon: 'earth',
      title: t('mt.guojia'),
      hiddenRightIcon: true,
      subText: locale === 'zh-TW' ? currentUser?.countryInfo?.nameCn || '-' : currentUser?.countryInfo?.nameEn || '-'
    },
    {
      icon: 'phone',
      title: t('mt.shoujihao'),
      // hiddenRightIcon: true,
      // 绑定或者修改手机号弹窗
      // subText: currentUser?.userInfo?.phone ? (
      //   <ModifyPhoneModal
      //     trigger={
      //       <span>
      //         {currentUser?.userInfo?.phoneAreaCode || ''} {currentUser?.userInfo?.phone || '-'}
      //       </span>
      //     }
      //   />
      // ) : (
      //   <BindPhoneModal trigger={<span>{t('mt.bangding')}</span>} />
      // ),
      // 只能绑定，不能修改
      subText: currentUser?.userInfo?.phone ? (
        <>
          +{currentUser?.userInfo?.phoneAreaCode?.replace('+', '') || ''} {currentUser?.userInfo?.phone || '-'}
        </>
      ) : (
        <BindPhoneModal trigger={<span>{t('mt.bangding')}</span>} />
      ),
      hiddenRightIcon: !!currentUser?.userInfo?.phone,
      styles: {
        subTextStyle: {
          color: !currentUser?.userInfo?.phone ? 'var(--color-primary)' : 'var(--color-text-weak)'
        }
      }
    },
    {
      icon: 'email',
      title: t('mt.youxiang'),
      // 绑定或者修改邮箱弹窗
      // subText: currentUser?.userInfo?.email ? (
      //   <ModifyEmailModal trigger={<span>{currentUser?.userInfo?.email}</span>} />
      // ) : (
      //   <BindEmailModal trigger={<span>{t('mt.bangding')}</span>} />
      // ),
      // 只能绑定，不能修改
      subText: currentUser?.userInfo?.email ? currentUser?.userInfo?.email : <BindEmailModal trigger={<span>{t('mt.bangding')}</span>} />,
      hiddenRightIcon: !!currentUser?.userInfo?.phone,
      styles: {
        subTextStyle: {
          color: !currentUser?.userInfo?.email ? 'var(--color-primary)' : 'var(--color-text-weak)'
        }
      }
    }
  ]

  // 安全
  const secure: IlistItemProps[] = [
    {
      icon: 'key',
      title: t('mt.mima'),
      subText: t('mt.xiuggaimima'),
      styles: {
        subTextStyle: {
          color: 'var(--color-primary)'
        }
      },
      href: `/app/modify-password`
    }
  ]

  // 地址
  const address: IlistItemProps[] = [
    {
      icon: 'yinhangka',
      title: t('mt.yinhangkadizhi'),
      subText: t('mt.xxtiao', { count: bankRes?.data?.records?.length || 0 }),
      href: `/app/bankcard-address`
    },
    {
      icon: 'addr',
      title: t('mt.qianbaodizhi'),
      subText: t('mt.xxtiao', { count: addrRes?.data?.records?.length || 0 }),
      href: `/app/wallet-address`
    }
  ]

  return (
    <BasicLayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header back={back} title={t('mt.gerenxinxi')} />
      <View style={{ paddingInline: 14, flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 60, marginTop: 10 }}>
        <View className="bg-white mb-6 rounded-xl px-2">
          <HeaderInfo />
        </View>
        {renderList(info, t('mt.xinxi'))}
        <View style={{ height: 8 }} />
        {renderList(secure, t('mt.anquan'), false)}
        <View style={{ height: 8 }} />
        {renderList(address, t('mt.dizhi'), false)}
      </View>
    </BasicLayout>
  )
}

export default observer(UserCenter)
