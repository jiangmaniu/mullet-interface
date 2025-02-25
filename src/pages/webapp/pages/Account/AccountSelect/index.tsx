import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'

import { AccoutList } from '@/pages/webapp/components/Account/AccoutList'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useLocation, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useState } from 'react'

function AccountSelect() {
  const ENV = getEnv()
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { global } = useStores()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const back = params?.get('back') === 'true' ? true : false
  const key = params?.get('key') ?? 'REAL'
  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>(key as 'REAL' | 'DEMO') //  真实账户、模拟账户

  return (
    <Basiclayout
      fixedHeight
      scrollY
      style={{ paddingLeft: 14, paddingRight: 14, paddingBottom: 80 }}
      footerClassName="flex items-center justify-center"
      footer={
        <>
          {!ENV.HIDE_CREATE_ACCOUNT && (
            <Button
              style={{
                width: 46,
                height: 46,
                borderRadius: 46,
                marginBottom: 20,
                backgroundColor: theme.colors.backgroundColor.primary
              }}
              onPress={() => {
                navigateTo('/app/account/create?key=' + accountTabActiveKey + '&back=' + back)

                // navigate('AccountNew', {
                //   key: accountTabActiveKey,
                //   back
                // })
              }}
            >
              <div className="flex items-center justify-center">
                <Iconfont name="xinjianzhanghu" size={30} />
              </div>
            </Button>
          )}
        </>
      }
      header={
        <Header
          back={back}
          // wrapperStyle={{
          //   zIndex: 100,
          //   backgroundColor: 'transparent'
          // }}
          // back={back}
        />
      }
    >
      <View style={cn('mb-4 mt-5')}>
        <Text size="22" font="pf-bold">
          {t('pages.account.Select Account')}
        </Text>
      </View>
      <View style={cn('flex flex-row items-center gap-1 mb-7')}>
        <img
          src={'/platform/img/logo-small.png'}
          style={{ width: 32, height: 32, backgroundColor: theme.colors.backgroundColor.secondary, borderRadius: 100 }}
        />
        <View style={cn('flex flex-col')}>
          <Text size="lg" font="pf-bold">
            {ENV.name}
          </Text>
        </View>
      </View>
      <AccoutList
        // back={back}
        accountTabActiveKey={accountTabActiveKey}
        setAccountTabActiveKey={setAccountTabActiveKey}
      />
    </Basiclayout>
  )
}

export default observer(AccountSelect)
