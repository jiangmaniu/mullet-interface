import { observer } from 'mobx-react'
import { useRef } from 'react'

import Button from '@/components/Base/Button'
import NavBar from '@/components/Base/NavBar'

import SheetModal from '../../components/Base/SheetModal'

function Trade() {
  const popupRef = useRef<any>(null)

  return (
    <div>
      <NavBar title="测试" right="右边" />
      <Button onClick={() => popupRef.current.show()}>交易页面</Button>
      <div className="text-primary">测试122</div>

      <SheetModal buttonBlock={false} trigger={<Button>sheetModal</Button>} header={<div className="text-left font-bold">1233</div>}>
        <div>测试sheetModal</div>
      </SheetModal>
    </div>
  )
}

export default observer(Trade)
