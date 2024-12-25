import { zodResolver } from '@hookform/resolvers/zod'
import { md5 } from 'js-md5'
import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Icon from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { getCaptcha, login } from '@/services/api/user'
import {
  STORAGE_GET_ACCOUNT_PASSWORD,
  STORAGE_REMOVE_ACCOUNT_PASSWORD,
  STORAGE_SET_ACCOUNT_PASSWORD,
  setLocalUserInfo
} from '@/utils/storage'

import Button from '@/components/Base/Button'
import { ModalLoading, ModalLoadingRef } from '@/components/Base/Lottie/Loading'
import { APP_MODAL_WIDTH } from '@/constants'
import { useModel } from '@umijs/max'
import { Checkbox } from 'antd-mobile'
import type { TypeSection, WELCOME_STEP_TYPES } from '.'
import { TextField } from '../../components/Base/Form/TextField'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'

interface FormData {
  username: string
  password: string
  remember: boolean
}

interface Props {
  setSection: (section: WELCOME_STEP_TYPES) => void
  startAnimation?: (toValue: number) => void
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = ({ setSection, startAnimation }: Props, ref) => {
  const { t } = useI18n()
  const { cn, theme } = useTheme()
  const user = useModel('user')

  useLayoutEffect(() => {
    startAnimation?.(24)
  }, [])

  const authPasswordInput = useRef(null)

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
    // const userInfo = await stores.user.fetchUserInfo()
    // return userInfo
  }

  const loadingRef = useRef<ModalLoadingRef | null>(null)

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
        // 缓存用户信息
        setLocalUserInfo(result as User.UserInfo)

        // 重新获取用户信息
        const currentUser = await fetchUserInfo()
        // @ts-ignore
        const hasAccount = currentUser?.accountList?.length > 0
        // const jumpPath = hasAccount ? WEB_HOME_PAGE : ADMIN_HOME_PAGE
        // const jumpPath = ADMIN_HOME_PAGE // 直接跳转到个人中心

        // 重新获取用户信息
        await user.handleLoginSuccess(result as User.UserInfo)

        loadingRef.current?.close()

        return
      } else {
        loadingRef.current?.close()
        // 刷新验证码
        handleCaptcha()
      }
    } catch (error: any) {
      loadingRef.current?.close()
    }
  }

  const [captchaInfo, setCaptchaInfo] = useState({} as User.Captcha)
  const handleCaptcha = async () => {
    const res = await getCaptcha()
    setCaptchaInfo(res)
  }

  /** 拦截系统返回操作 */
  // const goback = () => {
  //   // confirm(t('msg.confirm.Cancel login?'), t('msg.title.Cancel login'), () => {
  //   //   setSection('server')
  //   // })
  //   setSection('server')
  //   return true
  // }
  // 将属性暴露给父元素
  // useImperativeHandle(ref, () => ({ goback }))

  // 拦截平台/系统返回操作
  // useGoBackHandler(goback, [])

  /** 表单控制 */
  const schema = z.object({
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
      username: (await STORAGE_GET_ACCOUNT_PASSWORD('username')) || '',
      password: (await STORAGE_GET_ACCOUNT_PASSWORD('password')) || '',
      remember: (await STORAGE_GET_ACCOUNT_PASSWORD('remember')) || false
    }),
    mode: 'all',
    resolver: zodResolver(schema)
  })
  const username = watch('username')
  const password = watch('password')
  const remember = watch('remember')
  // 用 useRef 来存储旧的状态
  const prevRemember = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    /** 如果 remember 为 true，则账号密码变更时，将账号密码存储到本地 */
    if (remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
        username,
        password,
        remember
      })
    }
  }, [username, password])

  useEffect(() => {
    const _prevRemembr = prevRemember.current

    if (remember) {
      STORAGE_SET_ACCOUNT_PASSWORD({
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
      <View className={cn('flex flex-col gap-6 mb-5')}>
        <View>
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
            // LeftAccessory={() => <Icon icon="input-email" size={20} containerStyle={{ marginLeft: spacing.small }} />}
            autoCapitalize="none"
            autoComplete="email"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          {errors.username && <Text color="red">{errors.username.message}</Text>}
        </View>
        <View>
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
            type={isAuthPasswordHidden}
            RightAccessory={PasswordRightAccessory}
          />
          {errors.password && <Text color="red">{errors.password.message}</Text>}
        </View>
        <Checkbox
          checked={remember}
          onChange={(event) => {
            // setValue('remember', event.target.checked)
            setValue('remember', event)
          }}
        >
          <Text className={cn('-left-[15px]')}>{t('pages.login.Remember me')}</Text>
        </Checkbox>
      </View>
      <View className={cn('flex flex-col gap-[18px]')}>
        <Button
          type="primary"
          loading={false}
          height={48}
          // containerStyle={cn('mt-4')}
          onPress={handleSubmit(onSubmit)}
          disabled={!!errors.username || !!errors.password}
        >
          {t('common.operate.Login')}
        </Button>
        <View className="text-center" onClick={() => setSection('forgotPassword')}>
          <Text className={cn('text-sm text-weak self-center')}>{t('pages.login.Forgot password')}</Text>
        </View>
      </View>

      <View className={cn('flex flex-col justify-center items-center gap-2.5 mt-20')}>
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

      <ModalLoading width={APP_MODAL_WIDTH} ref={loadingRef} tips={t('pages.login.Logining')} />
    </View>
  )
}

export const LoginSection = React.forwardRef(_Section)
