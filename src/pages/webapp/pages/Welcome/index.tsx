import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { default as Icon, default as Iconfont } from '@/components/Base/Iconfont'
import { useEnv } from '@/context/envProvider'
import ENV from '@/env'
import { capitalizeFirstLetter } from '@/utils/str'
import { useLocation } from '@umijs/max'
import Header from '../../components/Base/Header'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import Basiclayout from '../../layouts/BasicLayout'
import { ForgotPasswordSection } from './ForgotPasswordSection'
import { ForgotVerifySection } from './ForgotVerifySection'
import { LoginSection } from './LoginSection'
import { RegisterSection } from './RegisterSection'
import { ResetPasswordSection } from './ResetPasswordSection'
import { VerifySection } from './VerifySection'

export const FOOTER_BOTTOM = 100

export type WELCOME_STEP_TYPES =
  // | 'server'
  | 'login'
  | 'register'
  | 'verify'
  | 'forgotPassword' // 忘記密碼
  | 'forgotVerify' // 忘記密碼驗證
  | 'resetPassword' // 重置密碼

interface SECTION_TYPE {
  // header: ReactElement
  section: ReactElement
}

type RecordType = {
  [key in WELCOME_STEP_TYPES]?: SECTION_TYPE // 假设值是字符串类型
}

export interface TypeSection {
  goback: () => void
}

export interface SectionProps {
  setSection: any
  username: any
  setUsername: any
  password: any
  setSubTitle?: any
  startAnimation?: (toValue: number) => void
  areaCodeItem?: Common.AreaCodeItem
  setAreaCodeItem?: (areaCodeItem: Common.AreaCodeItem | undefined) => void
  email?: string
  setEmail?: (email: string) => void
}

