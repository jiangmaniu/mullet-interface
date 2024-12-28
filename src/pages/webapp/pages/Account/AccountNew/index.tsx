import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import ENV from '@/env'
import { DefaultAccountTabbar } from '@/pages/webapp/components/Account/AccoutList'
import Button from '@/pages/webapp/components/Base/Button'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Header from '@/pages/webapp/components/Base/Header'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { AddAccount } from '@/services/api/tradeCore/account'
import { message } from '@/utils/message'
import { replace } from '@/utils/navigator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import React, { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import AccountCarousel from './AccountCarousel'

const CurrentServer = observer(() => {
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const { cn, theme } = useTheme()

  return (
    <View className={cn('flex flex-row items-center gap-1 mb-5')}>
      <img
        src={ENV.webapp.smallLogo}
        style={{ width: 32, height: 32, backgroundColor: theme.colors.backgroundColor.secondary, borderRadius: 100 }}
      />
      <View className={cn('flex flex-col')}>
        <Text size="lg" weight="medium">
          {currentUser?.client_id}
        </Text>
      </View>
    </View>
  )
})

function AccountNew() {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const [disabled, setDisabled] = useState(false)

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const user = useModel('user')

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const back = params?.get('back') ?? true
  const key = params?.get('key') ?? 'REAL'

  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>(key as 'REAL' | 'DEMO') //  真实账户、模拟账户

  const accountOptions = [
    {
      label: t('app.account.Real Account'),
      value: 'REAL'
    },
    {
      label: t('app.account.Demo Account'),
      value: 'DEMO'
    }
  ]

  // ref
  const bottomSheetModalRef = useRef<SheetRef | null>(null)
  // callbacks
  const handlePresentModalPress = () => {
    setValue('name', selectedItem?.groupName ?? '')
    trigger('name')
    bottomSheetModalRef.current?.sheet?.present()
  }

  const [selectedItem, setSelectedItem] = useState<AccountGroup.AccountGroupItem | null>(null)

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: t('pages.account.Account name cannot be empty') })
      .max(8, { message: t('pages.account.Account name cannot be longer than 8 characters') })
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<{
    name: string
  }>({
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const name = watch('name')

  const loadingRef = useRef<ModalLoadingRef | null>(null)
  const [loadingTips, setLoadingTips] = useState('')

  // 选中新建的账号
  const selectNewAccount = async (accountList: User.AccountItem[], params: { name: string }) => {
    const item = accountList.find((item) => item.name === params.name)

    if (!item) {
      return
    }
    loadingRef.current?.show(() => {
      setLoadingTips(t('common.operate.Switching Account'))
    })

    // 切换账户 重新更新查询品种列表
    await stores.trade.getSymbolList({ accountId: item.id })

    // setAccountBoxOpen(false)

    setTimeout(async () => {
      stores.trade.setCurrentAccountInfo(item)

      // 切换账户重置
      stores.trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')

      // 等待 2000 毫秒
      await new Promise((resolve) => setTimeout(resolve, 2000))
      replace('/app/quote')
      // Portal.remove(PortalKey)
      loadingRef.current?.close()
    }, 1000)
  }

  const onSubmit = async (values: any) => {
    if (!selectedItem) {
      return
    }

    bottomSheetModalRef.current?.sheet?.dismiss()
    loadingRef.current?.show(() => {
      setLoadingTips(t('msg.tips.Creating Account'))
    })

    try {
      setDisabled(true)
      const result = await AddAccount({ accountGroupId: selectedItem.id, clientId: currentUser?.user_id, ...values })

      // 休眠 2000 毫秒
      await new Promise((resolve) => setTimeout(resolve, 2000))
      if (result?.success) {
        loadingRef.current?.close(() => {
          message.info(t('msg.success.Create Account'), 2)

          // 刷新用户信息
          user.fetchUserInfo(true).then((res) => {
            selectNewAccount(res?.accountList ?? [], { name: values.name })
          })
        })
      }
    } catch (error: any) {
      message.info(error.message)
      loadingRef.current?.close()
      setDisabled(false)
    }
  }

  const accountList = useMemo(() => stores.trade.accountGroupList, [stores.trade.accountGroupList])
  React.useLayoutEffect(() => {
    if (!accountList.length) {
      stores.trade.getAccountGroupList()
    }
  }, [accountList])

  return (
    <Basiclayout
      fixedHeight
      style={{ paddingLeft: 14, paddingRight: 14 }}
      header={<Header />}
      footer={
        <Button
          style={{ flex: 1, width: '100%', flexGrow: 1 }}
          size="large"
          type="primary"
          onClick={handlePresentModalPress}
          disabled={disabled}
        >
          {t('pages.account.Create Account')}
        </Button>
      }
    >
      <View className={cn('mb-3 mt-5')}>
        <Text size="22" weight="medium">
          {t("pages.account.No Account? Let's create one!")}
        </Text>
      </View>
      <CurrentServer />

      <View className={cn(' mb-3')}>
        <DefaultAccountTabbar accountTabActiveKey={accountTabActiveKey} setAccountTabActiveKey={setAccountTabActiveKey} />
        {/* <Segmented
          className="account"
          onChange={(value: any) => {
            setAccountTabActiveKey(value)
          }}
          value={accountTabActiveKey}
          options={accountOptions}
          block
        /> */}
      </View>

      <AccountCarousel key={accountTabActiveKey} accountTabActiveKey={accountTabActiveKey} setSelectedItem={setSelectedItem} />

      <SheetModal
        height={400}
        ref={bottomSheetModalRef}
        title={t('pages.account.Setting Name')}
        // footer={
        //   <Button type="primary" disabled={!selectedItem || !name} onPress={handleSubmit(onSubmit)}>
        //     <View style={cn('flex flex-row items-center justify-between gap-2 ')}>
        //       <Text size="base">{t('pages.account.Create Account')}</Text>
        //       <Icon name="anniu-gengduo" size={18} />
        //     </View>
        //   </Button>
        // }
        confirmText={t('pages.account.Create Account')}
        confirmButtonType="primary"
        disabled={!selectedItem || !name || !!errors.name}
        onConfirm={handleSubmit(onSubmit)}
        confirmButtonProps={{ icon: 'anniu-gengduo', iconDirection: 'right', iconProps: { color: theme.colors.textColor.reverse } }}
      >
        <View className={cn('flex-1 w-full px-[14px] flex flex-col mt-4 gap-4 ')}>
          {/* 當前選中 */}
          <View
            borderColor="weak"
            bgColor="primary"
            className={cn('rounded-xl pt-3 px-4 pb-[19px] border w-full flex flex-col items-start')}
          >
            <Text size="lg" weight="bold" color="primary">
              {selectedItem?.groupName}
            </Text>
            <Text size="sm" weight="normal" color="weak" style={{ marginBottom: 10 }}>
              {selectedItem?.synopsis?.remark}
            </Text>

            <View className={cn('flex flex-row items-center justify-between gap-2')}>
              <View
                className={cn(
                  'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal ',
                  selectedItem?.isSimulate ? 'bg-green' : 'bg-brand'
                )}
              >
                <Text color="white">{selectedItem?.synopsis?.tag}</Text>
              </View>
              {selectedItem?.synopsis?.abbr && (
                <View className={cn(' flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal')}>
                  <Text color="white">{selectedItem?.synopsis?.abbr}</Text>
                </View>
              )}
            </View>
          </View>
          {/* 賬戶名稱 */}
          <TextField
            value={name}
            onChange={(val) => {
              setValue('name', val)
              trigger('name')
            }}
            // status={errors.name ? 'error' : undefined}
            label={t('pages.account.Account Name')}
            placeholder={t('pages.account.Account Name Tips')}
            height={50}
            // LeftAccessory={() => <Icon icon="input-email" size={20} containerStyle={{ marginLeft: spacing.small }} />}
            autoCapitalize="none"
            autoComplete="email"
            // autoCorrect={false}
            // keyboardType="email-address"
          />
          {errors.name && <Text style={{ color: theme.colors.red.DEFAULT }}>{errors.name.message}</Text>}
        </View>
      </SheetModal>

      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={loadingTips} />
    </Basiclayout>
  )
}

export default observer(AccountNew)
