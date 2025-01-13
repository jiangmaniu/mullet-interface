import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { observer } from 'mobx-react'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import useIsFocused from '../../hooks/useIsFocused'
import Basiclayout from '../../layouts/BasicLayout'
import AccountHeader from './comp/AccountHeader'
import PositionList from './comp/PositionList'

const Position = () => {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade, ws } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const isFocused = useIsFocused()

  return (
    <Basiclayout bgColor="secondary" headerColor={currentAccountInfo.isSimulate ? '#FFDDD4' : theme.colors.backgroundColor.secondary}>
      {currentAccountInfo.isSimulate && (
        <View
          style={{
            height: 139,
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            background: 'linear-gradient(180deg, #FFDDD4 0%, rgba(248,249,249,0) 100%)'
          }}
        />
      )}
      <View className={cn('relative z-[1]')}>
        <View className="mx-4 py-[9px]">
          <Text size="xl" weight="medium" color="primary">
            {t('app.pageTitle.Position')}
          </Text>
        </View>
        <AccountHeader />
        {/* 持倉或掛單列表 */}
        <View className={cn('mt-1')}>{isFocused && currentAccountInfo && <PositionList />}</View>
      </View>
    </Basiclayout>
  )
}

export default observer(Position)
