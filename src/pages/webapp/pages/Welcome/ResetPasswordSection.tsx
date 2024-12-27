import { zodResolver } from '@hookform/resolvers/zod'
import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import { STORAGE_GET_ACCOUNT_PASSWORD, STORAGE_SET_ACCOUNT_PASSWORD } from '@/utils/storage'
import type { TypeSection, WELCOME_STEP_TYPES } from '.'

import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { useEnv } from '@/context/envProvider'
import { forgetPasswordEmail, forgetPasswordPhone } from '@/services/api/user'
import { cn } from '@/utils/cn'
import { useModel } from '@umijs/max'
import { TextField } from '../../components/Base/Form/TextField'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import { navigateTo } from '../../utils/navigator'
import PasswordTips from './RegisterSection/PasswordTips'

export interface FormData {
  email?: string
  phone?: string
  newPassword: string
  validateCode: string
  areaCodeItem?: Common.AreaCodeItem
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
  email?: string
  phone?: string
  validateCode?: string
  areaCodeItem?: Common.AreaCodeItem
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  {
    setSection,
    startAnimation,
    email: emailProps,
    phone: phoneProps,
    validateCode: validateCodeProps,
    areaCodeItem: areaCodeItemProps
  }: Props,
  ref
) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()

  const { screenSize } = useEnv()

  const user = useModel('user')

  useEffect(() => {
    console.log(emailProps, phoneProps, validateCodeProps, areaCodeItemProps)
  }, [])

  useLayoutEffect(() => {
    startAnimation?.(24)
  }, [])

  const authPasswordInput = useRef<any>(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState('password')
  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: any) {
        return (
          <Icon
            name={isAuthPasswordHidden === 'password' ? 'biyan' : 'chakanmima'}
            size={32}
            {...props}
            onClick={() => setIsAuthPasswordHidden(isAuthPasswordHidden === 'text' ? 'password' : 'text')}
          />
        )
      },
    [isAuthPasswordHidden]
  )

  const loadingRef = useRef<ModalLoadingRef>(null)

  // 登录
  const onSubmit = async (values: FormData) => {
    // const loging = dialog(<LottieLoading tips={t('common.operate.Submit')} />)

    try {
      let result: API.Response<any> | undefined
      if (values.email) {
        result = await forgetPasswordEmail({
          emailOrPhone: values.email || '',
          newPassword: values.newPassword,
          validateCode: Number(values.validateCode)
        })
      } else {
        result = await forgetPasswordPhone({
          emailOrPhone: values.phone || '',
          newPassword: values.newPassword,
          validateCode: Number(values.validateCode)
        })
      }

      if (result?.success) {
        // 等待一秒
        await new Promise((resolve) => setTimeout(resolve, 1000))

        updatePassword()
        navigateTo('/app/reset-success')
        setSection('login')
      }
      console.log('result', result)
    } catch (error: any) {
      console.log('error', error)
    } finally {
      // Portal.remove(loging)
      loadingRef.current?.close()
    }
  }

  /** 拦截系统返回操作 */
  const goback = () => {
    setSection('forgotVerify')
    return true
  }

  // 拦截平台/系统返回操作
  // useGoBackHandler(goback, [])

  // const registerWay = stores.global.registerWay

  /** 表单控制 */
  const schema = z.object({
    areaCodeItem: phoneProps
      ? z.object(
          {
            id: z.string().min(1, { message: t('pages.login.Residence Country is required') }),
            areaCode: z.string().min(1, { message: t('pages.login.Residence Country is required') })
          },
          { message: t('pages.login.Residence Country is required') }
        )
      : z
          .object(
            {
              id: z.string().min(1, { message: t('pages.login.Residence Country is required') }),
              areaCode: z.string().min(1, { message: t('pages.login.Residence Country is required') })
            },
            { message: t('pages.login.Residence Country is required') }
          )
          .optional(),
    validateCode: z.string().min(1, { message: t('pages.login.Verification code is required') }),
    email: emailProps ? z.string().email({ message: t('pages.login.Email is required') }) : z.string().optional(),
    phone: phoneProps ? z.string().min(1, { message: t('pages.login.Phone is required') }) : z.string().optional(),
    newPassword: z
      .string()
      .min(6, { message: t('pages.login.Password min', { count: 6 }) })
      .refine((value) => /[a-z]/.test(value), { message: t('pages.login.Password lowercase') })
      .refine((value) => /[A-Z]/.test(value), { message: t('pages.login.Password uppercase') })
      .refine((value) => /[\W_]/.test(value), { message: t('pages.login.Password symbol') })
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    defaultValues: async () => ({
      areaCodeItem: areaCodeItemProps || undefined,
      email: emailProps || '',
      phone: phoneProps || '',
      validateCode: validateCodeProps || '',
      newPassword: ''
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const newPassword = watch('newPassword')

  const updatePassword = async () => {
    const stores = await STORAGE_GET_ACCOUNT_PASSWORD()
    if (stores?.remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
        tenanId: stores?.tenanId,
        tenanName: stores?.tenanName,
        username: stores?.username,
        remember: stores?.remember,
        password: newPassword
      })
    }
  }

  // useEffect(() => {
  //   /** 如果 remember 为 true，则账号密码变更时，将账号密码存储到本地 */
  //   const updatePassword = async () => {
  //     const stores = await STORAGE_GET_ACCOUNT_PASSWORD()
  //     if (stores.remember) {
  //       STORAGE_SET_ACCOUNT_PASSWORD({
  //         tenanId: stores.tenanId,
  //         tenanName: stores.tenanName,
  //         username: stores.username,
  //         remember: stores.remember,
  //         password: newPassword
  //       })
  //     }
  //   }
  //   updatePassword()
  // }, [newPassword])

  const [pwdisabled, setPWDisabled] = useState(false)

  const propsDisabled = phoneProps
    ? !!errors.phone || !!errors.areaCodeItem || !!errors.validateCode
    : !!errors.email || !!errors.areaCodeItem || !!errors.validateCode

  const disabled = propsDisabled || pwdisabled

  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({ goback, submit: handleSubmit(onSubmit), disabled }))

  useEffect(() => {
    console.log('values', getValues())
    console.log(errors)
  }, [errors])

  useEffect(() => {
    /** 更新 */
    if (areaCodeItemProps) setValue('areaCodeItem', areaCodeItemProps)
    if (emailProps) setValue('email', emailProps)
    if (phoneProps) setValue('phone', phoneProps)
  }, [areaCodeItemProps, emailProps, phoneProps])

  return (
    <View className={cn('flex-1 flex flex-col justify-between mb-12')}>
      <View
        className={cn('flex flex-col gap-6 mb-5')}
        style={{
          height: screenSize.height - 500
        }}
      >
        <TextField
          ref={authPasswordInput}
          value={newPassword}
          onChange={(val) => {
            setValue('newPassword', val?.trim())
          }}
          onEndEditing={(val) => {
            trigger('newPassword')
          }}
          label={t('pages.login.Password')}
          placeholder={t('pages.login.Password placeholder')}
          height={50}
          autoCapitalize="none"
          autoComplete="password"
          // autoCorrect={false}
          type={isAuthPasswordHidden}
          // onSubmitEditing={() => {}}
          RightAccessory={PasswordRightAccessory}
        />

        <PasswordTips
          pwd={newPassword}
          setDisabledCallBack={(flag: boolean) => {
            setPWDisabled(flag)
          }}
        />
      </View>
      {/* <Button type="primary" loading={false} height={48} className={cn('mt-4')} onPress={handleSubmit(onSubmit)} disabled={disabled}>
        {t('common.operate.Confirm')}
      </Button> */}

      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Logining')} />
    </View>
  )
}

export const FooterResetPassword = ({ handleSubmit, disabled }: { handleSubmit: () => void; disabled: boolean }) => {
  const { t } = useI18n()
  return (
    <Button type="primary" loading={false} height={48} className={cn('my-4 w-full')} onPress={handleSubmit} disabled={disabled}>
      {t('common.operate.Confirm')}
    </Button>
  )
}

export const ResetPasswordSection = React.forwardRef(_Section)
