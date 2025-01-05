import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { rechargeSimulate } from '@/services/api/tradeCore/account'
import { formatNum, hiddenCenterPartStr } from '@/utils'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type IProps = {}

/** 选择账户弹窗 */
function MockDepositModal(props: IProps, ref: ForwardedRef<ModalRef>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const currentAccountInfo = trade.currentAccountInfo

  const bottomSheetModalRef = useRef<SheetRef>(null)

  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const schema = z.object({
    disabled: z.boolean()
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<{
    disabled: boolean
  }>({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: async () => ({
      disabled: false
    })
  })

  const disabled = watch('disabled')

  const onSubmit = async (data: any) => {
    let loading
    try {
      const result = await rechargeSimulate({
        accountId: currentAccountInfo.id,
        money: 10000,
        type: 'DEPOSIT_SIMULATE'
      })

      if (result?.success) {
        // 刷新账户列表
        fetchUserInfo(false)

        setLoading(true)
        // 等待两秒
        await new Promise((resolve) => setTimeout(resolve, 2000))

        message.info(t('common.operate.Success'))
      }
    } catch (error: any) {
      error.message && message.info(error.message)
    } finally {
      bottomSheetModalRef.current?.sheet?.dismiss()
      setLoading(false)
    }
  }

  return (
    <>
      <SheetModal
        ref={bottomSheetModalRef}
        height="55%"
        autoHeight
        title={t('pages.position.Mock Account Deposit')}
        footer={
          <Button
            type="primary"
            disabled={disabled}
            onClick={handleSubmit(onSubmit)}
            className={cn('w-full items-center flex-row justify-center')}
          >
            <Text size="15" color="white">
              {t('pages.position.Confirm Deposit')}
            </Text>
          </Button>
        }
        children={
          <View className={cn('flex-1 flex-col items-center')}>
            <View bgColor="secondary" className={cn('py-[6px] px-[10px] flex flex-row mt-6')}>
              <Text size="sm" color="secondary">
                {t('app.account.Account')}&nbsp;
              </Text>
              <Text size="sm" color="secondary">
                #{hiddenCenterPartStr(currentAccountInfo.id, 4)}
              </Text>
            </View>
            <Text size="sm" color="weak" className={cn('mt-1')}>
              {t('pages.position.Daily Deposit Limit')}
            </Text>
            <View className={cn('flex flex-col items-center my-5')}>
              <Text className={cn(' text-[44px] leading-[44px]')} font="dingpro-medium" weight="medium">
                {formatNum(10000)}
              </Text>
              <Text size="sm" color="weak" weight="light">
                {SOURCE_CURRENCY}
              </Text>
            </View>
          </View>
        }
      />
      <ModalLoading open={loading} tips={t('pages.position.Depositing')} />
    </>
  )
}

export default observer(forwardRef(MockDepositModal))
