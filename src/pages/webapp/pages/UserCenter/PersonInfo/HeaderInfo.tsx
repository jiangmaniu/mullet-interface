import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'

const HeaderInfo = () => {
  const { t } = useI18n()
  const { cn, theme } = useTheme()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  return (
    <View>
      <View style={cn('flex flex-row justify-between items-center w-full my-5')}>
        <View style={cn('flex flex-row items-center gap-1')}>
          {currentUser?.userInfo?.avatar ? (
            <img
              src={currentUser?.userInfo?.avatar}
              style={{ width: 44, height: 44, backgroundColor: theme.colors.backgroundColor.primary, borderRadius: 100 }}
            />
          ) : (
            <img
              src={'/platform/img/logo-small.png'}
              style={{ width: 44, height: 44, backgroundColor: theme.colors.backgroundColor.primary, borderRadius: 100 }}
            />
          )}
          <View style={cn('flex flex-col')}>
            <View style={cn('flex flex-row items-center')}>
              <Text size="lg" style={cn('font-semibold')}>
                {currentUser?.userInfo?.account}
              </Text>
            </View>
            <Text size="xs">
              {t('mt.zhuceriqi')}：{currentUser?.userInfo?.createTime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default observer(HeaderInfo)
