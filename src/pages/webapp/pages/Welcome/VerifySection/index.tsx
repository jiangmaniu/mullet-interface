import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'

import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { ADMIN_HOME_PAGE, APP_MODAL_WIDTH, WEB_HOME_PAGE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import CodeInput from '@/pages/webapp/components/Base/Form/CodeInput'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { login, registerSubmitEmail, registerSubmitPhone, sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'
import { setLocalUserInfo } from '@/utils/storage'
import { useModel } from '@umijs/max'
import { md5 } from 'js-md5'
import { observer } from 'mobx-react'
import type { TypeSection, WELCOME_STEP_TYPES } from '..'
export interface FormData {
  email?: string
  phone?: string
  password: string
  areaCode?: string
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
  email?: string
  phone?: string
  password?: string
  areaCode?: string
  countryList: Common.AreaCodeItem[]
}

const CountDown = observer(({ onSendCode, defaultSeconds }: { onSendCode: () => void; defaultSeconds: number }) => {
  const { t } = useI18n()
  const { cn } = useTheme()
  const { global } = useStores()
  const ENV = getEnv()

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
            <Text className={cn('text-start text-sm !text-blue-600 ml-1')}>{t('pages.login.Resend')}</Text>
          </View>
        </>
      ) : (
        <Text className={cn('text-start text-sm text-weak')}>
          {t('pages.login.Please try again after seconds', { second: global.verifyCodeDown })}
        </Text>
      )}
    </View>
  )
})

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  { setSection, startAnimation, email, phone, areaCode, password, countryList }: Props,
  ref
) => {
  const ENV = getEnv()
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const { fetchUserInfo } = useModel('user')
  const defaultSeconds = 60

  useLayoutEffect(() => {
    startAnimation?.(24)
  }, [])

  /** 拦截系统返回操作 */
  const goback = () => {
    setSection('register')
    return true
  }
  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({ goback }))

  // 拦截平台/系统返回操作
  // useGoBackHandler(goback, [])

  const [code, setCode] = useState<string>()
  const [isRegistering, setIsRegistering] = useState(false)
  const disabled = code?.length !== 6 || isRegistering
  const { global } = useStores()

  const loadingRef = useRef<ModalLoadingRef>(null)
  const [tips, setTips] = useState('')

  const areaCodeItem = countryList.find((item) => item.areaCode === areaCode)

  // 登录
  const onSubmit = async () => {
    // const loging = dialog(<LottieLoading tips={t('pages.login.Registering')} />)
    loadingRef.current?.show(() => {
      setTips(t('pages.login.Registering'))
    })

    if ((!email && (!phone || !areaCode)) || !code || !password) {
      message.info('error')
      loadingRef.current?.close()
      return
    }

    try {
      const body = {
        code: ENV.REGISTER_APP_CODE as string,
        country: areaCodeItem?.abbr,
        password: md5(password),
        validateCode: Number(code)
      }
      const isPhoneRegister = global.registerWay === 'PHONE' && phone

      let result: API.Response<any> | undefined
      setIsRegistering(true)
      if (global.registerWay === 'EMAIL' && email) {
        result = await registerSubmitEmail({
          emailOrPhone: email,
          ...body
        })
      } else if (isPhoneRegister) {
        result = await registerSubmitPhone({
          emailOrPhone: phone,
          phoneAreaCode: `+${areaCode}`,
          ...body
        })
      }

      if (result?.success) {
        // 等待两秒
        await new Promise((resolve) => setTimeout(resolve, 2000))

        global.countDownVerifyCode(-1)
        message.info(t('pages.login.Register success'))
        // setSection('login')
        // 自动登录跳转到账户列表选择页

        // 自动登录(无需验证码方式)
        const result = await login({
          username: isPhoneRegister ? phone : email,
          password: body.password,
          phoneAreaCode: isPhoneRegister ? areaCode : undefined,
          tenanId: '000000',
          type: 'account',
          grant_type: 'password',
          scope: 'all'
        })

        if (result?.success) {
          // 缓存用户信息
          setLocalUserInfo(result)
          // 重新获取用户信息
          const currentUser = await fetchUserInfo()
          // 跳转到账户选择页面
          // push('/app/account/select')
          const hasAccount = Number(currentUser?.accountList?.filter((item) => !item.isSimulate)?.length) > 0
          const jumpPath = hasAccount ? WEB_HOME_PAGE : ADMIN_HOME_PAGE
          setTimeout(() => {
            push(jumpPath)
          }, 200)
        }
      }
    } catch (error: any) {
      setIsRegistering(false)
    } finally {
      setIsRegistering(false)
      loadingRef.current?.close()
    }
  }

  const onSendCode = async () => {
    if (!email && !phone) return

    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />
    loadingRef.current?.show(() => {
      setTips(t('pages.login.Sending'))
    })

    try {
      let result: API.Response<any> | undefined
      if (email) {
        result = await sendCustomEmailCode({
          email: email
        })
      } else if (phone) {
        result = await sendCustomPhoneCode({
          phone: phone,
          phoneAreaCode: areaCode ? `+${areaCode}` : ''
        })
      }

      if (result?.success) {
        global.countDownVerifyCode(defaultSeconds)
      }
    } catch (error: any) {
    } finally {
      // Portal.remove(loging)
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
          <Text className={cn('text-start text-sm !text-secondary mt-1.5')}>
            {t('pages.login.Verification code sent to', { email: global.registerWay === 'PHONE' ? `+${areaCode}${phone}` : email })}
          </Text>
          <View className={cn('flex flex-col  mt-[18px]')}>
            <CodeInput value={code} onChange={setCode} />
          </View>
          <CountDown onSendCode={onSendCode} defaultSeconds={defaultSeconds} />
          <View className={cn('flex flex-row justify-end items-center gap-4 self-end')}>
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
              {t('common.operate.Register')}
            </Button>
          </View>
        </View>
      </View>
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={tips} />
    </View>
  )
}

export const VerifySection = React.forwardRef(_Section)
