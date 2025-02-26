import { zodResolver } from '@hookform/resolvers/zod'
import type { ForwardRefRenderFunction } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Base/Button'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import { STORAGE_GET_ACCOUNT_PASSWORD, STORAGE_SET_ACCOUNT_PASSWORD } from '@/utils/storage'
import type { TypeSection, WELCOME_STEP_TYPES } from '..'

import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH, DEFAULT_AREA_CODE } from '@/constants'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'
import { regEmail } from '@/utils'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import SelectCountryModal, { ModalRef } from '../../UserCenter/Kyc/comp/SelectCountryModal'
import PasswordTips from './PasswordTips'
import { PrivacyPolicyService } from './PrivacyPolicyService'

export interface FormData {
  email?: string
  phone?: string
  password: string
  areaCode?: string
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
  phone?: string
  setPhone?: (phone: string) => void
  areaCode?: string
  setAreaCode?: (areaCode: string) => void
  setPassword: (password: string) => void
  email?: string
  setEmail?: (email: string) => void
  countryList: Common.AreaCodeItem[]
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  {
    setSection,
    startAnimation,
    phone: phoneProps,
    setPhone,
    areaCode: areaCodeProps,
    setAreaCode,
    setPassword,
    email: emailProps,
    setEmail,
    countryList
  }: Props,
  ref
) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()

  const user = useModel('user')

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

  const fetchUserInfo = async () => {
    const userInfo = await user.fetchUserInfo()
    return userInfo
  }

  const loadingRef = useRef<ModalLoadingRef>(null)

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
          phoneAreaCode: values.areaCode
        })
      }

      if (result?.success) {
        setPhone?.(values.phone || '')
        setAreaCode?.(values.areaCode || '')
        setEmail?.(values.email || '')
        setPassword(values.password || '')
        setSection('verify')
      }
    } catch (error: any) {
    } finally {
      // Portal.remove(loging)
      loadingRef.current?.close()
    }
  }

  /** 拦截系统返回操作 */
  const goback = () => {
    setSection('login')
    return true
  }
  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({ goback }))

  // 拦截平台/系统返回操作
  // useGoBackHandler(goback, [])

  const registerWay = stores.global.registerWay

  /** 表单控制 */
  const schema = z.object({
    areaCode:
      registerWay === 'PHONE' ? z.string().min(1, { message: t('pages.login.Residence Country is required') }) : z.string().optional(),
    phone: registerWay === 'PHONE' ? z.string().min(1, { message: t('pages.login.Phone is required') }) : z.string().optional(),
    email:
      registerWay === 'EMAIL'
        ? z.string().refine((value) => regEmail.test(value), { message: t('pages.login.Email placeholder') })
        : z.string().optional(),
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
      email: emailProps || (await STORAGE_GET_ACCOUNT_PASSWORD('email')) || '',
      phone: phoneProps || (await STORAGE_GET_ACCOUNT_PASSWORD('phone')) || '',
      password: (await STORAGE_GET_ACCOUNT_PASSWORD('password')) || '',
      areaCode: areaCodeProps || (await STORAGE_GET_ACCOUNT_PASSWORD('areaCode')) || DEFAULT_AREA_CODE
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const password = watch('password')
  const areaCode = watch('areaCode')
  const email = watch('email')
  const phone = watch('phone')

  useEffect(() => {
    /** 如果 remember 为 true，则账号密码变更时，将账号密码存储到本地 */
    const update = async () => {
      const stores = await STORAGE_GET_ACCOUNT_PASSWORD()
      if (stores.remember) {
        STORAGE_SET_ACCOUNT_PASSWORD({
          tenanId: stores.tenanId,
          tenanName: stores.tenanName,
          username: stores.username,
          remember: stores.remember,
          email: email || stores.email,
          phone: phone || stores.phone,
          areaCode: areaCode || stores.areaCode,
          password: password || stores.password
        })
      }
    }
    update()
  }, [password, email, phone, areaCode])

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    /** 更新 */
    if (areaCodeProps) setValue('areaCode', areaCodeProps)
    if (phoneProps) setValue('phone', phoneProps)
  }, [areaCodeProps, phoneProps])

  const selectCountryModalRef = useRef<ModalRef>(null)
  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      setValue('areaCode', item.areaCode)
      setAreaCode?.(item.areaCode)

      trigger('areaCode')
    }
  }

  const areaCodeItem = countryList.find((item) => item.areaCode === areaCode)

  return (
    <View className={cn('flex-1 flex flex-col justify-between ')}>
      <View className={cn('flex flex-col gap-5 mb-5')}>
        <View
          onClick={() => {
            selectCountryModalRef.current?.show()
          }}
        >
          <TextField
            value={areaCodeItem ? `(+${areaCodeItem.areaCode}) ${locale === 'zh-TW' ? areaCodeItem?.nameCn : areaCodeItem?.nameEn}` : ''}
            label={t('pages.login.Residence Country')}
            height={50}
            readOnly
            autoCapitalize="none"
            // autoCorrect={false}
            // keyboardType="email-address"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
            RightAccessory={() => (
              <Icon
                name="qiehuanzhanghu-xiala"
                size={20}
                style={{ marginRight: 16 }}
                onClick={() => selectCountryModalRef.current?.show()}
              />
            )}
          />
        </View>

        {errors.areaCode && <Text color="red">{errors.areaCode.message}</Text>}
        {registerWay === 'EMAIL' && (
          <TextField
            value={email}
            onChange={(val) => {
              setValue('email', val?.trim())
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
              trigger('phone')
            }}
            label={t('pages.login.Phone')}
            placeholder={t('pages.login.Phone placeholder')}
            height={50}
            autoCapitalize="none"
          />
        )}
        {errors.phone && <Text color="red">{errors.phone.message}</Text>}

        <TextField
          ref={authPasswordInput}
          value={password}
          onChange={(val) => {
            setValue('password', val?.trim())
            trigger('password')
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
          pwd={password}
          setDisabledCallBack={(flag: boolean) => {
            setDisabled(flag)
          }}
        />
      </View>
      <Button
        type="primary"
        loading={false}
        height={48}
        className={cn('mt-4')}
        onPress={handleSubmit(onSubmit)}
        disabled={!!errors.email || !!errors.password || !!errors.areaCode || disabled}
      >
        {t('pages.login.Continue')}
      </Button>
      <PrivacyPolicyService />

      <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} />
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Sending')} />
    </View>
  )
}

const RegisterSection = forwardRef(_Section)

export default observer(RegisterSection)
