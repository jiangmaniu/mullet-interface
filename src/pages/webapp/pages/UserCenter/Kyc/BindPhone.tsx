import { observer } from 'mobx-react'
import { useLayoutEffect, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import CodeInput from '@/pages/webapp/components/Base/Form/CodeInput'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { getAreaCode } from '@/services/api/common'
import { bindPhone, sendCustomPhoneCode } from '@/services/api/user'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModel } from '@umijs/max'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ModalRef } from './comp/SelectCountryModal'
import SelectCountryModal from './comp/SelectCountryModal'

interface FormData {
  phone: string
  areaCode: string
  code: string
}

const CountDown = observer(({ phone, onSendCode }: { phone?: string; onSendCode: () => void }) => {
  const { t } = useI18n()
  const { cn } = useTheme()
  const { global } = useStores()

  return (
    <View style={cn('flex flex-row mt-1 mb-8 flex-wrap')}>
      <Text style={cn('text-start text-sm text-weak')}>{t('pages.login.Did not receive the verification code')}</Text>
      {global.verifyCodeDown === -1 ? (
        <>
          <Text style={cn('text-start text-sm text-weak')}>{t('pages.login.click to')}</Text>
          <View onPress={onSendCode}>
            <Text style={cn('text-start text-sm !text-blue-600 ml-1')}>{t('pages.login.Resend')}</Text>
          </View>
        </>
      ) : (
        <Text style={cn('text-start text-sm text-weak')}>
          {t('pages.login.Please try again after seconds', { second: global.verifyCodeDown })}
        </Text>
      )}
    </View>
  )
})

function BindPhone() {
  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { global } = useStores()

  const user = useModel('user')

  const { screenSize } = useEnv()

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

  const phone = watch('phone')
  const areaCode = watch('areaCode')
  const code = watch('code')

  const loadingRef = useRef<ModalLoadingRef>(null)
  const [loadingTips, setLoadingTips] = useState('')

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
        message.info(t('pages.userCenter.bingdingchenggong'), 2)

        await user.fetchUserInfo(true)

        navigateTo('/app/user-center/verify-msg')
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

  const disabled = !!errors.phone || !!errors.areaCode || !!errors.code

  const [countryList, setCountryList] = useState<Common.AreaCodeItem[]>([])
  useLayoutEffect(() => {
    getAreaCode().then((res) => {
      const list = res.data?.filter((item) => item.areaCode !== '0')
      setCountryList(list || [])
    })
  }, [])

  return (
    <BasicLayout
      bgColor="secondary"
      headerColor={theme.colors.backgroundColor.secondary}
      style={{ paddingLeft: 14, paddingRight: 14 }}
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      footer={
        <Button
          style={{
            marginBottom: 10,
            width: '100%'
          }}
          type="primary"
          loading={false}
          height={48}
          onPress={handleSubmit(onSubmit)}
          disabled={disabled}
        >
          {t('common.operate.Continue')}
        </Button>
      }
    >
      <Header
        title={i18n.t('pages.userCenter.bangdingshouji')}
        // left={
        //   <TouchableOpacity onPress={goBack}>
        //     <Icon name="fanhui" size={36} />
        //   </TouchableOpacity>
        // }
      />
      <View className={cn('mt-6 px-2 flex-col flex')}>
        <Text className={cn(' text-xl text-primary font-pf-bold')}>{i18n.t('pages.userCenter.qingshurushoujihaoma')}</Text>
        <Text className={cn(' text-sm !text-gray-500 mt-1 mb-4')}>{i18n.t('pages.userCenter.yongyuweilaicaozuo')}</Text>
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
        <Text className={cn('text-sm text-primary mt-7 max-w-[280px]')}>
          {t('pages.userCenter.chakanduanxinhuoquyanzhengma', {
            phone: phone ? `+${areaCode}${phone}` : t('pages.userCenter.shoujihaoma')
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
      </View>

      <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} list={countryList} />
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={loadingTips} />
    </BasicLayout>
  )
}

export default observer(BindPhone)
