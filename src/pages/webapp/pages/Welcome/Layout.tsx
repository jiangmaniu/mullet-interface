import type { ReactElement } from 'react'

import { useTheme } from '@/context/themeProvider'

import { useEnv } from '@/context/envProvider'
import Header from '../../components/Base/Header'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import Basiclayout from '../../layouts/BasicLayout'

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

export default function Layout({ section }: { section: ReactElement }) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const { screenSize } = useEnv()

  return (
    <Basiclayout>
      <Header back={false} />

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%'
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
          {/* <View className={cn(section === 'server' ? 'flex' : 'none')}>
            <Text size="xl" color="primary" style={cn('font-bold')}>
              {t('pages.login.Server Title')}
            </Text>
          </View> */}
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
          {section}
        </View>
      </View>
      <View className={cn('w-full items-center mb-1')}>
        <Text color="weak" size="sm">
          Stellux Ⓒ 2024Cookie Preferences
        </Text>
      </View>
    </Basiclayout>
  )
}
