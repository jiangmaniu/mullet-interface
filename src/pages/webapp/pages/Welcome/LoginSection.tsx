import { zodResolver } from '@hookform/resolvers/zod'
import { md5 } from 'js-md5'
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

import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { login } from '@/services/api/user'
import { useModel } from '@umijs/max'
import { Checkbox } from 'antd'
import { TextField } from '../../components/Base/Form/TextField'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
interface FormData {
  tenanId: string
  tenanName: string
  username: string
  password: string
  remember: boolean
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  tenanId?: string
  setTenanId: (tenanId: string) => void
  tenanName?: string
  setTenanName: (tenanName: string) => void
  startAnimation?: (toValue: number) => void
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (
  { setSection, tenanId: tenanIdProps, setTenanId, tenanName: tenanNameProps, setTenanName, startAnimation }: Props,
  ref
) => {
  const { t } = useI18n()
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

  const loadingRef = useRef<ModalLoadingRef>(null)

  // 登录
  const onSubmit = async (values: User.LoginParams) => {
    // const loging = dialog(<LottieLoading tips={t('pages.login.Logining')} />)
    loadingRef.current?.show()

    try {
      const result = await login({
        username: values.username?.trim(),
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

        await new Promise((resolve) => setTimeout(resolve, 2000))
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
    // tenanId: z.string().min(1, { message: t('pages.login.Server placeholder') }),
    // 非必需
    // tenanId: z.string().optional(),
    // tenanName: z.string().min(1, { message: t('pages.login.Server placeholder') }),
    // username: z.string().email({ message: t('pages.login.Customer NO placeholder') }),
    username: z.string().min(1, { message: t('LoginSection.Customer NO Tips') }),
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
      username: (await STORAGE_GET_ACCOUNT_PASSWORD('username')) || '',
      password: (await STORAGE_GET_ACCOUNT_PASSWORD('password')) || '',
      remember: (await STORAGE_GET_ACCOUNT_PASSWORD('remember')) || false
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const tenanId = watch('tenanId')
  const tenanName = watch('tenanName')
  const username = watch('username')
  const password = watch('password')
  const remember = watch('remember')
  // 用 useRef 来存储旧的状态
  const prevRemember = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    /** 更新服务器选项 */
    if (tenanNameProps) setValue('tenanName', tenanNameProps)
    if (tenanIdProps) setValue('tenanId', tenanIdProps)
  }, [tenanNameProps, tenanIdProps])

  useEffect(() => {
    /** 如果 remember 为 true，则账号密码变更时，将账号密码存储到本地 */
    if (remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
        tenanId,
        tenanName,
        username,
        password,
        remember
      })
    }
  }, [tenanId, tenanName, username, password])

  useEffect(() => {
    const _prevRemembr = prevRemember.current

    if (remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
        tenanId,
        tenanName,
        username,
        password,
        remember
      })
      // 触发表单验证
      trigger('username')
      trigger('password')
    } else if (_prevRemembr) {
      STORAGE_REMOVE_ACCOUNT_PASSWORD()
    }
    prevRemember.current = remember
  }, [remember])

  return (
    <View className={cn('flex-1 flex flex-col justify-between mb-1')}>
      <View>
        <View className={cn('flex flex-col gap-5 mb-5')}>
          <TextField
            value={username}
            onChange={(val) => {
              setValue('username', val?.trim())
              trigger('username')
            }}
            // status={errors.username ? 'error' : undefined}
            label={t('pages.login.Customer NO')}
            placeholder={t('LoginSection.Customer NO placeholder')}
            height={50}
            autoCapitalize="none"
            autoComplete="email"
            // autoCorrect={false}
            // keyboardType="email-address"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          {errors.username && <Text color="red">{errors.username.message}</Text>}
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
          {errors.password && <Text color="red">{errors.password.message}</Text>}
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
            disabled={!!errors.username || !!errors.password}
          >
            {t('common.operate.Login')}
          </Button>
          <View onPress={() => setSection('forgotPassword')}>
            <Text className={cn('text-sm text-weak self-center')}>{t('pages.login.Forgot password')}</Text>
          </View>
          <View className={cn('flex flex-col justify-center items-center gap-2.5 mt-4')}>
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
              <Icon name="xinjianzhanghu" size={30} />
            </Button>
            <Text>{t('pages.login.Register new account')}</Text>
          </View>
        </View>
      </View>
      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Logining')} />
    </View>
  )
}

export const LoginSection = React.forwardRef(_Section)
