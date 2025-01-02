import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'

export const PrivacyPolicyService = ({ isPC = false }: { isPC?: boolean }) => {
  const i18n = useI18n()
  const { theme } = useTheme()
  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}
    >
      <Text style={{ fontSize: isPC ? 14 : 12, color: theme.colors.textColor.secondary }}>{i18n.t('pages.login.clickRegister')}</Text>
      <View
        style={{ alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}
        onPress={async () => {
          // props.navigation.navigate('ForgotPasswordStep1')
        }}
      >
        <Text
          style={{ fontSize: isPC ? 14 : 12, fontWeight: '600', color: theme.colors.textColor.primary }}
          onClick={() => {
            // window.open(ENV.ServiceTerm, '_blank')
            navigateTo('/app/viewer/markdown', {
              title: i18n.t('pages.login.termsService'),
              markdownFilePath: '/platform/lynfoo/docs/serviceTerm.md'
            })
          }}
        >
          {i18n.t('pages.login.termsService')}
        </Text>
      </View>
      <Text style={{ fontSize: isPC ? 14 : 12, color: theme.colors.textColor.secondary }}>{i18n.t('pages.login.and')}</Text>
      <View
        style={{ alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}
        onPress={async () => {
          // props.navigation.navigate('ForgotPasswordStep1')
        }}
      >
        <Text
          style={{ fontSize: isPC ? 14 : 12, fontWeight: '600', color: theme.colors.textColor.primary }}
          onClick={() => {
            // window.open(ENV.PrivacyAgreement, '_blank')
            navigateTo('/app/viewer/markdown', {
              title: i18n.t('pages.login.privacyPolicy'),
              markdownFilePath: '/platform/lynfoo/docs/privacyAgreement.md'
            })
          }}
        >
          {i18n.t('pages.login.privacyPolicy')}
        </Text>
      </View>
    </View>
  )
}