export default function WelcomeScreen() {
  const { cn, theme } = useTheme()
  const { t, loadLocale, locale } = useI18n()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const _section = params?.get('section') as WELCOME_STEP_TYPES

  const { screenSize } = useEnv()

  // TODO: 缓存
  // const current = useCurrentAccount()

  const [section, setSection] = useState<WELCOME_STEP_TYPES>(_section ?? 'login')
  const [isLoading, setIsLoading] = useState(false)

  const [tenanId, setTenanId] = useState<string>()
  const [tenanName, setTenanName] = useState<string>('')
  const [email, setEmail] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [areaCodeItem, setAreaCodeItem] = useState<Common.AreaCodeItem>()
  const [password, setPassword] = useState<string>()
  const [validateCode, setValidateCode] = useState<string>()

  const sectionRef = useRef<TypeSection | null>(null)
  const gobackHandler = (e: any) => {
    e.preventDefault()
    console.log('gobackHandler', e)
    sectionRef.current?.goback()
    return true
  }

  useEffect(() => {
    window.addEventListener('popstate', gobackHandler)
    return () => window.removeEventListener('popstate', gobackHandler)
  }, [])

  // TODO: 版本更新的方法， 不允许打包进发布版本中

  //  背景动画
  // const [scrollY, setScrollY] = useState(new Value(0))

  // // 定义动画函数
  const startAnimation = (toValue: number) => {
    // timing(scrollY, {
    //   toValue, // 动画结束时的值
    //   duration: 180, // 动画持续时间，单位为毫秒
    //   easing: Easing.out(Easing.quad), // 先快后慢的缓动效果
    //   useNativeDriver: false // 如果动画作用于非样式属性，比如数值，useNativeDriver必须为false
    // }).start()
  }

  // const coverMov = scrollY.interpolate({
  //   inputRange: [0, 100],
  //   outputRange: [0, -100]
  // })

  // const opacity = scrollY.interpolate({
  //   inputRange: [0, 10, 100],
  //   outputRange: [1, 1, 0]
  // })

  // const opacityReverse = scrollY.interpolate({
  //   inputRange: [0, 10, 100],
  //   outputRange: [0, 1, 1]
  // })

  const actions = [
    { key: 'en-US', text: t('common.language.en-US') },
    { key: 'zh-TW', text: t('common.language.zh-TW') },
    { key: 'vi-VN', text: t('common.language.vi-VN') }
  ]

  const sections: Record<WELCOME_STEP_TYPES, ReactElement> = {
    login: (
      <LoginSection
        ref={sectionRef}
        tenanId={tenanId}
        setTenanId={setTenanId}
        tenanName={tenanName}
        setTenanName={setTenanName}
        setSection={setSection}
        startAnimation={startAnimation}
      />
    ),
    // server: (
    //   <ServerSection
    //     tenanId={tenanId}
    //     setTenanId={setTenanId}
    //     tenanName={tenanName}
    //     setTenanName={setTenanName}
    //     setSection={setSection}
    //     startAnimation={startAnimation}
    //   />
    // ),
    register: (
      <RegisterSection
        ref={sectionRef}
        setSection={setSection}
        startAnimation={startAnimation}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        areaCodeItem={areaCodeItem}
        setAreaCodeItem={setAreaCodeItem}
        setPassword={setPassword}
      />
    ),
    verify: (
      <VerifySection
        ref={sectionRef}
        setSection={setSection}
        startAnimation={startAnimation}
        email={email}
        phone={phone}
        areaCodeItem={areaCodeItem}
        password={password}
      />
    ),
    forgotPassword: (
      <ForgotPasswordSection
        ref={sectionRef}
        setSection={setSection}
        startAnimation={startAnimation}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        areaCodeItem={areaCodeItem}
        setAreaCodeItem={setAreaCodeItem}
      />
    ),
    forgotVerify: (
      <ForgotVerifySection
        ref={sectionRef}
        setSection={setSection}
        startAnimation={startAnimation}
        email={email}
        phone={phone}
        areaCodeItem={areaCodeItem}
        setValidateCode={setValidateCode}
      />
    ),
    resetPassword: (
      <ResetPasswordSection
        ref={sectionRef}
        setSection={setSection}
        startAnimation={startAnimation}
        email={email}
        phone={phone}
        areaCodeItem={areaCodeItem}
        validateCode={validateCode}
      />
    )
  }

  return (
    <Basiclayout scrollY style={{ paddingTop: 20 }}>
      <Header
        style={{
          zIndex: 100,
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: 'transparent'
        }}
        back={false}
        left={
          <>
            {section !== 'verify' && section !== 'login' ? (
              <View onPress={() => gobackHandler(null)}>
                <Icon name="fanhui" size={36} />
              </View>
            ) : null}
          </>
        }
        right={<Iconfont name="geren-yuyan" size={30} />}
      />

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%'
          // transform: [{ translateY: coverMov }]
        }}
      >
        <img
          src="/images/login-bg.png"
          style={{
            width: '100%',
            height: 188,
            borderTopRightRadius: 6,
            borderTopLeftRadius: 6,
            overflow: 'hidden'
          }}
        />
      </View>
      {section && (
        <View
          style={{
            // flex: 1,
            height: screenSize.height,
            paddingLeft: 14,
            paddingRight: 14,
            marginTop: 10,
            position: 'relative'
          }}
        >
          <View
            style={
              {
                // transform: { translateY: coverMov }
              }
            }
            className={cn('mt-6 px-2 flex flex-col items-start gap-2 bg-transparent')}
          >
            <img
              style={{
                width: 192,
                height: 54,
                left: -12
              }}
              src={ENV.webapp.textLogo}
            />
            {/* <View style={{ display: section === 'server' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Server Title')}
              </Text>
            </View> */}
            <View style={{ display: section === 'login' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Customer NO Title', { server: tenanName })}
              </Text>
            </View>
            <View style={{ display: section === 'register' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Register new account')}
              </Text>
            </View>
            <View style={{ display: section === 'verify' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Verification Code')}
              </Text>
            </View>
            <View style={{ display: section === 'forgotPassword' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Reset password')}
              </Text>
            </View>

            <View style={{ display: section === 'forgotVerify' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Verification Code')}
              </Text>
            </View>
            <View style={{ display: section === 'resetPassword' ? 'flex' : 'none' }}>
              <Text size="xl" color="primary" className={cn('font-bold')}>
                {t('pages.login.Reset password')}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 32,
              /** 主體內容左右邊距 */
              marginLeft: 8,
              marginRight: 8,
              flex: 1
              // transform: [{ translateY: coverMov }]
            }}
          >
            {sections?.[section] ?? null}
          </View>
        </View>
      )}
      <View className={cn('w-full items-center mb-1 text-center flex justify-center')}>
        <Text color="weak" size="sm">
          {capitalizeFirstLetter(ENV.name)} Ⓒ 2024Cookie Preferences
        </Text>
      </View>
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.01)'
          }}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Iconfont name="loading" size={36} color="white" />
          </View>
        </View>
      ) : null}
    </Basiclayout>
  )
}
