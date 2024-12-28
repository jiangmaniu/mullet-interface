import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import { ModalLoadingRef } from '@/components/Base/Lottie/Loading'
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
import { bindEmail, sendCustomEmailCode } from '@/services/api/user'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ModalRef } from './comp/SelectCountryModal'

interface FormData {
  email: string
  code: string
}

const CountDown = observer(({ email, onSendCode }: { email?: string; onSendCode: () => void }) => {
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
            <Text style={cn('text-start text-sm text-blue-600 ml-1')}>{t('pages.login.Resend')}</Text>
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

function BindEmail() {
  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { global } = useStores()

  const { screenSize } = useEnv()

  const schema = z.object({
    email: z.string().min(1, { message: t('pages.login.Email placeholder') }),
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
      email: '',
      code: ''
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const email = watch('email')
  const code = watch('code')

  const loadingRef = useRef<ModalLoadingRef>(null)
  const [loadingTips, setLoadingTips] = useState('')

  const onSubmit = async (data: FormData) => {
    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />)
    loadingRef.current?.show(() => {
      setLoadingTips(t('pages.login.Sending'))
    })

    try {
      const res = await bindEmail({
        email: data.email,
        emailCode: Number(data.code)
      })

      if (res?.success) {
        message.info(t('pages.userCenter.bingdingchenggong'), 2)
        navigateTo('app/user-center/verify-msg')
      }
    } catch (error: any) {
    } finally {
      loadingRef.current?.close()
    }
  }

  const defaultSeconds = 60
  const onSendCode = async () => {
    if (!email) {
      trigger('email')
      return
    }

    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />)
    loadingRef.current?.show(() => {
      setLoadingTips(t('pages.login.Sending'))
    })

    try {
      const result = await sendCustomEmailCode({
        email: email
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

  const disabled = !!errors.email || !!errors.code

  return (
    <BasicLayout
      bgColor="secondary"
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
      <Header title={i18n.t('pages.userCenter.bangdingyouxiang')} />
      <View className={cn('mt-6 px-2')}>
        <Text className={cn(' text-xl text-primary font-bold')}>{i18n.t('pages.login.Email placeholder')}</Text>
        <Text className={cn(' text-sm text-gray-500 mt-1')}>{i18n.t('pages.userCenter.yongyuweilaicaozuo')}</Text>
        <TextField
          value={email}
          onChange={(val) => {
            setValue('email', val?.trim())
            trigger('email')
          }}
          label={t('pages.login.Email placeholder')}
          placeholder={t('pages.login.Email placeholder')}
          height={50}
          // status={errors.password ? 'error' : undefined}
          containerClassName={cn('mt-4')}
          className={cn('leading-[18px]')}
          autoCapitalize="none"
          autoComplete="password"
          RightAccessory={() => (
            <View className={cn('px-[15px]', sendDisabled ? 'opacity-50' : '')} onPress={() => onSendCode()} disabled={sendDisabled}>
              <Text>{t('pages.userCenter.huoquyanzhengma')}</Text>
            </View>
          )}
        />
        {!!errors.email && <Text className={cn('text-sm text-red-500 mt-1')}>{errors.email.message}</Text>}
        <Text className={cn('text-sm text-primary mt-5 max-w-[280px]')}>
          {t('pages.userCenter.chakanduanxinhuoquyanzhengma', {
            phone: email ? email : t('pages.login.Email Address')
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
        <CountDown email={email} onSendCode={onSendCode} />
        {!!errors.code && <Text className={cn('text-sm text-red-500 mt-1')}>{errors.code.message}</Text>}
      </View>
    </BasicLayout>
  )
}

export default observer(BindEmail)
