import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'

export const PrivacyPolicyService = () => {
  const i18n = useI18n()
  const { theme, cn } = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
      <Text style={{ fontSize: 12, color: theme.colors.textColor.secondary }}>{i18n.t('pages.login.clickRegister')}</Text>
      <View
        className={cn(' hover:opacity-80')}
        style={{ alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}
        onPress={async () => {
          // props.navigation.navigate('ForgotPasswordStep1')
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.textColor.primary }}>{i18n.t('pages.login.termsService')}</Text>
      </View>
      <Text style={{ fontSize: 12, color: theme.colors.textColor.secondary }}>{i18n.t('pages.login.and')}</Text>
      <View
        className={cn(' hover:opacity-80')}
        style={{ alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}
        onPress={async () => {
          // props.navigation.navigate('ForgotPasswordStep1')
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.textColor.primary }}>
          {i18n.t('pages.login.privacyPolicy')}
        </Text>
      </View>
    </View>
  )
}
