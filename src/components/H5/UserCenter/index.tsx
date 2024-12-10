import { observer } from 'mobx-react'
import { useRef } from 'react'

import SheetModal from '@/components/Base/BottomSheet'
import Button from '@/components/Base/Button'
import NavBar from '@/components/Base/NavBar'

function UserCenter() {
  const popupRef = useRef<any>(null)

  return (
    <div>
      <NavBar title="测试" right="右边" />
      <Button onClick={() => popupRef.current.show()}>个人中心</Button>

      <SheetModal buttonBlock={false} height={500} trigger={<Button>sheetModal</Button>} title="标题">
        <div>测试sheetModal</div>
      </SheetModal>
    </div>
  )
}

export default observer(UserCenter)
