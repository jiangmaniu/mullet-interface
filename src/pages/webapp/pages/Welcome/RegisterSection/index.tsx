import { zodResolver } from '@hookform/resolvers/zod'
import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import { STORAGE_GET_ACCOUNT_PASSWORD, STORAGE_SET_ACCOUNT_PASSWORD } from '@/utils/storage'
import type { TypeSection, WELCOME_STEP_TYPES } from '..'

import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import { View } from '@/pages/webapp/components/Base/View'
import PasswordTips from './PasswordTips'
import { PrivacyPolicyService } from './PrivacyPolicyService'
// import type { ModalRef } from './SelectCountryModal'
// import SelectCountryModal from './SelectCountryModal'

import Iconfont from '@/components/Base/Iconfont'
import Button from '@/pages/webapp/components/Base/Button'
import { Text } from '@/pages/webapp/components/Base/Text'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'

export interface FormData {
  email?: string
  phone?: string
  password: string
  areaCodeItem?: Common.AreaCodeItem
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
  email?: string
  phone?: string
  setEmail?: (email: string) => void
  setPhone?: (phone: string) => void
  areaCodeItem?: Common.AreaCodeItem
  setAreaCodeItem: (areaCodeItem: Common.AreaCodeItem | undefined) => void
  setPassword: (password: string) => void
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  {
    setSection,
    startAnimation,
    email: emailProps,
    setEmail,
    phone: phoneProps,
    setPhone,
    areaCodeItem: areaCodeItemProps,
    setAreaCodeItem,
    setPassword
  }: Props,
  ref
) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()

  useLayoutEffect(() => {
    startAnimation?.(24)
  }, [])

  const authPasswordInput = useRef(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: any) {
        return (
          <Iconfont
            name={isAuthPasswordHidden ? 'biyan' : 'chakanmima'}
            size={32}
            {...props}
            onClick={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden]
  )

  const loadingRef = useRef<any>(null)

  // 登录
  const onSubmit = async (values: FormData) => {
    loadingRef.current?.show()

    try {
      let result: API.Response<any> | undefined
      if (registerWay === 'EMAIL') {
        result = await sendCustomEmailCode({
          email: values.email
        })
      } else if (registerWay === 'PHONE') {
        result = await sendCustomPhoneCode({
          phone: values.phone,
          phoneAreaCode: values.areaCodeItem?.areaCode
        })
      }

      if (result?.success) {
        setSection('verify')
      }
    } catch (error: any) {
    } finally {
      loadingRef.current?.close()
    }
  }

  /** 拦截系统返回操作 */
  const goback = (event: any) => {
    event.preventDefault() // 阻止返回操作

    setSection('login')
  }

  // 在组件的生命周期或者在合适的地方添加监听器
  useEffect(() => {
    // 拦截平台/系统返回操作
    window.addEventListener('popstate', goback)
    // 清理副作用
    return () => {
      window.removeEventListener('popstate', goback)
    }
  }, [])

  const registerWay = stores.global.registerWay

  /** 表单控制 */
  const schema = z.object({
    areaCodeItem: z.object(
      {
        id: z.string().min(1, { message: t('pages.login.Residence Country is required') }),
        areaCode: z.string().min(1, { message: t('pages.login.Residence Country is required') })
      },
      { message: t('pages.login.Residence Country is required') }
    ),
    phone: registerWay === 'PHONE' ? z.string().min(1, { message: t('pages.login.Phone is required') }) : z.string().optional(),
    email: registerWay === 'EMAIL' ? z.string().email({ message: t('pages.login.Email placeholder') }) : z.string().optional(),
    password: z
      .string()
      .min(6, { message: t('pages.login.Password min', { count: 6 }) })
      .refine((value) => /[a-z]/.test(value), { message: t('pages.login.Password lowercase') })
      .refine((value) => /[A-Z]/.test(value), { message: t('pages.login.Password uppercase') })
      // .refine((value) => /[0-9]/.test(value), { message: t('pages.login.Password number') })
      .refine((value) => /[\W_]/.test(value), { message: t('pages.login.Password symbol') })
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: async () => ({
      email: emailProps || '',
      phone: phoneProps || '',
      password: (await STORAGE_GET_ACCOUNT_PASSWORD('password')) || '',
      areaCodeItem: areaCodeItemProps || undefined
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const password = watch('password')
  const areaCodeItem = watch('areaCodeItem')
  const email = watch('email')
  const phone = watch('phone')
  useEffect(() => {
    /** 如果 remember 为 true，则账号密码变更时，将账号密码存储到本地 */
    const updatePassword = async () => {
      setPassword(password)
      const stores = await STORAGE_GET_ACCOUNT_PASSWORD()
      if (stores.remember) {
        STORAGE_SET_ACCOUNT_PASSWORD({
          tenanId: stores.tenanId,
          tenanName: stores.tenanName,
          username: stores.username,
          remember: stores.remember,
          password
        })
      }
    }
    updatePassword()
  }, [password])

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    /** 更新 */
    if (areaCodeItemProps) setValue('areaCodeItem', areaCodeItemProps)
    if (emailProps) setValue('email', emailProps)
    if (phoneProps) setValue('phone', phoneProps)
  }, [areaCodeItemProps, emailProps, phoneProps])

  // const selectCountryModalRef = useRef<ModalRef>(null)
  const selectCountryModalRef = useRef<any>(null)
  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      setValue('areaCodeItem', item)
      setAreaCodeItem(item)

      trigger('areaCodeItem')
    }
  }

  return (
    <View style={cn('flex-1 flex flex-col justify-between ')}>
      <View>
        <View style={cn('flex flex-col gap-5 mb-5')}>
          <TextField
            value={areaCodeItem ? `(${areaCodeItem.areaCode}) ${locale === 'zh-TW' ? areaCodeItem?.nameCn : areaCodeItem?.nameEn}` : ''}
            label={t('pages.login.Residence Country')}
            height={50}
            autoCapitalize="none"
            onClick={() => {
              selectCountryModalRef.current?.show()
            }}
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
            RightAccessory={() => <Icon name="qiehuanzhanghu-xiala" size={20} style={{ marginRight: 16 }} />}
          />
          {errors.areaCodeItem && <Text color="red">{errors.areaCodeItem.message}</Text>}
          {registerWay === 'EMAIL' && (
            <TextField
              value={email}
              onChange={(val: string) => {
                setValue('email', val?.trim())
                setEmail?.(val?.trim())
              }}
              onEndEditing={(val) => {
                trigger('email')
              }}
              label={t('pages.login.Email Address')}
              placeholder={t('pages.login.Email placeholder')}
              height={50}
              autoCapitalize="none"
              autoComplete="email"
              // autoCorrect={false}
              // keyboardType="email-address"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          )}
          {errors.email && <Text color="red">{errors.email.message}</Text>}
          {registerWay === 'PHONE' && (
            <TextField
              value={phone}
              onChange={(val) => {
                setValue('phone', val?.trim())
                setPhone?.(val?.trim())
              }}
              onEndEditing={(val) => {
                trigger('phone')
              }}
              label={t('pages.login.Phone')}
              placeholder={t('pages.login.Phone placeholder')}
              height={50}
              autoCapitalize="none"
              // autoCorrect={false}
              // keyboardType="phone-pad"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          )}
          {errors.phone && <Text color="red">{errors.phone.message}</Text>}
          <View>
            <TextField
              ref={authPasswordInput}
              value={password}
              onChange={(val) => {
                setValue('password', val?.trim())
              }}
              onEndEditing={(val) => {
                trigger('password')
              }}
              label={t('pages.login.Password')}
              placeholder={t('pages.login.Password placeholder')}
              height={50}
              autoCapitalize="none"
              autoComplete="password"
              // autoCorrect={false}
              // secureTextEntry={isAuthPasswordHidden}
              // onSubmitEditing={() => {}}
              RightAccessory={PasswordRightAccessory}
            />
            <PasswordTips
              pwd={password}
              setDisabledCallBack={(flag: boolean) => {
                setDisabled(flag)
              }}
            />
          </View>
        </View>
        <Button
          type="primary"
          loading={false}
          height={48}
          className={cn('mt-4')}
          onClick={handleSubmit(onSubmit)}
          disabled={!!errors.email || !!errors.password || !!errors.areaCodeItem || disabled}
        >
          {t('pages.login.Continue')}
        </Button>
        <PrivacyPolicyService />
      </View>

      {/* <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} /> */}
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Sending')} />
    </View>
  )
}

export const RegisterSection = React.forwardRef(_Section)
