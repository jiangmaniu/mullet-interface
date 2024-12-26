import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'

import type { TypeSection, WELCOME_STEP_TYPES } from '.'

import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'
import { observer } from 'mobx-react'
import CodeInput from '../../components/Base/Form/CodeInput'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'

export interface FormData {
  email?: string
  phone?: string
  password: string
  areaCodeItem: Common.AreaCodeItem | undefined
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
  email?: string
  phone?: string
  areaCodeItem?: Common.AreaCodeItem
  setValidateCode: (code: string) => void
}

const CountDown = observer(
  ({
    email,
    phone,
    areaCodeItem,
    onSendCode,
    defaultSeconds = 60
  }: {
    email?: string
    phone?: string
    areaCodeItem?: Common.AreaCodeItem
    onSendCode: () => void
    defaultSeconds?: number
  }) => {
    const { t } = useI18n()
    const { cn } = useTheme()
    const { global } = useStores()

    useEffect(() => {
      global.verifyCodeDown === -1 && global.countDownVerifyCode(defaultSeconds)
    }, [])

    return (
      <View className={cn('flex flex-row mt-1 mb-8 flex-wrap')}>
        <Text className={cn('text-start text-sm text-weak')}>{t('pages.login.Did not receive the verification code')}</Text>
        {global.verifyCodeDown === -1 ? (
          <>
            <Text className={cn('text-start text-sm text-weak')}>{t('pages.login.click to')}</Text>
            <View onPress={onSendCode}>
              <Text className={cn('text-start text-sm text-blue-600 ml-1')}>{t('pages.login.Resend')}</Text>
            </View>
          </>
        ) : (
          <Text className={cn('text-start text-sm text-weak')}>
            {t('pages.login.Please try again after seconds', { second: global.verifyCodeDown })}
          </Text>
        )}
      </View>
    )
  }
)

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  { setSection, startAnimation, email, phone, areaCodeItem, setValidateCode }: Props,
  ref
) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const { global } = useStores()

  useLayoutEffect(() => {
    startAnimation?.(24)
  }, [])

  /** 拦截系统返回操作 */
  const goback = () => {
    setSection('forgotPassword')
    return true
  }
  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({ goback }))

  // 拦截平台/系统返回操作
  // useGoBackHandler(goback, [])

  const [code, setCode] = useState<string>()

  const [error, setError] = useState<string>()

  const disabled = code?.length !== 6 || !!error

  // 登录
  const onSubmit = async () => {
    if (!code) return

    // code 必须要是数字
    if (!/^\d+$/.test(code)) {
      setError(t('pages.login.Verification code is not number'))
      return
    }

    setValidateCode(code)
    setSection('resetPassword')
  }

  const defaultSeconds = 60

  const loadingRef = useRef<ModalLoadingRef>(null)

  const onSendCode = async () => {
    if (!email && !phone) return

    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />)
    loadingRef.current?.show()

    try {
      let result: API.Response<any> | undefined
      if (email) {
        result = await sendCustomEmailCode({
          email: email
        })
      } else if (phone) {
        result = await sendCustomPhoneCode({
          phone: phone,
          phoneAreaCode: areaCodeItem?.areaCode
        })
      }

      if (result?.success) {
        global.countDownVerifyCode(defaultSeconds)
      }
    } catch (error: any) {
    } finally {
      loadingRef.current?.close()
    }
  }

  return (
    <View className={cn('flex-1 flex flex-col justify-between mb-12')}>
      <View className={cn('flex-1 flex flex-col items-center justify-center  ')}>
        <View className={cn('flex flex-col items-start flex-shrink justify-center border border-gray-50 rounded-xl py-5 px-4')}>
          <Text className={cn('text-start font-medium text-xl text-primary')}>
            {t('pages.login.Please enter the sixdigit verification code')}
          </Text>
          <Text className={cn('text-start text-sm text-secondary mt-1.5')}>
            {t('pages.login.Verification code sent to', { email: phone ? `+${areaCodeItem?.areaCode}${phone}` : email })}
          </Text>
          <View className={cn('flex flex-col gap-6 mt-[18px]')}>
            <CodeInput
              value={code}
              onChange={(value) => {
                setError(undefined)
                setCode(value)
              }}
            />
          </View>
          <CountDown email={email} phone={phone} areaCodeItem={areaCodeItem} onSendCode={onSendCode} defaultSeconds={defaultSeconds} />
          {error && <Text style={cn('text-start text-sm text-red-500')}>{error}</Text>}
          <View style={cn('flex flex-row justify-end items-center gap-4 self-end')}>
            <Button type="default" loading={false} height={42} className={cn('mt-4 w-[128px] ')} onPress={goback}>
              {t('common.operate.Back')}
            </Button>
            <Button
              type="primary"
              loading={false}
              height={42}
              className={cn('mt-4 w-[128px] ')}
              onPress={() => onSubmit()}
              disabled={disabled}
            >
              {t('common.operate.Continue')}
            </Button>
          </View>
        </View>
      </View>
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Sending')} />
    </View>
  )
}

export const ForgotVerifySection = React.forwardRef(_Section)
