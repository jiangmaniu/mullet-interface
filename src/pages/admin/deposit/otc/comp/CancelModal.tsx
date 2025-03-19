import { FormattedMessage, useSearchParams } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import Modal from '@/components/Admin/Modal'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'
import { cancelDepositOrder } from '@/services/api/wallet'
import { replace } from '@/utils/navigator'

type IProps = {
  id: string
}

function CancelModal({ id }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { theme } = useTheme()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const [visible, setVisible] = useState(false)

  const [query] = useSearchParams()

  const backUrl = query.get('backUrl') as string

  const back = () => {
    if (backUrl) {
      replace(backUrl)
    } else {
      replace('/deposit')
    }
  }

  const cancelOrder = () => {
    if (id) {
      cancelDepositOrder({ id: String(id) }).then((res) => {
        if (res.success) {
          back()
        }
      })
    }
  }

  return (
    <Modal
      width={430}
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary
        }
      }}
      contentStyle={{ padding: 18 }}
      renderTitle={() => (
        <div className="h-[100px] w-60 relative">
          <FormattedMessage id="mt.quxiaodingdan" />
          <img src="/img/quxiaodingdan.png" className="absolute top-0 right-0" width={102} height={102} />
        </div>
      )}
      footer={
        <div className="flex flex-row gap-2 justify-end">
          <Button type="primary" className="text-white !bg-red w-full" onClick={cancelOrder}>
            <FormattedMessage id="common.confirm" />
          </Button>
          <Button type="default" onClick={() => modalRef.current?.close()} className="w-full">
            <FormattedMessage id="common.zhanbu" />
          </Button>
        </div>
      }
      ref={modalRef}
    >
      <div className="text-sm text-secondary text-center bg-white w-full">
        <FormattedMessage id="mt.qingquebaoninbinweijinxingzhuanzhang" />
        <br />
        <FormattedMessage id="mt.duociquxiao" />
      </div>
    </Modal>
  )
}

export default forwardRef(CancelModal)
