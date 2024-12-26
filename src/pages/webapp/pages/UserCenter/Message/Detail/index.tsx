import Loading from '@/components/Base/Loading'
import { useTheme } from '@/context/themeProvider'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { useParams } from '@umijs/max'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect } from 'react'
import MessageStore from '../MessageStore'

function MessageDetail() {
  const i18n = useI18n()
  const { theme, cn } = useTheme()
  const { info, getInfo, infoLoading } = useLocalObservable(() => MessageStore)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      getInfo({ id })
    }
  }, [id])

  return (
    <Basiclayout bgColor="secondary" headerColor={theme.colors.backgroundColor.secondary}>
      <Header title={i18n.t('app.pageTitle.Message')} back />
      <Loading loading={infoLoading} className="mt-[100px]">
        <View className={cn('px-3 mt-3 flex flex-col')}>
          <Text size="xl" color="primary" leading="3xl" weight="semibold">
            {info.title}
          </Text>
          <Text size="xs" color="secondary" className={cn('my-3')}>
            {info.createTime}
          </Text>
          <Text size="sm" color="secondary">
            {info.content}
          </Text>
        </View>
      </Loading>
    </Basiclayout>
  )
}

export default observer(MessageDetail)
