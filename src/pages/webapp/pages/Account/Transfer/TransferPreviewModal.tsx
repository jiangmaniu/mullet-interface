import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { useTheme } from '@/context/themeProvider'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { transferAccount } from '@/services/api/tradeCore/account'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'
import { useModel } from '@umijs/max'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'

type IProps = {
  from: User.AccountItem
  to: User.AccountItem
  amount: string
}

/** 选择账户弹窗 */

function TransferPreviewModal({ from, to, amount }: IProps, ref: ForwardedRef<ModalRef>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const user = useModel('user')

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const items = useMemo(() => {
    return [
      {
        label: t('pages.position.Payment Method'),
        value: (
          <View className={cn('flex flex-row items-center gap-1')}>
            <img src={'/img/webapp/icons/zhuanzhang.png'} width={18} height={18} style={{ width: 20, height: 20 }} />
            <Text size="sm" color="primary" weight="medium">
              {t('pages.position.Transfer Between Own Accounts')}
            </Text>
          </View>
        )
      },
      {
        label: t('pages.position.Transfer In Account'),
        value: (
          <Text size="sm" color="primary" weight="medium">
            {to?.name}
          </Text>
        )
      },
      {
        label: t('pages.position.Transfer Out Account'),
        value: (
          <Text size="sm" color="primary" weight="medium">
            {from?.name}
          </Text>
        )
      },
      {
        label: t('pages.position.Amount'),
        value: (
          <Text size="sm" color="primary" weight="medium" font="dingpro-medium">
            {formatNum(amount)}&nbsp;
            {SOURCE_CURRENCY}
          </Text>
        )
      },
      {
        label: t('pages.position.Fee'),
        value: (
          <Text size="sm" color="primary" weight="medium">
            {t('pages.position.No Fee')}
          </Text>
        )
      }
    ]
  }, [from, to, t, amount])

  const [state, setState] = useState('pending')
  const [submitLoading, setSubmitLoading] = useState(false)

  const children = useMemo(() => {
    return (
      <>
        {state === 'success' ? (
          <View className={cn(' flex flex-col items-center justify-center')}>
            <Iconfont name="huazhuanjilu-huazhuan" size={92} className={cn('mt-[33px] mb-1')} />
            <Text size="3xl" color="primary" weight="medium" font="dingpro-medium">
              {formatNum(amount)}&nbsp;
              {SOURCE_CURRENCY}
            </Text>
            <Text size="sm" color="weak" weight="light" className={cn('mt-1')}>
              {t('pages.position.Transfer Amount')}
            </Text>
            <Text size="sm" color="weak" weight="light" className={cn('my-[45px]')}>
              {t('pages.position.Transfer Successful, Please Continue Trading')}
            </Text>
          </View>
        ) : (
          <View className={cn('px-[14px] pt-5')}>
            <View className={cn('flex flex-col items-center justify-start gap-6')}>
              {items.map((i, idx) => (
                <View key={i.label} className={cn('flex flex-row justify-between items-center w-full gap-4')}>
                  <View className={cn('flex flex-row items-center gap-1 w-20')}>
                    <Text color="weak" size="sm" weight="light">
                      {i.label}
                    </Text>
                  </View>
                  <View className={cn('flex flex-row gap-1 flex-1 overflow-hidden')}>
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                    <View style={{ width: 6, height: 1.5, borderRadius: 2, backgroundColor: '#F0F0F0', marginRight: 2 }} />
                  </View>
                  {i.value}
                </View>
              ))}
            </View>

            <View
              bgColor="secondary"
              className={cn('flex flex-row justify-between items-center rounded-xl gap-2 mt-5 py-[22px] px-[17px]')}
            >
              <Text size="sm" color="weak" weight="light">
                {t('pages.position.Pending Withdrawal Amount')}
              </Text>
              <Text size="xl" color="primary" weight="medium" font="dingpro-medium">
                {formatNum(amount)}&nbsp;
                {SOURCE_CURRENCY}
              </Text>
            </View>
            <View className={cn('mt-2 ml-2')}>
              <Text size="sm" color="weak" weight="light">
                {t('pages.position.Your funds will arrive within 1 day (1d)')}
              </Text>
            </View>
          </View>
        )}
      </>
    )
  }, [from, to, amount, items, state])

  const handleOnPress = async () => {
    if (state === 'pending') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // TODO: 提交轉賬
      setSubmitLoading(true)
      const res = await transferAccount({
        fromAccountId: from.id,
        toAccountId: to.id,
        money: parseFloat(amount)
      }).finally(() => {
        setSubmitLoading(false)
      })

      if (res.success) {
        setState('success')
        // 刷新用户信息
        user.fetchUserInfo(true)
      } else {
        message.info(res.msg)
      }
    } else if (state === 'success') {
      bottomSheetModalRef.current?.sheet?.dismiss(() => {
        setTimeout(() => {
          setState('pending')
        }, 1000)
        // history.back()
      })
    }
  }

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      title={state === 'success' ? t('pages.position.Transfer Successful') : t('pages.position.Transfer Preview')}
      height={state === 'success' ? 480 : 600}
      // snapPoints={['80%', '100%']} // 增加這個功能後 dismiss 會出現按鈕點擊異常問題
      onConfirm={handleOnPress}
      closeOnConfirm={false}
      children={children}
    />
  )
}

export default forwardRef(TransferPreviewModal)
