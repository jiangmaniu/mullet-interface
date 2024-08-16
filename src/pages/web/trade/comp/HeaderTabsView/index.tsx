import { useModel } from '@umijs/max'
import { Tabs } from 'antd-mobile'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import useClickOutside from '@/hooks/useOnClickOutside'
import { getPathname } from '@/utils/navigator'

import Sidebar from '../Sidebar'
import styles from './styles.less'

function HeaderTabsView() {
  const { global, trade } = useStores()
  const { lng } = useLang()

  const activeKey = trade.activeSymbolName
  const [showSidebar, setShowSidebar] = useState(false)
  const sidebarRef = useRef(null)
  const { openTradeSidebar } = useModel('global')

  const setActiveKey = (newActiveKey: string) => {
    trade.setActiveSymbolName(newActiveKey)
  }

  useClickOutside([sidebarRef], () => {
    setShowSidebar(false)
  })

  const extraWidth = {
    'zh-TW': '920px',
    'en-US': '900px'
  }[lng]

  if (getPathname() !== '/trade') {
    return null
  }

  return (
    <div className={styles.header_view_tabs}>
      <div className="flex items-center" style={{ width: `calc(100vw - ${extraWidth} + ${!openTradeSidebar ? '60px' : '0px'})` }}>
        <Tabs style={{ '--active-line-height': '0px' }} activeKey={activeKey}>
          {trade.openSymbolNameList?.map((item, idx) => {
            const symbol = item.symbol
            return (
              <Tabs.Tab
                key={item.symbol}
                style={{ marginRight: 0, paddingBottom: 0 }}
                title={
                  <div
                    className={classNames(
                      'flex cursor-pointer items-center justify-center rounded-t-[6px] border-x  bg-white p-2',
                      idx > 0 ? '!border-l-0' : '',
                      activeKey === symbol ? 'border-t-[4px] border-x-gray-60 border-t-blue-600' : 'border-t border-gray-60'
                    )}
                    onClick={() => {
                      setActiveKey(symbol)
                    }}
                  >
                    <SymbolIcon src={item.imgUrl} width={28} height={28} />
                    <span className="select-none px-2 text-base font-semibold text-primary">{symbol}</span>
                    {trade.openSymbolNameList.length > 1 && (
                      <img
                        width={20}
                        height={20}
                        alt=""
                        src="/img/close-icon.png"
                        className="hover:rounded-xl hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          trade.removeOpenSymbolNameList(symbol, idx)
                        }}
                      />
                    )}
                  </div>
                }
              />
            )
          })}
        </Tabs>
        <div className="group relative" onClick={() => setShowSidebar(true)} ref={sidebarRef}>
          <div className="add-btn mt-5 flex cursor-pointer rounded-tr-[4px] border-r border-t border-gray-60 p-[6px]">
            <img width={32} height={32} alt="" src="/img/add-icon.png" />
          </div>
          <div
            className="absolute -left-[1px] top-[58px] rounded-b-xl rounded-tr-xl border-x border-b border-[#f3f3f3] bg-white"
            style={{ boxShadow: '0px 2px 10px 10px rgba(227, 227, 227, 0.1)', display: showSidebar ? 'block' : 'none' }}
          >
            <Sidebar style={{ minWidth: 400 }} showFixSidebar={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(HeaderTabsView)
