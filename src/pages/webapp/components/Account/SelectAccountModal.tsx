import { useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'

import ENV from '@/env'
import { navigateTo } from '../../utils/navigator'
import SheetModal, { SheetRef } from '../Base/SheetModal'
import { Text } from '../Base/Text'
import { View } from '../Base/View'
import { AccoutList, DefaultAccountTabbar } from './AccoutList'

type IProps = {
  isSimulate?: boolean
  header?: React.ReactNode
  onItem?: (item?: User.AccountItem) => void
  isRemainAtCurrentPage?: boolean
}

export type SelectAccountModalRef = {
  show: (onItem?: (item?: User.AccountItem) => void) => void
  close: () => void
}

/** 选择账户弹窗 */
function SelectAccountModal({ isSimulate, header, onItem, isRemainAtCurrentPage }: IProps, ref: ForwardedRef<SelectAccountModalRef>) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const [accountTabActiveKey, setAccountTabActiveKey] = useState<'REAL' | 'DEMO'>('REAL')

  const accountListLen = currentUser?.accountList?.length || 0

  return (
    <SheetModal
      hiddenFooter
      height={accountListLen >= 5 ? '90%' : '80%'}
      ref={bottomSheetModalRef}
      header={
        <>
          {header ? (
            header
          ) : (
            <View className={cn('mx-5 mb-3')}>
              <View className={cn('items-center flex-row w-full justify-between')}>
                <Text className={cn('text-[22px] leading-7')} weight="medium">
                  {intl.formatMessage({ id: 'pages.trade.Account Title' })}
                </Text>
                <span
                  onClick={() => {
                    navigateTo('/app/account/create', {
                      key: accountTabActiveKey
                    })
                    bottomSheetModalRef.current?.sheet?.dismiss()
                  }}
                >
                  <Iconfont name="xinjianzhanghu" size={30} />
                </span>
              </View>
              <View className={cn('flex flex-row items-center gap-1 mb-2 mt-3')}>
                <img
                  src={ENV.webapp.smallLogo}
                  style={{ width: 32, height: 32, backgroundColor: theme.colors.backgroundColor.secondary, borderRadius: 100 }}
                />
                <View className={cn('flex flex-col')}>
                  <Text size="lg" weight="medium">
                    {ENV.name}
                  </Text>
                </View>
              </View>
              <View>
                <DefaultAccountTabbar accountTabActiveKey={accountTabActiveKey} setAccountTabActiveKey={setAccountTabActiveKey} />
              </View>
            </View>
          )}
        </>
      }
      children={
        <View className={cn('flex-1')}>
          <View className={cn('flex-1 mx-3 pb-10')}>
            <AccoutList
              isSimulate={isSimulate}
              accountTabActiveKey={accountTabActiveKey}
              setAccountTabActiveKey={setAccountTabActiveKey}
              onChange={() => {
                bottomSheetModalRef.current?.sheet?.dismiss()
              }}
              onItem={onItem}
              isRemainAtCurrentPage={isRemainAtCurrentPage}
              showDefaultAccountTabbar={false}
            />
          </View>
        </View>
      }
    />
  )
}

export default observer(forwardRef(SelectAccountModal))
