import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Modal from '@/components/Base/Modal'
import { useStores } from '@/context/mobxProvider'

import LevelAge from './LevelAge'

type IProps = {
  trigger: JSX.Element
}

function LevelAgeModal({ trigger }: IProps) {
  const { trade } = useStores()
  const modalRef = useRef<any>()
  const [current, setCurrent] = useState(0)

  return (
    <Modal
      trigger={trigger}
      styles={{
        content: { padding: 0 }
      }}
      footer={null}
      width={410}
      centered
      ref={modalRef}
      maskClosable={false}
    >
      <img src="/img/mask2.png" className="absolute right-[67px] top-[22px] h-[252px] w-[294px] z-[3]" />
      <div className="absolute w-full top-0 z-[2] h-[242px] rounded-[10px]" style={{ background: 'var(--card-gradient-header-bg)' }}></div>
      <div className="px-[18px] pb-4 relative z-10">
        <div className="flex items-center justify-center">
          <img src={'/img/levelage.png'} width={121} height={121} alt="" />
        </div>
        <div className="relative -top-1 flex flex-col items-center justify-center px-4">
          <div className="text-base text-primary font-semibold">
            <FormattedMessage id="mt.tiaozhengganggan" />
          </div>
        </div>

        <div className="relative">
          <div className="p-4">
            <LevelAge
              onChange={(value) => {
                setCurrent(value)
              }}
            />
            <div className="pt-5">
              <div className="pb-[7px]">
                <img src="/img/lingxing-1.png" width={8} height={8} />
                <span className="text-xs text-secondary pl-[5px]">
                  <FormattedMessage id="mt.tiaozhengganggantip1" />
                </span>
              </div>
              <div className="text-xs text-secondary pb-[7px]">
                <img src="/img/lingxing-1.png" width={8} height={8} />
                <span className="text-xs text-secondary pl-[5px]">
                  <FormattedMessage id="mt.tiaozhengganggantip2" />
                </span>
              </div>
              <div className="">
                <img src="/img/lingxing-2.png" width={8} height={8} />
                <span className="text-xs text-primary pl-[5px]">
                  <FormattedMessage id="mt.tiaozhengganggantip3" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button
          type="primary"
          block
          onClick={() => {
            modalRef?.current?.close()
            // @ts-ignore
            trade.setLeverageMultiple(current)
          }}
        >
          <FormattedMessage id="common.queren" />
        </Button>
      </div>
    </Modal>
  )
}

export default observer(LevelAgeModal)
