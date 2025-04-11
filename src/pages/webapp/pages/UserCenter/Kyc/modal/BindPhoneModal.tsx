import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import CodeInput from '@/pages/webapp/components/Base/Form/CodeInput'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getAreaCode } from '@/services/api/common'
import { bindPhone, sendCustomPhoneCode } from '@/services/api/user'
import { validateNonEmptyFieldsRHF } from '@/utils/form'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIntl, useModel } from '@umijs/max'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ModalRef } from '../comp/SelectCountryModal'
import SelectCountryModal from '../comp/SelectCountryModal'

interface FormData {
  phone: string
  areaCode: string
  code: string
}

const CountDown = observer(({ phone, onSendCode }: { phone?: string; onSendCode: () => void }) => {
  const { t, locale } = useI18n()
  const { cn } = useTheme()
  const { global } = useStores()

  return (
    <View style={cn('flex flex-row mt-1 mb-8 flex-wrap')}>
      <Text style={cn('text-start text-xs')} color="weak">
        {t('pages.login.Did not receive the verification code')}
      </Text>
      {global.verifyCodeDown === -1 ? (
        <>
          <Text style={cn('text-start text-xs')} color="weak">
            {t('pages.login.click to')}
          </Text>
          <View onPress={onSendCode}>
            <Text style={cn('text-start text-xs !text-blue-600 ml-1')}>{t('mt.huoquyanzhengma')}</Text>
          </View>
        </>
      ) : (
        <Text style={cn('text-start text-xs')} color="weak">
          {t('pages.login.Please try again after seconds', { second: global.verifyCodeDown })}
        </Text>
      )}
    </View>
  )
})

type IProps = {
  trigger?: JSX.Element
  open?: boolean
}

const BindPhoneModal = forwardRef((props: IProps, ref: React.Ref<ModalRef>) => {
  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { t, locale } = useI18n()
  const { global } = useStores()
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const user = useModel('user')

  const schema = z.object({
    phone: z.string().min(1, { message: t('pages.userCenter.qingshurushoujihaoma') }),
    areaCode: z.string().min(1, { message: t('pages.userCenter.qingxuanzequhao') }),
    code: z
      .string()
      .min(6, { message: t('pages.userCenter.yanzhengmacuowu') })
      .max(6, { message: t('pages.userCenter.yanzhengmacuowu') })
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      phone: '',
      areaCode: '',
      code: ''
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    validateNonEmptyFieldsRHF(errors, trigger)
  }, [locale])

  const phone = watch('phone')
  const areaCode = watch('areaCode')
  const code = watch('code')

  const loadingRef = useRef<ModalLoadingRef>(null)
  const [loadingTips, setLoadingTips] = useState('')
  const intl = useIntl()

  const onSubmit = async (data: FormData) => {
    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />)
    loadingRef.current?.show(() => {
      setLoadingTips(t('pages.login.Sending'))
    })

    try {
      const res = await bindPhone({
        phone: data.phone,
        phoneCode: Number(data.code),
        phoneAreaCode: data.areaCode
      })

      if (res?.success) {
        message.info(t('pages.userCenter.bingdingchenggong'))

        bottomSheetModalRef.current?.sheet.dismiss()

        await user.fetchUserInfo(true)
      }
    } catch (error: any) {
    } finally {
      loadingRef.current?.close()
    }
  }

  const defaultSeconds = 60
  const onSendCode = async () => {
    if (!areaCode) {
      trigger('areaCode')
      return
    }
    if (!phone) {
      trigger('phone')
      return
    }

    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />)
    loadingRef.current?.show(() => {
      setLoadingTips(t('pages.login.Sending'))
    })

    try {
      const result = await sendCustomPhoneCode({
        phone: phone,
        phoneAreaCode: areaCode
      })

      if (result?.success) {
        message.info(t('pages.userCenter.yanzhengmaquerensuccess'))
        global.countDownVerifyCode(defaultSeconds)
      }
    } catch (error: any) {
    } finally {
      loadingRef.current?.close()
    }
  }

  const sendDisabled = global.verifyCodeDown !== -1

  const selectCountryModalRef = useRef<ModalRef>(null)
  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      setValue('areaCode', item.areaCode)
      trigger('areaCode')
    }
  }

  const disabled = !!errors.phone || !!errors.areaCode || !!errors.code || !phone || !code || !areaCode

  // 获取国家列表
  const [countryList, setCountryList] = useState<Common.AreaCodeItem[]>([])
  const getCountryList = async () => {
    try {
      const res = await getAreaCode()
      const list = res.data?.filter((item) => item.areaCode !== '0')
      setCountryList(list || [])
    } catch (error) {
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    getCountryList()
  }, [])

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet.dismiss()
    }
  }))

  return (
    <>
      <SheetModal
        ref={bottomSheetModalRef}
        autoHeight
        title={intl.formatMessage({ id: 'mt.bangdingshouji' })}
        trigger={props.trigger}
        open={props.open}
        children={
          <div className="mx-4">
            <TextField
              value={phone}
              onChange={(val) => {
                setValue('phone', val?.trim())
                trigger('phone')
              }}
              label={t('pages.userCenter.shoujihaoma')}
              placeholder={t('pages.userCenter.qingshurushoujihaoma')}
              height={50}
              containerStyle={{
                marginTop: 4
              }}
              style={{
                lineHeight: 18
              }}
              LeftAccessory={() => (
                <View className={cn('pl-[15px]')} onPress={() => selectCountryModalRef.current?.show()}>
                  <View className={cn('flex flex-row items-center gap-1')}>
                    <Text>{areaCode ? `+${areaCode}` : t('components.select.PlacehodlerSim')}</Text>
                    <Iconfont name="qiehuanzhanghu-xiala" size={24} />
                  </View>
                </View>
              )}
              RightAccessory={() => (
                <View className={cn('px-[15px]', sendDisabled ? 'opacity-50' : '')} onPress={() => onSendCode()} disabled={sendDisabled}>
                  <Text>{t('pages.userCenter.huoquyanzhengma')}</Text>
                </View>
              )}
            />
            {!!errors.phone && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.phone.message}</Text>}
            {!!errors.areaCode && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.areaCode.message}</Text>}
            <View className="text-[20px] text-primary font-pf-bold font-medium mt-10">{t('mt.chakanshoujihuoquyanzhengma')}</View>
            <Text className={cn('text-xs mt-2 inline-block max-w-[280px]')} color="weak">
              {t('pages.userCenter.chakanduanxinhuoquyanzhengma', {
                phone: phone ? `+${areaCode}${phone}` : '-'
              })}
            </Text>
            <View className={cn('flex flex-col gap-6 mt-[12px]')}>
              <CodeInput
                value={code}
                onChange={(val) => {
                  setValue('code', val)
                  trigger('code')
                }}
              />
            </View>
            <CountDown phone={phone} onSendCode={onSendCode} />
            {!!errors.code && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.code.message}</Text>}

            <SelectCountryModal
              ref={selectCountryModalRef}
              title={intl.formatMessage({ id: 'mt.xuanzequhao' })}
              onPress={handleSelectCountry}
            />
            {/* <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={loadingTips} /> */}
          </div>
        }
        // @ts-ignore
        onConfirm={handleSubmit(onSubmit)}
        disabled={disabled}
        closeOnConfirm={false}
      />
    </>
  )
})

export default observer(BindPhoneModal)
