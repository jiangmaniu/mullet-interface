import { zodResolver } from '@hookform/resolvers/zod'
import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Base/Button'
import { stores, useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import type { TypeSection, WELCOME_STEP_TYPES } from '.'

import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH, DEFAULT_AREA_CODE } from '@/constants'
import { sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'
import { cn } from '@/utils/cn'
import { validateNonEmptyFieldsRHF } from '@/utils/form'
import { STORAGE_GET_ACCOUNT_PASSWORD } from '@/utils/storage'
import { useModel } from '@umijs/max'
import { TextField } from '../../components/Base/Form/TextField'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import SelectCountryModal, { ModalRef } from '../UserCenter/Kyc/comp/SelectCountryModal'
export interface FormData {
  email?: string
  phone?: string
  areaCode?: string
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
  email?: string
  phone?: string
  setEmail?: (email: string) => void
  setPhone?: (phone: string) => void
  areaCode?: string
  setAreaCode: (areaCode: string) => void
  setDisabled: (disabled: boolean) => void
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  {
    setSection,
    startAnimation,
    email: emailProps,
    setEmail,
    phone: phoneProps,
    setPhone,
    areaCode: areaCodeProps,
    setAreaCode,
    setDisabled
  }: Props,
  ref
) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()
  const user = useModel('user')
  const { global } = useStores()

  useLayoutEffect(() => {
    startAnimation?.(24)
  }, [])

  const [inputType, setInputType] = useState<API.RegisterWay>(stores.global.registerWay)

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
    // const loging = dialog(<LottieLoading tips={t('pages.login.Sending')} />)
    loadingRef.current?.show()

    try {
      if (stores.global.verifyCodeDown > 0) {
        setPhone?.(values.phone || '')
        setAreaCode?.(values.areaCode || '')
        setEmail?.(values.email || '')
        setSection('forgotVerify')
      } else {
        let result: API.Response<any> | undefined
        if (inputType === 'EMAIL') {
          result = await sendCustomEmailCode({
            email: values.email
          })
        } else if (inputType === 'PHONE') {
          result = await sendCustomPhoneCode({
            phone: values.phone,
            phoneAreaCode: values.areaCode
          })
        }

        if (result?.success) {
          setPhone?.(values.phone || '')
          setAreaCode?.(values.areaCode || '')
          setEmail?.(values.email || '')
          setSection('forgotVerify')
        }
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

  /** 表单控制 */
  const schema = z.object({
    areaCode:
      inputType === 'PHONE' ? z.string().min(1, { message: t('pages.login.Residence Country is required') }) : z.string().optional(),
    phone: inputType === 'PHONE' ? z.string().min(1, { message: t('pages.login.Phone is required') }) : z.string().optional(),
    email: inputType === 'EMAIL' ? z.string().email({ message: t('pages.login.Email placeholder') }) : z.string().optional()
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
      areaCode: areaCodeProps || (await STORAGE_GET_ACCOUNT_PASSWORD('areaCode')) || DEFAULT_AREA_CODE
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    validateNonEmptyFieldsRHF(errors, trigger)
  }, [locale])

  const areaCode = watch('areaCode')
  const email = watch('email')
  const phone = watch('phone')

  useEffect(() => {
    /** 更新 */
    if (emailProps) setValue('email', emailProps)
    if (phoneProps) setValue('phone', phoneProps)
  }, [emailProps, phoneProps])

  const selectCountryModalRef = useRef<ModalRef>(null)
  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      setValue('areaCode', item.areaCode)
      setAreaCode?.(item.areaCode)

      trigger('areaCode')
    }
  }

  // const sendDisabled = global.verifyCodeDown !== -1

  // const RightLabel = useMemo(() => {
  //   return (
  //     <View onPress={() => setInputType(inputType === 'EMAIL' ? 'PHONE' : 'EMAIL')}>
  //       {inputType === 'EMAIL' ? (
  //         <Text style={cn('!text-brand')}>{t('pages.login.Use Phone')}</Text>
  //       ) : (
  //         <Text style={cn('!text-brand')}>{t('pages.login.Use Email')}</Text>
  //       )}
  //     </View>
  //   )
  // }, [inputType])

  const disabled = useMemo(() => {
    return inputType === 'PHONE' ? !!errors.phone || !!errors.areaCode : !!errors.email
  }, [inputType, errors.phone, errors.areaCode, errors.email])

  useEffect(() => {
    setDisabled(disabled)
  }, [disabled])

  // 将属性暴露给父元素
  useImperativeHandle(ref, () => ({ goback, submit: handleSubmit(onSubmit) }))
  return (
    <View className={cn('flex-1 flex flex-col justify-between mb-12')}>
      <View className={cn('flex flex-col mb-5')}>
        {inputType === 'PHONE' ? (
          <>
            <TextField
              value={phone}
              onChange={(val) => {
                stores.global.verifyCodeDown = -1
                setValue('phone', val?.trim())
                setPhone?.(val?.trim())
                trigger('phone')
              }}
              label={t('pages.userCenter.shoujihaoma')}
              // RightLabel={() => RightLabel}
              placeholder={t('pages.userCenter.qingshurushoujihaoma')}
              height={50}
              autoCapitalize="none"
              autoComplete="password"
              // autoCorrect={false}
              // onSubmitEditing={() => {
              //   // todo
              // }}
              LeftAccessory={() => (
                <View className={cn('pl-[15px]')} onPress={() => selectCountryModalRef.current?.show()}>
                  <View className={cn('flex flex-row items-center gap-1')}>
                    <Text>{areaCode ? `+${areaCode}` : t('components.select.Placeholder')}</Text>
                    <Iconfont name="qiehuanzhanghu-xiala" size={24} />
                  </View>
                </View>
              )}
            />
            {!!errors.phone && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.phone.message}</Text>}
          </>
        ) : (
          <>
            <TextField
              value={email}
              onChange={(val) => {
                setValue('email', val?.trim())
                setEmail?.(val?.trim())
                trigger('email')
              }}
              label={t('pages.login.Email placeholder')}
              // RightLabel={() => RightLabel}
              placeholder={t('pages.login.Email placeholder')}
              height={50}
              autoCapitalize="none"
              autoComplete="password"
              // autoCorrect={false}
              // onSubmitEditing={() => {
              //   // todo
              // }}
            />
            {!!errors.email && <Text className={cn('text-sm !text-red-500 mt-1')}>{errors.email.message}</Text>}
          </>
        )}
      </View>
      {/* <Button type="primary" loading={false} height={48} className={cn('mt-4')} onPress={handleSubmit(onSubmit)} disabled={disabled}>
        {t('pages.login.Get Verification Code')}
      </Button> */}

      <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} />
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Sending')} />
    </View>
  )
}

export const FooterForgotPassword = ({ handleSubmit, disabled }: { handleSubmit: () => void; disabled: boolean }) => {
  const { t } = useI18n()
  return (
    <Button type="primary" loading={false} height={48} className={cn('my-4 w-full')} onPress={handleSubmit} disabled={disabled}>
      {t('pages.login.Get Verification Code')}
    </Button>
  )
}

export const ForgotPasswordSection = React.forwardRef(_Section)
