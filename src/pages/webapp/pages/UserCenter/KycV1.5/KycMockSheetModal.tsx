import { useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { useTheme } from '@/context/themeProvider'
import { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import BaseAuthorized from './BaseAuthorized'

type IProps = {
  trigger?: JSX.Element
  from?: 'Quote'
  afterClose?: () => void
}

export type ModalRef = {
  show: () => void
  close: () => void
  visible: boolean
}

const Children = observer(() => {
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth
  const isKycAuth = currentUser?.isKycAuth

  const status = useMemo(() => {
    // 不會出現待審核狀態
    if (isBaseAuth && !isKycAuth && kycStatus !== 'TODO' && kycStatus !== 'CANCEL' && kycStatus !== 'DISALLOW') {
      return 1 // 初级审核通过，待申请高级认证
    } else if (isBaseAuth && kycStatus === 'TODO') {
      return 2 // 初级审核通过，高级认证待审批
    } else if (isBaseAuth && kycStatus === 'DISALLOW') {
      return 3 // 初级审核已通过，高级认证不通过
    } else if (isBaseAuth && kycStatus === 'SUCCESS') {
      return 4 // 审核通过
    } else {
      return 0 // 初始
    }
  }, [kycStatus, isBaseAuth])

  const { cn } = useTheme()

  return (
    <View style={cn('flex-1')}>
      {status === 0 ? (
        <BaseAuthorized />
      ) : (
        <View>
          <Text>开发中</Text>
        </View>
      )}
    </View>
  )
})

/** 选择品种列表弹窗 */
function KycMockSheetModal({ trigger, from, afterClose }: IProps, ref: ForwardedRef<ModalRef>) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const bottomSheetModalRef = useRef<SheetRef>(null)

  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    },
    visible
  }))

  return (
    <View className={cn('flex-1 bg-white h-[900px]  rounded-t-3xl pt-[22px] px-5 ')}>
      <Children />
    </View>
  )
}

export default observer(forwardRef(KycMockSheetModal))
