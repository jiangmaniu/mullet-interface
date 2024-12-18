import { useEffect } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { mergeCss } from '@/pages/webapp/utils'

const styles = {
  tipsItem: {
    flex: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  tipsItemText: {
    lineHeight: 16,
    fontSize: 12
  }
}

const PasswordTips = (props: any) => {
  const { pwd } = props
  const { theme, cn } = useTheme()
  const i18n = useI18n()

  const regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*[\S])(?=.*[^ ]).{8,16}$/
  // 包含数字
  const regex1 = /(?=.*[0-9])/
  // 密码长度为8-16位
  const regex2 = /^.{8,16}$/
  // 包含大小写父母
  const regex3 = /(?=.*[A-Z])(?=.*[a-z])/
  // 包含特殊字符
  const regex4 = /(?=.*[\W_])(?=.*[\S])(?=.*[^ ])/
  const flag1 = regex1.test(pwd)
  const flag2 = regex2.test(pwd)
  const flag3 = regex3.test(pwd)
  const flag4 = regex4.test(pwd)
  const isDisabled = flag1 && flag2 && flag3 && flag4
  useEffect(() => {
    props.setDisabledCallBack && props.setDisabledCallBack(!isDisabled)
  }, [isDisabled])
  return (
    <View style={{ paddingLeft: 6, marginTop: 11 }}>
      <Text>{i18n.t('pages.login.yourPasswordMustContain')}</Text>
      <View style={{ marginTop: 14 }}>
        <View style={styles.tipsItem}>
          <View style={cn(' w-4 h-4 rounded-full  flex items-center justify-center', flag1 ? 'bg-green' : 'bg-gray-200')}>
            <Iconfont name="danchuang-xuanzhong" size={14} color={flag1 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
          </View>
          <Text style={mergeCss(styles.tipsItemText, { color: flag1 ? theme.colors.textColor.primary : theme.colors.textColor.weak })}>
            {i18n.t('pages.login.ContainsAtLeastOneNumber')}
          </Text>
        </View>
        <View style={styles.tipsItem}>
          <View style={cn(' w-4 h-4 rounded-full  flex items-center justify-center', flag2 ? 'bg-green' : 'bg-gray-200')}>
            <Iconfont name="danchuang-xuanzhong" size={14} color={flag2 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
          </View>
          <Text style={mergeCss(styles.tipsItemText, { color: flag2 ? theme.colors.textColor.primary : theme.colors.textColor.weak })}>
            {i18n.t('pages.login.passwordLengthIs')}
          </Text>
        </View>
        <View style={styles.tipsItem}>
          <View style={cn(' w-4 h-4 rounded-full  flex items-center justify-center', flag3 ? 'bg-green' : 'bg-gray-200')}>
            <Iconfont name="danchuang-xuanzhong" size={14} color={flag3 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
          </View>
          <Text style={mergeCss(styles.tipsItemText, { color: flag3 ? theme.colors.textColor.primary : theme.colors.textColor.weak })}>
            {i18n.t('pages.login.containsUppercase')}
          </Text>
        </View>
        <View style={styles.tipsItem}>
          <View style={cn(' w-4 h-4 rounded-full  flex items-center justify-center', flag4 ? 'bg-green' : 'bg-gray-200')}>
            <Iconfont name="danchuang-xuanzhong" size={14} color={flag4 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
          </View>
          <Text style={mergeCss(styles.tipsItemText, { color: flag4 ? theme.colors.textColor.primary : theme.colors.textColor.weak })}>
            {i18n.t('pages.login.containsAtLeast')}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PasswordTips
