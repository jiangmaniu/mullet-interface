import Iconfont from '@/components/Base/Iconfont'
import { DEFAULT_CURRENCY_DECIMAL, SOURCE_CURRENCY } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import SelectAccountModal, { SelectAccountModalRef } from '@/pages/webapp/components/Account/SelectAccountModal'
import Button from '@/pages/webapp/components/Base/Button'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Header from '@/pages/webapp/components/Base/Header'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { formatNum, formatStringWithEllipsis, toFixed } from '@/utils'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TransferPreviewModal from './TransferPreviewModal'

function TransferScreen() {
  const { theme, cn } = useTheme()
  const { t } = useI18n()

  const selectAccountModalRef = useRef<SelectAccountModalRef>(null)
  const selectAccountModalRefTo = useRef<SelectAccountModalRef>(null)
  const transferPreviewModalRef = useRef<ModalRef>(null)

  const currentAccountInfo = stores.trade.currentAccountInfo

  const [from, setFrom] = useState<any>(null)
  const [to, setTo] = useState<any>(null)

  // 当前账户占用的保证金 = 逐仓保证金 + 全仓保证金（可用保证金）
  const occupyMargin = Number(toFixed(Number(from?.margin || 0) + Number(from?.isolatedMargin || 0)))
  // 可用余额
  const availableMoney = Number(toFixed(Number(from?.money || 0) - occupyMargin))

  useEffect(() => {
    setFrom(currentAccountInfo)
  }, [currentAccountInfo])

  const handleSelectFrom = (item?: User.AccountItem) => {
    if (item?.id === to?.id) {
      message.info(t('msg.tips.Same Account'))
      return
    }
    setFrom(item)
    // 收起
    selectAccountModalRef.current?.close()
  }

  const handleSelectTo = (item?: User.AccountItem) => {
    if (item?.id === from?.id) {
      message.info(t('msg.tips.Same Account'))
      return
    }
    setTo(item)
    // 收起
    selectAccountModalRefTo.current?.close()
  }

  const handleTransfer = () => {
    if (!from && !to) {
      return
    }

    // 交换 from 和 to
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const schema = useCallback(
    () =>
      z.object({
        amount: z
          .string()
          .refine(
            (value) => {
              const num = parseFloat(value)
              return !isNaN(num)
            },
            { message: t('pages.position.Please enter a valid number') }
          )
          .refine(
            (value) => {
              const num = parseFloat(value)
              return num > 0
            },
            { message: t('pages.position.Please enter a valid number') }
          )
          .refine(
            (value) => {
              const num = parseFloat(value)
              return num <= (availableMoney ?? 0)
            },
            { message: `${t('pages.position.Insufficient Funds')}${availableMoney}` }
          )
      }),
    [availableMoney, t]
  )

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      amount: ''
    },
    resolver: zodResolver(schema())
  })

  const amount = watch('amount')

  const onSubmit = (data: { amount: string }) => {
    if (!from || !to) {
      message.info(t('msg.tips.Select Accounts'))
      return
    }

    if (parseFloat(data.amount) <= 0) {
      message.info(t('pages.position.Please enter a valid number'))
      return
    }

    transferPreviewModalRef.current?.show()
  }

  // useEffect(() => {
  //   trigger('amount')
  // }, [from?.money])

  useEffect(() => {
    setFrom(currentAccountInfo)
  }, [])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  useEffect(() => {
    if (from && currentUser?.accountList) {
      // 找到当前账户
      const currentAccount = currentUser.accountList.find((item) => item.id === from.id)
      setFrom(currentAccount)
    }
    if (to && currentUser?.accountList) {
      // 找到当前账户
      const currentAccount = currentUser.accountList.find((item) => item.id === to.id)
      setTo(currentAccount)
    }
  }, [currentUser])

  return (
    <Basiclayout
      fixedHeight
      header={
        <Header
          right={
            <View
              className={cn('flex justify-end items-center')}
              onPress={() => {
                navigateTo('/app/account/transfer/detail')
              }}
            >
              <Iconfont name="a-bianzu15" size={36} />
            </View>
          }
          back={true}
        />
      }
      footer={
        <Button
          type="primary"
          size="large"
          className="mb-4"
          loading={false}
          onClick={handleSubmit(onSubmit)}
          disabled={!amount || !from || !to || !!errors.amount}
        >
          {t('pages.position.Transfer2')}
        </Button>
      }
      style={{ paddingLeft: 14, paddingRight: 14 }}
      bgColor="primary"
      headerColor={theme.colors.backgroundColor.primary}
    >
      <View className={cn('flex-1 flex flex-col justify-between mb-12')}>
        <Text size="xl" weight="bold" color="primary" className={cn('ml-2 mb-3 mt-5')}>
          {t('pages.position.Transfer')}
        </Text>
        <View className={cn('border border-weak rounded-xl flex flex-row gap-4 px-[17px]')}>
          {/* 从 - 到 */}
          <View className={cn('flex flex-col justify-center items-center py-[19px] gap-1')}>
            <Text color="weak">{t('pages.position.From')}</Text>
            <Iconfont name="huazhuan-zhixiang" size={16} color={theme.colors.textColor.weak} />
            <Text color="weak">{t('pages.position.To')}</Text>
          </View>

          {/* selector */}
          <View className={cn('flex flex-1 flex-col justify-center items-center py-[19px] border-weak border-r gap-[14px] pr-2')}>
            <View
              onPress={() => selectAccountModalRef.current?.show(handleSelectFrom)}
              className={cn('flex flex-row items-center justify-between flex-1 w-full')}
            >
              <View className={cn('flex flex-row items-center gap-2')}>
                {from?.synopsis?.tag && (
                  <View className={cn(' flex h-5 min-w-[20px] items-center px-1 justify-center rounded bg-black text-xs font-normal')}>
                    <Text color="white" size="xs">
                      {from.synopsis?.tag}
                    </Text>
                  </View>
                )}
                <Text color="primary" size="sm" weight="medium">
                  {formatStringWithEllipsis(from?.name ?? '', 16)}
                </Text>
              </View>
              <Iconfont name="huazhuan-xuanze" size={20} color={theme.colors.textColor.weak} />
            </View>
            {/* divider */}
            <View
              className={cn('h-[1px] w-full rounded-full', {
                backgroundColor: theme.colors.borderColor.weak
              })}
            />
            <View
              onPress={() => selectAccountModalRefTo.current?.show(handleSelectTo)}
              className={cn('flex flex-row items-center justify-between flex-1 w-full')}
            >
              {to ? (
                <View className={cn('flex flex-row items-center gap-2 ')}>
                  {to?.synopsis?.abbr && (
                    <View className={cn(' flex h-5 min-w-[20px] items-center px-1 justify-center rounded bg-black text-xs font-normal')}>
                      <Text color="white" size="xs">
                        {to.synopsis?.abbr}
                      </Text>
                    </View>
                  )}
                  <Text color="primary" size="sm" weight="medium">
                    {formatStringWithEllipsis(to?.name ?? '', 16)}
                  </Text>
                </View>
              ) : (
                <View className={cn('flex-1 flex flex-row justify-start items-center w-full')}>
                  <Text color="weak" weight="light">
                    {t('pages.position.Select')}
                  </Text>
                </View>
              )}
              <Iconfont name="huazhuan-xuanze" size={20} color={theme.colors.textColor.weak} />
            </View>
          </View>

          <View onPress={handleTransfer} className={cn('w-8 px-[14px] flex flex-col justify-center items-center')}>
            <Iconfont name="huazhuan" size={28} color={theme.colors.Button.primary} />
          </View>
        </View>

        <Text size="sm" color="primary" weight="medium" className={cn('mt-4 ml-2 mb-2')}>
          {t('pages.position.Amount')}
        </Text>

        <TextField
          placeholder={t('pages.position.Please enter the amount')}
          height={52}
          className={cn('font-medium')}
          fontSize={amount ? 22 : 14}
          RightAccessory={() => (
            <Text size="sm" color="primary" weight="medium" className={cn('px-[14px]')}>
              {SOURCE_CURRENCY}
            </Text>
          )}
          value={amount}
          onChange={(value) => {
            setValue('amount', value)
            trigger('amount')
          }}
          // status={errors.amount ? 'error' : undefined}
        />
        <View className={cn('flex-row items-center')}>
          <Text size="sm" color="weak" weight="light" className={cn('ml-2 my-2')}>
            {t('pages.position.Available Assets')}:{' '}
          </Text>
          <Text size="sm" color="primary" font="dingpro-medium">
            {formatNum(availableMoney ?? 0, {
              precision: from?.currencyDecimal ?? DEFAULT_CURRENCY_DECIMAL
            })}{' '}
            {SOURCE_CURRENCY}
          </Text>
        </View>
        {errors.amount && (
          <Text size="sm" color="red" weight="light" className={cn('ml-2 ')}>
            {errors.amount.message}
          </Text>
        )}
      </View>

      <SelectAccountModal
        ref={selectAccountModalRef}
        isSimulate={false}
        onItem={handleSelectFrom}
        header={
          <Text className={cn('self-center')} size="lg" weight="medium" color="primary">
            {t('common.operate.Select')}
          </Text>
        }
      />

      <SelectAccountModal
        ref={selectAccountModalRefTo}
        isSimulate={false}
        onItem={handleSelectTo}
        header={
          <Text className={cn('self-center')} size="lg" weight="medium" color="primary">
            {t('common.operate.Select')}
          </Text>
        }
      />

      <TransferPreviewModal ref={transferPreviewModalRef} from={from} to={to} amount={amount} />
    </Basiclayout>
  )
}

export default observer(TransferScreen)
