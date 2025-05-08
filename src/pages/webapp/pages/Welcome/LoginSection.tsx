import { zodResolver } from '@hookform/resolvers/zod'
import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import {
  setLocalUserInfo,
  STORAGE_GET_ACCOUNT_PASSWORD,
  STORAGE_REMOVE_ACCOUNT_PASSWORD,
  STORAGE_SET_ACCOUNT_PASSWORD
} from '@/utils/storage'
import type { TypeSection, WELCOME_STEP_TYPES } from '.'

import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH, DEFAULT_AREA_CODE } from '@/constants'
import { stores } from '@/context/mobxProvider'
import { login } from '@/services/api/user'
import { regMobile } from '@/utils'
import { validateNonEmptyFieldsRHF } from '@/utils/form'
import { useModel, useSearchParams } from '@umijs/max'
import { Checkbox } from 'antd'
import { md5 } from 'js-md5'
import { TextField } from '../../components/Base/Form/TextField'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import SelectCountryModal, { ModalRef } from '../UserCenter/Kyc/comp/SelectCountryModal'
interface FormData {
  tenanId: string
  tenanName: string
  password: string
  remember: boolean
  email?: string
  phone?: string
  areaCode?: string
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  tenanId?: string
  setTenanId: (tenanId: string) => void
  tenanName?: string
  setTenanName: (tenanName: string) => void
  startAnimation?: (toValue: number) => void
  email?: string
  setEmail: (email: string) => void
  phone?: string
  setPhone: (phone: string) => void
  areaCode?: string
  setAreaCode: (areaCode: string) => void
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  {
    setSection,
    tenanId: tenanIdProps,
    setTenanId,
    tenanName: tenanNameProps,
    setTenanName,
    startAnimation,
    email: emailProps,
    setEmail,
    phone: phoneProps,
    setPhone,
    areaCode: areaCodeProps,
    setAreaCode
  }: Props,
  ref
) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const user = useModel('user')

  const [query] = useSearchParams()
  const userType = query.get('userType') as string
  const registerWay = userType === '5' ? 'PHONE' : stores.global.registerWay

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
  const [loadingTips, setLoadingTips] = useState('')

  // 登录
  const onSubmit = async (values: User.LoginParams & { email?: string; phone?: string; areaCode?: string }) => {
    loadingRef.current?.show(() => {
      setLoadingTips(t('pages.login.Logining'))
    })

    try {
      const result = await login({
        username: registerWay === 'EMAIL' ? values.email?.trim() : values.phone?.trim(),
        phoneAreaCode: registerWay === 'PHONE' ? `+${values.areaCode}` : '',
        password: md5(values.password as string),
        tenanId: '000000',
        type: 'account',
        // grant_type: 'captcha',
        grant_type: 'password',
        scope: 'all'
      })

      if (result?.success) {
        // message.info(t('msg.success.Login'))
        // 缓存用户信息
        await setLocalUserInfo(result as User.UserInfo)
        // 重新获取用户信息
        await user.handleLoginSuccess(result as User.UserInfo)

        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        // console.log('result', result)
        // // 刷新验证码
        // handleCaptcha()
        // setLoading(false)
      }
    } catch (error: any) {
    } finally {
      loadingRef.current?.close()
    }
  }

  /** 拦截系统返回操作 */
  const goback = () => {
    // confirm(t('msg.confirm.Cancel login?'), t('msg.title.Cancel login'), () => {
    //   setSection('server')
    // })
    // setSection('server')

    return true
  }
  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({ goback }))

  // 拦截平台/系统返回操作
  // useGoBackHandler(goback, [])

  /** 表单控制 */
  const schema = z.object({
    phone:
      registerWay === 'PHONE'
        ? z.string().refine((value) => regMobile.test(value), { message: t('pages.login.Phone placeholder') })
        : z.string().optional(),
    // areaCode:
    //   registerWay === 'PHONE' ? z.string().min(1, { message: t('pages.login.Residence Country is required') }) : z.string().optional(),
    email: registerWay === 'EMAIL' ? z.string().email({ message: t('pages.login.Email placeholder') }) : z.string().optional(),
    password: z
      .string()
      .min(6, { message: t('pages.login.Password min', { count: 6 }) })
      .refine((value) => /[a-z]/.test(value), { message: t('pages.login.Password lowercase') })
      .refine((value) => /[A-Z]/.test(value), { message: t('pages.login.Password uppercase') })
      // .refine((value) => /[0-9]/.test(value), { message: t('pages.login.Password number') })
      .refine((value) => /[\W_]/.test(value), { message: t('pages.login.Password symbol') }),
    remember: z.boolean().optional()
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: async () => ({
      tenanId: tenanIdProps || (await STORAGE_GET_ACCOUNT_PASSWORD('tenanId')),
      tenanName: tenanNameProps || (await STORAGE_GET_ACCOUNT_PASSWORD('tenanName')),
      email: emailProps || (await STORAGE_GET_ACCOUNT_PASSWORD('email')) || '',
      password: (await STORAGE_GET_ACCOUNT_PASSWORD('password')) || '',
      remember: (await STORAGE_GET_ACCOUNT_PASSWORD('remember')) || false,
      phone: phoneProps || (await STORAGE_GET_ACCOUNT_PASSWORD('phone')) || '',
      areaCode: areaCodeProps || (await STORAGE_GET_ACCOUNT_PASSWORD('areaCode')) || DEFAULT_AREA_CODE
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    validateNonEmptyFieldsRHF(errors, trigger)
  }, [locale])

  const tenanId = watch('tenanId')
  const tenanName = watch('tenanName')
  const email = watch('email')
  const password = watch('password')
  const remember = watch('remember')
  const phone = watch('phone')
  const areaCode = watch('areaCode')
  // 用 useRef 来存储旧的状态
  const prevRemember = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    /** 更新服务器选项 */
    if (tenanNameProps) setValue('tenanName', tenanNameProps)
    if (tenanIdProps) setValue('tenanId', tenanIdProps)
    if (emailProps) setValue('email', emailProps)
  }, [tenanNameProps, tenanIdProps, emailProps])

  useEffect(() => {
    /** 如果 remember 为 true，则账号密码变更时，将账号密码存储到本地 */
    if (remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
        tenanId,
        tenanName,
        email,
        password,
        remember,
        phone,
        areaCode
      })
      setEmail?.(email || '')
      setPhone?.(phone || '')
      setAreaCode?.(areaCode || '')
    }
  }, [tenanId, tenanName, email, password, phone, areaCode])

  useEffect(() => {
    const _prevRemembr = prevRemember.current

    if (remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
        tenanId,
        tenanName,
        email,
        password,
        remember,
        phone,
        areaCode
      })
      // 触发表单验证
      // trigger('email')
      // trigger('phone')
      // trigger('areaCode')
      // trigger('password')
    } else if (_prevRemembr) {
      STORAGE_REMOVE_ACCOUNT_PASSWORD()
    }
    prevRemember.current = remember
  }, [remember])

  const selectCountryModalRef = useRef<ModalRef>(null)
  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      setValue('areaCode', item.areaCode)
      setAreaCode?.(item.areaCode)
      trigger('areaCode')
    }
  }

  return (
    <View className={cn('flex-1 flex flex-col justify-between mb-1')}>
      <View>
        <View className={cn('flex flex-col gap-5 mb-5')}>
          {registerWay === 'EMAIL' && (
            <TextField
              value={email}
              onChange={(val) => {
                setValue('email', val?.trim())
                setEmail?.(val?.trim())

                if (errors.email) {
                  trigger('email')
                }
              }}
              label={t('pages.login.Email placeholder')}
              // RightLabel={() => RightLabel}
              placeholder={t('pages.login.Email placeholder')}
              height={50}
              autoCapitalize="none"
              autoComplete="password"
            />
          )}
          {!!errors.email && <Text className={cn('text-sm !text-red-500 -mt-2')}>{errors.email.message}</Text>}
          {registerWay === 'PHONE' && (
            <TextField
              value={phone}
              onChange={(val) => {
                setValue('phone', val?.trim())
                setPhone?.(val?.trim())

                if (errors.phone) {
                  trigger('phone')
                }
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
            />
          )}
          {!!errors.phone && <Text className={cn('text-sm !text-red-500 -mt-2')}>{errors.phone.message}</Text>}
          {/* {!!errors.areaCode && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.areaCode.message}</Text>} */}

          <TextField
            ref={authPasswordInput}
            value={password}
            onChange={(val) => {
              setValue('password', val?.trim())
              // trigger('password')
              if (errors.password) {
                trigger('password')
              }
            }}
            label={t('pages.login.Password')}
            placeholder={t('pages.login.Password placeholder')}
            height={50}
            // status={errors.password ? 'error' : undefined}
            // style={[$textFieldStyle]}
            // LeftAccessory={() => <Icon icon="input-password" size={20} containerStyle={{ marginLeft: spacing.small }} />}
            autoCapitalize="none"
            autoComplete="password"
            // autoCorrect={false}
            // secureTextEntry={isAuthPasswordHidden}
            // label="Password"
            // helper={errors?.userPassword}
            // status={errors?.userPassword ? "error" : undefined}
            // onSubmitEditing={() => {
            //   // todo
            // }}
            type={isAuthPasswordHidden}
            RightAccessory={PasswordRightAccessory}
          />
          {errors.password && <Text className={cn('text-sm !text-red-500 -mt-2')}>{errors.password.message}</Text>}
          <Checkbox
            checked={remember}
            onChange={(event) => {
              setValue('remember', event.target.checked)
            }}
          >
            <Text className={cn('-left-[15px]')}>{t('pages.login.Remember me')}</Text>
          </Checkbox>
        </View>
        <View className={cn('flex flex-col gap-[15px] text-center')}>
          <Button
            type="primary"
            loading={false}
            height={48}
            className={cn('mt-4')}
            onPress={handleSubmit(onSubmit)}
            disabled={!!errors.email || !!errors.password}
          >
            {t('common.operate.Login')}
          </Button>
          <View onPress={() => setSection('forgotPassword')}>
            <Text className={cn('text-sm text-weak self-center')}>{t('pages.login.Forgot password')}</Text>
          </View>
        </View>
      </View>
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={loadingTips} />

      <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} />
    </View>
  )
}

export const Footer = ({ setSection }: { setSection: (section: WELCOME_STEP_TYPES) => void }) => {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  return (
    <View className={cn('flex flex-col justify-center items-center gap-1.5 mb-10')}>
      <Button
        style={{
          width: 46,
          height: 46,
          borderRadius: 46,
          alignSelf: 'center',
          backgroundColor: theme.colors.backgroundColor.primary
        }}
        onPress={() => {
          setSection('register')
        }}
      >
        <div className="flex items-center justify-center">
          <Icon name="xinjianzhanghu" size={30} />
        </div>
      </Button>
      <Text className=" text-sm">{t('pages.login.Register new account')}</Text>
    </View>
  )
}

export const LoginSection = React.forwardRef(_Section)
