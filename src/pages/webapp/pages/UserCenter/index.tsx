import { observer } from 'mobx-react'
import { useRef } from 'react'

import Button from '@/components/Base/Button'

import Header from '../../components/Base/Header'
import SheetModal, { SheetRef } from '../../components/Base/SheetModal'

function UserCenter() {
  const popupRef = useRef<SheetRef>(null)

  return (
    <div>
      <Header title="测试" right="右边" />
      <Button onClick={() => popupRef.current?.sheet.present()}>个人中心</Button>

      <SheetModal buttonBlock={false} ref={popupRef} height={500} trigger={<Button>sheetModal</Button>} title="标题">
        <div>测试sheetModal</div>
      </SheetModal>
    </div>
  )
}

export default observer(UserCenter)
