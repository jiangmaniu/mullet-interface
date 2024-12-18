import type { ReactElement } from 'react'
import { useMemo, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'

import { useEnv } from '@/context/envProvider'
import Header from '../../components/Base/Header'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import Basiclayout from '../../layouts/BasicLayout'
import { LoginSection } from './LoginSection'

export const FOOTER_BOTTOM = 100

export type WELCOME_STEP_TYPES =
  | 'login'
  | 'server'
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

export default function WelcomeScreen({}) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  // const route = useRoute()
  // const _section = route.params?.section

  // TODO: 缓存
  // const current = useCurrentAccount()

  // const [section, setSection] = useState<WELCOME_STEP_TYPES>(_section ?? 'server')

  const [section, setSection] = useState<WELCOME_STEP_TYPES>('login')
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [areaCodeItem, setAreaCodeItem] = useState<Common.AreaCodeItem>()
  const [password, setPassword] = useState<string>()
  const [validateCode, setValidateCode] = useState<string>()

  const sectionRef = useRef<TypeSection | null>(null)

  const actions = [
    { key: 'en-US', text: t('common.language.en-US') },
    { key: 'zh-TW', text: t('common.language.zh-TW') }
  ]

  const sections = {
    login: <LoginSection ref={sectionRef} setSection={setSection} />
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
    // register: (
    //   <RegisterSection
    //     ref={sectionRef}
    //     setSection={setSection}
    //     startAnimation={startAnimation}
    //     email={email}
    //     setEmail={setEmail}
    //     phone={phone}
    //     setPhone={setPhone}
    //     areaCodeItem={areaCodeItem}
    //     setAreaCodeItem={setAreaCodeItem}
    //     setPassword={setPassword}
    //   />
    // ),
    // verify: (
    //   <VerifySection
    //     ref={sectionRef}
    //     setSection={setSection}
    //     startAnimation={startAnimation}
    //     email={email}
    //     phone={phone}
    //     areaCodeItem={areaCodeItem}
    //     password={password}
    //   />
    // ),
    // forgotPassword: (
    //   <ForgotPasswordSection
    //     ref={sectionRef}
    //     setSection={setSection}
    //     startAnimation={startAnimation}
    //     email={email}
    //     setEmail={setEmail}
    //     phone={phone}
    //     setPhone={setPhone}
    //     areaCodeItem={areaCodeItem}
    //     setAreaCodeItem={setAreaCodeItem}
    //   />
    // ),
    // forgotVerify: (
    //   <ForgotVerifySection
    //     ref={sectionRef}
    //     setSection={setSection}
    //     startAnimation={startAnimation}
    //     email={email}
    //     phone={phone}
    //     areaCodeItem={areaCodeItem}
    //     setValidateCode={setValidateCode}
    //   />
    // ),
    // resetPassword: (
    //   <ResetPasswordSection
    //     ref={sectionRef}
    //     setSection={setSection}
    //     startAnimation={startAnimation}
    //     email={email}
    //     phone={phone}
    //     areaCodeItem={areaCodeItem}
    //     validateCode={validateCode}
    //   />
    // )
  }

  const { screenSize } = useEnv()

  return (
    <Basiclayout>
      <Header
        back={false}
        // wrapperStyle={{
        //   zIndex: 100,
        //   paddingHorizontal: 14,
        //   backgroundColor: 'transparent'
        // }}
        // left={
        //   <>
        //     {section !== 'server' && section !== 'verify' ? (
        //       <TouchableOpacity onPress={gobackHandler}>
        //         <Icon name="fanhui" size={36} />
        //       </TouchableOpacity>
        //     ) : null}
        //   </>
        // }
        // right={
        //   <Tooltip.Menu key={locale} actions={actions} placement="bottom-start" onAction={(node) => loadLocale(node.key as string)}>
        //     <Text>
        //       <Icon name="geren-yuyan" size={30} />
        //     </Text>
        //   </Tooltip.Menu>
        // }
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
            flex: 1,
            height: screenSize.height,
            paddingLeft: 14,
            paddingRight: 14,
            marginTop: 10,
            position: 'relative'
          }}
        >
          <View className={cn('mt-6 px-2 flex flex-col items-start gap-2 bg-transparent')}>
            <img
              style={{
                width: 192,
                height: 54,
                left: -12
              }}
              src="/images/stellux-logo.png"
            />
            <View className={cn(section === 'server' ? 'flex' : 'none')}>
              <Text size="xl" color="primary" style={cn('font-bold')}>
                {t('pages.login.Server Title')}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 32,
              /** 主體內容左右邊距 */
              // marginHorizontal: 8,
              flex: 1
              // transform: [{ translateY: coverMov }]
            }}
          >
            {/* @ts-ignore */}
            {useMemo(() => sections[section], [section])}
          </View>
        </View>
      )}
      <View className={cn('w-full items-center mb-1')}>
        <Text color="weak" size="sm">
          Stellux Ⓒ 2024Cookie Preferences
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
          {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            loading
          </View> */}
        </View>
      ) : null}
    </Basiclayout>
  )
}
