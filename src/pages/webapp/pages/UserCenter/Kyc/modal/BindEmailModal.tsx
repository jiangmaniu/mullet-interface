import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import CodeInput from '@/pages/webapp/components/Base/Form/CodeInput'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { bindEmail, sendCustomEmailCode } from '@/services/api/user'
import { regEmail } from '@/utils'
import { validateNonEmptyFieldsRHF } from '@/utils/form'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIntl, useModel } from '@umijs/max'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
}

function BindEmailModal(props: IProps, ref: any) {
  const i18n = useI18n()
  const { cn, theme } = useTheme()
  const { t, locale } = useI18n()
  const { global } = useStores()
  const intl = useIntl()
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const { screenSize } = useEnv()
  const user = useModel('user')

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet.dismiss()
    }
  }))

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: t('pages.login.Email placeholder') })
      .refine((data) => regEmail.test(data), { message: t('mt.youxianggeshibuzhengque') }),
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

  useEffect(() => {
    validateNonEmptyFieldsRHF(errors, trigger)
  }, [locale])

  const email = watch('email')
  const code = watch('code')

  const loadingRef = useRef<ModalLoadingRef>(null)
  const [loadingTips, setLoadingTips] = useState('')

  const onSubmit = async (data: FormData) => {
    console.log('data', data)

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
        bottomSheetModalRef.current?.sheet.dismiss()
        message.info(t('pages.userCenter.bingdingchenggong'))

        // 刷新用户信息
        user.fetchUserInfo(true)
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

  const disabled = !!errors?.email?.message || !!errors?.code?.message || !code

  console.log('errors', errors)

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      autoHeight
      title={intl.formatMessage({ id: 'mt.bangdingyouxiang' })}
      // trigger={props.trigger}
      // disabled={disabled}
      children={
        <div className="mx-4">
          <TextField
            value={email}
            onChange={(val) => {
              setValue('email', val?.trim())
              trigger('email')
            }}
            label={t('mt.youxiang')}
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
          {!!errors.email && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.email.message}</Text>}
          <View className="text-[20px] text-primary font-pf-bold font-medium mt-10">{t('mt.chakanyouxianghuoquyanzhengma')}</View>
          <Text className={cn('text-xs mt-2 inline-block max-w-[280px]')} color="weak">
            {t('mt.youxiangyanzhengmafasongzhitips', {
              email: email || '-'
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
          {!!errors.code && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.code.message}</Text>}
        </div>
      }
      // @ts-ignore
      onConfirm={handleSubmit(onSubmit)}
      closeOnConfirm={false}
    />
  )
}

export default observer(forwardRef(BindEmailModal))
