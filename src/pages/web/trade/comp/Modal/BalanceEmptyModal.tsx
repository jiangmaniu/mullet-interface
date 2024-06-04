import { CloseOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'

import Button from '@/components/Base/Button'
import Modal from '@/components/Base/Modal'
import Popup from '@/components/Base/Popup'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'

// 余额不足提示
export default observer((props, ref) => {
  const { global } = useStores()
  const { isPc } = useEnv()
  const { lng } = useLang()

  const close = () => {
    global.showBalanceEmptyModal = false
  }

  const renderContent = () => {
    return (
      <>
        <div className="relative -top-9 flex flex-col items-center justify-center px-4">
          <div className="text-lg font-bold text-gray">
            <FormattedMessage id="mt.zijinbuzu" />
          </div>
          <div className="pt-5 text-sm text-gray">
            <FormattedMessage id="mt.nidezijinbuzuqingrujin" />
          </div>
        </div>
        <div
          className="relative -top-4 mx-5"
          onClick={() => {
            //  @TODO 跳转入金
            close()
          }}
        >
          <Button block onClick={close} type="primary">
            <FormattedMessage id="mt.qurujin" />
          </Button>
        </div>
      </>
    )
  }

  const titleDom = (
    <div
      className="flex flex-col items-center justify-center bg-no-repeat pt-3"
      style={{ backgroundImage: 'url(/img/header-bg-mask.png)', backgroundSize: '300px auto' }}
    >
      <img src="/img/yuebuzu.png" width={121} height={121} alt="" />
    </div>
  )

  return (
    <SwitchPcOrWapLayout
      pcComponent={
        <Modal
          open={global.showBalanceEmptyModal}
          styles={{
            header: {
              background: 'var(--card-gradient-header-bg)',
              height: 150
            },
            content: { padding: 0 }
          }}
          title={titleDom}
          footer={null}
          width={lng === 'zh-TW' ? 430 : 440}
          centered
          onClose={close}
        >
          {renderContent()}
        </Modal>
      }
      wapComponent={
        <Popup
          open={global.showBalanceEmptyModal}
          renderHeader={
            <div style={{ background: 'var(--card-gradient-header-bg)', height: 150, borderRadius: 16 }}>
              <CloseOutlined
                style={{ color: 'var(--color-text-primary)', background: 'rgba(216, 216, 216, .2)' }}
                onClick={close}
                className="absolute right-3 top-4 mr-3 rounded-full p-[6px] text-sm"
              />
              {titleDom}
            </div>
          }
          contentStyle={{ paddingBottom: 30 }}
          position="bottom"
          onClose={close}
        >
          {renderContent()}
        </Popup>
      }
    />
  )
})
